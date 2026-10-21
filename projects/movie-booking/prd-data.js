module.exports = {
  "meta": {
    "title": "Aplikasi Katalog & Pemesanan Tiket Film",
    "subtitle": "Product Requirements Document",
    "organization": "Universitas Telkom",
    "project": "Movie Ticket Booking v1.0",
    "version": "1.0",
    "date": "24 Juli 2026",
    "preparedBy": "Tim Pengembang",
    "reviewedBy": "Dosen Pembimbing",
    "confidential": false,
    "filename": "PRD_MovieTicketBooking_v1.0"
  },
  "revisions": [
    {
      "version": "0.1",
      "date": "20 Juli 2026",
      "author": "Tim Pengembang",
      "description": "Draft awal PRD"
    },
    {
      "version": "1.0",
      "date": "24 Juli 2026",
      "author": "Tim Pengembang",
      "description": "Finalisasi setelah review"
    }
  ],
  "executiveSummary": [
    "Aplikasi Katalog & Pemesanan Tiket Film adalah aplikasi web berbasis React + TypeScript yang memungkinkan pengguna mencari film dari database TVMaze, melihat detail film, memesan tiket dengan jadwal tayang dan jumlah tiket, serta mengelola daftar tiket yang sudah dipesan. Aplikasi menggunakan Material UI (MUI) untuk komponen UI, Redux Toolkit untuk state management, dan React Router DOM untuk navigasi.",
    "Target pengguna adalah pengguna umum yang ingin mencari informasi film dan melakukan simulasi pemesanan tiket. Aplikasi dibangun dengan Vite + React 18 + TypeScript dan mengonsumsi data dari TVMaze API publik."
  ],
  "overview": {
    "background": "Kebutuhan akan aplikasi katalog film digital meningkat dengan banyaknya platform streaming. Aplikasi ini menyediakan katalog film dari TVMaze API dengan fitur pencarian, detail film, dan simulasi pemesanan tiket.",
    "objectives": [
      "Menyediakan antarmuka pencarian film yang responsif dan intuitif",
      "Menampilkan detail film termasuk poster HD, sinopsis, rating, dan genre",
      "Memungkinkan simulasi pemesanan tiket dengan pilihan jadwal dan jumlah",
      "Menyimpan data pemesanan tiket dalam state Redux dan menampilkannya di halaman Tiket Saya"
    ],
    "scope": "Aplikasi mencakup modul: Pencarian & Katalog Film, Detail Film, Form Pemesanan Tiket, dan Halaman Tiket Saya dengan fitur pembatalan tiket. Data film dari TVMaze API. Penyimpanan via Redux Store dengan opsi persistensi localStorage.",
    "outOfScope": [
      "Integrasi pembayaran online (e-wallet, transfer bank)",
      "Autentikasi dan registrasi pengguna",
      "Multi-bahasa selain Bahasa Indonesia",
      "Aplikasi mobile native (iOS / Android)",
      "Manajemen jadwal tayang dari sisi admin",
      "Fitur review dan rating dari pengguna"
    ],
    "stakeholders": [
      "Pengguna akhir — mencari film dan simulasi pemesanan tiket",
      "Tim Pengembang — mengimplementasikan fitur sesuai spesifikasi",
      "Dosen Pembimbing — mengawasi kualitas dan kelengkapan fitur"
    ]
  },
  "assumptions": [
    {
      "id": "A-01",
      "assumption": "TVMaze API tersedia dan responsif (API publik gratis)",
      "impact": "Data film dapat dimuat tanpa kendala"
    },
    {
      "id": "A-02",
      "assumption": "Browser pengguna mendukung React 18 dan ES2020",
      "impact": "Aplikasi berjalan di browser modern"
    },
    {
      "id": "A-03",
      "assumption": "Pengguna memiliki koneksi internet minimal 4G",
      "impact": "Poster HD termuat dengan baik"
    },
    {
      "id": "A-04",
      "assumption": "localStorage tersedia dan tidak private browsing",
      "impact": "Persistensi data tiket berfungsi optimal"
    }
  ],
  "dependencies": [
    {
      "id": "D-01",
      "dependency": "TVMaze API endpoint search/shows dan shows/{id}",
      "owner": "TVMaze (pihak ketiga)",
      "deadline": "-"
    },
    {
      "id": "D-02",
      "dependency": "Paket npm: react 18, react-dom 18, typescript 5",
      "owner": "Tim Pengembang",
      "deadline": "H-1"
    },
    {
      "id": "D-03",
      "dependency": "Paket npm: @mui/material, @emotion/react, @emotion/styled",
      "owner": "Tim Pengembang",
      "deadline": "H-1"
    },
    {
      "id": "D-04",
      "dependency": "Paket npm: @reduxjs/toolkit, react-redux",
      "owner": "Tim Pengembang",
      "deadline": "H-1"
    },
    {
      "id": "D-05",
      "dependency": "Paket npm: react-router-dom v6",
      "owner": "Tim Pengembang",
      "deadline": "H-1"
    }
  ],
  "risks": [
    {
      "id": "R-01",
      "risk": "TVMaze API rate limiting atau downtime",
      "probability": "Medium",
      "impact": "High",
      "level": "High",
      "mitigation": "Caching data film dan fallback error informatif",
      "contingency": "Tampilkan data dari cache lokal"
    },
    {
      "id": "R-02",
      "risk": "Performa rendering daftar film lambat",
      "probability": "Medium",
      "impact": "Medium",
      "level": "Medium",
      "mitigation": "Virtualisasi daftar, lazy loading poster",
      "contingency": "Batasi hasil pencarian 50 item"
    },
    {
      "id": "R-03",
      "risk": "Data tiket hilang saat refresh browser",
      "probability": "High",
      "impact": "Medium",
      "level": "Medium",
      "mitigation": "Sinkronisasi Redux Store dengan localStorage",
      "contingency": "Pesan data hanya disimpan sementara"
    }
  ],
  "businessRequirements": [
    {
      "id": "BR-01",
      "name": "Pencarian Film",
      "description": "Pengguna dapat mencari film berdasarkan judul",
      "stakeholder": "Pengguna",
      "priority": "High"
    },
    {
      "id": "BR-02",
      "name": "Detail Film",
      "description": "Pengguna melihat detail film termasuk poster, sinopsis, rating, genre",
      "stakeholder": "Pengguna",
      "priority": "High"
    },
    {
      "id": "BR-03",
      "name": "Pemesanan Tiket",
      "description": "Pengguna memesan tiket dengan jadwal dan jumlah",
      "stakeholder": "Pengguna",
      "priority": "High"
    },
    {
      "id": "BR-04",
      "name": "Tiket Saya",
      "description": "Pengguna melihat daftar tiket yang sudah dipesan",
      "stakeholder": "Pengguna",
      "priority": "High"
    },
    {
      "id": "BR-05",
      "name": "Pembatalan Tiket",
      "description": "Pengguna membatalkan pesanan tiket",
      "stakeholder": "Pengguna",
      "priority": "Medium"
    }
  ],
  "userFlows": [
    {
      "name": "Browse & Booking Film",
      "description": "Pengunjung menjelajahi katalog, melihat detail, memesan tiket",
      "diagram": "Beranda -> Input Pencarian -> Daftar Film -> Klik Film -> Detail Film -> Pilih Jadwal & Jumlah -> Klik Pesan Tiket -> Data Tersimpan -> Notifikasi"
    },
    {
      "name": "Lihat & Batalkan Tiket",
      "description": "Pengunjung melihat tiket yang dipesan dan membatalkannya",
      "diagram": "Menu Tiket Saya -> Daftar Tiket -> Klik Batalkan -> Konfirmasi -> Tiket Dihapus -> Update Store"
    }
  ],
  "successMetrics": [
    {
      "metric": "Waktu muat halaman katalog",
      "target": "< 3 detik 4G",
      "tool": "Lighthouse",
      "cadence": "Setiap rilis"
    },
    {
      "metric": "Pencarian film cepat",
      "target": "Hasil < 2 detik",
      "tool": "Chrome DevTools",
      "cadence": "Setiap rilis"
    },
    {
      "metric": "Persistensi data tiket",
      "target": "100% setelah refresh",
      "tool": "Uji manual",
      "cadence": "Setiap rilis"
    },
    {
      "metric": "Skor Lighthouse",
      "target": "> 80 Performance & Accessibility",
      "tool": "Lighthouse",
      "cadence": "Setiap rilis"
    }
  ],
  "functional": [
    {
      "id": "FR-01",
      "name": "Pencarian Film (Search Bar)",
      "description": "Input TextField MUI untuk mencari film. Dispatch asyncThunk ke TVMaze search API.",
      "actor": "Pengguna",
      "priority": "High",
      "acceptance": [
        "Search bar muncul di halaman katalog",
        "Hasil ditampilkan dalam Card",
        "Debounce 500ms"
      ]
    },
    {
      "id": "FR-02",
      "name": "Katalog Film (Film Cards)",
      "description": "Daftar film dalam Grid MUI Card: Poster, Judul, Genre, Rating.",
      "actor": "Pengguna",
      "priority": "High",
      "acceptance": [
        "Card: poster, judul, genre, rating",
        "Grid 1-4 kolom responsive",
        "Card clickable ke detail"
      ]
    },
    {
      "id": "FR-03",
      "name": "Loading & Error State",
      "description": "MUI Skeleton/CircularProgress saat loading, Alert untuk error/empty.",
      "actor": "Sistem",
      "priority": "High",
      "acceptance": [
        "Loading state saat fetch",
        "Error state informatif",
        "Empty state"
      ]
    },
    {
      "id": "FR-04",
      "name": "Detail Film",
      "description": "Halaman detail: Poster HD, Summary, Rating, Genre, form booking.",
      "actor": "Pengguna",
      "priority": "High",
      "acceptance": [
        "Poster HD dan summary",
        "Rating dan genre",
        "Form booking tersedia"
      ]
    },
    {
      "id": "FR-05",
      "name": "Form Pemesanan Tiket",
      "description": "Select jadwal + jumlah, tombol Pesan Tiket, simpan ke Redux.",
      "actor": "Pengguna",
      "priority": "High",
      "acceptance": [
        "Select jadwal",
        "Select jumlah 1-10",
        "Simpan ke Redux",
        "Alert sukses"
      ]
    },
    {
      "id": "FR-06",
      "name": "Halaman Tiket Saya",
      "description": "Daftar tiket dalam MUI Table/Card: judul, jumlah, jadwal, total, tombol batal.",
      "actor": "Pengguna",
      "priority": "High",
      "acceptance": [
        "Tampilkan booking dari Redux",
        "Kolom lengkap",
        "Tombol Batalkan"
      ]
    },
    {
      "id": "FR-07",
      "name": "Pembatalan Tiket",
      "description": "Batalkan tiket dari daftar, hapus dari Redux Store.",
      "actor": "Pengguna",
      "priority": "Medium",
      "acceptance": [
        "Tombol Batalkan per baris",
        "Konfirmasi",
        "Hapus dari daftar"
      ]
    },
    {
      "id": "FR-08",
      "name": "Persistensi Tiket",
      "description": "Data booking disimpan ke localStorage via middleware.",
      "actor": "Sistem",
      "priority": "Low",
      "acceptance": [
        "Simpan otomatis ke localStorage",
        "Restore saat load"
      ]
    }
  ],
  "featureSpecs": [
    {
      "id": "FR-01",
      "name": "Pencarian Film",
      "dataFlow": {
        "actor": "Pengguna",
        "trigger": "Mengetik di search bar",
        "input": "Query string",
        "process": "Debounce 500ms -> dispatch fetchShows asyncThunk -> GET search/shows -> map response",
        "output": "Array Show[] di Redux films[]",
        "stateChange": "films = response.data"
      },
      "dataStore": [
        {
          "model": "film",
          "operations": [
            "create"
          ]
        }
      ],
      "logicRules": [
        {
          "field": "query",
          "rule": "limit",
          "value": "min 1",
          "note": "Pencarian minimal 1 karakter"
        }
      ],
      "businessRules": [],
      "uiStates": {
        "loading": "CircularProgress",
        "empty": "Alert peringatan",
        "error": "Alert error",
        "disabled": "-",
        "success": "Grid Card"
      }
    },
    {
      "id": "FR-02",
      "name": "Katalog Film",
      "dataFlow": {
        "actor": "Sistem",
        "trigger": "films[] berubah",
        "input": "films[] dari Redux",
        "process": "Map ke komponen FilmCard dalam Grid MUI",
        "output": "Grid MUI Card",
        "stateChange": "-"
      },
      "dataStore": [
        {
          "model": "film",
          "operations": [
            "read"
          ]
        }
      ],
      "logicRules": [],
      "businessRules": [],
      "uiStates": {
        "loading": "-",
        "empty": "-",
        "error": "-",
        "disabled": "-",
        "success": "Grid Card"
      }
    },
    {
      "id": "FR-03",
      "name": "Loading & Error State",
      "dataFlow": {
        "actor": "Sistem",
        "trigger": "AsyncThunk lifecycle",
        "input": "Status pending/fulfilled/rejected",
        "process": "Case builder update ui.loading, ui.error",
        "output": "UI state berubah",
        "stateChange": "ui.loading berubah"
      },
      "dataStore": [
        {
          "model": "ui",
          "operations": [
            "read"
          ]
        }
      ],
      "logicRules": [
        {
          "field": "asyncStatus",
          "rule": "limit",
          "value": "idle|loading|succeeded|failed",
          "note": "Lifecycle"
        }
      ],
      "businessRules": [],
      "uiStates": {
        "loading": "Skeleton/CircularProgress",
        "empty": "Alert warning",
        "error": "Alert error+retry",
        "disabled": "-",
        "success": "-"
      }
    },
    {
      "id": "FR-04",
      "name": "Detail Film",
      "dataFlow": {
        "actor": "Pengguna",
        "trigger": "Klik card film",
        "input": "ID film dari URL",
        "process": "Navigasi /show/:id -> dispatch fetchShowDetail -> GET /shows/{id}",
        "output": "Halaman detail",
        "stateChange": "selectedFilm = response.data"
      },
      "dataStore": [
        {
          "model": "film",
          "operations": [
            "create"
          ]
        }
      ],
      "logicRules": [],
      "businessRules": [],
      "uiStates": {
        "loading": "CircularProgress",
        "empty": "-",
        "error": "Alert error",
        "disabled": "-",
        "success": "Detail + form booking"
      }
    },
    {
      "id": "FR-05",
      "name": "Form Pemesanan Tiket",
      "dataFlow": {
        "actor": "Pengguna",
        "trigger": "Klik Pesan Tiket",
        "input": "showId, schedule, quantity",
        "process": "Validasi -> dispatch bookTicket -> UUID -> totalPrice -> push bookings[]",
        "output": "Booking baru di Redux",
        "stateChange": "bookings = [...bookings, newBooking]"
      },
      "dataStore": [
        {
          "model": "booking",
          "operations": [
            "create"
          ]
        }
      ],
      "logicRules": [
        {
          "field": "schedule",
          "rule": "limit",
          "value": "jadwal wajib",
          "note": "Validasi form"
        },
        {
          "field": "quantity",
          "rule": "limit",
          "value": "1-10",
          "note": "Min 1 max 10"
        }
      ],
      "businessRules": [
        {
          "type": "quota",
          "description": "Stok per jadwal terbatas (simulasi max 100 tiket)"
        }
      ],
      "uiStates": {
        "loading": "-",
        "empty": "-",
        "error": "Helper text validasi",
        "disabled": "Button disabled",
        "success": "Alert sukses"
      }
    },
    {
      "id": "FR-06",
      "name": "Halaman Tiket Saya",
      "dataFlow": {
        "actor": "Pengguna",
        "trigger": "Navigasi /my-tickets",
        "input": "bookings[]",
        "process": "Read -> render tabel/card",
        "output": "Tabel daftar tiket",
        "stateChange": "-"
      },
      "dataStore": [
        {
          "model": "booking",
          "operations": [
            "read"
          ]
        }
      ],
      "logicRules": [],
      "businessRules": [],
      "uiStates": {
        "loading": "-",
        "empty": "Pesan belum ada tiket",
        "error": "-",
        "disabled": "-",
        "success": "Tabel booking"
      }
    },
    {
      "id": "FR-07",
      "name": "Pembatalan Tiket",
      "dataFlow": {
        "actor": "Pengguna",
        "trigger": "Klik Batalkan",
        "input": "bookingId",
        "process": "Konfirmasi -> dispatch cancelBooking -> filter bookings[]",
        "output": "Booking deleted",
        "stateChange": "bookings = filter"
      },
      "dataStore": [
        {
          "model": "booking",
          "operations": [
            "delete"
          ]
        }
      ],
      "logicRules": [],
      "businessRules": [],
      "uiStates": {
        "loading": "-",
        "empty": "-",
        "error": "-",
        "disabled": "-",
        "success": "Alert sukses batal"
      }
    },
    {
      "id": "FR-08",
      "name": "Persistensi Tiket",
      "dataFlow": {
        "actor": "Sistem",
        "trigger": "bookings[] berubah",
        "input": "bookings[]",
        "process": "Middleware subscribe -> JSON.stringify -> localStorage.setItem",
        "output": "Data di localStorage",
        "stateChange": "-"
      },
      "dataStore": [
        {
          "model": "booking",
          "operations": [
            "read"
          ]
        }
      ],
      "logicRules": [],
      "businessRules": [],
      "uiStates": {
        "loading": "-",
        "empty": "-",
        "error": "-",
        "disabled": "-",
        "success": "Transparan ke user"
      }
    }
  ],
  "nonFunctional": [
    {
      "id": "NFR-01",
      "name": "Type Safety",
      "description": "TypeScript strict mode dengan interface/type declaration.",
      "metric": "Zero implicit any",
      "category": "Reliability"
    },
    {
      "id": "NFR-02",
      "name": "Performance",
      "description": "Halaman katalog muat < 3 detik 4G.",
      "metric": "Lighthouse Performance > 80",
      "category": "Performance"
    },
    {
      "id": "NFR-03",
      "name": "Responsive Design",
      "description": "Responsif 360-1920px via MUI Grid.",
      "metric": "Tanpa horizontal scroll",
      "category": "Scalability"
    },
    {
      "id": "NFR-04",
      "name": "Accessibility",
      "description": "Komponen MUI dengan properti aksesibilitas bawaan.",
      "metric": "Lighthouse Accessibility > 85",
      "category": "Security"
    },
    {
      "id": "NFR-05",
      "name": "Error Resilience",
      "description": "Aplikasi berfungsi meskipun API error.",
      "metric": "Tidak ada white screen",
      "category": "Reliability"
    }
  ],
  "techStack": {
    "backend": [
      "Tidak ada backend (frontend murni)"
    ],
    "frontend": [
      "React 18",
      "TypeScript 5",
      "Vite",
      "MUI v5",
      "Redux Toolkit",
      "React Router DOM v6"
    ],
    "database": [
      "localStorage (browser)",
      "Redux Store (in-memory)"
    ],
    "devops": [
      "Git + GitHub",
      "npm",
      "Vite Dev Server"
    ],
    "thirdParty": [
      "TVMaze API",
      "MUI CDN"
    ]
  },
  "architectureDiagram": "Browser (React SPA) -> React Router -> Pages (Katalog, Detail, Tiket) -> Redux Store -> localStorage sync",
  "databaseEntities": [
    {
      "table": "film",
      "description": "Data film dari TVMaze API",
      "columns": [
        {
          "name": "id",
          "type": "number",
          "constraints": "PK",
          "nullable": false,
          "notes": "TVMaze show ID"
        },
        {
          "name": "title",
          "type": "string",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Judul film"
        },
        {
          "name": "poster",
          "type": "string",
          "constraints": "None",
          "nullable": true,
          "notes": "URL poster"
        },
        {
          "name": "genre",
          "type": "string[]",
          "constraints": "None",
          "nullable": true,
          "notes": "Genre film"
        },
        {
          "name": "rating",
          "type": "number",
          "constraints": "None",
          "nullable": true,
          "notes": "Rating rata-rata"
        },
        {
          "name": "summary",
          "type": "string",
          "constraints": "None",
          "nullable": true,
          "notes": "HTML summary"
        }
      ]
    },
    {
      "table": "booking",
      "description": "Data pemesanan tiket di Redux Store",
      "columns": [
        {
          "name": "id",
          "type": "string",
          "constraints": "PK",
          "nullable": false,
          "notes": "UUID unik"
        },
        {
          "name": "showId",
          "type": "number",
          "constraints": "FK",
          "nullable": false,
          "notes": "Ref ke film"
        },
        {
          "name": "showTitle",
          "type": "string",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Judul film"
        },
        {
          "name": "poster",
          "type": "string",
          "constraints": "None",
          "nullable": true,
          "notes": "URL poster"
        },
        {
          "name": "schedule",
          "type": "string",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Jadwal tayang"
        },
        {
          "name": "quantity",
          "type": "number",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Jumlah tiket"
        },
        {
          "name": "totalPrice",
          "type": "number",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Total harga"
        },
        {
          "name": "pricePerTicket",
          "type": "number",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Harga/tiket Rp50.000"
        },
        {
          "name": "bookingDate",
          "type": "string",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Timestamp ISO"
        }
      ]
    },
    {
      "table": "ui",
      "description": "State UI loading dan error",
      "columns": [
        {
          "name": "loading",
          "type": "boolean",
          "constraints": "NOT NULL",
          "nullable": false,
          "notes": "Status loading"
        },
        {
          "name": "error",
          "type": "string",
          "constraints": "None",
          "nullable": true,
          "notes": "Pesan error"
        }
      ]
    }
  ],
  "apiEndpoints": [
    {
      "endpoint": "/search/shows?q={query}",
      "method": "GET",
      "description": "Cari film berdasarkan judul",
      "request": "-",
      "response": "Array of search results",
      "relatedFeature": "FR-01",
      "auth": "Public",
      "relatedModel": "film"
    },
    {
      "endpoint": "/shows/{id}",
      "method": "GET",
      "description": "Detail film berdasarkan ID",
      "request": "-",
      "response": "Show object",
      "relatedFeature": "FR-04",
      "auth": "Public",
      "relatedModel": "film"
    }
  ],
  "designSystem": {
    "styleDirection": "LTR",
    "colorPalette": [
      {
        "name": "primary",
        "hex": "#1976D2",
        "usage": "Button utama, link, header"
      },
      {
        "name": "secondary",
        "hex": "#9C27B0",
        "usage": "Aksen minor"
      },
      {
        "name": "background",
        "hex": "#F5F5F5",
        "usage": "Latar halaman"
      },
      {
        "name": "surface",
        "hex": "#FFFFFF",
        "usage": "Card, modal"
      },
      {
        "name": "error",
        "hex": "#D32F2F",
        "usage": "Error alert, delete"
      },
      {
        "name": "success",
        "hex": "#388E3C",
        "usage": "Success alert"
      },
      {
        "name": "textPrimary",
        "hex": "#212121",
        "usage": "Teks utama"
      },
      {
        "name": "textSecondary",
        "hex": "#757575",
        "usage": "Teks sekunder"
      }
    ],
    "typography": [
      {
        "name": "heading",
        "fontFamily": "Roboto, Arial, sans-serif",
        "size": "2.125rem",
        "weight": "400",
        "usage": "Halaman title (h4)"
      },
      {
        "name": "subheading",
        "fontFamily": "Roboto, Arial, sans-serif",
        "size": "1.5rem",
        "weight": "400",
        "usage": "Section title (h5)"
      },
      {
        "name": "body",
        "fontFamily": "Roboto, Arial, sans-serif",
        "size": "1rem",
        "weight": "400",
        "usage": "Paragraf"
      },
      {
        "name": "caption",
        "fontFamily": "Roboto, Arial, sans-serif",
        "size": "0.875rem",
        "weight": "400",
        "usage": "Label, helper text"
      }
    ],
    "cssTokens": [
      {
        "token": "--grid-gap",
        "value": "16px",
        "usage": "Jarak antar card"
      },
      {
        "token": "--card-radius",
        "value": "8px",
        "usage": "Border radius card"
      },
      {
        "token": "--page-margin",
        "value": "24px",
        "usage": "Margin halaman"
      }
    ],
    "spacing": {
      "unit": 8,
      "gridGap": 2,
      "cardPadding": 2,
      "pageMargin": 3
    },
    "components": {
      "Card": "MUI Card elevation 1-3, hover elevation increase",
      "Button": "MUI Contained (primary/tambah), Outlined (error/hapus)",
      "Select": "MUI Select outlined variant fullWidth",
      "TextField": "MUI Outlined TextField fullWidth",
      "Alert": "MUI Alert with severity info/success/warning/error",
      "Skeleton": "MUI Skeleton variant rectangular",
      "CircularProgress": "MUI CircularProgress centered"
    },
    "iconography": {
      "search": "SearchIcon",
      "menu": "MenuIcon",
      "close": "CloseIcon",
      "delete": "DeleteIcon"
    }
  },
  "frontendConstraints": {
    "stylingApproach": "MUI styling only (sx prop atau styled components)",
    "noInlineStyling": true,
    "prohibitions": [
      "Tidak ada file CSS/SCSS terpisah",
      "Tidak ada utility class dari framework lain"
    ],
    "tokenRules": [
      "Gunakan ThemeProvider MUI untuk global tokens",
      "Warna dari palet MUI atau theme override"
    ]
  },
  "modelRelationships": [
    {
      "model": "film",
      "relation": "booking",
      "cardinality": "one-to-many",
      "fk": "booking.showId",
      "ownership": "Referential"
    },
    {
      "model": "booking",
      "relation": "ui",
      "cardinality": "one-to-one",
      "fk": "-",
      "ownership": "Referential"
    }
  ],
  "modelFunctionMap": [
    {
      "function": "fetchShows",
      "purpose": "Cari film dari TVMaze berdasarkan query",
      "params": "query: string",
      "paramSource": "User input serach bar",
      "sourceModel": "film",
      "return": "Show[]",
      "sideEffect": "Update Redux films[]",
      "featureIds": [
        "FR-01"
      ]
    },
    {
      "function": "fetchShowDetail",
      "purpose": "Ambil detail film dari TVMaze",
      "params": "id: number",
      "paramSource": "URL parameter /show/:id",
      "sourceModel": "film",
      "return": "Show",
      "sideEffect": "Update selectedFilm",
      "featureIds": [
        "FR-04"
      ]
    },
    {
      "function": "bookTicket",
      "purpose": "Buat booking tiket baru",
      "params": "bookingData: BookingInput",
      "paramSource": "Form booking",
      "sourceModel": "booking",
      "return": "Booking",
      "sideEffect": "Push ke bookings[], sync localStorage",
      "featureIds": [
        "FR-05"
      ]
    },
    {
      "function": "cancelBooking",
      "purpose": "Hapus booking tiket",
      "params": "id: string",
      "paramSource": "User action tombol batal",
      "sourceModel": "booking",
      "return": "void",
      "sideEffect": "Filter bookings[], sync localStorage",
      "featureIds": [
        "FR-07"
      ]
    }
  ],
  "fileMap": [
    {
      "feature": "FR-01",
      "route": "src/store/filmSlice.ts",
      "controller": "-",
      "service": "-",
      "model": "Film (interface)",
      "schema": "src/types/film.ts",
      "component": "src/pages/KatalogPage.tsx",
      "test": "-"
    },
    {
      "feature": "FR-02",
      "route": "-",
      "controller": "-",
      "service": "-",
      "model": "Film (interface)",
      "schema": "src/types/film.ts",
      "component": "src/components/FilmCard.tsx",
      "test": "-"
    },
    {
      "feature": "FR-03",
      "route": "-",
      "controller": "-",
      "service": "-",
      "model": "-",
      "schema": "-",
      "component": "src/components/LoadingState.tsx",
      "test": "-"
    },
    {
      "feature": "FR-04",
      "route": "src/App.tsx",
      "controller": "-",
      "service": "-",
      "model": "Film (interface)",
      "schema": "src/types/film.ts",
      "component": "src/pages/DetailPage.tsx",
      "test": "-"
    },
    {
      "feature": "FR-05",
      "route": "-",
      "controller": "-",
      "service": "-",
      "model": "Booking (interface)",
      "schema": "src/types/booking.ts",
      "component": "src/pages/DetailPage.tsx",
      "test": "-"
    },
    {
      "feature": "FR-06",
      "route": "src/App.tsx",
      "controller": "-",
      "service": "-",
      "model": "Booking (interface)",
      "schema": "src/types/booking.ts",
      "component": "src/pages/TiketSayaPage.tsx",
      "test": "-"
    },
    {
      "feature": "FR-07",
      "route": "-",
      "controller": "-",
      "service": "-",
      "model": "Booking (interface)",
      "schema": "src/types/booking.ts",
      "component": "src/pages/TiketSayaPage.tsx",
      "test": "-"
    },
    {
      "feature": "FR-08",
      "route": "-",
      "controller": "-",
      "service": "-",
      "model": "Booking[]",
      "schema": "src/store/localStorageSync.ts",
      "component": "-",
      "test": "-"
    }
  ],
  "securityConsiderations": [
    {
      "area": "Data Exposure",
      "approach": "Hanya data publik TVMaze API",
      "implementation": "Semua data di sisi klien"
    },
    {
      "area": "Input Validation",
      "approach": "Sanitasi MUI TextField",
      "implementation": "Validasi form booking client-side"
    },
    {
      "area": "XSS Prevention",
      "approach": "SPA tanpa SSR",
      "implementation": "Purifikasi HTML summary via DOMPurify"
    }
  ],
  "authFlow": {
    "login": "Tidak ada autentikasi. Open-access tanpa login.",
    "sessionLifecycle": "Tidak ada sesi server. Data booking di localStorage.",
    "roles": [
      "Public"
    ],
    "permissions": [
      {
        "role": "Public",
        "permissions": [
          "read:films",
          "create:booking",
          "read:bookings",
          "delete:bookings"
        ]
      }
    ],
    "protectedRoutes": [
      "/my-tickets"
    ],
    "failStates": [
      "Offline"
    ]
  },
  "riskMap": [
    {
      "area": "FR-01 Pencarian",
      "cause": "Query kosong",
      "impact": "Hasil tidak sesuai",
      "likelihood": "Medium",
      "mitigation": "Validasi min 1 karakter",
      "owner": "Tim Dev"
    },
    {
      "area": "FR-08 Persistensi",
      "cause": "localStorage penuh",
      "impact": "Gagal simpan booking",
      "likelihood": "Low",
      "mitigation": "Try-catch pada write",
      "owner": "Tim Dev"
    }
  ],
  "errorHandling": [
    {
      "layer": "API Fetch",
      "strategy": "try/catch -> rejectWithValue -> case rejected",
      "userBehavior": "Alert error informatif"
    },
    {
      "layer": "Pencarian",
      "strategy": "Cek response.length == 0",
      "userBehavior": "Alert peringatan tidak ditemukan"
    },
    {
      "layer": "Form Booking",
      "strategy": "Validasi client-side",
      "userBehavior": "Helper text pada field"
    },
    {
      "layer": "localStorage",
      "strategy": "try/catch read/write",
      "userBehavior": "Transparan (fallback in-memory)"
    },
    {
      "layer": "Global Error",
      "strategy": "React Error Boundary",
      "userBehavior": "Halaman fallback + tombol reload"
    }
  ],
  "testScope": "Pengujian manual via browser mencakup: pencarian, detail film, booking, tiket saya, pembatalan, persistensi.",
  "testCases": [
    {
      "tcId": "TC-01",
      "requirement": "FR-01",
      "testCase": "Pencarian film valid",
      "steps": "Buka katalog, ketik batman",
      "expected": "Daftar film muncul",
      "priority": "High"
    },
    {
      "tcId": "TC-02",
      "requirement": "FR-01",
      "testCase": "Pencarian tidak valid",
      "steps": "Ketik zzzznotexist",
      "expected": "Alert tidak ditemukan",
      "priority": "High"
    },
    {
      "tcId": "TC-03",
      "requirement": "FR-02",
      "testCase": "Card film tampil",
      "steps": "Amati hasil pencarian",
      "expected": "Card: poster, judul, genre, rating",
      "priority": "High"
    },
    {
      "tcId": "TC-04",
      "requirement": "FR-03",
      "testCase": "Loading state",
      "steps": "Lakukan pencarian",
      "expected": "Skeleton/CircularProgress muncul",
      "priority": "Medium"
    },
    {
      "tcId": "TC-05",
      "requirement": "FR-03",
      "testCase": "Error state",
      "steps": "Putus koneksi, cari film",
      "expected": "Alert error informatif",
      "priority": "Medium"
    },
    {
      "tcId": "TC-06",
      "requirement": "FR-04",
      "testCase": "Detail film",
      "steps": "Klik card film",
      "expected": "Halaman detail muncul",
      "priority": "High"
    },
    {
      "tcId": "TC-07",
      "requirement": "FR-05",
      "testCase": "Booking tiket",
      "steps": "Pilih jadwal+jumlah, klik Pesan",
      "expected": "Data masuk Redux, alert sukses",
      "priority": "High"
    },
    {
      "tcId": "TC-08",
      "requirement": "FR-06",
      "testCase": "Tiket Saya",
      "steps": "Buka /my-tickets",
      "expected": "Daftar booking muncul",
      "priority": "High"
    },
    {
      "tcId": "TC-09",
      "requirement": "FR-07",
      "testCase": "Batalkan tiket",
      "steps": "Klik Batalkan",
      "expected": "Tiket terhapus, alert sukses",
      "priority": "Medium"
    },
    {
      "tcId": "TC-10",
      "requirement": "NFR-01",
      "testCase": "TypeScript compile",
      "steps": "npx tsc --noEmit",
      "expected": "Zero type errors",
      "priority": "High"
    }
  ],
  "changeGuide": [
    {
      "title": "v1.0 Initial Release",
      "changedFiles": [
        "src/App.tsx",
        "src/store/store.ts",
        "src/store/filmSlice.ts",
        "src/store/bookingSlice.ts",
        "src/types/film.ts",
        "src/types/booking.ts",
        "src/pages/KatalogPage.tsx",
        "src/pages/DetailPage.tsx",
        "src/pages/TiketSayaPage.tsx",
        "src/components/FilmCard.tsx",
        "src/hooks/useAppDispatch.ts",
        "src/hooks/useAppSelector.ts",
        "src/utils/localStorageSync.ts",
        "README.md"
      ],
      "migrationImpact": "Tidak ada migrasi. Aplikasi frontend murni.",
      "configImpact": "Tidak ada konfigurasi server.",
      "compatibility": "Rilis pertama.",
      "rollback": "Git checkout ke commit sebelumnya."
    }
  ],
  "appendices": {
    "glossary": [
      {
        "term": "AsyncThunk",
        "def": "Fungsi RTK untuk side effect async"
      },
      {
        "term": "MUI",
        "def": "Material UI library komponen React"
      },
      {
        "term": "Redux Store",
        "def": "Global state manager aplikasi"
      },
      {
        "term": "TVMaze API",
        "def": "API publik data acara TV/film"
      },
      {
        "term": "TypeScript",
        "def": "Superset JavaScript type-safe"
      },
      {
        "term": "Vite",
        "def": "Build tool frontend modern"
      }
    ]
  }
};