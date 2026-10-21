#!/usr/bin/env node
/**
 * generate-playwright.js
 *
 * OPTIONAL / STANDALONE ONLY. If you're running this skill natively inside
 * Claude or as a Hermes skill (SKILL.md loaded from ~/.hermes/skills/...),
 * you do NOT need this script — the agent reads SKILL.md directly and
 * generates the checklist itself using its own configured model. This file
 * exists only for generating a checklist from the command line, outside of
 * any agent session.
 *
 * It reads a PRD / User Manual / SRS / BRD / feature-spec document (.txt, .md, .pdf, .docx),
 * sends it to a local/self-hosted OpenAI-compatible chat completions endpoint
 * (NOT the Claude API — see API_URL below) together with the full rule set
 * from the skill definition, and writes a structured Playwright test-scenario
 * markdown file to disk. It does not extract selectors from source code —
 * for code-based or hybrid extraction (see SKILL.md Step 1.5), use the skill
 * natively via an agent instead of this script.
 *
 * ---------------------------------------------------------------------------
 * USAGE
 * ---------------------------------------------------------------------------
 *   node generate-playwright.js <input-doc> [output.md]
 *
 * Examples:
 *   node generate-playwright.js ./PRD-checkout.pdf
 *   node generate-playwright.js ./spec.docx test-scenarios.md
 *   cat spec.txt | node generate-playwright.js -            # read from stdin
 *
 * ---------------------------------------------------------------------------
 * REQUIREMENTS
 * ---------------------------------------------------------------------------
 *   - Node.js 18+ (uses global fetch)
 *   - A running OpenAI-compatible chat completions endpoint (default:
 *     http://127.0.0.1:20128 — override with NINEROUTER_URL). This is your
 *     own local gateway/router, not an Anthropic service.
 *   - Environment variable NINEROUTER_KEY (or OPENAI_API_KEY) must be set
 *   - Optional deps for non-plain-text input:
 *       npm install pdf-parse mammoth
 *     (the script degrades gracefully with a clear error if a parser is missing)
 *
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const MODEL = "cf/@cf/meta/llama-3.1-8b-instruct-fp8-fast";
const API_URL = process.env.NINEROUTER_URL
  ? `${process.env.NINEROUTER_URL.replace(/\/$/, "")}/v1/chat/completions`
  : "http://127.0.0.1:20128/v1/chat/completions";
const API_KEY = process.env.NINEROUTER_KEY || process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Error: set env var NINEROUTER_KEY (atau OPENAI_API_KEY) sebelum menjalankan script ini.");
  process.exit(1);
}

// -----------------------------------------------------------------------
// The full skill instructions, embedded as the system prompt so the model
// follows the exact same rules as the original playwright-test-planner skill.
// -----------------------------------------------------------------------
const SYSTEM_PROMPT = `
You are an automation test planner. Your job is to read a PRD, User Manual, SRS, BRD,
or any feature specification document and generate a structured Playwright test
scenario markdown file.

## Step 1 — Read the Document
Read the full document and extract:
- List of features / modules
- Functional Requirements (FR IDs if present, or derive logical groupings)
- User roles / actors
- URLs / routes (if mentioned)
- Input fields and their validation rules
- Success states (redirects, toasts, confirmations)
- Error states (validation messages, access denied, etc.)

## Step 2 — Plan the Structure
Group test scenarios by FR ID or page/feature (whichever the document uses).
For each group, identify:
- The primary happy-path flow
- Edge cases and negative cases
- Which steps warrant a screenshot

## Step 3 — Generate the Markdown
Output a single markdown document. Use this exact format for every feature section:

## [Nama Fitur] — [ID FR / ref]

**Objective:** [Satu kalimat: apa yang diverifikasi oleh test ini]
**Route:** \`[URL atau path endpoint, e.g. /login atau https://app.example.com/dashboard]\`
**Prerequisites:** [Akun/role/data yang harus ada sebelum test dimulai]
**Viewport:** 1920×1080

**Checklist:**
- [ ] Buka \`[URL]\` — apakah [elemen utama] visible?
- [ ] Isi field "[Label Field]" dengan \`[value]\` — field terisi?
- [ ] Klik tombol "[Label Tombol]" — [response: redirect / toast / error]?
- [ ] Screenshot: \`[fitur]_result.png\`

**Negative cases:**
- [ ] Submit form kosong — pesan error validasi muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---

## Rules — Wajib Dipatuhi

### Actions
- 1 action per baris — HARD RULE. Tiap baris = 1 checklist item. Satu baris = satu perintah
  Playwright (satu .click(), satu .fill(), satu .clear(), dst). Jika sebuah step butuh
  lebih dari satu perintah untuk dieksekusi, wajib dipecah jadi baris terpisah — tidak
  peduli seberapa "natural" kedengarannya kalau digabung dalam bahasa manusia.
- Pola clear-then-fill = 2 baris terpisah, WAJIB, tanpa kecuali: jika field perlu
  dikosongkan dulu lalu diisi (misal saat edit), dilarang keras digabung dengan kata
  sambung seperti "dan", "lalu", "kemudian" dalam satu baris Action. Selalu pisahkan:
    Baris 1: Hapus nilai di field "[Label]"
    Baris 2: Isi field "[Label]" dengan \`[value baru]\`
  Tanda bahaya: kalau kalimat Action mengandung kata "dan isi", "dan klik", "dan
  verifikasi", "dan buka", "lalu isi", "kemudian klik" — itu SELALU berarti baris
  tersebut harus dipecah sebelum file disimpan.
- Gunakan label yang terbaca manusia: "Email", "Simpan", "Batalkan" — bukan #btn-submit
  atau .form-input
- Untuk nilai input: Isi field "[Label]" dengan \`[contoh nilai]\`
- Untuk navigasi: Buka \`[URL]\`
- Untuk klik: Klik tombol "[Label]" atau Klik link "[Teks Link]"
- Untuk verifikasi: Verifikasi [elemen] [kondisi]
- Untuk dropdown/select: Pilih "[Label]" dengan nilai \`[pilihan]\`
- Untuk upload file: Upload file \`[nama-file.ext]\` via field "[Label]"

### Screenshots
- Hanya di step penting: halaman awal termuat, hasil akhir sukses, pesan error,
  konfirmasi dialog
- Nama file: [nama_fitur]_[kondisi].png → contoh: login_success.png,
  register_error_email.png
- Kolom screenshot kosong untuk step intermediate (mengisi form, dll.)
- Resolusi layar: 1920×1080 — cantumkan di Prerequisites atau header section

### Negative Cases
- Minimal 3 negative case per fitur
- Format checkbox: - [ ] [skenario] → [ekspektasi sistem]?
- Spesifik: sebutkan field mana, value apa, error message apa (jika ada di dokumen)

### Grouping
- Group per FR ID jika dokumen menyebutkan FR-001, FR-002, dst.
- Jika tidak ada FR ID, group per halaman atau modul
- Urutan: ikuti alur pengguna yang logis (Login → Dashboard → Fitur Utama → Settings)

### Header
Tambahkan header di awal file:

# Test Scenarios — [Nama Aplikasi/Dokumen]

**Generated from:** [nama file dokumen atau "User-provided spec"]
**Date:** [tanggal hari ini]
**Viewport:** 1920×1080
**Runner:** Playwright

---

## Step 3.5 — Self-QA Sebelum Save (WAJIB)
Sebelum menyelesaikan output, re-scan seluruh isi tabel Action yang baru digenerate:
1. Cek gabungan action: cari baris yang mengandung "dan isi", "dan klik", "dan
   verifikasi", "dan buka", "lalu isi", "kemudian klik", atau pola serupa di kolom
   Action. Kalau ketemu, pecah jadi baris terpisah sebelum lanjut — jangan biarkan lolos.
2. Cek clear-then-fill: untuk setiap step edit/update field yang sudah terisi nilai
   lama, pastikan ada 2 baris terpisah (Hapus nilai → Isi field), bukan digabung.
3. Cek negative case: pastikan tiap section punya minimal 3 negative case.
4. Cek format label: pastikan tidak ada selector teknis (#id, .class) yang lolos ke
   Action, hanya label human-readable.
Kalau ada pelanggaran, perbaiki dulu sebelum output final.

## Handling Ambiguity
Jangan blokir output karena ambiguitas — generate dulu, flag di catatan bawah:
- URL/route tidak jelas → tulis [URL TBD — konfirmasi dengan tim dev]
- Expected error message tidak jelas → tulis [pesan error TBD — cek implementasi]
- User roles tidak jelas → tulis [Role TBD] dan sebutkan asumsi yang kamu buat

## Output
Respond with ONLY the final markdown document. No preamble, no explanation, no
markdown code fences wrapping the whole thing — just the raw markdown content
starting with the "# Test Scenarios — ..." header.
`.trim();

// -----------------------------------------------------------------------
// Helpers to read different document types
// -----------------------------------------------------------------------

async function readInput(inputPath) {
  if (inputPath === "-") {
    return readStdin();
  }

  const ext = path.extname(inputPath).toLowerCase();
  const buffer = fs.readFileSync(inputPath);

  if (ext === ".pdf") {
    return extractPdf(buffer);
  }
  if (ext === ".docx") {
    return extractDocx(buffer);
  }
  // .txt, .md, or anything else: treat as plain text
  return buffer.toString("utf-8");
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function extractPdf(buffer) {
  try {
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(buffer);
    return result.text;
  } catch (err) {
    throw new Error(
      `Failed to parse PDF. Install the parser with "npm install pdf-parse" ` +
        `and try again. Original error: ${err.message}`
    );
  }
}

async function extractDocx(buffer) {
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    throw new Error(
      `Failed to parse DOCX. Install the parser with "npm install mammoth" ` +
        `and try again. Original error: ${err.message}`
    );
  }
}

// -----------------------------------------------------------------------
// Local LLM gateway call (NOT the Claude API — see API_URL near the top)
// -----------------------------------------------------------------------

async function generateTestScenarios(documentText, documentName) {
  // API key is read from NINEROUTER_KEY / OPENAI_API_KEY, pointed at your
  // local OpenClaw/9Router gateway (see API_URL above) — not Anthropic.

  const today = new Date().toISOString().slice(0, 10);

  const userMessage =
    `Document name: ${documentName}\n` +
    `Today's date: ${today}\n\n` +
    `--- BEGIN DOCUMENT ---\n${documentText}\n--- END DOCUMENT ---\n\n` +
    `Generate the Playwright test scenario markdown file following all rules exactly.`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
  }

  const raw = await response.text();
  const data = JSON.parse(raw);
  const text = data.choices?.[0]?.message?.content?.trim() || "";

  return text.trim();
}

// -----------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------

async function main() {
  const [, , inputArg, outputArg] = process.argv;

  if (!inputArg) {
    console.error(
      "Usage: node generate-playwright.js <input-doc|-> [output.md]\n" +
        "  input-doc  Path to PRD/spec file (.txt, .md, .pdf, .docx) or '-' for stdin\n" +
        "  output.md  Optional output path (default: ./test-scenarios.md)"
    );
    process.exit(1);
  }

  const outputPath = outputArg || path.join(__dirname, "..", "output", "test-scenarios.md");
  const documentName = inputArg === "-" ? "stdin" : path.basename(inputArg);

  console.log(`Reading document: ${documentName}...`);
  const documentText = await readInput(inputArg);

  if (!documentText || !documentText.trim()) {
    console.error("Error: document appears to be empty after extraction.");
    process.exit(1);
  }

  console.log(`Generating test scenarios via local gateway (${API_URL})...`);
  const markdown = await generateTestScenarios(documentText, documentName);

  fs.writeFileSync(outputPath, markdown, "utf-8");
  console.log(`Done. Test scenarios written to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

















