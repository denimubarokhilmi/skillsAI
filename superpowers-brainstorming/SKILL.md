---
name: brainstorming
description: Run before any creative work (features, components, behavior changes). Explores intent and requirements before implementation.
---
# Brainstorming

**HARD GATE:** Do NOT code, scaffold, or implement until design is approved. Applies to EVERY project, even "simple" ones.

## Checklist (in order)
1. **Context** - Check files, docs, recent commits
2. **Visual Companion** (if needed) - Offer in separate message if mockups/diagrams will help. Wait for response.
3. **Clarify** - Ask ONE question at a time. Multiple choice preferred.
4. **Approaches** - Propose 2-3 options with trade-offs. Recommend one.
5. **Design** - Present architecture, components, data flow. Get approval per section.
6. **Spec** - Write to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit
7. **Self-Review** - Scan for placeholders, contradictions, scope, ambiguity. Fix inline.
8. **User Gate** - Get user approval on written spec before proceeding
9. **Next** - Invoke `writing-plans` skill

## Design Principles
- Break into smaller units with clear boundaries and interfaces
- Each unit: one purpose, well-defined interface, independently testable
- Follow existing codebase patterns
- Include targeted improvements where current structure affects work
- No unrelated refactoring

## Self-Review Checklist
1. Placeholder scan: Any "TBD", "TODO", incomplete sections? Fix them.
2. Internal consistency: Sections contradict? Fix them.
3. Scope check: Focused enough for single plan, or needs decomposition?
4. Ambiguity check: Requirements could be interpreted two ways? Pick one.

Fix issues inline. No re-review needed.

## Visual Companion Offer (if needed)
"Some of what we're working on might be easier to explain if I can show it to you in a web browser. I can put together mockups, diagrams, comparisons, and other visuals as we go. This feature is still new and can be token-intensive. Want to try it? (Requires opening a local URL)"

Use browser ONLY for visual content (mockups, wireframes, layouts, diagrams). Use terminal for text/concept questions.

**Terminal state:** Invoke `writing-plans` after user approves spec. Do NOT invoke any other implementation skill.
