import { useState } from 'react'
import { useDailyProgress } from '../hooks/useDailyProgress'

const APP_URL = typeof window !== 'undefined' ? window.location.origin : ''
const SHARE_TITLE = 'Ramadan Tracker'
const SHARE_TEXT =
  'Track your Daily 5, Quran goal, and Suhoor/Iftar times. Privacy-first, works offline.'

function countDone(progress: { prayers: number; quran: boolean; dhikr: boolean; charity: boolean; sunnah: boolean }): number {
  const prayerCount = [0, 1, 2, 3, 4].filter((i) => (progress.prayers & (1 << i)) !== 0).length
  return prayerCount + (progress.quran ? 1 : 0) + (progress.dhikr ? 1 : 0) + (progress.charity ? 1 : 0) + (progress.sunnah ? 1 : 0)
}

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const { progress } = useDailyProgress()
  const done = countDone(progress)

  async function shareApp() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: APP_URL,
        })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${APP_URL}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(APP_URL, '_blank')
    }
  }

  async function shareProgress() {
    const text = `I've completed ${done}/5 on my Daily 5 today. Try Ramadan Tracker - privacy-first, works offline. ${APP_URL}`
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
      shareApp()
    }
  }

  return (
    <div className="ui-card !p-4 space-y-2">
      <p className="ui-section-title">Share</p>
      <button
        type="button"
        onClick={shareApp}
        className="ui-primary-btn w-full"
      >
        {copied ? 'Link copied' : 'Share app'}
      </button>
      <button
        type="button"
        onClick={shareProgress}
        className="ui-secondary-btn w-full"
      >
        Share my progress ({done}/5 today)
      </button>
    </div>
  )
}
