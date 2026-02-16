---
name: Daily goals and history review
overview: Review of how daily goals are "submitted" (tap-to-save, already implemented) and a concrete plan to add viewing of existing tracked days so the app works as a full Ramadan productivity tracker.
todos: []
isProject: false
---

# Plan: Daily goals submission and viewing tracked days

## What the plan already specified (and what’s built)

The [ramadan_tracker_pwa_d87b36f6.plan.md](.cursor/plans/ramadan_tracker_pwa_d87b36f6.plan.md) describes:

- **Feature 1 (Daily 5)**: “Tapping toggles state; state persisted to IndexedDB” and “Single primary screen: Today’s Daily 5”.
- **Data model**: One record per day in IndexedDB keyed by `date: "YYYY-MM-DD"`.

So the plan never had an explicit “submit” button; it designed for **tap-to-toggle with immediate persist**.

---

## 1. How users “submit” daily goals (current behavior)

There is no separate submit step. Goals are saved as the user taps.


| Aspect          | Implementation                                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Where**       | Main screen → [Daily5Checklist](src/components/Daily5Checklist.tsx): Prayers (5 buttons) + Quran, Dhikr, Charity, Sunnah (checkable rows).                       |
| **Action**      | Tap a prayer name or a row → [useDailyProgress](src/hooks/useDailyProgress.ts) toggles that item and calls `setProgress(next)` in [storage](src/lib/storage.ts). |
| **Persistence** | Each toggle writes immediately to IndexedDB for **today’s date** (`todayKey()` = `YYYY-MM-DD`).                                                                  |
| **Share**       | [ShareButton](src/components/ShareButton.tsx) shows “Share my progress (X/5 today)” using the same today’s progress.                                             |


So “submission” = **tap to toggle, auto-save**. No extra button is required for today’s goals.

If you want to make this clearer in the UI, options (optional) are:

- A short hint under Daily 5: “Tap to mark done; saved automatically.”
- Or leave as-is; the behavior is already consistent with the plan.

---

## 2. How users view existing tracked days (gap)

The plan only describes **today’s** screen. There is **no way in the app to see past days**.

- [useDailyProgress](src/hooks/useDailyProgress.ts) only uses `todayKey()`: load/save for today only.
- [storage](src/lib/storage.ts) has `getProgress(date)` and `setProgress(progress)` but **no API to list all stored days** (e.g. `getAllProgress()` or “get all keys”).
- [App](src/App.tsx) has no History / Calendar / “Tracked days” view; only Home (Prayer times, Daily 5, Quran, Share) and Settings.

So: **past days are stored when the user used the app on those days, but they cannot be viewed anywhere.** For a Ramadan productivity tracker, a history view is a core missing piece.

---

## 3. Recommended addition: “Tracked days” (history) view

Add a minimal way to list and inspect past (and current) tracked days, without changing how today’s goals are “submitted” (tap-to-save stays as-is).

### 3.1 Storage

- In [src/lib/storage.ts](src/lib/storage.ts):
  - Add something like `getAllProgress(): Promise<DailyProgress[]>` using IndexedDB’s `getAll()` (and optionally sort by `date` descending) so the app can list every day that has a record.

### 3.2 UI entry and screen

- From the main screen, add a clear entry point to “Tracked days” / “History” (e.g. link or button in the header or under Daily 5).
- New screen (or bottom sheet / slide-over) that:
  - Calls `getAllProgress()` and shows a **list of tracked days** (e.g. date + short summary like “5/5” or “4/5”).
  - Optionally: tap a day to see that day’s full breakdown (Prayers, Quran, Dhikr, Charity, Sunnah) in read-only form; later you could allow editing if needed.

### 3.3 Optional: date picker for “today”

- If you want to support **logging for another day** (e.g. user forgot yesterday), you could add a “Date” selector on the main Daily 5 screen so `useDailyProgress` can accept an optional `date` (default today). That would still use the same “tap to toggle, auto-save” model, just keyed by the selected date. This can be a follow-up after the history view exists.

---

## 4. Summary


| Question                                     | Answer                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **How can users submit daily goals?**        | By tapping items on the Daily 5 checklist; each tap toggles and **saves immediately** to IndexedDB for today. No separate submit button.                                                 |
| **How can they view existing tracked days?** | **Not yet.** Data is stored per day but there is no list/detail view. Add `getAllProgress()` and a “Tracked days” / History screen that lists days and optionally shows per-day details. |


Implementing the storage API and the Tracked days (history) screen will align the app with the idea of a Ramadan productivity tracker while keeping the current, plan-aligned tap-to-save flow for daily goals.