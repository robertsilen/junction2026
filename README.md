# MariaDB booth screen — Junction 2026

A full-screen loop for the big screen at the MariaDB booth: the Wikipedia and MariaDB Server logos
with the title "MariaDB's Wikipedia challenge" at the top, the slogans below one at a time.

Open `public/index.html` in a browser and press **F** for full screen. It needs no network.

## Change the texts

Edit [`script.md`](script.md). On Cloudflare the page rebuilds itself on every push; locally run

```bash
python3 build.py
```

`build.py` puts `template.html`, the slogans in `script.md` and the logo files together into one
self-contained `public/index.html`.

## Logos

- MariaDB Server logotype: [MariaDB Foundation](https://github.com/MariaDB/.github), CC BY-SA 4.0.
- Wikipedia globe and wordmark: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wikipedia-logo-v2.svg).
  Trademarks of the Wikimedia Foundation, used here only to state that Wikipedia runs on MariaDB.
