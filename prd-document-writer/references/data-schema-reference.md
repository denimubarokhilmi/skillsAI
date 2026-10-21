# PRD Data Schema Reference

Referensi lengkap field yang wajib ada di `prd-data.js` untuk tiap section. Nama key harus persis sama (case-sensitive) — `generate-prd.js` dan `validate-prd-data.js` membaca field ini langsung tanpa fallback.

## `meta` (object, wajib)
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `title` | string | ya | Judul dokumen di cover |
| `subtitle` | string | ya | Biasanya "Product Requirements Document" |
| `organization` | string | ya | |
| `project` | string | ya | Nama + versi project |
| `version` | string | ya | Harus match entry terakhir di `revisions[]` (warning kalau tidak) |
| `date` | string | ya | |
| `preparedBy` | string | ya | |
| `reviewedBy` | string | tidak | |
| `confidential` | boolean | tidak | |
| `filename` | string | ya | Tanpa ekstensi; jadi nama file output `.docx`. Hindari karakter selain huruf/angka/`_`/`-`/`.` |

## `revisions` (array, wajib, non-empty)
Tiap item: `version`, `date`, `author`, `description` (semua string, wajib).

## `executiveSummary` (array of string, wajib, non-empty)
Paragraf-paragraf ringkasan eksekutif.

## `overview` (object, wajib)
`background` (string), `objectives` (array string, non-empty), `scope` (string), `outOfScope` (array string, non-empty), `stakeholders` (array string, non-empty).

## `assumptions` (array, wajib)
Tiap item: `id`, `assumption`, `impact` — semua string wajib.

## `dependencies` (array, wajib)
Tiap item: `id`, `dependency`, `owner`, `deadline` — semua string wajib.

## `risks` (array, wajib)
Tiap item: `id`, `risk`, `probability`, `impact`, `level`, `mitigation`, `contingency` — semua string wajib. `probability` dan `level` idealnya salah satu dari `Low`/`Medium`/`High` (kalau tidak, hanya warning).

## `businessRequirements` (array, wajib)
Tiap item: `id` (unik), `name`, `description`, `stakeholder`, `priority` (`Low`/`Medium`/`High`).

## `userFlows` (array, wajib)
Tiap item: `name`, `description`, `diagram` (string multi-line, ASCII/Unicode box-drawing diagram bebas format).

## `successMetrics` (array, wajib)
Tiap item: `metric`, `target`, `tool`, `cadence`.

## `functional` (array, wajib) — Functional Requirements
Tiap item:
- `id` (unik, biasa format `FR-01`)
- `name`, `description`, `actor` (string)
- `priority` (`Low`/`Medium`/`High`)
- `acceptance` (array string, non-empty — acceptance criteria)

## `nonFunctional` (array, wajib) — Non-Functional Requirements
Tiap item: `id` (unik, format `NFR-01`), `name`, `description`, `metric`, `category`.

## `techStack` (object, wajib)
Lima key wajib, masing-masing array of string non-empty: `backend`, `frontend`, `database`, `devops`, `thirdParty`.

## `architectureDiagram` (string, wajib)
Diagram arsitektur multi-line (box-drawing characters bebas format), ditampilkan apa adanya dalam satu tabel sel.

## `databaseEntities` (array, wajib)
Tiap item:
- `table` (string, nama tabel)
- `columns` (array, non-empty), tiap kolom: `name`, `type`, `constraints` (string wajib), `notes` (string, boleh kosong tapi harus ada key-nya)
- `indexes` (array string, opsional)
- Minimal satu kolom harus punya `PK` di `constraints` (kalau tidak, warning).

## `apiEndpoints` (array, wajib)
Tiap item: `method` (harus salah satu dari `GET`/`POST`/`PUT`/`PATCH`/`DELETE`), `endpoint` (string, idealnya diawali `/`), `auth`, `description`, `request`, `response`.

## `securityConsiderations` (array, wajib)
Tiap item: `area`, `approach`, `implementation`.

## `errorHandling` (array, wajib)
Tiap item: `layer`, `strategy`, `userBehavior`.

## `testScope` (string, opsional)
Deskripsi ruang lingkup pengujian di section 11.1. Kalau kosong, builder pakai kalimat default generic.

## `testCases` (array, wajib)
Tiap item: `tcId` (unik, format `TC-001`), `requirement` (idealnya match ID di `functional[]` atau `nonFunctional[]` — kalau tidak match, warning), `testCase`, `steps`, `expected`, `priority` (`Low`/`Medium`/`High`).

Validator juga memberi warning kalau ada `functional[]` yang tidak punya test case terkait sama sekali — sinyal coverage yang belum lengkap.

## `appendices` (object, wajib)
`glossary` (array, non-empty), tiap item: `term`, `def`. Warning kalau ada `term` duplikat.

---

## `designSystem` (object, wajib)
| Field | Tipe | Wajib |
|---|---|---|
| `styleDirection` | string | ya |
| `typography` | array, tiap item: `name`, `fontFamily`, `size`, `weight`, `usage` | ya, non-empty |
| `colorPalette` | array, tiap item: `name`, `hex`, `usage` | ya, non-empty (warning kalau `hex` bukan format `#RGB`/`#RRGGBB`) |
| `cssTokens` | array, tiap item: `token`, `value`, `usage` | ya, non-empty |

## `frontendConstraints` (object, wajib)
| Field | Tipe | Wajib |
|---|---|---|
| `stylingApproach` | string | ya |
| `noInlineStyling` | boolean | ya — **error** kalau bukan boolean; **warning** kalau `false` (menandakan project ini sengaja tidak melarang inline/class-heavy styling) |
| `prohibitions` | array of string | ya, non-empty — larangan eksplisit (mis. "dilarang style di attribute `style=""`") |
| `tokenRules` | array of string | ya, non-empty — aturan pemakaian token/CSS/module |

## `featureSpecs` (array, wajib) — Detail per Fitur
Tiap item wajib punya `id` yang **sama persis** dengan salah satu `functional[].id` — validator akan **error** kalau ada FR tanpa featureSpecs terkait.

| Field | Tipe | Catatan |
|---|---|---|
| `id`, `name` | string | `id` harus match FR |
| `dataFlow` | object: `actor`, `trigger`, `input`, `process`, `output`, `stateChange` (semua string wajib) | |
| `dataStore` | array, tiap item: `model` (wajib match `databaseEntities[].table`, **error** kalau tidak), `operations` (array non-empty, idealnya subset `create`/`read`/`update`/`delete`) | |
| `logicRules` | array (boleh kosong), tiap item: `field`, `rule` (idealnya salah satu `regex`/`min`/`max`/`enum`/`unique`/`required`/`default`/`limit`), `value` | key `logicRules` sendiri wajib ada (array, tidak boleh undefined) |
| `businessRules` | array (boleh kosong), tiap item: `type` (idealnya `quota`/`role_restriction`/`status_transition`/`approval`), `description` | key `businessRules` sendiri wajib ada |
| `uiStates` | object: `loading`, `empty`, `error`, `disabled`, `success` (semua string wajib) | |

## `modelRelationships` (array, wajib)
Tiap item: `model` (idealnya match `databaseEntities[].table`, warning kalau tidak), `relation`, `cardinality` (idealnya salah satu `one-to-one`/`one-to-many`/`many-to-one`/`many-to-many`), `fk`, `ownership`.

## `modelFunctionMap` (array, wajib)
Tiap item: `function`, `purpose`, `params`, `paramSource`, `sourceModel` (**wajib** match `databaseEntities[].table` atau `modelRelationships[].model` — error kalau tidak), `return`, `sideEffect`.

## `fileMap` (array, wajib)
Tiap item: `feature` (idealnya match `featureSpecs[].id`, warning kalau tidak), `route`, `controller`, `service`, `model`, `schema`, `component`, `test`. Isi `-` untuk field yang tidak relevan pada suatu fitur, tapi key-nya harus tetap ada.

## `authFlow` (object, wajib)
| Field | Tipe |
|---|---|
| `login` | string |
| `sessionLifecycle` | string |
| `roles` | array of string, non-empty |
| `permissions` | array, tiap item: `role` (idealnya ada di `roles`), `permissions` (array of string, non-empty) |
| `protectedRoutes` | array of string, non-empty |
| `failStates` | array of string, non-empty |

## `riskMap` (array, wajib) — Risiko per Fitur/Area
Tiap item: `area`, `cause`, `impact`, `likelihood` (idealnya `Low`/`Medium`/`High`), `mitigation`, `owner`.

## `changeGuide` (array, wajib)
Tiap item: `title`, `changedFiles` (array of string, non-empty), `migrationImpact`, `configImpact`, `compatibility`, `rollback` (semua string wajib).

---

### `apiEndpoints` — Field Tambahan
Selain `method`/`endpoint`/`auth`/`description`/`request`/`response`, sekarang **wajib** juga:
- `relatedFeature` — idealnya match `featureSpecs[].id` (warning kalau tidak)
- `relatedModel` — idealnya match `databaseEntities[].table` (warning kalau tidak)
- Kalau `auth` bukan `"Public"`, idealnya match salah satu `authFlow.roles` (warning kalau tidak)

---

### Aturan Umum
- Semua field bertipe string dianggap invalid kalau kosong/whitespace saja.
- Array yang ditandai "non-empty" akan jadi **error** (bukan warning) kalau kosong atau bukan array.
- ID unik dicek per kategori (`businessRequirements`, `functional`, `nonFunctional`, `testCases`, `featureSpecs`) — duplikat = error.
- Enum (`priority`, `probability`, `level`, `method`, `rule`, `type` pada businessRules, `cardinality`, `likelihood`) yang di luar daftar valid = **warning**, bukan error, supaya validator tidak terlalu kaku untuk kasus project yang butuh nilai custom.
- Cross-reference yang **wajib** (error kalau gagal): FR → featureSpecs, featureSpecs.dataStore → databaseEntities, modelFunctionMap.sourceModel → databaseEntities/modelRelationships.
- Cross-reference yang **disarankan** (warning kalau gagal): fileMap.feature → featureSpecs, apiEndpoints.relatedFeature/relatedModel → featureSpecs/databaseEntities, apiEndpoints.auth → authFlow.roles, modelRelationships.model → databaseEntities.
- Coverage test case: setiap `functional[]`, `nonFunctional[]`, dan `featureSpecs[]` yang punya `logicRules`/`businessRules` idealnya punya minimal satu `testCases[].requirement` yang match — kalau tidak, muncul warning (bukan error, supaya PRD draft awal tetap bisa di-generate).
