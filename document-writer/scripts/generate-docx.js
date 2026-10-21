'use strict';

const e = require('../../_shared/docx-engine');
const path = require('path');

const meta = {
  title: 'Motivation Letter',
  subtitle: 'Fullstack Developer Intern Application',
  project: 'Career Development',
  organization: 'Telkom University',
  version: '1.0',
  preparedBy: 'Habib (Haafzd)',
  reviewedBy: 'Ace (AI Companion)',
  confidential: false
};

const revisions = [
  { version: '1.0', date: '08/07/2026', author: 'Habib (Haafzd)', description: 'Initial draft for Fullstack Intern position' }
];

const content = [
  e.h(0, 'Surat Lamaran Magang'),
  e.sp(),
  
  e.p('Kepada Yth. Hiring Manager,', { bold: true }),
  e.sp(),
  
  e.p('Saya menulis surat ini untuk menyatakan ketertarikan kuat saya terhadap posisi Fullstack Developer Intern. Sebagai mahasiswa semester 6 S1 Rekayasa Perangkat Lunak di Telkom University, saya membawa pengalaman praktis dalam pengembangan frontend dan backend, serta ketertarikan mendalam pada cara kerja sistem secara menyeluruh (end-to-end).'),
  e.sp(),
  
  e.h(1, 'Landasan Teknis'),
  e.p('Keahlian backend saya mencakup beberapa framework utama seperti Java (Spring Boot), Go, PHP (Laravel), .NET Core, dan Python. Saya telah membangun dan menerapkan RESTful API, merancang database, serta mengimplementasikan alur otentikasi dan otorisasi yang aman. Di sisi frontend, saya terbiasa bekerja dengan HTML/CSS/JS, Tailwind CSS, dan Flutter untuk menghasilkan antarmuka pengguna yang responsif dan terintegrasi baik dengan logika backend.'),
  e.sp(),
  
  e.h(1, 'Eksposur AI & Cybersecurity'),
  e.p('Di luar pengembangan fullstack konvensional, saya secara aktif mempelajari machine learning menggunakan PyTorch dan HuggingFace baik melalui mata kuliah maupun proyek pribadi. Bidang keamanan siber juga menjadi fokus studi mandiri saya, di mana saya mempelajari praktik pengkodean aman (secure coding), fondasi OWASP, dan perancangan sistem yang tangguh terhadap ancaman. Pemahaman lintas disiplin ini membantu saya menulis kode yang lebih aman dan terstruktur.'),
  e.sp(),
  
  e.h(1, 'Metodologi Kerja'),
  e.p('Saya mendekati pengembangan perangkat lunak secara pragmatis: mengutamakan pustaka standar (stdlib) dan fitur bawaan platform sebelum menambahkan pustaka eksternal, menjaga pemisahan tanggung jawab (separation of concerns) tanpa abstraksi yang berlebihan, dan selalu menyertakan minimal satu pengujian yang dapat dijalankan untuk logika non-trivial. Saya menghargai kode yang benar, mudah dibaca, dan efisien.'),
  e.sp(),
  
  e.h(1, 'Tujuan Magang'),
  e.p('Melalui program magang ini, saya ingin berkontribusi langsung pada produk nyata, berkolaborasi dengan tim engineer profesional, dan memperdalam pemahaman saya tentang arsitektur fullstack skala besar. Magang ini sangat selaras dengan tujuan karier saya untuk menjadi developer yang mampu menangani fitur dari tingkat skema database hingga ke bagian deployment frontend.'),
  e.sp(),
  
  e.p('Saya menyambut baik kesempatan untuk berdiskusi lebih lanjut mengenai kontribusi yang dapat saya berikan kepada tim Anda. Terima kasih atas waktu dan pertimbangannya.'),
  e.sp(),
  
  e.p('Hormat Saya,'),
  e.p('Habib (Haafzd)', { bold: true })
];

const doc = e.assemble(meta, [
  // cover page — no table, so strict validator needs no cover caption
  e.h0(0, meta.title),
  e.p(meta.subtitle, { bold: true, size: 28, color: e.CLR.H2_TEXT }),
  e.sp(),
  e.p(`Prepared by: ${meta.preparedBy}`),
  e.p(`Organization: ${meta.organization}`),
  e.p(`Version: ${meta.version}`),
  e.p('Date: 08/07/2026'),
  e.br(),

  ...e.tocSection(),

  // revision history — inline to avoid heading numbering issue
  e.p('Riwayat Revisi', { bold: true, size: 28 }),
  e.sp(),
  e.tbl({
    headers    : ['Versi', 'Tanggal', 'Penulis', 'Deskripsi Perubahan'],
    rows       : revisions.map(r => [r.version, r.date, r.author, r.description]),
    columnDefs : [
      { w: 1100, align: 'center' },
      { w: 1900, align: 'center' },
      { w: 2200, align: 'left'   },
      { w: e.DXA.CONTENT_W - 5200, align: 'left' },
    ],
  }),
  e.tblCaption('Riwayat Revisi Dokumen'),
  e.br(),
  ...content
]);

const outPath = path.resolve(__dirname, '../../../../.openclaw/workspace/Motivation_Letter_Habib.docx');
e.save(doc, outPath).then(() => {
  console.log('DOCX generation finished.');
}).catch(err => {
  console.error('Error during DOCX generation:', err);
  process.exit(1);
});
