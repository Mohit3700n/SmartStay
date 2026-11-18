# SmartStay

SmartStay is a travel-planning prototype that brings accommodation discovery, local travel tools, and trip organization into one interface. It is built with Next.js and React, and can also be packaged as a Windows desktop app using Electron.

> **Project status:** This repository is a frontend-led prototype. Property and trip data are primarily local/sample data. The presence of a booking, cab, safety, or support screen does not mean a live provider, payment, emergency-response, or customer-support service is connected.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Optional Supabase authentication](#optional-supabase-authentication)
- [Available commands](#available-commands)
- [Windows desktop app](#windows-desktop-app)
- [Project structure](#project-structure)
- [Data and prototype limitations](#data-and-prototype-limitations)
- [Troubleshooting](#troubleshooting)

## Features

### Stay discovery

- Search by destination, travel dates, guests, and rooms.
- Browse property cards and filter by category, price, guest favourite, airport pickup, or wishlist.
- Open property details to view listing information, amenities, host details, and reviews.
- Use guest, host, and admin dashboard interfaces.

### Travel tools

- Browse local experiences and cab packages.
- View airport concierge and luggage-assistance options.
- Open the AI Travel Copilot interface for itinerary and phrasebook tools.
- View airport-voucher, safety/SOS, driver-assignment, and smart check-in interfaces.

### SmartStay+ Trip Hub

- See a stay-readiness summary based on details present in a listing. This is not an independent inspection or verification.
- Track a per-stay preparation checklist and timeline.
- Save care/accessibility and arrival-essential request drafts.
- Create an issue-report draft.
- Set a trip budget, link reservations, record expenses, and see equal-share spending estimates.

### Windows desktop

- Package the production Next.js app inside an Electron Windows installer.
- Store SmartStay+ prototype data in the desktop app's local browser storage.

## Technology

- **Next.js 16** with the App Router and standalone production output
- **React 19** and **TypeScript**
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **Supabase JavaScript client** for optional authentication
- **Electron** and **electron-builder** for the Windows desktop package

## Architecture

```text
Web browser ───────────────────┐
                               ├── Next.js app (app/)
Windows SmartStay.exe          │     ├── React UI and feature components
  └── Electron main process    │     ├── AppContext shared client state
       └── starts the local ───┘     └── local/sample property and trip data
           standalone Next server

Client-side persistence:
  ├── localStorage: SmartStay+ hub data, current profile, airport voucher
  └── Optional Supabase Auth: email/password and phone OTP
```

- [`app/layout.tsx`](./app/layout.tsx) loads the global styles and wraps the app in `AppProvider`.
- [`app/page.tsx`](./app/page.tsx) composes the main views and connects navigation, search, listings, dashboards, and modals.
- [`app/context/AppContext.tsx`](./app/context/AppContext.tsx) holds shared client state, including active view, search, user profile, bookings, favourites, currency, and language.
- [`app/data/`](./app/data) contains the sample property, experience, cab, category, and nearby-essential data used by the interface.
- [`app/components/SmartStayPlus.tsx`](./app/components/SmartStayPlus.tsx) manages SmartStay+ trip tools and persists their data in browser `localStorage`, scoped to the current user or visitor.
- [`app/lib/supabase.ts`](./app/lib/supabase.ts) creates a Supabase client when configured and exposes authentication helpers.
- [`desktop-app/main.mjs`](./desktop-app/main.mjs) starts the packaged Next.js standalone server on a local loopback port and displays it in an Electron window. Electron runs with context isolation enabled and Node integration disabled in the page.

## Getting started

### Prerequisites

- Node.js **20.9 or later**
- npm (included with Node.js)
- Internet access for installing packages and loading remote images/services

### Install and run locally

From the repository root:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To create and run a production build in a browser:

```bash
npm run build
npm run start
```

The production server is available at [http://localhost:3000](http://localhost:3000).

## Optional Supabase authentication

Supabase is optional. Without project credentials, the app can still be run and explored, but live Supabase authentication is unavailable.

1. Copy the example environment file:

   ```powershell
   Copy-Item .env.local.example .env.local
   ```

2. Set the following values in `.env.local` using your Supabase project's **Project URL** and **publishable/anon key**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

3. In the Supabase dashboard, enable the authentication providers you intend to use. Phone OTP also requires a configured SMS provider or Supabase test numbers.
4. Restart the Next.js development server after changing environment variables.

Never put a Supabase service-role key or other private server secret in a `NEXT_PUBLIC_` variable. The example environment file is a template; do not commit real credentials.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the production Next.js build |
| `npm run start` | Serve the production build in a browser |
| `npm run lint` | Run ESLint |
| `npm run desktop:build` | Build Next.js and prepare the standalone desktop server files |
| `npm run desktop:run` | Build and launch the app in Electron for testing |
| `npm run desktop:win` | Build the Windows NSIS installer |

## Windows desktop app

Build the installer on a Windows machine from the repository root:

```powershell
npm ci
npm run desktop:win
```

The installer is created at:

```text
release/SmartStay-Setup-0.1.0.exe
```

The app bundles a local production Next.js server; it does not require the user to install Node.js. Online resources and any configured Supabase project still require network access. The current installer is unsigned, so Windows SmartScreen may show an unknown-publisher warning.

For a local Electron development smoke test:

```powershell
npm run desktop:run
```

This command creates a production build before opening Electron.

## Project structure

```text
app/
  components/       UI, modals, trip hub, and guest/host/admin dashboards
  context/          Shared React application state
  data/             Local/sample properties, experiences, cabs, and helpers
  lib/              Supabase client and authentication helpers
  types/            Shared TypeScript domain types
  layout.tsx        Root layout and AppProvider
  page.tsx          Main application view and feature composition
desktop-app/
  main.mjs          Electron main process and local Next.js server startup
  package.json      Electron Builder Windows installer configuration
scripts/
  prepare-desktop.mjs  Copies static assets into the standalone server output
public/             Static assets
```

## Data and prototype limitations

- Property, experience, cab, driver, and example booking information is local/sample data; it is not loaded from a production marketplace API.
- Booking and favourite updates are held in React client state and are not implemented as durable server-side reservations.
- SmartStay+ checklists, budgets, expense entries, and service/issue drafts are saved in browser `localStorage`. They are not synced to a backend or between devices.
- Saving a care, essentials, or issue draft does not contact a host, provider, or support team. There is no fulfillment SLA.
- Budget sharing is an estimate only; the app does not collect money or settle balances.
- Supabase integration currently provides optional authentication helpers. It is not a database for listings or bookings.
- Safety, check-in, voucher, driver, and AI screens should not be treated as connected emergency dispatch, live tracking, verified service, or guaranteed AI/backend functionality.
- The stay-readiness score checks which listing details are present; it does not validate whether those details are accurate.

## Troubleshooting

- **Supabase sign-in is unavailable:** check the URL and publishable/anon key in `.env.local`, confirm the provider is enabled, and restart the app.
- **The installer build fails before Electron Builder starts:** verify Node.js is version 20.9 or later and run `npm ci` from the repository root.
- **The desktop installer triggers SmartScreen:** the installer is not code-signed. Only install it if you trust the source.
- **Images or online features do not load:** check internet access. Remote listing images are served from Unsplash.
