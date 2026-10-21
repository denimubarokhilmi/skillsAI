# UI/UX Skill Guide Summary

This reference aggregates rules from all installed UI/UX skills.

## Style Core Rules

### High-End Visual Design (soft-skill / high-end-visual-design)
- **Typography**: Inter, Geist, or custom pairing (strict scales). Avoid large blocks. Keep line length <= 65 chars.
- **Spacing**: Huge spacing (e.g., `py-24` or `py-32` between sections) to create premium breathing room.
- **Shadows**: Restrained, soft, layered drop-shadows only. No harsh black borders.
- **Cards**: Flat grid items with subtle hover translate-y-[-2px] effects. No heavy glass gradients.

### Minimalist UI (minimalist-skill / minimalist-ui)
- **Colors**: Muted pastels, warm monochrome, cream/white backgrounds with slate-900 typography.
- **Visuals**: Flat flat flat. Zero gradients, zero shadows. Spacing and type contrast are the elements.
- **Grids**: Asymmetric layout grids. Use empty grid slots for visual balance.

### Industrial Brutalist UI (brutalist-skill / industrial-brutalist-ui)
- **Aesthetic**: Swiss typography, military terminal, declassified blueprint.
- **Colors**: Solid high-contrast primaries (pure black, white, safety orange, neon yellow, terminal green).
- **Details**: Solid thick borders (2px to 4px), dotted patterns, monospace fonts (JetBrains Mono, Courier), scanlines, uppercase type.

### GPT-Taste Motion (gpt-tasteskill / gpt-taste)
- **GSAP**: Use scroll-driven motion (ScrollTrigger) with pinning, scaling, stacking, and scrubs.
- **Rule**: Animating elements must be lightweight. Keep accessibility fallback safe (prefer CSS transition when simple).

### Design Taste Frontend (taste-skill / design-taste-frontend)
- **Landing Page AIDA**: Attention (Hero), Interest (Context), Desire (Features), Action (CTA).
- **Variance**: Python-like layout randomization (e.g. alternate left-text/right-img with full-width text and single centered focus blocks).
- **Slop blocks**: Blocks purple-blue background meshes.

## Figma & Design System Tools

### Figma Suite (figma, figma-use, figma-generate-design, etc.)
- **Workflow**: Fetch design tokens and variables from Figma API to map into CSS.
- **Code Connect**: Connect React/Vue code components directly to Figma design components using Code Connect schemas.
- **Library Generation**: Auto-generate consistent visual guidelines and variables in Figma before pushing design to code.

### Google Stitch System (stitch-skill / stitch-design-taste)
- **Rule**: Generate agent-friendly `DESIGN.md` using strict typography, hardware-accelerated layouts, and Google Stitch design system constraints.

### UI/UX Pro Max (ui-ux-pro-max)
- **Database**: Quick lookup for 84 style presets, 161 curated color palettes, 73 verified font pairings, 99 UX guidelines, and 25 chart templates across 17 tech stacks.

## Component & Framework Rules

### shadcn/ui (shadcn)
- **Structure**: Rely on `components.json` registry pathing. Extend components using default utility presets.
- **Customization**: Do not rewrite primitive styling; override using Tailwind classes at the entry file level.

### Radix Migration (migrate-radix-to-base)
- **Logic**: Convert primitives cleanly from Radix UI to Base UI equivalents without breaking state management or keyboard controls.

### Redesign (redesign-skill / redesign-existing-projects)
- **Process**: (1) Audit layout elements, (2) Identify generic templates, (3) Apply high-end tokens without breaking functionality.
- **Caution**: Never break backend-routing, dynamic links, or API bindings.

## Generation & Image Concepts

### Brand Kit (brandkit)
- **Outputs**: Minimalist logo grids, brand-guidelines boards, visual-world decks, and editorial mockup presentations.

### Image to Code (image-to-code-skill / image-to-code)
- **Logic**: For visual tasks, generate the concept image first, analyze, then write code matching it precisely.
- **Output**: Clean hero, spacious visual cards, detailed layout blocks.

### Imagegen Frontend Web & Mobile (imagegen-frontend-web / imagegen-frontend-mobile)
- **Web**: Generate exactly ONE separate horizontal image per section. Never compress multiple sections into one concept.
- **Mobile**: Show screens framed inside premium iPhone mockup. Enforce strict color palette and clean interface layout (no code).
