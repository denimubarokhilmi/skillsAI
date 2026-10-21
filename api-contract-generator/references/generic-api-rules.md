# Generic API Rules — api-contract-generator (Fallback)

Dipakai kalau stack project **tidak match** reference spesifik (Laravel, Django, Next.js, Nuxt). Contoh: Express, Fastify, Flask, Go (Gin/Echo), Spring Boot, dll.

## 1. Cara Kerja
1. Beri tahu user: "Stack terdeteksi: {nama stack}. Belum ada rule deteksi spesifik, hasil mungkin butuh verifikasi manual."
2. Cari file routing dengan heuristik umum.
3. Setiap field hasil generic WAJIB ditandai `[generic detection, verifikasi manual]`.

## 2. Menemukan Endpoint (heuristik lintas bahasa)
- Express/Fastify: `router.get('/users/:id', ...)`, `app.post('/login', ...)`
- Flask: `@app.route('/users/<int:id>', methods=['GET'])`
- Go (Gin): `router.GET("/users/:id", handler)`
- Spring Boot: `@GetMapping("/users/{id}")`, `@PostMapping("/login")`
- Normalisasi path param: `:id`, `<int:id>`, `{id}` → `{id}` di output.

## 3. Request Body
- Ada library validasi (Joi, express-validator, Pydantic, `@Valid`) → baca schema.
- Tidak ada → cari akses field manual (`req.body.email`, `c.Bind(&struct)`) + kondisi if.
- Kalau tidak bisa ditentukan → `[tidak terdeteksi — cek manual ke {file}]`.

## 4. Response & Status Code
- Cari `res.status(200).json(...)`, `return jsonify(...), 201`, `c.JSON(200, ...)`.
- Tidak ketemu → `[status code tidak terdeteksi, kemungkinan 200 default — verifikasi manual]`.

## 5. Auth
- Middleware/decorator mengandung `auth`, `authenticate`, `login_required`, `@PreAuthorize` → terdeteksi ada proteksi.
- Tidak ada → Public `[asumsi]`.

## 6. Skip Condition
- Handler render template (`res.render(...)`, `return render_template(...)`) → skip.
- Tidak yakin → jangan skip diam-diam. Masukkan dengan catatan `[tidak yakin API atau bukan — verifikasi manual]`.

## 7. Kapan Sarankan Bikin Reference Baru
Kalau stack ini sering muncul, sarankan user buatkan `references/{stack}-detection-rules.md`.
