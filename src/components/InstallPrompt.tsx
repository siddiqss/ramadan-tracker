import { useState, useEffect } from 'react'

type InstallOutcome = 'accepted' | 'dismissed'
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: InstallOutcome }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

function isStandaloneMode(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as NavigatorWithStandalone).standalone)
}

function getInstallHint() {
  const ua = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua)
  const isAndroid = /android/.test(ua)
  const isChromeLike = /chrome|chromium|edg|opr/.test(ua)

  if (isIOS && isSafari) {
    return 'Safari: tap Share, then "Add to Home Screen".'
  }
  if (isIOS) {
    return 'On iOS, open this app in Safari to add it to Home Screen.'
  }
  if (isAndroid && isChromeLike) {
    return 'If no install button appears, use browser menu and tap "Add to Home screen".'
  }
  return 'Use your browser menu to install or add this app to your home screen.'
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true)
      setDismissed(true)
    }
    const onInstalled = () => {
      setIsInstalled(true)
      setDismissed(true)
    }
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setDismissed(true)
    setDeferred(null)
  }

  function handleManualInstall() {
    window.alert(getInstallHint())
  }

  if (dismissed || isInstalled) return null

  return (
    <div
      className="fixed left-4 right-4 max-w-xl mx-auto z-10 ui-card !p-3 sm:!p-3.5 flex items-center justify-between gap-3"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text)]">Add to Home Screen for fast access</p>
        <p className="text-xs text-[var(--muted)] mt-1">{getInstallHint()}</p>
      </div>
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
          onClick={deferred ? handleInstall : handleManualInstall}
          className="ui-primary-btn !py-1.5 !px-3"
        >
          {deferred ? 'Install' : 'Add'}
        </button>
      </div>
    </div>
  )
}
