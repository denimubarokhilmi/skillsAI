# PRD to Design Mapping

Use when generating `DESIGN.md` from a PRD. Supports two input formats:

1. Markdown/text PRD.
2. Structured CommonJS PRD data using the `prd-document-writer/templates/prd-data.template.js` shape.

## Structured Template Field Mapping

Map `prd-data.js` fields to design decisions:

| PRD field | DESIGN.md mapping | Notes |
|---|---|---|
| `meta.title` | Product title | Used in design read. |
| `meta.project` | Product/project name | Used in design read. |
| `executiveSummary[]` | Product context | Used to infer domain, audience, maturity, and trust level. |
| `overview.background` | Problem context | Used to infer tone and content hierarchy. |
| `overview.objectives[]` | Product Goals | Primary goal list. |
| `overview.scope` | Key Screens / Features | Extract modules and major surfaces. |
| `overview.outOfScope[]` | Constraints | Prevent visual/design scope creep. |
| `overview.stakeholders[]` | Audience / users | Prefer end-user stakeholder as target audience. |
| `assumptions[]` | Constraints | Capture environment and adoption assumptions. |
| `dependencies[]` | Constraints | Surface design-impacting dependencies and deadlines. |
| `risks[]` / `riskMap[]` | UX risks | Map to mitigation and quality guardrails. |
| `functionalRequirements[]` / feature-like arrays | Key Screens / Features | Use requirement IDs and names if present. |
| `routes[]` / `traceabilityMatrix[]` | Component/page mapping | Helps route design to actual code surfaces. |
| `authFlow` | Security/auth UX | Requires clear states, session messages, protected-route flows. |
| `changeGuide[]` | Implementation constraints | Avoid breaking migration/config compatibility. |

## Extraction Priority

1. `overview.objectives[]` → goals.
2. `overview.scope` + feature/requirement arrays → screens and features.
3. `overview.stakeholders[]` → target audience.
4. `risks[]`, `riskMap[]`, `dependencies[]`, `assumptions[]` → constraints.
5. `authFlow` → auth UX and fail states.
6. `traceabilityMatrix[]` → route/component mapping.

## Style Mapping

- **Digital Heritage / Budaya (Archive & Editorial)**: `minimalist-ui` with warm editorial cues (serif headings, cream backgrounds, generous whitespace); low motion; high trust.
- **Digital Heritage / Budaya (Tourism, Immersive & Museum 360)**: `high-end-visual-design` with controlled micro-motion (subtle GSAP triggers, clean visual cards, high-quality image placeholders); medium motion; high visual appeal.
- **B2B SaaS (Marketing / Conversion / Landing)**: `high-end-visual-design` plus `impeccable`.
- **B2B SaaS (Dashboard-Heavy / Product Workspace)**: `minimalist-ui` plus `impeccable` states, prioritizing clarity and low cognitive load over visual marketing tricks.
- **Devtools / Security / Monitoring / Infra**: `industrial-brutalist-ui` or project-native technical minimalism (monospace typography, high-contrast borders, neon accents).
- **Admin / Dashboard / CMS**: `minimalist-ui` plus `impeccable` states (clear table headers, row hover states, obvious form validation, visible focus).
- **Consumer App / E-commerce**: `high-end-visual-design` plus `imagegen-*` if visual mockups are needed.
- **Portfolio / Creative Agency**: `design-taste-frontend` with optional `gpt-taste` for explicit kinetic scroll motion.
- **Regulated / Public Sector**: `minimalist-ui` with zero motion, high contrast, standard OS fonts, and strict WCAG AA/AAA compliance.

## Generated DESIGN.md Sections

1. Design Read.
2. Product Goals.
3. Target Audience.
4. Key Screens / Features.
5. UX Risks & Constraints.
6. Primary Style.
7. Skill Routing.
8. Component / Page Mapping.
9. Responsive Rules.
10. Accessibility Rules.
11. State Rules (empty/loading/error/disabled/auth fail).
12. Acceptance Checklist.

## Template Support Rule

When user provides `prd-data.js` or references `prd-data.template.js`, prefer structured extraction over markdown heuristics. Use `scripts/generate-design-md.py <prd-data.js> -o DESIGN.md`.
