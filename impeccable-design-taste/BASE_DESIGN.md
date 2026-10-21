# Design Rules

Use this file as core taste contract for `impeccable-design-taste`.

## Goal

Produce UI/UX that feels project-specific, premium, usable, accessible, and not AI-generated.

## Design Read

Always start UI work by deciding:

- project type
- target audience
- business goal
- product maturity
- primary aesthetic
- existing stack/design system
- slop risk to avoid

Output one line:

`Design read: <project type> for <audience>, <primary vibe>, using <stack/design system>, avoiding <slop risk>.`

## Direction Ladder

Choose one primary direction. Do not blend all styles.

1. Existing product design system
2. User-provided reference or brand asset
3. Domain-appropriate pattern
4. Installed UI skill style
5. New custom style

## Style Router

- Wajib pilih 1-2 anchor sites dari `references/examples.md` dan lookup karakteristik visualnya di `references/visual-patterns.md`.
- Use `high-end-visual-design` for premium SaaS, agency, consumer apps, launch pages.
- Use `minimalist-ui` for calm, editorial, docs, admin, trust-first, clean dashboards.
- Use `industrial-brutalist-ui` for security, devtools, data-heavy, experimental portfolio, terminal/blueprint vibe.
- Use `design-taste-frontend` for landing pages, portfolios, and marketing redesigns.
- Use `impeccable` for UX structure, hierarchy, accessibility, polish, states, and responsive behavior.
- Use `ui-ux-pro-max` for palettes, typography, styles, chart/UI patterns.
- Use `frontend-design` when output feels generic.
- Use `gpt-taste` only for explicit GSAP, kinetic landing, scroll-story, or high-motion work.
- Use `shadcn` when project has `components.json`, shadcn registry, or user asks for shadcn.
- Use Figma skills only for Figma tasks.
- Use imagegen skills only for visual concepts, mockups, or image-to-code workflows.

## Anti-Slop Rules

Never default to:

- purple-blue gradient blobs
- centered hero plus three equal cards
- glassmorphism everywhere
- fake analytics dashboard cards
- generic SaaS icon grid
- `Inter` + slate palette without reason
- every section with identical rhythm
- vague badge text like "AI-powered platform"
- motion that does not explain, guide, or delight

## UI Quality Rules

- One screen, one dominant action.
- Make hierarchy obvious within 3 seconds.
- Use spacing as structure, not decoration.
- Use typography scale intentionally.
- Keep contrast accessible.
- Preserve keyboard and focus states.
- Respect `prefers-reduced-motion`.
- Design empty/loading/error states when feature needs them.
- Prefer native CSS/platform behavior before adding JS.
- Do not create custom components if project library already has equivalent.
- Never hardcode styling directly on an element's `class`/`style` attribute or inside a component/model definition — define it once via design tokens (CSS custom properties, theme file, or design-system config) and reference the token, not the raw value. This includes Tailwind-style utility classes stacked directly on markup (e.g. `class="p-4 bg-[#B5602A] text-sm rounded-xl"` repeated across files) — extract repeated utility combinations into a component class or token instead of inlining them each time.

## Project Fit Rules

- B2B SaaS: clarity, trust, proof, restrained motion.
- Devtools: dense but legible, terminal/technical cues only if useful.
- Consumer app: emotion, strong imagery, direct action, lower cognitive load.
- Dashboard/admin: information hierarchy, scanning, states, tables, filters.
- Public/regulated: accessibility, clarity, low-risk patterns, no trendy effects.
- Portfolio: personality, selective weirdness, fast comprehension of skill.

## Final Check

Before final response, confirm:

- primary style chosen
- no conflicting style skills mixed
- project tokens respected
- responsive states considered
- accessibility preserved
- AI slop patterns avoided
