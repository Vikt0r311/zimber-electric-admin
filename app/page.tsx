'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Zap, ArrowRight, MapPin, FileCheck, Lightbulb, Clock, CircleCheck as CheckCircle, Chrome as Home, Shield, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: 'Ingyenes Helyszíni Felmérés',
      description: 'Teljes villamos hálózat esetén 0 Ft. Átlátható árajánlat, rejtett költségek nélkül.',
      color: 'text-electric-cyan',
    },
    {
      icon: FileCheck,
      title: 'Szerződés & Garancia',
      description: 'Minden munkára írásos szerződés és teljes körű garanciavállalás.',
      color: 'text-volt-gold',
    },
    {
      icon: Lightbulb,
      title: 'Modern LED Technológia',
      description: 'Energiahatékony megoldások, 21. századi világítástechnika.',
      color: 'text-electric-cyan',
    },
    {
      icon: Clock,
      title: 'Hétvégén is hívható',
      description: 'Vészhelyzet nem vár. Gyors reagálás, rugalmas időpont egyeztetés.',
      color: 'text-volt-gold',
    },
  ]

  const services = [
    { title: 'Teljes Vilamos Hálózat Kiépítés', icon: Home },
    { title: 'Korszerűsítés & Javítás', icon: Zap },
    { title: 'Elosztók & Biztosítéktáblák', icon: Shield },
    { title: 'LED Világítás & Szalagok', icon: Lightbulb },
    { title: 'Elektromos Berendezések Bekötése', icon: Zap },
    { title: 'Hibajavítás & Vészhelyzet', icon: CheckCircle },
  ]

  const testimonials = [
    {
      text: 'Precíz, gyors, tiszta munka. A LED szalag beépítés tökéletes lett, és még energiát is spórolunk. Köszönjük!',
      author: 'Kovács Anna',
      location: 'Tatabánya',
    },
    {
      text: 'Végre egy villanyszerelő, aki érthetően kommunikál és betartja a határidőt. Hétvégén is kijött, amikor lekapcsolt az áram. Profi!',
      author: 'Nagy Péter',
      location: 'Komárom',
    },
    {
      text: 'Az ingyenes felmérés hatalmas segítség volt. Minden költséget előre tudtunk, nem volt meglepetés. Ajánlom mindenkinek!',
      author: 'Szabó Eszter',
      location: 'Tata',
    },
  ]

  const locations = ['Tatabánya', 'Komárom', 'Tata', 'Oroszlány']

  return (
    <div className="bg-midnight">
      <section className="relative min-h-[600px] lg:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.webp"
            alt="Zimber Electric villanyszerelés"
            fill
            priority
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/50 to-midnight/70" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              A Villanyszerelés
              <br />
              Új Generációja
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Ingyenes felmérés · Garancia · Modern LED megoldások · Hétvégén is hívható
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/kapcsolat"
                className="group flex items-center gap-2 bg-volt-gold text-midnight font-bold px-8 py-4 rounded-lg hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-volt-gold/50"
              >
                <Zap size={20} />
                Ingyenes Ajánlatkérés
              </Link>
              <Link
                href="/szolgaltatasok"
                className="group flex items-center gap-2 bg-transparent border-2 border-electric-cyan text-electric-cyan font-semibold px-8 py-4 rounded-lg hover:bg-electric-cyan/10 transition-all duration-200"
              >
                Szolgáltatások
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-graphite/80 backdrop-blur-md border border-electric-cyan/30 rounded-lg px-4 py-3 animate-float"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-volt-gold" />
                  <span className="text-white text-sm font-medium">Ingyenes felmérés</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-graphite/80 backdrop-blur-md border border-electric-cyan/30 rounded-lg px-4 py-3 animate-float"
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-electric-cyan" />
                  <span className="text-white text-sm font-medium">Garanciával</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-graphite/80 backdrop-blur-md border border-electric-cyan/30 rounded-lg px-4 py-3 animate-float"
              >
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-electric-cyan animate-pulse" />
                  <span className="text-white text-sm font-medium">Hétvégén is hívható</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Amiért érdemes minket választanod
            </h2>
            <p className="text-white/70 text-lg">
              Amit mások ígérnek, mi tényleg teljesítünk
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-graphite border border-electric-cyan/20 rounded-lg p-8 hover:border-electric-cyan/50 transition-all duration-200 hover:-translate-y-1"
              >
                <feature.icon className={`${feature.color} mb-4`} size={48} />
                <h3 className="text-white font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-graphite/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Amit csinálunk</h2>
            <p className="text-white/70 text-lg">
              Családi házaktól panel lakásokig - teljes körű villanyszerelés
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-graphite border-t-2 border-electric-cyan rounded-lg p-6 hover:bg-graphite/80 transition-all"
              >
                <service.icon className="text-electric-cyan mb-3" size={32} />
                <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                <Link
                  href="/szolgaltatasok"
                  className="text-electric-cyan text-sm hover:underline inline-flex items-center gap-1 group"
                >
                  Részletek
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/szolgaltatasok"
              className="inline-flex items-center gap-2 bg-volt-gold text-midnight font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Összes Szolgáltatás
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto bg-graphite border border-electric-cyan/20 rounded-lg p-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Működési területünk <br /> Komárom-Esztergom vármegye
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-graphite/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Amit az ügyfeleink mondanak
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-graphite border-l-2 border-electric-cyan rounded-lg p-6"
              >
                <p className="text-white/90 italic text-lg mb-4 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="text-right">
                  <p className="text-volt-gold font-semibold">{testimonial.author}</p>
                  <p className="text-white/70 text-sm">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
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
              Készen állsz az új villamos hálózatra?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Kérj ingyenes helyszíni felmérést még ma. Hétvégén is elérhetőek vagyunk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kapcsolat"
                className="inline-flex items-center justify-center gap-2 bg-volt-gold text-midnight font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 transition-transform duration-200 hover:shadow-xl hover:shadow-volt-gold/50"
              >
                <Phone size={24} />
                Ingyenes Ajánlatkérés
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
