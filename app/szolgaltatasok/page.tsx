'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, RefreshCw, Cpu, Lightbulb, Zap, Wrench, CheckCircle, Phone } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: 'Teljes Villamos Hálózat Kiépítése',
      description: 'Családi házak és panel lakások új villamos hálózatának professzionális kiépítése. Modern, biztonságos, szabványos.',
      features: [
        'Ingyenes helyszíni felmérés',
        'Komplett tervezés',
        'Korszerű anyagok',
        'Műszaki átadás',
      ],
    },
    {
      icon: RefreshCw,
      title: 'Régi Hálózat Korszerűsítése & Javítása',
      description: 'Elavult rendszerek modernizálása, hibajavítás, kapacitásbővítés.',
      features: [
        'Állapotfelmérés',
        'Szakszerű javítás',
        'Garancia',
      ],
    },
    {
      icon: Cpu,
      title: 'Elosztók & Biztosítéktáblák',
      description: 'Elosztók cseréje, korszerűsítése, új biztosítéktáblák telepítése.',
      features: [
        'Modern védőeszközök',
        'Fi-relé beépítés',
        'Átlátható kiosztás',
      ],
    },
    {
      icon: Lightbulb,
      title: 'LED Világítás & Szalagok',
      description: 'Modern LED fényforrások, dekoratív szalagok, energiahatékony megoldások.',
      features: [
        'Energiatakarékos',
        'Hangulati világítás',
        'Precíz kivitelezés',
      ],
    },
    {
      icon: Zap,
      title: 'Elektromos Berendezések Bekötések',
      description: 'Villanytűzhely, sütő, főzőlap, bojler, vízmelegítő szakszerű bekötése.',
      features: [
        'Biztonságos bekötés',
        'Megfelelő keresztmetszet',
        'Szakszerű tesztelés',
        'Garancia jegy érvényesítése',
      ],
    },
    {
      icon: Wrench,
      title: 'Kisebb Javítások & Vészhelyzet',
      description: 'Lámpák, kapcsolók, dugaljak cseréje. Hétvégén is gyors reagálás.',
      features: [
        'Hétvégén is',
        'Gyors megoldás',
      ],
    },
  ]

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
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Teljes Körű Villanyszerelés
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Családi házaktól panel lakásokig
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-8 hover:border-electric-cyan/60 transition-all duration-300">
                    <service.icon className="text-electric-cyan mb-6" size={56} />
                    <h2 className="text-3xl font-bold text-white mb-4">{service.title}</h2>
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="text-volt-gold flex-shrink-0" size={20} />
                          <span className="text-white/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/kapcsolat"
                        className="inline-flex items-center gap-2 text-electric-cyan hover:underline font-semibold"
                      >
                        Ajánlatot kérek
                        <Phone size={18} />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-electric-cyan/20 to-volt-gold/20 flex items-center justify-center">
                    <service.icon className="text-electric-cyan" size={80} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-graphite/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-graphite to-midnight border border-electric-cyan/30 rounded-xl p-8 lg:p-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
                Árak & Transzparencia
              </h2>
              <div className="space-y-4 text-white/80 text-lg leading-relaxed">
                <p>
                  Minden munkát előre megbeszélt, rögzített áron vállalunk.
                  Teljes hálózat esetén ingyenes felmérés után pontos árajánlat.
                </p>

                <div className="mt-6 p-6 bg-electric-cyan/10 border-l-4 border-electric-cyan rounded">
                  <p className="text-white font-semibold text-xl">
                    Nincsenek rejtett költségek. Amit mondunk, azt tartjuk.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-graphite to-electric-cyan/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Kérj Személyre Szabott Ajánlatot
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Mondd el, miben segíthetek, és készítek neked pontos árajánlatot!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kapcsolat"
                className="inline-flex items-center justify-center gap-2 bg-volt-gold text-midnight font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 transition-transform duration-200 hover:shadow-xl hover:shadow-volt-gold/50"
              >
                <Phone size={24} />
                Kapcsolatfelvétel
              </Link>
              <a
                href="tel:+36307093948"
                className="inline-flex items-center justify-center gap-2 bg-electric-cyan text-midnight font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 transition-transform duration-200"
              >
                <Phone size={24} />
                06-30/709-3948
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
