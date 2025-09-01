import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AlertProvider } from "@/components/alerts/alert-system"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pedia Dose",
  description: "a pediatric dosage calculation"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AlertProvider>{children}</AlertProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
