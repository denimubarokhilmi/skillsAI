# Test Scenarios — AFG Website

**Generated from:** PRD_AFG.md
**Date:** 2026-07-01
**Viewport:** 1920×1080
**Runner:** Playwright

---

## FR-01 — Landing Hero

**Objective:** Verify hero section loads correctly
**Route:** /
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka / — apakah hero visible?
- [ ] Periksa tagline "Justice with Integrity" — ada?
- [ ] Periksa CTA "Konsultasi" — redirect ke WA?
- [ ] Periksa CTA "Lihat Layanan" — redirect ke /services?
- [ ] Periksa background hukum #06142D — sesuai?
- [ ] Periksa waktu muat <=2s — sesuai?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-03 — Layanan Grid

**Objective:** Verify layanan grid displays correctly
**Route:** /
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Scroll ke bawah — apakah 8 card layanan visible?
- [ ] Periksa kategori layanan — sesuai?
- [ ] Periksa harga layanan — sesuai?
- [ ] Periksa CTA "Konsultasi" — redirect ke WA?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-04 — Info Hukum Listing

**Objective:** Verify info hukum listing displays correctly
**Route:** /legal-info
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka /legal-info — apakah list info hukum visible?
- [ ] Periksa judul, kategori, status — sesuai?
- [ ] Periksa filter & search — works?
- [ ] Periksa pagination — works?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-05 — Info Hukum Detail

**Objective:** Verify info hukum detail displays correctly
**Route:** /legal-info/:slug
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka /legal-info/:slug — apakah detail info hukum visible?
- [ ] Periksa kronologi, pasal, putusan — sesuai?
- [ ] Periksa share button — works?
- [ ] Periksa related info — sesuai?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-09 — Harga Layanan

**Objective:** Verify harga layanan displays correctly
**Route:** /services
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka /services — apakah list harga layanan visible?
- [ ] Periksa nama, harga, kategori — sesuai?
- [ ] Periksa CTA "Konsultasi" — redirect ke WA?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-10 — CMS Login

**Objective:** Verify CMS login works correctly
**Route:** /admin/login
**Prerequisites:** Admin account
**Viewport:** 1920×1080

**Checklist:**
- [ ] Input email & password — apakah login sukses?
- [ ] Periksa rate limit — works?
- [ ] Periksa session — works?

**Negative cases:**
- [ ] Input email & password salah — pesan error muncul?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-16 — Floating Button

**Objective:** Verify floating button displays correctly
**Route:** /
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Periksa floating button — visible?
- [ ] Periksa WA & Call options — works?
- [ ] Periksa tooltip — works?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-17 — SEO Foundation

**Objective:** Verify SEO foundation works correctly
**Route:** /
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Periksa meta tags — sesuai?
- [ ] Periksa OG & Twitter tags — sesuai?
- [ ] Periksa sitemap & robots — sesuai?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## FR-18 — Dark Mode

**Objective:** Verify dark mode works correctly
**Route:** /
**Prerequisites:** None
**Viewport:** 1920×1080

**Checklist:**
- [ ] Periksa toggle dark mode — works?
- [ ] Periksa OS default — works?
- [ ] Periksa localStorage — works?

**Negative cases:**
- [ ] Submit form kosong — pesan error muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

Please note that this is not an exhaustive list of test scenarios, and you may need to add more based on the specific requirements of your application. Additionally, the test scenarios should be reviewed and updated regularly to ensure they remain relevant and effective.