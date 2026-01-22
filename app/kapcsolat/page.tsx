'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Facebook, Gift, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add form-name for Netlify Forms
    formData.append('form-name', 'kapcsolat')

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Hiba történt az üzenet küldése során. Kérlek próbáld újra, vagy hívj telefonon.')
      }
    } catch (error) {
      alert('Hiba történt az üzenet küldése során. Kérlek próbáld újra, vagy hívj telefonon.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-midnight">
      <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-midnight via-graphite to-midnight">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #00d9ff 1px, transparent 1px), linear-gradient(to bottom, #00d9ff 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Vegyük fel a kapcsolatot
            </h1>
            <p className="text-xl text-white/80">
              Ingyenes helyszíni felmérés teljes hálózat esetén
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {!submitted ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-3"
                >
                  <h2 className="text-3xl font-bold text-white mb-8">Küldd el az üzeneted</h2>

                  <form
                    name="kapcsolat"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <input type="hidden" name="form-name" value="kapcsolat" />
                    <input type="hidden" name="bot-field" />

                    <div>
                      <label htmlFor="nev" className="block text-white font-medium mb-2">
                        Név *
                      </label>
                      <input
                        type="text"
                        id="nev"
                        name="nev"
                        required
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition"
                        placeholder="Kovács János"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email cím *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition"
                        placeholder="kovacs@email.hu"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefon" className="block text-white font-medium mb-2">
                        Telefonszám *
                      </label>
                      <input
                        type="tel"
                        id="telefon"
                        name="telefon"
                        required
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition"
                        placeholder="06-30/123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="telepules" className="block text-white font-medium mb-2">
                        Település
                      </label>
                      <input
                        type="text"
                        id="telepules"
                        name="telepules"
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition"
                        placeholder="Tatabánya"
                      />
                    </div>

                    <div>
                      <label htmlFor="szolgaltatas" className="block text-white font-medium mb-2">
                        Miben segíthetek? *
                      </label>
                      <select
                        id="szolgaltatas"
                        name="szolgaltatas"
                        required
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition"
                      >
                        <option value="">Válassz...</option>
                        <option value="Teljes villamos hálózat kiépítés">Teljes villamos hálózat kiépítés</option>
                        <option value="Hálózat korszerűsítés / javítás">Hálózat korszerűsítés / javítás</option>
                        <option value="Elosztó / biztosítéktábla csere">Elosztó / biztosítéktábla csere</option>
                        <option value="LED világítás / szalag beépítés">LED világítás / szalag beépítés</option>
                        <option value="Elektromos Berendezések Bekötése(tűzhely,főzőlap, bojler, stb)">Elektromos Berendezések Bekötése(tűzhely,főzőlap, bojler, stb)</option>
                        <option value="Kisebb javítás (lámpa, kapcsoló, dugalj)">Kisebb javítás (lámpa, kapcsoló, dugalj)</option>
                        <option value="Vészhelyzet / azonnali javítás">Vészhelyzet / azonnali javítás</option>
                        <option value="Egyéb">Egyéb</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="uzenet" className="block text-white font-medium mb-2">
                        Üzenet
                      </label>
                      <textarea
                        id="uzenet"
                        name="uzenet"
                        rows={4}
                        className="w-full bg-graphite border border-electric-cyan/30 text-white px-4 py-3 rounded-lg focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/50 focus:outline-none transition resize-none"
                        placeholder="Írd le röviden, miben segíthetek..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-volt-gold text-midnight font-bold py-4 rounded-lg hover:scale-105 transition-transform hover:shadow-lg hover:shadow-volt-gold/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {submitting ? 'Küldés...' : 'Ajánlatot Kérek →'}
                    </button>
                  </form>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-2 space-y-6"
                >
                  <h2 className="text-3xl font-bold text-white mb-8">Közvetlen elérés</h2>

                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-6 hover:border-electric-cyan/50 transition">
                    <Phone className="text-electric-cyan mb-3" size={32} />
                    <h3 className="text-white font-bold text-lg mb-2">Hívj most</h3>
                    <a
                      href="tel:+36307093948"
                      className="text-volt-gold text-xl hover:underline block"
                    >
                      06-30/709-3948
                    </a>
                    <p className="text-white/70 text-sm mt-2">Hétvégén is elérhető</p>
                  </div>

                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-6 hover:border-electric-cyan/50 transition">
                    <Mail className="text-volt-gold mb-3" size={32} />
                    <h3 className="text-white font-bold text-lg mb-2">Írj emailt</h3>
                    <a
                      href="mailto:info@zimber-electric.hu"
                      className="text-electric-cyan hover:underline break-all"
                    >
                      info@zimber-electric.hu
                    </a>
                  </div>

                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-6 hover:border-electric-cyan/50 transition">
                    <Facebook className="text-electric-cyan mb-3" size={32} />
                    <h3 className="text-white font-bold text-lg mb-2">Kövess Facebookon</h3>
                    <a
                      href="https://www.facebook.com/zimberelectric"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-volt-gold hover:underline"
                    >
                      facebook.com/zimberelectric
                    </a>
                    <p className="text-white/70 text-sm mt-2">Referenciák, projektek</p>
                  </div>

                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center bg-graphite border border-electric-cyan/30 rounded-xl p-12"
              >
                <div className="mb-6">
                  <CheckCircle className="text-green-500 mx-auto animate-pulse" size={80} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Köszönöm az üzeneted!</h2>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Hamarosan felveszem veled a kapcsolatot.
                  <br />
                  Sürgős esetben hívj bátran:{' '}
                  <a href="tel:+36307093948" className="text-volt-gold hover:underline">
                    06-30/709-3948
                  </a>
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-volt-gold text-midnight font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform"
                >
                  <ArrowLeft size={20} />
                  Vissza a főoldalra
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {!submitted && (
        <section className="py-16 bg-electric-cyan/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-graphite border border-electric-cyan/30 rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <Gift className="text-electric-cyan flex-shrink-0 mt-1" size={40} />
                <div>
                  <h3 className="text-white font-bold text-2xl mb-3">Ingyenes Felmérés</h3>
                  <p className="text-white/80 leading-relaxed">
                    Teljes villamos hálózat kiépítés vagy komplett korszerűsítés esetén INGYENES
                    helyszíni felmérést vállalok! Pontos felmérés után készül az árajánlat -
                    rejtett költségek nélkül.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
