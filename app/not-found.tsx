'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Wrench, Image as ImageIcon, Phone, Zap } from 'lucide-react'

export default function NotFound() {
  const navCards = [
    { icon: Home, label: 'Főoldal', href: '/' },
    { icon: Wrench, label: 'Szolgáltatások', href: '/szolgaltatasok' },
    { icon: ImageIcon, label: 'Galéria', href: '/galeria' },
    { icon: Phone, label: 'Kapcsolat', href: '/kapcsolat' },
  ]

  return (
    <div className="bg-midnight min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <h1
                className="text-9xl font-bold text-electric-cyan mb-4"
                style={{
                  textShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
                }}
              >
                404
              </h1>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Zap className="text-volt-gold opacity-30" size={120} />
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Áramszünet a kódban!
          </h2>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Ez az oldal nem található, de ne aggódj - a villanyszerelő problémákat én megoldom!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {navCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={card.href}
                  className="block bg-graphite border border-electric-cyan/30 rounded-lg p-6 hover:border-electric-cyan hover:bg-graphite/80 transition-all group"
                >
                  <card.icon
                    className="text-electric-cyan mx-auto mb-3 group-hover:scale-110 transition-transform"
                    size={32}
                  />
                  <span className="text-white font-medium">{card.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-volt-gold text-midnight font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 transition-transform duration-200 hover:shadow-xl hover:shadow-volt-gold/50"
            >
              <Home size={24} />
              Vissza a Főoldalra
            </Link>
          </motion.div>

          <p className="text-white/60 mt-12 text-sm italic">
            Ha villanyszerelőt keresel, jó helyen jársz.
            <br />
            Ha ezt az oldalt keresed... hát, bocsi.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
