interface Env {
  REMINDER_SUBSCRIPTIONS: KVNamespace
  ASSETS: Fetcher
  VAPID_PUBLIC_KEY: string
  VAPID_PRIVATE_KEY: string
  PUSH_SUBJECT?: string
}

type StoredSubscription = {
  endpoint: string
  expirationTime?: number | null
  keys?: { p256dh?: string; auth?: string }
  reminderTime: string
  timezone: string
  ramadanStartDate: string | null
  ramadanDays: 29 | 30
  enabled: boolean
  lastSentDate?: string
}

type SubscribeBody = {
  subscription: {
    endpoint: string
    expirationTime?: number | null
    keys?: { p256dh?: string; auth?: string }
  }
  reminderTime?: string
  timezone?: string
  ramadanStartDate?: string | null
  ramadanDays?: 29 | 30
  enabled?: boolean
}

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/push/subscribe' && request.method === 'POST') {
      return withCors(request, await handleSubscribe(request, env))
    }
    if (url.pathname === '/api/push/unsubscribe' && request.method === 'POST') {
      return withCors(request, await handleUnsubscribe(request, env))
    }
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return withCors(request, new Response(null, { status: 204 }))
    }
    return env.ASSETS.fetch(request)
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    await sendDueReminders(env)
  },
}

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  let body: SubscribeBody
  try {
    body = (await request.json()) as SubscribeBody
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const endpoint = body.subscription?.endpoint
  if (!endpoint) return json({ error: 'Missing subscription endpoint.' }, 400)

  const reminderTime = normalizeTime(body.reminderTime ?? '20:00')
  const timezone = typeof body.timezone === 'string' && body.timezone ? body.timezone : 'UTC'
  const ramadanDays = body.ramadanDays === 29 ? 29 : 30

  const record: StoredSubscription = {
    endpoint,
    expirationTime: body.subscription.expirationTime ?? null,
    keys: body.subscription.keys ?? {},
    reminderTime,
    timezone,
    ramadanStartDate: body.ramadanStartDate ?? null,
    ramadanDays,
    enabled: body.enabled !== false,
  }
  const key = subscriptionKey(endpoint)
  await env.REMINDER_SUBSCRIPTIONS.put(key, JSON.stringify(record))
  return json({ ok: true })
}

async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  let body: { endpoint?: string }
  try {
    body = (await request.json()) as { endpoint?: string }
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }
  if (!body.endpoint) return json({ error: 'Missing endpoint.' }, 400)
  await env.REMINDER_SUBSCRIPTIONS.delete(subscriptionKey(body.endpoint))
  return json({ ok: true })
}

function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get('origin') || '*'
  const headers = new Headers(response.headers)
  headers.set('access-control-allow-origin', origin)
  headers.set('access-control-allow-methods', 'POST, OPTIONS')
  headers.set('access-control-allow-headers', 'content-type')
  return new Response(response.body, { status: response.status, headers })
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS })
}

function subscriptionKey(endpoint: string): string {
  return `sub:${endpoint}`
}

function normalizeTime(value: string): string {
  const [h, m] = value.split(':').map((v) => Number(v))
  const hour = Number.isInteger(h) && h >= 0 && h <= 23 ? h : 20
  const minute = Number.isInteger(m) && m >= 0 && m <= 59 ? m : 0
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function todayInTimezone(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(now)
}

function hhmmInTimezone(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  return formatter.format(now)
}

function ramadanDay(startDate: string | null, todayYmd: string, days: 29 | 30): number | null {
  if (!startDate) return null
  const start = new Date(`${startDate}T12:00:00Z`)
  const today = new Date(`${todayYmd}T12:00:00Z`)
  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1
  return diff >= 1 && diff <= days ? diff : null
}

async function sendDueReminders(env: Env): Promise<void> {
  let cursor: string | undefined
  do {
    const list = await env.REMINDER_SUBSCRIPTIONS.list({ cursor, limit: 1000 })
    cursor = list.list_complete ? undefined : list.cursor
    await Promise.all(list.keys.map((k) => handleDueSubscription(env, k.name)))
  } while (cursor)
}

async function handleDueSubscription(env: Env, key: string): Promise<void> {
  const raw = await env.REMINDER_SUBSCRIPTIONS.get(key)
  if (!raw) return
  let sub: StoredSubscription
  try {
    sub = JSON.parse(raw) as StoredSubscription
  } catch {
    await env.REMINDER_SUBSCRIPTIONS.delete(key)
    return
  }
  if (!sub.enabled) return

  const today = todayInTimezone(sub.timezone)
  if (sub.lastSentDate === today) return
  if (hhmmInTimezone(sub.timezone) !== normalizeTime(sub.reminderTime)) return
  if (!ramadanDay(sub.ramadanStartDate, today, sub.ramadanDays)) return

  const sent = await sendWebPush(sub.endpoint, env)
  if (!sent.ok) {
    if (sent.status === 404 || sent.status === 410) {
      await env.REMINDER_SUBSCRIPTIONS.delete(key)
    }
    return
  }

  sub.lastSentDate = today
  await env.REMINDER_SUBSCRIPTIONS.put(key, JSON.stringify(sub))
}

async function sendWebPush(endpoint: string, env: Env): Promise<{ ok: boolean; status: number }> {
  const aud = new URL(endpoint).origin
  const nowSec = Math.floor(Date.now() / 1000)
  const jwt = await createVapidJwt(
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
    aud,
    nowSec + 12 * 60 * 60,
    env.PUSH_SUBJECT || 'mailto:admin@example.com'
  )

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      TTL: '300',
      Urgency: 'normal',
      Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
    },
  })
  return { ok: res.ok, status: res.status }
}

async function createVapidJwt(
  publicKeyB64Url: string,
  privateKeyB64Url: string,
  aud: string,
  exp: number,
  sub: string
): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' }
  const payload = { aud, exp, sub }

  const encodedHeader = b64UrlEncode(JSON.stringify(header))
  const encodedPayload = b64UrlEncode(JSON.stringify(payload))
  const input = `${encodedHeader}.${encodedPayload}`

  const privateKey = await importVapidPrivateKey(publicKeyB64Url, privateKeyB64Url)
  const derSig = new Uint8Array(
    await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      new TextEncoder().encode(input)
    )
  )
  const joseSig = derToJose(derSig, 32)
  return `${input}.${b64UrlEncodeBytes(joseSig)}`
}

async function importVapidPrivateKey(publicKeyB64Url: string, privateKeyB64Url: string): Promise<CryptoKey> {
  const pub = b64UrlDecode(publicKeyB64Url)
  const d = b64UrlDecode(privateKeyB64Url)
  if (pub.length !== 65 || pub[0] !== 4 || d.length !== 32) {
    throw new Error('Invalid VAPID key format.')
  }
  const x = pub.slice(1, 33)
  const y = pub.slice(33, 65)
  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: 'P-256',
    x: b64UrlEncodeBytes(x),
    y: b64UrlEncodeBytes(y),
    d: b64UrlEncodeBytes(d),
    ext: true,
    key_ops: ['sign'],
  }
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  )
}

function b64UrlEncode(value: string): string {
  return b64UrlEncodeBytes(new TextEncoder().encode(value))
}

function b64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const decoded = atob(padded)
  const out = new Uint8Array(decoded.length)
  for (let i = 0; i < decoded.length; i += 1) out[i] = decoded.charCodeAt(i)
  return out
}

function derToJose(der: Uint8Array, partLen: number): Uint8Array {
  if (der[0] !== 0x30) throw new Error('Invalid DER signature.')
  let offset = 2
  if (der[1] > 0x80) offset += der[1] - 0x80
  if (der[offset] !== 0x02) throw new Error('Invalid DER signature (r).')
  const rLen = der[offset + 1]
  const r = der.slice(offset + 2, offset + 2 + rLen)
  offset = offset + 2 + rLen
  if (der[offset] !== 0x02) throw new Error('Invalid DER signature (s).')
  const sLen = der[offset + 1]
  const s = der.slice(offset + 2, offset + 2 + sLen)
  return new Uint8Array([...toFixed(r, partLen), ...toFixed(s, partLen)])
}

function toFixed(bytes: Uint8Array, len: number): Uint8Array {
  let out = bytes
  while (out.length > len && out[0] === 0) out = out.slice(1)
  if (out.length === len) return out
  if (out.length > len) throw new Error('Invalid signature length.')
  const padded = new Uint8Array(len)
  padded.set(out, len - out.length)
  return padded
}
