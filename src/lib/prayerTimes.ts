import {
  Coordinates,
  PrayerTimes,
  CalculationMethod,
  Madhab,
} from 'adhan'
import { getPrayerCache, setPrayerCache, type PrayerTimesCache } from './storage'

type Params = ReturnType<typeof CalculationMethod.MuslimWorldLeague>
const METHOD_MAP: Record<string, () => Params> = {
  MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
  MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
  Egyptian: () => CalculationMethod.Egyptian(),
  Karachi: () => CalculationMethod.Karachi(),
  UmmAlQura: () => CalculationMethod.UmmAlQura(),
  Dubai: () => CalculationMethod.Dubai(),
  Qatar: () => CalculationMethod.Qatar(),
  Kuwait: () => CalculationMethod.Kuwait(),
  Singapore: () => CalculationMethod.Singapore(),
  Turkey: () => CalculationMethod.Turkey(),
  Tehran: () => CalculationMethod.Tehran(),
  NorthAmerica: () => CalculationMethod.NorthAmerica(),
}

function getParams(methodId?: string): Params {
  const key = methodId && METHOD_MAP[methodId] ? methodId : 'MuslimWorldLeague'
  const params = METHOD_MAP[key]()
  params.madhab = Madhab.Shafi
  return params
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export interface PrayerTimeEntry {
  name: PrayerName
  label: string
  time: string
  date: Date
}

export interface PrayerTimesResult {
  suhoorEnd: string
  iftar: string
  sunrise: string
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  schedule: PrayerTimeEntry[]
}

export function computePrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  methodId?: string
): PrayerTimesResult {
  const coords = new Coordinates(lat, lng)
  const params = getParams(methodId)
  const pt = new PrayerTimes(coords, date, params)

  const schedule: PrayerTimeEntry[] = [
    { name: 'fajr', label: 'Fajr', time: formatTime(pt.fajr), date: pt.fajr },
    { name: 'sunrise', label: 'Sunrise', time: formatTime(pt.sunrise!), date: pt.sunrise! },
    { name: 'dhuhr', label: 'Dhuhr', time: formatTime(pt.dhuhr), date: pt.dhuhr },
    { name: 'asr', label: 'Asr', time: formatTime(pt.asr), date: pt.asr },
    { name: 'maghrib', label: 'Maghrib', time: formatTime(pt.maghrib), date: pt.maghrib },
    { name: 'isha', label: 'Isha', time: formatTime(pt.isha), date: pt.isha },
  ]

  return {
    suhoorEnd: formatTime(pt.fajr),
    iftar: formatTime(pt.maghrib),
    sunrise: formatTime(pt.sunrise!),
    fajr: formatTime(pt.fajr),
    dhuhr: formatTime(pt.dhuhr),
    asr: formatTime(pt.asr),
    maghrib: formatTime(pt.maghrib),
    isha: formatTime(pt.isha),
    schedule,
  }
}

export function getNextPrayer(schedule: PrayerTimeEntry[]): { current: PrayerTimeEntry | null; next: PrayerTimeEntry | null } {
  const now = new Date()
  for (let i = 0; i < schedule.length; i++) {
    if (now < schedule[i].date) {
      return {
        current: i > 0 ? schedule[i - 1] : null,
        next: schedule[i],
      }
    }
  }
  // All prayers have passed for today
  return { current: schedule[schedule.length - 1], next: null }
}

export async function getPrayerTimesForDate(
  date: Date,
  lat: number,
  lng: number,
  methodId?: string
): Promise<PrayerTimesResult> {
  const dateKey = date.toISOString().slice(0, 10)
  const normalizedMethod = methodId ?? 'MuslimWorldLeague'
  const cached = await getPrayerCache(dateKey)
  if (
    cached &&
    cached.lat === lat &&
    cached.lng === lng &&
    cached.dhuhr &&
    (cached.methodId ?? 'MuslimWorldLeague') === normalizedMethod
  ) {
    const schedule: PrayerTimeEntry[] = [
      { name: 'fajr', label: 'Fajr', time: cached.fajr, date: new Date(cached.fajrDate!) },
      { name: 'sunrise', label: 'Sunrise', time: cached.sunrise, date: new Date(cached.sunriseDate!) },
      { name: 'dhuhr', label: 'Dhuhr', time: cached.dhuhr, date: new Date(cached.dhuhrDate!) },
      { name: 'asr', label: 'Asr', time: cached.asr!, date: new Date(cached.asrDate!) },
      { name: 'maghrib', label: 'Maghrib', time: cached.maghrib, date: new Date(cached.maghribDate!) },
      { name: 'isha', label: 'Isha', time: cached.isha!, date: new Date(cached.ishaDate!) },
    ]
    return {
      suhoorEnd: cached.fajr,
      iftar: cached.maghrib,
      sunrise: cached.sunrise,
      fajr: cached.fajr,
      dhuhr: cached.dhuhr,
      asr: cached.asr!,
      maghrib: cached.maghrib,
      isha: cached.isha!,
      schedule,
    }
  }
  const result = computePrayerTimes(lat, lng, date, methodId)
  const cache: PrayerTimesCache = {
    date: dateKey,
    lat,
    lng,
    methodId: normalizedMethod,
    fajr: result.fajr,
    sunrise: result.sunrise,
    dhuhr: result.dhuhr,
    asr: result.asr,
    maghrib: result.maghrib,
    isha: result.isha,
    fajrDate: result.schedule[0].date.toISOString(),
    sunriseDate: result.schedule[1].date.toISOString(),
    dhuhrDate: result.schedule[2].date.toISOString(),
    asrDate: result.schedule[3].date.toISOString(),
    maghribDate: result.schedule[4].date.toISOString(),
    ishaDate: result.schedule[5].date.toISOString(),
  }
  await setPrayerCache(cache)
  return result
}
