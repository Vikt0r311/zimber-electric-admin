import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zimber Electric | Villanyszerelés Komárom-Esztergom',
  description: 'Professzionális villanyszerelő szolgáltatás Tatabánya, Komárom, Tata, Oroszlány területén. Ingyenes felmérés, garancia, hétvégén is. LED világítás, teljes hálózat kiépítés.',
  keywords: 'villanyszerelő, villanyszerelés, Tatabánya, Komárom, Tata, Oroszlány, LED világítás, villamos hálózat, elosztó csere',
  openGraph: {
    title: 'Zimber Electric | Modern Villanyszerelés',
    description: 'Ingyenes felmérés · Garancia · Hétvégén is elérhetőek',
    type: 'website',
    locale: 'hu_HU',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} bg-midnight text-white antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
