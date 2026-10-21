/**
 * generate.js — Universal .docx Generator
 * ─────────────────────────────────────────
 * Satu script untuk semua jenis dokumen: laporan, proposal, memo, README, dll.
 *
 * Cara pakai:
 *   1. Edit bagian CONTENT di bawah
 *   2. node generate.js
 *   3. Buka output/dokumen.docx
 *
 * Block types yang tersedia:
 *   { type: "p",        text }                         — paragraf
 *   { type: "p",        text, bold / italic / muted }  — paragraf dengan style
 *   { type: "quote",    text }                         — blockquote / callout teks
 *   { type: "table",    headers, rows }                — tabel data
 *   { type: "list",     items, ordered? }              — bullet / numbered list
 *   { type: "keyval",   pairs: [{key, val}] }          — dua kolom key–value
 *   { type: "divider" }                                — garis pemisah
 *   { type: "gap" }                                    — spasi kosong
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer, VerticalAlign, TableOfContents,
} = require("docx");
const fs   = require("fs");
const path = require("path");

// ═════════════════════════════════════════════════════════════════════════════
// CONTENT — edit bagian ini sesuai dokumen yang mau dibuat
// ═════════════════════════════════════════════════════════════════════════════

const CONTENT = {

  // ── Metadata dokumen ───────────────────────────────────────────────────────
  meta: {
    title:           "Judul Dokumen",
    subtitle:        "Subjudul atau scope",
    author:          "Nama / Tim",
    date:            "30 Juni 2025",
    confidentiality: "Internal",   // muncul di footer — kosongkan jika tidak perlu
    filename:        "dokumen",    // nama file output (tanpa .docx)
  },

  // ── Highlight box di awal (opsional — hapus key ini jika tidak perlu) ──────
  // Cocok untuk: ringkasan eksekutif, TL;DR, status project
  summary: [
    { label: "Temuan:      ", value: "Tulis poin terpenting. Pakai angka." },
    { label: "Dampak:      ", value: "Apa konsekuensinya?" },
    { label: "Rekomendasi: ", value: "Apa yang harus dilakukan, kapan." },
  ],

  // ── Isi dokumen ────────────────────────────────────────────────────────────
  // Setiap section punya title (H1) dan subsections.
  // Setiap subsection punya title opsional (H2) dan array of blocks.
  sections: [
    {
      title: "1. Konteks",
      subsections: [
        {
          title: null,   // null = tidak ada H2
          content: [
            { type: "p", text: "Jelaskan latar belakang. Satu paragraf = satu ide." },
            { type: "p", text: "Tulis kalimat yang langsung ke inti. Bukan setup." },
          ],
        },
      ],
    },
    {
      title: "2. Temuan",
      subsections: [
        {
          title: "2.1 Data",
          content: [
            { type: "p", text: "Deskripsikan temuan. Selalu sertakan angka." },
            {
              type: "table",
              headers: ["Metrik", "Sebelum", "Sesudah", "Delta"],
              rows: [
                ["Response time", "180 ms", "520 ms", "+340 ms ▲"],
                ["Error rate",    "0.1%",   "2.4%",   "+2.3% ▲" ],
                ["Throughput",    "800 rps", "800 rps", "—"      ],
              ],
            },
          ],
        },
        {
          title: "2.2 Penyebab",
          content: [
            { type: "p", text: "Jelaskan kenapa. Jangan cuma report angka — interpret." },
            {
              type: "list",
              items: [
                "Query N+1 di endpoint /checkout — 13 query per transaksi, harusnya 1.",
                "Cache Redis expired sejak deploy 12 Juni, tidak ada alerting.",
                "Read replica belum dipakai — semua traffic ke primary.",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "3. Rekomendasi",
      subsections: [
        {
          title: null,
          content: [
            { type: "p", text: "Rekomendasi harus actionable: siapa, apa, kapan." },
            {
              type: "keyval",
              pairs: [
                { key: "Fix query N+1",         val: "Backend team · Sprint 12 · estimasi 2 hari" },
                { key: "Restore Redis cache",    val: "Platform team · sekarang · < 1 jam"        },
                { key: "Setup read replica",     val: "Infra team · Sprint 13 · estimasi 1 sprint" },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "4. Risiko",
      subsections: [
        {
          title: null,
          content: [
            { type: "quote", text: "Estimasi Rp 140 juta/bulan mengasumsikan kurva konversi linear. Kenyataannya tidak — angka aktual bisa lebih besar." },
            { type: "p",     text: "Cache invalidation perlu mekanisme push saat stok mencapai 0, bukan hanya TTL." },
          ],
        },
      ],
    },
  ],

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer_contact: "platform-eng@company.com",
  footer_version: "v1.0 · Draft",
};


// ═════════════════════════════════════════════════════════════════════════════
// ENGINE — tidak perlu diedit
// ═════════════════════════════════════════════════════════════════════════════

// ── Token ────────────────────────────────────────────────────────────────────
const T = {
  blue:    "1A56A0",
  dark:    "1A1A1A",
  gray:    "5A5A5A",
  muted:   "888888",
  bgBlue:  "EEF3FA",
  bgQuote: "F5F5F5",
  border:  "CCCCCC",
  stripe:  "F7F9FC",
};

const PAGE_W   = 9360; // content width in DXA (1440 DXA = 1 inch)
const b1       = { style: BorderStyle.SINGLE, size: 1, color: T.border };
const BORDERS  = { top: b1, bottom: b1, left: b1, right: b1 };
const NO_BORDER = { style: BorderStyle.NONE };
const ALL_NONE = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

// ── Primitive: TextRun ───────────────────────────────────────────────────────
function tr(text, opts = {}) {
  return new TextRun({
    text,
    font:    "Arial",
    size:    opts.size    ?? 22,
    bold:    opts.bold    ?? false,
    italics: opts.italic  ?? false,
    color:   opts.color   ?? T.dark,
    children: opts.children,
  });
}

// ── Primitive: Paragraph ─────────────────────────────────────────────────────
function p(runs, opts = {}) {
  return new Paragraph({
    heading:   opts.heading,
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing:   { before: opts.before ?? 0, after: opts.after ?? 160 },
    border:    opts.border,
    numbering: opts.numbering,
    children:  Array.isArray(runs) ? runs : [runs],
  });
}

// ── Headings ─────────────────────────────────────────────────────────────────
function h1(text) {
  return p(
    [tr(text, { size: 34, bold: true, color: T.blue })],
    {
      heading: HeadingLevel.HEADING_1,
      before:  400,
      after:   140,
      border:  { bottom: { style: BorderStyle.SINGLE, size: 6, color: T.blue } },
    }
  );
}

function h2(text) {
  return p(
    [tr(text, { size: 24, bold: true, color: T.dark })],
    { heading: HeadingLevel.HEADING_2, before: 280, after: 100 }
  );
}

// ── Block renderers ───────────────────────────────────────────────────────────

function renderP(block) {
  const color = block.muted ? T.muted : T.dark;
  return p([tr(block.text, { bold: block.bold, italic: block.italic, color })]);
}

function renderQuote(block) {
  return new Table({
    width:        { size: PAGE_W, type: WidthType.DXA },
    columnWidths: [PAGE_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top:    NO_BORDER,
              bottom: NO_BORDER,
              right:  NO_BORDER,
              left:   { style: BorderStyle.SINGLE, size: 16, color: T.blue },
            },
            shading:  { fill: T.bgQuote, type: ShadingType.CLEAR },
            margins:  { top: 120, bottom: 120, left: 200, right: 160 },
            width:    { size: PAGE_W, type: WidthType.DXA },
            children: [p([tr(block.text, { italic: true, color: T.gray, size: 21 })], { after: 0 })],
          }),
        ],
      }),
    ],
  });
}

function shouldCenter(val) {
  const v = (val || "").trim();
  if (!v) return false;
  if (/^[\d\.\%\$\-\+\/\—\*▲▼\s]+$/.test(v)) return true;
  if (v.length <= 15 && /^(ya|tidak|yes|no|ok|done|active|pending|failed|error|info|warning|caution|tip|rev|version|get|post|put|delete)$/i.test(v)) return true;
  if (v.startsWith("http") || v.startsWith("/")) return true;
  return false;
}

function renderTable(block) {
  const cols      = block.headers.length;
  const colW      = Math.floor(PAGE_W / cols);
  const colWidths = block.headers.map(() => colW);

  const headerRow = new TableRow({
    children: block.headers.map((h, i) =>
      new TableCell({
        borders: BORDERS,
        shading: { fill: T.blue, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        width:   { size: colWidths[i], type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        children: [p(
          [tr(h, { bold: true, size: 18, color: "FFFFFF" })],
          { align: AlignmentType.CENTER, after: 0 }
        )],
      })
    ),
  });

  const dataRows = block.rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) => {
        const center = shouldCenter(cell);
        return new TableCell({
          borders: BORDERS,
          shading: { fill: ri % 2 === 0 ? "FFFFFF" : T.stripe, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          width:   { size: colWidths[ci], type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          children: [p(
            [tr(cell, { size: 18 })],
            { align: center ? AlignmentType.CENTER : AlignmentType.LEFT, after: 0 }
          )],
        });
      }),
    })
  );

  return new Table({
    width:        { size: PAGE_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows:         [headerRow, ...dataRows],
  });
}

function renderList(block, ref) {
  return block.items.map((item) =>
    p([tr(item)], { numbering: { reference: ref, level: 0 }, after: 80 })
  );
}

function renderKeyval(block) {
  const keyW = Math.floor(PAGE_W * 0.38);
  const valW = PAGE_W - keyW;

  return block.pairs.map((pair, ri) =>
    new Table({
      width:        { size: PAGE_W, type: WidthType.DXA },
      columnWidths: [keyW, valW],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: BORDERS,
              shading: { fill: ri % 2 === 0 ? T.bgBlue : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              width:   { size: keyW, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [p([tr(pair.key, { bold: true, size: 19 })], { after: 0 })],
            }),
            new TableCell({
              borders: BORDERS,
              shading: { fill: ri % 2 === 0 ? "FFFFFF" : T.stripe, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              width:   { size: valW, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [p([tr(pair.val, { size: 19, color: T.gray })], { after: 0 })],
            }),
          ],
        }),
      ],
    })
  );
}

function renderDivider() {
  return p([tr("")], {
    before: 160,
    after:  160,
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: T.border } },
  });
}

function renderGap() {
  return p([tr("")], { after: 240 });
}

// ── Block dispatcher ──────────────────────────────────────────────────────────
function renderBlock(block, numbering) {
  switch (block.type) {
    case "p":       return renderP(block);
    case "quote":   return renderQuote(block);
    case "table":   return [renderTable(block), renderGap()];
    // case "list" handled in flatRender so ordered lists reset per block
    case "keyval":  return renderKeyval(block);
    case "divider": return renderDivider();
    case "gap":     return renderGap();
    default:        return p([tr(`[unknown block type: ${block.type}]`, { color: "FF0000" })]);
  }
}

function flatRender(blocks, numbering) {
  numbering._counter ??= 0;
  return blocks.flatMap((b) => {
    if (b.type === "list") {
      const idx = ++numbering._counter;
      const ref = b.ordered ? `numbers-${idx}` : `bullets-${idx}`;
      numbering.config.push({
        reference: ref,
        levels: [{
          level: 0,
          format: b.ordered ? LevelFormat.DECIMAL : LevelFormat.BULLET,
          text: b.ordered ? "%1." : "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      });
      return renderList(b, ref);
    }
    const result = renderBlock(b, numbering);
    return Array.isArray(result) ? result : [result];
  });
}

// ── Summary callout box ───────────────────────────────────────────────────────
function renderSummary(lines) {
  const rows = lines.map((l, i) =>
    p([tr(l.label, { bold: true, size: 20 }), tr(l.value, { size: 20, color: T.gray })],
      { before: i === 0 ? 0 : 80, after: 0 })
  );
  return new Table({
    width:        { size: PAGE_W, type: WidthType.DXA },
    columnWidths: [PAGE_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 8, color: T.blue },
              bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
            },
            shading:  { fill: T.bgBlue, type: ShadingType.CLEAR },
            margins:  { top: 160, bottom: 160, left: 200, right: 200 },
            width:    { size: PAGE_W, type: WidthType.DXA },
            children: rows,
          }),
        ],
      }),
    ],
  });
}

// ── Cover ─────────────────────────────────────────────────────────────────────
function renderCover(meta) {
  return [
    p([tr(meta.title, { size: 52, bold: true, color: T.blue })], { before: 1200, after: 120 }),
    p([tr(meta.subtitle ?? "", { size: 28, color: T.gray })],     { after: 80  }),
    p([tr([meta.author, meta.date].filter(Boolean).join(" · "), { size: 20, color: T.muted })], { after: 0 }),
  ];
}

// ── Header & footer ───────────────────────────────────────────────────────────
function makeHeader(meta) {
  const label = [meta.title, meta.subtitle].filter(Boolean).join(" — ");
  return new Header({
    children: [
      p([tr(label, { size: 18, color: T.muted })], {
        after:  0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: T.border } },
      }),
    ],
  });
}

function makeFooter(meta) {
  const parts = [meta.confidentiality, meta.footer_contact, meta.footer_version].filter(Boolean);
  return new Footer({
    children: [
      p(
        [
          tr(parts.join("  ·  ") + (parts.length ? "  ·  Hal. " : "Hal. "), { size: 18, color: T.muted }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: T.muted, font: "Arial" }),
        ],
        { border: { top: { style: BorderStyle.SINGLE, size: 4, color: T.border } } }
      ),
    ],
  });
}

// ── Document assembler ────────────────────────────────────────────────────────
function buildDocument(content) {
  const { meta, summary, sections } = content;

  // Numbering config — dipakai oleh renderList
  const numbering = {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  };

  // Body
  const body = [
    ...renderCover(meta),
    p([tr("")], { after: 280 }),
    ...(meta.toc !== false ? [new TableOfContents("Daftar Isi", { headingStyleRange: "1-3", hyperlink: true }), p([tr("")], { after: 240 })] : []),
    ...(summary ? [renderSummary(summary), p([tr("")], { after: 240 })] : []),
    ...sections.flatMap((section) => [
      h1(section.title),
      ...section.subsections.flatMap((sub) => [
        ...(sub.title ? [h2(sub.title)] : []),
        ...flatRender(sub.content, numbering),
      ]),
    ]),
    // Footer bar
    p([tr("")], {
      before:  400,
      after:   80,
      border:  { top: { style: BorderStyle.SINGLE, size: 4, color: T.border } },
    }),
    ...(meta.footer_contact
      ? [p([tr(meta.footer_contact, { size: 18, color: T.muted })], { after: 60 })]
      : []),
    ...(meta.footer_version
      ? [p([tr(meta.footer_version, { size: 18, color: T.muted })], { after: 0 })]
      : []),
  ];

  return new Document({
    numbering,
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
          run: { size: 34, bold: true, font: "Arial", color: T.blue },
          paragraph: { spacing: { before: 400, after: 140 }, outlineLevel: 0 },
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
          run: { size: 24, bold: true, font: "Arial", color: T.blue },
          paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 },
        },
        {
          id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
          run: { size: 20, bold: true, font: "Arial", color: T.blue },
          paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size:   { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: { default: makeHeader(meta) },
      footers: { default: makeFooter(meta) },
      children: body,
    }],
  });
}

// ── Run ───────────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, "output");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const doc     = buildDocument(CONTENT);
const outFile = path.join(outDir, `${CONTENT.meta.filename ?? "dokumen"}.docx`);

Packer.toBuffer(doc)
  .then((buf) => {
    fs.writeFileSync(outFile, buf);
    console.log(`✓  ${outFile}`);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
