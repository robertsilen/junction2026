"""Build public/index.html from template.html, the slogans in script.md and the logo files, so the page
works without a network.

    python3 build.py
"""
import base64, html, json, os, re


def data_uri(path):
    return "data:image/svg+xml;base64," + base64.b64encode(open(path, "rb").read()).decode()


def inline(text):
    """Escape, then *words* become coral."""
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", html.escape(text.strip()))


# script.md: under "## Slogans", "- " starts a slogan and an indented line is its small text.
slogans, inside = [], False
for line in open("script.md").read().splitlines():
    if line.startswith("## "):
        inside = line[3:].strip() == "Slogans"
    elif not inside or not line.strip():
        continue
    elif line.startswith("- "):
        if line[2:].strip():
            slogans.append({"big": inline(line[2:]), "small": ""})
    elif line.startswith((" ", "\t")) and slogans:
        slogans[-1]["small"] = (slogans[-1]["small"] + " " + inline(line)).strip()
assert slogans, "no slogans found under '## Slogans' in script.md"

page = (open("template.html").read()
        .replace("%%SCRIPT%%", json.dumps(slogans, ensure_ascii=False, indent=1))
        .replace("%%MARIADB_IMG%%", data_uri("mariaDBServerLogotype_light_transparent.svg"))
        .replace("%%WP_GLOBE%%", data_uri("Wikipedia-logo-v2.svg"))
        .replace("%%WP_WORD%%", data_uri("Wikipedia_wordmark.svg")))
assert "%%" not in page
os.makedirs("public", exist_ok=True)
open("public/index.html", "w").write(page)
print(f"public/index.html: {len(page) / 1000:.0f} kB — {len(slogans)} slogans")
