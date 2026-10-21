#!/usr/bin/env python3
"""Normalize ChatGPT exports or transcripts into readable markdown.

Supports:
- ChatGPT export ZIP containing conversations.json
- raw conversations.json
- single conversation JSON
- .txt or .md transcript files

This script does not create the final handoff. It prepares source material for the model.
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


def load_input(path: Path) -> Any:
    if path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as zf:
            names = zf.namelist()
            target = None
            for name in names:
                if name.endswith("conversations.json"):
                    target = name
                    break
            if not target:
                raise SystemExit("No conversations.json found in ZIP export.")
            with zf.open(target) as f:
                return json.loads(f.read().decode("utf-8"))

    if path.suffix.lower() in {".json"}:
        return json.loads(path.read_text(encoding="utf-8"))

    if path.suffix.lower() in {".txt", ".md", ".markdown"}:
        return path.read_text(encoding="utf-8")

    raise SystemExit(f"Unsupported input type: {path.suffix}")


def ts(value: Any) -> str:
    if not value:
        return ""
    try:
        return datetime.fromtimestamp(float(value), tz=timezone.utc).isoformat()
    except Exception:
        return str(value)


def content_to_text(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            text = content_to_text(item)
            if text:
                parts.append(text)
        return "\n".join(parts)
    if isinstance(content, dict):
        ctype = content.get("content_type")
        if ctype == "text":
            return content_to_text(content.get("parts", []))
        if ctype == "multimodal_text":
            return content_to_text(content.get("parts", []))
        if "text" in content:
            return content_to_text(content["text"])
        if "parts" in content:
            return content_to_text(content["parts"])
        if "result" in content:
            return content_to_text(content["result"])
        return json.dumps(content, ensure_ascii=False, indent=2)
    return str(content)


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


def conversation_messages(conv: dict[str, Any]) -> list[dict[str, str]]:
    mapping = conv.get("mapping")
    if not isinstance(mapping, dict):
        return []

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
        role = author.get("role", "unknown")
        content = content_to_text(msg.get("content"))
        content = content.strip()
        if not content:
            continue
        create_time = ts(msg.get("create_time"))
        messages.append({"role": role, "time": create_time, "content": content})
    return messages


def as_conversations(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    if isinstance(data, dict) and "mapping" in data:
        return [data]
    if isinstance(data, dict) and "conversations" in data and isinstance(data["conversations"], list):
        return [x for x in data["conversations"] if isinstance(x, dict)]
    return []


def list_conversations(convs: list[dict[str, Any]]) -> None:
    for i, conv in enumerate(convs):
        title = conv.get("title") or "Untitled"
        created = ts(conv.get("create_time"))
        updated = ts(conv.get("update_time"))
        count = len(conversation_messages(conv))
        print(f"[{i}] {title} | messages={count} | created={created} | updated={updated}")


def render_markdown(convs: Iterable[dict[str, Any]]) -> str:
    chunks: list[str] = []
    for idx, conv in enumerate(convs):
        title = conv.get("title") or f"Conversation {idx + 1}"
        created = ts(conv.get("create_time"))
        updated = ts(conv.get("update_time"))
        chunks.append(f"# Conversation: {title}\n")
        if created or updated:
            chunks.append(f"- Created: {created or 'unknown'}")
            chunks.append(f"- Updated: {updated or 'unknown'}")
            chunks.append("")
        for msg in conversation_messages(conv):
            header = f"## {msg['role'].title()}"
            if msg["time"]:
                header += f" ({msg['time']})"
            chunks.append(header)
            chunks.append(msg["content"])
            chunks.append("")
    return "\n".join(chunks).strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize ChatGPT export to markdown transcript.")
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
        raise SystemExit("Could not find ChatGPT conversation structure in input.")

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
        selected = [c for c in convs if needle in str(c.get("title", "")).lower()]
        if not selected:
            raise SystemExit("No conversations matched --title-contains.")

    out = render_markdown(selected)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(out, encoding="utf-8")
    print(f"Wrote {len(selected)} conversation(s) to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
