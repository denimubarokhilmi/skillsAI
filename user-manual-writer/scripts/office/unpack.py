#!/usr/bin/env python3
"""Minimal DOCX unpacker: extracts ZIP and pretty-prints XML when possible."""
import argparse, zipfile
from pathlib import Path
from xml.dom import minidom

parser = argparse.ArgumentParser()
parser.add_argument('docx')
parser.add_argument('outdir')
args = parser.parse_args()

docx = Path(args.docx)
out = Path(args.outdir)
if not docx.exists() or docx.suffix.lower() != '.docx':
    raise SystemExit(f'Not a .docx file: {docx}')
out.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(docx) as z:
    z.extractall(out)
count = 0
for p in list(out.rglob('*.xml')) + list(out.rglob('*.rels')):
    try:
        raw = p.read_bytes()
        pretty = minidom.parseString(raw).toprettyxml(indent='  ', encoding='utf-8')
        p.write_bytes(pretty)
        count += 1
    except Exception:
        pass
print(f'Unpacked {docx} to {out} ({count} XML files formatted)')
