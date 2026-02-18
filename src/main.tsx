import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

const updateSW = registerSW({
  onNeedRefresh() {
    // Apply the new service worker and reload so installed users see new code.
    updateSW(true)
  },
  onOfflineReady() {},
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return

    setInterval(() => {
      registration.update().catch(() => {})
    }, 60 * 60 * 1000)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update().catch(() => {})
      }
    })
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
