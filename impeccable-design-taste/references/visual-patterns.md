# Visual Patterns — Design Taste Reference

> Hasil inspeksi visual 7 website real. Dipakai sebagai lookup konkret pas routing design.
> Format: palette → layout → typography → motion → trust cues → product demo.

## High-End Visual / Premium SaaS

### Linear (dark premium benchmark)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Black → dark blue gradient (#0D0D0D → #1A1F36). Aksen: biru-cyan (#5E6AD2). Monochrome-controlled. |
| **Layout** | Section header generous spacing, konten tight. Navigation compact (5 items). Asymmetric hero: text left, screenshot right. |
| **Typography** | System font (Inter/SF). Letter-spacing wide untuk heading. Weight contrast: ExtraBold heading → Regular body. |
| **Motion** | Loading spinner halus. Hover state subtle (underline, opacity). Gaada parallax atau animasi gimmick. |
| **Product Demo** | Screenshot asli IDE/project board di hero. Product-led storytelling — bukan mockup/illustration. |
| **Trust Cue** | "Work faster" metrics, developer testimonials. |

### Stripe (enterprise-trust benchmark)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Purple-blue gradient dominan. Putih sebagai background utama. Dark footer. |
| **Layout** | Horizontal scroll section untuk solutions. Card grid untuk product features. Massive footer (8 columns). |
| **Typography** | Custom serif untuk body (beda dari rata-rata SaaS sans-serif). Sans-serif untuk heading. Capitalized nav labels. |
| **Motion** | Live counter animasi: "$1.9T volume", "135+ currencies". Animated diagrams (payment flow). |
| **Product Demo** | Widget interaktif: Payment terminal, Checkout form, Dashboard preview. Real UI component, not screenshot. |
| **Trust Cue** | Customer logos (Amazon, Lyft, etc). Metrics besar: "99.999% uptime", "200M+ subscriptions". Compliance badges. |

---

## Minimalist / Editorial / Calm

### Anthropic (research-authority benchmark)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Cream/putih dominan (#FCFCF5-like). Aksen ungu (#6B5BFF). Sangat restrained — gaada warna teriak. |
| **Layout** | Card grid 2 kolom untuk news/articles. Navigation research-heavy (Research, Policy, Commitments). Footer massive. |
| **Typography** | Serif untuk heading (classic authority). Sans-serif untuk body. Line-height generous. |
| **Motion** | Minimal. Gaada animated hero. Hover state subtle di card. |
| **Product Demo** | None — mission-first, product-second. "Claude" sebagai produk di bawah payung perusahaan. |
| **Trust Cue** | Research publications, safety commitments, "Public Benefit Corporation" footer. Authority through content, bukan metrics. |

---

## Industrial Brutalism / Devtools

### PostHog (playful-confidence benchmark)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Orange aksen (#F54E00) — berani, high contrast. Putih + dark background sections. |
| **Layout** | Full-width sections. Product card grid dense. File-tree sidebar navigation (home.mdx, docs/, pricing). |
| **Typography** | Statement-led typography besar. Playful tone dalam copy: "Shameless CTA", "Not endorsed by Kim K". |
| **Motion** | Minimal. Dashboard UI preview statis. |
| **Product Demo** | UI screenshot asli di landing (dashboard, events, charts). "Ask PostHog anything" chat-like UI. |
| **Trust Cue** | Customer logos (Y Combinator, Lovable, Supabase, ElevenLabs). Transparent pricing. Open company handbook. |

---

## AI Anti-Slop (Counter-Example)

### Perplexity (AI without cliché)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Clean white #FFFFFF + dark mode toggle. Aksen minimal (hanya di links/buttons). |
| **Layout** | Search-box-centric: "Ask anything..." sebagai hero. Sidebar kompak flat (New, Computer, Spaces, Artifacts). |
| **Typography** | System font. Regular weight. No decorative type. |
| **Motion** | Minimal. Loading states untuk search results. |
| **Product Demo** | AI search result langsung — product is the demo. Incognito mode icon mask/kacamata. |
| **Trust Cue** | "Computer" — new feature badge. Answer sources visible. No "AI magic" language. |

### Cursor (developer-first AI)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | Dark IDE background. Warna aksen dari syntax highlighting. Terminal green accents. |
| **Layout** | Split layout: left deskripsi, right IDE/terminal preview. Product UI sebagai visual utama. |
| **Typography** | Sans-serif bold, letter-spacing rapat. Monospace untuk code preview. |
| **Motion** | Live IDE preview — mengetik animation, agent workflow visual. |
| **Product Demo** | Full IDE preview di hero (bukan screenshot statis workflow). "Composer 2.5" agent panel. Terminal interaktif. |
| **Trust Cue** | Download count, "vibe coding" cultural relevance. No corporate boilerplate. |

---

## Dashboard / Admin

### Retool (enterprise dashboard benchmark)
| Dimensi | Observasi |
|---------|-----------|
| **Palette** | White background dominan. Aksen biru untuk interactive elements. Clean, utilitarian. |
| **Layout** | Horizontal scrolling carousel untuk template dashboards. Grid card untuk use cases. |
| **Typography** | System font. Functional readability priority. |
| **Motion** | Dynamic prompt box di hero — "Secure your vibe-coded apps" with typing effect. |
| **Product Demo** | Template carousel interaktif: MetricsDash, Sales CRM, Support Console. Real dashboard previews. |
| **Trust Cue** | Logo grid (Amazon, Adobe, Lyft). "Start for free" + "Book a demo" dual CTA. |

---

## Summary Matrix

| Site | Kategori | Palette Signature | Layout Style | Product Demo | Trust Cue |
|------|----------|----------|--------------|--------------|-----------|
| Linear | Premium SaaS | Dark + cyan | Asymmetric hero | Screenshot real | Metrics |
| Stripe | Premium SaaS | Purple + white | Horizontal scroll | Widget interaktif | Logo grid + metrics |
| Anthropic | Editorial/Minimal | Cream + ungu | Card grid 2-col | — | Research content |
| PostHog | Brutalism/Devtools | Orange + white | Full-width dense | Screenshot real | Open company |
| Perplexity | AI Anti-Slop | White + minimal | Search-centric | Live search result | Source visibility |
| Cursor | Developer-first | Dark IDE | Split layout | Live IDE preview | Download count |
| Retool | Dashboard | White + biru | Carousel template | Template preview | Logo grid |

---

## Usage

Pas routing design dari skill `impeccable-design-taste`:

1. Pilih **primary style direction** dari 6 kategori di `examples.md`
2. Select **1-2 anchor sites** sebagai reference benchmark
3. Cek palette, layout, typography, motion dari tabel di atas
4. Pastikan output **BUKAN** generic AI template:
   - Palette bukan purple-pink gradient generik
   - Hero ada concrete product/proof, bukan vague blob illustration
   - Typography ada point of view (serif? system? monospace?)
   - Layout ada intentional composition (asymmetric, split, carousel)
   - Trust/demo cue cocok dengan produk (metrics, research, source, logo)
