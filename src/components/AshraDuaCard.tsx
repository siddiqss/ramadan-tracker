import { useSettings } from '../hooks/useSettings'
import { useRolloverDayKey } from '../hooks/useRolloverDayKey'
import { getRamadanDay } from '../lib/ramadanDay'
import { ashraDuas } from '../data/ramadanAdhkar'

function getAshraDua(day: number) {
  return ashraDuas.find((item) => day >= item.startDay && day <= item.endDay) ?? null
}

export function AshraDuaCard() {
  const [settings] = useSettings()
  const dayKey = useRolloverDayKey()

  if (!settings.ramadanStartDate) {
    return (
      <section className="ui-card">
        <h2 className="ui-section-title mb-2">Ashra Dua</h2>
        <p className="text-sm text-[var(--muted)]">
          Set Ramadan start date in Settings to show the Ashra-based dua for each 10-day period.
        </p>
      </section>
    )
  }

  const ramadanDay = getRamadanDay(settings.ramadanStartDate, dayKey, settings.ramadanDays)
  if (!ramadanDay) return null

  const ashra = getAshraDua(ramadanDay)
  if (!ashra) return null

  return (
    <section className="ui-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="ui-section-title">Ashra Dua</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
          Day {ramadanDay} • {ashra.startDay}-{ashra.endDay}
        </span>
      </div>
      <p className="text-sm font-semibold text-[var(--text)] mb-3">{ashra.title}</p>
      <p className="text-lg leading-loose text-right font-medium mb-3" dir="rtl">
        {ashra.arabic}
      </p>
      <p className="text-xs text-[var(--muted)] italic mb-2">{ashra.transliteration}</p>
      <p className="text-sm text-[var(--text)] leading-relaxed mb-3">{ashra.translation}</p>
      <p className="text-xs text-[var(--muted)]">{ashra.note}</p>
    </section>
  )
}
