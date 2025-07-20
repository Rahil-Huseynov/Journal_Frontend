import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scientific Journals - Scientific Research Platform",
  description: "Share your scientific articles and connect with the academic community",
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
