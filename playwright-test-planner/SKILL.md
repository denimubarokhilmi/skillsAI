---
name: playwright-test-planner
description: >
  Generate Playwright test scenario markdown files — from a PRD/spec document, from frontend source code directly, or both combined. Use this skill whenever the user uploads or pastes a product document and/or shares frontend code and wants test scenarios, test cases, test plans, or QA automation checklists generated — even if they don't say "Playwright" explicitly. Works with any frontend stack (React, Vue, Angular, Svelte, plain HTML/JS). When code is available, extracts real selectors (data-testid, id, aria-label, name, role) instead of guessing from prose, so output is directly usable by a Playwright runner. Triggers include: "buatin test scenario", "generate test case dari PRD", "buat automation test", "QA plan dari dokumen/kode ini", "test coverage untuk fitur ini", or any request to derive testing artifacts from a specification and/or source code. Also triggers when user says they are a QA engineer, automation tester, or SDET.
---

# Playwright Test Planner

You are an automation test planner. Your job is to produce a structured Playwright test scenario markdown file, using whatever the user provides: a spec document (PRD/User Manual/SRS/BRD), frontend source code, or both.

## Prerequisites

Before using this skill, install dependencies for reading spec documents (not needed if the user only provides code):

```bash
npm install pdf-parse mammoth
```

No LLM gateway is required — this skill runs entirely on whatever agent is executing it (Claude, or a Hermes skill session using its own configured model). Do not reference any external local LLM gateway.

**Target runner:** real Playwright (Node.js `@playwright/test` / `playwright`), typically launched with `channel: 'chrome'` against a real Chrome install and a persistent user profile. This means: prefer robust, unambiguous locators over prose-guessed ones whenever source code is available — the output is meant to be directly translatable into `page.getByTestId()` / `page.getByRole()` / `page.locator()` calls, not just a human checklist.

## Step 0 — Determine Mode

Check what the user provided:

- **PRD/spec only** → Mode: *spec-only*. Proceed as before — checklist uses human-readable labels only (no code available to pull real selectors from).
- **Frontend code only** (files, folder, or repo) → Mode: *code-only*. Extract real selectors and infer scenarios/expectations directly from the code (see Step 1.5). Business-level expectations (exact error copy, redirect targets not visible in code, business validation rules enforced server-side) will often be unknown — flag these as `[TBD — not derivable from code]` rather than guessing.
- **Both PRD/spec and code** → Mode: *hybrid* (preferred when available — most robust). PRD supplies the *what to test* and *expected outcome*; code supplies the *exact selector* to act on. This produces the most executable and most business-accurate output.

If it's ambiguous which files map to which feature, ask the user once, briefly. Otherwise proceed without asking.

## Step 1 — Read the Document (spec-only or hybrid mode)

1. Check `input/` for attached files. If files exist, read them using the appropriate tool (pdf, docx, or plain text).
2. If no file is attached but the user pasted spec text, use that.
3. If in spec-only mode and neither exists, ask the user to upload or paste the document before proceeding.

Extract:
- List of features / modules
- Functional Requirements (FR IDs if present, or derive logical groupings)
- User roles / actors
- URLs / routes (if mentioned)
- Input fields and their validation rules
- Success states (redirects, toasts, confirmations)
- Error states (validation messages, access denied, etc.)

## Step 1.5 — Read the Code (code-only or hybrid mode)

Works with **any frontend stack** — detect the framework per file before parsing, since markup/event syntax differs:

| Stack | Detect via | Click handler | Value binding | Notes |
|---|---|---|---|---|
| React (JSX/TSX) | `.jsx`/`.tsx`, `import React` | `onClick` | `value`/`onChange`, or form lib (`register()`, `Controller`) | Component libraries (MUI, AntD, shadcn) often render standard ARIA roles underneath — prefer `role`+`name` over guessing internal class names |
| Vue | `.vue`, `<template>` block | `@click` / `v-on:click` | `v-model` | Scoped CSS classes (`data-v-xxxx`) are auto-generated — never use them as selectors |
| Angular | `.component.html` + `.component.ts`, `*ngIf` etc. | `(click)` | `[(ngModel)]` / `formControlName` | `formControlName` is a strong, stable selector source |
| Svelte | `.svelte` | `on:click` | `bind:value` | — |
| Plain HTML/JS/jQuery | `.html`, vanilla `addEventListener`/`$()` | `onclick` attr or listener | `value` attr | Usually the most literal/direct to parse |

For every interactive element found, extract in this **priority order** (use the first one present):
1. `data-testid` (or equivalent: `data-test`, `data-cy`)
2. `id`
3. `name`
4. `aria-label`
5. `role` + visible text/label (e.g. `role=button[name="Simpan"]`)
6. Associated `<label>` text (via `for`/`htmlFor` or wrapping) — for inputs specifically
7. CSS class — **last resort only**, and flag it as fragile: `[selector via class — verify uniqueness, prefer adding data-testid]`

**Caveat if the app is multi-language (i18n present in the codebase):** deprioritize option 5 (role+text) hard — visible text breaks the moment locale changes. Push harder for `data-testid`/`id` and flag any element that had to fall back to text-based matching: `[selector relies on visible text — will break under i18n, recommend data-testid]`.

### ARIA roles: implicit vs explicit — don't just grep for `role="..."`

Every interactive element has an ARIA role, but it's not always written literally in the code. Two cases:

- **Implicit** (native HTML tags carry a role automatically — nothing to grep for):
  `<button>`→`button`, `<input type="text">`→`textbox`, `<input type="radio">`→`radio`, `<input type="checkbox">`→`checkbox`, `<a href>`→`link`, `<select>`→`combobox`/`listbox`, `<input type="range">`→`slider`, `<progress>`→`progressbar`.
- **Explicit** (custom components built from `<div>`/`<span>` — role is a literal attribute you can grep for, e.g. `<div role="switch" aria-checked={...}>`):
  `switch`, `tab`, `tabpanel`, `dialog`, `menuitem`, `alert`/`status` have **no native HTML equivalent** — they are always explicit in a real app, so search for the `role="..."` attribute directly. `combobox`, `slider`, `progressbar` can go either way — check for a native tag first, fall back to explicit `role`.

Extraction rule: check the tag name against the implicit-role list first; only if it's a generic `div`/`span` (or framework equivalent) should you look for a literal `role` attribute.

### Element coverage — beyond basic form fields

| Element | What to capture |
|---|---|
| Button | text/label, `data-testid`/`id`/`aria-label`, disabled-state condition |
| Text input | `name`/`id`, `type`, associated `<label>`, placeholder, validation (required/pattern/maxLength) |
| Textarea | same as text input, plus `rows`/`maxLength` — note if there's a char-counter to verify |
| Radio button | `name` (group), each option's `value` + label |
| Checkbox | same as radio, plus `defaultChecked` |
| Select/dropdown | every `<option>` value + text |
| Link/anchor | `href` (verify actual navigation target), text, `target` (`_blank` = new tab, different handling — see below) |
| Toggle/switch | usually custom (`role="switch"`/`aria-checked`) — not a native checkbox |
| Slider/range | `min`/`max`/`step`, current value — drag interaction, not a plain click |
| File upload | `accept` (allowed types), `multiple` |
| Date picker | usually custom, not native `<input type="date">` — determine if it's click-to-open-calendar or type-directly |
| Combobox/autocomplete | requires typing to reveal options; options are often dynamic (fetched from an API), not hardcoded in source |
| Tabs | `role="tab"`/`aria-selected` — note which tab must be active before interacting with elements inside its panel |
| Accordion/collapsible | `aria-expanded` — content may not be interactable until expanded |
| Modal/dialog trigger | the button that opens it; the modal itself is often rendered via a portal outside the normal DOM tree |
| Pagination | page numbers, next/prev — usually needs a wait for data reload between clicks |
| Sortable table header | verify actual row order changes, not just "click succeeded" |
| Drag-and-drop | needs source + target selector (Playwright's `dragTo()`, not a plain click) |
| Context menu | triggered by right-click (`contextmenu` event), not `click` |
| Toast/notification | message text, whether it can stack (multiple at once — note which one, e.g. most recent), auto-dismiss timing if relevant |
| Contenteditable / rich text editor (Quill, TipTap, etc.) | usually `div[contenteditable]`, filled differently than a `<textarea>` |
| Tooltip | hover-triggered (`hover()`), not click |

### Elements needing a different interaction pattern, not just a different selector

- **Native browser dialogs** (`confirm()`, `alert()`, `prompt()` — e.g. "yakin mau hapus?"): not a DOM element at all. Playwright handles these via a `page.on('dialog')` listener, not `locator().click()`. Flag explicitly so the checklist doesn't ask for a normal click on something that isn't clickable.
- **Popup / new tab** (`target="_blank"` or `window.open()`): requires waiting for a new page/tab (`context.waitForEvent('page')`) before any interaction inside it is possible. **Relevant to your setup specifically** — an OAuth flow like "Login with Google" typically opens exactly this kind of popup.
- **iframe**: elements inside need a frame locator first — a normal page-level locator cannot reach through it. Common in embedded payment widgets, maps, etc.
- **Shadow DOM / Web Components** (custom elements like `<my-widget>`): encapsulated DOM, needs special handling to reach inside — flag if detected.

### Elements that may not exist in the DOM at all yet (not just hidden)

- **Conditional render** (`{condition && <X/>}`, `v-if`, `*ngIf`): the element is absent from the DOM entirely until the condition is met — different from an accordion, where the content exists but is CSS-collapsed. Note the triggering condition.
- **Infinite scroll / virtualized lists** (react-window, etc.): off-screen items aren't rendered at all until scrolled into range — a plain scroll-into-view isn't enough.
- **Multi-step / wizard forms**: fields for step 3 don't exist in the DOM while the user is still on step 1.

### Repeated elements and selection semantics

- **List/table rows**: need a per-row strategy — combine a stable selector with `.nth()`, or prefer a `data-testid` that embeds the row's data id (e.g. `data-testid="row-{id}"`).
- **Multi-select** (checkbox groups, multi-select dropdowns): the result is an array of values, not one — checklist should reflect selecting multiple and verifying the full set, not just one.
- **Disabled vs. readonly**: disabled means the element can't be focused at all; readonly means it can be focused/clicked but not edited. Treat them as different checklist conditions, don't conflate.

Element existing in code with **no stable identifying attribute at all**: flag explicitly `[No stable selector found in code — recommend adding data-testid="..."]` rather than silently falling back to something fragile.

If the codebase uses a component library where the rendered DOM isn't visible from source alone (e.g. a custom `<Button>` wrapping an unknown internal implementation), say so and default to `role`+visible text, noting it should be verified against the live DOM once.

## Step 2 — Plan the Structure

Group test scenarios by **FR ID** or **page/feature** (whichever the source uses). For each group, identify:
- The primary happy-path flow
- Edge cases and negative cases
- Which steps warrant a screenshot

**In hybrid mode**, reconcile PRD and code explicitly:
- PRD requirement with a matching code element → full checklist item (label + selector + expected outcome).
- PRD requirement with **no** matching code found → still include it, flag `[No matching code found for this requirement — selector inferred from PRD text only, verify against live UI]`.
- Code element with **no** corresponding PRD mention → still include it as a candidate test, flag `[Not explicitly required in PRD — inferred from code]`, so nothing interactive in the actual app goes untested just because the spec omitted it.

## Step 3 — Generate the Markdown File

Output a single `.md` file saved to `output/test-scenarios.md`.

Use this format for every feature section (selector column only when code was available — omit it entirely in pure spec-only mode):

```markdown
## [Nama Fitur] — [ID FR / ref]

**Objective:** [Satu kalimat: apa yang diverifikasi oleh test ini]
**Route:** `[URL atau path endpoint]`
**Prerequisites:** [Akun/role/data yang harus ada sebelum test dimulai]
**Viewport:** 1920×1080
**Source:** [nama file komponen, jika mode code/hybrid]

**Checklist:**
- [ ] Buka `[URL]` — apakah [elemen utama] visible?
- [ ] Isi field "[Label Field]" (`[selector]`) dengan `[value]` — field terisi?
- [ ] Klik tombol "[Label Tombol]" (`[selector]`) — [response: redirect / toast / error]?
- [ ] Pilih radio "[Label opsi]" (group: `[name]`, value: `[value]`) — [response]?
- [ ] Screenshot: `[fitur]_result.png`

**Negative cases:**
- [ ] Submit form kosong — pesan error validasi muncul?
- [ ] Input nilai invalid — field di-highlight merah?
- [ ] Akses halaman tanpa login — redirect ke login?

---
```

## Rules — Wajib Dipatuhi

### Actions
- **1 action per baris — HARD RULE. Tiap baris = 1 checklist item.** Satu baris = satu perintah Playwright (satu `.click()`, satu `.fill()`, satu `.clear()`, dst). Jika sebuah step butuh lebih dari satu perintah untuk dieksekusi, **wajib** dipecah jadi baris terpisah — tidak peduli seberapa "natural" kedengarannya kalau digabung dalam bahasa manusia.
- **Pola clear-then-fill = 2 baris terpisah, WAJIB, tanpa kecuali**: jika field perlu dikosongkan dulu lalu diisi (misal saat edit), *dilarang keras* digabung dengan kata sambung seperti "dan", "lalu", "kemudian" dalam satu baris Action. Selalu pisahkan:
  - Baris 1: `Hapus nilai di field "[Label]"`
  - Baris 2: `Isi field "[Label]" dengan \`[value baru]\``

  ❌ **SALAH**: `Hapus nilai di field "Nama Produk" dan isi dengan \`Sepatu Baru\``
  ✅ **BENAR**: dua baris terpisah seperti di atas.

  Tanda bahaya: kalau kalimat Action mengandung "dan isi", "dan klik", "dan verifikasi", "dan buka", "lalu isi", "kemudian klik" — itu SELALU berarti baris tersebut harus dipecah sebelum file disimpan.
- Gunakan label yang terbaca manusia untuk narasi (`"Email"`, `"Simpan"`) **plus** selector asli dalam kurung/backtick kalau mode code/hybrid — jangan tulis selector teknis TANPA label manusia, dan jangan tulis label manusia TANPA selector kalau kode tersedia.
- Untuk nilai input: `Isi field "[Label]" (\`[selector]\`) dengan \`[contoh nilai]\``
- Untuk navigasi: `Buka \`[URL]\``
- Untuk klik: `Klik tombol "[Label]" (\`[selector]\`)` atau `Klik link "[Teks Link]" (\`[selector]\`)`
- Untuk verifikasi: `Verifikasi [elemen] [kondisi]`
- Untuk radio/checkbox: `Pilih radio "[Label]" (group: \`[name]\`, value: \`[value]\`)`
- Untuk dropdown/select: `Pilih "[Label]" (\`[selector]\`) dengan nilai \`[pilihan]\``
- Untuk upload file: `Upload file \`[nama-file.ext]\` via field "[Label]" (\`[selector]\`)`

### Execution reliability (mencegah klik/input gagal saat dijalankan runner)
- Kalau sebuah action biasanya diikuti overlay/toast/modal (misal setelah submit), tambahkan step verifikasi eksplisit untuk overlay itu **sebelum** step berikutnya — jangan asumsikan runner otomatis nunggu.
- Kalau ada 2+ elemen dengan label sama di halaman yang sama (dari kode: 2 tombol teks "Simpan" di komponen berbeda), **wajib** tambahkan disambiguator di narasi (posisi/section) selain selector-nya, karena selector yang salah pilih lebih susah di-debug daripada narasi yang jelas.
- Untuk komponen non-standar (date picker, rich text editor, custom dropdown), tandai `[komponen custom — kemungkinan perlu klik-buka lalu pilih, bukan fill langsung]` di checklist, jangan asumsikan itu input teks biasa.
- Untuk elemen yang letaknya kemungkinan di bawah fold (form panjang, dalam modal scrollable), tandai `[mungkin perlu scroll-into-view]`.

### Screenshots
- **Hanya di step penting**: halaman awal termuat, hasil akhir sukses, pesan error, konfirmasi dialog
- Nama file: `[nama_fitur]_[kondisi].png` → contoh: `login_success.png`
- Kolom screenshot kosong untuk step intermediate (mengisi form, dll.)
- Resolusi layar: **1920×1080** — cantumkan di Prerequisites atau header section

### Negative Cases
- Minimal 3 negative case per fitur
- Format checkbox: `- [ ] [skenario] → [ekspektasi sistem]?`
- Spesifik: sebutkan field mana, value apa, error message apa (jika ada di dokumen atau kode — misal skema validasi yup/zod/class-validator)

### Grouping
- Group per **FR ID** jika dokumen menyebutkan FR-001, FR-002, dst.
- Kalau tidak ada FR ID (mode code-only), group per **komponen/route file**
- Urutan: ikuti alur pengguna yang logis (Login → Dashboard → Fitur Utama → Settings)

### Output File
- Simpan ke `output/test-scenarios.md`
- Tambahkan header di awal file:

```markdown
# Test Scenarios — [Nama Aplikasi/Dokumen]

**Generated from:** [nama file dokumen, path kode, atau keduanya]
**Mode:** [spec-only / code-only / hybrid]
**Date:** [tanggal hari ini]
**Viewport:** 1920×1080
**Runner:** Playwright (Node.js `@playwright/test`, `channel: 'chrome'`)

---
```

## Step 3.5 — Self-QA Sebelum Save (WAJIB)

Sebelum menyimpan file final, re-scan seluruh isi tabel Action yang baru digenerate:

1. **Cek gabungan action**: cari "dan isi", "dan klik", "dan verifikasi", "dan buka", "lalu isi", "kemudian klik". Pecah jadi baris terpisah kalau ketemu.
2. **Cek clear-then-fill**: pastikan tiap step edit field yang sudah terisi punya 2 baris terpisah.
3. **Cek negative case**: minimal 3 per section.
4. **Cek format label**: tidak ada selector teknis yang lolos tanpa label manusia pendamping (dan sebaliknya, kalau kode tersedia, tidak ada label manusia tanpa selector).
5. **Cek selector unik** (mode code/hybrid): kalau ada 2 checklist item dengan selector yang identik untuk elemen berbeda, itu bug ekstraksi — perbaiki sebelum lanjut.
6. **Cek disambiguator**: elemen dengan label duplikat di halaman yang sama harus punya penanda posisi/section di narasinya.
7. **Cek elemen yang butuh "buka dulu" sebelum interactable**: kalau ada step yang targetnya di dalam tab/accordion/modal/step wizard, pastikan ada step eksplisit buka/expand/navigasi ke situ duluan — jangan langsung lompat ke interaksi elemen di dalamnya.
8. **Cek elemen dengan pola interaksi khusus**: native browser dialog (`confirm`/`alert`), popup/tab baru (OAuth login dll), drag-and-drop, right-click — pastikan ditandai beda dari klik biasa, bukan ditulis sebagai `Klik tombol "..."` generik.

Kalau ada pelanggaran, perbaiki dulu sebelum lanjut ke Step 4.

## Step 4 — Present the File

After saving, call `present_files` with the output path so the user can download it.

Then give a brief summary in chat:
- Mode yang dipakai (spec-only / code-only / hybrid)
- Jumlah fitur/FR yang dicover
- Total step yang digenerate
- Fitur mana yang punya negative case terbanyak
- Elemen yang gagal dapat selector stabil (kalau ada) — daftar sebagai rekomendasi tambah `data-testid`
- Catatan jika ada FR yang ambigu atau butuh klarifikasi dari user

## Handling Ambiguity

If the document is unclear about:
- **URL/route** → tulis `[URL TBD — konfirmasi dengan tim dev]`
- **Expected error message** → tulis `[pesan error TBD — cek implementasi]`
- **User roles** → tulis `[Role TBD]` dan sebutkan asumsi yang kamu buat

If the code is unclear about:
- **Stable selector missing** → tulis `[No stable selector — recommend adding data-testid]`, jangan diam-diam pakai class CSS sebagai selector utama.
- **Business expectation not derivable from code** (misal exact redirect target, server-side validation rule) → tulis `[TBD — not derivable from code, confirm with spec/dev]`.

Jangan blokir output karena ambiguitas — generate dulu, flag di catatan bawah.

## Reference

Lihat `references/example-output.md` untuk contoh output lengkap satu fitur.
