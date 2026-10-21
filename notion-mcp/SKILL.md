---
name: notion-mcp
description: Notion workspace helper — search, read, write pages, query databases, capture knowledge, prep meetings, synthesize research, and turn specs into implementation plans.
---

# Notion MCP

## When to Use
- Search Notion workspace
- Baca halaman Notion
- Buat atau update halaman baru
- Query database Notion
- Capture conversations, decisions, learnings, how-tos, FAQs
- Prep meeting agendas or pre-reads from Notion context
- Research across Notion pages and synthesize briefs/reports
- Turn PRD/spec pages into implementation plans and task lists

## Setup If MCP Fails
1. Add MCP: `codex mcp add notion --url https://mcp.notion.com/mcp`
2. Enable remote MCP client: set `[features].rmcp_client = true` in `config.toml` or run `codex --enable rmcp_client`
3. Login: `codex mcp login notion`
4. Ask user to restart Codex after successful login.

## Core Process
1. Search first: `Notion:notion-search`
2. Fetch exact pages: `Notion:notion-fetch`
3. Confirm target database/page when multiple matches appear
4. Preserve source URLs/IDs for citation and backlinks
5. Write/update only after destination and required properties are clear

## Workflows

### Knowledge Capture
1. Ask purpose, audience, freshness, and new-vs-update.
2. Classify: decision, how-to, FAQ, concept/wiki entry, learning note, or documentation page.
3. Locate destination database and required properties.
4. Extract durable context, decisions, action items, assumptions, links, and unresolved questions.
5. Create/update page with tags, owner, status, date, and relations when available.

### Meeting Intelligence
1. Ask objective, desired outcomes, attendees, duration, date/time, and prior materials.
2. Search Notion for relevant docs, past notes, specs, action items, blockers, and risks.
3. Draft agenda or pre-read tailored to attendees and decisions needed.
4. Include open questions, prep tasks, and links to source pages.

### Research Documentation
1. Search and fetch relevant Notion sources.
2. Track source URLs/IDs; use direct quotes only for critical facts.
3. Synthesize findings into brief, comparison, report, or recommendation.
4. Include citations/backlinks and mark assumptions or gaps.

### Spec To Implementation
1. Locate and read PRD/spec page.
2. Extract requirements, acceptance criteria, constraints, priorities, and gaps.
3. Draft implementation plan, tasks, dependencies, risks, and validation checks.
4. Link created tasks/docs back to source spec.

## Don't Do
- Jangan expose token di chat
- Jangan write/update halaman tanpa target jelas
- Jangan close gaps silently; mark assumptions
- Rate limit sensitive flows; batch reads when possible

## Integration
- Use `document-writer` when output needs formal document structure.
- Use `github-cli` when Notion tasks need GitHub issue/PR follow-up.
