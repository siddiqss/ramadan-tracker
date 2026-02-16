# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (localhost:5173)
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build (needed for PWA/offline testing)

No test runner is configured.

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + vite-plugin-pwa. No router — modal-based navigation via boolean state in `App.tsx`.

**Storage (two-tier):**
- **localStorage** — Settings (coordinates, theme, calculation method, Ramadan config). Key: `"ramadan-settings"`. Synchronous.
- **IndexedDB** (`idb` library) — Daily progress (keyed by ISO date `YYYY-MM-DD`) and prayer time cache. DB: `"ramadan-tracker"`, version 1, stores: `"progress"`, `"prayerCache"`.

**State management:** Custom hooks (`useDailyProgress`, `useSettings`, `usePrayerTimes`, `useQuranProgress`) wrap storage with React state. Cross-component sync uses a listener pattern: `subscribeProgress(fn)` / `subscribeSettings(fn)` with `Set<() => void>` — call `notifyProgressChange()` on writes.

**Prayer times:** The `adhan` library computes all 6 times (fajr, sunrise, dhuhr, asr, maghrib, isha) from coordinates + date + calculation method. Results cached in IndexedDB by date; cache invalidated when coords change or new fields are missing.

**Quran tracking:** Daily pages aggregated across all days by `useQuranProgress` hook. Daily target = `(604 × targetQuran) / ramadanDays`. Auto-marks Quran complete when pages >= target.

## Key Conventions

**Prayer bit-flags:** The 5 prayers are stored as a single `number` using bit positions 0-4 (Fajr=0, Dhuhr=1, Asr=2, Maghrib=3, Isha=4). Toggle: `prayers ^ (1 << index)`. All done: `[0,1,2,3,4].every(i => (prayers & (1 << i)) !== 0)`.

**CSS theming:** CSS custom properties (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--border`) defined in `:root` and `.dark`. Theme toggled by adding/removing `.dark` class on `<html>`. Components use Tailwind arbitrary values like `bg-[var(--surface)]`.

**Date keys:** Always `YYYY-MM-DD` via `new Date().toISOString().slice(0, 10)`. Dates parsed with `T12:00:00` suffix to avoid timezone issues.

**No new dependencies** policy for UI changes — all features built with React, native DOM APIs, and CSS.

**TypeScript strict mode** with `noUnusedLocals` and `noUnusedParameters` enabled.
