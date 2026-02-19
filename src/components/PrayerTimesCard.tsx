import { useState, useEffect } from 'react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useSettings } from '../hooks/useSettings'
import { getNextPrayer, type PrayerTimeEntry } from '../lib/prayerTimes'

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function isPast(entry: PrayerTimeEntry): boolean {
  return new Date() > entry.date
}

export function PrayerTimesCard() {
  const [settings] = useSettings()
  const { times, loading, error } = usePrayerTimes(
    new Date(),
    settings.coordinates,
    settings.calculationMethod,
    settings.asrJuristic ?? 'shafi'
  )
  const [countdown, setCountdown] = useState('')
  const [nextPrayerName, setNextPrayerName] = useState('')

  useEffect(() => {
    const schedule = times?.schedule
    if (!schedule) return
    const activeSchedule = schedule

    function update() {
      const { next } = getNextPrayer(activeSchedule)
      if (next) {
        const diff = next.date.getTime() - Date.now()
        setCountdown(formatCountdown(diff))
        setNextPrayerName(next.label)
      } else {
        setCountdown('')
        setNextPrayerName('')
      }
    }

    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [times])

  if (loading) {
    return (
      <section className="ui-card">
        <h2 className="ui-section-title mb-4">Today</h2>
        <p className="text-[var(--muted)]">Loading prayer times...</p>
      </section>
    )
  }

  if (error || !times) {
    return (
      <section className="ui-card">
        <h2 className="ui-section-title mb-4">Prayer Times</h2>
        <p className="text-sm text-amber-600 dark:text-amber-300">{error}</p>
        <p className="text-[var(--muted)] text-sm mt-1">Open Settings and enable location or pick a city.</p>
      </section>
    )
  }

  const { next } = times.schedule ? getNextPrayer(times.schedule) : { next: null }

  return (
    <section className="ui-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="ui-section-title">Prayer Times</h2>
        <p className="text-xs text-[var(--muted)]">{new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="ui-card-soft">
          <p className="text-xs text-[var(--muted)]">Suhoor ends</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{times.suhoorEnd}</p>
        </div>
        <div className="ui-card-soft">
          <p className="text-xs text-[var(--muted)]">Iftar</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{times.iftar}</p>
        </div>
      </div>

      {countdown && (
        <div className="mb-4 rounded-2xl px-4 py-3 border border-[color:var(--ring)]/35 bg-[color:var(--surface)]">
          <p className="text-center">
            <span className="text-3xl font-bold tabular-nums text-[var(--accent)]">{countdown}</span>
            <span className="text-sm text-[var(--muted)] ml-2">until {nextPrayerName}</span>
          </p>
        </div>
      )}

      <div className="space-y-1">
        {times.schedule.map((entry) => {
          const isNext = next?.name === entry.name
          const past = isPast(entry)
          const isSunrise = entry.name === 'sunrise'

          return (
            <div
              key={entry.name}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all duration-200 ${
                isNext
                  ? 'border-[color:var(--ring)] bg-[color:var(--surface)]'
                  : 'border-transparent'
              } ${past ? 'opacity-55' : ''}`}
            >
              <span className={`text-sm font-medium ${isSunrise ? 'text-[var(--muted)]' : ''}`}>
                {entry.label}
              </span>
              <span className={`text-sm tabular-nums ${isNext ? 'font-semibold text-[var(--accent)]' : ''}`}>
                {entry.time}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
