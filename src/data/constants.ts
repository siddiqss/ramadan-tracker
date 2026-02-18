export const QURAN_PAGES = 604
export const QURAN_JUZ = 30

export const DAILY_5_ITEMS = ['prayers', 'quran', 'dhikr', 'charity', 'sunnah', 'fasting'] as const
export type Daily5Key = (typeof DAILY_5_ITEMS)[number]

export const RAMADAN_DAYS_OPTIONS = [29, 30] as const
export type RamadanDays = (typeof RAMADAN_DAYS_OPTIONS)[number]

export const QURAN_TARGET_OPTIONS = [1, 2] as const
export type QuranTarget = (typeof QURAN_TARGET_OPTIONS)[number]

export const CALCULATION_METHODS = [
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { id: 'MuslimWorldLeague', label: 'Muslim World League' },
  { id: 'Egyptian', label: 'Egyptian' },
  { id: 'Karachi', label: 'Karachi' },
  { id: 'UmmAlQura', label: 'Umm Al-Qura' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'Kuwait', label: 'Kuwait' },
  { id: 'Singapore', label: 'Singapore' },
  { id: 'Turkey', label: 'Turkey' },
  { id: 'Tehran', label: 'Tehran' },
  { id: 'NorthAmerica', label: 'North America' },
] as const

export type CalculationMethodId = (typeof CALCULATION_METHODS)[number]['id']
