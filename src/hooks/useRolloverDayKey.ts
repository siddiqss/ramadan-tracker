import { useEffect, useState } from 'react'
import { getMsUntilNextRollover, getRolloverDayKey } from '../lib/dayKey'

export function useRolloverDayKey(): string {
  const [dayKey, setDayKey] = useState(() => getRolloverDayKey())

  useEffect(() => {
    let timerId: number | null = null

    const schedule = () => {
      const delay = getMsUntilNextRollover() + 250
      timerId = window.setTimeout(() => {
        setDayKey(getRolloverDayKey())
        schedule()
      }, delay)
    }

    schedule()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setDayKey(getRolloverDayKey())
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (timerId !== null) {
        window.clearTimeout(timerId)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return dayKey
}
