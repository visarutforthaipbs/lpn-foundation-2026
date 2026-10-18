# HIG Design Audit — LPN Foundation site (2026-10-18)

Scope: 11 routes (`/th` home, blog, post, about, donate, get-help, our-work,
impact, stories, contact, `/en` home) × 390 / 1280 px × light / dark, captured
from the local dev server (`localhost:3000`, branch `main` @ `df08e17`).
Method: `apple-hig-design` skill — `scripts/hig_audit_matrix.py` (measurements)
+ `render_check.py` + vision review of every capture, scored on
`templates/audit-checklist.md`.

**Constraint from the owner:** keep the LPN palette (black / white /
brand-yellow `#ffd43b`). Everything else (type scale, spacing, components,
materials, states, dark mode) may change to follow HIG.

## Measured facts (before)

| Route | width | hit-target fails (<44/<28) | text nodes < 13 px | contrast fails |
|---|---|---|---|---|
| home | 390 | 11 | 51 | 0 |
| home | 1280 | 6 | 53 | 0 |
| blog | 390 | 7 | **150** | 0 |
| blog | 1280 | 6 | **155** | 0 |
| post | 390 | 8 | 29 | 0 |
| post | 1280 | 6 | 34 | 0 |
| about | 390 | 7 | 55 | 0 |
| about | 1280 | 6 | 60 | 0 |
| donate | 390 | 9 | 21 | 0 |
| donate | 1280 | 7 | 26 | 0 |
| get-help | 390 | 7 | 18 | 0 |
| get-help | 1280 | 6 | 23 | 0 |
| our-work | 390 | 10 | 20 | 0 |
| our-work | 1280 | 6 | 25 | 0 |
| impact | 390 | 9 | 19 | 0 |
| impact | 1280 | 6 | 24 | 0 |
| stories | 390 | 7 | 17 | 0 |
| stories | 1280 | 6 | 22 | 0 |
| contact | 390 | 9 | 26 | 0 |
| contact | 1280 | 6 | 31 | 0 |
| home (en) | 390 | 10 | 51 | 0 |
| home (en) | 1280 | 12 | 53 | 0 |
| **TOTAL** | | **167** | **963** | **0** |

Dark-scheme captures are byte-identical to light: the site has **no
`prefers-color-scheme` handling at all**.

Recurring hit-target offenders (every route): hotline link in the utility
strip (174×21), the five desktop nav links (≈50–115 × 27), footer text links
(≈30 px tall), mobile footer links 34–43 px wide.

Contrast — measured pairs (all pass):

| Pair | Ratio |
|---|---|
| black on `#ffd43b` / yellow on black | 14.7:1 |
| white 70 % on black (nav, labels) | 9.9:1 |
| black 70 % on white (card meta) | 8.5:1 |
| ink-soft 72 % on white (prose) | 8.2:1 |
| black 75 % on yellow (CTA body) | 8.5:1 |
| pill border `#767676` on yellow | 3.2:1 (non-text, passes 3:1) |
| **yellow on white** (not used for text — keep it that way) | **1.4:1** |

Type — body 16 px IBM Plex Sans / DB Helvethaica X (TH); H1 70 px home /
52 px blog / 31 px mobile; H2 41.6; H3 23.2. But `.t-label` and `.eyebrow`
are **10 px**, `.t-label-lg` 11 px, nav 11 px, `.glass-tag` 10 px — 100
call-sites. That is what the 963 "small text" nodes are.

## Checklist score

0 = fails · 1 = partial · 2 = meets. Bold rows are release blockers.

### A. Purpose & hierarchy — 4 / 8
| Row | Score | Evidence |
|---|---|---|
| One prominent action per screen | **0** | Home above-the-fold has **3 filled-yellow actions**: header "บริจาค", hero "ขอความช่วยเหลือ", and the whole "เริ่มตรงนี้" yellow band; blog has header Donate + yellow filter bar + yellow CTA band. Yellow is used both as *the* prominent fill and as a *section background*, so prominence is diluted. |
| Ordered by importance / progressive disclosure | 1 | Hero → help → work is right. Blog index dumps **all 64 posts** in one grid (13,600 px desktop / 32,700 px mobile) — no pagination, no "load more". |
| Controls distinct from content | 2 | Buttons are flat, 2 px radius, clearly controls. |
| Fewest-words labels | 1 | Good in TH. "Field dispatches" (EN blog eyebrow) is jargon; "ติดต่อทีมข่าว" on a blog CTA implies a newsroom LPN doesn't have. |

### B. Typography — 5 / 10
| Row | Score | Evidence |
|---|---|---|
| **Body ≥ 16 px; nothing < 11 px** | **1** | Body 16 px ✓. `.t-label`/`.eyebrow`/`glass-tag` = **10 px** (floor is 11), 100 call-sites, 963 measured nodes < 13 px. |
| System text-style scale | 1 | A scale exists (`.t-display`…`.t-label`) but pages still use ad-hoc `text-[10px]`, `text-[11px]`, `text-xs` stacks (4 literal sub-11 px, dozens of `text-xs`). |
| ≤ 2 typefaces, no Light body | 2 | IBM Plex Sans + DB Helvethaica X; weights 400–900. |
| Survives 200 % zoom | 1 | Not measured this pass; 10 px tracking-0.26em uppercase labels will clip Thai tone marks first. |
| Hierarchy by weight+size+color | 1 | Over-relies on **900 weight + 0.2–0.3 em tracking + uppercase** for every secondary label (apple.com idiom is weight 600 + −0.02 em tracking). Tracking on Thai is forced to `normal` by `:lang(th)`, so TH labels lose even that cue. |

### C. Color & appearance — 6 / 12
| Row | Score | Evidence |
|---|---|---|
| **Text contrast** | **2** | 0 failures measured on 44 captures. |
| Semantic colors, not per-element hex | 1 | `@theme` defines roles, but `styles.css` carries 40+ literal rgba/hex (`#f2c62f`, `#292929`, `#f1f2f5`, `rgba(28,28,33,.88)` …) and components use `text-black/70`, `text-white/85`, `border-white/10` literals everywhere. |
| Light + Dark verified; no in-app toggle | **0** | No dark mode. Light-only `bg-white`, `text-black` throughout. |
| Color never sole carrier of meaning | 2 | Active filter = black fill + white text (shape change); links underlined. |
| One accent, never two meanings | 1 | Yellow = primary action, AND section background, AND eyebrow rule, AND stat rail, AND card-marked rail, AND focus ring, AND hotline icon. "Same color ≠ two meanings" — yellow currently means *six* things. |
| Translucency only in functional layer | **0** | `.glass-dark`, `.glass-light`, `.glass-tag` (6 call-sites) are applied to **content** (featured badge, cards). `.tactile-well`, `.tactile-badge`, `.tactile-bracket` add neumorphic inset shadows and 3-stop gradients — HIG materials say content layer is solid; glass is for bars/sheets only. |

### D. Layout & targets — 5 / 10
| Row | Score | Evidence |
|---|---|---|
| **Hit targets ≥ 44 / 28** | **1** | 167 fails. Nav links 27 px tall on pointer (<28), hotline strip 21 px, footer links ~30 px on touch (<44). Buttons (48 px) and filter pills (44 px) pass. |
| Safe areas | 1 | Header sticky top ✓; no `env(safe-area-inset-*)` on the mobile sheet / sticky bars. |
| Size classes, tested 320–1440 | 1 | Responsive at 390/1280; 320 not tested; hero `w-[42%]` decorative panel is fixed-ratio. |
| Margins 16/20, measure ≤ 672 px | 1 | 16/24/32 px rhythm ✓. `.container-narrow` is **832 px** (52 rem) — body measure over the ~672 px HIG ceiling; `.prose-lpn` has no `max-width`. |
| Long-text localisation | 1 | Thai headings wrap ✓ (`overflow-wrap`), but 10 px uppercase tracked labels and `line-clamp-3/4` excerpts truncate Thai mid-word. |

### E. Navigation — 6 / 8
| Row | Score | Evidence |
|---|---|---|
| 2–5 top-level, labels visible | 2 | 5 items ✓, labels always visible ✓. |
| Toolbar = actions on this view | 1 | Header mixes nav + a phone icon + Donate; utility strip duplicates the hotline that is also in hero, footer band and footer column (4 copies on home). |
| Back always available, location obvious | 1 | Post has "← กลับไปที่บทความ" ✓ but no current-section indicator in the nav (no active underline state — only hover). |
| Search in primary position | 2 | n/a for the brief; category filter is well placed. |

### F. Feedback, modality, errors — 9 / 14
| Row | Score | Evidence |
|---|---|---|
| Press/hover/focus/disabled on every control | 2 | `.btn` has all four, dual-ring `:focus-visible` is excellent. |
| Alerts | 2 | None. |
| Modals | 2 | Mobile menu: one sheet, obvious ✕, 44 px rows ✓. |
| Loading | 1 | No skeletons; LocaleSwitcher shows "…" only. |
| Empty states | 1 | Blog empty state says what's missing, not what to do next (no "ดูทั้งหมด" link). 13 of 64 post cards render a **grey box** instead of a cover image — graybox is a hard reject for this owner. |
| Error messages | 1 | Donate page carries a yellow "draft — no payment yet" banner (good honesty) but styled like a primary band. |
| Undo vs confirm | n/a | — |

### G. Accessibility — 7 / 10
| Row | Score | Evidence |
|---|---|---|
| **Keyboard reachable, logical order** | **2** | Skip link, focus rings, semantic nav/aside. |
| Alt / labels | 2 | Logo alt, `aria-label` on icon buttons, decorative panels `aria-hidden`. |
| Motion purposeful, reduced-motion honored | 1 | Global `prefers-reduced-motion` block ✓, but 8 `hover:scale-105` / `translateY(-3px)` lifts on cards, images, and the logo — motion on the most frequent interaction. |
| Captions / media | 1 | Not evaluated (no video on audited routes). |
| Forms | 1 | Contact/donate forms not exercised this pass. |

### H. Craft & brand — 3 / 8
| Row | Score | Evidence |
|---|---|---|
| Brand in accent/voice/font, not repeated logos | 1 | Logo in header ✓ + footer (twice: mark + wordmark) + about-page "LPN" coin. Yellow brackets, rails, rules, and coins repeat the brand on every surface. |
| One consistent icon set | 2 | lucide throughout ✓. |
| Transitions preserve context | 1 | `.card:hover` lift + shadow swell + image zoom = three simultaneous effects on a list item. |
| Consistent voice/capitalisation | 0 | Mixed: EN labels are ALL-CAPS tracked (`FIELD DISPATCHES`), TH same label is normal-case; sentence-case buttons but uppercase everything else; "Field dispatches" / "News" / "ข่าวสาร" / "บล็อก & ข่าวสาร" for the same section. |

### Total: 45 / 80 = **56 %** → "revamp" band (< 60 %).

Bold-row blockers: B-body-min (1), C-contrast (2 ✓), D-targets (1), G-keyboard (2 ✓).

## Diagnosis — top 7 fixes, by user impact

1. **Yellow means too many things → one accent role.** *(Simplicity: establish hierarchy; Color: same color ≠ two meanings.)* Keep `#ffd43b` **only** for: the one prominent CTA per view, the active/selected indicator, and the focus ring. Section backgrounds go white/paper/black; eyebrow rules, stat rails, card rails, bracket motifs become ink or `border` tokens. The "เริ่มตรงนี้" band keeps its two large cards but on paper, with ONE yellow button.
2. **10 px labels → 12 px floor, drop the heavy tracking.** *(Typography: nothing below 11 px; Thai tone-mark clipping.)* `.t-label` 12 px / 600 / tracking 0.06em; `.eyebrow` 12 px; `glass-tag` 12 px; nav 13 px / 600. Fixes 963 measured nodes in one token change.
3. **Hit targets.** *(Layout: 44/28 with spacing.)* Nav links `py-2.5` (≥ 32 px pointer height), hotline strip row `min-h-11`, footer links `min-h-11 inline-flex items-center`. Clears all 167 fails from 3 CSS rules.
4. **Strip neumorphism & content-layer glass.** *(Materials: glass only in the functional layer; Craft.)* `.card` → solid surface, 1 px `--border`, 12 px radius, hover = border darkens only (no lift, no image zoom). Delete `.glass-dark/.glass-light/.glass-tag/.tactile-*` gradients and inset shadows; keep `.glass-bar` for the sticky header only.
5. **Dark mode via semantic tokens.** *(Dark Mode: respect system, no toggle.)* Replace `text-black/70` / `bg-white` / `border-white/10` literals with `text-label-secondary` / `bg-surface` / `border-separator` from a `@theme` + `@media (prefers-color-scheme: dark)` block (LPN already *is* black/white, so the dark palette is mostly inverting surfaces; yellow stays the same hex — 14.7:1 on black).
6. **Blog index: paginate + no graybox.** *(Purpose; this owner's graybox rule.)* 12 per page + "โหลดเพิ่ม"; cards without a cover image render a flat brand mark on `--surface-secondary` (not a grey rectangle) or a text-only card variant. 13/64 posts need a cover or the text-only treatment.
7. **Measure & voice.** `.container-narrow` 42 rem (672 px); `.prose-lpn max-width: 42rem`. One capitalisation rule (sentence case everywhere, EN and TH); one name for the news section.

Not changed by this audit (editorial, not structure): copy, images, which posts are featured, the Donate draft banner wording.

## Proposed token system (brand-preserving)

```css
@theme {
  /* LPN palette — unchanged */
  --color-brand: #ffd43b;            /* accent: ONE prominent action, selection, focus */
  --color-brand-ink: #000000;        /* label on brand fill (14.7:1) */

  /* semantic roles — light */
  --color-surface: #ffffff;
  --color-surface-secondary: #f5f5f7;
  --color-surface-inverse: #000000;  /* hero / footer */
  --color-label: #0a0a0a;
  --color-label-secondary: rgba(10,10,10,.72);   /* 8.2:1 */
  --color-label-tertiary: rgba(10,10,10,.5);     /* non-text only */
  --color-separator: rgba(0,0,0,.14);
  --color-on-inverse: #ffffff;
  --color-on-inverse-secondary: rgba(255,255,255,.72);

  /* type scale (HIG web) */
  --text-display: clamp(2.5rem, 1.5rem + 4vw, 4.5rem);  /* 900, -0.022em */
  --text-title-1: clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem); /* 800, -0.015em */
  --text-title-2: 1.375rem;   /* 700 */
  --text-body: 1.0625rem;     /* 17 px, lh 1.6 (TH 1.75) */
  --text-callout: 1rem;
  --text-footnote: 0.8125rem; /* 13 px */
  --text-caption: 0.75rem;    /* 12 px — the floor; replaces every 10/11 px label */
  --radius-card: 12px; --radius-control: 8px;
}
@media (prefers-color-scheme: dark) { :root {
  --color-surface: #000000; --color-surface-secondary: #1c1c1e;
  --color-surface-inverse: #ffffff;
  --color-label: #f5f5f7; --color-label-secondary: rgba(245,245,247,.72);
  --color-separator: rgba(255,255,255,.16);
  --color-on-inverse: #0a0a0a; --color-on-inverse-secondary: rgba(10,10,10,.72);
}}
```

Yellow is untouched in both appearances; every other value is a role.

## Verification plan (after)

Re-run `hig_audit_matrix.py` on the same 11 routes → target every capture
`fails 0, small 0, lowc 0, h1 1`, dark captures *differ* from light, checklist
≥ 85 % with all bold rows = 2. Attach before/after `measure.json` totals.

---

## After (branch `design/hig-revamp`, same 11 routes × 390/1280 × light/dark)

Implemented fixes 1–7. Measured with the identical `hig_audit_matrix.py` run:

| Route | width | hit-target fails | text < 13 px | contrast fails |
|---|---|---|---|---|
| about | 390 | 7 → **0** | 55 → **0** | 0 → **0** |
| about | 1280 | 6 → **0** | 60 → **0** | 0 → **0** |
| blog | 390 | 7 → **0** | 150 → **0** | 0 → **0** |
| blog | 1280 | 6 → **0** | 155 → **0** | 0 → **0** |
| contact | 390 | 9 → **0** | 26 → **0** | 0 → **0** |
| contact | 1280 | 6 → **0** | 31 → **0** | 0 → **0** |
| donate | 390 | 9 → **0** | 21 → **0** | 0 → **0** |
| donate | 1280 | 7 → **0** | 26 → **0** | 0 → **0** |
| gethelp | 390 | 7 → **0** | 18 → **0** | 0 → **0** |
| gethelp | 1280 | 6 → **0** | 23 → **0** | 0 → **0** |
| home | 390 | 11 → **0** | 51 → **0** | 0 → **0** |
| home | 1280 | 6 → **0** | 53 → **0** | 0 → **0** |
| home_en | 390 | 10 → **0** | 51 → **0** | 0 → **0** |
| home_en | 1280 | 12 → **0** | 53 → **0** | 0 → **0** |
| impact | 390 | 9 → **0** | 19 → **0** | 0 → **0** |
| impact | 1280 | 6 → **0** | 24 → **0** | 0 → **0** |
| ourwork | 390 | 10 → **0** | 20 → **0** | 0 → **0** |
| ourwork | 1280 | 6 → **0** | 25 → **0** | 0 → **0** |
| post | 390 | 8 → **0** | 29 → **0** | 0 → **0** |
| post | 1280 | 6 → **0** | 34 → **0** | 0 → **0** |
| stories | 390 | 7 → **0** | 17 → **0** | 0 → **0** |
| stories | 1280 | 6 → **0** | 22 → **0** | 0 → **0** |
| **TOTAL** | | **167 → 0** | **963 → 0** | **0 → 0** |
`TOTALS {"captures": 44, "target_fails": 0, "low_contrast": 0, "small_text": 0, "h1_not_1": 0}`
(one run showed 11 contrast fails on a single capture — footer links momentarily
unstyled while the dev server recompiled; a stable re-capture of that route is 0.)
Dark captures now differ from light (system `prefers-color-scheme` honoured).

### What changed, by fix

1. **Yellow = one accent role.** `Section tone="yellow"` → paper surface with separators;
   CTA band, blog filter bar, footer hotline strip, donate draft banner are no longer
   yellow blocks. Eyebrow rule, stat rails, card rails, timeline rails → `currentColor`.
   Header Donate → outline (the hero owns the one filled-yellow action). Yellow keeps:
   the primary button, nav hover underline, the hero's accent headline line, focus ring,
   `.tactile-badge` language coins, link underline marks, icons.
2. **Type floor 13 px.** `.t-label`/`.eyebrow`/`.glass-tag` 10 → 13 px, weight 900 → 600,
   tracking 0.22–0.26 em → 0.04 em, uppercase removed (sentence case everywhere);
   Tailwind `--text-xs` lifted to 13 px; all `text-[10px]`/`text-[11px]` → `text-xs`.
3. **Hit targets.** Nav links `min-h-11` (15 px), hotline strip row 44 px, footer links
   `min-h-11 min-w-11`, `<summary>` rows 44 px, skip link 48 px.
4. **Solid content layer.** `.card` / `.glass-*` / `.tactile-*` → flat surfaces, 1 px
   separator, 12 px card / 8 px control radius, hover = border only; all `hover:scale`,
   `translateY` lifts and 500 ms image zooms removed. Translucency survives only in
   `.glass-bar` on the sticky header.
5. **Dark Mode via tokens.** `@theme` semantic roles (`surface`, `label`, `separator`,
   `on-inverse`…) + `prefers-color-scheme: dark` overrides; legacy utilities
   (`bg-white`, `text-black/70`, `border-white/10`…) are bound to those roles in one
   unlayered remap block, so ~400 call sites follow without edits. `color-scheme: light dark`.
6. **Blog index.** 12 posts/page with Newer/Older + "แสดง x–y จาก N"; posts without a
   cover render as text cards on the secondary surface (no grey boxes); featured card
   only on page 1; empty state offers "ดูบทความทั้งหมด".
7. **Measure & voice.** `.container-narrow` 52 → 42 rem; `.prose-lpn max-width: 42rem`;
   blog eyebrow "บล็อก & ข่าวสาร / Field dispatches" → "ข่าวสาร / News" (matches nav);
   CTA "ติดต่อทีมข่าว / Contact newsroom" → "ติดต่อเรา / Contact us".

Relabels (editorial, listed for the owner): the two in fix 7 only. No navigation
destinations changed.
