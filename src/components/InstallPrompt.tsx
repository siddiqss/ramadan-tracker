import { useState, useEffect } from 'react'

type InstallOutcome = 'accepted' | 'dismissed'
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: InstallOutcome }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) setDismissed(true)
  }, [])

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setDismissed(true)
    setDeferred(null)
  }

  if (!deferred || dismissed) return null

  return (
    <div
      className="fixed left-4 right-4 max-w-xl mx-auto z-10 ui-card !p-3 sm:!p-3.5 flex items-center justify-between gap-3"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <span className="text-sm font-medium text-[var(--text)]">Install for instant offline access</span>
      <div className="flex gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ui-secondary-btn !py-1.5 !px-3"
        >
          Later
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="ui-primary-btn !py-1.5 !px-3"
        >
          Install
        </button>
      </div>
    </div>
  )
}
