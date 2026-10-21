---
name: larapruner
description: >
  Dead code scanner and dependency auditor for Laravel projects.
  Use this skill whenever the user wants to find unused classes, remove orphaned Composer
  packages, detect code smells, or run a security audit on a Laravel codebase — even if they
  phrase it as "clean up my Laravel project", "find dead code", "unused imports", "bloated
  composer.json", "Laravel security check", or "refactor audit". Always trigger before a
  PR merge review or pre-deploy cleanup of any Laravel project.
---

# Larapruner — Unused Code & Dependency Scanner for Laravel

Zero-dependency PHP tool. Scans declared classes, `use` references, and `composer.json` deps.

---

## Pre-flight: Verify Installation

**Always run this check first before any scan.**

```bash
command -v larapruner >/dev/null 2>&1 \
  && larapruner --version \
  || echo "NOT_FOUND"
```

**If output is `NOT_FOUND`:**

1. Run the installer (from the extracted skill folder):
   ```bash
   bash ~/.codex/tools/larapruner/install.sh
   ```
   Then add to PATH if prompted:
   ```bash
   export PATH="$PATH:$HOME/.codex/tools/larapruner/bin"
   ```

2. Or run directly without installing:
   ```bash
   php ~/.codex/tools/larapruner/bin/larapruner [args]
   ```

3. Requirements: **PHP 8.0+**
   - Ubuntu/Debian: `sudo apt install php-cli`
   - macOS: `brew install php`
   - Windows: https://www.php.net/downloads

Do **not** proceed with a scan until `larapruner --version` returns successfully.

---

## When to Use

| Trigger | Use Case |
|---------|----------|
| Before PR / merge | Find dead classes introduced in the branch |
| Before deploy | Drop unused Composer deps to slim the build |
| Legacy audit | Orphaned code in old Laravel projects |
| Security review | `.env` misconfig, weak keys, debug flags |
| Refactor planning | Identify bloat, smells, duplicate logic |

---

## Usage

```bash
# Basic scan — current directory
larapruner

# Scan a specific project
larapruner /path/to/laravel-project

# JSON output (machine-readable, pipe-friendly)
larapruner . --json

# Security audit
larapruner . --security

# Security + JSON
larapruner . --security --json

# Refactor smell detection (dry-run)
larapruner . --refactor

# Refactor + auto-remove unused `use` imports (write mode)
larapruner . --refactor --write

# Combine all
larapruner . --security --refactor --json
```

---

## Output Format

### Default (human-readable)

```
[UNUSED CLASSES]
  App\Http\Controllers\LegacyController   (app/Http/Controllers/LegacyController.php)
  App\Services\OldPaymentService          (app/Services/OldPaymentService.php)

[UNUSED COMPOSER DEPS]
  intervention/image
  doctrine/dbal

[SUMMARY]
  Unused classes:   2
  Unused packages:  2
```

### `--json` output structure

```json
{
  "unused_classes": [
    { "class": "App\\Http\\Controllers\\LegacyController", "file": "app/Http/Controllers/LegacyController.php" }
  ],
  "unused_composer_deps": ["intervention/image", "doctrine/dbal"],
  "security": {
    "issues": [
      { "check": "APP_DEBUG", "file": ".env", "severity": "high", "detail": "APP_DEBUG=true in production env" }
    ]
  },
  "refactor": {
    "smells": [
      { "type": "long_method", "class": "App\\Services\\ReportService", "method": "generate", "lines": 312 }
    ]
  },
  "summary": {
    "unused_classes": 2,
    "unused_packages": 2,
    "security_issues": 1,
    "refactor_smells": 1
  }
}
```

---

## What It Detects

### Dead Code
| Check | What |
|-------|------|
| Unused classes | Declared in `app/` but never `use`d in app/config/routes/database/blade |
| Unused composer deps | Package in `require` but its PSR-4/classmap namespace never appears in code |

### Security Mode (`--security`)
| Check | What | Severity |
|-------|------|----------|
| `.env` misconfig | `APP_DEBUG=true`, empty `APP_KEY`, weak `DB_PASSWORD` | high/critical |
| Composer.lock | Known outdated packages (phpunit, guzzle, monolog) | medium |
| Config debug | `app.php` debug flag enabled | medium |

> Reads files only — no network calls, no telemetry.

### Refactor Mode (`--refactor`)
| Smell Type | Category | What |
|------------|----------|------|
| `long_method` | Bloater | Method exceeds ~50 lines |
| `large_class` | Bloater | Class exceeds ~300 lines |
| `switch_statements` | OO Abuser | Switch on type — suggests polymorphism |
| `unused_import` | Dispensable | `use` statement never referenced |
| `duplicate_code` | Dispensable | Repeated logic blocks |
| `comments` | Dispensable | Over-commented / commented-out dead code |

**`--write` mode** only removes unused `use ...;` imports. It does **not** delete files, rewrite methods, or restructure classes. Always dry-run first.

---


### Test Mode (`--tests`)

| Check | What |
|-------|------|
| Test count | Total `*Test.php` files found in `tests/` directory |
| Tested classes | Classes mapped via namespace convention (`Tests\Unit\Services\XTest` → `App\Services\X`) or `@covers` annotation |
| Untested classes | App classes without a corresponding test file |
| Artisan test | Runs `php artisan test --compact` if PHP binary is available |

_(Requires `php` on PATH)_

```bash
# Basic test coverage analysis
larapruner . --tests

# Test analysis + JSON output
larapruner . --tests --json

# Combine with other modes
larapruner . --security --refactor --tests
```

**Convention used for class mapping:**
- `Tests\Unit\Services\XTest` → `App\Services\X`
- `Tests\Feature\Http\Controllers\YTest` → `App\Http\Controllers\Y`
- `@covers App\Some\Class` annotation also counted

**Skip:** Providers, Kernel, Exceptions are excluded from untested detection.

## False Positives (auto-skipped)

**Classes:**
- `App\Providers\*`, `App\Http\Kernel`, `App\Console\Kernel`, `App\Models\User`
- Classes registered in `config/app.php` (providers, aliases)
- Facades, Blade includes, service-container bindings, event listeners, policy auto-discovery

**Composer deps:**
- `laravel/framework`, `laravel/tinker`, `ext-*`, `php`
- Detection uses **namespace PSR-4/classmap from `composer.lock`**, not vendor string

**Security:**
- `APP_KEY` ignored for `.env.example` — only `.env` is checked
- `base64:xxx` format keys are treated as valid
- Outdated package guessing removed — use `composer audit` for CVEs

---

## Error Handling

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `command not found: larapruner` | Not on PATH | See Pre-flight section above |
| `No composer.json found` | Wrong directory | Run from Laravel project root |
| `Permission denied` | Binary not executable | `chmod +x ~/.codex/tools/larapruner/bin/larapruner` |
| Empty results on large project | Glob timeout | Run on a subdirectory subset first |

If `--json` output fails to parse, check for PHP warnings mixed into stdout — redirect stderr: `larapruner . --json 2>/dev/null`.

---

## Interpreting Results & Next Steps

After a scan, help the user triage findings:

1. **Unused classes** — Confirm each with a manual grep before deleting:
   ```bash
   grep -r "LegacyController" . --include="*.php" --include="*.blade.php"
   ```
2. **Unused deps** — Remove with `composer remove <package>`, then run `composer install` and test.
3. **Security issues** — Fix `.env` before deploy; rotate `APP_KEY` if it was blank.
4. **Refactor smells** — Prioritize `long_method` and `duplicate_code`; `comments` are low-priority.

---

## Roadmap (not yet available)

- `phpstan` dead method detection
- Blade orphan template detection
- Route → controller existence validation
- Rector integration for automated refactoring
