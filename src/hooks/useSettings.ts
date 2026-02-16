import { useState, useCallback, useEffect } from 'react'
import { getSettings, setSettings, type Settings } from '../lib/storage'

const settingsListeners = new Set<() => void>()
function subscribeSettings(listener: () => void) {
  settingsListeners.add(listener)
  return () => {
    settingsListeners.delete(listener)
  }
}
function notifySettings() {
  settingsListeners.forEach((l) => l())
}

export function useSettings(): [Settings, (s: Partial<Settings>) => void] {
  const [settings, setState] = useState<Settings>(getSettings)
  useEffect(() => {
    const unsub = subscribeSettings(() => setState(getSettings()))
    return unsub
  }, [])
  const update = useCallback((next: Partial<Settings>) => {
    setSettings({ ...getSettings(), ...next })
    notifySettings()
  }, [])
  return [settings, update]
}
