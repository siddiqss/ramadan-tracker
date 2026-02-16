import { useState, useCallback } from 'react'
import { requestLocation, getCachedCoordinates } from '../lib/geo'

function humanizeLocationError(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const geoError = error as GeolocationPositionError
    if (geoError.code === 1) {
      return 'Location permission denied. On iPhone Safari: Settings > Privacy & Security > Location Services > Safari Websites > While Using the App, then reload this page.'
    }
    if (geoError.code === 2) {
      return 'Location unavailable. Check GPS/network and try again, or choose your city below.'
    }
    if (geoError.code === 3) {
      return 'Location request timed out. Try again near a window, or use city/manual coordinates below.'
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('HTTPS')) {
      return 'Location needs a secure connection (HTTPS). Open the app from its deployed HTTPS URL or installed PWA.'
    }
    return error.message
  }

  return 'Location unavailable'
}

export function useGeolocation(): {
  loading: boolean
  error: string | null
  coords: { lat: number; lng: number } | null
  request: () => Promise<{ lat: number; lng: number } | null>
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(getCachedCoordinates)

  const request = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await requestLocation()
      setCoords(result)
      return result
    } catch (e) {
      setError(humanizeLocationError(e))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, coords, request }
}
