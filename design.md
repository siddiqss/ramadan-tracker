# Ramadan Tracker Design Guide

This document defines the shared design system for Ramadan Tracker, related mini-apps, and the main landing page.

## 1) Design Direction

- Tone: calm, spiritual, modern, practical.
- Platform focus: mobile-first PWA, then responsive scale-up.
- Visual signature: soft green palette, elevated cards, subtle glow, lantern motif, gentle motion.
- UX principles:
  - One primary action per section.
  - Fast, glanceable progress/state.
  - Low cognitive load (short labels, clear hierarchy).
  - Respect reduced-motion and dark mode.

## 2) Design Tokens

Use CSS custom properties as the single source of truth.

### Light theme

- `--bg: #f2f7f5`
- `--bg-elevated: #fbfdfc`
- `--surface: #ffffff`
- `--surface-2: #f5faf8`
- `--text: #122521`
- `--muted: #4f6c66`
- `--accent: #0f8a6a`
- `--accent-2: #0a6d54`
- `--ring: #4fd0ab`
- `--border: #cde3dc`
- `--shadow: 0 18px 46px -26px rgb(8 50 40 / 38%)`

### Dark theme

- `--bg: #071513`
- `--bg-elevated: #0c1f1b`
- `--surface: #112723`
- `--surface-2: #16332c`
- `--text: #e8f8f1`
- `--muted: #9ac0b6`
- `--accent: #39b98d`
- `--accent-2: #80e3c1`
- `--ring: #5ddfb1`
- `--border: #21443b`
- `--shadow: 0 22px 54px -28px rgb(0 0 0 / 72%)`

### Typography

- Base font stack in app body: `'Avenir Next', 'Avenir', 'Trebuchet MS', 'Segoe UI', sans-serif`.
- Tailwind `font-sans` fallback stack includes `DM Sans`; use this only if explicitly loaded and intentionally switched.
- Type style hierarchy:
  - Eyebrow/section label: uppercase, `11px`, semibold, wide tracking (`ui-section-title`).
  - Card title: `text-sm` to `text-lg`, semibold.
  - Primary metric: `text-2xl` to `text-3xl`, semibold/bold, `tabular-nums`.
  - Supporting copy: `text-xs`/`text-sm` with `--muted`.

### Spacing and radius

- Page container: `max-w-xl`, horizontal `px-4`, top `pt-4`, bottom `pb-12` to `pb-24`.
- Vertical rhythm between sections: `space-y-4`.
- Card padding:
  - default: `p-5` (`ui-card`)
  - compact: `p-4` (`ui-card-soft`)
- Corners:
  - primary cards: `rounded-3xl`
  - controls and sub-panels: `rounded-2xl` or `rounded-xl`

## 3) Core Surfaces and Backgrounds

- App background: angled gradient from `--bg` to `--bg-elevated`.
- Atmosphere layer: top radial glow (`--header-glow`) via fixed `body::before`.
- Decorative motif: fixed lantern backdrop (`.ramadan-lanterns`) at low opacity.
- Main content stays above decorative layer using `relative z-[1]`.

## 4) Motion and Interaction

- Entry animation for cards: `rise-in` (`240ms`, ease-out, slight upward motion).
- Lantern sway animation enabled by default, disabled when `prefers-reduced-motion: reduce`.
- Button interactions:
  - hover: subtle brighten or border/surface shift.
  - active: slight `translateY(1px)` for tactile feedback.
- Progress bars and micro-states should animate with short transitions (`300-500ms`).

## 5) Reusable UI Components (Required)

Use these utility classes for consistency.

- Card: `.ui-card`
- Soft card/sub-panel: `.ui-card-soft`
- Section eyebrow: `.ui-section-title`
- Icon button: `.ui-icon-btn`
- Chip: `.ui-chip`
- Active chip: `.ui-chip-active`
- Primary CTA: `.ui-primary-btn`
- Secondary button: `.ui-secondary-btn`
- Input/select: `.ui-input`
- Progress track/fill: `.ui-progress > span`
- Informational note: `.ui-note`

Do not create alternate button/card styles unless a new pattern is added to this guide.

## 6) Layout Structure Standards

### App shell

- Root wrapper: `min-h-dvh`, decorative background, and content on top.
- One of three screen patterns:
  - Home feed (stacked cards).
  - Detail screen with back header.
  - Tool screen with fixed bottom action (e.g., Adhkar mark done).

### Home screen pattern

- Header card first.
- Feature cards in this order:
  1. Prayer Times
  2. Daily 5
  3. Quran Journey
  4. Share
- Install prompt is fixed near bottom with safe-area support.

### Secondary screens

- Use same `max-w-xl` (or `max-w-lg` when content is text-heavy like Adhkar).
- Top header should include:
  - back icon button
  - eyebrow label (optional)
  - clear title
- Keep scroll inside main content region, not the full viewport when possible.

## 7) Content Components and Patterns

- Metrics: always use `tabular-nums` for dates, counters, countdowns, percentages.
- Progress visuals:
  - bars use accent gradient (`--accent` to `--ring`).
  - heatmap uses tonal emerald scale with dark-mode alternatives.
- Selection controls:
  - use chips for mutually exclusive options.
  - use check chips/toggles for completion state.
- Forms:
  - label above input.
  - helper/error text below field in `text-xs`/`text-sm`.

## 8) Landing Page Structure (for main site)

Use the same visual language so users immediately recognize product continuity.

Required sections:

1. Hero
- Eyebrow + headline + short value proposition.
- Primary CTA (`ui-primary-btn`): launch app.
- Secondary CTA (`ui-secondary-btn`): learn more/how it works.

2. Feature grid
- 3-4 cards matching app sections: Prayer Times, Daily 5, Quran Journey, Offline Privacy.

3. How it works
- 3-step horizontal/stacked flow with icon + short text.

4. Trust and privacy
- Explicit statements: no account, no ads, local-first storage.

5. Cross-link to mini-apps
- Card list of related tools, each using `ui-card` style and same button language.

6. Footer
- Minimal, muted text and compact links.

## 9) Mini-App Consistency Rules

Each mini-app must reuse the same:

- Token values (`--*` variables).
- Background treatment (gradient + optional glow motif).
- Card/button/input styles.
- Header structure and spacing scale.
- Primary/secondary CTA semantics.
- Progress treatment (`ui-progress`, numeric metrics).

Mini-apps may vary in content modules, but should not redefine theme colors or corner-radius language.

## 10) Accessibility Baseline

- Minimum touch target: `40x40` (icon buttons already enforce this).
- Keep color contrast sufficient in both themes (especially muted text).
- Ensure all icon-only controls include `aria-label`.
- Preserve keyboard focus visibility (`ui-input` focus ring and equivalent on custom controls).
- Respect `prefers-reduced-motion` for all added animations.

## 11) Implementation Rules

- Prefer existing classes in `src/index.css` over ad-hoc inline Tailwind combinations.
- When introducing a new reusable visual pattern:
  1. Add a named class in `@layer components`.
  2. Update this `design.md` with usage guidance.
- Keep per-component styling exceptions minimal (`!p-*` etc.) and document reason if repeated.

## 12) Current Design Audit Notes

- Strengths:
  - Strong tokenized light/dark theming.
  - Consistent card-first composition.
  - Good progress visualization patterns.
  - Clear mobile-first spacing and safe-area handling.

- Gaps to standardize going forward:
  - Font strategy is mixed (`Avenir` body vs `DM Sans` in Tailwind config). Choose one primary family and load it explicitly.
  - A few controls in `AdhkarScreen` still use local classes instead of shared UI utilities. Migrate to shared classes where practical.
  - Some emerald hard-coded colors appear in feature components; prefer token-driven aliases when extending styles.

## 13) Quick Build Checklist

Before shipping any new page/app:

- Uses existing tokens and shared utility classes.
- Supports light and dark themes.
- Looks correct at `320px` mobile width and desktop.
- Uses consistent headers/cards/buttons with existing radius/spacing scale.
- Provides focus states and aria labels.
- Avoids introducing a new visual style without updating this guide.
