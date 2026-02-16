# Ramadan Tracker

A privacy-first, mobile-first PWA for Ramadan: Daily 5 checklist, Quran completion calculator, and local Suhoor/Iftar times. No signup, no ads, works offline.

## Features

- **Daily 5** – Prayers (5), Quran, Dhikr, Charity, Sunnah. One-tap toggle, stored locally.
- **Quran goal** – Set 1x or 2x completion and Ramadan length (29/30 days); get pages per day and per prayer.
- **Suhoor & Iftar** – Uses your location (or a chosen city) and the adhan library; no backend. Times cached for offline.
- **Offline** – PWA with Workbox; app shell and assets work without network.
- **Share** – Share the app or your daily progress (e.g. “I’ve completed 4/5 today”).

## Run

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). For install prompt and offline, use a production build:

```bash
npm run build
npm run preview
```

## Stack

- Vite, React, TypeScript
- Tailwind CSS
- vite-plugin-pwa (Workbox)
- adhan (prayer times)
- idb (IndexedDB)

## Privacy

- No account, no server. All data stays in the browser (localStorage + IndexedDB).
- Location is used only to compute prayer times; it is not sent anywhere.
