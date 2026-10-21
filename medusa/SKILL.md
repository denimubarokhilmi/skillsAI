---
name: medusa
description: AI-first security scanner. AI/ML supply chain, prompt injection, secret leak detection, and repo poisoning scans.
---
# MEDUSA — AI Security Scanner

PyPI: `medusa-security`. 40,000+ detection patterns. Zero setup — `pip install && medusa scan .`

## When to Use
- Security scan project before deploy / PR / merge
- Scan GitHub repo for AI supply chain attacks, prompt injection, MCP tool poisoning
- Audit repo for leaked API keys / tokens / secrets in history, chat logs, configs
- Check AI editor configs (Claude Code, Cursor, Copilot, Gemini) for weaponized rules
- Verify no CVE-exploitable patterns (Log4Shell, LangChain RCE, MCP RCE, etc.)

## Install
```powershell
pip install medusa-security
```

## Commands

### Init — Create `.medusa.yml` config
```powershell
medusa init
```

### Scan local project
```powershell
medusa scan .
medusa scan C:\path\to\project
```

### Scan GitHub repo for AI supply chain attacks
```powershell
medusa scan --git https://github.com/user/repo.git
```

### Secret leak detection
Scans: Claude Code, Cursor, Copilot, Gemini chat histories, bash/zsh/sql/mysql/python REPL history.
21 issuer types: Anthropic, OpenAI, PyPI, GitHub PATs, AWS, GCP, Stripe, Slack, and more.
```powershell
medusa secrets scan
```

### Interactive purge (with byte-identical backup + JSONL-safe redaction)
```powershell
medusa secrets purge
```
Prompts `[y/n/s/a/q]` per secret with mandatory backup.

## Detection Coverage
| Category | Count |
|----------|-------|
| AI/ML security rules | 40,000+ |
| Specialized scanners | 79 |
| CVE detections | 200 (Log4Shell, Spring4Shell, XZ, LangChain RCE, MCP RCE, React2Shell) |
| Repo poisoning | 28+ AI editor config types |
| Language coverage | 46+ file types |
| Platform | Linux, macOS, Windows |

## IDE Integration
Claude Code, Cursor, VS Code, Gemini CLI, GitHub Copilot.

## Configuration
Project-level `.medusa.yml` for path exclusion, custom rules, severity thresholds.

## Guidelines
- Run `medusa scan .` before marking PR ready or merging
- Run `medusa scan --git <URL>` on third-party deps before integrating
- Run `medusa secrets scan` immediately on credential leak suspicion
- Never `medusa secrets purge` without reviewing each finding first
- Check parallel processing `--threads` on resource-constrained machines (default: auto)
