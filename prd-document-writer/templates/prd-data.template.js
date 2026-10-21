'use strict';
/**
 * prd-data.template.js — Example PRD data file for generate-prd.js
 *
 * Copy this file per project (e.g. prd-data.js inside each project folder)
 * and fill in the project's own content. The shape below is exactly what
 * generate-prd.js and validate-prd-data.js expect — do not rename keys.
 *
 * This example is filled in with the Sitiwinangun digital heritage project
 * as a concrete illustration; replace every field with your own project's data.
 */
module.exports = {
  meta: {
    title        : 'Sistem Informasi Digital Desa Sitiwinangun',
    subtitle     : 'Product Requirements Document',
    organization : 'Universitas Telkom — TPLM',
    project      : 'Sitiwinangun Digital Platform v1.0',
    version      : '1.0',
    date         : '30 Juni 2026',
    preparedBy   : 'Habib & Tim TPLM',
    reviewedBy   : 'Lidya Ningsih, ST., M.Kom.',
    confidential : false,
    filename     : 'PRD_Sitiwinangun_v1.0',
  },

  revisions: [
    { version: '0.1', date: '10 Juni 2026', author: 'Habib',    description: 'Draft awal' },
    { version: '1.0', date: '30 Juni 2026', author: 'Tim TPLM', description: 'Finalisasi setelah review pembimbing' },
  ],

  executiveSummary: [
    'Platform digital Desa Sitiwinangun adalah sistem informasi berbasis web yang dirancang untuk '
    + 'mendokumentasikan dan mempromosikan potensi kriya gerabah dan batik pesisir Desa Sitiwinangun, '
    + 'Cirebon. Platform ini mencakup repositori digital cerita budaya (digital storytelling) dan tur virtual 360° '
    + 'berbasis Pannellum/Marzipano.',
    'Sistem dibangun dengan Laravel 11, Blade + Bootstrap 5, dan MySQL, dijalankan di shared hosting. '
    + 'Target pengguna utama adalah wisatawan digital, peneliti budaya, dan pengelola BUMDes/KIM Desa Sitiwinangun.',
  ],

  overview: {
    background :
      'Desa Sitiwinangun memiliki kekayaan budaya berupa produk kriya gerabah dan batik pesisir '
      + 'yang belum terdokumentasikan secara digital. BUMDes dan KIM desa membutuhkan platform '
      + 'yang dapat memperkenalkan potensi desa kepada publik luas.',
    objectives : [
      'Menyediakan repositori digital yang terstruktur untuk konten budaya Desa Sitiwinangun',
      'Menghadirkan pengalaman tur virtual 360° interaktif bagi pengunjung online',
      'Mendukung pemasaran produk UMKM lokal melalui Galeri Produk yang terintegrasi dengan profil pengrajin',
      'Meningkatkan visibilitas desa di ranah digital sesuai program KIM',
    ],
    scope      :
      'Platform mencakup modul: Beranda, Profil Desa, Digital Storytelling, Virtual Museum 360°, '
      + 'Galeri Produk (terhubung ke profil pengrajin), dan CMS Admin. Soft-delete aktif di semua entitas.',
    outOfScope : [
      'Fitur e-commerce / transaksi pembayaran online',
      'Aplikasi mobile native (iOS / Android)',
      'Integrasi sistem kependudukan desa',
      'Multi-bahasa (selain Bahasa Indonesia)',
    ],
    stakeholders: [
      'BUMDes Sitiwinangun — pemilik platform dan konten',
      'KIM Desa Sitiwinangun — pengelola informasi digital',
      'Tim TPLM Universitas Telkom — pengembang',
      'Lidya Ningsih, ST., M.Kom. — supervisor akademik',
      'Wisatawan digital & peneliti budaya — pengguna akhir',
    ],
  },

  assumptions: [
    { id: 'A-01', assumption: 'Shared hosting menyediakan PHP ≥ 8.2 dan MySQL 8.0', impact: 'Laravel 11 requirement terpenuhi' },
    { id: 'A-02', assumption: 'Pengelola desa bersedia mengikuti sesi pelatihan CMS minimal 2 jam', impact: 'Onboarding konten berjalan lancar' },
    { id: 'A-03', assumption: 'Foto dan aset 360° tersedia dari BUMDes/KIM', impact: 'Konten awal virtual museum dapat dipopulasi' },
    { id: 'A-04', assumption: 'Koneksi internet desa stabil untuk akses panel admin', impact: 'Manajemen konten real-time dimungkinkan' },
  ],

  dependencies: [
    { id: 'D-01', dependency: 'Pannellum / Marzipano CDN aktif',           owner: 'Tim Dev',      deadline: '15 Juli 2026' },
    { id: 'D-02', dependency: 'Domain dan shared hosting aktif dari desa', owner: 'BUMDes',       deadline: '1 Juli 2026'  },
    { id: 'D-03', dependency: 'Aset foto dan narasi digital storytelling', owner: 'KIM Desa',     deadline: '20 Juli 2026' },
    { id: 'D-04', dependency: 'Desain UI/UX final disetujui supervisor',   owner: 'Lidya Ningsih', deadline: '5 Juli 2026'  },
  ],

  risks: [
    {
      id: 'R-01', risk: 'Keterlambatan penyediaan aset foto 360°',
      probability: 'Medium', impact: 'High', level: 'High',
      mitigation  : 'Koordinasi rutin mingguan dengan KIM; placeholder konten disiapkan',
      contingency : 'Rilis virtual museum tanpa foto 360° (mode preview)',
    },
    {
      id: 'R-02', risk: 'Performa render 360° lambat di shared hosting',
      probability: 'High', impact: 'Medium', level: 'High',
      mitigation  : 'Kompresi gambar WebP, lazy loading, CDN Pannellum',
      contingency : 'Fallback ke galeri foto statis',
    },
    {
      id: 'R-03', risk: 'Pengelola desa sulit menggunakan CMS',
      probability: 'Low', impact: 'Medium', level: 'Low',
      mitigation  : 'UI CMS disederhanakan; sesi pelatihan disiapkan + user manual',
      contingency : 'Tim dev menjadi admin sementara 1 bulan pasca-launch',
    },
  ],

  businessRequirements: [
    { id: 'BR-01', name: 'Repositori Konten Budaya',   description: 'Platform harus mampu menyimpan dan menampilkan artikel, foto, dan video terkait budaya desa', stakeholder: 'BUMDes / KIM', priority: 'High'   },
    { id: 'BR-02', name: 'Tur Virtual 360°',           description: 'Platform harus menyediakan pengalaman tur virtual berbasis Pannellum/Marzipano',               stakeholder: 'Pengunjung',    priority: 'High'   },
    { id: 'BR-03', name: 'Galeri Produk UMKM',         description: 'Platform menampilkan produk kriya yang terhubung ke profil pengrajin individu',                 stakeholder: 'BUMDes',        priority: 'High'   },
    { id: 'BR-04', name: 'CMS Admin Mandiri',          description: 'Pengelola desa dapat mengelola seluruh konten tanpa bantuan developer',                         stakeholder: 'KIM Desa',      priority: 'Medium' },
    { id: 'BR-05', name: 'SEO & Aksesibilitas Publik', description: 'Setiap halaman harus memiliki meta tag SEO dan dapat diindeks mesin pencari',                   stakeholder: 'KIM Desa',      priority: 'Medium' },
  ],

  userFlows: [
    {
      name       : 'User Browse Konten Budaya',
      description: 'Pengunjung publik menjelajahi konten digital storytelling dan profil desa',
      diagram    :
        'Beranda\n'
        + '  └─► Profil Desa ──────────────────────────────► Sejarah Desa\n'
        + '  └─► Digital Storytelling ──► Daftar Cerita ──► Detail Cerita\n'
        + '  └─► Virtual Museum ────────► Pilih Ruangan ──► Tur 360°\n'
        + '  └─► Galeri Produk ──────────► Daftar Produk ─► Detail + Profil Pengrajin',
    },
    {
      name       : 'Admin CRUD Konten',
      description: 'Admin desa mengelola konten melalui panel CMS',
      diagram    :
        'Login Admin\n'
        + '  └─► Dashboard ──► Pilih Modul\n'
        + '          ├─► Artikel ────► Create / Edit / Soft-delete\n'
        + '          ├─► Produk ────► Create (slug otomatis) / Edit / Soft-delete\n'
        + '          ├─► Pengrajin ─► Create / Edit / Link ke Produk\n'
        + '          └─► Media ─────► Upload (HTMLPurifier) / Kelola',
    },
    {
      name       : 'Pengunjung Lihat Profil Pengrajin',
      description: 'Pengunjung menemukan pengrajin dari halaman produk atau direktori',
      diagram    :
        'Galeri Produk\n'
        + '  └─► Detail Produk\n'
        + '          └─► Klik "Lihat Pengrajin"\n'
        + '                  └─► Profil Pengrajin\n'
        + '                          ├─► Biodata & Lokasi\n'
        + '                          └─► Semua Produk Pengrajin Ini',
    },
  ],

  successMetrics: [
    { metric: 'Jumlah artikel konten diunggah',     target: '≥ 20 artikel dalam 3 bulan',    tool: 'CMS dashboard',      cadence: 'Bulanan' },
    { metric: 'Unique visitor per bulan',            target: '≥ 500 UV/bulan setelah bulan 2', tool: 'Google Analytics 4', cadence: 'Bulanan' },
    { metric: 'Sesi tur virtual per bulan',          target: '≥ 100 sesi/bulan',               tool: 'GA4 Event Tracking', cadence: 'Bulanan' },
    { metric: 'SUS Score usabilitas CMS',            target: '≥ 70 (Good)',                    tool: 'Kuesioner SUS',      cadence: 'Sekali (setelah UAT)' },
    { metric: 'Performa halaman (Lighthouse Score)', target: '≥ 80 (Performance)',              tool: 'Google Lighthouse',  cadence: 'Per rilis' },
    { metric: 'Uptime platform',                     target: '≥ 99%/bulan',                    tool: 'UptimeRobot',        cadence: 'Real-time' },
  ],

  functional: [
    {
      id: 'FR-01', name: 'Autentikasi Admin', priority: 'High', actor: 'Admin',
      description: 'Admin dapat login menggunakan email dan password. Session dikelola Laravel Sanctum.',
      acceptance : [
        'Form login menampilkan field email dan password dengan validasi format',
        'Login valid mengarahkan ke dashboard admin',
        'Login invalid menampilkan pesan error tanpa mengekspos detail sistem',
        'Session berakhir otomatis setelah 2 jam tidak aktif',
        'Logout menghapus session dan mengarahkan ke halaman login',
      ],
    },
    {
      id: 'FR-02', name: 'Manajemen Artikel Digital Storytelling', priority: 'High', actor: 'Admin',
      description: 'Admin dapat membuat, mengedit, dan menonaktifkan (soft-delete) artikel digital storytelling.',
      acceptance : [
        'Form create artikel memiliki field: judul, slug (auto-generate), konten (rich text HTMLPurifier), kategori, thumbnail',
        'Slug ter-generate otomatis dari judul, dapat diedit manual',
        'Artikel yang di-delete berstatus archived, tidak tampil di publik, dapat direstore',
        'Daftar artikel di frontend menampilkan judul, thumbnail, dan excerpt 150 karakter',
        'Pagination 10 item per halaman',
      ],
    },
    {
      id: 'FR-03', name: 'Virtual Museum 360°', priority: 'High', actor: 'Pengunjung',
      description: 'Pengunjung dapat menjelajahi ruangan virtual museum menggunakan Pannellum/Marzipano.',
      acceptance : [
        'Halaman virtual museum menampilkan daftar ruangan yang tersedia',
        'Klik ruangan memuat scene 360° via Pannellum/Marzipano tanpa reload halaman',
        'Navigasi antar ruangan menggunakan hotspot yang dapat diklik',
        'Fallback graceful jika WebGL tidak didukung browser (tampilkan galeri foto)',
        'Asset 360° di-lazy load untuk menjaga performa awal halaman',
      ],
    },
    {
      id: 'FR-04', name: 'Galeri Produk & Profil Pengrajin', priority: 'High', actor: 'Pengunjung / Admin',
      description: 'Galeri produk kriya terhubung langsung ke profil pengrajin individu.',
      acceptance : [
        'Setiap produk memiliki relasi many-to-one ke tabel pengrajin',
        'Halaman detail produk menampilkan tombol/link "Lihat Profil Pengrajin"',
        'Halaman profil pengrajin menampilkan biodata dan semua produk miliknya',
        'Admin dapat membuat, edit, soft-delete produk dan pengrajin secara terpisah',
        'Filter produk berdasarkan kategori (gerabah / batik pesisir / lainnya)',
      ],
    },
    {
      id: 'FR-05', name: 'CMS Panel Admin', priority: 'Medium', actor: 'Admin',
      description: 'Panel admin berbasis Blade untuk mengelola semua konten platform.',
      acceptance : [
        'Dashboard menampilkan ringkasan: jumlah artikel, produk, pengrajin, pengunjung bulan ini',
        'Setiap modul memiliki halaman index, create, edit dengan validasi server-side',
        'Upload media divalidasi: tipe file (jpg/png/webp) dan ukuran (max 5MB)',
        'Semua input konten melewati HTMLPurifier sebelum disimpan ke database',
        'Role admin tunggal; multi-user admin dalam roadmap v2',
      ],
    },
  ],

  nonFunctional: [
    { id: 'NFR-01', name: 'Performa',        description: 'Waktu muat halaman utama',             metric: '< 3 detik pada koneksi 4G (Lighthouse ≥ 80)',    category: 'Performance'      },
    { id: 'NFR-02', name: 'Keamanan',        description: 'Proteksi terhadap OWASP Top 10',        metric: 'Tidak ada critical/high vulnerability pada scan', category: 'Security'        },
    { id: 'NFR-03', name: 'Skalabilitas',    description: 'Kapasitas concurrent user',             metric: '≥ 100 concurrent users tanpa degradasi',          category: 'Scalability'     },
    { id: 'NFR-04', name: 'Ketersediaan',    description: 'Uptime platform',                       metric: '≥ 99% uptime per bulan',                          category: 'Availability'    },
    { id: 'NFR-05', name: 'Usabilitas',      description: 'Kemudahan penggunaan CMS oleh admin',   metric: 'SUS Score ≥ 70',                                  category: 'Usability'       },
    { id: 'NFR-06', name: 'Maintainability', description: 'Kemudahan pemeliharaan kode',           metric: 'Code coverage ≥ 60%; dokumentasi inline lengkap', category: 'Maintainability' },
  ],

  techStack: {
    backend    : ['Laravel 11', 'PHP 8.2', 'Laravel Sanctum (auth)', 'HTMLPurifier (XSS filter)', 'Eloquent ORM'],
    frontend   : ['Blade Templates', 'Bootstrap 5', 'Vanilla JS', 'Pannellum / Marzipano (360°)'],
    database   : ['MySQL 8.0'],
    devops     : ['Git + GitHub', 'Shared Hosting (cPanel)', 'Composer', 'npm'],
    thirdParty : ['Google Analytics 4', 'Google Maps Embed', 'Pannellum CDN', 'UptimeRobot'],
  },

  architectureDiagram:
    '┌──────────────────────────────────────────────────────────────┐\n'
    + '│                     Browser (Client)                        │\n'
    + '│  Blade Views + Bootstrap 5 + Pannellum/Marzipano JS         │\n'
    + '└───────────────────────────┬──────────────────────────────────┘\n'
    + '                            │ HTTP/HTTPS\n'
    + '┌───────────────────────────▼──────────────────────────────────┐\n'
    + '│                 Laravel 11 Application Layer                 │\n'
    + '│  Routes → Middleware (Auth/HTMLPurifier) → Controllers       │\n'
    + '│  → Eloquent Models → Blade View Rendering                    │\n'
    + '└───────────────────────────┬──────────────────────────────────┘\n'
    + '                            │ Eloquent ORM\n'
    + '┌───────────────────────────▼──────────────────────────────────┐\n'
    + '│                      MySQL 8.0 Database                      │\n'
    + '│  articles | products | artisans | media | rooms | users      │\n'
    + '└──────────────────────────────────────────────────────────────┘',

  databaseEntities: [
    {
      table  : 'articles',
      columns: [
        { name: 'id',         type: 'BIGINT UNSIGNED', constraints: 'PK, AUTO_INCREMENT', notes: 'Primary key' },
        { name: 'title',      type: 'VARCHAR(255)',    constraints: 'NOT NULL',           notes: 'Judul artikel' },
        { name: 'slug',       type: 'VARCHAR(255)',    constraints: 'UNIQUE, NOT NULL',   notes: 'URL-friendly identifier, auto-generate dari title' },
        { name: 'content',    type: 'LONGTEXT',        constraints: 'NOT NULL',           notes: 'Konten HTML, melewati HTMLPurifier sebelum simpan' },
        { name: 'category',   type: "ENUM('budaya','kriya','pariwisata','umum')", constraints: 'DEFAULT umum', notes: '' },
        { name: 'thumbnail',  type: 'VARCHAR(255)',    constraints: 'NULLABLE',           notes: 'Path relatif ke storage/app/public' },
        { name: 'deleted_at', type: 'TIMESTAMP',       constraints: 'NULLABLE',           notes: 'Soft delete via SoftDeletes trait' },
        { name: 'created_at', type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: 'Laravel timestamps' },
        { name: 'updated_at', type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: '' },
      ],
      indexes: ['INDEX idx_category (category)', 'INDEX idx_deleted_at (deleted_at)'],
    },
    {
      table  : 'products',
      columns: [
        { name: 'id',          type: 'BIGINT UNSIGNED', constraints: 'PK, AUTO_INCREMENT', notes: '' },
        { name: 'artisan_id',  type: 'BIGINT UNSIGNED', constraints: 'FK → artisans.id',   notes: 'Relasi many-to-one ke pengrajin' },
        { name: 'name',        type: 'VARCHAR(255)',    constraints: 'NOT NULL',           notes: 'Nama produk' },
        { name: 'slug',        type: 'VARCHAR(255)',    constraints: 'UNIQUE, NOT NULL',   notes: 'Auto-generate dari name' },
        { name: 'description', type: 'TEXT',            constraints: 'NULLABLE',           notes: 'Deskripsi produk, melalui HTMLPurifier' },
        { name: 'category',    type: "ENUM('gerabah','batik_pesisir','lainnya')", constraints: 'NOT NULL', notes: '' },
        { name: 'price',       type: 'DECIMAL(12,2)',   constraints: 'NULLABLE',           notes: 'Harga perkiraan, NULL = hubungi pengrajin' },
        { name: 'image',       type: 'VARCHAR(255)',    constraints: 'NULLABLE',           notes: 'Path ke gambar utama produk' },
        { name: 'deleted_at',  type: 'TIMESTAMP',       constraints: 'NULLABLE',           notes: 'Soft delete' },
        { name: 'created_at',  type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: '' },
        { name: 'updated_at',  type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: '' },
      ],
      indexes: ['INDEX idx_artisan (artisan_id)', 'INDEX idx_category (category)', 'INDEX idx_deleted (deleted_at)'],
    },
    {
      table  : 'artisans',
      columns: [
        { name: 'id',         type: 'BIGINT UNSIGNED', constraints: 'PK, AUTO_INCREMENT', notes: '' },
        { name: 'name',       type: 'VARCHAR(255)',    constraints: 'NOT NULL',           notes: 'Nama pengrajin' },
        { name: 'slug',       type: 'VARCHAR(255)',    constraints: 'UNIQUE, NOT NULL',   notes: '' },
        { name: 'bio',        type: 'TEXT',            constraints: 'NULLABLE',           notes: 'Biografi singkat' },
        { name: 'location',   type: 'VARCHAR(255)',    constraints: 'NULLABLE',           notes: 'Alamat atau dusun' },
        { name: 'photo',      type: 'VARCHAR(255)',    constraints: 'NULLABLE',           notes: 'Foto profil' },
        { name: 'deleted_at', type: 'TIMESTAMP',       constraints: 'NULLABLE',           notes: 'Soft delete' },
        { name: 'created_at', type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: '' },
        { name: 'updated_at', type: 'TIMESTAMP',       constraints: 'NOT NULL',           notes: '' },
      ],
      indexes: ['INDEX idx_deleted (deleted_at)'],
    },
  ],

  apiEndpoints: [
    { method: 'GET',    endpoint: '/api/articles',            auth: 'Public', description: 'Daftar artikel (paginasi 10/halaman)', request: '?page=1&category=budaya',                  response: '{ data: [...], meta: { current_page, last_page } }', relatedFeature: 'FR-02', relatedModel: 'articles' },
    { method: 'GET',    endpoint: '/api/articles/{slug}',     auth: 'Public', description: 'Detail artikel berdasarkan slug',       request: '-',                                        response: '{ id, title, slug, content, category, thumbnail }',  relatedFeature: 'FR-02', relatedModel: 'articles' },
    { method: 'POST',   endpoint: '/api/admin/articles',      auth: 'Admin',  description: 'Buat artikel baru',                     request: '{ title, content, category, thumbnail? }', response: '{ id, slug, created_at }',                            relatedFeature: 'FR-02', relatedModel: 'articles' },
    { method: 'PUT',    endpoint: '/api/admin/articles/{id}', auth: 'Admin',  description: 'Update artikel',                        request: '{ title?, content?, category? }',          response: '{ id, updated_at }',                                  relatedFeature: 'FR-02', relatedModel: 'articles' },
    { method: 'DELETE', endpoint: '/api/admin/articles/{id}', auth: 'Admin',  description: 'Soft-delete artikel',                   request: '-',                                        response: '{ message: "Archived" }',                            relatedFeature: 'FR-02', relatedModel: 'articles' },
    { method: 'GET',    endpoint: '/api/products',            auth: 'Public', description: 'Daftar produk dengan relasi pengrajin', request: '?category=gerabah&artisan_id=1',           response: '{ data: [{ ...product, artisan: {...} }] }',          relatedFeature: 'FR-04', relatedModel: 'products' },
    { method: 'GET',    endpoint: '/api/artisans/{slug}',     auth: 'Public', description: 'Profil pengrajin + semua produknya',    request: '-',                                        response: '{ ...artisan, products: [...] }',                     relatedFeature: 'FR-04', relatedModel: 'artisans' },
    { method: 'POST',   endpoint: '/api/admin/login',         auth: 'Public', description: 'Login admin, return session token',     request: '{ email, password }',                      response: '{ token, user }',                                     relatedFeature: 'FR-01', relatedModel: 'articles' },
    { method: 'POST',   endpoint: '/api/admin/logout',        auth: 'Admin',  description: 'Logout dan invalidasi session',         request: '-',                                        response: '{ message: "Logged out" }',                          relatedFeature: 'FR-01', relatedModel: 'articles' },
  ],

  securityConsiderations: [
    { area: 'Input Validation', approach: 'Server-side validation + HTMLPurifier', implementation: 'Semua input konten melewati HTMLPurifier; Laravel Form Request Validation pada semua endpoint POST/PUT' },
    { area: 'Authentication',   approach: 'Laravel Sanctum session-based auth',    implementation: 'Token disimpan httpOnly cookie; CSRF protection aktif; session timeout 2 jam' },
    { area: 'SQL Injection',    approach: 'Eloquent ORM + prepared statements',    implementation: 'Tidak ada raw SQL query; semua query via Eloquent atau Query Builder' },
    { area: 'XSS Prevention',   approach: 'HTMLPurifier + Blade auto-escape',      implementation: 'HTMLPurifier memfilter konten rich text; {{ }} Blade auto-escapes semua output variabel' },
    { area: 'File Upload',      approach: 'Validasi tipe + ukuran + storage path', implementation: 'Mime type check (jpg/png/webp), max 5MB, disimpan di storage/app/public (tidak dalam public/)' },
    { area: 'Rate Limiting',    approach: 'Laravel throttle middleware',           implementation: 'Login endpoint: 5 attempt/menit; API publik: 60 req/menit' },
  ],

  errorHandling: [
    { layer: 'Frontend (Blade)',      strategy: 'Tampilkan pesan ramah pengguna',             userBehavior: 'Alert Bootstrap dengan deskripsi masalah dan saran tindakan' },
    { layer: 'API Controller',        strategy: 'Try-catch + structured JSON error response', userBehavior: '{ error: "...", code: 4xx/5xx } — tidak ekspos stack trace' },
    { layer: 'Validation',            strategy: 'Laravel Form Request + error bag',           userBehavior: 'Field yang salah disorot merah dengan pesan spesifik per field' },
    { layer: 'Database',              strategy: 'Eloquent exception handling',                userBehavior: 'Redirect ke halaman error generic; log detail ke storage/logs' },
    { layer: '404 / Route Not Found', strategy: 'Custom 404 handler',                         userBehavior: 'Halaman 404 bertemakan platform dengan link kembali ke beranda' },
    { layer: '500 / Server Error',    strategy: 'Laravel error handler + Slack notification',  userBehavior: 'Halaman error 500 generic; tim dev menerima notifikasi' },
  ],

  testScope: 'Pengujian mencakup: Functional Testing, Non-Functional Testing (Performa & Usabilitas), dan Regression Testing pasca bug-fix.',

  testCases: [
    { tcId: 'TC-001', requirement: 'FR-01',  testCase: 'Login dengan kredensial valid',          steps: '1. Buka /admin/login\n2. Isi email & password valid\n3. Klik Login',       expected: 'Redirect ke /admin/dashboard',                    priority: 'High'   },
    { tcId: 'TC-002', requirement: 'FR-01',  testCase: 'Login dengan password salah',            steps: '1. Buka /admin/login\n2. Isi email valid, password salah\n3. Klik Login',   expected: 'Pesan error, tetap di halaman login',              priority: 'High'   },
    { tcId: 'TC-003', requirement: 'FR-02',  testCase: 'Buat artikel dengan slug auto-generate', steps: '1. Login admin\n2. Buka /admin/articles/create\n3. Isi judul\n4. Simpan',   expected: 'Slug terisi otomatis dari judul',                  priority: 'High'   },
    { tcId: 'TC-004', requirement: 'FR-02',  testCase: 'Soft-delete artikel',                    steps: '1. Login admin\n2. Daftar artikel\n3. Klik Delete pada artikel tertentu',   expected: 'Artikel tidak muncul di publik, dapat direstore',  priority: 'High'   },
    { tcId: 'TC-005', requirement: 'FR-03',  testCase: 'Akses tur virtual 360°',                 steps: '1. Buka /museum\n2. Pilih ruangan\n3. Klik hotspot navigasi',               expected: 'Pannellum render scene 360°, hotspot berfungsi',   priority: 'High'   },
    { tcId: 'TC-006', requirement: 'FR-04',  testCase: 'Link produk ke profil pengrajin',        steps: '1. Buka detail produk\n2. Klik "Lihat Profil Pengrajin"',                   expected: 'Redirect ke halaman profil pengrajin yang benar',  priority: 'Medium' },
    { tcId: 'TC-007', requirement: 'NFR-01', testCase: 'Lighthouse performance score',           steps: '1. Buka beranda\n2. Jalankan Lighthouse audit mode Mobile',                 expected: 'Score ≥ 80 (Performance)',                         priority: 'Medium' },
    { tcId: 'TC-008', requirement: 'FR-05',  testCase: 'Upload media invalid type',              steps: '1. Login admin\n2. Upload file .pdf ke form artikel\n3. Submit',            expected: 'Validasi error: tipe file tidak didukung',         priority: 'Medium' },
  ],

  appendices: {
    glossary: [
      { term: 'Digital Storytelling', def: 'Pendokumentasian narasi budaya dalam format digital (teks, foto, video)' },
      { term: 'Virtual Museum',       def: 'Tur museum berbasis foto 360° yang dapat dieksplorasi secara online' },
      { term: 'Slug',                 def: 'Versi URL-friendly dari judul (misal: "gerabah-desa-sitiwinangun")' },
      { term: 'Soft Delete',          def: 'Penghapusan logis: data diarsipkan (deleted_at diisi), tidak dihapus fisik' },
      { term: 'HTMLPurifier',         def: 'Library PHP untuk membersihkan HTML dari skrip berbahaya (XSS protection)' },
      { term: 'BUMDes',               def: 'Badan Usaha Milik Desa — badan hukum pengelola usaha desa' },
      { term: 'KIM',                  def: 'Kelompok Informasi Masyarakat — pengelola informasi digital tingkat desa' },
      { term: 'Pannellum',            def: 'Library JavaScript open-source untuk menampilkan foto 360° equirectangular' },
      { term: 'Eloquent ORM',         def: 'Object-Relational Mapping bawaan Laravel untuk interaksi database' },
    ],
  },

  // ── designSystem ────────────────────────────────────────────
  designSystem: {
    styleDirection: 'Nuansa hangat dan earthy terinspirasi tanah liat & batik pesisir: coklat terracotta, krem, dan aksen biru laut. Bootstrap 5 di-override lewat custom SCSS variables, bukan class utility langsung di markup.',
    typography: [
      { name: 'Heading',    fontFamily: 'Merriweather, serif',       size: '28-36px', weight: '700', usage: 'H1-H2, judul halaman & cover' },
      { name: 'Subheading', fontFamily: 'Merriweather, serif',       size: '20-24px', weight: '600', usage: 'H3-H4, judul section' },
      { name: 'Body',       fontFamily: 'Source Sans Pro, sans-serif', size: '16px', weight: '400', usage: 'Paragraf, deskripsi produk & artikel' },
      { name: 'Caption',    fontFamily: 'Source Sans Pro, sans-serif', size: '13px', weight: '400', usage: 'Label, metadata, timestamp' },
    ],
    colorPalette: [
      { name: 'Terracotta Primary', hex: '#B5602A', usage: 'Warna utama tombol, navbar, aksen CTA' },
      { name: 'Cream Background',   hex: '#F5EDE1', usage: 'Latar belakang utama halaman publik' },
      { name: 'Sea Blue Accent',    hex: '#2C6E7F', usage: 'Link, ikon interaktif, hover state' },
      { name: 'Charcoal Text',      hex: '#2E2A26', usage: 'Warna teks utama' },
      { name: 'Alert Red',          hex: '#B23A2E', usage: 'Pesan error, validasi gagal' },
    ],
    cssTokens: [
      { token: '--color-primary',    value: '#B5602A', usage: 'Override $primary Bootstrap' },
      { token: '--color-bg',         value: '#F5EDE1', usage: 'Background body' },
      { token: '--color-accent',     value: '#2C6E7F', usage: 'Link & hover state' },
      { token: '--font-heading',     value: "'Merriweather', serif", usage: 'Semua elemen heading' },
      { token: '--font-body',        value: "'Source Sans Pro', sans-serif", usage: 'Body text' },
      { token: '--radius-card',      value: '12px', usage: 'Border-radius kartu produk & artikel' },
      { token: '--spacing-section',  value: '64px', usage: 'Jarak vertikal antar section halaman publik' },
    ],
  },

  // ── frontendConstraints ─────────────────────────────────────
  frontendConstraints: {
    stylingApproach: 'SCSS custom (Bootstrap 5 variable override) + CSS custom properties (tokens) di :root. Tidak memakai Tailwind maupun utility-class framework lain.',
    noInlineStyling: true,
    prohibitions: [
      'Dilarang menulis style langsung di attribute `style=""` pada elemen Blade',
      'Dilarang menumpuk banyak utility class Bootstrap sebagai pengganti komponen CSS terstruktur (mis. class="p-3 m-2 text-danger fw-bold" berulang di banyak file)',
      'Dilarang hardcode nilai warna/hex langsung di file .blade.php atau .scss komponen — wajib lewat CSS token',
      'Dilarang import font atau library CSS baru tanpa didaftarkan dulu di design system',
    ],
    tokenRules: [
      'Semua warna wajib direferensikan lewat CSS custom property (mis. var(--color-primary)), bukan hex literal',
      'Semua font-family wajib lewat token --font-heading / --font-body',
      'Komponen baru wajib punya file SCSS terpisah di resources/sass/components/, di-import lewat app.scss',
      'Spacing antar section wajib pakai token --spacing-section, bukan nilai px manual',
    ],
  },

  // ── featureSpecs ─────────────────────────────────────────────
  featureSpecs: [
    {
      id: 'FR-01', name: 'Autentikasi Admin',
      dataFlow: {
        actor: 'Admin',
        trigger: 'Admin membuka /admin/login dan submit form',
        input: 'Email, password',
        process: 'Validasi kredensial via Laravel Sanctum, buat session token bila valid',
        output: 'Redirect ke dashboard admin atau pesan error',
        stateChange: 'Session admin dibuat (authenticated); tanpa perubahan data lain',
      },
      dataStore: [
        { model: 'articles', operations: ['read'] },
      ],
      logicRules: [
        { field: 'email', rule: 'required', value: '-' },
        { field: 'email', rule: 'regex', value: 'format email standar RFC 5322' },
        { field: 'password', rule: 'min', value: '8 karakter' },
      ],
      businessRules: [
        { type: 'role_restriction', description: 'Hanya akun dengan role Admin yang bisa login ke panel; tidak ada self-registration' },
      ],
      uiStates: {
        loading: 'Tombol login menampilkan spinner, form disabled selama request berjalan',
        empty: 'Tidak berlaku (form login selalu menampilkan field)',
        error: 'Alert merah di atas form: "Email atau password salah"',
        disabled: 'Tombol login disabled selagi field email/password masih kosong',
        success: 'Redirect otomatis ke /admin/dashboard dengan flash message "Selamat datang"',
      },
    },
    {
      id: 'FR-02', name: 'Manajemen Artikel Digital Storytelling',
      dataFlow: {
        actor: 'Admin',
        trigger: 'Admin membuka form create/edit artikel dan submit',
        input: 'Judul, slug (opsional), konten rich text, kategori, thumbnail',
        process: 'HTMLPurifier membersihkan konten, slug di-generate otomatis bila kosong, simpan/update record',
        output: 'Artikel tersimpan dan tampil di daftar admin & (jika published) di halaman publik',
        stateChange: 'Record baru/updated di tabel articles; soft-delete mengisi deleted_at',
      },
      dataStore: [
        { model: 'articles', operations: ['create', 'read', 'update', 'delete'] },
      ],
      logicRules: [
        { field: 'title', rule: 'required', value: '-' },
        { field: 'slug', rule: 'unique', value: 'per tabel articles' },
        { field: 'thumbnail', rule: 'limit', value: 'max 5MB, format jpg/png/webp' },
        { field: 'category', rule: 'enum', value: 'budaya, kriya, pariwisata, umum' },
      ],
      businessRules: [
        { type: 'status_transition', description: 'Artikel yang di-delete berpindah ke status archived (soft-delete), bisa direstore, tidak dihapus permanen' },
      ],
      uiStates: {
        loading: 'Skeleton loader pada daftar artikel saat fetch data',
        empty: 'Ilustrasi + teks "Belum ada artikel" ketika daftar kosong',
        error: 'Toast merah "Gagal menyimpan artikel, coba lagi" bila submit gagal',
        disabled: 'Tombol simpan disabled sampai field judul dan konten terisi',
        success: 'Toast hijau "Artikel berhasil disimpan" + redirect ke daftar artikel',
      },
    },
    {
      id: 'FR-03', name: 'Virtual Museum 360°',
      dataFlow: {
        actor: 'Pengunjung',
        trigger: 'Pengunjung membuka halaman /museum dan memilih ruangan',
        input: 'Pilihan ruangan (room id)',
        process: 'Load scene 360° via Pannellum/Marzipano, lazy-load asset gambar equirectangular',
        output: 'Scene 360° interaktif dengan hotspot navigasi antar ruangan',
        stateChange: 'Tidak ada perubahan data; murni read-only experience',
      },
      dataStore: [
        { model: 'products', operations: ['read'] },
      ],
      logicRules: [],
      businessRules: [],
      uiStates: {
        loading: 'Spinner di tengah viewer sambil asset 360° dimuat',
        empty: 'Pesan "Ruangan ini belum memiliki foto 360°" bila asset belum tersedia',
        error: 'Fallback ke galeri foto statis bila WebGL tidak didukung browser',
        disabled: 'Tombol hotspot disabled saat scene masih loading',
        success: 'Scene 360° tampil penuh dengan hotspot aktif dan bisa diklik',
      },
    },
    {
      id: 'FR-04', name: 'Galeri Produk & Profil Pengrajin',
      dataFlow: {
        actor: 'Pengunjung / Admin',
        trigger: 'Pengunjung membuka /produk atau admin membuka form CRUD produk/pengrajin',
        input: 'Filter kategori (pengunjung); data produk & pengrajin (admin)',
        process: 'Query produk dengan relasi pengrajin, atau simpan/update entitas produk/pengrajin',
        output: 'Daftar/detail produk dengan link ke profil pengrajin',
        stateChange: 'Record baru/updated di tabel products dan/atau artisans',
      },
      dataStore: [
        { model: 'products',  operations: ['create', 'read', 'update', 'delete'] },
        { model: 'artisans',  operations: ['create', 'read', 'update', 'delete'] },
      ],
      logicRules: [
        { field: 'name', rule: 'required', value: '-' },
        { field: 'slug', rule: 'unique', value: 'per tabel products / artisans' },
        { field: 'category', rule: 'enum', value: 'gerabah, batik_pesisir, lainnya' },
        { field: 'price', rule: 'default', value: 'NULL (hubungi pengrajin)' },
      ],
      businessRules: [
        { type: 'quota', description: 'Tidak ada batas jumlah produk per pengrajin di v1' },
      ],
      uiStates: {
        loading: 'Grid skeleton saat daftar produk sedang di-fetch',
        empty: 'Pesan "Belum ada produk pada kategori ini"',
        error: 'Toast merah bila gagal memuat profil pengrajin (404 atau network error)',
        disabled: 'Tombol "Lihat Profil Pengrajin" disabled bila relasi artisan_id kosong',
        success: 'Halaman detail produk dan profil pengrajin tampil lengkap dengan data ter-link',
      },
    },
    {
      id: 'FR-05', name: 'CMS Panel Admin',
      dataFlow: {
        actor: 'Admin',
        trigger: 'Admin login dan mengakses dashboard/module manapun',
        input: 'Aksi CRUD dari berbagai module (artikel, produk, pengrajin, media)',
        process: 'Validasi server-side per module, HTMLPurifier untuk semua rich text, simpan ke database',
        output: 'Dashboard ringkasan statistik + halaman index/create/edit per module',
        stateChange: 'Bervariasi tergantung module yang diakses (lihat FR-02 dan FR-04)',
      },
      dataStore: [
        { model: 'articles', operations: ['read'] },
        { model: 'products',  operations: ['read'] },
        { model: 'artisans',  operations: ['read'] },
      ],
      logicRules: [
        { field: 'media_upload', rule: 'limit', value: 'max 5MB per file' },
        { field: 'media_upload', rule: 'enum', value: 'jpg, png, webp' },
      ],
      businessRules: [
        { type: 'role_restriction', description: 'Role admin tunggal di v1; multi-user admin masuk roadmap v2' },
      ],
      uiStates: {
        loading: 'Loading indicator di kartu statistik dashboard saat data belum siap',
        empty: 'Kartu statistik menampilkan angka 0 bila belum ada data sama sekali',
        error: 'Alert merah spesifik per field saat validasi server-side gagal',
        disabled: 'Tombol upload disabled selama proses upload media berlangsung',
        success: 'Toast hijau konfirmasi setiap aksi CRUD berhasil',
      },
    },
  ],

  // ── modelRelationships ──────────────────────────────────────
  modelRelationships: [
    { model: 'products', relation: 'belongsTo artisans', cardinality: 'many-to-one', fk: 'products.artisan_id → artisans.id', ownership: 'Satu pengrajin memiliki banyak produk; produk tidak bisa ada tanpa pengrajin' },
    { model: 'artisans',  relation: 'hasMany products',  cardinality: 'one-to-many', fk: 'artisans.id ← products.artisan_id', ownership: 'Pengrajin adalah pemilik data produk terkait' },
    { model: 'articles',  relation: 'standalone (tidak berelasi ke tabel lain)', cardinality: 'one-to-one', fk: '-', ownership: 'Artikel dikelola independen oleh admin, tidak terhubung ke entitas lain' },
  ],

  // ── modelFunctionMap ─────────────────────────────────────────
  modelFunctionMap: [
    { function: 'Article::generateSlug()',     purpose: 'Membuat slug unik dari judul artikel',          params: 'title: string',              paramSource: 'Form request create/update artikel', sourceModel: 'articles', return: 'string (slug)',            sideEffect: 'Tidak ada (pure function, dipanggil sebelum save)' },
    { function: 'Article::scopePublished()',   purpose: 'Query scope artikel yang belum di-soft-delete', params: '-',                            paramSource: '-',                                    sourceModel: 'articles', return: 'Eloquent Builder',          sideEffect: 'Tidak ada (read-only query scope)' },
    { function: 'Product::artisan()',          purpose: 'Relasi belongsTo ke tabel artisans',            params: '-',                            paramSource: '-',                                    sourceModel: 'products', return: 'BelongsTo relation',        sideEffect: 'Tidak ada' },
    { function: 'Artisan::products()',         purpose: 'Relasi hasMany ke tabel products',              params: '-',                            paramSource: '-',                                    sourceModel: 'artisans', return: 'HasMany relation',          sideEffect: 'Tidak ada' },
    { function: 'AdminAuthController::login()', purpose: 'Validasi kredensial & buat session admin',      params: 'email: string, password: string', paramSource: 'Request body /api/admin/login',     sourceModel: 'articles', return: '{ token, user } atau 422 error', sideEffect: 'Membuat session/token Sanctum baru' },
  ],

  // ── fileMap ──────────────────────────────────────────────────
  fileMap: [
    { feature: 'FR-01', route: 'routes/api.php',      controller: 'AdminAuthController.php',   service: '-',                    model: '-',              schema: '-',                                   component: 'resources/views/admin/login.blade.php',    test: 'tests/Feature/AdminAuthTest.php' },
    { feature: 'FR-02', route: 'routes/web.php',       controller: 'ArticleController.php',     service: 'ArticleService.php',  model: 'Article.php',    schema: 'database/migrations/xxxx_create_articles_table.php', component: 'resources/views/admin/articles/', test: 'tests/Feature/ArticleCrudTest.php' },
    { feature: 'FR-03', route: 'routes/web.php',       controller: 'MuseumController.php',      service: '-',                    model: '-',              schema: '-',                                   component: 'resources/views/museum/index.blade.php',   test: 'tests/Feature/VirtualMuseumTest.php' },
    { feature: 'FR-04', route: 'routes/web.php',       controller: 'ProductController.php',     service: 'ProductService.php',  model: 'Product.php, Artisan.php', schema: 'database/migrations/xxxx_create_products_table.php', component: 'resources/views/produk/', test: 'tests/Feature/ProductGalleryTest.php' },
    { feature: 'FR-05', route: 'routes/web.php',       controller: 'AdminDashboardController.php', service: '-',                model: '-',              schema: '-',                                   component: 'resources/views/admin/dashboard.blade.php', test: 'tests/Feature/AdminDashboardTest.php' },
  ],

  // ── authFlow ─────────────────────────────────────────────────
  authFlow: {
    login: 'Admin login lewat /admin/login dengan email + password; divalidasi via Laravel Sanctum, session-based (bukan JWT stateless)',
    sessionLifecycle: 'Session token aktif selama 2 jam tanpa aktivitas (idle timeout); diperpanjang otomatis tiap request valid; logout menghapus token dari database Sanctum',
    roles: ['Admin', 'Public'],
    permissions: [
      { role: 'Admin',  permissions: ['create:articles', 'update:articles', 'delete:articles', 'create:products', 'update:products', 'delete:products', 'create:artisans', 'update:artisans', 'delete:artisans'] },
      { role: 'Public', permissions: ['read:articles', 'read:products', 'read:artisans'] },
    ],
    protectedRoutes: [
      '/admin/dashboard — wajib login Admin',
      '/admin/articles/** — wajib login Admin',
      '/admin/products/** — wajib login Admin',
      '/admin/artisans/** — wajib login Admin',
    ],
    failStates: [
      'Token expired/invalid → redirect ke /admin/login dengan flash message "Sesi berakhir, silakan login kembali"',
      'Akses route admin tanpa login → HTTP 302 redirect ke /admin/login',
      'Login gagal 5x dalam 1 menit → throttle, tampilkan pesan "Terlalu banyak percobaan, coba lagi nanti"',
    ],
  },

  // ── riskMap ──────────────────────────────────────────────────
  riskMap: [
    { area: 'FR-03 Virtual Museum', cause: 'Aset foto 360° berukuran besar tanpa kompresi', impact: 'Waktu muat halaman museum sangat lambat di koneksi 4G', likelihood: 'High', mitigation: 'Kompresi WebP + lazy loading per ruangan', owner: 'Tim Dev' },
    { area: 'FR-02 Manajemen Artikel', cause: 'Admin lupa mengisi slug manual saat judul mengandung karakter khusus', impact: 'Slug duplikat/invalid gagal disimpan', likelihood: 'Medium', mitigation: 'Auto-generate slug + validasi unique dengan fallback suffix angka', owner: 'Tim Dev' },
    { area: 'Auth Flow', cause: 'Session admin tidak logout otomatis di perangkat publik/warnet', impact: 'Potensi akses tidak sah ke panel admin', likelihood: 'Low', mitigation: 'Idle timeout 2 jam + tombol logout jelas di setiap halaman admin', owner: 'Tim Dev' },
  ],

  // ── changeGuide ──────────────────────────────────────────────
  changeGuide: [
    {
      title: 'v1.0 — Initial Release',
      changedFiles: [
        'database/migrations/xxxx_create_articles_table.php',
        'database/migrations/xxxx_create_products_table.php',
        'database/migrations/xxxx_create_artisans_table.php',
        'app/Http/Controllers/ArticleController.php',
        'app/Http/Controllers/ProductController.php',
        'app/Http/Controllers/AdminAuthController.php',
        'resources/sass/app.scss (design tokens)',
      ],
      migrationImpact: 'Migration baru (belum ada data produksi sebelumnya), aman dijalankan langsung tanpa strategi zero-downtime khusus',
      configImpact: 'Tambah env var untuk Sanctum (SANCTUM_STATEFUL_DOMAINS) dan storage disk public',
      compatibility: 'Tidak ada versi sebelumnya untuk dibandingkan; ini rilis pertama',
      rollback: 'Rollback dengan `php artisan migrate:rollback` ke state kosong, restore backup database sebelum deploy bila ada',
    },
  ],
};
