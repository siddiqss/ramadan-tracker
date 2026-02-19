import { useState, useEffect } from 'react'
import { PrayerTimesCard } from './components/PrayerTimesCard'
import { AshraDuaCard } from './components/AshraDuaCard'
import { SetupRequiredCard } from './components/SetupRequiredCard'
import { OnboardingWizard } from './components/OnboardingWizard'
import { Daily5Checklist } from './components/Daily5Checklist'
import { QuranJourney } from './components/QuranJourney'
import { ShareButton } from './components/ShareButton'
import { InstallPrompt } from './components/InstallPrompt'
import { Settings } from './components/Settings'
import { ProgressDashboard } from './components/ProgressDashboard'
import { AdhkarScreen } from './components/AdhkarScreen'
import { LanternBackdrop } from './components/LanternBackdrop'
import { useSettings } from './hooks/useSettings'
import { useRamadanReminder } from './hooks/useRamadanReminder'
import type { Settings as AppSettings } from './lib/storage'

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement
  if (theme === 'system') {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', dark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

function getMissingSetupItems(settings: AppSettings): string[] {
  const missing: string[] = []
  if (!settings.coordinates) missing.push('Location')
  if (!settings.calculationMethod) missing.push('Prayer time method')
  if (!settings.asrJuristic) missing.push('Asr method')
  if (!settings.ramadanStartDate) missing.push('Ramadan start date')
  return missing
}

export default function App() {
  const [settings] = useSettings()
  useRamadanReminder(settings)
  const [showSettings, setShowSettings] = useState(false)
  const [showTrackedDays, setShowTrackedDays] = useState(false)
  const [showAdhkar, setShowAdhkar] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const missingSetupItems = getMissingSetupItems(settings)

  useEffect(() => {
    applyTheme(settings.theme ?? 'system')
  }, [settings.theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => {
      if ((settings.theme ?? 'system') === 'system') applyTheme('system')
    }
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [settings.theme])

  useEffect(() => {
    if (!settings.onboardingSeen && !showSettings && !showTrackedDays && !showAdhkar) {
      setShowOnboarding(true)
    }
  }, [settings.onboardingSeen, showSettings, showTrackedDays, showAdhkar])

  let content
  if (showSettings) {
    content = <Settings onBack={() => setShowSettings(false)} />
  } else if (showTrackedDays) {
    content = <ProgressDashboard onBack={() => setShowTrackedDays(false)} />
  } else if (showAdhkar) {
    content = <AdhkarScreen onBack={() => setShowAdhkar(false)} />
  } else {
    content = (
      <div className="min-h-dvh max-w-xl mx-auto px-4 pt-4 pb-24 flex flex-col relative z-[1]">
      <header className="ui-card !p-4 sm:!p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ui-section-title">Ramadan Companion</p>
            <h1 className="mt-1 text-2xl leading-tight font-semibold tracking-tight">Ramadan Tracker</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowTrackedDays(true)}
              className="ui-icon-btn"
              aria-label="Tracked days"
              title="Tracked days"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="ui-icon-btn"
              aria-label="Settings"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 overflow-auto">
        <SetupRequiredCard
          missingItems={missingSetupItems}
          onQuickSetup={() => setShowOnboarding(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <PrayerTimesCard />
        <AshraDuaCard />
        <Daily5Checklist onViewAdhkar={() => setShowAdhkar(true)} />
        <QuranJourney />
        <ShareButton />
      </main>
      <InstallPrompt />
    </div>
    )
  }

  return (
    <div className="relative min-h-dvh">
      <LanternBackdrop />
      <div className="relative z-[1]">{content}</div>
      {showOnboarding && !showSettings && !showTrackedDays && !showAdhkar && (
        <OnboardingWizard onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
