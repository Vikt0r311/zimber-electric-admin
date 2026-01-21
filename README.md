# Zimber Electric - Modern Villanyszerelő Weboldal

Egy innovatív, tech-forward villanyszerelő weboldal dark mode dizájnnal, neon accentekkel és modern animációkkal.

## Projekt Áttekintés

Ez a weboldal radikálisan megújítja a hagyományos villanyszerelő weboldalak megjelenését. Modern, sci-fi inspirált dizájnnal, dark mode native megközelítéssel és mikroanimációkkal készült.

### Főbb Jellemzők

- **Dark Mode Native Design** - Elsődleges sötét téma Electric Cyan és Volt Gold accentekkel
- **Modern Animációk** - Framer Motion powered smooth transitions és scroll animations
- **Responsive Design** - Teljesen reszponzív minden eszközön
- **SEO Optimalizált** - Structured data, meta tags, Open Graph
- **Netlify Forms** - Működő kapcsolati űrlap email notificationökkel
- **5 Teljes Oldal** - Főoldal, Szolgáltatások, Galéria, Rólunk, Kapcsolat
- **404 Oldal** - Egyedi márkaidentitású hibaoldal

## Technológiák

- **Framework:** Next.js 13.5.1 (App Router)
- **Styling:** Tailwind CSS 3.3.3
- **Animations:** Framer Motion 11+
- **Icons:** Lucide React
- **Forms:** Netlify Forms
- **Deployment:** Netlify optimalizált

## Színpaletta

- **Midnight Slate** (#1a1d29) - Fő háttér
- **Electric Cyan** (#00d9ff) - Accent, hover states
- **Volt Gold** (#ffc107) - CTA gombok, kiemelések
- **Graphite** (#2d3748) - Kártya hátterek
- **Pure White** (#ffffff) - Szöveg

## Oldalstruktúra

### 1. Főoldal (/)
- Full-screen hero section animated grid háttérrel
- Lebegő trust badges (glassmorphism)
- "Miért Zimber Electric?" feature cards
- Szolgáltatások áttekintő
- Működési terület
- Ügyfél vélemények
- Végső CTA banner

### 2. Szolgáltatások (/szolgaltatasok)
- 6 részletes szolgáltatás leírás
- Alternáló left-right layout
- Feature listák checkbox-okkal
- Árak & Transzparencia szekció
- CTA gomb minden szolgáltatásnál

### 3. Galéria (/galeria)
- Placeholder grid (6 elem)
- "Munkák folyamatban" info panel
- Facebook link referenciákhoz
- Upcoming features lista

### 4. Rólunk (/rolunk)
- Zimber Sándor bemutatkozás
- Működési filozófia (3 pillér)
- Feature lista checkmark-okkal
- Vizuális elemek ikonokkal

### 5. Kapcsolat (/kapcsolat)
- Teljes Netlify Forms integráció
- 6 mező + textarea
- Szolgáltatás típus dropdown
- Közvetlen elérhetőségek (telefon, email, Facebook)
- Működési terület lista
- "Ingyenes Felmérés" info panel
- Success state animációval

### 6. 404 Hiba Oldal
- Animált 404 szöveg glow effecttel
- Navigációs kártya grid
- "Vissza a főoldalra" CTA
- Humor és márka személyiség

## Telepítés

```bash
# Dependencies telepítése
npm install

# Development szerver
npm run dev

# Production build
npm run build

# Production szerver
npm run start
```

## Netlify Deployment

### 1. Repository Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [YOUR_REPO_URL]
git push -u origin main
```

### 2. Netlify Konfiguráció

A projekt tartalmaz `netlify.toml` fájlt az alábbi beállításokkal:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18
- Next.js plugin enabled
- 404 redirect configured

### 3. Netlify Forms Setup

A kapcsolati űrlap automatikusan detektálódik deployment során:
- Form név: "kapcsolat"
- Honeypot spam védelem: bot-field
- Email notificationök beállíthatók a Netlify Dashboard-on

**Email notification beállítása:**
1. Netlify Dashboard → Forms
2. "kapcsolat" form kiválasztása
3. Settings → Notifications
4. Email: zimber.electric@gmail.com

### 4. Custom Domain (Opcionális)

Netlify Dashboard → Domain settings → Add custom domain

DNS beállítások:
- A record: `75.2.60.5`
- CNAME: `[your-site].netlify.app`

SSL automatikusan aktiválódik (Let's Encrypt)

## Fájl Struktúra

```
project/
├── app/
│   ├── layout.tsx (Root layout + metadata)
│   ├── page.tsx (Főoldal)
│   ├── not-found.tsx (404 oldal)
│   ├── galeria/page.tsx
│   ├── kapcsolat/page.tsx
│   ├── rolunk/page.tsx
│   └── szolgaltatasok/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── StructuredData.tsx
│   └── ui/ (shadcn/ui komponensek)
├── public/
│   └── kapcsolat-form.html (Netlify Forms helper)
├── netlify.toml
├── tailwind.config.ts (Custom colors + animations)
└── package.json
```

## Fontok

- **Primary:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (Google Fonts)

Fontok automatikusan optimalizálva Next.js font optimization-nel.

## Animációk

### Használt animációk:
- **fade-in-up** - Section megjelenés scroll-nál
- **scale** - Button hover
- **float** - Trust badges
- **glow** - CTA button hover
- **pulse** - Kiemelések

### Performance:
- 60fps target
- GPU accelerated (transform + opacity only)
- Prefers-reduced-motion támogatás

## SEO

### Meta Tags
Minden oldal egyedi:
- Title (max 60 karakter)
- Description (max 160 karakter)
- Open Graph tags
- Robots directives

### Structured Data
LocalBusiness schema minden oldalon:
- @type: Electrician
- Contact info
- Service area
- Opening hours
- Offer catalog

## Accessibility

- **WCAG 2.1 AA compliant**
- Keyboard navigáció támogatott
- ARIA labels minden interactive elementen
- Color contrast minimum 4.5:1
- Semantic HTML

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Android

## Kapcsolat Információk

- **Telefon:** 06-30/709-3948
- **Email:** zimber.electric@gmail.com
- **Facebook:** https://www.facebook.com/zimberelectric
- **Működési terület:** Komárom-Esztergom vármegye (Tatabánya, Komárom, Tata, Oroszlány + további települések)

## License

Privát projekt - Zimber Electric számára készült

---

**Build Status:** ✅ Compiled successfully
**Bundle Size:** ~79.4 kB First Load JS
**Pages:** 6 (all static)
