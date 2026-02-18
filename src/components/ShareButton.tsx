import { useState } from 'react'
import { useDailyProgress } from '../hooks/useDailyProgress'

const APP_URL = typeof window !== 'undefined' ? window.location.origin : ''
const SHARE_TITLE = 'Ramadan Tracker'

function countDone(progress: { prayers: number; quran: boolean; dhikr: boolean; charity: boolean; sunnah: boolean; fasting: boolean }): number {
  const prayerCount = [0, 1, 2, 3, 4].filter((i) => (progress.prayers & (1 << i)) !== 0).length
  return (
    prayerCount +
    (progress.quran ? 1 : 0) +
    (progress.dhikr ? 1 : 0) +
    (progress.charity ? 1 : 0) +
    (progress.sunnah ? 1 : 0) +
    (progress.fasting ? 1 : 0)
  )
}

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const { progress } = useDailyProgress()
  const done = countDone(progress)

  async function shareProgress() {
    const text = `Alhamdulillah! I completed ${done}/6 Ramadan goals today. Ramadan Tracker helps me track prayers, Quran, dhikr, charity, sunnah, and fasting. Join me: ${APP_URL}`
    if (navigator.share) {
      try {
        await navigator.share({ title: SHARE_TITLE, text, url: APP_URL })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(APP_URL, '_blank')
    }
  }

  return (
    <div className="ui-card !p-4 space-y-2">
      <p className="ui-section-title">Share</p>
      <p className="text-sm text-[var(--muted)]">Share your daily progress with family and friends.</p>
      <button
        type="button"
        onClick={shareProgress}
        className="ui-primary-btn w-full"
      >
        {copied ? 'Message copied' : `Share today’s progress (${done}/6)`}
      </button>
    </div>
  )
}
