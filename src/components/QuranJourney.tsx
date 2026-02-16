import { useState } from 'react'
import { QURAN_JUZ, QURAN_PAGES, RAMADAN_DAYS_OPTIONS, QURAN_TARGET_OPTIONS } from '../data/constants'
import { useSettings } from '../hooks/useSettings'
import { useQuranProgress } from '../hooks/useQuranProgress'
import { useDailyProgress } from '../hooks/useDailyProgress'

const PAGES_PER_JUZ = Math.ceil(QURAN_PAGES / QURAN_JUZ)

export function QuranJourney() {
  const [settings] = useSettings()
  const { progress, dailyQuranTarget } = useDailyProgress()
  const quranProgress = useQuranProgress()

  const days = settings.ramadanDays ?? 30
  const target = settings.targetQuran ?? 1
  const [customDays, setCustomDays] = useState(days)
  const [customTarget, setCustomTarget] = useState(target)

  const todayPages = progress.quranPages ?? 0
  const { totalPagesRead, totalPages, percentComplete, currentJuz, daysRemaining, dailyTarget, juzBreakdown } = quranProgress

  return (
    <section className="ui-card">
      <h2 className="ui-section-title mb-4">Quran Journey</h2>

      <div className="space-y-4">
        <div>
          <p className="text-3xl font-semibold tabular-nums">
            {totalPagesRead}
            <span className="text-base font-normal text-[var(--muted)]"> / {totalPages} pages</span>
          </p>
          <div className="ui-progress mt-2">
            <span style={{ width: `${percentComplete}%` }} />
          </div>
          <p className="text-xs text-[var(--muted)] mt-1 tabular-nums">{percentComplete}% complete</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">Juz progress</p>
          <div className="flex gap-[2px] items-end h-10">
            {juzBreakdown.map((pages, i) => {
              const juzPages = i < QURAN_JUZ - 1 ? PAGES_PER_JUZ : QURAN_PAGES - PAGES_PER_JUZ * (QURAN_JUZ - 1)
              const fill = Math.min(1, pages / juzPages)
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm relative overflow-hidden bg-[var(--surface-2)]"
                  style={{ height: '100%' }}
                  title={`Juz ${i + 1}: ${pages}/${juzPages} pages`}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-300"
                    style={{
                      height: `${fill * 100}%`,
                      background: 'linear-gradient(180deg, var(--ring) 0%, var(--accent) 100%)',
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="ui-note tabular-nums">Juz {currentJuz} · {daysRemaining} days left · {dailyTarget} pages/day</div>

        <div className="pt-3 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text)] tabular-nums">Today: {todayPages} / {dailyQuranTarget} pages</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Completion target</label>
          <div className="grid grid-cols-2 gap-2">
            {QURAN_TARGET_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCustomTarget(t)}
                className={`ui-chip ${customTarget === t ? 'ui-chip-active' : ''}`}
              >
                {t}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Ramadan days</label>
          <div className="grid grid-cols-2 gap-2">
            {RAMADAN_DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setCustomDays(d)}
                className={`ui-chip ${customDays === d ? 'ui-chip-active' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
