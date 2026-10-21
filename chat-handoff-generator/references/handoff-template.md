# Handoff Template

Use this as the default final output structure. Adapt only when the chat clearly needs a different organization.

```markdown
# Chat Handoff: [Short Descriptive Title]

## 1. Purpose of this handoff
[Briefly explain what this handoff is for and what the next AI should be able to continue.]

## 2. Original user goal
- [The user's main goal/request.]
- [Any secondary goals.]

## 3. Conversation context
- [Important background context.]
- [Relevant chronology if needed.]
- [Domain/project/course/work context.]

## 4. User preferences and constraints
- [Language preference.]
- [Tone/style preference.]
- [Formatting requirements.]
- [Technical constraints, deadlines, tools, frameworks, or environment.]

## 5. Important facts and decisions
- [Fact or decision 1.]
- [Fact or decision 2.]
- [Fact or decision 3.]

## 6. Files, links, artifacts, and references mentioned
- **[Name]**: [what it is, why it matters, current status]
- **[Name]**: [what it is, why it matters, current status]

## 7. Work already completed
- [Output, fix, plan, artifact, analysis, or decision already completed.]
- [Include enough detail so the next AI does not redo work unnecessarily.]

## 8. Open tasks and next steps
- [Task 1]: [status/context/expected next action]
- [Task 2]: [status/context/expected next action]

## 9. Issues, risks, conflicts, or uncertainty
- [Any unresolved ambiguity.]
- [Any conflict between earlier and later chat messages.]
- [Any warning or limitation.]

## 10. Deduplicated repeated information
- [Merged duplicate item, only if repetition matters or there were multiple variants.]
- [Otherwise say: No meaningful duplicates needed separate reporting.]

## 11. Instructions for the next AI
- [Specific instruction 1.]
- [Specific instruction 2.]
- [What to avoid repeating or assuming.]

## 12. Compact continuation prompt
Copy/paste this into a new AI chat:

> [A concise prompt that tells the next AI what to do next, using the context above.]
```

## Writing guidance

- Keep the handoff complete but not bloated.
- Merge duplicate statements into a single canonical bullet.
- Preserve corrections and conflicts explicitly.
- Prefer concrete details over generic statements.
- Do not invent missing information.
- If a section has no content, write `Tidak disebutkan dalam chat` or `Not specified in the chat`.
