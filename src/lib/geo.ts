import { getSettings, setSettings } from './storage'

export interface GeoResult {
  lat: number
  lng: number
}

export function getCachedCoordinates(): GeoResult | null {
  const s = getSettings()
  if (s.coordinates) return s.coordinates
  return null
}

export function setCachedCoordinates(lat: number, lng: number): void {
  const s = getSettings()
  setSettings({ ...s, coordinates: { lat, lng } })
}

export function requestLocation(): Promise<GeoResult> {
  if (!window.isSecureContext) {
    return Promise.reject(new Error('Location requires HTTPS (or localhost).'))
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      setCachedCoordinates(lat, lng)
      resolve({ lat, lng })
    }

    const onError = (err: GeolocationPositionError) => {
      // Retry once with less strict accuracy settings, which is often more reliable indoors.
      if (err.code === err.TIMEOUT) {
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          (fallbackErr) => reject(fallbackErr),
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
        )
        return
      }
      reject(err)
    }

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  })
}
