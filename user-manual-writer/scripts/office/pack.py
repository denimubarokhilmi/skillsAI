#!/usr/bin/env python3
"""Minimal DOCX packer: zips an unpacked DOCX directory."""
import argparse, zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('indir')
parser.add_argument('outfile')
args = parser.parse_args()
indir = Path(args.indir)
out = Path(args.outfile)
if not indir.is_dir():
    raise SystemExit(f'Not a directory: {indir}')
out.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in indir.rglob('*'):
        if p.is_file():
            z.write(p, p.relative_to(indir))
print(f'Packed {indir} to {out}')
