# Conflict Map

Use these rules to avoid skill collisions.

## Primary Style Rule

Pick exactly one primary style family:

- `minimalist-ui`: calm, editorial, docs, admin, finance, health, trust-first, dashboards needing clarity.
- `industrial-brutalist-ui`: security, devtools, terminal, infrastructure, monitoring, audits, experimental portfolio.
- `high-end-visual-design`: premium SaaS, agency, consumer, paid marketing, launch pages.
- `project-native`: if existing design system is strong, use it over all imported style skills.

## Hard Conflicts

- `minimalist-ui` conflicts with `industrial-brutalist-ui`. Do not mix soft warm minimalism with terminal military brutalism.
- `minimalist-ui` conflicts with heavy GSAP pinning unless user wants editorial motion.
- `industrial-brutalist-ui` conflicts with luxury/soft brand unless project explicitly asks for brutal premium.
- `gpt-taste` conflicts with accessibility/performance when using pinned scroll and heavy animation. Accessibility wins.
- `imagegen-*` references conflict with existing design tokens if image palette is inconsistent. Existing tokens win.
- `shadcn` conflicts with custom one-off component building. Existing shadcn components win.

## Arbitration Ladder

1. Explicit user instruction.
2. Existing project design system/tokens.
3. Accessibility and product usability.
4. PRD audience and domain.
5. Primary style family.
6. Visual flair.

## Anti-AI-Slop Banlist

Avoid unless project specifically demands it:

- Purple/blue gradient mesh hero.
- Three identical feature cards under centered hero.
- Glassmorphism on every card.
- Fake dashboard preview with meaningless charts.
- Generic icon grid.
- All sections same rhythm.
- `AI-powered` vague labels.
- Motion without semantic reason.
