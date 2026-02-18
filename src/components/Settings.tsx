import { useSettings } from '../hooks/useSettings'
import { useGeolocation } from '../hooks/useGeolocation'
import { CALCULATION_METHODS } from '../data/constants'
import { CITIES } from '../data/cities'
import { useMemo, useState } from 'react'
import { pushSupport, subscribeRamadanPush, unsubscribeRamadanPush } from '../lib/pushClient'

interface SettingsProps {
  onBack: () => void
}

export function Settings({ onBack }: SettingsProps) {
  const [settings, updateSettings] = useSettings()
  const { loading, error, coords, request } = useGeolocation()
  const [cityQuery, setCityQuery] = useState('')
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [manualError, setManualError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  )
  const [pushMessage, setPushMessage] = useState<string | null>(null)
  const [pushBusy, setPushBusy] = useState(false)

  const cityOptions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase()
    if (!q) return CITIES
    return CITIES.filter((c) =>
      `${c.name}, ${c.country}`.toLowerCase().includes(q)
    )
  }, [cityQuery])

  const displayedCoords = settings.coordinates ?? coords

  const { supported: isPushSupported } = pushSupport()
  const isNotificationSupported =
    typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator

  return (
    <div className="max-w-xl mx-auto px-4 pb-12 pt-4 min-h-dvh">
      <header className="ui-card !p-4 mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="ui-icon-btn -ml-1"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="ui-section-title">Preferences</p>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <div className="space-y-4">
        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Daily reminder</h2>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm">Enable Ramadan reminder</span>
            <input
              type="checkbox"
              checked={Boolean(settings.reminderEnabled)}
              onChange={(e) => updateSettings({ reminderEnabled: e.target.checked })}
            />
          </label>

          <label className="block mt-3">
            <span className="block text-xs text-[var(--muted)] mb-1">Reminder time</span>
            <input
              type="time"
              value={settings.reminderTime ?? '20:00'}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="ui-input"
            />
          </label>

          <button
            type="button"
            className="ui-secondary-btn w-full mt-3 disabled:opacity-50"
            disabled={!isNotificationSupported}
            onClick={async () => {
              if (!isNotificationSupported) return
              const permission = await Notification.requestPermission()
              setPermissionState(permission)
            }}
          >
            {permissionState === 'granted' ? 'Notifications enabled' : 'Allow notifications'}
          </button>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              className="ui-secondary-btn disabled:opacity-50"
              disabled={!isPushSupported || pushBusy}
              onClick={async () => {
                try {
                  setPushBusy(true)
                  setPushMessage(null)
                  const result = await subscribeRamadanPush(settings)
                  setPermissionState(Notification.permission)
                  if (result === 'permission_denied') {
                    setPushMessage('Notification permission denied.')
                    return
                  }
                  setPushMessage('Push reminder connected.')
                } catch {
                  setPushMessage('Push setup failed. Check backend URL/VAPID key.')
                } finally {
                  setPushBusy(false)
                }
              }}
            >
              Connect push
            </button>
            <button
              type="button"
              className="ui-secondary-btn disabled:opacity-50"
              disabled={!isPushSupported || pushBusy}
              onClick={async () => {
                try {
                  setPushBusy(true)
                  await unsubscribeRamadanPush()
                  setPushMessage('Push reminder disconnected.')
                } catch {
                  setPushMessage('Could not disconnect push.')
                } finally {
                  setPushBusy(false)
                }
              }}
            >
              Disconnect push
            </button>
          </div>
          {pushMessage && <p className="text-xs text-[var(--muted)] mt-2">{pushMessage}</p>}
          <p className="text-xs text-[var(--muted)] mt-2">
            Works during Ramadan only, based on your Ramadan start date above.
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            Best support: Safari/iOS web app (Add to Home Screen) and Chrome/Android web app.
            Chrome/Firefox on iPhone use WebKit limits and may not support web push.
          </p>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Location</h2>
          <button
            type="button"
            onClick={request}
            disabled={loading}
            className="ui-primary-btn w-full disabled:opacity-50"
          >
            {loading ? 'Getting location...' : coords ? 'Update my location' : 'Use my location'}
          </button>
          {displayedCoords && (
            <p className="text-xs text-[var(--muted)] mt-2">
              Using: {displayedCoords.lat.toFixed(4)}, {displayedCoords.lng.toFixed(4)}
            </p>
          )}
          {error && (
            <p className="text-sm text-amber-600 dark:text-amber-300 mt-2">{error}</p>
          )}
          <p className="text-xs text-[var(--muted)] mt-2">
            iPhone Safari fix: Settings {'>'} Privacy & Security {'>'} Location Services {'>'} Safari Websites {'>'} While Using the App.
          </p>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">City (fallback)</h2>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Search city (e.g., Multan)"
            className="ui-input mb-2"
          />
          <select
            value=""
            onChange={(e) => {
              const city = CITIES.find((c) => `${c.name}, ${c.country}` === e.target.value)
              if (city) {
                updateSettings({ coordinates: { lat: city.lat, lng: city.lng } })
                setCityQuery(`${city.name}, ${city.country}`)
              }
            }}
            className="ui-input"
          >
            <option value="">Select a city</option>
            {cityOptions.map((c) => (
              <option key={`${c.name}-${c.country}`} value={`${c.name}, ${c.country}`}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Manual coordinates</h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="Latitude"
              className="ui-input"
            />
            <input
              type="number"
              step="any"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="Longitude"
              className="ui-input"
            />
          </div>
          <button
            type="button"
            className="ui-secondary-btn w-full mt-2"
            onClick={() => {
              setManualError(null)
              const lat = Number(manualLat)
              const lng = Number(manualLng)
              const valid =
                Number.isFinite(lat) &&
                Number.isFinite(lng) &&
                lat >= -90 &&
                lat <= 90 &&
                lng >= -180 &&
                lng <= 180
              if (!valid) {
                setManualError('Please enter valid latitude/longitude values.')
                return
              }
              updateSettings({ coordinates: { lat, lng } })
            }}
          >
            Save coordinates
          </button>
          {manualError && <p className="text-sm text-amber-600 dark:text-amber-300 mt-2">{manualError}</p>}
          <p className="text-xs text-[var(--muted)] mt-2">
            You can get exact coordinates from Maps and paste them here.
          </p>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Prayer time method</h2>
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

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Ramadan</h2>
          <label className="block">
            <span className="block text-xs text-[var(--muted)] mb-1">Start date (for daily dua)</span>
            <input
              type="date"
              value={settings.ramadanStartDate ?? ''}
              onChange={(e) =>
                updateSettings({ ramadanStartDate: e.target.value || undefined })
              }
              className="ui-input"
            />
          </label>
          <p className="text-xs text-[var(--muted)] mt-2">
            Set the first day of Ramadan to show today&apos;s dua in Adhkar.
          </p>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Quran calculator defaults</h2>
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="block text-xs text-[var(--muted)] mb-1">Target</span>
              <select
                value={settings.targetQuran ?? 1}
                onChange={(e) =>
                  updateSettings({ targetQuran: Number(e.target.value) as 1 | 2 })
                }
                className="ui-input"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </label>
            <label>
              <span className="block text-xs text-[var(--muted)] mb-1">Days</span>
              <select
                value={settings.ramadanDays ?? 30}
                onChange={(e) =>
                  updateSettings({ ramadanDays: Number(e.target.value) as 29 | 30 })
                }
                className="ui-input"
              >
                <option value={29}>29</option>
                <option value={30}>30</option>
              </select>
            </label>
          </div>
        </section>

        <section className="ui-card">
          <h2 className="ui-section-title mb-3">Theme</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateSettings({ theme: t })}
                className={`ui-chip capitalize ${(settings.theme ?? 'system') === t ? 'ui-chip-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
