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

## Push Reminder Backend (Cloudflare Worker)

Daily background reminders are now supported with Web Push.

1. Create KV namespace:
```bash
npx wrangler kv namespace create REMINDER_SUBSCRIPTIONS
```
Copy the returned namespace id into `wrangler.jsonc` at `kv_namespaces[0].id`.

2. Set Worker secrets:
```bash
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
npx wrangler secret put PUSH_SUBJECT
```
Use `mailto:you@example.com` for `PUSH_SUBJECT`.

3. Configure frontend env:
```bash
cp .env.example .env.local
```
Set:
- `VITE_PUSH_BACKEND_URL` to your Worker URL (for example `https://ramadan-tracker.<subdomain>.workers.dev`)
- `VITE_VAPID_PUBLIC_KEY` to the same public VAPID key

4. Build and deploy:
```bash
npm run build
npx wrangler deploy
```
