---
name: chat-handoff-generator
description: create complete handoff documents from any AI chat export or copied conversation transcript — ChatGPT, Claude, Gemini, or generic/custom exports. use when the user provides a chat export file, conversations.json, chat transcript, markdown/text conversation, or asks to summarize a chat for another AI without missing important information. the skill extracts all durable context, decisions, user preferences, tasks, files, assumptions, and unresolved items, merges duplicate or repeated information into one canonical entry, and produces a high-quality final handoff in markdown.
---

# Chat Handoff Generator

Use this skill to turn a chat export or conversation transcript — from ChatGPT, Claude, Gemini, or any other AI platform — into a complete handoff document that another AI can read to understand the conversation without losing important context.

This skill is platform-agnostic by design. Never assume the source is ChatGPT specifically; detect the actual format of what the user provides and handle it accordingly.

## Core behavior

Create a **final handoff**, not a loose summary. Preserve every meaningful piece of information, but merge duplicates into one canonical statement.

Prioritize:
- completeness over brevity
- explicit facts over vague summaries
- chronological continuity when it matters
- deduplication without deleting nuance
- clear instructions for the next AI

Do not include a separate quality checklist unless the user asks for one.

## Input handling

Accept any of these inputs, from any AI platform:
- chat export ZIP or JSON (ChatGPT `conversations.json`, Claude.ai data export, Gemini/Google AI Studio export, or any other platform's export)
- generic/custom JSON containing a list of messages (e.g. `{"role": ..., "content": ...}` objects, however they're wrapped)
- copied conversation text from any AI chat, in any language
- markdown, plain text transcript
- selected excerpt from a longer chat

If the input is a file export and parsing is needed, use `scripts/normalize_chat_export.py` to produce a normalized markdown transcript before writing the handoff. The script auto-detects the export format (ChatGPT tree-structured `mapping`, Claude-style `chat_messages`, or generic message lists) — do not assume a format ahead of time, and do not ask the user which platform it's from unless the script fails to parse it. Treat the normalized transcript as source material: it should preserve repeated messages and the selected active branch (for platforms with edit/regenerate branches), while final deduplication happens only when writing the handoff.

If the user provides multiple conversations, ask which conversation to hand off unless the user clearly asks for all of them. If all conversations are requested, create one handoff per conversation or a combined handoff with clear conversation boundaries.

If the script cannot recognize the input's structure, fall back to reading the raw file directly and extracting messages manually using best judgment (look for role/speaker labels, timestamps, and message boundaries) — do not block the handoff on an unsupported export format.

## Workflow

1. **Read and normalize the chat**
   - Identify participants, timestamps if available, attachments/files mentioned, and tool outputs if present.
   - Preserve chronological order during analysis.
   - For platforms with regenerated or edited branches (e.g. ChatGPT), use the active branch; do not merge abandoned sibling branches into the transcript unless the user asks for all branches.
   - Preserve repeated messages in the normalized transcript. A repeated `continue`, correction, or command may explain chronology and should not be removed before analysis.
   - If the export includes hidden/internal implementation metadata, ignore metadata that does not affect the user-facing context.
   - If the transcript is very long (roughly beyond what fits comfortably in context, e.g. very long ChatGPT/Claude histories), process it in sequential chunks: summarize each chunk into durable facts/decisions/tasks first, then merge the chunk summaries together before writing the final handoff. Never silently truncate — if forced to drop content, say so explicitly in the handoff instead of leaving a silent gap.

2. **Extract all durable information**
   Capture information that another AI would need to continue the work, including:
   - user goals and original request
   - important background context
   - constraints, preferences, and style requirements
   - decisions already made
   - assumptions accepted during the conversation
   - files, links, datasets, images, or artifacts mentioned
   - code, commands, formulas, templates, schemas, or configuration details
   - errors encountered and fixes attempted
   - partial outputs already produced
   - open questions, unresolved issues, and next steps
   - any warnings, caveats, or uncertainty stated in the chat

3. **Handle sensitive data before finalizing**
   Before including anything in the handoff, scan for secrets and sensitive personal data: API keys/tokens, passwords, private keys, session cookies, government ID numbers, credit card or bank details, or personal contact info not clearly needed for the task.
   - Replace the sensitive value with a placeholder like `[REDACTED: API key]` and keep a note that a credential was present, since the next AI may need to know one exists (e.g. "requires an API key, value redacted") without exposing the value itself.
   - Never redact ordinary technical content that only looks sensitive out of context (example/placeholder keys like `sk-xxxx...`, public URLs, non-secret config).
   - When unsure whether something is sensitive, prefer redacting it and noting that it was removed, over including it.
   - This applies regardless of destination — the handoff is meant to be copy-pasted elsewhere (see section 12 of the template), so treat it as leaving the current environment.

4. **Deduplicate carefully**
   Merge duplicates when the same fact, instruction, decision, or task appears more than once.
   - Keep the most complete and most recent version when duplicate items conflict only in detail.
   - Preserve meaningful differences as subpoints instead of deleting them.
   - If two statements conflict, do not merge them as if they agree. Mark the conflict clearly in the handoff.
   - Combine repeated user preferences into one canonical preference entry.
   - Combine repeated tasks into one task entry, with status if known.

5. **Write the final handoff**
   Use the structure in `references/handoff-template.md` as the default. Adapt section names when needed, but keep the output easy for another AI to consume. Write it so it's understandable regardless of which AI model or platform reads it next — avoid references to source-platform-specific UI concepts (e.g. don't say "regenerate button") unless that context is actually needed.

6. **Final review before responding**
   Silently verify that:
   - the handoff includes all meaningful details from the chat
   - duplicates are merged
   - unresolved items are not presented as resolved
   - instructions to the next AI are actionable
   - the output does not invent facts that were not in the chat
   - no secrets or unnecessary sensitive personal data remain unredacted

## Output rules

Return the handoff in markdown.

Use this title format:

```markdown
# Chat Handoff: [short descriptive title]
```

Write in the same language as the user's request unless the user asks otherwise.

Use concise but complete bullets. Avoid filler phrases, generic praise, and over-polished summaries. The handoff should be practical, dense, and easy to scan.

When information is absent, say `Tidak disebutkan dalam chat` or `Not specified in the chat`, depending on output language.

## Deduplication rules

Treat these as duplicates:
- exact repeated messages
- repeated user requirements with equivalent meaning
- repeated summaries of the same decision
- repeated task descriptions referring to the same work item
- repeated file descriptions referring to the same file or artifact

Do not treat these as duplicates:
- a later correction to an earlier statement
- a changed decision
- two similar tasks with different scope
- the same file used for different purposes
- repeated errors with different causes or fixes

When merging duplicates, prefer this canonical format:

```markdown
- [canonical fact/task/preference].
  - Repeated/confirmed in the chat more than once.
  - Nuance: [only include if repeated versions contained distinct useful detail].
```

Only mention repetition when it helps the next AI understand confidence or context. Otherwise, simply merge silently.

## Handling different export structures

Chat exports vary by platform, but the normalized transcript should read the same regardless of source:

- **ChatGPT**: `conversations.json` with tree-structured `mapping` and `current_node`, identifying the active visible branch after edits/regenerations. Author roles include user, assistant, system, or tool.
- **Claude**: data export with `chat_messages`, each with a `sender` (`human`/`assistant`) and `text`.
- **Gemini / generic**: typically a flat list of messages with some combination of `role`/`sender`/`author` and `content`/`text`/`message` keys, sometimes wrapped in `messages`, `conversation`, or `turns`.
- **Plain transcript**: pasted text with visible speaker labels (e.g. "User:", "You:", "Assistant:", "ChatGPT:", "Claude:") — read and segment directly, no script needed.

For handoff purposes, regardless of platform:
- Focus on user- and assistant-visible content.
- Follow the active/selected branch when a platform has edit or regenerate branches; don't contaminate the handoff with abandoned branches.
- Include tool or code-execution results only when they affect the answer, artifact, file, citation, or decision.
- Exclude irrelevant low-level metadata (internal IDs, node IDs, asset pointers) unless needed to identify a file or output.
- Keep timestamps only when chronology, deadlines, or versioning matters.
- Non-text content (images, tool calls, browsing results, attachments) is rendered by the script as short bracketed placeholders (e.g. `[Image attached: ...]`, `[Tool/execution output]`) rather than raw JSON — carry that same plain-language treatment into the handoff itself.

## Script usage

To normalize a chat export from any supported platform:

```bash
python scripts/normalize_chat_export.py <input-path> --output normalized_transcript.md
```

The format is auto-detected from the input — no need to specify which platform it came from.

Optional flags:

```bash
python scripts/normalize_chat_export.py <input-path> --list
python scripts/normalize_chat_export.py <input-path> --conversation-index 0 --output normalized_transcript.md
python scripts/normalize_chat_export.py <input-path> --title-contains "project" --output normalized_transcript.md
```

Use the script output as source material, then write the final handoff yourself using the template — including the sensitive-data check in step 3 of the workflow, which the script does not perform.
