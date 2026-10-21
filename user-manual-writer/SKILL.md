---
name: user-manual-writer
description: Create professional user manuals, product guides, and end-user documentation with validated UI workflows, table-based procedures, screenshots, troubleshooting, and consistent DOCX formatting.
---
# User Manual Writer

Use this skill for **user manuals, admin guides, product guides, operational guides, training handbooks, and end-user documentation**.

## 0. Non-Negotiable Rules

1. **Verify before writing.** Manual follows actual UI, routes, screenshots, and validation reports — not assumptions.
2. **User task first.** Organize by user goals, not code modules.
3. **Table procedures by default.** Use `No | Aksi Pengguna | Hasil Sistem` for step-by-step tasks.
4. **No fake controls.** Do not mention buttons, menu items, fields, shortcuts, or zoom controls unless verified.
5. **No removed features.** If user says a feature is removed, remove it from procedures and screenshots.
6. **One action per step.** Each step has one visible action and one expected system response.
7. **Same terms everywhere.** Menu and button labels must match UI exactly.
8. **Screenshot supports task.** Add screenshots only where they help the user confirm screen state.
9. **Final QA mandatory.** Check headings, TOC, section order, screenshots, and removed scope before delivery.

## 1. Source Priority

When sources conflict, use this order:

1. User's latest instruction.
2. Live UI / Playwright validation / screenshots.
3. Project source code: routes, controllers, views, migrations, seeders.
4. Existing validation reports.
5. Existing manuals/templates.
6. PRD or earlier design docs.

If old documents mention a removed feature, treat them as stale.

## 2. Required Workflow

### 2.1 Discovery

Collect:
- Product name and target role.
- Intended readers.
- Scope and out-of-scope features.
- Actual menu labels.
- Login credentials *only if user provides them*.
- Screenshots or route list if available.
- Validation output if available.

### 2.2 UI Validation

If product can run locally or remotely:
- Open each route in browser or Playwright.
- Capture screenshot for important screens.
- Record actual button labels and form fields.
- Record failed/hidden/removed features.
- Do not include failed features as normal procedures.

### 2.3 Content Drafting

Write content in this structure:
1. Cover page.
2. Document metadata.
3. Revision history.
4. Table of contents.
5. Introduction.
6. Document conventions.
7. System requirements.
8. Role/task overview.
9. Operational task sections.
10. Troubleshooting.
11. Glossary.
12. FAQ.
13. Screenshot appendix.

### 2.4 DOCX Generation & Validation

1. Edit `MANUAL` object in `scripts/generate-user-manual.js`.
2. Run: `cd scripts && node generate-user-manual.js`.
3. Validate output:
   ```bash
   # Check file unpacked properly
   python scripts/office/unpack.py output.docx unpacked/
   # Pack with validation
   python scripts/office/pack.py unpacked/ output.docx --original output.docx
   ```
4. If validation fails: fix XML in unpacked/ then repack.
5. If validation passes: open in Word or view via pandoc:
   ```bash
   pandoc output.docx -t markdown | head -50
   ```

### 2.5 Review

Run final QA checklist before delivery.

## 3. Professional Manual Structure

### 3.1 Cover Page

Include:
- Product/system name.
- Manual title.
- Target role.
- Version.
- Date.
- Organization/team.
- Confidentiality/status.

Example:

| Metadata | Value |
|---|---|
| Dokumen | User Manual Administrator |
| Sistem | Website Desa Sitiwinangun |
| Versi | 1.0 |
| Tanggal | 2026-06-29 |
| Status | Final |

### 3.2 Revision History

| Versi | Tanggal | Perubahan | Penulis |
|---|---|---|---|
| 1.0 | 2026-06-29 | Final berdasarkan validasi UI | Tim Dokumentasi |

### 3.3 Introduction

Must answer:
- What is this system?
- Who should use this manual?
- What can users accomplish?
- What is excluded from this manual?

Keep it short: 2–4 paragraphs.

### 3.4 Document Conventions

Use a table:

| Format | Meaning |
|---|---|
| **Bold** | Menu, button, field, or UI label |
| `Monospace` | URL, file path, credential placeholder, route |
| `Menu > Submenu` | Navigation path |
| NOTE | Helpful context |
| WARNING | Risk of data loss/security impact |

### 3.5 System Requirements

| Komponen | Kebutuhan |
|---|---|
| Browser | Chrome, Edge, Firefox, Safari terbaru |
| Koneksi | Internet stabil |
| Akun | Akun sesuai peran pengguna |
| Layar | Desktop/laptop disarankan untuk admin |

### 3.6 Task Sections

Each task section should have:
- Objective.
- Preconditions.
- Procedure table.
- Expected result.
- Notes/warnings if needed.
- Screenshot reference if helpful.

**Template:**

#### Mengelola Koleksi Kriya

**Tujuan:** Menambah, mengubah, dan menghapus data koleksi kriya.

**Prasyarat:** Admin sudah masuk ke dashboard.

| No | Aksi Pengguna | Hasil Sistem |
|---|---|---|
| 1 | Klik menu **Koleksi Kriya**. | Sistem menampilkan daftar koleksi. |
| 2 | Klik tombol **Tambah Baru**. | Sistem menampilkan formulir koleksi. |
| 3 | Isi field **Nama**, **Kategori**, **Deskripsi**, dan **Foto**. | Sistem menyiapkan data untuk disimpan. |
| 4 | Klik **Simpan**. | Sistem menyimpan data dan menampilkan notifikasi. |

**Hasil akhir:** Koleksi baru muncul pada daftar koleksi.

## 4. Writing Style

Use:
- Bahasa Indonesia formal, jelas, tidak kaku.
- Active voice.
- Short sentences.
- One action per sentence.
- UI label exactly as shown.
- Consistent verbs: Buka, Klik, Isi, Pilih, Simpan, Periksa, Unduh, Keluar.

Avoid:
- "Cukup", "tinggal", "mudah", "seharusnya".
- Long paragraphs inside procedures.
- Developer jargon for end users.
- Feature speculation.
- Duplicate troubleshooting items.

## 5. Tables

### 5.1 Procedure Table

Default for operational steps:

| No | Aksi Pengguna | Hasil Sistem |
|---|---|---|

Rules:
- `No` centered.
- `Aksi Pengguna` left-aligned.
- `Hasil Sistem` left-aligned.
- Use bold for UI labels.
- Keep each cell concise.

### 5.2 Feature Overview Table

| Fitur | Fungsi | Akses |
|---|---|---|

### 5.3 Troubleshooting Table

| Masalah / Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|

## 6. Screenshot Standard

Screenshots must:
- Come from actual app state.
- Match relevant section.
- Have clear filename.
- Have caption.
- Be scaled consistently.
- Avoid unrelated browser clutter where possible.

Filename pattern:
- `admin_01_login.png`
- `admin_02_dashboard.png`
- `storytelling_01_home.png`
- `vt_01_viewer.png`

Caption pattern:
> Gambar 1. Halaman Login Admin

Do not include screenshots for removed or failed features unless documenting troubleshooting.

### 6.1 Inserting Images in DOCX

When generating DOCX with `docx-js`, use `ImageRun`:

```javascript
const { ImageRun } = require('docx');
// Inside a paragraph children array:
new ImageRun({
  data: fs.readFileSync("path/to/image.png"),
  transformation: { width: 500, height: 350 },
  type: ImageRunType.PNG, // or JPEG
})
```

Image must be in the `word/media/` relationship. `docx-js` handles this automatically when using `ImageRun`.

Resolution guideline:
- Full page screenshots: 800×600 or similar.
- Detail/cropped: 400×300.
- Always test that image renders within page margins.

## 7. Scope Handling

### 7.1 Removed Feature

If user says feature is removed:
- Remove from sidebar list.
- Remove procedure section.
- Remove screenshot appendix item.
- Remove troubleshooting entries unless still user-facing.

### 7.2 Hidden/Direct URL Feature

If feature exists by direct URL but not in UI:
- Only document it if user explicitly asks.
- Label as "Halaman langsung / tidak tersedia di sidebar".

### 7.3 Failed Validation

If validation fails because automation selector failed, not app error:
- Do not call feature broken.
- Mark as "perlu verifikasi manual" only in validation report, not final user manual.

## 8. DOCX Formatting Standard

- Font: Calibri or Arial.
- Body: 11 pt.
- Heading 1: 20 pt, bold, navy (`#1A3C6E`).
- Heading 2: 15 pt, bold, blue (`#2C5F9E`).
- Heading 3: 12 pt, bold, accent (`#3A7CBD`).
- Line spacing: 1.15.
- Tables: navy header, white header text, light zebra striping.
- Header/footer: title, version/date, page number.
- TOC: real Word TOC field when possible.
- Page breaks before major sections when document is long.
- Page size: US Letter (12240 x 15840 DXA) or A4 (11906 x 16838 DXA).

### 8.1 Common DOCX Pitfalls

| Issue | Symptom | Fix |
|---|---|---|
| Empty TOC on first open | TOC shows blank | Click "Update Field" in Word. Normal for generated TOC. |
| Table header repeats | Header row on each page | Set `headerRows: 1` in `docx-js` Table properties. |
| Font not embedded | Different Word shows different font | Stick to Calibri/Arial — universally available. |
| Numbering continues across sections | Steps start at 5 instead of 1 | Reset numbering with unique `reference` per section. |
| Image exceeds margin | Image clipped | Set `transformation.width` to max 500 DXA (~3.5 inches). |
| Page break wrong | Content splits mid-table | Set `pageBreakBefore: true` on the heading paragraph. |


### 8.2 Caption Position Rules

Semua tabel dan gambar wajib mengikuti:
- **Tabel**: konten tabel ditulis terlebih dahulu, kemudian baris caption **Tabel X. Judul Tabel** di bawahnya.
- **Gambar/Screenshot**: gambar disisipkan terlebih dahulu, kemudian baris caption **Gambar X. Judul Gambar** di bawahnya.
- Pengecualian: halaman sampul, riwayat revisi (caption sudah internal di engine).
- Pengecekan: setelah generate DOCX, buka di Word dan verifikasi posisi caption.

## 9. Required QA Checklist

Before final delivery, verify:

- [ ] Cover page exists.
- [ ] Revision history exists.
- [ ] TOC exists and is not duplicated.
- [ ] Document conventions section has content.
- [ ] System requirements section has content.
- [ ] No heading is empty.
- [ ] Sections are not swapped.
- [ ] UI menu names match actual UI.
- [ ] Button labels match actual UI.
- [ ] Removed features are not procedural sections.
- [ ] Screenshots match current section.
- [ ] Troubleshooting is not duplicated.
- [ ] Zoom/gesture instructions match actual controls.
- [ ] Final files are named clearly.
- [ ] DOCX validates and opens correctly.


## 10. Generation

### 10.1 Primary: `generate-user-manual.js`

`scripts/generate-user-manual.js` is the dedicated generator using `docx-js`.

Edit the `MANUAL` object, then:

```bash
cd scripts && node generate-user-manual.js
```

Output: `output/UserManual_Role.docx`

### 10.2 Fallback: `generate-docx.js`

`scripts/generate-docx.js` is a general-purpose DOCX builder. Use when the document is not a user manual (report, proposal, etc).

### 10.3 Content Model

```js
const MANUAL = {
  meta: { title, subtitle, product, role, version, date, author, status, filename },
  overview: { audience, purpose, scope, outOfScope: [] },
  conventions: [{ format, meaning }],
  requirements: [{ component, requirement }],
  tasks: [{ title, objective, preconditions, steps: [{ action, result }], expected, screenshot }],
  troubleshooting: [{ symptom, cause, solution }],
  glossary: [{ term, definition }],
  faq: [{ question, answer }],
  screenshots: [{ title, path, caption }]
};
```

## 11. Environment & Dependencies

| Tool | Purpose | Install |
|---|---|---|
| `docx` npm | DOCX generation | `npm install docx` |
| `python-docx` pip | DOCX reading/analysis | `pip install python-docx` |
| pandoc | Text extraction | system package manager |
| LibreOffice | DOCX ↔ PDF ↔ image conversion | `soffice.py` handles this |

## 12. References

Use principles from:
- ISO/IEC/IEEE 82079-1:2019 — instructions for use.
- Microsoft Writing Style Guide — procedures and step-by-step instructions.
- Google Developer Documentation Style Guide — procedures and clear wording.
- Atlassian product documentation guidance — keep docs synced with current product.

Do not copy reference text. Apply principles to project context.

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



