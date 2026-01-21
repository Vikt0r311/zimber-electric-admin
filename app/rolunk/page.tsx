'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FileCheck, Shield, Clock, Lightbulb, CheckCircle, Phone } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: FileCheck,
      title: 'Transzparencia',
      description: 'Ingyenes felmérés, pontos árajánlat előre. Amit mondok, azt tartom.',
    },
    {
      icon: Shield,
      title: 'Minőség',
      description: 'Nem elég, ha működik - tökéletesnek kell lennie! Korszerű anyagokkal, precíz munkavégzés.',
    },
    {
      icon: Clock,
      title: 'Elérhetőség',
      description: 'Villámgyors megoldások minden villamos problémára - akár hétvégén is.',
    },
  ]

  const features = [
    'Szerződéses munkavégzés',
    'Teljes körű garanciavállalás',
    'Precíz, tiszta munka',
    'Modern LED megoldások',
    'Hétvégén is elérhető',
    'Gyors reagálás',
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
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">Zimber Sándor</h1>
            <p className="text-xl text-white/80">
              Villanyszerelő E.V. | Komárom-Esztergom vármegye
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Ki vagyok?</h2>
                <div className="space-y-4 text-white/80 text-lg leading-relaxed">
                  <p>
                    Zimber Sándor vagyok, egyéni vállalkozó villanyszerelő, aki több éves
                    tapasztalattal dolgozik Komárom-Esztergom vármegye területén.
                  </p>
                  <p>
                    Szakmám nem csak munka - szenvedély. Hiszem, hogy a villanyszerelés lehet
                    modern, lehet innovatív, lehet energiahatékony. Nem elég csak megcsinálni
                    valamit - precízen, tisztán, és a legújabb technológiákkal kell dolgozni.
                  </p>
                  <p>
                    Vállalkozásom alapja a transzparencia: ingyenes felmérés, pontos árajánlat,
                    írásos szerződés, garancia. Azt adom, amit ígérek.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="text-electric-cyan flex-shrink-0" size={18} />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6"
              >
                <div className="aspect-square bg-gradient-to-br from-graphite to-midnight rounded-lg border border-electric-cyan/30 overflow-hidden">
                  <Image
                    src="/zimber.webp"
                    alt="Zimber Sándor - Villanyszerelő"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-4 text-center">
                    <Shield className="text-volt-gold mx-auto mb-2" size={32} />
                    <p className="text-white/90 text-sm font-semibold">Garancia</p>
                  </div>
                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-4 text-center">
                    <Clock className="text-electric-cyan mx-auto mb-2" size={32} />
                    <p className="text-white/90 text-sm font-semibold">Hétvége OK</p>
                  </div>
                  <div className="bg-graphite border border-electric-cyan/30 rounded-lg p-4 text-center">
                    <FileCheck className="text-volt-gold mx-auto mb-2" size={32} />
                    <p className="text-white/90 text-sm font-semibold">Szerződés</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                Működési Filozófia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-graphite border border-electric-cyan/20 rounded-lg p-8 hover:border-electric-cyan/50 transition-all duration-300"
                  >
                    <value.icon className="text-electric-cyan mb-4" size={48} />
                    <h3 className="text-white font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
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
              Beszéljünk a Projektedről
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Kíváncsi vagyok, miben segíthetek. Hívj bátran, vagy írj üzenetet!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kapcsolat"
                className="inline-flex items-center justify-center gap-2 bg-volt-gold text-midnight font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 transition-transform duration-200 hover:shadow-xl hover:shadow-volt-gold/50"
              >
                <Lightbulb size={24} />
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
