---
name: project-context-analyzer
description: Menganalisis source code sebuah project (auto-detect stack: Laravel, Next.js, Nuxt.js, Vue/Vite, React/Vite, Angular, Python Django/Flask, Rails, Go, Java Spring, ASP.NET Core, Vanilla JS) dan menghasilkan satu file markdown terstruktur (output/project-context.md) berisi ringkasan project, folder structure, route map, database schema, component tree, controller/handler summary, model summary, dan saran AGENTS.md. Gunakan skill ini setiap kali user minta "pahami project ini", "buatkan context project", "analisis codebase", "ringkas struktur project", "generate AGENTS.md", atau memberi path folder project dan minta AI lain (atau dirinya sendiri) untuk cepat paham project tanpa membaca semua file satu per satu.
---

# Project Context Analyzer

## Tujuan

Codex sering harus "mengenal" sebuah project besar sebelum bisa membantu secara efektif, tapi membaca semua file satu per satu itu mahal (waktu & token) dan gampang melewatkan bagian penting. Skill ini memberi alur kerja tetap untuk mengekstrak HANYA informasi yang paling berguna — stack, struktur folder, rute, skema database, komponen, controller, model — lalu merangkumnya jadi satu file markdown ringkas yang bisa langsung dipakai sebagai "peta" project oleh AI mana pun (termasuk sesi Codex berikutnya).

Jalankan skill ini di awal sesi kerja pada project yang belum familiar, atau kapan pun user minta ringkasan/context project.

## Input

Path ke folder project. Bisa berupa:
- Path absolut, contoh: `C:\Users\project\laravel-app` atau `/home/user/laravel-app`
- Path relatif, contoh: `./` (folder kerja saat ini)

Jika user tidak memberi path, asumsikan folder kerja saat ini (`./`).

## Output

Satu file: **`output/project-context.md`**

Buat folder `output/` jika belum ada. Jangan buat file lain — semua hasil analisis masuk ke satu file ini agar mudah dibaca AI lain sekali baca.

Batas ukuran: **maksimal ~6000 token**. Jika hasil analisis lebih besar dari itu, prioritaskan (urutan prioritas): Project Info → Route Map → Model Summary → Database Schema → Controller Summary → Folder Structure → Component Tree → AGENTS.md Suggestion. Potong bagian yang paling detail (misalnya daftar kolom database yang sangat panjang) dengan catatan "... (dipotong, lihat file asli)".

## Alur Kerja

### Langkah 1 — Deteksi Stack

Cek keberadaan file berikut secara berurutan di root project. **Berhenti di kecocokan pertama** — jangan cek sisanya begitu ketemu, supaya tidak salah deteksi project dengan banyak file config campuran.

| File ketemu | Stack | Folder/file tambahan yang dibaca |
|---|---|---|
| `composer.json` | Laravel / PHP | `app/Http/Controllers/`, `routes/`, `database/migrations/`, `app/Models/`, `app/Livewire/` |
| `package.json` + `next.config.*` | Next.js | `pages/`, `app/`, `components/`, `lib/` |
| `package.json` + `nuxt.config.*` | Nuxt.js | `pages/`, `components/`, `store/` |
| `package.json` (dependency Vite + vue) | Vue (Vite) | `src/router/`, `src/views/`, `src/components/`, `src/stores/` |
| `package.json` (dependency Vite + react) | React (Vite) | `src/pages/`, `src/components/`, `src/hooks/` |
| `package.json` + `angular.json` | Angular | `src/app/` |
| `requirements.txt` / `pyproject.toml` | Python (Django/Flask) | `urls.py`, `views.py`, `models.py`, `routes.py` |
| `Gemfile` | Ruby on Rails | `app/controllers/`, `config/routes.rb`, `db/migrate/`, `app/models/` |
| `go.mod` | Go | `cmd/`, `internal/handler/`, `internal/model/` |
| `pom.xml` / `build.gradle` | Java Spring | `src/main/java/**/controller`, `src/main/java/**/model/` |
| `*.csproj` | ASP.NET Core | `Controllers/`, `Models/`, `Migrations/` |
| `index.html` dengan tag `<script>` | Vanilla JS | `js/`, `css/` |
| Tidak ada yang cocok | — | Tidak lanjut ke langkah 2-7. Langsung tulis "Project type not recognized" + daftar file di root folder, lalu selesai. |

Saat cek `package.json`, buka isinya untuk membedakan Next.js vs Nuxt vs Vue/Vite vs React/Vite vs Angular — jangan hanya mengandalkan nama file, karena banyak project punya `package.json` generik.

### Langkah 2 — Project Info

Dari file deteksi (composer.json, package.json, requirements.txt, dll), ekstrak:
- Nama project
- Framework + versi
- Versi bahasa runtime (PHP/Node/Python/dll)
- Database driver (cek `.env.example`, `config/database.php`, `settings.py`, dll jika ada)
- Dependency utama lain (frontend framework, ORM, testing tool)

Output sebagai tabel key-value.

### Langkah 3 — Folder Structure (depth 2)

Scan struktur folder sampai kedalaman 2 level. **Skip**: `node_modules/`, `vendor/`, `storage/`, `.git/`, `dist/`, `build/`, `.cache/`, `.codex/`.

Output dalam format tree, contoh:
```
project-root/
├── app/
│   ├── Http/
│   └── Models/
├── routes/
└── database/
```

### Langkah 4 — Route Map

Baca file rute sesuai stack yang terdeteksi (lihat kolom "Folder/file tambahan" di tabel Langkah 1).

Output tabel:
| Method | URL | Handler | Middleware | Route Name |
|---|---|---|---|---|

Jika stack tidak punya konsep route eksplisit (misalnya Vanilla JS), tulis "Tidak ada route map — bukan aplikasi berbasis routing server" dan skip section ini.

### Langkah 5 — Database Schema

Baca migration files (Laravel/Rails) atau model annotations (Django/Spring/dll).

Output tabel:
| Tabel | Kolom | Tipe | Constraint | Relasi |
|---|---|---|---|---|

Jika tidak ada migration/schema yang bisa dibaca (misalnya project frontend murni), tulis "Tidak ditemukan schema database" dan skip.

### Langkah 6 — Component / View Tree

Scan folder component/view sesuai stack, deteksi relasi import antar file.

Output: hierarki parent → child, contoh:
```
App
├── Layout
│   ├── Navbar
│   └── Footer
└── Dashboard
    └── StatsCard
```

### Langkah 7 — Controller / Handler Summary

List semua controller/handler beserta jumlah method-nya.

Output tabel:
| Controller | Method Count | Key Actions |
|---|---|---|

### Langkah 8 — Model Summary

List model dengan atribut fillable/serializable, casts/type, dan relasi.

Output tabel:
| Model | Table | Fillable | Relations |
|---|---|---|---|

### Langkah 9 — Saran AGENTS.md

Berdasarkan hasil langkah 1-8, tulis draft saran untuk `AGENTS.md` project ini, mencakup:
- Coding convention yang terdeteksi dari kode yang sudah ada (indentasi, penamaan, struktur folder)
- Pola prefix route (misalnya semua API pakai `/api/v1/...`)
- Daftar tabel database utama
- Perintah run/build yang relevan (`npm run dev`, `php artisan serve`, `python manage.py runserver`, dll — sesuaikan dengan stack yang terdeteksi)
- Aturan koding spesifik yang tampak dari pola project (misalnya "semua controller pakai Form Request untuk validasi")

Section ini penting karena hasilnya bisa langsung dipakai user untuk membuat/memperbarui `AGENTS.md` project mereka.

## Format Output — Template

Susun `output/project-context.md` persis dengan urutan section berikut (skip section yang memang tidak relevan untuk stack tersebut, tapi tetap sertakan judulnya dengan catatan singkat kenapa di-skip):

```markdown
# Project Context: [Nama Project]

## 1. Project Info
[tabel key-value]

## 2. Folder Structure
[tree, depth 2]

## 3. Route Map
[tabel]

## 4. Database Schema
[tabel]

## 5. Component / View Tree
[hierarki]

## 6. Controller / Handler Summary
[tabel]

## 7. Model Summary
[tabel]

## 8. Saran AGENTS.md
[draft AGENTS.md]
```

## Aturan Penting

- **Skip folder ini selalu**: `node_modules/`, `vendor/`, `storage/`, `.git/`, `dist/`, `build/`, `.cache/`, `.codex/`. Folder-folder ini berisi dependency/artifact hasil build, bukan source code asli, dan bisa membuat scan jadi sangat lambat atau bahkan gagal karena ukurannya.
- **Stack tidak terdeteksi**: jangan memaksakan analisis. Tulis "Project type not recognized" beserta daftar file yang ada di root folder, supaya user bisa cepat memberi tahu stack-nya secara manual.
- **Bahasa output**: seluruh isi `project-context.md` ditulis dalam Bahasa Indonesia, termasuk label tabel dan catatan tambahan.
- **Batas token**: total output maksimal ~6000 token. Ringkas, jangan copy-paste kode mentah — cukup nama, tipe, dan struktur.
- **Project besar (>500 file)**: prioritaskan file di depth 1-2 saja. Jangan scan rekursif dalam-dalam ke setiap subfolder komponen; cukup ambil sampel yang representatif (misalnya 10-15 controller pertama) dan catat di output bahwa daftar tidak lengkap karena project besar, contoh: "*(menampilkan 15 dari 42 controller — project besar, lihat source untuk daftar lengkap)*".
- **Jangan menebak**: kalau sebuah informasi tidak bisa dipastikan dari file yang dibaca (misalnya relasi model yang ambigu), tulis "tidak dapat dipastikan dari kode" daripada menebak — ini menjaga file context tetap akurat dan bisa dipercaya oleh AI lain yang membacanya.

## Mode: --tests (Generate Test Skeletons)

Gabungin dengan project-context-analyzer — scan project + generate PHP test files.

### Cara Pakai

```bash
# Jalankan dari root folder skill ini (project-context-analyzer/)
node scripts/generate-tests.js /path/to/laravel-project [options]
```

### Apa yang Digenerate

| Output | File | Isi |
|---|---|---|
| Model (patch, bukan generate baru) | app/Models/{Model}.php | Nambahin `use HasFactory;` jika belum ada |
| Feature Test | tests/Feature/{Resource}Test.php | CRUD structural assertion (index, store, update, destroy, show jika didukung controller) |
| Unit Test | tests/Unit/{Model}Test.php | Model relation test, factory creation |
| Factory | database/factories/{Model}Factory.php | Faker definition dari fillable + relasi belongsTo |

### Fitur Pintar & Otomatisasi (v2.1.0+)

Script generator ini dilengkapi dengan parser canggih yang bekerja secara generik:
1. **Dynamic Middleware & Auto-Auth**: Generator mem-parsing middleware route (baik melalui `Route::middleware()->group(...)`, `Route::group(['middleware' => ...])`, maupun chaining `->middleware(...)`). Jika route terdeteksi menggunakan middleware bertipe `'auth'` (seperti `auth`, `auth:api`, `auth:sanctum`), generator akan otomatis menambahkan logika login user (`actingAs($user)`) di method `setUp()` Feature Test agar test langsung passing.
2. **Pencarian Foreign Key Kustom secara Akurat**: Generator akan mendeteksi parameter kedua pada relasi `belongsTo` di model (misalnya `$this->belongsTo(User::class, 'user_id')`). Jika dideklarasikan, generator akan otomatis menggunakan kolom database tersebut (`'user_id'`) di factory, bukan menebak buta berdasarkan nama method relasi saja.
3. **Penyelarasan Metode Controller**: Generator mencocokkan route resource dengan method fisik yang diimplementasikan di controller. Jika controller tidak memiliki method tertentu (misalnya `show`), maka test skeleton untuk method tersebut tidak akan dibuat untuk menghindari error *undefined method*.
4. **Pencegahan Penyaringan Field Non-Relasi Berakhiran `_id`**: Field biasa yang namanya berakhiran `_id` (seperti `youtube_id` atau `transaction_id`) tetapi bukan merupakan foreign key relasi tetap akan dimasukkan ke dalam daftar factory definition.
5. **Fallback Value Spesifik**:
   * Field `youtube_url` otomatis digenerate sebagai link YouTube valid (`'https://www.youtube.com/watch?v=dQw4w9WgXcQ'`) agar regex extractor di controller/request tidak mengembalikan null.
   * Field `status` yang bertipe string otomatis digenerate menggunakan string `'published'` (atau `'active'`) yang aman bagi database, bukan lagi mengembalikan boolean sembarangan.
6. **Multi-Syntax Route Parsing**: Mendukung penuh tiga format deklarasi rute eksplisit Laravel sekaligus: array class (`[Controller::class, 'method']`), array string (`['Controller', 'method']`), dan format string klasik (`'Controller@action'`), serta penulisan controller berupa string literal pada `Route::resource()`.
7. **Robust Class & Namespace Parser**: Mampu mem-parsing namespace dan class dengan spasi/tab indentasi di depannya, serta mendukung modifier modern PHP seperti `readonly class`, `final class`, atau `abstract class`.

### Hybrid Workflow (Fase 1 + 2) — dua-duanya jalan dalam satu sesi

**Fase 1 — Skeleton (script ini)**
- Parse routes, controllers, models
- Auto-fix: tambahin `use HasFactory;` ke Model di `app/Models` yang belum punya trait HasFactory
- Generate CRUD test + factory + relation test
- Tandai bagian yang memerlukan perhatian khusus dengan `// ponytail: Phase 2 — ...`

**Fase 2 — AI Review — WAJIB dilanjutkan otomatis, jangan tunggu diminta ulang**

Begitu `node generate-tests.js` selesai jalan, lanjutkan LANGSUNG di sesi yang sama:

1. Scan file-file yang baru dibuat/diupdate untuk marker `// ponytail: Phase 2`.
2. Untuk tiap marker, baca source code terkait (Controller, FormRequest, Model, dll.) untuk memahami business logic.
3. Ganti komentar marker dengan assertion/kode test yang sesungguhnya.
4. Jalankan `php artisan test` untuk memastikan status pengujian hijau (passing).

### Batasan

- Rute yang didukung adalah rute berbasis Controller (baik array maupun string). Untuk rute callback closure anonim (seperti `Route::get('/', fn() => ...)`), skeleton test tidak akan digenerate karena tidak memiliki controller handler fisik.
- Pengujian tingkat lanjut seperti hak akses (*authorization policy*), penanganan file upload kompleks, dan edge-case bisnis tetap harus ditangani pada Fase 2.
