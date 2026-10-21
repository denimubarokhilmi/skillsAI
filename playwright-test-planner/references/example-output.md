## Example 1 — Hybrid mode (PRD + code available)

Selector column is present because a matching component file was found for this feature.

## Login — FR-01

**Objective:** Memverifikasi admin bisa login dengan kredensial valid dan redirect ke dashboard.
**Route:** `/admin/login`
**Prerequisites:** Akun admin aktif (email: admin@example.com, pass: password123)
**Viewport:** 1920×1080
**Source:** `src/pages/admin/LoginPage.tsx`

**Checklist:**
- [ ] Buka `/admin/login` — apakah form email+password visible?
- [ ] Isi field "Email" (`[data-testid="login-email"]`) dengan `admin@example.com` — field terisi?
- [ ] Isi field "Password" (`[data-testid="login-password"]`) dengan `password123` — field terisi?
- [ ] Klik tombol "Masuk ke Dashboard" (`role=button[name="Masuk ke Dashboard"]`) — redirect ke /admin/dashboard?
- [ ] Screenshot: `login_success.png`

**Negative cases:**
- [ ] Submit kosong — pesan error "Email wajib diisi" dan "Password wajib diisi"?
- [ ] Email tanpa @ — pesan error "Format email tidak valid"?
- [ ] Password salah — pesan error "Email atau password salah"?
- [ ] Akses /admin tanpa login — redirect ke /admin/login?

---

## Example 2 — Radio group + disambiguation (code-only or hybrid)

Shows how radio groups and duplicate-label elements are handled.

## Checkout — Payment Method — FR-14

**Objective:** Memverifikasi user bisa memilih metode pembayaran dan form detail yang sesuai muncul.
**Route:** `/checkout`
**Prerequisites:** Cart berisi minimal 1 item
**Viewport:** 1920×1080
**Source:** `src/components/checkout/PaymentMethodSelector.tsx`

**Checklist:**
- [ ] Buka `/checkout` — apakah section "Metode Pembayaran" visible?
- [ ] Pilih radio "Kartu Kredit" (group: `payment-method`, value: `credit_card`) — form input nomor kartu muncul?
- [ ] Isi field "Nomor Kartu" (`[data-testid="cc-number"]`) dengan `4111111111111111` — field terisi?
- [ ] Klik tombol "Simpan" (`[data-testid="payment-save-btn"]`, di dalam section Payment — bukan tombol "Simpan" di header profile) — toast "Metode pembayaran tersimpan" muncul?
- [ ] Screenshot: `checkout_payment_saved.png`

**Negative cases:**
- [ ] Submit tanpa pilih metode — pesan error "Pilih metode pembayaran" muncul?
- [ ] Nomor kartu kurang dari 16 digit — field di-highlight merah?
- [ ] Kartu expired (tanggal lampau) — pesan error "Kartu sudah kedaluwarsa"?

**Notes:**
- `[data-testid="payment-save-btn"]` dipilih karena ada tombol "Simpan" lain di halaman yang sama (header profile) — narasi disambiguasi ditambahkan sesuai rule Execution Reliability.

---

## Example 3 — Spec-only mode (no code available)

No selector column — label-only, per the spec-only format.

## Register — FR-02

**Objective:** Memverifikasi user baru bisa mendaftar akun.
**Route:** `/register`
**Prerequisites:** Email belum terdaftar
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka `/register` — apakah form registrasi visible?
- [ ] Isi field "Nama Lengkap" dengan `Budi Santoso` — field terisi?
- [ ] Isi field "Email" dengan `budi@example.com` — field terisi?
- [ ] Klik tombol "Daftar" — [pesan sukses TBD — konfirmasi dengan tim dev]?

**Negative cases:**
- [ ] Email sudah terdaftar — pesan error "Email sudah digunakan"?
- [ ] Password kurang dari 8 karakter — pesan error "Password minimal 8 karakter"?
- [ ] Submit form kosong — semua field required ter-highlight?
