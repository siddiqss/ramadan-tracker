import { useMemo, useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useGeolocation } from '../hooks/useGeolocation'
import { CALCULATION_METHODS, ASR_JURISTIC_METHODS } from '../data/constants'
import { CITIES } from '../data/cities'
import { getRamadanStartSuggestion } from '../lib/ramadanStart'
import { pushSupport, subscribeRamadanPush } from '../lib/pushClient'

interface OnboardingWizardProps {
  onClose: () => void
}

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const [settings, updateSettings] = useSettings()
  const { loading, error, request } = useGeolocation()
  const [step, setStep] = useState(0)
  const [cityQuery, setCityQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  )
  const [pushBusy, setPushBusy] = useState(false)
  const [pushMessage, setPushMessage] = useState<string | null>(null)
  const ramadanSuggestion = useMemo(() => getRamadanStartSuggestion(), [])
  const { supported: isPushSupported } = pushSupport()

  const cityOptions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase()
    if (!q) return CITIES.slice(0, 20)
    return CITIES.filter((c) => `${c.name}, ${c.country}`.toLowerCase().includes(q)).slice(0, 20)
  }, [cityQuery])

  function finish(markSeenOnly = false) {
    updateSettings({
      onboardingSeen: true,
      ...(markSeenOnly ? {} : {}),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px] p-4 overflow-auto">
      <div className="max-w-lg mx-auto mt-6 ui-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick setup</h2>
          <button
            type="button"
            onClick={() => finish(true)}
            className="text-sm text-[var(--muted)]"
          >
            Skip for now
          </button>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full flex-1 ${i <= step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>

        {step === 0 && (
          <section className="space-y-3">
            <h3 className="font-medium">1. Set your location</h3>
            <p className="text-sm text-[var(--muted)]">This is the biggest accuracy factor for prayer times.</p>
            <button
              type="button"
              onClick={async () => {
                const coords = await request()
                if (coords) updateSettings({ coordinates: coords })
              }}
              disabled={loading}
              className="ui-primary-btn w-full disabled:opacity-50"
            >
              {loading ? 'Getting location...' : 'Use my location'}
            </button>
            {error && <p className="text-xs text-amber-600 dark:text-amber-300">{error}</p>}

            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Or choose city</p>
              <input
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Search city"
                className="ui-input mb-2"
              />
              <select
                value={selectedCity}
                onChange={(e) => {
                  const city = CITIES.find((c) => `${c.name}, ${c.country}` === e.target.value)
                  setSelectedCity(e.target.value)
                  if (city) {
                    updateSettings({ coordinates: { lat: city.lat, lng: city.lng } })
                    setCityQuery(`${city.name}, ${city.country}`)
                  }
                }}
                className="ui-input"
              >
                <option value="">Select city</option>
                {cityOptions.map((c) => (
                  <option key={`${c.name}-${c.country}`} value={`${c.name}, ${c.country}`}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-3">
            <h3 className="font-medium">2. Prayer time method</h3>
            <p className="text-sm text-[var(--muted)]">Match this with your local mosque timetable.</p>
            <select
              value={settings.calculationMethod ?? 'MuslimWorldLeague'}
              onChange={(e) => updateSettings({ calculationMethod: e.target.value || undefined })}
              className="ui-input"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <h3 className="font-medium">3. Asr method</h3>
            <p className="text-sm text-[var(--muted)]">Choose the juristic method your local community follows.</p>
            <select
              value={settings.asrJuristic ?? 'shafi'}
              onChange={(e) => updateSettings({ asrJuristic: e.target.value as 'shafi' | 'hanafi' })}
              className="ui-input"
            >
              {ASR_JURISTIC_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-3">
            <h3 className="font-medium">4. Ramadan start date</h3>
            <p className="text-sm text-[var(--muted)]">Needed for daily Adhkar and Ashra progression.</p>
            {ramadanSuggestion && (
              <button
                type="button"
                onClick={() => updateSettings({ ramadanStartDate: ramadanSuggestion.startDate })}
                className="ui-secondary-btn"
              >
                Use suggested ({ramadanSuggestion.startDate})
              </button>
            )}
            <input
              type="date"
              value={settings.ramadanStartDate ?? ''}
              onChange={(e) => updateSettings({ ramadanStartDate: e.target.value || undefined })}
              className="ui-input"
            />
          </section>
        )}

        {step === 4 && (
          <section className="space-y-3">
            <h3 className="font-medium">5. Daily reminders</h3>
            <p className="text-sm text-[var(--muted)]">Enable notifications to get daily Ramadan reminders.</p>
            <button
              type="button"
              className="ui-secondary-btn w-full disabled:opacity-50"
              disabled={typeof window === 'undefined' || !('Notification' in window) || pushBusy}
              onClick={async () => {
                if (typeof window === 'undefined' || !('Notification' in window)) return
                setPushBusy(true)
                setPushMessage(null)
                const permission = await Notification.requestPermission()
                setNotificationPermission(permission)
                if (permission === 'granted') {
                  const reminderTime = settings.reminderTime ?? '20:00'
                  updateSettings({
                    reminderEnabled: true,
                    reminderTime,
                  })
                  if (isPushSupported) {
                    try {
                      const result = await subscribeRamadanPush({
                        ...settings,
                        reminderEnabled: true,
                        reminderTime,
                      })
                      if (result === 'subscribed') {
                        setPushMessage('Push reminders connected.')
                      } else {
                        setPushMessage('Notification permission was not granted.')
                      }
                    } catch (e) {
                      const message = e instanceof Error ? e.message : String(e)
                      setPushMessage(`Push connect failed (${message}). Local reminders are still enabled.`)
                    } finally {
                      setPushBusy(false)
                    }
                    return
                  }
                  setPushMessage('Notifications enabled. Local reminders are active.')
                } else {
                  setPushMessage('Notification permission is required for reminders.')
                }
                setPushBusy(false)
              }}
            >
              {pushBusy
                ? 'Setting up...'
                : notificationPermission === 'granted'
                  ? 'Notifications enabled'
                  : 'Enable notifications'}
            </button>
            <button
              type="button"
              className="ui-secondary-btn w-full disabled:opacity-50"
              disabled={!isPushSupported || pushBusy}
              onClick={async () => {
                setPushBusy(true)
                setPushMessage(null)
                try {
                  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
                    const permission = await Notification.requestPermission()
                    setNotificationPermission(permission)
                    if (permission !== 'granted') {
                      setPushMessage('Please allow notifications first.')
                      return
                    }
                  }

                  const reminderTime = settings.reminderTime ?? '20:00'
                  updateSettings({
                    reminderEnabled: true,
                    reminderTime,
                  })

                  const result = await subscribeRamadanPush({
                    ...settings,
                    reminderEnabled: true,
                    reminderTime,
                  })
                  if (result === 'subscribed') {
                    setPushMessage('Push reminders connected.')
                  } else {
                    setPushMessage('Notification permission was not granted.')
                  }
                } catch (e) {
                  const message = e instanceof Error ? e.message : String(e)
                  setPushMessage(`Push connect failed (${message}).`)
                } finally {
                  setPushBusy(false)
                }
              }}
            >
              {pushBusy ? 'Connecting push...' : 'Connect push'}
            </button>
            {pushMessage && <p className="text-xs text-[var(--muted)]">{pushMessage}</p>}
          </section>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => (step === 0 ? finish(true) : setStep((s) => s - 1))}
            className="ui-secondary-btn"
          >
            {step === 0 ? 'Not now' : 'Back'}
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="ui-primary-btn">
              Next
            </button>
          ) : (
            <button type="button" onClick={() => finish(false)} className="ui-primary-btn">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
