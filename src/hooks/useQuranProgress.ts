import { useState, useEffect, useMemo } from 'react'
import { getAllProgress, subscribeProgress } from '../lib/storage'
import { useSettings } from './useSettings'
import { QURAN_PAGES, QURAN_JUZ } from '../data/constants'

const PAGES_PER_JUZ = Math.ceil(QURAN_PAGES / QURAN_JUZ) // ~20.13

export interface QuranProgressData {
  totalPagesRead: number
  totalPages: number
  percentComplete: number
  currentJuz: number
  daysRemaining: number
  dailyTarget: number
  juzBreakdown: number[]
  loading: boolean
}

export function useQuranProgress(): QuranProgressData {
  const [settings] = useSettings()
  const [allPages, setAllPages] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const target = settings.targetQuran ?? 1
  const days = settings.ramadanDays ?? 30
  const totalPages = QURAN_PAGES * target

  function fetchProgress() {
    getAllProgress().then((all) => {
      const pages = all.map((p) => p.quranPages ?? 0)
      setAllPages(pages)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchProgress()
    const unsub = subscribeProgress(() => fetchProgress())
    return unsub
  }, [])

  const totalPagesRead = useMemo(() => allPages.reduce((s, p) => s + p, 0), [allPages])

  const percentComplete = totalPages > 0 ? Math.min(100, Math.round((totalPagesRead / totalPages) * 100)) : 0

  const currentJuz = Math.min(QURAN_JUZ, Math.floor(totalPagesRead / PAGES_PER_JUZ) + 1)

  const daysRemaining = useMemo(() => {
    if (!settings.ramadanStartDate) return days
    const start = new Date(settings.ramadanStartDate + 'T12:00:00')
    const now = new Date()
    const dayMs = 24 * 60 * 60 * 1000
    const elapsed = Math.floor((now.getTime() - start.getTime()) / dayMs)
    return Math.max(1, days - elapsed)
  }, [settings.ramadanStartDate, days])

  const dailyTarget = useMemo(() => {
    const remaining = totalPages - totalPagesRead
    if (remaining <= 0) return 0
    return Math.ceil(remaining / daysRemaining)
  }, [totalPages, totalPagesRead, daysRemaining])

  const juzBreakdown = useMemo(() => {
    const breakdown = new Array(QURAN_JUZ).fill(0)
    let pagesLeft = totalPagesRead
    for (let i = 0; i < QURAN_JUZ; i++) {
      if (pagesLeft <= 0) break
      const juzPages = i < QURAN_JUZ - 1 ? PAGES_PER_JUZ : QURAN_PAGES - PAGES_PER_JUZ * (QURAN_JUZ - 1)
      breakdown[i] = Math.min(pagesLeft, juzPages)
      pagesLeft -= juzPages
    }
    return breakdown
  }, [totalPagesRead])

  return {
    totalPagesRead,
    totalPages,
    percentComplete,
    currentJuz,
    daysRemaining,
    dailyTarget,
    juzBreakdown,
    loading,
  }
}
