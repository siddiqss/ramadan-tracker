import { type DailyProgress, getProgressDoneCount } from './storage'

export interface Stats {
  currentStreak: number
  bestStreak: number
  completionPercent: number
  totalPrayersCompleted: number
  totalQuranPages: number
  perfectDays: number
  totalDays: number
}

function countPrayers(prayers: number): number {
  let count = 0
  for (let i = 0; i < 5; i++) {
    if ((prayers & (1 << i)) !== 0) count++
  }
  return count
}

export function computeStats(allProgress: DailyProgress[], todayKey: string): Stats {
  if (allProgress.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      completionPercent: 0,
      totalPrayersCompleted: 0,
      totalQuranPages: 0,
      perfectDays: 0,
      totalDays: 0,
    }
  }

  // Sort by date ascending for streak calculation
  const sorted = [...allProgress].sort((a, b) => a.date.localeCompare(b.date))
  const progressMap = new Map(sorted.map((p) => [p.date, p]))

  let totalPrayersCompleted = 0
  let totalQuranPages = 0
  let perfectDays = 0
  let totalCompletedItems = 0

  for (const p of sorted) {
    totalPrayersCompleted += countPrayers(p.prayers)
    totalQuranPages += p.quranPages ?? 0
    const done = getProgressDoneCount(p)
    totalCompletedItems += done
    if (done === 6) perfectDays++
  }

  const totalDays = sorted.length
  const completionPercent = totalDays > 0 ? Math.round((totalCompletedItems / (totalDays * 6)) * 100) : 0

  // Streak calculation: walk backward from today
  let currentStreak = 0
  let bestStreak = 0

  const d = new Date(todayKey + 'T12:00:00')
  const dayMs = 24 * 60 * 60 * 1000

  // Current streak: consecutive days with >= 1 completed item, walking backward
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10)
    const p = progressMap.get(key)
    if (p && getProgressDoneCount(p) >= 1) {
      currentStreak++
    } else {
      break
    }
    d.setTime(d.getTime() - dayMs)
  }

  // Best streak: scan all sorted days
  let streak = 0
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]
    if (getProgressDoneCount(p) >= 1) {
      if (i === 0) {
        streak = 1
      } else {
        const prev = new Date(sorted[i - 1].date + 'T12:00:00')
        const curr = new Date(p.date + 'T12:00:00')
        const diff = Math.round((curr.getTime() - prev.getTime()) / dayMs)
        streak = diff === 1 ? streak + 1 : 1
      }
    } else {
      streak = 0
    }
    bestStreak = Math.max(bestStreak, streak)
  }

  return {
    currentStreak,
    bestStreak,
    completionPercent,
    totalPrayersCompleted,
    totalQuranPages,
    perfectDays,
    totalDays,
  }
}
