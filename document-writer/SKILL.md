---
name: document-writer
description: Use when creating any formal document (reports, proposals, specs, manuals). General formatting and writing guidelines for professional documents.
---
# Document Writer

Use this skill for **business reports, project proposals, technical specs, memos, meeting minutes, research reports, policy documents, and any formal written document**. For user manuals, use `user-manual-writer` instead. For PRDs, use `prd-document-writer`.

## 1. Source & Validation Rules

Before writing, collect:
- Purpose and audience of document.
- Source material: brief, data, existing docs, screenshots.
- Any formatting or template constraints.
- Deadline, reviewer, distribution list.

If previous versions exist:
- Check revision history before writing new content.
- Do not copy stale info without validation.

## 2. Document Structure

### 2.1 Front Matter
- Cover/title page.
- Metadata table.
- Revision history (for multi-version docs).
- Table of contents for documents >3 pages.

### 2.2 Body
1. Executive summary / abstract.
2. Background / context.
3. Purpose and scope.
4. Main content.
5. Conclusion.
6. Recommendations / next steps.

### 2.3 Back Matter
- Appendices (data, calculations, supporting docs).
- Glossary.
- References / citations.

## 3. Heading Hierarchy

- H1 = major sections (`1. Executive Summary`).
- H2 = subsections (`1.1 Background`).
- H3 = sub-subsections (`1.1.1 Current State`).
- Never skip levels: H1 → H2, not H1 → H3.
- Each heading must have content beneath. No orphaned headings.
- Number headings consistently and sequentially.
- Prefix numbering belongs to headings only — not body paragraphs or lists.

## 4. Writing Style

- Formal tone, direct language.
- Active voice.
- Sentences 15–20 words average.
- One idea per paragraph.
- Same terminology throughout.
- Present tense for current states; past tense for completed actions.
- Do not use "please", "just", "simply", "of course".
- Use concrete data, not vague adjectives.

## 5. Paragraph & Spacing

- Body: 11 pt, Calibri/Arial, 1.15 line spacing.
- After paragraph: 6 pt space.
- Headings: bold, larger font, extra spacing before.
- Lists: bullet for unordered items, numbers for sequences.

## 6. Tables

- Header row: bold, navy/blue background, white text.
- Body: regular text, left-aligned for descriptions, centered for short/numeric.
- Zebra striping for tables >3 rows: light grey on even rows.
- All cells: vertical center alignment.
- Column widths proportional to content.


### 6.1 Caption Position

Semua tabel dan gambar wajib mengikuti:
- **Tabel**: konten tabel ditulis terlebih dahulu, kemudian baris caption **Tabel X. Judul Tabel** di bawahnya.
- **Gambar/Screenshot**: gambar disisipkan terlebih dahulu, kemudian baris caption **Gambar X. Judul Gambar** di bawahnya.
- Caption menggunakan format penomoran otomatis (Tabel 1, Tabel 2, ...).

## 7. Callouts

| Type | Usage | Background |
|---|---|---|
| NOTE | Additional context | Blue (#E6F2FF) |
| WARNING | Risk of data loss or security | Red (#FFF0F0) |
| CAUTION | Potential input error | Yellow (#FFF8E1) |
| TIP | Efficiency shortcut | Green (#E8F5E9) |

## 8. DOCX Formatting

- Font: Calibri or Arial.
- Heading 1: 20 pt, bold, navy (#1A3C6E).
- Heading 2: 15 pt, bold, blue (#2C5F9E).
- Heading 3: 12 pt, bold, accent (#3A7CBD).
- Body: 11 pt.
- Spacing: Before 6pt, After 6pt for body.
- Header/footer with doc title, date, page number.
- Page size: US Letter (12240 x 15840 DXA) or A4 (11906 x 16838 DXA).
- Margins: 1 inch all sides (1440 DXA).

### 8.1 Common Pitfalls

| Issue | Fix |
|---|---|
| Empty TOC on first open | Normal — click "Update Field" in Word. |
| Numbering continues across sections | Use unique reference per section. |
| Image exceeds margins | Cap width at 500 DXA (~3.5 inches). |


## Domain Workflows

### Academic Documents
Use for community-service proposals, scientific writing, article structure, academic language, citations, bibliography, template-based submissions, and completeness checks.

Collect:
- Template, rubric, or institutional format.
- Document type: proposal, article, report, or attachment set.
- Citation style and required references.
- Submission constraints and completeness checklist.

Output with numbered headings only; use separate ordered lists or domain IDs for body sequences.

### Software Testing Documents
Use for test plans, test cases, test steps, execution reports, Jira/Xray-aligned artifacts, usability-testing plans, and test documentation generated from feature requirements.

Collect:
- Feature scope, user stories, or system requirements.
- Artifact needed: plan, cases, steps, execution log, defect note, or usability plan.
- Test environment, roles, data prerequisites, and acceptance criteria.
- Required export format (Markdown, DOCX, CSV, Jira/Xray table).

Output with stable IDs such as `TC-001`, `FR-01`, or `Step 1`; do not encode test steps as heading hierarchy unless they are real headings.

## 9. Generation
### 9.1 Primary: `scripts/generate-docx.js`
Menggunakan shared engine `_shared/docx-engine.js`.

Edit bagian `DOC` (meta + body), lalu:

```bash
cd scripts && node generate-docx.js
```

Output: `output/dokumen.docx`

### 9.2 Available Helpers

| Helper | Fungsi |
|---|---|
| `e.h(level, text)` | Heading 1/2/3 dengan auto-numbering |
| `e.h0(level, text)` | Heading tanpa nomor (front matter) |
| `e.p(text)` | Paragraf |
| `e.bullet(text)` | Bullet point |
| `e.li(items)` | Ordered list (array of strings) |
| `e.tbl({headers, rows, columnDefs})` | Tabel profesional |
| `e.tblCaption(title)` | Caption tabel (di bawah) |
| `e.figCaption(title)` | Caption gambar (di bawah) |
| `e.cover(meta)` | Halaman sampul |
| `e.revisionHistory(revs)` | Riwayat revisi |
| `e.tocSection()` | Daftar Isi |
| `e.br()` | Page break |
| `e.sp()` | Spacer |
| `e.assemble(meta, body)` | Build Document |
| `e.save(doc, path)` | Simpan file |

### 9.3 Validation

```powershell
python C:\Users\LEGION\.codex\skills\_shared\validate-docx.py path\to\file.docx --strict
```

Completion rule: tidak boleh disebut final sebelum validator PASS.
## 10. QA Checklist

- [ ] Title/cover page exists.
- [ ] Revision history populated.
- [ ] TOC included for long docs.
- [ ] No empty headings.
- [ ] Consistent formatting throughout.
- [ ] Heading hierarchy correct.
- [ ] Spelling and grammar checked.
- [ ] Page numbers present.
- [ ] Tables formatted properly.
- [ ] Data/statistics verified.

---

## Shared DOCX Engine Requirement

All DOCX output for this skill must use:

- Engine: `C:\Users\LEGION\.codex\skills\_shared\docx-engine.js`
- Validator: `C:\Users\LEGION\.codex\skills\_shared\validate-docx.py`

Generation rule:

1. Define content data only in the skill-specific generator.
2. Use `require('../../_shared/docx-engine')`.
3. Use `e.h(level, text)` for all body headings.
4. Use `e.h0(level, text)` only for front matter before/inside TOC.
5. Use `e.tbl(...)` for all tables so header alignment and zebra style stay consistent.
6. Validate every generated `.docx` with:

```powershell
python C:\Users\LEGION\.codex\skills\_shared\validate-docx.py path\to\file.docx --strict
```

Completion rule: do not call a generated document final unless validator passes.


