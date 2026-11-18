import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "./context/AppContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartStay | Stay Smart. Travel Safe. Global Travel Platform",
  description: "Curated stays, local experiences, verified cabs & airport luggage concierge across India and top worldwide destinations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#222222] selection:bg-rose-100 selection:text-rose-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
