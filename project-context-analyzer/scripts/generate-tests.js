#!/usr/bin/env node
/**
 * generate-tests.js — Hybrid test skeleton generator for Laravel
 *
 * Phase 1: Generate structural test skeletons (CRUD, factory, model relations)
 * Phase 2: (AI-assisted) Add business logic assertions
 *
 * Usage:
 *   node generate-tests.js /path/to/laravel-project [options]
 *
 * Options:
 *   --dry-run     Show what would be generated/skipped without writing any file
 *   --force       Overwrite existing files even if they no longer contain a
 *                 "ponytail: Phase 2" marker (i.e. even if they look hand-edited)
 *   --tests       Accepted for compatibility with the skill's "--tests" naming;
 *                 has no additional effect (this script always does the same scan)
 *   --version     Print version and exit
 *   --help, -h    Print usage and exit
 */

const fs = require('fs');
const path = require('path');

const VERSION = '2.1.0';

// ── CLI help ─────────────────────────────────────────────────────────────────

function showHelp() {
    console.log(`
  generate-tests.js v${VERSION} — Laravel test skeleton generator
  ────────────────────────────────────────────────────────────────

  Usage:
    node generate-tests.js /path/to/laravel-project [options]

  Options:
    --dry-run     Preview what would be generated/skipped, write nothing
    --force       Overwrite files even if they look hand-edited (no Phase 2
                  marker left) — use with caution
    --tests       Accepted for compatibility, no additional effect
    --version     Show version
    --help        Show this help
`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function globRecursive(dir, pattern) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...globRecursive(full, pattern));
        } else if (entry.isFile() && entry.name.endsWith(pattern.replace('*', ''))) {
            results.push(full);
        }
    }
    return results;
}

function readFile(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

const PHASE2_MARKER = 'ponytail: Phase 2';

/**
 * Writes a file, but protects hand-edited output from being clobbered.
 * - If the file doesn't exist yet: always write.
 * - If the file exists AND still contains the Phase 2 marker: it's still
 *   "skeleton-only", safe to regenerate/overwrite.
 * - If the file exists AND no longer contains the marker: assume a human (or
 *   AI Phase 2 pass) has edited it — skip, unless --force is given.
 * Returns a status string: 'created' | 'updated' | 'skipped' | 'dry-run-create' | 'dry-run-update'.
 */
function safeWriteFile(p, content, opts) {
    const dir = path.dirname(p);
    const exists = fs.existsSync(p);

    if (exists) {
        const existing = readFile(p);
        const looksEdited = !existing.includes(PHASE2_MARKER);
        if (looksEdited && !opts.force) {
            return 'skipped';
        }
    }

    if (opts.dryRun) {
        return exists ? 'dry-run-update' : 'dry-run-create';
    }

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, content, 'utf8');
    return exists ? 'updated' : 'created';
}

function toPascal(str) {
    return str.replace(/[-_./]/g, '/').split('/').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function toCamel(str) {
    const pascal = toPascal(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnake(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

// Small irregular-plural exception list on top of the naive y/s rules —
// not exhaustive, but covers the common English words seen in app code.
const IRREGULAR_PLURALS = {
    child: 'children', person: 'people', man: 'men', woman: 'women',
    tooth: 'teeth', foot: 'feet', mouse: 'mice', goose: 'geese',
    datum: 'data', criterion: 'criteria', category: 'categories',
};

function pluralize(str) {
    const lower = str.toLowerCase();
    if (IRREGULAR_PLURALS[lower]) {
        return IRREGULAR_PLURALS[lower];
    }
    if (/[^aeiou]y$/i.test(str)) return str.slice(0, -1) + 'ies';
    if (/(s|x|z|ch|sh)$/i.test(str)) return str + 'es';
    return str + 's';
}

/** Given the index of an opening '{' in `content`, find the index of its
 *  matching closing '}' by depth counting. Returns content.length-1 if
 *  unmatched (malformed input) rather than throwing. */
function findMatchingBrace(content, openBraceIndex) {
    let depth = 1;
    for (let i = openBraceIndex + 1; i < content.length; i++) {
        const ch = content[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return content.length - 1;
}

/** Derives a namespace-aware key for a controller so that controllers with
 *  the same short name in different namespaces (e.g. Cms/AuthController vs
 *  Api/AuthController) don't collide. Strips the common
 *  App\Http\Controllers\ prefix and the trailing "Controller" suffix. */
function controllerKeyFromFqcn(fqcn) {
    let rel = fqcn.replace(/^App\\Http\\Controllers\\/, '');
    rel = rel.replace(/\\/g, '/');
    rel = rel.replace(/Controller$/, '');
    return rel || fqcn;
}

function controllerKeyFromFile(relFile) {
    let rel = relFile.replace(/\\/g, '/').replace(/^app\/Http\/Controllers\//, '');
    rel = rel.replace(/\.php$/, '');
    rel = rel.replace(/Controller$/, '');
    return rel || relFile;
}

/** Strips route parameter segments like /{id} or /{article} from a URI,
 *  leaving the "base" collection path. */
function stripParams(uri) {
    if (!uri) return uri;
    return uri.replace(/\/\{[^}]+\}/g, '').replace(/\/+$/, '') || '/';
}

function joinUri(...parts) {
    const cleaned = parts
        .filter(Boolean)
        .map(p => p.replace(/^\/+|\/+$/g, ''))
        .filter(p => p.length > 0);
    return '/' + cleaned.join('/');
}

// ── Route Parser ─────────────────────────────────────────────────────────────
//
// Handles three things the previous version could not:
//   1. Route::prefix('x')->group(...) and Route::group(['prefix'=>'x'], ...)
//      — nested prefixes are accumulated based on brace-range containment.
//   2. Route::resource() / Route::apiResource() — expanded into the standard
//      7 (or 5) RESTful actions, respecting ->only()/->except() when present.
//   3. Namespace-aware keys so same-named controllers in different folders
//      don't collide.

const RESOURCE_ACTIONS = {
    index:   { method: 'GET',    suffix: '' },
    create:  { method: 'GET',    suffix: '/create' },
    store:   { method: 'POST',   suffix: '' },
    show:    { method: 'GET',    suffix: '/{id}' },
    edit:    { method: 'GET',    suffix: '/{id}/edit' },
    update:  { method: 'PUT',    suffix: '/{id}' },
    destroy: { method: 'DELETE', suffix: '/{id}' },
};
const API_RESOURCE_ACTIONS = ['index', 'store', 'show', 'update', 'destroy'];

function findPrefixGroups(content) {
    const groups = [];

    const re1 = /Route::prefix\(\s*['"]([^'"]*)['"]\s*\)\s*->\s*group\s*\(\s*function[^{]*\{/g;
    let m;
    while ((m = re1.exec(content)) !== null) {
        const openIdx = m.index + m[0].length - 1;
        const closeIdx = findMatchingBrace(content, openIdx);
        groups.push({ prefix: m[1], start: openIdx, end: closeIdx });
    }

    const re2 = /Route::group\(\s*\[([^\]]*)\]\s*,\s*function[^{]*\{/g;
    while ((m = re2.exec(content)) !== null) {
        const arrBody = m[1];
        const pm = arrBody.match(/['"]prefix['"]\s*=>\s*['"]([^'"]*)['"]/);
        const openIdx = m.index + m[0].length - 1;
        const closeIdx = findMatchingBrace(content, openIdx);
        groups.push({ prefix: pm ? pm[1] : '', start: openIdx, end: closeIdx });
    }

    return groups;
}

function prefixForPosition(pos, groups) {
    const enclosing = groups
        .filter(g => g.start < pos && pos < g.end)
        .sort((a, b) => a.start - b.start);
    return enclosing.map(g => g.prefix).filter(Boolean);
}

function findMiddlewareGroups(content) {
    const groups = [];

    // Route::middleware('auth')->group(...)
    // Route::middleware(['auth', 'something'])->group(...)
    const re1 = /Route::middleware\(\s*\[?([^\]]*?)\]?\s*\)\s*->\s*group\s*\(\s*function[^{]*\{/g;
    let m;
    while ((m = re1.exec(content)) !== null) {
        const openIdx = m.index + m[0].length - 1;
        const closeIdx = findMatchingBrace(content, openIdx);
        const mws = m[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
        groups.push({ middleware: mws, start: openIdx, end: closeIdx });
    }

    // Route::group(['middleware' => 'auth'], ...)
    // Route::group(['middleware' => ['auth', 'something']], ...)
    const re2 = /Route::group\(\s*\[([^\]]*)\]\s*,\s*function[^{]*\{/g;
    while ((m = re2.exec(content)) !== null) {
        const arrBody = m[1];
        const pm = arrBody.match(/['"]middleware['"]\s*=>\s*\[?([^\]]*?)\]?/);
        if (pm) {
            const mws = pm[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
            const openIdx = m.index + m[0].length - 1;
            const closeIdx = findMatchingBrace(content, openIdx);
            groups.push({ middleware: mws, start: openIdx, end: closeIdx });
        }
    }

    return groups;
}

function middlewareForPosition(pos, groups) {
    const enclosing = groups
        .filter(g => g.start < pos && pos < g.end)
        .sort((a, b) => a.start - b.start);
    return enclosing.flatMap(g => g.middleware);
}

function parseExplicitRoutes(content, groups, mwGroups, endpoints) {
    const routeRegex = /Route::(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]\s*,\s*(?:\[\s*(?:([\w\\]+)::class|['"]([\w\\]+)['"])\s*,\s*['"]([^'"]+)['"]\s*\]|['"]([\w\\]+)@(\w+)['"])\s*\)(?:\s*->\s*name\s*\(\s*['"]([^'"]+)['"]\s*\))?((?:\s*->\s*\w+\s*\([^)]*\))*)/g;

    let match;
    while ((match = routeRegex.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const rawUri = match[2];
        const controllerRaw = (match[3] || match[4] || match[6]).replace('::class', '');
        const action = match[5] || match[7];
        const routeName = match[8] || '';
        const chain = match[9] || '';

        const prefixes = prefixForPosition(match.index, groups);
        const fullUri = joinUri(...prefixes, rawUri);

        const activeMws = middlewareForPosition(match.index, mwGroups);
        const chainMwMatch = chain.match(/->\s*middleware\s*\(\s*\[?([^\])]*)\]?\s*\)/);
        if (chainMwMatch) {
            const mws = chainMwMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
            activeMws.push(...mws);
        }
        const hasAuth = activeMws.some(mw => mw.includes('auth'));

        const key = controllerKeyFromFqcn(controllerRaw);
        if (!endpoints[key]) {
            endpoints[key] = { fqcn: controllerRaw, actionUris: {}, routeGroup: '', needsAuth: false };
        }
        endpoints[key].actionUris[action] = { method, uri: fullUri };
        if (hasAuth) {
            endpoints[key].needsAuth = true;
        }
        if (routeName) {
            const prefix = routeName.split('.')[0];
            if (!endpoints[key].routeGroup) endpoints[key].routeGroup = prefix;
        }
    }
}

function parseResourceRoutes(content, groups, mwGroups, endpoints) {
    const re = /Route::(resource|apiResource)\(\s*['"]([^'"]+)['"]\s*,\s*(?:([\w\\]+)::class|['"]([\w\\]+)['"])\s*\)((?:\s*->\s*\w+\s*\([^)]*\))*)/g;
    let match;
    while ((match = re.exec(content)) !== null) {
        const kind = match[1];
        const resourceName = match[2];
        const controllerRaw = match[3] || match[4];
        const chain = match[5] || '';

        let actions = kind === 'apiResource' ? [...API_RESOURCE_ACTIONS] : Object.keys(RESOURCE_ACTIONS);

        const onlyMatch = chain.match(/->\s*only\s*\(\s*\[([^\]]*)\]/);
        const exceptMatch = chain.match(/->\s*except\s*\(\s*\[([^\]]*)\]/);
        if (onlyMatch) {
            const wanted = onlyMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
            actions = actions.filter(a => wanted.includes(a));
        } else if (exceptMatch) {
            const excluded = exceptMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
            actions = actions.filter(a => !excluded.includes(a));
        }

        const prefixes = prefixForPosition(match.index, groups);
        const basePath = resourceName.replace(/^\/+|\/+$/g, '');

        const activeMws = middlewareForPosition(match.index, mwGroups);
        const chainMwMatch = chain.match(/->\s*middleware\s*\(\s*\[?([^\])]*)\]?\s*\)/);
        if (chainMwMatch) {
            const mws = chainMwMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
            activeMws.push(...mws);
        }
        const hasAuth = activeMws.some(mw => mw.includes('auth'));

        const key = controllerKeyFromFqcn(controllerRaw);
        if (!endpoints[key]) {
            endpoints[key] = { fqcn: controllerRaw, actionUris: {}, routeGroup: '', needsAuth: false };
        }
        if (hasAuth) {
            endpoints[key].needsAuth = true;
        }

        for (const action of actions) {
            const def = RESOURCE_ACTIONS[action];
            const uri = joinUri(...prefixes, basePath) + def.suffix;
            endpoints[key].actionUris[action] = { method: def.method, uri };
        }

        const namesMatch = chain.match(/->\s*names\s*\(\s*\[([^\]]*)\]/);
        if (namesMatch) {
            const firstName = namesMatch[1].match(/['"]([^'"]+)['"]/);
            if (firstName) {
                const grp = firstName[1].split('.')[0];
                if (!endpoints[key].routeGroup) endpoints[key].routeGroup = grp;
            }
        } else if (!endpoints[key].routeGroup) {
            endpoints[key].routeGroup = basePath.split('/').pop();
        }
    }
}

function parseRoutes(projectPath) {
    const routesDir = path.join(projectPath, 'routes');
    if (!fs.existsSync(routesDir)) return {};

    const endpoints = {};
    const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.php'));

    for (const file of files) {
        const content = readFile(path.join(routesDir, file));
        if (!content) continue;

        const groups = findPrefixGroups(content);
        const mwGroups = findMiddlewareGroups(content);
        parseExplicitRoutes(content, groups, mwGroups, endpoints);
        parseResourceRoutes(content, groups, mwGroups, endpoints);
    }
    return endpoints;
}

// ── Controller Parser ─────────────────────────────────────────────────────────

function parseControllers(projectPath) {
    const ctrlDir = path.join(projectPath, 'app', 'Http', 'Controllers');
    if (!fs.existsSync(ctrlDir)) return {};

    const controllers = {};
    const files = globRecursive(ctrlDir, '.php');

    for (const file of files) {
        const content = readFile(file);
        if (!content) continue;

        const ns = content.match(/^[ \t]*namespace\s+([^;\s]+)/m);
        const cls = content.match(/^[ \t]*(?:abstract\s+|final\s+|readonly\s+)*class\s+(\w+)/m);
        if (!cls) continue;

        const fqcn = ns ? ns[1] + '\\' + cls[1] : cls[1];
        const relFile = file.replace(/\\/g, '/').replace(projectPath.replace(/\\/g, '/').replace(/\/+$/, '') + '/', '');
        const key = controllerKeyFromFile(relFile);

        const methods = [];
        const methodRegex = /(?:public\s+)?function\s+(\w+)\s*\(/g;
        let m;
        while ((m = methodRegex.exec(content)) !== null) {
            if (!['__construct', '__invoke'].includes(m[1])) {
                methods.push(m[1]);
            }
        }

        const hasFormRequest = content.includes('extends FormRequest') || content.includes('Request $request');
        const returnsJson = content.includes('response()->json(') || content.includes('return new ') || content.includes('::collection(');
        const returnsView = content.includes("view('") || content.includes('return view(');

        controllers[key] = {
            fqcn,
            file: relFile,
            methods,
            hasFormRequest,
            returnsJson,
            returnsView,
        };
    }
    return controllers;
}

// ── Migration column fallback (for $guarded models with no usable $fillable) ──

function findMigrationColumns(projectPath, table) {
    const migDir = path.join(projectPath, 'database', 'migrations');
    if (!fs.existsSync(migDir)) return null;
    const files = fs.readdirSync(migDir).filter(f => f.endsWith('.php'));

    for (const f of files) {
        const content = readFile(path.join(migDir, f));
        if (!content.includes(`'${table}'`) && !content.includes(`"${table}"`)) continue;

        const createRe = new RegExp(`Schema::create\\(\\s*['"]${table}['"]\\s*,\\s*function[^{]*\\{`);
        const m = createRe.exec(content);
        if (!m) continue;

        const openIdx = m.index + m[0].length - 1;
        const closeIdx = findMatchingBrace(content, openIdx);
        const body = content.slice(openIdx + 1, closeIdx);

        const columns = [];
        const colRegex = /\$table->(\w+)\(\s*['"]([\w]+)['"]/g;
        let cm;
        const skipTypes = ['id', 'timestamps', 'softDeletes', 'rememberToken', 'timestamp'];
        while ((cm = colRegex.exec(body)) !== null) {
            const type = cm[1];
            const name = cm[2];
            if (skipTypes.includes(type)) continue;
            if (name === 'id') continue;
            columns.push({ name, type });
        }
        return columns;
    }
    return null;
}

// ── Model Parser ──────────────────────────────────────────────────────────────

function parseCastsBlock(raw) {
    const casts = {};
    const re = /['"](\w+)['"]\s*=>\s*['"]?([\w:]+)['"]?/g;
    let m;
    while ((m = re.exec(raw)) !== null) {
        casts[m[1]] = m[2];
    }
    return casts;
}

// ── HasFactory auto-fix ──────────────────────────────────────────────────────
//
// This script writes tests/factories that call Model::factory(), which requires
// the model to `use HasFactory`. Rather than just generating tests that are
// guaranteed to fail on a fresh project, Phase 1 also makes sure the trait is
// present — this is a purely additive, idempotent change (two inserted lines,
// nothing removed or rewritten), so it's safe even on hand-edited models.
//
// Returns the patched file content, or null if no change was needed/possible.
function addHasFactoryTrait(content) {
    if (/\bHasFactory\b/.test(content)) return null; // already present in some form

    const classDeclMatch = content.match(/^(?:abstract\s+|final\s+)?class\s+\w+\s+extends\s+(?:Model|Authenticatable|Pivot|Authenticatable\\?)\b/m);
    if (!classDeclMatch) return null; // not an Eloquent model we recognize

    const classDeclIndex = content.indexOf(classDeclMatch[0]);
    const header = content.slice(0, classDeclIndex);
    const rest = content.slice(classDeclIndex);

    // Insert the `use` import after the last existing top-of-file import, or
    // right after `namespace ...;` if there are no imports yet.
    let newHeader;
    const importLines = [...header.matchAll(/^use\s+[^;]+;/gm)];
    if (importLines.length > 0) {
        const last = importLines[importLines.length - 1];
        const insertPos = last.index + last[0].length;
        newHeader = header.slice(0, insertPos) + '\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;' + header.slice(insertPos);
    } else {
        const nsMatch = header.match(/^namespace\s+[^;]+;/m);
        if (!nsMatch) return null;
        const insertPos = header.indexOf(nsMatch[0]) + nsMatch[0].length;
        newHeader = header.slice(0, insertPos) + '\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;' + header.slice(insertPos);
    }

    // Insert `use HasFactory;` as the first statement in the class body.
    const bodyOpenMatch = rest.match(/\{\s*\n/);
    if (!bodyOpenMatch) return null;
    const insertPos = bodyOpenMatch.index + bodyOpenMatch[0].length;
    const newRest = rest.slice(0, insertPos) + '    use HasFactory;\n\n' + rest.slice(insertPos);

    return newHeader + newRest;
}

/** Scans app/Models for Eloquent models missing HasFactory and patches them
 *  in place (unless dryRun). Returns { patched: string[], alreadyOk: number }. */
function fixMissingHasFactory(projectPath, dryRun) {
    const modelDir = path.join(projectPath, 'app', 'Models');
    if (!fs.existsSync(modelDir)) return { patched: [], alreadyOk: 0 };

    const files = globRecursive(modelDir, '.php');
    const patched = [];
    let alreadyOk = 0;

    for (const file of files) {
        const content = readFile(file);
        if (!content) continue;

        const updated = addHasFactoryTrait(content);
        if (updated === null) {
            alreadyOk++;
            continue;
        }

        if (!dryRun) {
            fs.writeFileSync(file, updated, 'utf8');
        }
        patched.push(path.basename(file));
    }

    return { patched, alreadyOk };
}

function parseModels(projectPath) {
    const modelDir = path.join(projectPath, 'app', 'Models');
    if (!fs.existsSync(modelDir)) return {};

    const models = {};
    const files = globRecursive(modelDir, '.php');

    for (const file of files) {
        const content = readFile(file);
        if (!content) continue;

        const ns = content.match(/^[ \t]*namespace\s+([^;\s]+)/m);
        const cls = content.match(/^[ \t]*(?:abstract\s+|final\s+|readonly\s+)*class\s+(\w+)/m);
        if (!cls) continue;

        const fqcn = ns ? ns[1] + '\\' + cls[1] : cls[1];
        const name = cls[1];

        let fillable = [];
        const fillableMatch = content.match(/\$fillable\s*=\s*\[([^\]]*)\]/);
        if (fillableMatch) {
            fillableMatch[1].split(',').forEach(f => {
                const clean = f.trim().replace(/['"]/g, '');
                if (clean) fillable.push(clean);
            });
        }

        let guarded = null;
        const guardedMatch = content.match(/\$guarded\s*=\s*\[([^\]]*)\]/);
        if (guardedMatch) {
            guarded = guardedMatch[1].split(',').map(f => f.trim().replace(/['"]/g, '')).filter(Boolean);
        }

        // Casts — supports both the classic property and the Laravel 11+
        // `protected function casts(): array { return [...]; }` style.
        let casts = {};
        const castsPropMatch = content.match(/\$casts\s*=\s*\[([^\]]*)\]/);
        if (castsPropMatch) {
            casts = parseCastsBlock(castsPropMatch[1]);
        } else {
            const castsFnMatch = content.match(/function\s+casts\s*\(\s*\)\s*:\s*array\s*\{[\s\S]*?return\s*\[([\s\S]*?)\]\s*;/);
            if (castsFnMatch) {
                casts = parseCastsBlock(castsFnMatch[1]);
            }
        }

        const tableMatch = content.match(/\$table\s*=\s*['"]([^'"]+)['"]/);
        const table = tableMatch ? tableMatch[1] : toSnake(pluralize(name));

        if (fillable.length === 0 && guarded !== null) {
            const migCols = findMigrationColumns(projectPath, table);
            if (migCols) {
                fillable = migCols
                    .filter(c => !guarded.includes(c.name))
                    .map(c => c.name);
                for (const c of migCols) {
                    if (!(c.name in casts)) casts[c.name] = c.type;
                }
            }
        }

        // Relations — parsed from the *actual method body* (brace-matched, so
        // nested braces inside the method don't break detection) and the
        // *actual target class* passed to belongsTo()/hasMany()/etc, not
        // guessed from the relation method's name.
        const relations = [];
        const methodSigRe = /(?:public|protected|private|static|\s)+function\s+(\w+)\s*\(\s*\)\s*(?::\s*[\w\\|?]+\s*)?\{/g;
        let sm;
        while ((sm = methodSigRe.exec(content)) !== null) {
            const methodName = sm[1];
            const openIdx = sm.index + sm[0].length - 1;
            const closeIdx = findMatchingBrace(content, openIdx);
            const body = content.slice(openIdx + 1, closeIdx);

            const relMatch = body.match(/\b(belongsTo|hasMany|hasOne|belongsToMany|morphMany|morphToMany|morphOne|morphTo)\s*\(\s*([\w\\]+)?(?:::class)?(?:\s*,\s*['"]([^'"]+)['"])?/);
            if (relMatch) {
                const type = relMatch[1];
                const target = relMatch[2] && relMatch[2] !== '' ? relMatch[2].split('\\').pop() : null;
                const foreignKey = relMatch[3] || (type === 'belongsTo' ? toSnake(methodName) + '_id' : null);
                relations.push({ name: methodName, type, target, foreignKey });
            }
        }

        models[name] = { fqcn, table, fillable, casts, relations };
    }
    return models;
}

// ── Faker mapping (shared by fillable-based and migration-fallback fields) ───

function fakerForField(field, castType) {
    const type = (castType || '').toLowerCase();
    if (type.includes('bool')) return 'fake()->boolean()';
    if (type.includes('datetime') || type === 'date') return 'fake()->dateTime()';
    if (type.includes('decimal') || type.includes('float') || type.includes('double')) return 'fake()->randomFloat(2, 1, 1000)';
    if (type.includes('int')) return 'fake()->numberBetween(1, 1000)';
    if (type === 'array' || type === 'json' || type === 'collection') return '[]';

    if (field.includes('email')) return 'fake()->email()';
    if (field.includes('phone') || field.includes('telp')) return 'fake()->phoneNumber()';
    if (field.includes('desc') || field.includes('body') || field.includes('content')) return 'fake()->paragraph()';
    if (field.includes('name') || field.includes('title') || field.includes('judul')) return 'fake()->sentence(3)';
    if (field.includes('price') || field.includes('harga')) return 'fake()->numberBetween(1000, 100000)';
    if (field.includes('year') || field.includes('tahun')) return 'fake()->year()';
    if (field.includes('youtube') && (field.includes('url') || field.includes('link'))) return "'https://www.youtube.com/watch?v=dQw4w9WgXcQ'";
    if (field.includes('url') || field.includes('link')) return 'fake()->url()';
    if (field === 'status') return "'published'";
    if (field.includes('status') || field.startsWith('is_') || field.endsWith('_featured')) return 'fake()->boolean()';
    if (field.includes('order') || field.includes('sort')) return 'fake()->numberBetween(0, 100)';
    if (field.includes('photo') || field.includes('image') || field.includes('gambar') || field.includes('thumbnail')) return "'default.jpg'";
    if (field.includes('address') || field.includes('alamat')) return 'fake()->address()';
    if (field.includes('slug')) return 'fake()->slug()';
    return 'fake()->word()';
}

// ── Generators ────────────────────────────────────────────────────────────────

function generateFeatureTest(resourceKey, endpoint, controller) {
    const shortName = resourceKey.split('/').pop();
    const cls = shortName + 'Test';
    const modelName = shortName;
    const varName = toCamel(shortName);

    const uris = endpoint.actionUris;
    const indexBase = uris.index ? stripParams(uris.index.uri) : null;
    const showBase = uris.show ? stripParams(uris.show.uri) : (indexBase || null);
    const storeBase = uris.store ? stripParams(uris.store.uri) : indexBase;

    const hasIndex = 'index' in uris && (!controller || controller.methods.includes('index'));
    const hasShow = 'show' in uris && (!controller || controller.methods.includes('show'));
    const hasStore = 'store' in uris && (!controller || controller.methods.includes('store'));
    const hasUpdate = 'update' in uris && (!controller || controller.methods.includes('update'));
    const hasDestroy = 'destroy' in uris && (!controller || controller.methods.includes('destroy'));

    // API vs. web controllers get different success-status assumptions —
    // this is still a best-effort guess (Phase 2 should verify), but at
    // least it's derived from evidence in the controller rather than a
    // hardcoded constant.
    const looksApi = controller && controller.returnsJson && !controller.returnsView;
    const storeStatus = looksApi ? 201 : 302;
    const updateStatus = looksApi ? 200 : 302;
    const destroyStatus = looksApi ? 200 : 302;

    let tests = '';

    if (hasIndex && indexBase) {
        tests += `
    public function test_index_returns_success()
    {
        \$response = \$this->get('${indexBase}');
        \$response->assertStatus(200);
    }
`;
    }

    if (hasStore && storeBase) {
        tests += `
    public function test_store_creates_record()
    {
        // ponytail: Phase 2 — filter payload ke field yang benar-benar valid
        // (hapus id/timestamps, tangani file upload dengan UploadedFile::fake() jika ada)
        \$data = ${modelName}::factory()->make()->toArray();
        \$response = \$this->post('${storeBase}', \$data);
        \$response->assertStatus(${storeStatus});
    }
`;
    }

    if (hasShow && showBase) {
        tests += `
    public function test_show_returns_record()
    {
        \$${varName} = ${modelName}::factory()->create();
        \$response = \$this->get('${showBase}/' . \$${varName}->id);
        \$response->assertStatus(200);
    }
`;
    }

    if (hasUpdate && showBase) {
        tests += `
    public function test_update_modifies_record()
    {
        \$${varName} = ${modelName}::factory()->create();
        // ponytail: Phase 2 — ganti dengan payload minimal yang valid,
        // jangan kirim ->toArray() mentah (berisi id/timestamps yang tidak seharusnya di-submit)
        \$payload = [];
        \$response = \$this->put('${showBase}/' . \$${varName}->id, \$payload);
        \$response->assertStatus(${updateStatus});
    }
`;
    }

    if (hasDestroy && showBase) {
        tests += `
    public function test_destroy_deletes_record()
    {
        \$${varName} = ${modelName}::factory()->create();
        \$response = \$this->delete('${showBase}/' . \$${varName}->id);
        \$response->assertStatus(${destroyStatus});
    }
`;
    }

    const needsAuth = endpoint.needsAuth;
    const setUpBody = needsAuth
        ? `        parent::setUp();
        $user = \\App\\Models\\User::factory()->create();
        $this->actingAs($user);`
        : `        parent::setUp();
        // ponytail: Phase 2 — tambah auth login di sini kalo endpoint butuh auth`;

    const ponytailNote = `
    // ponytail: Phase 2 — tambahin business logic assertion di sini
    // Contoh: test validasi unique, test cascade delete, test authorization
`;

    return `<?php

namespace Tests\\Feature;

use Tests\\TestCase;
use App\\Models\\${modelName};
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

class ${cls} extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
${setUpBody}
    }
${tests}${ponytailNote}
}
`;
}

function generateModelTest(modelName, modelInfo) {
    const cls = modelName + 'Test';

    const imports = new Set();
    for (const rel of modelInfo.relations) {
        if (rel.target && rel.target !== modelName) imports.add(rel.target);
    }

    // Tracks whether any relation test needs Illuminate\Database\Eloquent\Collection —
    // used so we can add a single `use` import instead of an inline FQCN, which
    // (without a leading backslash) resolves incorrectly inside `namespace Tests\Unit`.
    let usesCollection = false;

    let relationTests = '';
    for (const rel of modelInfo.relations) {
        const varName = toCamel(modelName);

        if (rel.type === 'morphTo') {
            relationTests += `
    // ponytail: Phase 2 — ${rel.name}() adalah relasi morphTo, target class
    // tergantung data (\$morphMap) dan tidak bisa ditentukan otomatis di sini.
    // public function test_${toSnake(rel.name)}_relation() { ... }
`;
            continue;
        }

        if (!rel.target) {
            relationTests += `
    // ponytail: Phase 2 — target model untuk relasi ${rel.name}() (${rel.type}) tidak dapat dipastikan dari kode, cek manual
`;
            continue;
        }

        if (rel.type === 'belongsTo' || rel.type === 'hasOne' || rel.type === 'morphOne') {
            relationTests += `
    public function test_${toSnake(rel.name)}_relation()
    {
        \$${varName} = ${modelName}::factory()->create();
        \$this->assertInstanceOf(${rel.target}::class, \$${varName}->${rel.name});
    }
`;
        } else {
            usesCollection = true;
            relationTests += `
    public function test_${toSnake(rel.name)}_relation()
    {
        \$${varName} = ${modelName}::factory()->create();
        \$this->assertInstanceOf(Collection::class, \$${varName}->${rel.name});
    }
`;
        }
    }

    const ponytailNote = `
    // ponytail: Phase 2 — tambahin test scope, accessor, mutator, business logic di sini
`;

    // Built after the loop so it can include Collection only when actually used.
    const importLines = [...imports].map(n => `use App\\Models\\${n};`).join('\n');
    const collectionImportLine = usesCollection ? 'use Illuminate\\Database\\Eloquent\\Collection;\n' : '';

    return `<?php

namespace Tests\\Unit;

use Tests\\TestCase;
use App\\Models\\${modelName};
${importLines}
${collectionImportLine}use Illuminate\\Foundation\\Testing\\RefreshDatabase;

class ${cls} extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_${toSnake(modelName)}()
    {
        \$${toCamel(modelName)} = ${modelName}::factory()->create();
        \$this->assertDatabaseHas('${modelInfo.table}', ['id' => \$${toCamel(modelName)}->id]);
    }
${relationTests}${ponytailNote}
}
`;
}

function generateFactory(modelName, modelInfo) {
    const cls = modelName + 'Factory';

    const imports = new Set();
    const belongsToRelations = modelInfo.relations.filter(r => r.type === 'belongsTo' && r.target);
    for (const rel of belongsToRelations) {
        imports.add(rel.target);
    }
    const importLines = [...imports].map(n => `use App\\Models\\${n};`).join('\n');

    const fkFields = belongsToRelations.map(r => r.foreignKey).filter(Boolean);
    const fakerDefs = modelInfo.fillable
        .filter(f => !fkFields.includes(f))
        .map(f => `            '${f}' => ${fakerForField(f, modelInfo.casts[f])},`)
        .join('\n');

    const foreignKeys = belongsToRelations
        .map(r => {
            const fk = r.foreignKey || (toSnake(r.name) + '_id');
            return `            '${fk}' => ${r.target}::factory(),`;
        }).join('\n');

    const emptyNote = fakerDefs === '' && foreignKeys === ''
        ? `            // ponytail: Phase 2 — tidak ada $fillable/$guarded+migration yang terbaca,\n            // isi field secara manual di sini\n`
        : '';

    return `<?php

namespace Database\\Factories;

use App\\Models\\${modelName};
${importLines}
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class ${cls} extends Factory
{
    protected \$model = ${modelName}::class;

    public function definition(): array
    {
        return [
${emptyNote}${fakerDefs}
${foreignKeys}
        ];
    }
}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
    const args = argv.slice(2);
    const opts = { dryRun: false, force: false, projectPath: null };
    for (const arg of args) {
        if (arg === '--dry-run') { opts.dryRun = true; continue; }
        if (arg === '--force') { opts.force = true; continue; }
        if (arg === '--tests') { continue; }
        if (arg === '--version') { console.log(`generate-tests.js v${VERSION}`); process.exit(0); }
        if (arg === '--help' || arg === '-h') { showHelp(); process.exit(0); }
        if (!arg.startsWith('--')) { opts.projectPath = arg; }
    }
    return opts;
}

function main() {
    const opts = parseArgs(process.argv);

    if (!opts.projectPath) {
        console.error('Usage: node generate-tests.js /path/to/laravel-project [--dry-run] [--force]');
        process.exit(1);
    }

    if (!fs.existsSync(path.join(opts.projectPath, 'artisan'))) {
        console.error('Error: Not a Laravel project (no artisan found)');
        process.exit(1);
    }

    console.log(`\n  Laravel test skeleton generator v${VERSION} — ${opts.projectPath}`);
    if (opts.dryRun) console.log('  (dry-run mode — no files will be written)\n');
    else console.log('');

    const hasFactoryFix = fixMissingHasFactory(opts.projectPath, opts.dryRun);
    if (hasFactoryFix.patched.length > 0) {
        const verb = opts.dryRun ? 'would add' : 'added';
        for (const name of hasFactoryFix.patched) {
            console.log(`  ✓ Model: ${name} — ${verb} 'use HasFactory;' (was missing, would break ::factory())`);
        }
    }

    const endpoints = parseRoutes(opts.projectPath);
    const controllers = parseControllers(opts.projectPath);
    const models = parseModels(opts.projectPath);

    console.log(`  Routes found:      ${Object.keys(endpoints).length} resource groups`);
    console.log(`  Controllers found: ${Object.keys(controllers).length}`);
    console.log(`  Models found:      ${Object.keys(models).length}\n`);

    const counts = { created: 0, updated: 0, skipped: 0, dryRun: 0 };

    function report(kind, label, outPath, status) {
        if (status === 'skipped') {
            counts.skipped++;
            console.log(`  ~ ${kind}: ${label} — SKIPPED (file sudah ada & tampak sudah di-edit manual; pakai --force untuk timpa)`);
        } else if (status.startsWith('dry-run')) {
            counts.dryRun++;
            console.log(`  · ${kind}: ${label} — would ${status === 'dry-run-create' ? 'create' : 'update'} ${outPath}`);
        } else if (status === 'created') {
            counts.created++;
            console.log(`  ✓ ${kind}: ${label} (new)`);
        } else {
            counts.updated++;
            console.log(`  ✓ ${kind}: ${label} (updated)`);
        }
    }

    for (const [resourceKey, endpoint] of Object.entries(endpoints)) {
        const controller = controllers[resourceKey];
        if (!controller) continue;
        const shortName = resourceKey.split('/').pop();
        const content = generateFeatureTest(resourceKey, endpoint, controller);
        const outPath = path.join(opts.projectPath, 'tests', 'Feature', `${toPascal(shortName)}Test.php`);
        const status = safeWriteFile(outPath, content, opts);
        report('Feature', `${toPascal(shortName)}Test.php`, outPath, status);
    }

    for (const [name, info] of Object.entries(models)) {
        const content = generateModelTest(name, info);
        const outPath = path.join(opts.projectPath, 'tests', 'Unit', `${name}Test.php`);
        const status = safeWriteFile(outPath, content, opts);
        report('Unit', `${name}Test.php`, outPath, status);
    }

    for (const [name, info] of Object.entries(models)) {
        const content = generateFactory(name, info);
        const outPath = path.join(opts.projectPath, 'database', 'factories', `${name}Factory.php`);
        const status = safeWriteFile(outPath, content, opts);
        report('Factory', `${name}Factory.php`, outPath, status);
    }

    console.log(`\n  ---`);
    console.log(`  Created: ${counts.created}`);
    console.log(`  Updated: ${counts.updated}`);
    console.log(`  Skipped (hand-edited, protected): ${counts.skipped}`);
    if (opts.dryRun) console.log(`  Would write (dry-run): ${counts.dryRun}`);
    console.log(`\n  ponytail: Review each file for // ponytail: Phase 2 markers`);
    console.log(`  -> Then run: php artisan test\n`);
}

main();
