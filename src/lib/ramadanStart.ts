export interface RamadanStartSuggestion {
  countryCode: string
  countryLabel: string
  startDate: string
}

type OffsetGroup = 'base' | 'plus1'

type CountryRule = {
  label: string
  group: OffsetGroup
}

// Coverage focuses on OIC countries + common diaspora countries.
const COUNTRY_RULES: Record<string, CountryRule> = {
  AF: { label: 'Afghanistan', group: 'plus1' },
  AL: { label: 'Albania', group: 'base' },
  AZ: { label: 'Azerbaijan', group: 'base' },
  BH: { label: 'Bahrain', group: 'base' },
  BD: { label: 'Bangladesh', group: 'plus1' },
  BJ: { label: 'Benin', group: 'base' },
  BN: { label: 'Brunei', group: 'plus1' },
  BF: { label: 'Burkina Faso', group: 'base' },
  CM: { label: 'Cameroon', group: 'base' },
  TD: { label: 'Chad', group: 'base' },
  CI: { label: "Cote d'Ivoire", group: 'base' },
  DJ: { label: 'Djibouti', group: 'base' },
  EG: { label: 'Egypt', group: 'base' },
  GA: { label: 'Gabon', group: 'base' },
  GM: { label: 'Gambia', group: 'base' },
  GN: { label: 'Guinea', group: 'base' },
  GW: { label: 'Guinea-Bissau', group: 'base' },
  ID: { label: 'Indonesia', group: 'plus1' },
  IR: { label: 'Iran', group: 'plus1' },
  IQ: { label: 'Iraq', group: 'base' },
  JO: { label: 'Jordan', group: 'base' },
  KZ: { label: 'Kazakhstan', group: 'plus1' },
  KE: { label: 'Kenya', group: 'base' },
  KW: { label: 'Kuwait', group: 'base' },
  KG: { label: 'Kyrgyzstan', group: 'plus1' },
  LB: { label: 'Lebanon', group: 'base' },
  LY: { label: 'Libya', group: 'base' },
  MY: { label: 'Malaysia', group: 'plus1' },
  MV: { label: 'Maldives', group: 'plus1' },
  ML: { label: 'Mali', group: 'base' },
  MR: { label: 'Mauritania', group: 'base' },
  MA: { label: 'Morocco', group: 'base' },
  MZ: { label: 'Mozambique', group: 'base' },
  NE: { label: 'Niger', group: 'base' },
  NG: { label: 'Nigeria', group: 'base' },
  OM: { label: 'Oman', group: 'base' },
  PK: { label: 'Pakistan', group: 'plus1' },
  PS: { label: 'Palestine', group: 'base' },
  QA: { label: 'Qatar', group: 'base' },
  SA: { label: 'Saudi Arabia', group: 'base' },
  SN: { label: 'Senegal', group: 'base' },
  SL: { label: 'Sierra Leone', group: 'base' },
  SO: { label: 'Somalia', group: 'base' },
  SD: { label: 'Sudan', group: 'base' },
  SR: { label: 'Suriname', group: 'base' },
  SY: { label: 'Syria', group: 'base' },
  TJ: { label: 'Tajikistan', group: 'plus1' },
  TG: { label: 'Togo', group: 'base' },
  TN: { label: 'Tunisia', group: 'base' },
  TR: { label: 'Turkey', group: 'base' },
  TM: { label: 'Turkmenistan', group: 'plus1' },
  AE: { label: 'United Arab Emirates', group: 'base' },
  UZ: { label: 'Uzbekistan', group: 'plus1' },
  YE: { label: 'Yemen', group: 'base' },
  XK: { label: 'Kosovo', group: 'base' },
  // common diaspora
  US: { label: 'United States', group: 'base' },
  CA: { label: 'Canada', group: 'base' },
  GB: { label: 'United Kingdom', group: 'base' },
  FR: { label: 'France', group: 'base' },
  DE: { label: 'Germany', group: 'base' },
  NL: { label: 'Netherlands', group: 'base' },
  AU: { label: 'Australia', group: 'base' },
  IN: { label: 'India', group: 'plus1' },
  SG: { label: 'Singapore', group: 'plus1' },
}

const TZ_TO_COUNTRY: Array<{ prefix: string; country: string }> = [
  { prefix: 'Asia/Karachi', country: 'PK' },
  { prefix: 'Asia/Dhaka', country: 'BD' },
  { prefix: 'Asia/Kolkata', country: 'IN' },
  { prefix: 'Asia/Kabul', country: 'AF' },
  { prefix: 'Asia/Riyadh', country: 'SA' },
  { prefix: 'Asia/Dubai', country: 'AE' },
  { prefix: 'Asia/Qatar', country: 'QA' },
  { prefix: 'Asia/Kuwait', country: 'KW' },
  { prefix: 'Asia/Bahrain', country: 'BH' },
  { prefix: 'Asia/Muscat', country: 'OM' },
  { prefix: 'Africa/Cairo', country: 'EG' },
  { prefix: 'Europe/Istanbul', country: 'TR' },
  { prefix: 'Asia/Kuala_Lumpur', country: 'MY' },
  { prefix: 'Asia/Jakarta', country: 'ID' },
  { prefix: 'Asia/Singapore', country: 'SG' },
]

function parseCountryFromLocaleTag(tag: string): string | null {
  const match = tag.match(/-([A-Z]{2})\b/i)
  return match?.[1]?.toUpperCase() ?? null
}

function detectCountryCodeFromLocale(): string | null {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale
  const resolvedCode = parseCountryFromLocaleTag(locale)
  if (resolvedCode) return resolvedCode

  const langs = navigator.languages ?? []
  for (const lang of langs) {
    const code = parseCountryFromLocaleTag(lang)
    if (code) return code
  }
  return null
}

function detectCountryCodeFromTimezone(): string | null {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!tz) return null
  const match = TZ_TO_COUNTRY.find((entry) => tz.startsWith(entry.prefix))
  return match?.country ?? null
}

function findBaseRamadanStartDate(currentYear: number): string | null {
  // Use Umm al-Qura calendar to detect Gregorian date where Islamic month/day is 9/1.
  const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  for (let month = 0; month < 12; month += 1) {
    for (let day = 1; day <= 31; day += 1) {
      const date = new Date(Date.UTC(currentYear, month, day, 12, 0, 0))
      if (date.getUTCMonth() !== month) break
      const parts = fmt.formatToParts(date)
      const islamicMonth = Number(parts.find((p) => p.type === 'month')?.value ?? '')
      const islamicDay = Number(parts.find((p) => p.type === 'day')?.value ?? '')
      if (islamicMonth === 9 && islamicDay === 1) {
        return date.toISOString().slice(0, 10)
      }
    }
  }
  return null
}

function addDays(ymd: string, days: number): string {
  const date = new Date(`${ymd}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function getRamadanStartSuggestion(now = new Date()): RamadanStartSuggestion | null {
  if (typeof window === 'undefined') return null

  // Timezone is a better default signal than locale for users living outside their device language region.
  const countryCode = detectCountryCodeFromTimezone() ?? detectCountryCodeFromLocale()
  if (!countryCode) return null
  const rule = COUNTRY_RULES[countryCode]
  if (!rule) return null

  const base = findBaseRamadanStartDate(now.getUTCFullYear())
  if (!base) return null

  const offsetDays = rule.group === 'plus1' ? 1 : 0
  return {
    countryCode,
    countryLabel: rule.label,
    startDate: addDays(base, offsetDays),
  }
}
