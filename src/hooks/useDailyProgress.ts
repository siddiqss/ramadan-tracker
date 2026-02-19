import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getProgress,
  setProgress,
  getDefaultProgress,
  subscribeProgress,
  type DailyProgress,
} from '../lib/storage'
import { useSettings } from './useSettings'
import { QURAN_PAGES } from '../data/constants'
import type { Daily5Key } from '../data/constants'
import { getRolloverDayKey } from '../lib/dayKey'
import { useRolloverDayKey } from './useRolloverDayKey'

function computeDailyQuranTarget(targetQuran: 1 | 2 | undefined, ramadanDays: 29 | 30 | undefined): number {
  const target = targetQuran ?? 1
  const days = ramadanDays ?? 30
  const totalPages = QURAN_PAGES * target
  return Math.round((totalPages / days) * 100) / 100
}

export function useDailyProgress(): {
  progress: DailyProgress
  loading: boolean
  dailyQuranTarget: number
  togglePrayer: (index: 0 | 1 | 2 | 3 | 4) => void
  toggle: (key: Exclude<Daily5Key, 'prayers'>) => void
  setQuranPages: (pages: number) => void
  addQuranPages: (delta: number) => void
} {
  const [settings] = useSettings()
  const [progress, setProgressState] = useState<DailyProgress>(() =>
    getDefaultProgress(getRolloverDayKey())
  )
  const [loading, setLoading] = useState(true)

  const dateKey = useRolloverDayKey()
  const dailyQuranTarget = useMemo(
    () => computeDailyQuranTarget(settings.targetQuran, settings.ramadanDays),
    [settings.targetQuran, settings.ramadanDays]
  )

  const normalizeProgress = useCallback(
    (base: DailyProgress): DailyProgress => {
      let normalized = { ...base, quranPages: base.quranPages ?? 0, fasting: base.fasting ?? false }
      if (base.quran && (base.quranPages == null || base.quranPages === 0)) {
        normalized = { ...normalized, quranPages: dailyQuranTarget }
      }
      return normalized
    },
    [dailyQuranTarget]
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setProgressState(getDefaultProgress(dateKey))
    getProgress(dateKey).then((p) => {
      if (!cancelled) {
        const base = p ?? getDefaultProgress(dateKey)
        setProgressState(normalizeProgress(base))
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [dateKey, normalizeProgress])

  useEffect(() => {
    return subscribeProgress(() => {
      getProgress(dateKey).then((p) => {
        const base = p ?? getDefaultProgress(dateKey)
        setProgressState(normalizeProgress(base))
      })
    })
  }, [dateKey, normalizeProgress])

  const persist = useCallback(
    (next: DailyProgress) => {
      setProgressState(next)
      setProgress(next)
    },
    []
  )

  const togglePrayer = useCallback(
    (index: 0 | 1 | 2 | 3 | 4) => {
      const current = progress.prayers
      const bit = 1 << index
      const has = (current & bit) !== 0
      const nextCount = has ? current - bit : current + bit
      persist({ ...progress, prayers: nextCount })
    },
    [progress, persist]
  )

  const toggle = useCallback(
    (key: Exclude<Daily5Key, 'prayers'>) => {
      const current = progress[key]
      persist({ ...progress, [key]: !current })
    },
    [progress, persist]
  )

  const setQuranPages = useCallback(
    (pages: number) => {
      const clamped = Math.max(0, Math.round(pages))
      const next: DailyProgress = {
        ...progress,
        quranPages: clamped,
        quran: clamped >= dailyQuranTarget,
      }
      persist(next)
    },
    [progress, persist, dailyQuranTarget]
  )

  const addQuranPages = useCallback(
    (delta: number) => {
      const current = progress.quranPages ?? 0
      setQuranPages(current + delta)
    },
    [progress.quranPages, setQuranPages]
  )

  return { progress, loading, dailyQuranTarget, togglePrayer, toggle, setQuranPages, addQuranPages }
}
