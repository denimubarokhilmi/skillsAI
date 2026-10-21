---
name: api-contract-generator
description: Generate markdown-style API documentation (OpenAPI/Swagger-like, but plain markdown) from controller and route source code. Use this whenever the user asks to document API endpoints, generate an "api contract", create endpoint documentation, or map routes to request/response/validation/auth info. Trigger even if the user just says "dokumentasiin API ini" or "buatin contract API" without mentioning OpenAPI explicitly. Supports Laravel, Django (DRF), Next.js (App + Pages Router), Nuxt.js, and generic fallback for other frameworks (Express, Flask, Go, Spring, dll).
---

# API Contract Generator

Membaca controller + route source code sebuah project, lalu menghasilkan dokumentasi API dalam format markdown (bukan YAML/JSON OpenAPI).

## Kapan pakai skill ini
- User minta dokumentasi endpoint API dari source code.
- User minta "API contract", "endpoint reference", atau "swagger versi markdown".
- User kasih path project + (opsional) list endpoint spesifik.

## Alur Kerja

### 1. Deteksi Stack
Cek file penanda di root project:
- `composer.json` ada + ada dependency `laravel/framework` → **Laravel** (didukung penuh).
- Selain itu (Django `manage.py`, Express `package.json` tanpa laravel, dll) → **tidak didukung otomatis**. Beri tahu user: "Stack terdeteksi: {stack}. Skill ini saat ini hanya support Laravel secara otomatis. Saya bisa coba proses manual kalau kamu kasih tahu pola controller-nya, atau lewati endpoint ini." Jangan asumsikan pola Laravel di stack lain.

### 2. Kumpulkan Daftar Endpoint
- Kalau user kasih list endpoint manual, pakai itu.
- Kalau tidak, coba jalankan `php artisan route:list --json` di root project untuk dapat route map lengkap (method, URI, action, middleware).
- Kalau `artisan` tidak bisa dieksekusi (no PHP runtime tersedia), fallback: parse `routes/api.php` dan `routes/web.php` secara manual dengan regex.

### 3. Untuk Tiap Endpoint, Ekstrak Detail
Baca `references/laravel-detection-rules.md` untuk pattern detail (Form Request, inline validate, response extraction, auth middleware, path/query params, status code inference). File itu wajib dibaca sebelum mulai ekstraksi — jangan menebak pattern dari ingatan.

Field yang harus terisi per endpoint:
- Method, URL, Path Params, Query Params
- Request Body (field: type, required/optional, rules)
- Success Response (status code + structure)
- Error Response (status code + structure, kalau ada)
- Validation Rules
- Auth (Bearer / Session / Public)

### 4. Skip Rule
Kalau controller method `return view(...)` atau tidak mengembalikan JSON sama sekali → skip endpoint ini, jangan dimasukkan ke output. Catat di ringkasan akhir berapa endpoint yang di-skip dan kenapa.

### 5. Susun Output
Pakai `templates/api-contract-template.md` sebagai kerangka format (grouping per resource/controller + Table of Contents di atas).

Gaya penulisan field: wireframe, bukan JSON schema penuh.
- Benar: `email: string, required`
- Salah: `{ "email": { "type": "string", "required": true } }`

### 6. Idempotency
- Kalau `output/api-contract.md` sudah ada dan berisi blok `<!-- MANUAL -->...<!-- END MANUAL -->`, preserve blok itu apa adanya saat regenerate — jangan ditimpa.
- Selain itu, overwrite penuh dengan hasil ekstraksi terbaru.

### 7. Ringkasan Akhir
Setelah selesai, tampilkan ringkasan singkat ke user (bukan di dalam file):
- Jumlah endpoint berhasil didokumentasikan.
- Jumlah endpoint di-skip (dan alasan).
- Jumlah field yang ditandai `[asumsi]` atau `[verifikasi manual]` — supaya user tahu bagian mana yang perlu dicek ulang sebelum dipakai untuk keperluan resmi (mis. laporan ke dosen/examiner).

## Referensi
- `references/laravel-detection-rules.md` — pattern deteksi lengkap (Form Request, validate inline, response, middleware, status code)
- `templates/api-contract-template.md` — kerangka format output

