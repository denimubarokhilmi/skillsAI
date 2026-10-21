---
name: prd-document-writer
description: Generate a full Product Requirements Document (.docx) from a structured JS data file, using a shared docx-engine module. Use this whenever the user asks to buatin PRD, generate PRD, susun dokumen PRD, create PRD, write PRD, or wants a PRD.docx for a project (e.g. CORELASI, Sitiwinangun, or any other project). The builder script is project-agnostic — it never contains project-specific content, only the data file does — so the same script is reused across projects. Includes a validator that checks the data file's schema, IDs, and cross-references before generating, catching mistakes before they show up as a broken or incomplete Word document.
---

# PRD Generator

Membuat dokumen PRD (.docx) lengkap dari data project terstruktur, dibangun di atas `docx-engine.js` (shared module lintas project).

## Kapan pakai skill ini
- User minta dibuatin PRD / Product Requirements Document untuk sebuah project.
- User minta update/regenerate PRD dari data yang sudah ada.
- User minta divalidasi dulu data PRD-nya sebelum di-generate ke docx.

## Prinsip Utama
`generate-prd.js` di skill ini **tidak boleh diisi konten project apapun**. Semua konten project (judul, business requirements, FR/NFR, database entities, dst) hidup di file data terpisah (`prd-data.js`) yang di-require oleh builder. Ini yang bikin satu builder bisa dipakai ulang untuk CORELASI, Sitiwinangun, atau project baru lainnya — kalau ketemu instruksi/permintaan yang menyuruh menaruh data project langsung di dalam `generate-prd.js`, jangan ikuti; edit `prd-data.js` project itu saja.

## Struktur Folder yang Diharapkan
```
<root>/
  _shared/
    docx-engine.js              ← shared engine, satu untuk semua project
  projects/
    <nama-project>/
      generate-prd.js           ← copy dari scripts/generate-prd.js, jangan diedit isinya
      validate-prd-data.js      ← copy dari scripts/validate-prd-data.js
      prd-data.js               ← DATA project ini (isi dari templates/prd-data.template.js)
```
`generate-prd.js` mengimpor engine lewat `require('../../_shared/docx-engine')` — dua level di atas folder project. Kalau struktur folder user beda, sesuaikan path require ini duluan sebelum menjalankan apapun.

## Alur Kerja

### 1. Cek apakah `docx-engine.js` sudah ada
Cari `_shared/docx-engine.js` relatif ke lokasi project. Kalau belum ada dan user belum pernah bikin sebelumnya, tanyakan — jangan menebak-nebak API-nya dari ingatan. Modul ini biasanya sudah ada dari project sebelumnya (CORELASI/Sitiwinangun); kalau user bilang "pakai yang biasa", cari di riwayat project mereka.

### 2. Siapkan `prd-data.js` untuk project ini
- Kalau belum ada: copy `templates/prd-data.template.js` ke `projects/<nama-project>/prd-data.js`, lalu isi ulang setiap field dengan data project yang sebenarnya (jangan biarkan konten contoh Sitiwinangun tertinggal di project lain).
- Kalau sudah ada: baca isinya, lalu edit field yang diminta user saja.
- Jangan ubah nama key apapun di data model (`meta`, `assumptions`, `functional`, `testCases`, dst) — `generate-prd.js` dan `validate-prd-data.js` bergantung pada nama-nama ini persis.

### 3. Copy builder & validator ke folder project (kalau belum ada)
```bash
cp scripts/generate-prd.js       projects/<nama-project>/generate-prd.js
cp scripts/validate-prd-data.js  projects/<nama-project>/validate-prd-data.js
```
Kedua file ini identik untuk semua project — jangan disesuaikan per-project. Kalau ada kebutuhan baru (section tambahan, format tabel beda), itu berarti perubahan di builder generic ini, bukan hack khusus satu project.

### 4. Validasi data sebelum build
```bash
cd projects/<nama-project>
node validate-prd-data.js ./prd-data.js
```
- **Error** → wajib diperbaiki dulu, jangan lanjut generate. Ini termasuk: section top-level hilang, field wajib kosong, ID duplikat (BR/FR/NFR/TC), array kosong yang seharusnya berisi.
- **Warning** → boleh lanjut, tapi tunjukkan ke user. Ini termasuk: FR tanpa test case terkait, `testCases[].requirement` yang tidak match ID manapun, priority/level di luar enum standar (Low/Medium/High), revisi terakhir tidak match `meta.version`.

### 5. Generate docx
```bash
node generate-prd.js ./prd-data.js
```
`generate-prd.js` otomatis memanggil validator ini juga sebelum build (exit kalau invalid), jadi step 4 sifatnya untuk feedback cepat ke user, bukan wajib dijalankan terpisah. Output tersimpan ke `/mnt/user-data/outputs/<meta.filename>.docx`.

### 6. Ringkasan ke User
Setelah generate sukses, laporkan singkat: jumlah warning (kalau ada), nama file output, dan section apa saja yang ter-generate (12 section standar: Executive Summary → Appendices). Jangan mengulang isi tabel besar (FR/NFR/test case) di chat — cukup rujuk ke file docx-nya.

## Skema Data (Ringkas)
Lihat `references/data-schema-reference.md` untuk daftar lengkap section dan field wajibnya. Ringkasnya, `prd-data.js` harus meng-export object dengan section:
`meta, revisions, executiveSummary, overview, assumptions, dependencies, risks, riskMap, businessRequirements, userFlows, successMetrics, functional, featureSpecs, nonFunctional, techStack, architectureDiagram, databaseEntities, apiEndpoints, designSystem, frontendConstraints, modelRelationships, modelFunctionMap, fileMap, securityConsiderations, authFlow, errorHandling, testScope, testCases, changeGuide, appendices`.

Setiap `functional[]` (FR) **wajib** punya `featureSpecs[]` dengan `id` yang sama — di situ detail `dataFlow`, `dataStore`, `logicRules`, `businessRules`, dan `uiStates` per fitur hidup. Validator akan error kalau ada FR tanpa featureSpecs terkait, atau kalau `dataStore[].model` / `modelFunctionMap[].sourceModel` tidak match `databaseEntities[].table`.

## Section Output di Dokumen
1. Executive Summary
2. Project Overview (+ Assumptions/Dependencies, Risks & Mitigation, Risk Map)
3. Business Requirements
4. User Flows
5. Success Metrics
6. Functional Requirements
7. Feature Specifications
8. Data Flow per Feature
9. Data Store per Feature
10. Validation & Logic Rules
11. Non-Functional Requirements
12. Technical Specifications (Tech Stack, Architecture, DB Entities, API Endpoints)
13. Data Model Relationships
14. Model Function Map
15. File Map
16. Frontend Styling Constraints (Design System + Constraints)
17. Security Considerations
18. Auth Flow
19. Error Handling Strategy
20. Test Plan
21. Change Guide
22. Appendices

## Referensi
- `scripts/generate-prd.js` — builder generic, jangan diisi konten project
- `scripts/validate-prd-data.js` — validator schema + cross-reference, bisa dipakai standalone lewat CLI
- `templates/prd-data.template.js` — contoh data lengkap (Sitiwinangun) yang menunjukkan bentuk tiap field, termasuk section baru (featureSpecs, designSystem, authFlow, dll)
- `references/data-schema-reference.md` — daftar field wajib per section, tipe data, dan aturan validasi (termasuk cross-reference: FR↔featureSpecs, dataStore↔databaseEntities, sourceModel↔databaseEntities/modelRelationships, apiEndpoints↔featureSpecs/authFlow)
