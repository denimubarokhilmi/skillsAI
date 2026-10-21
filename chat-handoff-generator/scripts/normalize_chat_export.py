#!/usr/bin/env python3
"""Normalize AI chat exports or transcripts into readable markdown.

Format-agnostic: works with exports and transcripts from ChatGPT, Claude,
Gemini, and most other chat platforms, plus generic/custom JSON message
formats and plain-text/markdown transcripts.

Supported shapes (auto-detected, no flag needed):
- ChatGPT export ZIP or raw conversations.json (tree-structured `mapping`
  with `current_node` branch selection)
- Claude.ai data export (`chat_messages` with `sender`/`text`)
- Generic JSON: a list of {"role"/"sender"/"author": ..., "content"/"text"/
  "message": ...} objects, optionally wrapped in {"messages": [...]},
  {"conversation": [...]}, {"turns": [...]}, or {"conversations": [...]}
- Plain .txt / .md transcripts (passed through as-is; the model reads them
  directly, no role parsing needed)

This script does not create the final handoff. It only prepares clean,
readable source material for the model to read and summarize.
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

# Roles that show up under different names across platforms, normalized to
# a small consistent vocabulary so the output reads the same regardless of
# source platform.
ROLE_ALIASES = {
    "human": "user",
    "model": "assistant",
    "bot": "assistant",
    "ai": "assistant",
    "chatbot": "assistant",
    "gpt": "assistant",
    "claude": "assistant",
    "gemini": "assistant",
}

# Keys, in priority order, that might hold the list of messages for a
# "generic" (non-ChatGPT) conversation object.
GENERIC_MESSAGE_KEYS = ("chat_messages", "messages", "conversation", "turns", "history")

# Keys, in priority order, that might hold the message text/body for a
# single generic message object.
GENERIC_TEXT_KEYS = ("text", "content", "message", "value")

# Keys, in priority order, that might identify the speaker of a generic
# message object.
GENERIC_ROLE_KEYS = ("role", "sender", "author", "speaker", "from")


def load_input(path: Path) -> Any:
    if path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as zf:
            names = zf.namelist()
            # Prefer a ChatGPT-style conversations.json, but fall back to
            # any top-level .json file (Claude/Gemini/other exports use
            # different filenames).
            target = next((n for n in names if n.endswith("conversations.json")), None)
            if not target:
                target = next(
                    (n for n in names if n.lower().endswith(".json") and "/" not in n.strip("/")),
                    None,
                )
            if not target:
                target = next((n for n in names if n.lower().endswith(".json")), None)
            if not target:
                raise SystemExit("No JSON conversation file found in ZIP export.")
            with zf.open(target) as f:
                return json.loads(f.read().decode("utf-8"))

    if path.suffix.lower() == ".json":
        return json.loads(path.read_text(encoding="utf-8"))

    if path.suffix.lower() in {".txt", ".md", ".markdown"}:
        return path.read_text(encoding="utf-8")

    raise SystemExit(f"Unsupported input type: {path.suffix}")


def ts(value: Any) -> str:
    if not value:
        return ""
    try:
        # Most platforms use unix epoch seconds; some use ISO strings already.
        return datetime.fromtimestamp(float(value), tz=timezone.utc).isoformat()
    except (TypeError, ValueError):
        return str(value)


def normalize_role(role: Any) -> str:
    if isinstance(role, dict):
        role = role.get("role") or role.get("name") or role.get("label") or "unknown"
    role = str(role).strip().lower() or "unknown"
    return ROLE_ALIASES.get(role, role)


# ---------------------------------------------------------------------------
# Content rendering: turns platform-specific content blocks into readable
# text instead of dumping raw JSON, so the normalized transcript stays
# clean regardless of source platform.
# ---------------------------------------------------------------------------

def content_to_text(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, (int, float, bool)):
        return str(content)
    if isinstance(content, list):
        parts = [content_to_text(item) for item in content]
        return "\n".join(p for p in parts if p)
    if isinstance(content, dict):
        ctype = content.get("content_type") or content.get("type")

        if ctype in ("text", "multimodal_text"):
            return content_to_text(content.get("parts", content.get("text", "")))

        if ctype == "code":
            lang = content.get("language", "")
            body = content_to_text(content.get("text") or content.get("parts", []))
            label = f"[Code block ({lang})]" if lang else "[Code block]"
            return f"{label}\n{body}" if body else label

        if ctype in ("execution_output", "tool_result", "tool_use_result"):
            body = content_to_text(content.get("text") or content.get("output") or content.get("parts", []))
            return f"[Tool/execution output]\n{body}" if body else "[Tool/execution output]"

        if ctype in ("image_asset_pointer", "image", "image_url"):
            name = content.get("name") or content.get("asset_pointer") or content.get("url") or "image"
            return f"[Image attached: {name}]"

        if ctype in ("audio_transcription", "audio"):
            body = content_to_text(content.get("text") or content.get("parts", []))
            return f"[Audio transcript]\n{body}" if body else "[Audio attached]"

        if ctype in ("tether_browsing_display", "tether_quote", "web_search", "search_result"):
            url = content.get("url") or content.get("domain") or ""
            return f"[Browsing/search result{f' from {url}' if url else ''}]"

        if ctype in ("file", "document", "attachment"):
            name = content.get("name") or content.get("filename") or "file"
            return f"[File attached: {name}]"

        # Generic fallbacks: try common text-bearing keys before giving up.
        for key in ("text", "parts", "result", "value"):
            if key in content and content[key]:
                return content_to_text(content[key])

        if ctype:
            return f"[Unsupported content type: {ctype}]"
        return ""
    return str(content)


# ---------------------------------------------------------------------------
# ChatGPT-style tree conversations (mapping + current_node)
# ---------------------------------------------------------------------------

def active_node_ids(mapping: dict[str, Any], current_node: Any) -> list[str]:
    """Return the selected ChatGPT conversation path when current_node is present."""
    if not isinstance(current_node, str) or current_node not in mapping:
        return []

    path: list[str] = []
    seen: set[str] = set()
    node_id = current_node
    while isinstance(node_id, str) and node_id in mapping and node_id not in seen:
        seen.add(node_id)
        path.append(node_id)
        node = mapping.get(node_id)
        if not isinstance(node, dict):
            break
        parent = node.get("parent")
        if not parent:
            break
        node_id = parent

    path.reverse()
    return path


def fallback_node_ids(mapping: dict[str, Any]) -> list[str]:
    children = {k: v.get("children", []) for k, v in mapping.items() if isinstance(v, dict)}
    roots = [k for k, v in mapping.items() if isinstance(v, dict) and not v.get("parent")]
    ordered_ids: list[str] = []
    seen: set[str] = set()

    def walk(node_id: str) -> None:
        if node_id in seen:
            return
        seen.add(node_id)
        ordered_ids.append(node_id)
        for child in children.get(node_id, []):
            walk(child)

    for root in roots or list(mapping.keys())[:1]:
        walk(root)

    return ordered_ids


def chatgpt_style_messages(conv: dict[str, Any]) -> list[dict[str, str]]:
    mapping = conv["mapping"]
    ordered_ids = active_node_ids(mapping, conv.get("current_node"))
    if not ordered_ids:
        ordered_ids = fallback_node_ids(mapping)

    messages: list[dict[str, str]] = []
    for node_id in ordered_ids:
        node = mapping.get(node_id) or {}
        msg = node.get("message")
        if not isinstance(msg, dict):
            continue
        author = msg.get("author", {}) or {}
        role = normalize_role(author.get("role", "unknown"))
        content = content_to_text(msg.get("content")).strip()
        if not content:
            continue
        create_time = ts(msg.get("create_time"))
        messages.append({"role": role, "time": create_time, "content": content})
    return messages


# ---------------------------------------------------------------------------
# Generic flat-list conversations (Claude, Gemini, custom exports, etc.)
# ---------------------------------------------------------------------------

def generic_style_messages(items: list[Any]) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []
    for item in items:
        if isinstance(item, str):
            content = item.strip()
            if content:
                messages.append({"role": "unknown", "time": "", "content": content})
            continue
        if not isinstance(item, dict):
            continue

        role = "unknown"
        for key in GENERIC_ROLE_KEYS:
            if item.get(key):
                role = normalize_role(item[key])
                break

        raw_content = None
        for key in GENERIC_TEXT_KEYS:
            if item.get(key) not in (None, ""):
                raw_content = item[key]
                break
        content = content_to_text(raw_content).strip()
        if not content:
            continue

        create_time = ts(item.get("create_time") or item.get("created_at") or item.get("timestamp") or item.get("time"))
        messages.append({"role": role, "time": create_time, "content": content})
    return messages


def find_generic_messages(conv: dict[str, Any]) -> list[Any] | None:
    for key in GENERIC_MESSAGE_KEYS:
        value = conv.get(key)
        if isinstance(value, list):
            return value
    return None


# ---------------------------------------------------------------------------
# Dispatch: detect the conversation's shape and extract messages uniformly.
# ---------------------------------------------------------------------------

def conversation_messages(conv: dict[str, Any]) -> list[dict[str, str]]:
    if isinstance(conv.get("mapping"), dict):
        return chatgpt_style_messages(conv)
    generic = find_generic_messages(conv)
    if generic is not None:
        return generic_style_messages(generic)
    return []


def looks_like_message(item: Any) -> bool:
    if not isinstance(item, dict):
        return False
    has_role = any(item.get(k) for k in GENERIC_ROLE_KEYS)
    has_text = any(item.get(k) not in (None, "") for k in GENERIC_TEXT_KEYS)
    return has_role and has_text


def as_conversations(data: Any) -> list[dict[str, Any]]:
    """Normalize any supported top-level shape into a list of conversation dicts."""
    if isinstance(data, dict):
        if isinstance(data.get("mapping"), dict):
            return [data]
        if isinstance(data.get("conversations"), list):
            return [x for x in data["conversations"] if isinstance(x, dict)]
        if find_generic_messages(data) is not None:
            return [data]
        return []

    if isinstance(data, list):
        if not data:
            return []
        # A flat list of message objects (no wrapper) -> treat as one conversation.
        if all(looks_like_message(x) for x in data):
            return [{"title": "Conversation", "messages": data}]
        # Otherwise assume it's a list of conversation objects (ChatGPT export
        # top level, or a list of Claude/generic conversation objects).
        convs = [x for x in data if isinstance(x, dict)]
        return convs

    return []


def list_conversations(convs: list[dict[str, Any]]) -> None:
    for i, conv in enumerate(convs):
        title = conv.get("title") or conv.get("name") or "Untitled"
        created = ts(conv.get("create_time") or conv.get("created_at"))
        updated = ts(conv.get("update_time") or conv.get("updated_at"))
        count = len(conversation_messages(conv))
        print(f"[{i}] {title} | messages={count} | created={created} | updated={updated}")


def render_markdown(convs: Iterable[dict[str, Any]]) -> str:
    chunks: list[str] = []
    for idx, conv in enumerate(convs):
        title = conv.get("title") or conv.get("name") or f"Conversation {idx + 1}"
        created = ts(conv.get("create_time") or conv.get("created_at"))
        updated = ts(conv.get("update_time") or conv.get("updated_at"))
        chunks.append(f"# Conversation: {title}\n")
        if created or updated:
            chunks.append(f"- Created: {created or 'unknown'}")
            chunks.append(f"- Updated: {updated or 'unknown'}")
            chunks.append("")
        messages = conversation_messages(conv)
        if not messages:
            chunks.append("_No readable messages found in this conversation._\n")
            continue
        for msg in messages:
            header = f"## {msg['role'].title()}"
            if msg["time"]:
                header += f" ({msg['time']})"
            chunks.append(header)
            chunks.append(msg["content"])
            chunks.append("")
    return "\n".join(chunks).strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Normalize a chat export (ChatGPT, Claude, Gemini, or generic JSON) into a markdown transcript."
    )
    parser.add_argument("input_path", help="Path to .zip, .json, .txt, or .md input")
    parser.add_argument("--output", "-o", default="normalized_transcript.md", help="Output markdown path")
    parser.add_argument("--list", action="store_true", help="List conversations and exit")
    parser.add_argument("--conversation-index", type=int, help="Select conversation index")
    parser.add_argument("--title-contains", help="Select conversations whose title contains this text")
    args = parser.parse_args()

    path = Path(args.input_path)
    data = load_input(path)

    if isinstance(data, str):
        Path(args.output).write_text(data, encoding="utf-8")
        print(f"Wrote transcript text to {args.output}")
        return 0

    convs = as_conversations(data)
    if not convs:
        raise SystemExit(
            "Could not recognize a conversation structure in this input. "
            "Supported: ChatGPT export, Claude export, or a generic list of "
            "{role, content} messages."
        )

    if args.list:
        list_conversations(convs)
        return 0

    selected = convs
    if args.conversation_index is not None:
        if args.conversation_index < 0 or args.conversation_index >= len(convs):
            raise SystemExit("conversation-index out of range.")
        selected = [convs[args.conversation_index]]
    elif args.title_contains:
        needle = args.title_contains.lower()
        selected = [c for c in convs if needle in str(c.get("title") or c.get("name") or "").lower()]
        if not selected:
            raise SystemExit("No conversations matched --title-contains.")

    out = render_markdown(selected)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(out, encoding="utf-8")
    print(f"Wrote {len(selected)} conversation(s) to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
