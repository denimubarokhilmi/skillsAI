'use strict';
/**
 * docx-engine.js  — Shared DOCX generation engine
 *
 * Enforces:
 *   ✅ Heading numbering via Word native list (1 / 1.1 / 1.1.1)
 *   ✅ TOC via Word field code (auto-update on open / F9)
 *   ✅ Per-column table alignment  (header=CENTER, No=CENTER, short=CENTER, desc=LEFT)
 *   ✅ Auto-incrementing table & figure captions
 *   ✅ Cover page, Revision history, Header/Footer with page numbers
 *   ✅ A4, 1-inch margins, Calibri 11pt body
 *
 * USAGE (in your generator script):
 *   const e = require('./docx-engine');
 *   const doc = e.assemble(meta, [ ...e.cover(meta), ...e.toc(), ...e.revisionHistory(revs), yourContent ]);
 *   await e.save(doc, '/mnt/user-data/outputs/output.docx');
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition,
} = require('docx');
const fs = require('fs');

// ─────────────────────────────────────────────────────────────────
// PAGE GEOMETRY  (A4 portrait, 1-inch / 1440 DXA margins)
// ─────────────────────────────────────────────────────────────────
const DXA = {
  PAGE_W  : 11906,
  PAGE_H  : 16838,
  MARGIN  : 1440,
  CONTENT_W: 9026,   // 11906 − 2 × 1440
};

// ─────────────────────────────────────────────────────────────────
// BRAND PALETTE  (corporate blue theme, swap CLR.PRIMARY to rebrand)
// ─────────────────────────────────────────────────────────────────
const CLR = {
  PRIMARY   : '2E5496',
  H1_TEXT   : '1F3864',
  H2_TEXT   : '2E5496',
  H3_TEXT   : '404040',
  BODY      : '000000',
  TH_BG     : '2E5496',   // table header background
  TH_TXT    : 'FFFFFF',   // table header text
  TR_ALT    : 'EBF3FB',   // alternate data row
  CAPTION   : '595959',
  BORDER    : 'BFBFBF',
  MUTED     : '808080',
};

// ─────────────────────────────────────────────────────────────────
// NUMBERING CONFIG
// h-num  → heading multilevel  1 / 1.1 / 1.1.1
// bullet → unordered list      • / ◦
// ol     → ordered list        1. / 2. / …
// ─────────────────────────────────────────────────────────────────
const NUMBERING = {
  config: [
    {
      reference: 'h-num',
      levels: [
        {
          level: 0, format: LevelFormat.DECIMAL, text: '%1',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 0, hanging: 0 } },
            style: 'Heading 1',
          },
        },
        {
          level: 1, format: LevelFormat.DECIMAL, text: '%1.%2',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 0, hanging: 0 } },
            style: 'Heading 2',
          },
        },
        {
          level: 2, format: LevelFormat.DECIMAL, text: '%1.%2.%3',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 0, hanging: 0 } },
            style: 'Heading 3',
          },
        },
      ],
    },
    {
      reference: 'bullet',
      levels: [
        {
          level: 0, format: LevelFormat.BULLET, text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
        {
          level: 1, format: LevelFormat.BULLET, text: '\u25E6',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
        },
      ],
    },
    {
      reference: 'ol',
      levels: [
        {
          level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// STYLES  (override Word built-ins by exact ID)
// outlineLevel is MANDATORY for TOC and Navigation Pane
// ─────────────────────────────────────────────────────────────────
const STYLES = {
  default: {
    document: { run: { font: 'Calibri', size: 22 } }, // 11 pt
  },
  paragraphStyles: [
    {
      id: 'Heading1', name: 'Heading 1',
      basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { bold: true, font: 'Calibri', size: 36, color: CLR.H1_TEXT },
      paragraph: {
        spacing: { before: 480, after: 120 },
        outlineLevel: 0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CLR.PRIMARY, space: 4 } },
      },
    },
    {
      id: 'Heading2', name: 'Heading 2',
      basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { bold: true, font: 'Calibri', size: 28, color: CLR.H2_TEXT },
      paragraph: { spacing: { before: 320, after: 80 }, outlineLevel: 1 },
    },
    {
      id: 'Heading3', name: 'Heading 3',
      basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { bold: true, font: 'Calibri', size: 24, color: CLR.H3_TEXT },
      paragraph: { spacing: { before: 240, after: 60 }, outlineLevel: 2 },
    },
    {
      id: 'Caption', name: 'Caption',
      basedOn: 'Normal', next: 'Normal',
      run: { italics: true, font: 'Calibri', size: 18, color: CLR.CAPTION },
      paragraph: { spacing: { before: 60, after: 160 }, alignment: AlignmentType.CENTER },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// HEADING BUILDERS
// h(level, text)  → numbered heading (use for all body sections)
// h0(level, text) → un-numbered heading (TOC title, cover sections)
//
// RULE: NEVER put the number in the text — the Word list engine does it.
// RULE: NEVER use an empty text string — validator will catch it.
// ─────────────────────────────────────────────────────────────────
const HL = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3];

function h(level, text) {
  if (level < 0 || level > 2) throw new Error(`Invalid heading level: ${level}`);
  if (!text || !text.trim())  throw new Error(`Empty heading at level ${level} — text is required`);
  return new Paragraph({
    heading : HL[level],
    numbering: { reference: 'h-num', level },
    children : [new TextRun({ text, font: 'Calibri' })],
  });
}

function h0(level, text) {
  if (!text || !text.trim()) throw new Error(`Empty un-numbered heading at level ${level}`);
  return new Paragraph({
    heading : HL[level],
    children: [new TextRun({ text, font: 'Calibri' })],
  });
}

// ─────────────────────────────────────────────────────────────────
// PARAGRAPH HELPERS
// ─────────────────────────────────────────────────────────────────
function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing  : { before: 0, after: 160, line: 276 },
    children : [new TextRun({
      text,
      font   : opts.font    || 'Calibri',
      size   : opts.size    || 22,
      bold   : opts.bold    || false,
      italics: opts.italics || false,
      color  : opts.color   || CLR.BODY,
    })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullet', level },
    spacing  : { before: 40, after: 40 },
    children : [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function li(text) {
  return new Paragraph({
    numbering: { reference: 'ol', level: 0 },
    spacing  : { before: 40, after: 40 },
    children : [new TextRun({ text, font: 'Calibri', size: 22 })],
  });
}

function br() { return new Paragraph({ children: [new PageBreak()] }); }
function sp() { return new Paragraph({ spacing: { before: 0, after: 120 }, children: [] }); }

// ─────────────────────────────────────────────────────────────────
// CAPTIONS  (auto-incrementing, called BEFORE the table/figure)
// ─────────────────────────────────────────────────────────────────
let _tblN = 0, _figN = 0;
function resetCounters() { _tblN = 0; _figN = 0; }

function tblCaption(title) {
  return new Paragraph({
    style   : 'Caption',
    children: [new TextRun({
      text   : `Tabel ${++_tblN}. ${title}`,
      italics: true, font: 'Calibri', size: 18, color: CLR.CAPTION,
    })],
  });
}

function figCaption(title) {
  return new Paragraph({
    style   : 'Caption',
    children: [new TextRun({
      text   : `Gambar ${++_figN}. ${title}`,
      italics: true, font: 'Calibri', size: 18, color: CLR.CAPTION,
    })],
  });
}

// ─────────────────────────────────────────────────────────────────
// TABLE BUILDER  — enforced per-column alignment
//
// columnDefs: Array of { w: DXA_number, align: 'left'|'center'|'right' }
// headers: string[]
// rows: (string | { text, bold?, color? })[][]
//
// ALIGNMENT RULE:
//   headers       → always CENTER (hard-coded, never overridden)
//   No/ID cols    → align: 'center'
//   short values  → align: 'center'
//   long text     → align: 'left'
// ─────────────────────────────────────────────────────────────────
const ALIGN_MAP = {
  left  : AlignmentType.LEFT,
  center: AlignmentType.CENTER,
  right : AlignmentType.RIGHT,
};

function mkCell(content, opts = {}) {
  const text = typeof content === 'string' ? content : (content?.text ?? '');
  const bold = typeof content === 'object' ? (content.bold  ?? opts.bold  ?? false) : (opts.bold  ?? false);
  const clr  = typeof content === 'object' ? (content.color ?? opts.color ?? CLR.BODY) : (opts.color ?? CLR.BODY);
  return new TextRun({ text, bold, color: clr, font: 'Calibri', size: opts.size || 20 });
}

function tbl({ headers, rows, columnDefs, borderless = false }) {
  const totalW = columnDefs.reduce((s, c) => s + c.w, 0);
  const BD     = { style: BorderStyle.SINGLE, size: 4, color: CLR.BORDER };
  const noBD   = { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' };
  const borders = borderless
    ? { top: noBD, bottom: noBD, left: noBD, right: noBD, insideH: noBD, insideV: noBD }
    : { top: BD,   bottom: BD,   left: BD,   right: BD,   insideH: BD,   insideV: BD   };

  // ── header row ──
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => new TableCell({
      width        : { size: columnDefs[i].w, type: WidthType.DXA },
      shading      : borderless ? undefined : { fill: CLR.TH_BG, type: ShadingType.CLEAR },
      borders,
      margins      : { top: 100, bottom: 100, left: 150, right: 150 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,   // HEADER = always CENTER, no exception
        spacing  : { before: 0, after: 0 },
        children : [mkCell(hd, { bold: !borderless, color: borderless ? CLR.BODY : CLR.TH_TXT, size: 20 })],
      })],
    })),
  });

  // ── data rows ──
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => {
      const def   = columnDefs[ci];
      const align = ALIGN_MAP[def.align] || AlignmentType.LEFT;
      const fill  = (!borderless && ri % 2 === 1) ? CLR.TR_ALT : 'FFFFFF';
      return new TableCell({
        width        : { size: def.w, type: WidthType.DXA },
        shading      : { fill, type: ShadingType.CLEAR },
        borders,
        margins      : { top: 80, bottom: 80, left: 150, right: 150 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: align,
          spacing  : { before: 0, after: 0 },
          children : [mkCell(cell, { size: 20 })],
        })],
      });
    }),
  }));

  return new Table({
    width      : { size: totalW, type: WidthType.DXA },
    columnWidths: columnDefs.map(c => c.w),
    rows       : [headerRow, ...dataRows],
  });
}

// ─────────────────────────────────────────────────────────────────
// COVER PAGE
// ─────────────────────────────────────────────────────────────────
function cover(meta) {
  const {
    title, subtitle = '', organization = '', project = '',
    version = '1.0',
    date    = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    preparedBy = '', reviewedBy = '', confidential = false,
  } = meta;

  const metaRows = [
    ['Proyek',       project || title],
    ['Organisasi',   organization],
    ['Versi Dokumen', version],
    ['Tanggal',      date],
    ...(preparedBy  ? [['Dibuat oleh',    preparedBy ]] : []),
    ...(reviewedBy  ? [['Diperiksa oleh', reviewedBy ]] : []),
    ...(confidential? [['Klasifikasi',    'CONFIDENTIAL — RAHASIA']] : []),
  ];

  return [
    // top accent rule
    new Paragraph({
      spacing: { before: 0, after: 720 },
      border : { bottom: { style: BorderStyle.SINGLE, size: 24, color: CLR.PRIMARY, space: 0 } },
      children: [],
    }),
    // document title (32 pt)
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing  : { before: 0, after: 240 },
      children : [new TextRun({ text: title, bold: true, font: 'Calibri', size: 72, color: CLR.H1_TEXT })],
    }),
    // subtitle (16 pt)
    ...(subtitle ? [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing  : { before: 0, after: 720 },
        children : [new TextRun({ text: subtitle, font: 'Calibri', size: 36, color: CLR.H2_TEXT })],
      }),
    ] : [sp(), sp(), sp(), sp(), sp()]),
    // meta info table (borderless, no header bg)
    tbl({
      headers    : ['', ''],
      rows       : metaRows,
      columnDefs : [
        { w: 2500, align: 'left' },
        { w: DXA.CONTENT_W - 2500, align: 'left' },
      ],
      borderless : true,
    }),
    br(),  // page break after cover
  ];
}

// ─────────────────────────────────────────────────────────────────
// REVISION HISTORY
// revisions: [{ version, date, author, description }]
// ─────────────────────────────────────────────────────────────────
function revisionHistory(revisions) {
  const historyTable = tbl({
    headers    : ['Versi', 'Tanggal', 'Penulis', 'Deskripsi Perubahan'],
    rows       : revisions.map(r => [r.version, r.date, r.author, r.description]),
    columnDefs : [
      { w: 1100, align: 'center' },
      { w: 1900, align: 'center' },
      { w: 2200, align: 'left'   },
      { w: DXA.CONTENT_W - 5200, align: 'left' },
    ],
  });
  return [
    h0(0, 'Riwayat Revisi'),
    sp(),
    historyTable,
    tblCaption('Riwayat Revisi Dokumen'),
    br(),
  ];
}

// ─────────────────────────────────────────────────────────────────
// TABLE OF CONTENTS  (native Word field — updates on open / F9)
// ─────────────────────────────────────────────────────────────────
function tocSection() {
  return [
    h0(0, 'Daftar Isi'),
    new TableOfContents('Daftar Isi', {
      hyperlink        : true,
      headingStyleRange: '1-3',
    }),
    br(),
  ];
}

// ─────────────────────────────────────────────────────────────────
// HEADER / FOOTER
// ─────────────────────────────────────────────────────────────────
function headerFooter(meta) {
  const { title = '', version = '', organization = '' } = meta;
  const rightText = [organization, title].filter(Boolean).join('  |  ');

  return {
    headers: {
      default: new Header({
        children: [new Paragraph({
          spacing : { before: 0, after: 0 },
          border  : { bottom: { style: BorderStyle.SINGLE, size: 4, color: CLR.PRIMARY, space: 4 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: `v${version}`, font: 'Calibri', size: 16, color: CLR.MUTED }),
            new TextRun({ text: `\t${rightText}`, font: 'Calibri', size: 16, color: CLR.MUTED }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          spacing : { before: 0, after: 0 },
          border  : { top: { style: BorderStyle.SINGLE, size: 4, color: CLR.PRIMARY, space: 4 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: `${new Date().getFullYear()}`, font: 'Calibri', size: 16, color: CLR.MUTED }),
            new TextRun({ text: '\tHalaman ', font: 'Calibri', size: 16, color: CLR.MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: CLR.MUTED }),
            new TextRun({ text: ' dari ', font: 'Calibri', size: 16, color: CLR.MUTED }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Calibri', size: 16, color: CLR.MUTED }),
          ],
        })],
      }),
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// DOCUMENT ASSEMBLER  (single call to build full Document)
// ─────────────────────────────────────────────────────────────────
function assemble(meta, bodyBlocks) {
  resetCounters();
  const { headers, footers } = headerFooter(meta);

  return new Document({
    numbering: NUMBERING,
    styles   : STYLES,
    sections : [{
      properties: {
        page: {
          size  : { width: DXA.PAGE_W, height: DXA.PAGE_H },
          margin: { top: DXA.MARGIN, right: DXA.MARGIN, bottom: DXA.MARGIN, left: DXA.MARGIN },
        },
      },
      headers,
      footers,
      children: bodyBlocks.flat(Infinity),
    }],
  });
}

async function save(doc, outPath) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buf);
  console.log(`✅  Dokumen disimpan: ${outPath}`);
  return outPath;
}

// ─────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────
module.exports = {
  DXA, CLR,
  // Headings
  h, h0,
  // Paragraphs
  p, bullet, li, br, sp,
  // Captions
  tblCaption, figCaption, resetCounters,
  // Table
  tbl,
  // Document sections
  cover, revisionHistory, tocSection,
  // Assembler
  assemble, save,
};



