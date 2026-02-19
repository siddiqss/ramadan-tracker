import { useEffect, useRef } from 'react'
import { getRamadanDay } from '../lib/ramadanDay'
import type { Settings } from '../lib/storage'

const LAST_REMINDER_KEY = 'ramadan-last-reminder-date'

function parseTime(value: string | undefined): { hour: number; minute: number } | null {
  if (!value) return null
  const [hourRaw, minuteRaw] = value.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

async function notifyReminder() {
  const title = 'Daily check-in'
  const body = 'Take one minute to update your Ramadan goals for today.'

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready
    await reg.showNotification(title, {
      body,
      tag: 'ramadan-daily-reminder',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    })
    return
  }

  new Notification(title, { body })
}

export function useRamadanReminder(settings: Settings) {
  const busyRef = useRef(false)

  useEffect(() => {
    const backendConfigured =
      typeof import.meta.env.VITE_PUSH_BACKEND_URL === 'string' &&
      import.meta.env.VITE_PUSH_BACKEND_URL.length > 0 &&
      typeof import.meta.env.VITE_VAPID_PUBLIC_KEY === 'string' &&
      import.meta.env.VITE_VAPID_PUBLIC_KEY.length > 0
    if (backendConfigured) return

    const tick = async () => {
      if (busyRef.current) return
      if (!settings.reminderEnabled) return
      if (!settings.ramadanStartDate) return
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

      const now = new Date()
      const ramadanDay = getRamadanDay(settings.ramadanStartDate, now, settings.ramadanDays)
      if (!ramadanDay) return

      const parsed = parseTime(settings.reminderTime ?? '20:00')
      if (!parsed) return

      const scheduled = new Date(now)
      scheduled.setHours(parsed.hour, parsed.minute, 0, 0)
      if (now.getTime() < scheduled.getTime()) return

      const todayKey = now.toISOString().slice(0, 10)
      const lastDate = localStorage.getItem(LAST_REMINDER_KEY)
      if (lastDate === todayKey) return

      try {
        busyRef.current = true
        await notifyReminder()
        localStorage.setItem(LAST_REMINDER_KEY, todayKey)
      } catch {
        // No-op: notifications can fail in some browsers or OS states.
      } finally {
        busyRef.current = false
      }
    }

    void tick()
    const interval = window.setInterval(() => {
      void tick()
    }, 30_000)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void tick()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [
    settings.reminderEnabled,
    settings.reminderTime,
    settings.ramadanStartDate,
    settings.ramadanDays,
  ])
}
