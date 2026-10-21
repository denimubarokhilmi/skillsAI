---
name: github-cli
description: Full GitHub management via gh — repos, issues, PRs, releases, PR review, issue triage, code search, and CI status.
---

# GitHub CLI

## When to Use
- Cek assigned issues
- Issue triage
- Review PR
- Code search di repositori Habib
- Trigger workflow atau cek CI/CD status
- Buat release

## Process
1. Auth: `gh auth login` (sekali)
2. Issues: `gh issue list --assignee @me`
3. Triage: cek label bug → view → assign/label
4. PR list: `gh pr list --reviewer @me`
5. PR detail: `gh pr view <num> --comments`
6. PR diff: `gh pr diff <num>`
7. Review: `gh pr review <num> --approve` atau `--request-changes`
8. Merge: `gh pr merge <num>`
9. Code search: `gh search code '<query>' --repo Haafzd/assist-core`
10. CI runs: `gh run list --limit 10`
11. Failed logs: `gh run view <id> --log-failed`
12. Release: `gh release create v1.0`

## Don't Do
- Jangan approve PR tanpa baca diff
- Jangan merge PR tanpa review
- Jangan close issue tanpa reason
- Jangan force push ke main
- `gh auth` butuh browser login — kalo ga bisa, minta Habib

## Integration
- `gh-address-comments` — handle review feedback
- `gh-fix-ci` — debug failed actions
