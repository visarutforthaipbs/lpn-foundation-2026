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

- Use dark-first hero and shell treatments where appropriate to align with LPN visual language.
- Keep accent color usage sparse and purposeful (CTA, separators, emphasis only).
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
