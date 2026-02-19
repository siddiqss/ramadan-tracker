interface SetupRequiredCardProps {
  missingItems: string[]
  onQuickSetup: () => void
  onOpenSettings: () => void
}

export function SetupRequiredCard({ missingItems, onQuickSetup, onOpenSettings }: SetupRequiredCardProps) {
  if (missingItems.length === 0) return null

  return (
    <section className="ui-card border-amber-300/50 dark:border-amber-800/60">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="ui-section-title">Setup required</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
          {missingItems.length} left
        </span>
      </div>
      <p className="text-sm text-[var(--text)] mb-3">
        Finish these once so prayer times and Ramadan tracking stay accurate.
      </p>
      <ul className="space-y-1 mb-4">
        {missingItems.map((item) => (
          <li key={item} className="text-sm text-[var(--muted)]">
            • {item}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onQuickSetup} className="ui-primary-btn">
          Quick setup
        </button>
        <button type="button" onClick={onOpenSettings} className="ui-secondary-btn">
          Open settings
        </button>
      </div>
    </section>
  )
}
