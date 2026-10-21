---
name: changelog-generator
description: Generate a structured CHANGELOG.md from git commit history, following Conventional Commits + Keep a Changelog format. Use this whenever the user asks to generate a changelog, summarize git history into release notes, or document what changed between versions/tags/commit ranges. Trigger even if the user just says "buatin changelog dari git log ini" or "rangkum commit history jadi changelog".
---

# Changelog Generator

Membaca git log dari repo, generate `output/CHANGELOG.md` terstruktur berdasarkan tag/minggu, dikelompokkan per kategori commit.

## Kapan pakai skill ini
- User minta CHANGELOG.md dari repo git.
- User kasih range commit spesifik (`HEAD~10..HEAD`) atau minta full history.

## Alur Kerja

### 1. Jalankan Parsing Deterministik via Script
Jangan parse git log secara manual/hafalan lewat pembacaan teks bebas — commit parsing itu deterministik, jadi pakai `scripts/parse_commits.sh` supaya hasilnya konsisten dan tidak salah kategori.

```bash
bash scripts/parse_commits.sh <path-to-repo> [commit-range]
```

Script ini mengeluarkan JSON berisi: list commit (hash, message, prefix terdeteksi, tag terkait), list tag terurut, dan grouping per tag/minggu. Baca output JSON ini untuk langkah berikutnya — jangan re-derive dari `git log` mentah.

Kalau script gagal jalan (misal bukan git repo, atau `git` tidak tersedia), baru fallback ke pembacaan manual `git log --oneline` sebagai cadangan, dengan hati-hati menerapkan rule kategorisasi di bawah secara manual.

### 2. Mapping Kategori Commit
| Prefix | Section |
|---|---|
| `feat:` | Added |
| `fix:` | Fixed |
| `refactor:`, `perf:` | Changed |
| `docs:` | Documentation |
| `style:` | Changed (tandai kosmetik) |
| `test:` | Testing |
| `chore:`, `build:`, `ci:` | Maintenance (default disembunyikan dari changelog user-facing, tetap dihitung di ringkasan) |
| Tidak match prefix manapun | Other (JANGAN di-skip diam-diam) |

**Breaking changes**: kalau prefix diakhiri `!` (`feat!:`) atau ada footer `BREAKING CHANGE:` di commit body → masukkan ke section normalnya (mis. Added) DAN tambahkan ke blok terpisah "⚠ BREAKING CHANGES" di akhir versi tersebut.

### 3. Grouping
- Ambil daftar tag dari `git tag --sort=-v:refname` (sudah dilakukan oleh script).
- Commit yang lebih baru dari tag terakhir (belum di-tag) → masuk `## [Unreleased]` di paling atas.
- Kalau repo **tidak punya tag sama sekali** → group per minggu kalender, format heading `## [Week of YYYY-MM-DD]` (bukan nomor versi palsu, jangan mengarang version number).

### 4. Skip Rule
Skip merge commits (`Merge branch ...`, `Merge pull request ...`) — script sudah handle ini, tapi verifikasi ulang kalau fallback manual.

### 5. Susun Output
Pakai `templates/changelog-template.md` sebagai kerangka. Tiap entry format:
```
- Deskripsi singkat (N commits) (hash1, hash2, +N lainnya)
```
Deskripsi diambil dari bagian setelah prefix di commit message, dirapikan jadi kalimat title-case singkat, bahasa mengikuti bahasa commit message asli (jangan diterjemahkan otomatis).

### 6. Idempotency
Default: overwrite penuh `output/CHANGELOG.md` tiap run berdasarkan seluruh range yang diminta. Kalau user minta mode append-only (misal update mingguan tanpa re-generate versi lama), tanyakan dulu — jangan asumsikan.

### 7. Ringkasan Akhir
Tampilkan ke user: total commit diproses, jumlah per kategori, jumlah commit "Other" (perlu review manual kalau jumlahnya besar — indikasi tim belum konsisten pakai Conventional Commits).

## Referensi
- `scripts/parse_commits.sh` — parsing git log deterministik ke JSON
- `templates/changelog-template.md` — kerangka format output
