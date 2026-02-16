/**
 * Returns the day of Ramadan (1-30) if today falls within Ramadan, else null.
 * Uses optional ramadanDays (29 or 30) to cap the last day.
 */
export function getRamadanDay(
  ramadanStartDate: string | undefined,
  today: Date,
  ramadanDays?: 29 | 30
): number | null {
  if (!ramadanStartDate) return null
  const start = new Date(ramadanStartDate + 'T12:00:00')
  const dayMs = 24 * 60 * 60 * 1000
  const diff = Math.floor((today.getTime() - start.getTime()) / dayMs) + 1
  const maxDays = ramadanDays ?? 30
  if (diff >= 1 && diff <= maxDays) return diff
  return null
}
