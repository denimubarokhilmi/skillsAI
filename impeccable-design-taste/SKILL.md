---
name: impeccable-design-taste
description: Meta UI/UX design orchestrator for Codex that combines installed UI/UX skills into one anti-slop workflow. Use when building, redesigning, polishing, auditing, generating, or implementing frontend UI, landing pages, dashboards, product screens, mobile screens, Figma designs, shadcn components, brand kits, image-to-code layouts, or any interface that must look premium, project-appropriate, accessible, and not AI-generated. Routes between impeccable, ui-ux-pro-max, frontend-design, design-taste-frontend, gpt-taste, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, brandkit, imagegen-frontend-web, imagegen-frontend-mobile, image-to-code, redesign-existing-projects, shadcn, migrate-radix-to-base, and Figma skills while preventing aesthetic conflicts.
---

# Impeccable Design Taste

Load BASE_DESIGN.md as the core taste contract before doing UI/UX work. Use it to route installed design skills and prevent aesthetic conflicts.

One skill to control UI/UX work. Do not load every UI skill blindly. First classify task, then use only matching skills.

## Bundled References

Before UI/UX work, read these bundled summaries instead of loading every separate skill in full:

- `references/ui_skills_summary.md`: condensed rules from installed UI/UX skills.
- `references/conflict_map.md`: collision rules and arbitration ladder.
- `references/prd_mapping.md`: PRD-to-design mapping and generated `DESIGN.md` structure.
- `references/examples.md`: real website benchmarks by style direction; read when choosing visual references, mood, style inspiration, anti-slop examples, or design direction.
- `references/visual-patterns.md`: detailed visual characteristics of benchmark sites (Linear, Stripe, Anthropic, PostHog, Perplexity, Cursor, Retool) used during layout & styling lookup.

Use original installed skills only when task needs their full workflow, e.g. Figma canvas writes, shadcn commands, image generation, or complex GSAP work.

## First Line

Before design/code, output one line:

`Design read: <project type> for <audience>, <primary vibe>, using <stack/design system>, with <risk to avoid>.`

If missing context causes two very different design directions, ask one question only.

## 📌 Flow & Routing

Setiap kali menerima tugas yang melibatkan output visual/frontend/UI, ikuti alur routing referensi berikut:

### 1. Identify & Route (Anchor Selection)
Pilih **primary style direction** yang sesuai dari `references/examples.md`. Wajib tentukan minimal **1-2 anchor sites** untuk benchmarking sebelum mulai mendesain.

### 2. Extract Visual Patterns
Buka `references/visual-patterns.md`. Baca karakteristik anchor yang dipilih berdasarkan 6 dimensi (Palette, Layout, Typography, Motion, Product Demo, Trust Cue). Visual style harus mengikuti constraint dari anchor tersebut tanpa mencampur-aduk gaya yang berlawanan.

### 3. Quality Gate (Self-Check)
Sebelum menyerahkan output, lakukan validasi 5 poin ini:
1. **Palette Check:** Apakah warna mirip template AI generik (purple-pink-blue mesh gradient)? *Ubah ke flat solid/subtle gradient.*
2. **Hero Check:** Apakah hero memakai ilustrasi abstrak atau blob? *Ganti dengan concrete product UI screenshot, interactive widget, atau raw typography.*
3. **Typography Check:** Apakah font hierarchy membosankan? *Tambahkan kontras berat (e.g. bold headline rapat + small uppercase metadata).*
4. **Layout Composition:** Apakah layout simetris standar (card grid 3 kolom)? *Buat asimetris (split hero, carousel, detail sidebar).*
5. **Trust/Demo Cues:** Apakah ada pembuktian produk (metrics, live interactive elements, logo grid) yang sesuai?

---

## Routing

Use this order:

1. **Project fit**: use `impeccable` for UX structure, accessibility, hierarchy, responsive behavior, copy, states, and overall polish.
2. **Taste layer**: use `design-taste-frontend` for landing pages, portfolios, marketing sites, and redesigns that need anti-slop direction.
3. **Reference intelligence**: use `ui-ux-pro-max` for palette, style, font pairing, UX rules, and chart decisions.
4. **Visual distinctness**: use `frontend-design` when UI feels generic or templated.
5. **Existing app upgrade**: use `redesign-existing-projects` before changing an existing UI.
6. **Component library**: use `shadcn` only when project has shadcn/components registry or user asks for shadcn.
7. **Radix migration**: use `migrate-radix-to-base` only for Radix to Base UI migration.
8. **Figma work**: use Figma skills only when user mentions Figma, design files, canvas, nodes, or design-system library.
9. **Image concept work**: use `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`, or `image-to-code` only when images/screenshots/mockups are part of task.
10. **Heavy motion**: use `gpt-taste` only for explicit GSAP / scroll-story / high-motion landing pages.

## Conflict Rules

Never combine conflicting style skills at same strength.

- Choose **one primary style**: `minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, or project-native style.
- `minimalist-ui` wins for calm, editorial, trust, luxury-soft, docs, dashboards needing clarity.
- `industrial-brutalist-ui` wins only for bold editorial, data-heavy, security, devtools, portfolio, declassified/terminal vibe.
- `high-end-visual-design` wins for premium SaaS, consumer apps, agencies, paid product marketing.
- `gpt-taste` motion loses to accessibility, performance, or product usability. Respect `prefers-reduced-motion`.
- `imagegen-*` produces references, not implementation rules, unless user asks to match generated image.
- `shadcn` component conventions win over custom components when project already uses shadcn.
- Existing design system tokens win over new colors, fonts, spacing.

## Anti-Slop Defaults

Ban default AI patterns unless explicitly justified:

- purple/blue mesh gradients as main identity
- centered hero plus three equal cards
- random glassmorphism
- fake dashboard screenshots
- generic SaaS icons
- all sections same width rhythm
- low-contrast gray text
- motion without purpose
- typography with no scale logic

## Quality Gate

Before final answer, verify:

- UI fits project domain and audience.
- One primary design direction chosen.
- Existing tech stack and design tokens respected.
- No styling hardcoded directly in element `class`/`style` attributes or baked into component/model definitions (including stacked Tailwind-style utility classes repeated across markup) — it goes through design tokens or a component class instead.
- Accessibility basics preserved: contrast, focus, labels, keyboard, reduced motion.
- Responsive layout works for small laptop and mobile.
- Empty/error/loading states considered when applicable.
- No conflicting style skill applied blindly.
- Visual hierarchy has one clear next action per screen/section.

## Output Style

For code tasks:

1. State `Design read`.
2. Patch minimum files.
3. Run focused check when feasible.
4. Summarize changed files and skipped upgrades.

For audits:

1. List top issues by impact.
2. Mark which skill family applies.
3. Give concrete fixes, not vague taste advice.

For image/Figma tasks:

1. Choose one visual direction.
2. Generate/modify design in sections.
3. Keep consistency across palette, type, spacing, iconography.


## PRD to DESIGN.md

`DESIGN.md` (the per-project generated file) is distinct from `BASE_DESIGN.md`
(the static core taste contract loaded above). Do not conflate the two:
`BASE_DESIGN.md` never changes; `DESIGN.md` is regenerated per PRD.

When user asks to generate `DESIGN.md` from a PRD, product spec, requirement
doc, or feature brief:

1. Read the PRD/spec. If it's a `prd-data.js` following the
   `prd-document-writer` schema (see `references/prd_mapping.md`), prefer it
   over plain markdown — it carries structured fields (`designSystem`,
   `frontendConstraints`, `featureSpecs[].uiStates`, `fileMap[]`) that a
   markdown PRD can't.
2. Run `scripts/generate-design-md.py <prd-file> -o DESIGN.md` when a local
   file exists. Accepts `.js` (structured, via Node `require()` — must use
   `module.exports = {...}`) or markdown/text (heuristic extraction).
3. If PRD is pasted in chat, create a temporary PRD file first, then run the
   script.
4. Review generated `DESIGN.md`. If the source had a `designSystem` field,
   the Primary Style section should already contain real hex/font/token
   values — do not overwrite them with a generic style label.
5. Use generated `DESIGN.md` as the routing contract for installed UI/UX
   skills, alongside the static `BASE_DESIGN.md`.





