import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "LandX - Fractional Real Estate Investments",
  description: "Invest in premium real estate with fractions. Secure, transparent, and profitable.",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} font-sans antialiased bg-gradient-to-b from-slate-50 to-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
