import { useState, useRef, useCallback } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useDailyProgress } from '../hooks/useDailyProgress'
import { useRolloverDayKey } from '../hooks/useRolloverDayKey'
import { getRamadanDay } from '../lib/ramadanDay'
import {
  dailyDuas,
  dailyTasbihat,
  duaCategories,
  ADHKAR_ATTRIBUTION,
} from '../data/ramadanAdhkar'

type Tab = 'dua' | 'tasbeeh' | 'collection'

interface AdhkarScreenProps {
  onBack: () => void
}

export function AdhkarScreen({ onBack }: AdhkarScreenProps) {
  const { progress, toggle } = useDailyProgress()
  const [activeTab, setActiveTab] = useState<Tab>('dua')
  const dhikrDone = progress.dhikr

  return (
    <div className="max-w-lg mx-auto pb-24 min-h-dvh flex flex-col">
      <header className="flex items-center gap-3 p-4 border-b border-[var(--border)] shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--surface)] text-[var(--text)]"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Adhkar</h1>
      </header>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] shrink-0">
        {([
          { id: 'dua' as Tab, label: 'Dua of Day' },
          { id: 'tasbeeh' as Tab, label: 'Tasbeeh' },
          { id: 'collection' as Tab, label: 'Dua Collection' },
        ]).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-auto p-4">
        {activeTab === 'dua' && <DuaOfDayTab />}
        {activeTab === 'tasbeeh' && <TasbeehTab />}
        {activeTab === 'collection' && <DuaCollectionTab />}

        <p className="text-xs text-[var(--muted)] mt-6">{ADHKAR_ATTRIBUTION}</p>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => toggle('dhikr')}
            className={`w-full py-3 px-4 rounded-xl font-medium ${
              dhikrDone
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)]'
            }`}
          >
            {dhikrDone ? 'Dhikr marked done' : 'Mark Dhikr done'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Tab 1: Dua of the Day ---------- */

function DuaOfDayTab() {
  const [settings] = useSettings()
  const dayKey = useRolloverDayKey()
  const [browseDay, setBrowseDay] = useState<number | null>(null)

  const ramadanDay = getRamadanDay(
    settings.ramadanStartDate,
    dayKey,
    settings.ramadanDays
  )
  const effectiveDay = browseDay ?? ramadanDay
  const dua = effectiveDay ? dailyDuas.find((d) => d.day === effectiveDay) : null

  return (
    <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
        Dua of the day
      </h2>
      {!settings.ramadanStartDate && !browseDay ? (
        <>
          <p className="text-sm text-[var(--muted)] mb-3">
            Set Ramadan start date in Settings to see today&apos;s daily dua.
          </p>
          <label className="block">
            <span className="block text-xs text-[var(--muted)] mb-1">Or browse by day</span>
            <select
              value={browseDay ?? ''}
              onChange={(e) =>
                setBrowseDay(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full py-2 px-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
            >
              <option value="">Select day (1-30)</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : (
        <>
          {ramadanDay && !browseDay && (
            <p className="text-xs text-[var(--muted)] mb-3">Day {ramadanDay} of Ramadan</p>
          )}
          {browseDay && (
            <p className="text-xs text-[var(--muted)] mb-3">
              Day {browseDay}
              {ramadanDay && (
                <button
                  type="button"
                  onClick={() => setBrowseDay(null)}
                  className="ml-2 text-[var(--accent)]"
                >
                  Show today
                </button>
              )}
            </p>
          )}
          {dua ? (
            <div className="space-y-5">
              <p className="text-xl leading-loose text-right font-medium" dir="rtl">
                {dua.arabic}
              </p>
              <p className="text-sm text-[var(--text)] leading-relaxed">{dua.english}</p>
              {dua.reference && (
                <p className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3">
                  Reference: {dua.reference}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Select a day above.</p>
          )}
        </>
      )}

      {/* Browse dropdown when ramadan date is set */}
      {settings.ramadanStartDate && (
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <select
            value={browseDay ?? ''}
            onChange={(e) =>
              setBrowseDay(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full py-2 px-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm"
          >
            <option value="">Browse other days</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  )
}

/* ---------- Tab 2: Tasbeeh (Swipeable cards + tap counter) ---------- */

const SWIPE_THRESHOLD = 50
const MILESTONE_COUNTS = [33, 66, 99, 100]

function TasbeehTab() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [counters, setCounters] = useState<number[]>(() => new Array(dailyTasbihat.length).fill(0))
  const [translateX, setTranslateX] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isDraggingRef = useRef(false)

  const currentDhikr = dailyTasbihat[currentIndex]
  const count = counters[currentIndex]

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= dailyTasbihat.length) return
    setIsTransitioning(true)
    setTranslateX(index > currentIndex ? -300 : 300)
    setTimeout(() => {
      setCurrentIndex(index)
      setTranslateX(0)
      setIsTransitioning(false)
    }, 200)
  }, [currentIndex])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    isDraggingRef.current = false
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStartRef.current) return
    const dx = e.touches[0].clientX - touchStartRef.current.x
    const dy = e.touches[0].clientY - touchStartRef.current.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isDraggingRef.current = true
      setTranslateX(dx)
    }
  }

  function handleTouchEnd() {
    if (!touchStartRef.current) return
    if (isDraggingRef.current) {
      if (translateX < -SWIPE_THRESHOLD && currentIndex < dailyTasbihat.length - 1) {
        goTo(currentIndex + 1)
      } else if (translateX > SWIPE_THRESHOLD && currentIndex > 0) {
        goTo(currentIndex - 1)
      } else {
        setTranslateX(0)
      }
    }
    touchStartRef.current = null
    isDraggingRef.current = false
  }

  function handleTap() {
    if (isDraggingRef.current) return
    const newCount = count + 1
    setCounters((prev) => {
      const next = [...prev]
      next[currentIndex] = newCount
      return next
    })
    if (MILESTONE_COUNTS.includes(newCount) && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const phrase = currentDhikr.phrases[0]

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-sm min-h-[360px] flex flex-col items-center justify-between select-none touch-pan-y"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isTransitioning ? 'transform 0.2s ease-out' : isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
      >
        {/* Part number and reference */}
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[var(--muted)]">
            Part {currentDhikr.part}
          </span>
          {currentDhikr.reference && (
            <span className="text-xs text-[var(--muted)]">{currentDhikr.reference}</span>
          )}
        </div>

        {/* Arabic text */}
        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-3">
          {phrase.title && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] text-center">
              {phrase.title}
            </p>
          )}
          <p className="text-lg leading-loose text-center font-medium" dir="rtl">
            {phrase.arabic}
          </p>
          {phrase.transliteration && (
            <p className="text-xs text-[var(--muted)] italic text-center">
              {phrase.transliteration}
            </p>
          )}
          <p className="text-xs text-[var(--text)] text-center leading-relaxed">
            {phrase.english}
          </p>
          {phrase.note && (
            <p className="text-[11px] text-[var(--muted)] text-center leading-relaxed">
              {phrase.note}
            </p>
          )}
        </div>

        {/* Counter circle */}
        <div className="mt-4 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold tabular-nums transition-colors ${
            count > 0 ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500' : 'bg-[var(--bg)] text-[var(--muted)] border-2 border-[var(--border)]'
          }`}>
            {count}
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">Tap card to count</p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {dailyTasbihat.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-emerald-500' : 'bg-[var(--border)]'
            }`}
            aria-label={`Go to dhikr ${i + 1}`}
          />
        ))}
      </div>

      <p className="text-xs text-center text-[var(--muted)]">
        Swipe left/right to browse dhikr
      </p>
    </div>
  )
}

/* ---------- Tab 3: Dua Collection (Accordion) ---------- */

function DuaCollectionTab() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {duaCategories.map((category) => {
        const isOpen = openCategory === category.id
        return (
          <div key={category.id} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : category.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-sm">{category.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted)]">{category.duas.length} duas</span>
                <svg
                  className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-[var(--border)] p-4 space-y-5">
                {category.duas.map((dua) => (
                  <div key={dua.id} className="space-y-2">
                    <p className="text-base leading-loose text-right font-medium" dir="rtl">
                      {dua.arabic}
                    </p>
                    {dua.transliteration && (
                      <p className="text-xs text-[var(--muted)] italic">
                        {dua.transliteration}
                      </p>
                    )}
                    <p className="text-sm text-[var(--text)] leading-relaxed">{dua.english}</p>
                    <p className="text-xs text-[var(--muted)]">{dua.reference}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
