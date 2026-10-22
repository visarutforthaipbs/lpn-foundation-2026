# LPN Design Guardrails (Brand + Signal 39)

This project follows two systems at once:
- LPN visual brand package from public/_ LPN Design Package - Full
- Signal 39 cognitive design philosophy from 39signel-SKILL.md

Use these rules for all pages, sections, blocks, and components.

## 1) Non-Negotiable Design Objective

A user with low attention and high stress should understand the highest-value message in 5 seconds.

## 2) Brand Rules from LPN Package

### Visual identity
- Keep high-contrast presentation as a default: black or very dark surfaces, white text, limited yellow accents.
- Use yellow only as accent and structure (line/bracket/highlight), never as the primary text color on white.
- On white backgrounds, avoid yellow text accents due to poor contrast.
- If text overlays images, place text inside a white or strong-contrast container.

### Typography
- Headline style should keep clear light-bold hierarchy.
- Body copy should use readable serif/sans pairing with selective bold emphasis.
- Keep headline length short: max about 3 lines.
- Keep caption text small and clearly secondary.

### Composition and layout
- Human-centered photography is core: subject-focused, high quality, strong contrast.
- Avoid floating text boxes: align content boxes to a consistent edge.
- Keep predictable spacing and margins across sections.
- Use bracket motifs selectively to emphasize statements or contain imagery.
- Do not apply brackets to everything; use only where emphasis is needed.

### Content packaging
- One idea per screen/section.
- Avoid text-heavy blocks when a visual or highlighted statement can carry meaning.
- Prefer high-quality, meaningful images over decorative visuals.

## 3) Signal 39 Rules (Cognitive Budget)

### Layer 1: pre-attentive signal
- Color must encode meaning (status, urgency, category), not decoration.
- Use at most 3 hue families per screen.
- Motion should signal change, not ornament.

### Layer 2: chunking
- Keep top-level choices minimal (rule of three whenever possible).
- Group related content into semantic chunks.
- Use icon + label patterns for quicker recognition.

### Layer 3: deep insight
- Reserve dense text for high-surprisal information only.
- Use progressive disclosure for secondary details.
- Lead with findings and implications, then methods/background.

### Cost controls
- Reduce context switches (avoid forcing view toggles for related facts).
- Keep map/data/text context together when possible.
- After major insights, insert visual breathing space.

## 4) Combined Operating Checklist (Use Before Shipping)

### Quick scan test
- If text is blurred, can users still see priority and where to look first?

### Surprisal test
- Does each major section communicate something non-obvious and decision-useful?

### Bit-tax test
- Remove any duplicate labels, repeated headlines, and predictable filler copy.

### Contrast test
- Validate text/background contrast, especially accent colors.

### Structure test
- One primary message per section.
- No section should require long scanning to find the takeaway.

## 5) Implementation Defaults for This Repo

> **LPN One CI (2026-10-22, branch `design/one-ci`) — the site follows the shared brand
> system in `../brand/BRAND.md` + `../brand/tokens/lpn-tokens.css`. These defaults
> supersede the older bullets below where they conflict.** Audit: `docs/design-audit.md`.
> - ONE yellow: **`#FFC314`** (`--color-brand`, pressed `#E6AC00`). `#ffd43b` is retired.
>   Yellow has three jobs: the single prominent action per view, selection, focus ring.
>   Never a section background, rail, rule, or decorative bar. Label on yellow is always
>   black; never yellow text on white; never white on yellow. The LPN logo stays black/white.
> - Fonts: **IBM Plex Sans** (Latin) + **IBM Plex Sans Thai** (Thai UI) + **IBM Plex Sans
>   Thai Looped** (`.prose-lpn` long reads on Thai pages), all SIL OFL, self-hosted from
>   `public/fonts/` via `next/font/local` (no Google Fonts request). DB Helvethaica X is
>   removed — LPN holds no licence. Weights 400–700 only (no 800/900 — Plex has none).
> - Type: body 17 px / line-height 1.7 (`--text-base`), caption floor 13 px (`--text-xs`),
>   otherwise the normal Tailwind scale (Plex Thai needs no size lift). No letter-spacing
>   on Thai; Thai headings line-height 1.45.
> - Icons: **Phosphor** only (`@phosphor-icons/react`; server components import from
>   `@phosphor-icons/react/ssr`), names from `../brand/assets/icons/icons.json`.
>   `regular` = default UI at 20 px in buttons/strips, 24 px in nav; `fill` = selected;
>   `duotone` + `className="pictogram-duotone"` (yellow second layer) only for
>   topic/programme pictograms ≥ 32 px on neutral surfaces — never on a yellow button or
>   inside a status badge. Always paired with a word. `public/icons/*.svg` are the
>   Phosphor duotone pictograms; the 2019 PNGs are gone.
> - Colours are semantic roles (`--color-surface[-secondary|-tertiary|-elevated]`,
>   `--color-label[-secondary|-tertiary]`, `--color-separator[-strong]`,
>   `--color-on-inverse`…) plus status roles (`critical / high / medium / low / success`,
>   each with `-ink` and `-tint`; status is never yellow) in `src/app/(frontend)/styles.css`.
>   Dark Mode follows `prefers-color-scheme` with no toggle. Legacy `bg-white` /
>   `text-black/70` utilities are remapped to those roles — prefer the role names in new code.
> - Radius: 8 px control, 12 px card, 16 px sheet, pill 999.
> - Controls ≥ 44 px (touch) / 28 px (pointer).
> - Content layer is solid: no glass, gradients, inset shadows, hover lifts or image zoom.
>   Translucency only on the sticky header (`.glass-bar`).
> - Body measure ≤ 42 rem (`.container-narrow`, `.prose-lpn`).

- Use dark-first hero and shell treatments where appropriate to align with LPN visual language.
- Keep accent color usage sparse and purposeful (CTA, separators, emphasis only).
- Buttons use flat fills, 1px borders, and 2px corners. Avoid gradients, bevels, glow, and movement on hover.
- Use yellow with black text for the primary action, an outline for secondary actions, and solid black on yellow sections.
- Button labels use sentence case, 14px semibold type, and minimal tracking. Keep flexible 48px targets with room for Thai tone marks; utility icons and filters need at least 44px.
- Keep hover, pressed, selected, disabled, and keyboard focus states distinct without changing control dimensions. Filters show selection with a solid black fill and white text.
- For content migration pages (home/about/team/services/partners):
  - Start each page with one high-surprisal statement.
  - Break long narratives into compact chunks with clear section headings.
  - Ensure CTA and hotline/help paths are visible without excessive scrolling.

## 6) News/Editorial Handling Notes

From the LPN News Instructions document:
- News cards should keep strict metadata consistency:
  - headline
  - publication/platform
  - author/owner
  - published date
  - source URL
- Keep image quality high and crop intentionally.
- Preserve a consistent card typography hierarchy.

## 7) Anti-Patterns to Avoid

- Decorative motion with no information value.
- More than 5 to 6 equal-weight items in one block.
- Yellow accent text on white background.
- Text directly on busy image without a contrast container.
- Long paragraphs before the key message is clear.
- Multiple competing CTAs in the same viewport.

## 8) Decision Priority Order

When brand and cognitive choices conflict:
1. Clarity and comprehension under low attention.
2. Accessibility and contrast.
3. Signal 39 surprisal efficiency.
4. LPN visual style expression.

This order ensures both systems are followed without sacrificing usability.
