#!/usr/bin/env bash
# parse_commits.sh — Deterministic git log parser for changelog-generator
#
# Usage: parse_commits.sh <repo-path> [commit-range]
#
# Output: JSON to stdout with structure:
# {
#   "tags": ["v1.2.0", "v1.1.0", ...],   // sorted newest first
#   "unreleased": [ {commit}, ... ],      // commits after latest tag
#   "by_tag": {
#     "v1.2.0": { "date": "YYYY-MM-DD", "commits": [ {commit}, ... ] },
#     ...
#   },
#   "no_tags": true|false,
#   "by_week": {  // only populated if no_tags is true
#     "Week of YYYY-MM-DD": [ {commit}, ... ]
#   }
# }
#
# Each {commit} object: { "hash": "...", "message": "...", "prefix": "...",
#                          "breaking": true|false, "body": "..." }

set -euo pipefail

REPO_PATH="${1:?Usage: parse_commits.sh <repo-path> [commit-range]}"
RANGE="${2:-}"

cd "$REPO_PATH" || { echo '{"error": "invalid repo path"}' >&2; exit 1; }

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo '{"error": "not a git repository"}' >&2
  exit 1
fi

# Get log excluding merge commits, with a machine-parseable separator
LOG_FORMAT="%H%x1f%s%x1f%b%x1e"

if [ -n "$RANGE" ]; then
  RAW_LOG=$(git log --no-merges --pretty="format:${LOG_FORMAT}" "$RANGE" || true)
else
  RAW_LOG=$(git log --no-merges --pretty="format:${LOG_FORMAT}" || true)
fi

TAGS=$(git tag --sort=-v:refname 2>/dev/null || true)
NO_TAGS="false"
if [ -z "$TAGS" ]; then
  NO_TAGS="true"
fi

# Use python3 for reliable JSON construction (avoids bash JSON-escaping bugs)
python3 - "$NO_TAGS" <<'PYEOF'
import sys, subprocess, json, re
from datetime import datetime

no_tags = sys.argv[1] == "true"

def sh(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout

raw = sh("git log --no-merges --pretty=format:'%H%x1f%s%x1f%b%x1e'")
entries = [e for e in raw.split('\x1e') if e.strip()]

PREFIX_RE = re.compile(r'^(\w+)(\([\w\-\/]+\))?(!)?:\s*(.*)$')

def parse_commit(entry):
    parts = entry.split('\x1f')
    if len(parts) < 3:
        return None
    commit_hash, subject, body = parts[0].strip(), parts[1], parts[2]
    m = PREFIX_RE.match(subject)
    breaking = 'BREAKING CHANGE:' in body
    if m:
        prefix = m.group(1)
        bang = bool(m.group(3))
        desc = m.group(4)
        if bang:
            breaking = True
    else:
        prefix = None
        desc = subject
    return {
        "hash": commit_hash[:7],
        "message": desc.strip(),
        "raw_subject": subject,
        "prefix": prefix,
        "breaking": breaking,
        "body": body.strip()
    }

commits = [c for c in (parse_commit(e) for e in entries) if c]

# Get tag list with dates
tags_raw = sh("git tag --sort=-v:refname").strip().split('\n')
tags_raw = [t for t in tags_raw if t]

result = {"tags": tags_raw, "no_tags": no_tags, "unreleased": [], "by_tag": {}, "by_week": {}}

if not no_tags and tags_raw:
    # Get commit hash at each tag boundary to bucket commits
    # Build ranges: unreleased = latest_tag..HEAD, then tag[i]..tag[i-1] for each pair
    latest_tag = tags_raw[0]

    def full_hash_set(range_expr):
        return set(h.strip()[:7] for h in sh(f"git log --no-merges --pretty=%H {range_expr}").split('\n') if h.strip())

    unreleased_set = full_hash_set(f"{latest_tag}..HEAD")
    result["unreleased"] = [c for c in commits if c["hash"] in unreleased_set]

    for i, tag in enumerate(tags_raw):
        if i + 1 < len(tags_raw):
            range_expr = f"{tags_raw[i+1]}..{tag}"
        else:
            range_expr = tag
        tag_set = full_hash_set(range_expr)
        tag_date = sh(f"git log -1 --format=%ai {tag}").strip()[:10]
        result["by_tag"][tag] = {
            "date": tag_date,
            "commits": [c for c in commits if c["hash"] in tag_set]
        }
else:
    # No tags: group by week using commit date
    week_map = {}
    date_raw = sh("git log --no-merges --pretty=format:'%H%x7c%ai'")
    hash_to_week = {}
    for line in date_raw.split('\n'):
        if not line.strip():
            continue
        h, date_str = line.split('|', 1)
        dt = datetime.strptime(date_str.strip()[:10], "%Y-%m-%d")
        # Monday of that week
        monday = dt.date().toordinal() - dt.weekday()
        from datetime import date
        week_start = date.fromordinal(monday)
        hash_to_week[h[:7]] = f"Week of {week_start.isoformat()}"
    for c in commits:
        wk = hash_to_week.get(c["hash"], "Unknown week")
        week_map.setdefault(wk, []).append(c)
    result["by_week"] = week_map

print(json.dumps(result, indent=2, ensure_ascii=False))
PYEOF
