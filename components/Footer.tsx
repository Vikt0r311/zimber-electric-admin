import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-graphite border-t border-electric-cyan/20 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center bg-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 mb-4">
              <Image
                src="/logo.png"
                alt="Zimber Electric"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              Professzionális villanyszerelő szolgáltatás Komárom-Esztergom vármegyében.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Szolgáltatások</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/szolgaltatasok" className="text-white/70 hover:text-electric-cyan transition">
                  Hálózat Kiépítés
                </Link>
              </li>
              <li>
                <Link href="/szolgaltatasok" className="text-white/70 hover:text-electric-cyan transition">
                  Korszerűsítés
                </Link>
              </li>
              <li>
                <Link href="/szolgaltatasok" className="text-white/70 hover:text-electric-cyan transition">
                  LED Világítás
                </Link>
              </li>
              <li>
                <Link href="/szolgaltatasok" className="text-white/70 hover:text-electric-cyan transition">
                  Hibajavítás
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Kapcsolat</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/70">
                <Phone size={16} className="text-electric-cyan flex-shrink-0" />
                <a href="tel:+36307093948" className="hover:text-electric-cyan transition">
                  06-30/709-3948
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail size={16} className="text-volt-gold flex-shrink-0" />
                <a href="mailto:zimber.electric@gmail.com" className="hover:text-electric-cyan transition break-all">
                  zimber.electric@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <MapPin size={16} className="text-electric-cyan flex-shrink-0" />
                <span>Komárom-Esztergom vm.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2026 Zimber Electric. Minden jog fenntartva.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/zimberelectric"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-electric-cyan transition"
              aria-label="Facebook oldal"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
