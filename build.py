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


# script.md: the line under "## Title"; under "## Slogans", "- " starts a slogan and an indented
# line is its small text.
title, seconds, slogans, qr, section = "", 9, [], [], None
for line in open("script.md").read().splitlines():
    if line.startswith("## "):
        section = line[3:].strip()
    elif not line.strip():
        continue
    elif section == "Title":
        title = title or inline(line)
    elif section == "Seconds per slogan":
        seconds = float(line)
    elif section == "QR code":
        qr.append(inline(line))
    elif section != "Slogans":
        continue
    elif line.startswith("- "):
        if line[2:].strip():
            slogans.append({"big": inline(line[2:]), "small": ""})
    elif line.startswith((" ", "\t")) and slogans:
        slogans[-1]["small"] = (slogans[-1]["small"] + " " + inline(line)).strip()
assert slogans, "no slogans found under '## Slogans' in script.md"

# The QR code image is qr/datasets-qr.svg; script.md gives the label and the line under it.
qr_html = ""
if qr:
    qr_html = (f'<div id="qr"><img src="{data_uri("qr/datasets-qr.svg")}" alt="">'
               f'<div class="label">{qr[0]}</div>' + "".join(f'<div class="url">{l}</div>' for l in qr[1:]) + "</div>")

page = (open("template.html").read()
        .replace("%%QR%%", qr_html)
        .replace("%%TITLE%%", title)
        .replace("%%SECONDS%%", str(seconds))
        .replace("%%SCRIPT%%", json.dumps(slogans, ensure_ascii=False, indent=1))
        .replace("%%MARIADB_IMG%%", data_uri("mariaDBServerLogotype_light_transparent.svg"))
        .replace("%%WP_GLOBE%%", data_uri("Wikipedia-logo-v2.svg"))
        .replace("%%WP_WORD%%", data_uri("Wikipedia_wordmark.svg")))
assert "%%" not in page
os.makedirs("public", exist_ok=True)
open("public/index.html", "w").write(page)
print(f"public/index.html: {len(page) / 1000:.0f} kB — {len(slogans)} slogans")
