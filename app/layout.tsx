import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const font = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LovAgent AI",
  description: "AI-powered chat support for online dating",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>{children}</body>
    </html>
  )
}
