import { useState } from 'react'
import { useDailyProgress } from '../hooks/useDailyProgress'

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const OTHER_ITEMS: { key: 'dhikr' | 'charity' | 'sunnah'; label: string }[] = [
  { key: 'dhikr', label: 'Dhikr' },
  { key: 'charity', label: 'Charity' },
  { key: 'sunnah', label: 'Sunnah' },
]

const QURAN_PRESETS = [5, 10, 20] as const

interface Daily5ChecklistProps {
  onViewAdhkar?: () => void
}

export function Daily5Checklist({ onViewAdhkar }: Daily5ChecklistProps) {
  const { progress, loading, dailyQuranTarget, togglePrayer, toggle, addQuranPages, setQuranPages } = useDailyProgress()
  const [quranInput, setQuranInput] = useState('')
  const prayerCount = [0, 1, 2, 3, 4].filter((i) => (progress.prayers & (1 << i)) !== 0).length
  const quranPages = progress.quranPages ?? 0
  const quranDone = quranPages >= dailyQuranTarget
  const focusDone = (prayerCount === 5 ? 1 : 0) + (quranDone ? 1 : 0) + (progress.dhikr ? 1 : 0) + (progress.charity ? 1 : 0) + (progress.sunnah ? 1 : 0)

  if (loading) {
    return (
      <section className="ui-card">
        <h2 className="ui-section-title mb-4">Daily 5</h2>
        <p className="text-[var(--muted)]">Loading...</p>
      </section>
    )
  }

  return (
    <section className="ui-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="ui-section-title">Daily 5</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Tap to mark complete. Saved instantly.</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold tabular-nums">{focusDone}/5</p>
          <p className="text-xs text-[var(--muted)]">focus goals</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Prayers</span>
          <span className="text-xs text-[var(--muted)]">{prayerCount}/5</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRAYER_NAMES.map((name, i) => {
            const checked = (progress.prayers & (1 << i)) !== 0
            return (
              <button
                key={name}
                type="button"
                onClick={() => togglePrayer(i as 0 | 1 | 2 | 3 | 4)}
                className={`ui-chip ${checked ? 'ui-chip-active' : ''}`}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Quran</span>
          <span className="text-xs text-[var(--muted)]">
            {quranPages} / {dailyQuranTarget} pages
          </span>
        </div>
        <div className={`rounded-2xl border p-4 ${quranDone ? 'border-[var(--ring)]' : 'border-[var(--border)]'} bg-[var(--surface)]`}>
          <div className="ui-progress mb-3">
            <span style={{ width: `${Math.min(100, (quranPages / Math.max(1, dailyQuranTarget)) * 100)}%` }} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {QURAN_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => addQuranPages(n)}
                className="ui-secondary-btn !py-2 !px-3"
              >
                +{n}
              </button>
            ))}
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="number"
                min={0}
                step={1}
                placeholder="Set pages"
                value={quranInput}
                onChange={(e) => setQuranInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = parseInt(quranInput, 10)
                    if (!Number.isNaN(n)) {
                      setQuranPages(n)
                      setQuranInput('')
                    }
                  }
                }}
                className="ui-input !w-24"
              />
              <button
                type="button"
                onClick={() => {
                  const n = parseInt(quranInput, 10)
                  if (!Number.isNaN(n)) {
                    setQuranPages(n)
                    setQuranInput('')
                  }
                }}
                className="ui-secondary-btn !py-2.5 !px-3"
              >
                Set
              </button>
            </div>
          </div>
          {quranDone && (
            <p className="mt-2 text-xs font-medium text-[var(--accent)]">Goal reached for today.</p>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {OTHER_ITEMS.map(({ key, label }) => {
          const done = progress[key]
          const isDhikr = key === 'dhikr'
          return (
            <li key={key}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="flex-1 flex items-center gap-3 text-left rounded-xl p-1 transition-colors"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                        done ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--muted)]'
                      }`}
                    >
                      {done && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium">{label}</span>
                  </button>
                  {isDhikr && onViewAdhkar && (
                    <button
                      type="button"
                      onClick={onViewAdhkar}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text)]"
                    >
                      Open adhkar
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
