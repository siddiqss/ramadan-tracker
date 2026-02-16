import { useState, useEffect, useCallback } from 'react'
import { getPrayerTimesForDate, type PrayerTimesResult } from '../lib/prayerTimes'
import { getCachedCoordinates } from '../lib/geo'
import { getSettings } from '../lib/storage'

function toDayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function usePrayerTimes(
  date: Date,
  coordinates?: { lat: number; lng: number } | null
): {
  times: PrayerTimesResult | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [times, setTimes] = useState<PrayerTimesResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dayKey = toDayKey(date)

  const fetchTimes = useCallback(async () => {
    const current = coordinates ?? getCachedCoordinates()
    const { calculationMethod } = getSettings()
    if (!current) {
      setError('Enable location or choose a city in Settings')
      setTimes(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const dateForDay = new Date(`${dayKey}T12:00:00`)
      const result = await getPrayerTimesForDate(
        dateForDay,
        current.lat,
        current.lng,
        calculationMethod
      )
      setTimes(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not compute times')
      setTimes(null)
    } finally {
      setLoading(false)
    }
  }, [dayKey, coordinates?.lat, coordinates?.lng])

  useEffect(() => {
    fetchTimes()
  }, [fetchTimes])

  return { times, loading, error, refetch: fetchTimes }
}
