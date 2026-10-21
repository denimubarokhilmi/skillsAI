**PRD - Kantor Hukum Amor Fati Global**

Company Profile Website

|  |  |
| --- | --- |
| Proyek | AFG Website |
| Organisasi | Kantor Hukum Amor Fati Global & Partners |
| Versi Dokumen | 1.0 |
| Tanggal | 2026-07-01 |
| Dibuat oleh | DigiCraft Team |

# Riwayat Revisi

| **Versi** | **Tanggal** | **Penulis** | **Deskripsi Perubahan** |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | DigiCraft Team | Initial PRD based on company profile data |

*Tabel 1. Riwayat Revisi Dokumen*

# Daftar Isi

# Executive Summary

Kantor Hukum Amor Fati Global & Partners adalah kantor hukum yang menyediakan layanan konsultasi dan pendampingan hukum bagi individu, perusahaan, lembaga, dan masyarakat umum.

Website ini menjadi pusat informasi hukum pidana (admin-managed), publikasi artikel edukasi hukum, video edukasi via YouTube, daftar harga layanan transparan, konsultasi via WA/Call, CMS untuk artikel, dan SEO.

Target audiens: masyarakat umum, keluarga terpidana, klien korporat, akademisi hukum. Target: >=800 UV/bulan, >=30 konsultasi/bulan.

# Project Overview

## Background

Kantor Hukum Amor Fati Global bergerak di konsultasi hukum, litigasi, non-litigasi, hukum perusahaan, keluarga, pertanahan, ketenagakerjaan, legal drafting. Belum punya website resmi.

## Objectives

* Database info pidana via CMS
* Artikel edukasi untuk traffic
* Gallery video YouTube
* Harga transparan
* Konsultasi 1-klik
* CMS mandiri
* SEO on-page

## Scope

Landing page, info hukum listing & detail, article listing & detail, video gallery, services with prices, CMS (CRUD info hukum, artikel, layanan, video), floating button WA/Call, SEO, responsive, dark mode, 404/500.

## Out of Scope

* Mobile app
* Booking system
* Payment gateway
* Multi-language
* Forum
* Document upload
* Case mgmt system

## Stakeholders

## Assumptions & Dependencies

### Assumptions

| **ID** | **Assumption** | **Impact** |
| --- | --- | --- |
| A-01 | Data layanan disediakan owner | Delay |
| A-02 | WA aktif | Konsultasi rusak |
| A-03 | Admin bisa CMS | Training |
| A-04 | Video via YouTube | Ketergantungan |

*Tabel 2. Project Assumptions*

### Dependencies

| **ID** | **Dependency** | **Owner** | **Deadline** |
| --- | --- | --- | --- |
| D-01 | Domain & hosting | Owner | H-7 |
| D-02 | GA4 | Owner | H-7 |
| D-03 | YouTube | Owner | H-14 |
| D-04 | Cloudinary | Developer | H-14 |

*Tabel 3. Project Dependencies*

## Risks & Mitigation

| **ID** | **Risk** | **Prob.** | **Impact** | **Level** | **Mitigation** | **Contingency** |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Data expired | Medium | High | High | Disclaimer + tgl update | Arsip |
| R-02 | SEO gagal | Medium | High | High | Riset keyword | Google Ads |
| R-03 | Admin malas upload | High | Medium | Medium | Reminder | Tracking |
| R-04 | Lambat karena video | Low | Medium | Low | YouTube embed | Lazy load |
| R-05 | Brute force | Low | High | Medium | Rate limit | Backup |

*Tabel 4. Project Risks and Mitigation*

# Business Requirements

| **ID** | **Name** | **Description** | **Stakeholder** | **Priority** |
| --- | --- | --- | --- | --- |
| BR-01 | Trust & Credibility | Website profesional | Owner | High |
| BR-02 | Legal Education | Artikel & video | Admin | Medium |
| BR-03 | Pricing Transparency | Harga transparan | Owner | High |
| BR-04 | Lead Generation | WA/Call | Owner | High |
| BR-05 | Operational Efficiency | Admin mandiri | Admin | High |
| BR-06 | Legal Database | Info pidana terstruktur | Masyarakat | High |

*Tabel 5. Business Requirements List*

# User Flows

The following describes the primary user interaction flows with the platform.

## Cari Info Hukum

Browse->filter->detail->konsultasi

| **Flow Diagram — Cari Info Hukum** |
| --- |
| [Landing]->[/legal-info]->[filter]->[/legal-info/:slug]->[Konsultasi->WA] |

## Lihat Harga

/services->pilih->WA

| **Flow Diagram — Lihat Harga** |
| --- |
| [/services]->[card]->[Konsultasi]->[WA] |

## Admin Publikasi

Login->create->publish

| **Flow Diagram — Admin Publikasi** |
| --- |
| [Login]->[Dashboard]->[Tambah Info]->[isi]->[Publish] |

## Admin Video

Login->tambah YouTube

| **Flow Diagram — Admin Video** |
| --- |
| [Login]->[Dashboard]->[Video]->[URL]->[Publish] |

# Success Metrics

| **Metric** | **Target** | **Measurement Tool** | **Cadence** |
| --- | --- | --- | --- |
| Unique Visitors | >=800/month | GA4 | Monthly |
| Konsultasi WA | >=30/month | GA4 event | Monthly |
| Bounce Rate | <=55% | GA4 | Monthly |
| Organic Traffic | >=50% | GA4+SC | Monthly |
| Lighthouse Perf | >=80 mobile | Lighthouse CI | Per deploy |
| Lighthouse SEO | >=90 | Lighthouse CI | Per deploy |
| Uptime | >=99.5% | Vercel | Continuous |
| Error Rate | <=0.1% | Sentry | Continuous |

*Tabel 6. Platform Success Metrics*

# Functional Requirements

## FR Summary

| **ID** | **Name** | **Description** | **Priority** | **Actor** |
| --- | --- | --- | --- | --- |
| FR-01 | Landing Hero | Hero dengan tagline Justice with Integrity | High | Semua |
| FR-02 | Tentang Kami | Profil, visi, misi, nilai | High | Semua |
| FR-03 | Layanan Grid | 8 card layanan hukum | High | Semua |
| FR-04 | Info Hukum Listing | Daftar info pidana | High | Masyarakat |
| FR-05 | Info Hukum Detail | Detail kronologi, pasal, putusan | High | Masyarakat |
| FR-06 | Article Listing | Daftar artikel edukasi | Medium | Semua |
| FR-07 | Article Detail | Detail artikel rich text | Medium | Semua |
| FR-08 | Video Gallery | Gallery YouTube embed | Medium | Semua |
| FR-09 | Harga Layanan | Daftar layanan + tarif | High | Semua |
| FR-10 | CMS Login | Login admin | High | Admin |
| FR-11 | CMS Dashboard | Dashboard admin | High | Admin |
| FR-12 | CMS CRUD Info Hukum | Manajemen info pidana | High | Admin |
| FR-13 | CMS CRUD Artikel | Manajemen artikel | Medium | Admin |
| FR-14 | CMS CRUD Layanan | Manajemen layanan & tarif | High | Admin |
| FR-15 | CMS Video | Tambah video YouTube | Medium | Admin |
| FR-16 | Floating Button | FAB WA & Call | High | Semua |
| FR-17 | SEO Foundation | SEO all pages | High | System |
| FR-18 | Dark Mode | Toggle dark/light | Medium | Semua |

*Tabel 7. Functional Requirements Summary*

## FR Detail

### FR-01: Landing Hero

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-01 |
| Name | Landing Hero |
| Description | Hero dengan tagline Justice with Integrity |
| Priority | High |
| Actor | Semua |

*Tabel 8. Detail FR-01 — Landing Hero*

**Acceptance Criteria:**

1. Headline value prop

2. Subheadline layanan

3. CTA Konsultasi->WA

4. CTA Lihat Layanan->/services

5. Background hukum #06142D

6. Loading <=2s

### FR-02: Tentang Kami

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-02 |
| Name | Tentang Kami |
| Description | Profil, visi, misi, nilai |
| Priority | High |
| Actor | Semua |

*Tabel 9. Detail FR-02 — Tentang Kami*

**Acceptance Criteria:**

1. Deskripsi perusahaan

2. Visi & misi list

3. Nilai perusahaan

### FR-03: Layanan Grid

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-03 |
| Name | Layanan Grid |
| Description | 8 card layanan hukum |
| Priority | High |
| Actor | Semua |

*Tabel 10. Detail FR-03 — Layanan Grid*

**Acceptance Criteria:**

1. 8 card ikon

2. Clickable ke /services

3. Responsive 4/2/1

### FR-04: Info Hukum Listing

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-04 |
| Name | Info Hukum Listing |
| Description | Daftar info pidana |
| Priority | High |
| Actor | Masyarakat |

*Tabel 11. Detail FR-04 — Info Hukum Listing*

**Acceptance Criteria:**

1. Judul, kategori, status

2. Filter & search 300ms

3. Pagination 10

4. Empty/loading/error

### FR-05: Info Hukum Detail

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-05 |
| Name | Info Hukum Detail |
| Description | Detail kronologi, pasal, putusan |
| Priority | High |
| Actor | Masyarakat |

*Tabel 12. Detail FR-05 — Info Hukum Detail*

**Acceptance Criteria:**

1. Kronologi, pasal, putusan

2. Share

3. Related

4. Breadcrumb

5. Disclaimer

6. JSON-LD

### FR-06: Article Listing

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-06 |
| Name | Article Listing |
| Description | Daftar artikel edukasi |
| Priority | Medium |
| Actor | Semua |

*Tabel 13. Detail FR-06 — Article Listing*

**Acceptance Criteria:**

1. Card thumbnail

2. Pagination 12

3. Search & filter

4. Empty/loading/error

### FR-07: Article Detail

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-07 |
| Name | Article Detail |
| Description | Detail artikel rich text |
| Priority | Medium |
| Actor | Semua |

*Tabel 14. Detail FR-07 — Article Detail*

**Acceptance Criteria:**

1. Rich text

2. Author & tgl

3. Share

4. Related

5. TOC >500

6. Breadcrumb

7. JSON-LD

### FR-08: Video Gallery

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-08 |
| Name | Video Gallery |
| Description | Gallery YouTube embed |
| Priority | Medium |
| Actor | Semua |

*Tabel 15. Detail FR-08 — Video Gallery*

**Acceptance Criteria:**

1. Grid thumbnail

2. Judul, durasi

3. Click modal

4. Filter

5. Empty state

### FR-09: Harga Layanan

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-09 |
| Name | Harga Layanan |
| Description | Daftar layanan + tarif |
| Priority | High |
| Actor | Semua |

*Tabel 16. Detail FR-09 — Harga Layanan*

**Acceptance Criteria:**

1. Card: nama, harga IDR, estimasi

2. Group kategori

3. Konsultasi->WA

4. Rp format

5. Badge Custom

### FR-10: CMS Login

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-10 |
| Name | CMS Login |
| Description | Login admin |
| Priority | High |
| Actor | Admin |

*Tabel 17. Detail FR-10 — CMS Login*

**Acceptance Criteria:**

1. Email+password

2. Rate limit 5x/15m

3. Session 60m

4. Error generik

5. CSRF

### FR-11: CMS Dashboard

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-11 |
| Name | CMS Dashboard |
| Description | Dashboard admin |
| Priority | High |
| Actor | Admin |

*Tabel 18. Detail FR-11 — CMS Dashboard*

**Acceptance Criteria:**

1. Stat cards

2. Quick actions

3. Recent activity

4. Logout

### FR-12: CMS CRUD Info Hukum

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-12 |
| Name | CMS CRUD Info Hukum |
| Description | Manajemen info pidana |
| Priority | High |
| Actor | Admin |

*Tabel 19. Detail FR-12 — CMS CRUD Info Hukum*

**Acceptance Criteria:**

1. Table list

2. Form: kronologi rich, pasal, putusan

3. Edit/delete/notifikasi

### FR-13: CMS CRUD Artikel

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-13 |
| Name | CMS CRUD Artikel |
| Description | Manajemen artikel |
| Priority | Medium |
| Actor | Admin |

*Tabel 20. Detail FR-13 — CMS CRUD Artikel*

**Acceptance Criteria:**

1. Table list

2. Form WYSIWYG

3. Edit/delete/notifikasi

### FR-14: CMS CRUD Layanan

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-14 |
| Name | CMS CRUD Layanan |
| Description | Manajemen layanan & tarif |
| Priority | High |
| Actor | Admin |

*Tabel 21. Detail FR-14 — CMS CRUD Layanan*

**Acceptance Criteria:**

1. Table list

2. Form: nama, harga, kategori

3. Reorder

4. Notifikasi

### FR-15: CMS Video

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-15 |
| Name | CMS Video |
| Description | Tambah video YouTube |
| Priority | Medium |
| Actor | Admin |

*Tabel 22. Detail FR-15 — CMS Video*

**Acceptance Criteria:**

1. Form URL

2. Auto thumbnail

3. Preview

### FR-16: Floating Button

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-16 |
| Name | Floating Button |
| Description | FAB WA & Call |
| Priority | High |
| Actor | Semua |

*Tabel 23. Detail FR-16 — Floating Button*

**Acceptance Criteria:**

1. Fixed bottom

2. WA & Call options

3. Tooltip

4. Delay 3s

5. Touch >=48px

### FR-17: SEO Foundation

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-17 |
| Name | SEO Foundation |
| Description | SEO all pages |
| Priority | High |
| Actor | System |

*Tabel 24. Detail FR-17 — SEO Foundation*

**Acceptance Criteria:**

1. Meta unik per page

2. OG & Twitter

3. Sitemap/robots

4. Semantic HTML

5. Alt text

6. JSON-LD

7. CWV

### FR-18: Dark Mode

| **Attribute** | **Detail** |
| --- | --- |
| ID | FR-18 |
| Name | Dark Mode |
| Description | Toggle dark/light |
| Priority | Medium |
| Actor | Semua |

*Tabel 25. Detail FR-18 — Dark Mode*

**Acceptance Criteria:**

1. Toggle navbar

2. OS default

3. localStorage

4. Transisi 300ms

5. WCAG AA

# Non-Functional Requirements

| **ID** | **Name** | **Category** | **Description** | **Metric / Target** |
| --- | --- | --- | --- | --- |
| NFR-01 | Response Time | Performance | Waktu muat | <2s desktop, <3s mobile |
| NFR-02 | Availability | Reliability | Uptime | >=99.5% |
| NFR-03 | Responsiveness | Usability | Semua layar | 320-2560px |
| NFR-04 | Security | Security | OWASP | No critical |
| NFR-05 | SEO Score | SEO | Lighthouse SEO | >=90 |
| NFR-06 | Accessibility | Accessibility | WCAG | AA |
| NFR-07 | Browser | Compatibility | Modern browsers | Chrome/FF/Safari/Edge |

*Tabel 26. Non-Functional Requirements List*

# Technical Specifications

## Tech Stack

| **Layer** | **Technology** |
| --- | --- |
| Backend | [object Object], [object Object] |
| Frontend | [object Object], [object Object], [object Object], [object Object] |
| Database | [object Object], [object Object] |
| DevOps | [object Object], [object Object] |
| Third-party | [object Object], [object Object], [object Object], [object Object] |

*Tabel 27. Technology Stack*

## Architecture Diagram

High-level system architecture:

| **Architecture — High Level** |
| --- |
| [Browser]->[Next.js (Vercel)]->[Prisma]->[PostgreSQL (Supabase)] | External: WhatsApp, Cloudinary, YouTube, GA4, Sentry |

## Database Entities

### Table: users

| **Column** | **Type** | **Constraints** | **Notes** |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| email | VARCHAR(255) | UNIQUE,NOT NULL |  |
| password\_hash | VARCHAR(255) | NOT NULL | bcrypt |
| name | VARCHAR(100) | NOT NULL |  |
| role | VARCHAR(20) | NOT NULL,DEFAULT admin |  |
| created\_at | TIMESTAMPTZ | NOT NULL,DEFAULT now() |  |

*Tabel 28. Table Structure: users*

### Table: legal\_infos

| **Column** | **Type** | **Constraints** | **Notes** |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| title | VARCHAR(200) | NOT NULL |  |
| slug | VARCHAR(255) | UNIQUE,NOT NULL |  |
| case\_status | VARCHAR(30) | NOT NULL | penyelidikan/persidangan/putusan |
| chronology | TEXT | NOT NULL | rich HTML |
| status | VARCHAR(10) | NOT NULL,DEFAULT draft |  |
| created\_at | TIMESTAMPTZ | NOT NULL,DEFAULT now() |  |

*Tabel 29. Table Structure: legal\_infos*

## API Endpoints

| **Method** | **Endpoint** | **Auth** | **Description** | **Example Request** | **Example Response** |
| --- | --- | --- | --- | --- | --- |
| GET | /api/legal-infos | Public | List info hukum | ?page=1 | {data:[]} |
| GET | /api/legal-infos/:slug | Public | Detail info hukum | - | {chronology,verdict} |
| POST | /api/legal-infos | Admin | Create | {title,...} | {id} |
| GET | /api/articles | Public | List artikel | ?page=1 | {data:[]} |
| GET | /api/articles/:slug | Public | Detail artikel | - | {title,content} |
| POST | /api/articles | Admin | Create artikel | {title,content,...} | {id} |
| GET | /api/videos | Public | List video | ?page=1 | {data:[]} |
| POST | /api/videos | Admin | Create video | {youtubeUrl,...} | {id} |
| GET | /api/services | Public | List layanan | ?category=pidana | {data:[]} |
| POST | /api/services | Admin | Create layanan | {name,price,...} | {id} |
| PUT | /api/services/:id | Admin | Update layanan | {price,...} | {id} |
| DELETE | /api/services/:id | Admin | Hapus | - | {ok:true} |
| POST | /api/auth/login | Public | Login | {email,pw} | {user,session} |
| GET | /api/admin/stats | Admin | Dashboard stats | - | {totalLegalInfos,...} |

*Tabel 30. API Endpoints List*

# Security Considerations

| **Area** | **Approach** | **Implementation** |
| --- | --- | --- |
| Auth | bcrypt | NextAuth.js |
| Authorization | Role-based | Middleware |
| XSS | DOMPurify | Sanitization |
| SQL Injection | Prisma | Parameterized |
| Rate Limit | 5x/15min | Redis |
| HTTPS | Force TLS | Vercel |
| Backup | Daily | Supabase PITR |

*Tabel 31. System Security Considerations*

# Error Handling Strategy

| **Layer** | **Strategy** | **User-facing Behavior** |
| --- | --- | --- |
| API | Try-catch | Toast |
| Components | Error Boundary | Fallback |
| Forms | Zod | Inline error |
| Network | onLine check | Banner |
| Timeout | AbortController 10s | Toast |

*Tabel 32. Error Handling Strategy by Layer*

# Test Plan

## Test Scope

Testing covers: Functional Testing, Non-Functional Testing (Performance & Usability), and Regression Testing after bug-fixes.

## Test Cases

| **TC ID** | **Requirement** | **Test Case** | **Steps** | **Expected Result** | **Priority** |
| --- | --- | --- | --- | --- | --- |
| TC-01 | FR-01 | Hero loads | Buka / | Hero visible | High |
| TC-02 | FR-03 | Layanan 8 cards | Scroll | 8 card visible | High |
| TC-03 | FR-04 | Legal info list | Buka + filter | List works | High |
| TC-04 | FR-05 | Detail info | Buka detail | Kronologi, putusan | High |
| TC-05 | FR-05 | Disclaimer | Cek bawah konten | Disclaimer ada | High |
| TC-06 | FR-09 | Services prices | Buka /services | IDR prices | High |
| TC-07 | FR-09 | Consult button | Click Konsultasi | WA opens | High |
| TC-08 | FR-10 | Login sukses | Input valid | Redirect | High |
| TC-09 | FR-10 | Rate limit | 5x gagal | Lock | High |
| TC-10 | FR-12 | Create info | Admin create | Muncul di list | High |
| TC-11 | FR-16 | FAB muncul | Load page | FAB visible | High |
| TC-12 | FR-17 | SEO tags | View source | Meta, OG, JSON-LD | High |
| TC-13 | FR-18 | Dark mode | Toggle | Persist | Medium |
| TC-14 | NFR-01 | Load time | Lighthouse | <2s | High |
| TC-15 | NFR-03 | Responsive | 375px | No overflow | High |

*Tabel 33. Test Case List*

## Design System / Color Palette

Style: Trust & Authority

Typography: EB Garamond + Lato

| **Role** | **Hex** | **Usage** |
| --- | --- | --- |
| Primary Navy | #06142D | Navbar, footer, headline |
| Deep Blue | #1C3049 | Section gelap |
| Legal Gold | #BA9759 | Accent, border |
| Antique Gold | #98753C | Hover accent |
| Cream | #EDE2D0 | Background hangat |
| Warm Taupe | #CDC7BF | Border |
| Charcoal Text | #111827 | Body text |
| White Surface | #FFFFFF | Card |

*Tabel 34. Color Palette*

| **Token** | **Value** |
| --- | --- |
| --primary | #06142D |
| --secondary | #1C3049 |
| --accent | #BA9759 |
| --accent-dark | #98753C |
| --background | #F7F3EB |
| --cream | #EDE2D0 |
| --surface | #FFFFFF |
| --border | #CDC7BF |
| --text | #111827 |
| --muted | #5F6470 |

*Tabel 35. CSS Custom Properties*

# Appendices

## Glossary

| **Term** | **Definition** |
| --- | --- |
| CMS | Content Management System |
| CRUD | Create Read Update Delete |
| SSR | Server-Side Rendering |
| JSON-LD | JSON for Linked Data |
| WCAG | Web Content Accessibility Guidelines |
| FAB | Floating Action Button |
| Litigasi | Via pengadilan |
| Non-Litigasi | Di luar pengadilan |

*Tabel 36. Term Glossary*
