# Zimber Electric - Deployment Útmutató

## Netlify Deployment - Lépésről Lépésre

### Előfeltételek

- GitHub/GitLab/Bitbucket fiók
- Netlify fiók (ingyenes)
- Git telepítve lokálisan

---

## 1. lépés: Repository létrehozása

### GitHub használata:

1. Menj a https://github.com oldalra
2. Kattints a "New repository" gombra
3. Repository név: `zimber-electric-website`
4. Állítsd private-ra (opcionális)
5. **NE** add hozzá a README, .gitignore vagy license-t
6. Kattints a "Create repository" gombra

### Lokális git inicializálás:

```bash
# Navigálj a projekt mappájába
cd /path/to/project

# Git inicializálás
git init

# Minden fájl hozzáadása
git add .

# Első commit
git commit -m "Initial commit: Zimber Electric website"

# Remote hozzáadása (cseréld ki a YOUR_USERNAME-t)
git remote add origin https://github.com/YOUR_USERNAME/zimber-electric-website.git

# Push
git push -u origin main
```

---

## 2. lépés: Netlify Site létrehozása

### A. Netlify Dashboard

1. Menj a https://app.netlify.com oldalra
2. Jelentkezz be (vagy regisztrálj)
3. Kattints az "Add new site" gombra
4. Válaszd az "Import an existing project" opciót

### B. Repository kapcsolás

1. Válaszd a GitHub/GitLab/Bitbucket opciót
2. Authorize Netlify (ha első alkalom)
3. Keresd meg és válaszd ki a `zimber-electric-website` repository-t

### C. Build beállítások

**Automatikusan felismeri a következőket:**
- Build command: `npm run build`
- Publish directory: `.next`

**Ha nem automatikus, állítsd be manuálisan:**
- Branch to deploy: `main`
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18 (automatikus a `netlify.toml`-ból)

### D. Deploy

1. Kattints a "Deploy site" gombra
2. Várj 2-3 percet a build befejezésére
3. Ha minden zöld ✅, a site élő!

---

## 3. lépés: Netlify Forms beállítása

### A. Form detektálás ellenőrzése

1. Netlify Dashboard → **Forms** tab
2. Ellenőrizd, hogy látható-e a "kapcsolat" form
3. Ha NEM látható:
   - Menj a Deploys tab-ra
   - Kattints "Trigger deploy" → "Clear cache and deploy site"
   - Várj a rebuild-re

### B. Email notificationök beállítása

1. Forms tab → "kapcsolat" form
2. **Settings** → **Form notifications**
3. **Add notification** → **Email notification**
4. Email cím: `zimber.electric@gmail.com`
5. **Save**

### C. Form tesztelés

1. Menj a site-on a `/kapcsolat` oldalra
2. Töltsd ki az űrlapot
3. Küldd el
4. Ellenőrizd:
   - Success üzenet megjelenik ✅
   - Email érkezik a `zimber.electric@gmail.com` címre
   - Netlify Dashboard → Forms → Submissions látható

**Ha NEM működik:**
- Ellenőrizd a spam mappát
- Várj 1-2 percet (email késhet)
- Netlify Dashboard → Forms → Settings → ellenőrizd az email címet

---

## 4. lépés: Custom Domain beállítása (Opcionális)

### A. Domain vásárlás

Domain provider-ek:
- Namecheap (ajánlott)
- GoDaddy
- Domain.com
- Google Domains

Példa domain: `zimberelectric.hu`

### B. Domain hozzáadása Netlify-hoz

1. Netlify Dashboard → **Domain settings**
2. **Add custom domain**
3. Írd be: `zimberelectric.hu`
4. **Verify** → **Add domain**

### C. DNS beállítások

**Két opció:**

#### Opció 1: Netlify DNS (ajánlott)
1. Netlify automatikusan generál nameserver-eket
2. Domain provider-nél változtasd meg a nameserver-eket Netlify-ra
3. Várj 24-48 órát a DNS propagációra

#### Opció 2: Külső DNS
Domain provider DNS beállításainál:

**A record:**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

**CNAME record (www):**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
TTL: 3600
```

### D. SSL Certificate

1. Netlify automatikusan generál Let's Encrypt SSL-t
2. **Domain settings** → **HTTPS** → **Verify DNS configuration**
3. Várj 1-2 órát az SSL aktiválódásra
4. **Force HTTPS** → Enable

---

## 5. lépés: Post-Deployment ellenőrzések

### ✅ Checklist

- [ ] Site live és elérhető
- [ ] Minden oldal betöltődik (főoldal, szolgáltatások, galéria, rólunk, kapcsolat)
- [ ] Navbar navigáció működik
- [ ] Footer linkek működnek
- [ ] Responsive mobile-on
- [ ] Kapcsolati űrlap működik
- [ ] Email notification érkezik
- [ ] 404 oldal működik (próbálj meg invalid URL-t)
- [ ] Animációk működnek
- [ ] Telefonszám link működik (tel:)
- [ ] Email link működik (mailto:)
- [ ] Facebook link működik

### Performance ellenőrzés

**Lighthouse Audit (Chrome DevTools):**
1. Nyisd meg a site-ot Chrome-ban
2. F12 → Lighthouse tab
3. **Analyze page load**
4. Célja: 90+ minden kategória

### Google Search Console beállítása (SEO)

1. Menj a https://search.google.com/search-console
2. **Add property** → írd be a domain-t
3. **Verify ownership** (Netlify DNS vagy HTML tag)
4. Várj pár napot az indexelésre

---

## 6. lépés: Karbantartás és frissítések

### Új tartalom hozzáadása

1. Lokálisan szerkeszd a fájlokat
2. Git commit:
   ```bash
   git add .
   git commit -m "Update: leírás"
   git push
   ```
3. Netlify automatikusan deploy-ol

### Galéria feltöltése

Ha készen állnak a fotók:

1. Képek optimalizálása:
   - Méret: max 1920px szélesség
   - Formátum: WebP (vagy JPG)
   - Fájlméret: max 200KB/kép

2. Képek elhelyezése: `public/images/galeria/`

3. `app/galeria/page.tsx` frissítése:
   - Törld a placeholder-eket
   - Add hozzá a valós képeket Next.js Image component-tel

4. Git commit és push

### Form módosítások

Ha új mező kell:
1. `app/kapcsolat/page.tsx` - add hozzá a mezőt
2. `public/kapcsolat-form.html` - add hozzá a mezőt
3. Git commit és push
4. Netlify automatikusan frissíti a form-ot

---

## 7. lépés: Troubleshooting

### Build hibák

**Hiba:** "Module not found"
- **Megoldás:** Telepítsd a hiányzó package-et: `npm install [package-name]`

**Hiba:** "Out of memory"
- **Megoldás:** Netlify Dashboard → Build & deploy → Environment → `NODE_OPTIONS=--max-old-space-size=4096`

### Form nem működik

**Hiba:** Form nem küldi el az adatokat
- **Ellenőrizd:**
  - `data-netlify="true"` attribútum van-e
  - `name="kapcsolat"` attribútum egyezik-e
  - `public/kapcsolat-form.html` létezik-e

**Hiba:** Email nem érkezik
- **Ellenőrizd:**
  - Netlify Dashboard → Forms → Notifications → email cím helyes-e
  - Spam mappa
  - Várj 2-3 percet

### DNS hibák

**Hiba:** Domain nem elérhető
- **Ellenőrizd:**
  - DNS propagáció (használd: https://dnschecker.org)
  - Várj 24-48 órát
  - NS record-ok helyesek-e

**Hiba:** SSL hiba
- **Megoldás:**
  - Netlify Dashboard → Domain settings → HTTPS → Renew certificate
  - Várj 1-2 órát

---

## Költségek

### Netlify (ingyen tier)
- **Bandwidth:** 100 GB/hó
- **Build minutes:** 300 perc/hó
- **Forms:** 100 submission/hó
- **Többlet:** $19/hó Pro tier (de valószínűleg nem kell)

### Domain
- **.hu domain:** ~3000-5000 Ft/év
- **.com domain:** ~4000-6000 Ft/év

### Összesen
- **Havi költség:** 0 Ft (Netlify ingyenes)
- **Éves költség:** 3000-6000 Ft (csak domain)

---

## Support és Kapcsolat

Ha bármi probléma van a deployment során:

1. Nézd meg a Netlify build logot: Dashboard → Deploys → (legutóbbi deploy) → Deploy log
2. Google-öld a hibaüzenetet
3. Netlify Community Forum: https://answers.netlify.com
4. Netlify Support: https://www.netlify.com/support/

---

**Deployment sikeres! 🎉**

A Zimber Electric weboldal most már élő és elérhető az interneten!
