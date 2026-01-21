'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Phone, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Főoldal' },
    { href: '/szolgaltatasok', label: 'Szolgáltatások' },
    { href: '/galeria', label: 'Galéria' },
    { href: '/rolunk', label: 'Rólunk' },
    { href: '/kapcsolat', label: 'Kapcsolat' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-midnight/90 backdrop-blur-xl border-b border-electric-cyan/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center group bg-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
            <Image
              src="/logo.png"
              alt="Zimber Electric"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-electric-cyan transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href="tel:+36307093948"
            className="hidden md:flex items-center gap-2 bg-volt-gold text-midnight font-bold px-6 py-2 rounded-lg hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-volt-gold/50"
          >
            <Phone size={20} />
            06-30/709-3948
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-electric-cyan transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-graphite/95 backdrop-blur-lg border-t border-electric-cyan/20">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-electric-cyan transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+36307093948"
              className="flex items-center justify-center gap-2 bg-volt-gold text-midnight font-bold px-6 py-3 rounded-lg mt-4"
            >
              <Phone size={20} />
              06-30/709-3948
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
