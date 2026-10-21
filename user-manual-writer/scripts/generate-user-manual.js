const e = require('../../_shared/docx-engine');
const path = require('path');

const MANUAL = {
  meta: { title:'Website Desa Sitiwinangun', subtitle:'User Manual', role:'Administrator', version:'1.0', date:'2026-06-29', author:'Tim Dokumentasi', organization:'Universitas Telkom', filename:'UserManual_Role' },
  overview: {
    intro:'Manual ini menjadi panduan resmi bagi Administrator untuk menggunakan sistem.',
    purpose:'Membantu pengguna menyelesaikan tugas utama secara benar dan konsisten.',
    scope:'Login, dashboard, manajemen konten, pengaturan akun.',
    outOfScope:['Fitur yang sudah dihapus dari UI final'],
  },
  conventions: [
    ['Teks tebal','Tombol, menu, field, status, atau label UI'],
    ['Monospace','URL, path file, atau placeholder'],
    ['Menu > Submenu','Navigasi berantai'],
    ['NOTE','Informasi pelengkap'],
  ],
  requirements: [
    ['Browser','Chrome, Edge, Firefox, Safari versi terbaru'],
    ['Koneksi','Internet stabil'],
    ['Akun','Akun sesuai peran pengguna'],
  ],
  tasks: [
    { title:'Masuk ke Dashboard', objective:'Login ke panel administrator.', preconditions:'Browser dan kredensial tersedia.', expected:'Dashboard admin tampil.', steps:[
      ['Buka alamat website admin.','Halaman login muncul.'],
      ['Isi email dan password.','Form terisi.'],
      ['Klik tombol Masuk ke Dashboard.','Dashboard admin tampil.'],
    ]},
    { title:'Mengelola Konten', objective:'Menambah, mengubah, dan menghapus konten.', preconditions:'Admin sudah login.', expected:'Konten tersimpan dan tampil di daftar.', steps:[
      ['Klik menu terkait di sidebar.','Daftar konten tampil.'],
      ['Klik tombol Tambah Baru.','Form konten tampil.'],
      ['Isi field yang tersedia.','Data siap disimpan.'],
      ['Klik Simpan.','Notifikasi sukses muncul.'],
    ]},
  ],
  troubleshooting: [
    ['Tidak dapat login','Email/password salah','Periksa kredensial dan coba lagi'],
    ['Data tidak tersimpan','Field wajib kosong','Lengkapi field wajib'],
  ],
  glossary: [
    ['Dashboard','Halaman utama panel admin'],
    ['Sidebar','Panel navigasi samping'],
  ],
  faq: [
    ['Apakah perlu coding?','Tidak. Pengguna cukup mengisi form.'],
    ['Apakah bisa dibuka dari HP?','Bisa, tetapi admin disarankan memakai laptop.'],
  ],
  screenshots: [
    ['Halaman Login Admin','admin_01_login.png'],
    ['Dashboard Admin','admin_02_dashboard.png'],
  ],
};

function build(m) {
  const b = [];
  b.push(...e.cover(m.meta));
  b.push(...e.revisionHistory([{ version:m.meta.version, date:m.meta.date, author:m.meta.author, description:'Dokumen final berdasarkan validasi UI' }]));
  b.push(...e.tocSection(), e.br());

  b.push(e.h(0,'Pendahuluan'));
  b.push(e.p(m.overview.intro));
  b.push(e.p(m.overview.purpose));
  b.push(e.p('Lingkup dokumen: ' + m.overview.scope));
  if (m.overview.outOfScope.length) b.push(e.p('Di luar scope: ' + m.overview.outOfScope.join(', ')));

  b.push(e.h(0,'Konvensi Dokumen'));
  b.push(e.tbl({headers:['Format / Simbol','Arti'], rows:m.conventions, columnDefs:[{w:3000,align:'left'},{w:e.DXA.CONTENT_W-3000,align:'left'}]}));

  b.push(e.h(0,'Persyaratan Sistem'));
  b.push(e.tbl({headers:['Komponen','Kebutuhan'], rows:m.requirements, columnDefs:[{w:2500,align:'left'},{w:e.DXA.CONTENT_W-2500,align:'left'}]}));

  b.push(e.h(0,'Panduan Operasional'));
  for (const task of m.tasks) {
    b.push(e.h(1, task.title));
    b.push(e.p('Tujuan: ' + task.objective));
    b.push(e.p('Prasyarat: ' + task.preconditions));
    b.push(e.tbl({
      headers:['No','Aksi Pengguna','Hasil Sistem'],
      rows:task.steps.map((s,i)=>[String(i+1),s[0],s[1]]),
      columnDefs:[{w:600,align:'center'},{w:4200,align:'left'},{w:e.DXA.CONTENT_W-4800,align:'left'}],
    }));
    b.push(e.p('Hasil akhir: ' + task.expected));
  }

  b.push(e.h(0,'Troubleshooting'));
  b.push(e.tbl({headers:['Masalah / Gejala','Kemungkinan Penyebab','Solusi'], rows:m.troubleshooting, columnDefs:[{w:3000,align:'left'},{w:3000,align:'left'},{w:e.DXA.CONTENT_W-6000,align:'left'}]}));

  b.push(e.h(0,'Glosarium'));
  b.push(e.tbl({headers:['Istilah','Definisi'], rows:m.glossary, columnDefs:[{w:3000,align:'left'},{w:e.DXA.CONTENT_W-3000,align:'left'}]}));

  b.push(e.h(0,'FAQ'));
  b.push(e.tbl({headers:['Pertanyaan','Jawaban'], rows:m.faq, columnDefs:[{w:4000,align:'left'},{w:e.DXA.CONTENT_W-4000,align:'left'}]}));

  b.push(e.h(0,'Lampiran Screenshot Validasi UI'));
  for (const [title,file] of m.screenshots) {
    b.push(e.h(1,title));
    b.push(e.figCaption(title));
    b.push(e.p('File screenshot: ' + file));
  }

  return e.assemble(m.meta, b);
}

const outDir = path.join(__dirname,'..','output');
if (!require('fs').existsSync(outDir)) require('fs').mkdirSync(outDir,{recursive:true});
e.save(build(MANUAL), path.join(outDir,`${MANUAL.meta.filename}.docx`));
