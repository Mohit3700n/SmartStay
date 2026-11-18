This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## SmartStay+ prototype

The SmartStay+ navigation opens a trip hub with listing-detail readiness, a per-stay checklist, care/accessibility request drafts, arrival essentials lists, a trip budget tracker, and issue-report drafts. The budget tracks linked reservations plus manually entered expenses, with an equal-share estimate. Readiness is calculated from information already present in a listing; it is not an independent inspection.

Trip checklist progress, budget settings, expense entries and request drafts are stored in browser `localStorage`, scoped to the signed-in user (or the visitor session). These tools are a front-end prototype: saving a request does not contact a provider or support team, place an order, charge a payment method, or provide an SLA. Real fulfillment requires authenticated backend storage and integrations with verified local partners.

## Windows desktop app

The Electron desktop wrapper runs the production Next.js standalone server locally. Build a Windows installer with:

```bash
npm install
npm run desktop:win
```

The installer is written to `release/SmartStay-Setup-0.1.0.exe`. To run the desktop app from the current checkout for testing, use `npm run desktop:run`. The app needs internet access for online services; SmartStay+ prototype data remains in the desktop app's local browser storage.

The installer is not code-signed, so Windows may show an unknown-publisher or SmartScreen warning.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
