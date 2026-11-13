# QR codes

- `datasets-qr.svg`: https://github.com/MariaDB/mariadb-wikipedia-datasets
- `challenge-qr.svg`: https://hackjunction.app/participate/45/challenges/307

Made with [segno](https://pypi.org/project/segno/) (error correction H), and checked by decoding:

```python
import segno
segno.make(URL, error="h").save("NAME.svg", dark="#0b0d14", light="#ffffff", border=4, scale=10, xmldecl=False)
```
