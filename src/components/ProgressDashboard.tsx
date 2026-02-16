import { useState, useEffect, useMemo } from 'react'
import { getAllProgress, getProgressDoneCount, type DailyProgress } from '../lib/storage'
import { computeStats } from '../lib/stats'
import { useSettings } from '../hooks/useSettings'

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const OTHER_ITEMS: { key: 'dhikr' | 'charity' | 'sunnah'; label: string }[] = [
  { key: 'dhikr', label: 'Dhikr' },
  { key: 'charity', label: 'Charity' },
  { key: 'sunnah', label: 'Sunnah' },
]

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface ProgressDashboardProps {
  onBack: () => void
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getHeatmapColor(done: number): string {
  if (done === 0) return 'bg-[var(--surface-2)] border border-[var(--border)]'
  if (done === 1) return 'bg-emerald-200 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-900'
  if (done === 2) return 'bg-emerald-300 border border-emerald-400 dark:bg-emerald-900 dark:border-emerald-800'
  if (done === 3) return 'bg-emerald-400 border border-emerald-500 dark:bg-emerald-800 dark:border-emerald-700'
  if (done === 4) return 'bg-emerald-500 border border-emerald-600 dark:bg-emerald-700 dark:border-emerald-600'
  return 'bg-emerald-600 border border-emerald-700 dark:bg-emerald-600 dark:border-emerald-500'
}

export function ProgressDashboard({ onBack }: ProgressDashboardProps) {
  const [settings] = useSettings()
  const [list, setList] = useState<DailyProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DailyProgress | null>(null)

  useEffect(() => {
    getAllProgress().then((all) => {
      setList(all)
      setLoading(false)
    })
  }, [])

  const stats = useMemo(() => computeStats(list, todayKey()), [list])

  const progressMap = useMemo(() => {
    const map = new Map<string, DailyProgress>()
    for (const p of list) map.set(p.date, p)
    return map
  }, [list])

  const calendarCells = useMemo(() => {
    const ramadanDays = settings.ramadanDays ?? 30
    const startDateStr = settings.ramadanStartDate

    if (!startDateStr) {
      const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date))
      return sorted.slice(0, 30).map((p, i) => ({
        day: i + 1,
        date: p.date,
        done: getProgressDoneCount(p),
        progress: p as DailyProgress | null,
        weekday: new Date(p.date + 'T12:00:00').getDay(),
      }))
    }

    const start = new Date(startDateStr + 'T12:00:00')
    const dayMs = 24 * 60 * 60 * 1000
    const cells: { day: number; date: string; done: number; progress: DailyProgress | null; weekday: number }[] = []

    for (let i = 0; i < ramadanDays; i++) {
      const d = new Date(start.getTime() + i * dayMs)
      const key = d.toISOString().slice(0, 10)
      const p = progressMap.get(key)
      cells.push({
        day: i + 1,
        date: key,
        done: p ? getProgressDoneCount(p) : 0,
        progress: p ?? null,
        weekday: d.getDay(),
      })
    }

    return cells
  }, [settings.ramadanStartDate, settings.ramadanDays, list, progressMap])

  const firstWeekday = calendarCells.length > 0 ? calendarCells[0].weekday : 0

  if (selected) {
    return (
      <div className="max-w-xl mx-auto px-4 pb-12 pt-4 min-h-dvh flex flex-col">
        <header className="ui-card !p-4 mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ui-icon-btn"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">{formatDate(selected.date)}</h1>
        </header>

        <div className="ui-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prayers</span>
            <span className="text-xs text-[var(--muted)]">
              {[0, 1, 2, 3, 4].filter((i) => (selected.prayers & (1 << i)) !== 0).length}/5
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRAYER_NAMES.map((name, i) => {
              const checked = (selected.prayers & (1 << i)) !== 0
              return (
                <span
                  key={name}
                  className={`ui-chip ${checked ? 'ui-chip-active' : ''}`}
                >
                  {name}
                </span>
              )
            })}
          </div>
          <div className="flex items-center gap-3 py-2 pt-2 border-t border-[var(--border)]">
            <span
              className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                selected.quran ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--muted)]'
              }`}
            >
              {selected.quran && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            <span className="font-medium">
              Quran: {selected.quranPages ?? 0} pages
              {selected.quran && (
                <span className="ml-1 text-xs text-[var(--accent)]">(goal met)</span>
              )}
            </span>
          </div>
          <ul className="space-y-2 pt-2 border-t border-[var(--border)]">
            {OTHER_ITEMS.map(({ key, label }) => {
              const done = selected[key]
              return (
                <li key={key} className="flex items-center gap-3 py-2">
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
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 pb-12 pt-4 min-h-dvh flex flex-col">
      <header className="ui-card !p-4 mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="ui-icon-btn"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="ui-section-title">History</p>
          <h1 className="text-xl font-semibold">Progress</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto space-y-4">
        {loading ? (
          <p className="text-[var(--muted)]">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.currentStreak}</p>
                <p className="text-xs text-[var(--muted)]">Current streak</p>
              </div>
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.bestStreak}</p>
                <p className="text-xs text-[var(--muted)]">Best streak</p>
              </div>
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.completionPercent}%</p>
                <p className="text-xs text-[var(--muted)]">Completion</p>
              </div>
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.perfectDays}</p>
                <p className="text-xs text-[var(--muted)]">Perfect days</p>
              </div>
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.totalPrayersCompleted}</p>
                <p className="text-xs text-[var(--muted)]">Prayers completed</p>
              </div>
              <div className="ui-card-soft">
                <p className="text-2xl font-bold tabular-nums">{stats.totalQuranPages}</p>
                <p className="text-xs text-[var(--muted)]">Quran pages</p>
              </div>
            </div>

            {calendarCells.length > 0 && (
              <div className="ui-card">
                <h3 className="ui-section-title mb-3">Ramadan Calendar</h3>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="text-center text-[10px] text-[var(--muted)]">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {settings.ramadanStartDate && Array.from({ length: firstWeekday }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {calendarCells.map((cell) => (
                    <button
                      key={cell.day}
                      type="button"
                      onClick={() => {
                        if (cell.progress) setSelected(cell.progress)
                      }}
                      className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-transform duration-150 active:scale-95 ${getHeatmapColor(cell.done)} ${
                        cell.done > 0 ? 'text-emerald-900 dark:text-emerald-50' : 'text-[var(--muted)]'
                      }`}
                      title={`Day ${cell.day}: ${cell.done}/5`}
                    >
                      {cell.day}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <span className="text-[10px] text-[var(--muted)]">Less</span>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className={`w-3 h-3 rounded-sm ${getHeatmapColor(n)}`} />
                  ))}
                  <span className="text-[10px] text-[var(--muted)]">More</span>
                </div>
              </div>
            )}

            {list.length === 0 && (
              <p className="text-[var(--muted)] text-center py-8">
                No tracked days yet. Use Daily 5 on the home screen to start.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
