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
title, seconds, slogans, section = "", 9, [], None
# QR codes, top to bottom: script.md section -> image. The images are made once, see qr/README.md.
QR = {"QR code right, top": "qr/challenge-qr.svg",
      "QR code right, bottom": "qr/datasets-qr.svg"}
qr = {}
for line in open("script.md").read().splitlines():
    if line.startswith("## "):
        section = line[3:].strip()
    elif not line.strip():
        continue
    elif section == "Title":
        title = title or inline(line)
    elif section == "Seconds per slogan":
        seconds = float(line)
    elif section in QR:
        qr.setdefault(section, []).append(inline(line))
    elif section != "Slogans":
        continue
    elif line.startswith("- "):
        if line[2:].strip():
            slogans.append({"big": inline(line[2:]), "small": ""})
    elif line.startswith((" ", "\t")) and slogans:
        slogans[-1]["small"] = (slogans[-1]["small"] + " " + inline(line)).strip()
assert slogans, "no slogans found under '## Slogans' in script.md"

# Each QR code with its label above it; any further lines in small grey text.
qr_html = "".join(
    f'<div class="qr"><div class="label">{qr[s][0]}</div>'
    + "".join(f'<div class="url">{l}</div>' for l in qr[s][1:])
    + f'<img src="{data_uri(QR[s])}" alt=""></div>' for s in QR if s in qr)
if qr_html:
    qr_html = f'<div id="qrs">{qr_html}</div><script>document.body.classList.add("has-qr")</script>'

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
