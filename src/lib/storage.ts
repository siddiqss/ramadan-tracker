import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'ramadan-tracker'
const DB_VERSION = 1
const STORE_PROGRESS = 'progress'
const STORE_PRAYER_CACHE = 'prayerCache'

export interface Settings {
  coordinates?: { lat: number; lng: number }
  calculationMethod?: string
  targetQuran?: 1 | 2
  ramadanDays?: 29 | 30
  ramadanStartDate?: string
  theme?: 'light' | 'dark' | 'system'
}

export interface DailyProgress {
  date: string
  prayers: number
  quran: boolean
  quranPages?: number
  dhikr: boolean
  charity: boolean
  sunnah: boolean
}

export interface PrayerTimesCache {
  date: string
  lat: number
  lng: number
  fajr: string
  sunrise: string
  maghrib: string
  dhuhr?: string
  asr?: string
  isha?: string
  fajrDate?: string
  sunriseDate?: string
  dhuhrDate?: string
  asrDate?: string
  maghribDate?: string
  ishaDate?: string
}

const SETTINGS_KEY = 'ramadan-settings'

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Settings
  } catch {
    return {}
  }
}

export function setSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function getDB(): Promise<IDBPDatabase<unknown>> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'date' })
      }
      if (!db.objectStoreNames.contains(STORE_PRAYER_CACHE)) {
        db.createObjectStore(STORE_PRAYER_CACHE, { keyPath: 'date' })
      }
    },
  })
}

export async function getProgress(date: string): Promise<DailyProgress | undefined> {
  const db = await getDB()
  return db.get(STORE_PROGRESS, date) as Promise<DailyProgress | undefined>
}

// Progress change listeners
const progressListeners = new Set<() => void>()

export function subscribeProgress(fn: () => void): () => void {
  progressListeners.add(fn)
  return () => { progressListeners.delete(fn) }
}

function notifyProgressChange(): void {
  progressListeners.forEach((fn) => fn())
}

export async function setProgress(progress: DailyProgress): Promise<void> {
  const db = await getDB()
  await db.put(STORE_PROGRESS, progress)
  notifyProgressChange()
}

export async function getAllProgress(): Promise<DailyProgress[]> {
  const db = await getDB()
  const all = (await db.getAll(STORE_PROGRESS)) as DailyProgress[]
  return all.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPrayerCache(date: string): Promise<PrayerTimesCache | undefined> {
  const db = await getDB()
  return db.get(STORE_PRAYER_CACHE, date) as Promise<PrayerTimesCache | undefined>
}

export async function setPrayerCache(cache: PrayerTimesCache): Promise<void> {
  const db = await getDB()
  await db.put(STORE_PRAYER_CACHE, cache)
}

export function getDefaultProgress(date: string): DailyProgress {
  return {
    date,
    prayers: 0,
    quran: false,
    quranPages: 0,
    dhikr: false,
    charity: false,
    sunnah: false,
  }
}

/** Returns completed goal count 0-5: Prayers (1 when all 5 done), Quran, Dhikr, Charity, Sunnah */
export function getProgressDoneCount(progress: DailyProgress): number {
  const prayerComplete = [0, 1, 2, 3, 4].every((i) => (progress.prayers & (1 << i)) !== 0) ? 1 : 0
  return (
    prayerComplete +
    (progress.quran ? 1 : 0) +
    (progress.dhikr ? 1 : 0) +
    (progress.charity ? 1 : 0) +
    (progress.sunnah ? 1 : 0)
  )
}
