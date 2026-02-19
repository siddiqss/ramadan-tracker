function toLocalYmd(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getRolloverDayKey(now = new Date()): string {
  return toLocalYmd(now)
}

export function getMsUntilNextRollover(now = new Date()): number {
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return Math.max(0, next.getTime() - now.getTime())
}
