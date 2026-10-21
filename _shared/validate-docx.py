#!/usr/bin/env python3
"""
validate-docx.py — Post-generation DOCX validator

Checks:
  1. TOC field          → w:instrText containing 'TOC' must exist
  2. Heading numbering  → H1/H2/H3 AFTER the TOC field must have w:numPr
                          (front-matter headings before TOC are exempt)
  3. Table header align → rows flagged w:tblHeader must have w:jc = center
  4. Empty headings     → ALL heading paragraphs must have non-empty text
  5. Table captions     → warn if tables exist without any caption

Usage:
  python validate-docx.py output.docx
  python validate-docx.py output.docx --strict
"""

import sys, zipfile, argparse
import xml.etree.ElementTree as ET

NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
W  = lambda tag: f'{{{NS}}}{tag}'
HEADING_STYLES = {'Heading1', 'Heading2', 'Heading3'}

def wval(el):
    return el.get(W('val'), '') if el is not None else ''

def para_style(p_el):
    pPr    = p_el.find(W('pPr'))
    pStyle = pPr.find(W('pStyle')) if pPr is not None else None
    return wval(pStyle)

def para_text(p_el):
    return ''.join((t.text or '') for t in p_el.iter(W('t')))

def has_instr(el, keyword):
    return any(keyword in (t.text or '') for t in el.iter(W('instrText')))

# ── flatten body to (tag, element, in_toc_sdt) preserving document order ──────
# in_toc_sdt=True  → element lives inside the same sdt block as the TOC field
#                    → always front-matter, exempt from numPr check regardless of order
def body_items(body):
    """Yield (kind, element, in_toc_sdt) for body children, expanding one sdt level."""
    for child in body:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag == 'sdt':
            content = child.find(W('sdtContent'))
            if content is not None:
                # flag every child of this sdt if it (or any sibling) contains TOC
                sdt_has_toc = has_instr(child, 'TOC')
                for sub in content:
                    stag = sub.tag.split('}')[-1] if '}' in sub.tag else sub.tag
                    yield stag, sub, sdt_has_toc
        else:
            yield tag, child, False


def validate(docx_path, strict=False):
    errors, warnings = [], []
    print(f'\n🔍  Validating: {docx_path}\n{"─"*52}')

    try:
        with zipfile.ZipFile(docx_path, 'r') as z:
            doc_xml = z.read('word/document.xml')
    except FileNotFoundError:
        print(f'❌  File not found: {docx_path}'); sys.exit(1)
    except KeyError:
        print('❌  word/document.xml missing'); sys.exit(1)

    root = ET.fromstring(doc_xml)
    body = root.find(f'.//{W("body")}')

    # ── CHECK 1: TOC field ────────────────────────────────
    toc_fields = [t for t in root.iter(W('instrText')) if 'TOC' in (t.text or '')]
    if toc_fields:
        print(f'✅  TOC          : {len(toc_fields)} field(s) found')
    else:
        errors.append('TOC: No TOC field found — add e.tocSection() to your document')

    # ── Two-pass: collect flat item list, find TOC position ──────────────────
    # toc_item_index = the index of the LAST top-level item (post sdt-expansion)
    # that itself contains a TOC instrText.  Every item at index <= that is
    # front-matter.  Items flagged in_toc_sdt are also always front-matter.
    all_items = list(body_items(body))   # list of (kind, el, in_toc_sdt)

    toc_item_index = -1
    for idx, (kind, el, in_toc_sdt) in enumerate(all_items):
        if in_toc_sdt or has_instr(el, 'TOC'):
            toc_item_index = idx   # keep updating — use the LAST occurrence

    # ── Walk body in order ────────────────────────────────
    past_toc       = False
    total_headings = 0
    unnumbered     = []
    empty_headings = []
    caption_count  = 0
    table_count    = 0
    bad_cells      = []

    for idx, (kind, el, in_toc_sdt) in enumerate(all_items):

        # flip past_toc the first item AFTER the TOC block ends
        if not past_toc and toc_item_index >= 0 and idx > toc_item_index:
            past_toc = True

        # ── paragraph ────────────────────────────────────
        if kind == 'p':
            style = para_style(el)
            text  = para_text(el).strip()

            if style in HEADING_STYLES:
                total_headings += 1

                # Empty check (ALL headings, including front-matter)
                if not text:
                    empty_headings.append(style)

                # Numbering check — ONLY for body headings (after TOC)
                # Also exempt headings that live inside the TOC sdt block
                if past_toc and not in_toc_sdt:
                    pPr   = el.find(W('pPr'))
                    numPr = pPr.find(W('numPr')) if pPr is not None else None
                    if numPr is None:
                        unnumbered.append(f'  {style}: "{text[:60]}"')

            elif style == 'Caption':
                caption_count += 1

        # ── table ────────────────────────────────────────
        elif kind == 'tbl':
            table_count += 1
            rows = el.findall(W('tr'))
            if not rows:
                continue

            first_row = rows[0]
            trPr      = first_row.find(W('trPr'))
            is_header = trPr is not None and trPr.find(W('tblHeader')) is not None
            if not is_header:
                continue   # cover/borderless tables without explicit tblHeader → skip

            for ci, cell in enumerate(first_row.findall(W('tc'))):
                for cp in cell.findall(f'.//{W("p")}'):
                    cpPr = cp.find(W('pPr'))
                    jc   = cpPr.find(W('jc')) if cpPr is not None else None
                    val  = wval(jc) if jc is not None else 'left'
                    if val != 'center':
                        bad_cells.append(f'  Table #{table_count} cell {ci+1}: align={val!r} (expected center)')

    # ── Emit results ──────────────────────────────────────
    if total_headings == 0:
        warnings.append('HEADINGS: No heading paragraphs found')
    else:
        print(f'✅  Headings     : {total_headings} total (front-matter exempt from numbering)')

    if unnumbered:
        errors.append(
            f'HEADING NUMBERING: {len(unnumbered)} body heading(s) missing w:numPr\n'
            + '\n'.join(unnumbered)
            + '\n  → Use e.h(level, text) for body headings; e.h0() is front-matter only'
        )
    elif total_headings > 0:
        print(f'✅  Numbering    : All body headings have w:numPr')

    if empty_headings:
        errors.append(f'EMPTY HEADINGS: {len(empty_headings)} heading(s) with no text: {empty_headings}')
    elif total_headings > 0:
        print(f'✅  Empty heads  : None')

    if bad_cells:
        errors.append('TABLE HEADER ALIGNMENT:\n' + '\n'.join(bad_cells))
    else:
        print(f'✅  Table headers: {table_count} table(s) — header cells all centered')

    if table_count > 0 and caption_count == 0:
        warnings.append(
            f'CAPTIONS: {table_count} table(s) but 0 captions — '
            'add e.tblCaption("title") before each table'
        )
    elif table_count > 0:
        print(f'✅  Captions     : {caption_count} caption(s) for {table_count} table(s)')

    # ── Summary ───────────────────────────────────────────
    print(f'\n{"─"*52}')
    all_ok = not errors and not warnings
    if all_ok:
        print('✅  PASSED — All checks passed\n'); return True

    for w in warnings:
        print(f'⚠️   WARNING: {w}')
    if errors:
        print()
        for err in errors:
            print(f'❌  ERROR: {err}\n')
        print(f'FAILED — {len(errors)} error(s), {len(warnings)} warning(s)\n')
        sys.exit(1)

    if strict:
        print(f'STRICT — {len(warnings)} warning(s) treated as errors\n'); sys.exit(1)
    print(f'PASSED WITH {len(warnings)} WARNING(S)\n')
    return True

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('docx')
    ap.add_argument('--strict', action='store_true')
    args = ap.parse_args()
    validate(args.docx, strict=args.strict)
