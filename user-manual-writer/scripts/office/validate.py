#!/usr/bin/env python3
"""Minimal DOCX validator: checks ZIP integrity, core XML well-formedness, and required parts."""
import argparse, sys, zipfile, tempfile, shutil
from pathlib import Path
from xml.etree import ElementTree as ET

REQUIRED = ['[Content_Types].xml', '_rels/.rels', 'word/document.xml']

parser = argparse.ArgumentParser()
parser.add_argument('path')
args = parser.parse_args()

path = Path(args.path)
cleanup = None
if path.is_file():
    if path.suffix.lower() != '.docx':
        print(f'FAIL: not a .docx file: {path}')
        sys.exit(1)
    try:
        tmp = Path(tempfile.mkdtemp())
        with zipfile.ZipFile(path) as z:
            bad = z.testzip()
            if bad:
                print(f'FAIL: corrupt zip member: {bad}')
                sys.exit(1)
            z.extractall(tmp)
        root = tmp
        cleanup = tmp
    except zipfile.BadZipFile:
        print('FAIL: invalid ZIP/DOCX')
        sys.exit(1)
elif path.is_dir():
    root = path
else:
    print(f'FAIL: missing path: {path}')
    sys.exit(1)

errors = []
for rel in REQUIRED:
    if not (root / rel).exists():
        errors.append(f'missing required part: {rel}')
for xml in list(root.rglob('*.xml')) + list(root.rglob('*.rels')):
    try:
        ET.parse(xml)
    except Exception as e:
        errors.append(f'malformed XML: {xml.relative_to(root)}: {e}')

if cleanup:
    shutil.rmtree(cleanup, ignore_errors=True)

if errors:
    print('FAIL: DOCX validation errors')
    for e in errors[:50]:
        print('- ' + e)
    sys.exit(1)
print('PASS: DOCX basic validation passed')
