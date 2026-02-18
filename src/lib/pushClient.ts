import type { Settings } from './storage'

interface PushSubscriptionPayload {
  endpoint: string
  expirationTime?: number | null
  keys?: {
    p256dh?: string
    auth?: string
  }
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padLength = (4 - (base64Url.length % 4)) % 4
  const padded = (base64Url + '='.repeat(padLength)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(padded)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i)
  return out
}

function getBackendBase(): string | null {
  const value = import.meta.env.VITE_PUSH_BACKEND_URL
  return typeof value === 'string' && value.length > 0 ? value.replace(/\/+$/, '') : null
}

export function pushSupport() {
  const backend = getBackendBase()
  const vapid = import.meta.env.VITE_VAPID_PUBLIC_KEY
  const supported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    typeof backend === 'string' &&
    typeof vapid === 'string' &&
    vapid.length > 0
  return { supported, backend, vapid: typeof vapid === 'string' ? vapid : null }
}

export async function subscribeRamadanPush(settings: Settings): Promise<'subscribed' | 'permission_denied'> {
  const { supported, backend, vapid } = pushSupport()
  if (!supported || !backend || !vapid) throw new Error('Push is not configured.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return 'permission_denied'

  const registration = await navigator.serviceWorker.ready
  const existing = await registration.pushManager.getSubscription()
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToUint8Array(vapid),
    }))

  const json = subscription.toJSON() as PushSubscriptionPayload
  const payload = {
    subscription: json,
    reminderTime: settings.reminderTime ?? '20:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    ramadanStartDate: settings.ramadanStartDate ?? null,
    ramadanDays: settings.ramadanDays ?? 30,
    enabled: Boolean(settings.reminderEnabled),
  }

  const res = await fetch(`${backend}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Subscribe failed: ${res.status}`)
  return 'subscribed'
}

export async function unsubscribeRamadanPush(): Promise<void> {
  const { supported, backend } = pushSupport()
  if (!supported || !backend) return
  const registration = await navigator.serviceWorker.ready
  const existing = await registration.pushManager.getSubscription()
  if (!existing) return

  const endpoint = existing.endpoint
  await fetch(`${backend}/api/push/unsubscribe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  })
  await existing.unsubscribe()
}
