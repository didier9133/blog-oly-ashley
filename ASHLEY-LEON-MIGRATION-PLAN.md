# PLAN DE MIGRACIÓN — Raíces & Returnings → Ashley Leon

**Baseline:** Next.js 15 App Router · React 19 · Prisma (PostgreSQL) · next-intl (en/es) · Clerk · Stripe · Resend · AWS S3/CloudFront
**Dominio actual:** `raicesreturnings.com` → **Nuevo:** `ashleyleon.com` (swap al final)
**Fuentes:** `Ashley-Leon-BUILD.md` (documento de handoff), auditoría previa del repo

---

## Decisiones confirmadas

- **Idioma:** Mantener bilingüe en/es con next-intl
- **Dominio:** Migración al final (Vercel/DNS)
- **Recipes:** Ocultar de UI/sitemap pero conservar código
- **Oly Contreras + /our-love:** Eliminar todo rastro
- **Community link:** Usar `https://gokollab.com/reconstruyendolareverencia-trcsrr` existente
- **Stripe:** Subir workbooks a $33 ahora (nuevos Price IDs)
- **Spots Circle:** Env vars (`NEXT_PUBLIC_CIRCLE_*`)
- **Formato:** Fases ordenadas detalladas

## Supuestos a confirmar con Ashley antes de ejecución

1. Posts en DB atribuidos a Oly: ¿re-asignar a Ashley o despublicar?
2. `/rebuilding-reverence` standalone: ¿se mantiene (con checkout) o se consolida en `/workbooks`?
3. Fuente única de Books: ¿`data/books.ts` o tabla `Book` de Prisma?
4. Subcategorías de Blog: migrar contenido existente o sólo renombrar slugs
5. Handles sociales reales de `ashleyleon` (IG/YT/Substack)
6. TikTok: el BUILD no lo lista en footer — ¿quitarlo?

---

## FASE 0 — Preparación

**0.1** Unificar gestor de paquetes: conservar `bun.lock`, eliminar `package-lock.json` y `pnpm-lock.yaml` + `pnpm-workspace.yaml`
**0.2** Archivar `.md` de audit previos a `docs/archive/` (ACTION-PLAN, CONTENT-ANALYSIS, FULL-AUDIT-REPORT, PERFORMANCE-ANALYSIS, SCHEMA-ANALYSIS, SITEMAP-ANALYSIS, TECHNICAL-SEO, SEO-SPEC, SECURE_DOWNLOADS_GUIDE, PRIVATE_FILES_SETUP)
**0.3** Eliminar cliente Prisma generado duplicado: `src/app/[locale]/generated/prisma/`; añadir `src/app/generated/prisma/` al `.gitignore`
**0.4** Verificar uso de `@mailchimp/mailchimp_marketing`; si no se importa en `src/`, eliminar dependencia

---

## FASE 1 — Eliminación de lo que el BUILD quita

**1.1 Oly Contreras (eliminación completa)**
Archivos a tocar:
- `src/app/[locale]/layout.tsx` — quitar de `authors` en `generateMetadata`
- `src/app/[locale]/(public)/about/page.tsx` — eliminar bio dual
- JSON-LD `Person`/`Organization` en `src/app/[locale]/(public)/page.tsx`
- `src/components/layout/header/` — `public-header.tsx`, `public-sidebar.tsx`, `auth-header.tsx`, `app-sidebar.tsx`, `home-sidebar.tsx`, `sidebar-nav-menu.tsx`, `editorial-split-hero.tsx`
- `src/components/email/` — `download-email-template.tsx`, `response-contact.tsx`, `notify-contact.tsx`
- `src/lib/server/notification-emails.ts`
- `src/app/[locale]/actions/contact/index.ts`, `actions/newsletter/index.ts`, `actions/emails/send-download-email.ts`
- `prisma/seed.ts` — author data

**1.2 Página /our-love** — borrar carpeta `src/app/[locale]/(public)/our-love/`; quitar referencia (comentada) en `src/const/navbar-options.ts` y de `src/app/sitemap.ts`

**1.3 Recipes — OCULTAR (conservar código)**
- `src/const/navbar-options.ts` — remover items de recipes de `navMain`
- `src/components/layout/header/public-items-nav-bar.tsx`, `items-nav-bar.tsx` — remover items
- `src/app/sitemap.ts` — quitar URLs `/recipes` y `/recipes/[slug]`
- `src/app/robots.ts` — añadir `Disallow: /recipes`
- Dejar intacta carpeta `src/app/[locale]/(public)/recipes/`
- Marcar Posts de recetas `published: false` en DB vía script

**1.4 Línea "10,000+"** — `src/components/footer.tsx`

**1.5 Rebrand Raíces & Returnings → Ashley Leon**
Reemplazo global en ~20 archivos:
- `"Raíces & Returnings"` → `"Ashley Leon"`
- `"Raices & Returning"` (sin tilde, en `actions/contact/index.ts`, `actions/newsletter/index.ts`) → `"Ashley Leon"`
- `BASE_URL` en `src/lib/url.ts:3` → `https://ashleyleon.com`
- `src/app/robots.ts:3` → `https://ashleyleon.com`
- Logo/wordmark en headers/sidebar
- `editorial-split-hero.tsx` "Raíces & Returnings Editorial — Nº 01" → "Ashley Leon — Nº 01"
- Emails: from-addresses y body
- `public/llms.txt` — actualizar marca, autor, URLs
- Social handles en footer/JSON-LD → `ashleyleon` (pending confirmación)

---

## FASE 2 — Renombrado de rutas y slugs

**2.1** `/blog` → `/writing`
- Renombrar `src/app/[locale]/(public)/blog/` → `writing/`
- Actualizar imports, sitemap, navbar, footer
- i18n: namespace `Blog` → `Writing` en `messages/en.json` y `messages/es.json`
- Copy del BUILD: "Essays from the in-between" + agrupación por tema (Faith & Deconstruction · Identity & Queerness · Healing & the Body · Reverence & Return)

**2.2** `/ebook` → `/workbooks`
- Renombrar `src/app/[locale]/(public)/ebook/` → `workbooks/`
- Includes `page.tsx`, `detail/[slug]/page.tsx`, `success/page.tsx`
- Sitemap, navbar, footer, i18n namespace `Ebook` → `Workbooks`
- Reescribir copy del BUILD: dos productos $33, sección "Ready to do this in a room, together?" link a Circle, FAQ con schema `FAQPage`

**2.3** `/live-sessions` → `/circle`
- Renombrar carpeta + sitemap + navbar + i18n namespace `LiveSessions` → `Circle`
- Reescribir copy del BUILD (10 secciones: Open, What the Circle Is, What's Inside, The Four Weeks, Who This Is For, Ashley's Promise, How Enrollment Works, Current Cohort Status, One More Thing, FAQ)
- Schema `Event` + `FAQPage` + `Offer`

**2.4 Redirecciones 301** — en `next.config.ts` o middleware:
- `/blog*` → `/writing*`
- `/ebook*` → `/workbooks*`
- `/live-sessions*` → `/circle*`
- `/our-love*` → `/`

**2.5** `/rebuilding-reverence` standalone — mantener (con checkout) pending confirmación Ashley; alinear copy con BUILD

---

## FASE 3 — Nuevas páginas

**3.1 Crear `/community` (The In-Between)**
- Nueva: `src/app/[locale]/(public)/community/page.tsx`
- Copy PAGE 5 del BUILD: "Somewhere to keep returning.", 3 bullets "What you'll find inside"
- Botón "Join The In-Between →" enlazando a `COMMUNITY_JOIN_URL` (constante → `https://gokollab.com/reconstruyendolareverencia-trcsrr`)
- Schema `WebPage` vía `json-ld.tsx`
- `generateMetadata` con título/descripción del BUILD
- Añadir a sitemap, navbar, footer
- i18n: nuevo namespace `Community`
- Nunca mostrar el texto "Go Kollab" en UI

**3.2 Contact — simplificar formulario (3 campos)**
- Cambiar `contact-form.tsx`: Nombre (text), Email (email), Mensaje (long text) — eliminar firstName/lastName/subject separados
- Actualizar schema zod y `sendContactEmail` action
- Ajustar `response-contact.tsx` y `notify-contact.tsx`
- Copy BUILD: "Reach out." + nota "I read everything myself..."
- Schema `ContactPage`

**3.3 About — nueva biografía unipersonal**
- Reescribir `src/app/[locale]/(public)/about/page.tsx` con copy BUILD (PAGE 6): "I'm Ashley.", 4 párrafos, botón "Begin with Rebuilding Reverence →"
- Schema `AboutPage` + `Person` (solo Ashley)

**3.4 Homepage — 8 secciones (orden estricto del BUILD)**
Reescribir `src/app/[locale]/(public)/page.tsx`:
1. Hero: "Writing, workbooks, and live workshops for returning to what's sacred — without self-abandonment." + CTA "Begin with Rebuilding Reverence →"
2. Who This Is For — 3 citas H2
3. Featured Rebuilding Reverence (PRIMARY CTA, máximo peso visual)
4. The Circle (next step, secundario)
5. The In-Between (community)
6. Manifesto — 3 tenets (Reflections/Truth/Belonging)
7. Recent Writing — pull dinámico 2–3 essays desde Prisma
8. Newsletter (componente reusable)
- AI Summary block en footer-area como JSON-LD + sr-only div
- Schema `WebSite` + `Person` (Ashley Leon)

---

## FASE 4 — Newsletter, footer y AI Summary

**4.1** Refactorizar `src/components/subscribe-newsletter.tsx` para uso reusable en home section y footer
- Copy unificada: "Weekly reflections, sent when there's something worth saying — not on a schedule." + botón "Subscribe →"
- Mantener lógica `#newsletter` scroll

**4.2 Footer unificado**
- Reescribir `src/components/footer.tsx`:
  - Links: `Writing | Workbooks | The Circle | Community | About | Contact | Newsletter`
  - Social: `Instagram | YouTube | Substack` (sin TikTok según BUILD)
  - `© 2026 Ashley Leon`
- Eliminar "10,000+" y columnas no aplicables

**4.3 AI Summary block**
- En home, JSON-LD con párrafo AI-summary del BUILD (línea 132) + sr-only div en footer en todas las páginas

---

## FASE 5 — Stripe y precios ($19.99 → $33)

**5.1** Crear nuevos Price IDs en Stripe Dashboard (one_time, USD) para Rebuilding Reverence y Queer & Called ($33)

**5.2** Actualizar `.env` y `.env.template`:
- `STRIPE_PRICE_REBUILDING_REVERENCE` (nuevo ID)
- `STRIPE_PRICE_QUEER_CALLED` (nuevo ID)
- `STRIPE_PRICE_LIVE_SESSION` (Circle $197/$297 — verificar IDs actuales)

**5.3** Actualizar `src/data/books.ts`:
- `price: 19.99` → `33` (ambos workbooks, en/es)
- `author`: `"Ashley Leon"` (quitar "Diana" y "Raíces & Returnings")
- Quitar `originalPrice/discount` si no aplican
- Decidir fuente única (data/books.ts **o** tabla Book) pending confirmación

**5.4** Verificar `src/app/api/checkout/webhook/route.ts` — product-name map (`Rebuilding_Reverence.pdf`, etc.) sigue resolviendo con nuevos Price IDs; S3 keys intactos

**5.5** Checkout UI:
- `src/components/checkout/checkout-form.tsx` — `business.name` → "Ashley Leon"
- `rebuilding-reverence/page.tsx` y `workbooks/detail/[slug]/page.tsx` — mostrar $33

---

## FASE 6 — Circle spots editables vía env var

**6.1** Variables en `.env` / `.env.template`:
```
NEXT_PUBLIC_CIRCLE_SPOTS_REMAINING=10
NEXT_PUBLIC_CIRCLE_CAPACITY=15
NEXT_PUBLIC_CIRCLE_EARLY_PRICE=197
NEXT_PUBLIC_CIRCLE_REGULAR_PRICE=297
```

**6.2** `src/app/[locale]/(public)/circle/reserve/page.tsx`:
- Reemplazar literales por `process.env.NEXT_PUBLIC_CIRCLE_*`
- UI: "[ X ] spots remaining out of 15." con X dinámico
- Botón precio dinámico: "Reserve My Spot — $197 →"
- Si `spotsRemaining === 0`: mostrar "Join waitlist" en lugar de comprar

---

## FASE 7 — SEO/schema/sitemap/robots/i18n

**7.1 Metadata por página (strings exactos del BUILD)**
- Home: "Ashley Leon | Rebuilding Faith, Identity & Reverence After Deconstruction"
- `/writing`: "Essays on Faith, Deconstruction & Healing | Ashley Leon"
- `/workbooks`: "Guided Workbooks for Faith & Identity | Ashley Leon"
- `/circle`: "The Rebuilding Reverence Circle | A Live 4-Week Faith Deconstruction Group"
- `/community`: "The In-Between | A Community for Rebuilding Faith Together — Ashley Leon"
- `/about`: "About Ashley Leon | Writer, Coach & Workshop Facilitator on Faith & Identity"
- `/contact`: "Contact | Ashley Leon"
- i18n: actualizar namespace `metadata` en EN/ES

**7.2 Schemas JSON-LD vía `src/components/json-ld.tsx`**
- Home: `WebSite` + `Person` (Ashley Leon) + AI Summary block
- `/writing`: `Blog` + `CollectionPage`
- `/writing/[slug]`: `Article` (mantener)
- `/workbooks`: `CollectionPage` + dos `Product` con `Offer` $33 + `FAQPage`
- `/workbooks/detail/[slug]`: `Book` con `Offer` $33
- `/circle`: `Event` + `FAQPage` + `Offer` ($197/$297)
- `/community`: `WebPage`
- `/about`: `AboutPage` + `Person`
- `/contact`: `ContactPage`

**7.3 Sitemap `src/app/sitemap.ts`**
- Añadir `/community`
- Renombrar `/blog`→`/writing`, `/ebook`→`/workbooks`, `/live-sessions`→`/circle`
- Quitar `/recipes`, `/recipes/[slug]`, `/our-love`
- URLs con `ashleyleon.com` (vía `lib/url.ts`)

**7.4 Robots `src/app/robots.ts`**
- `Host: https://ashleyleon.com`
- `Disallow: /recipes`, `/our-love`, `/dashboard`, `/api`, `/_next/static`, `test-upload`
- Mantener reglas AI bots (GPTBot, Claude, etc.)

**7.5 i18n messages**
- Renombrar namespaces: `Blog`→`Writing`, `Ebook`→`Workbooks`, `LiveSessions`→`Circle`
- Nuevo namespace `Community`
- Sobre-escribir `Home`, `About`, `Contact`, `metadata`, `footer`, `subscribeHero` con copy del BUILD
- Eliminar strings de Oly y "10,000+"
- Traducir todo el copy nuevo del BUILD al español para `messages/es.json`

---

## FASE 8 — Refactor de componentes

**8.1 Home sections** — crear si no existen:
- `home-section-who-for.tsx` (3 citas)
- `home-featured-rebuilding-reverence.tsx` (CTA primario prominente)
- `home-circle-cta.tsx` (next step)
- `home-community-cta.tsx`
- `home-manifesto.tsx`
- `home-recent-writing.tsx` (reusar `recent-posts-list.tsx` ajustando query a 2–3 essays)
- Ajustar `editorial-split-hero.tsx`: quitar branding antiguo

**8.2 FAQ components con schema FAQPage inline**
- `src/components/workbooks-faq.tsx`
- `live-sessions-faq.tsx` → `circle-faq.tsx`

**8.3 Circle components**
- `live-sessions-sticky-cta.tsx` → `circle-sticky-cta.tsx`

**8.4 Navbar/sidebar**
- `src/const/navbar-options.ts`: nueva estructura `Writing | Workbooks | The Circle | Community | About | Contact` (Newsletter sólo en footer)
- Quitar links de Recipes, Ebook, Our Love

---

## FASE 9 — Datos y DB

**9.1 Prisma schema**
- Post: mantener campos `recipe*` (recipes oculto pero código conservado)
- Subcategories Blog: migrar `Reflections/Letters/Rituals` → `Faith & Deconstruction / Identity & Queerness / Healing & the Body / Reverence & Return` — requiere Prisma migration

**9.2 Seed `prisma/seed.ts`**
- Quitar author Oly (todos los posts → Ashley)
- Nuevas subcategories de Writing
- Books: price $33, author "Ashley Leon", descripciones BUILD (en/es)
- Posts de recipes: mantener con `published: false`

**9.3 Migración de datos existentes**
- Script TS/SQL para marcar `published: false` en Posts de recipes
- Re-asignar authorId de Oly → Ashley en Posts publicados (pending confirmación)

---

## FASE 10 — Build, smoke test y deploy

**10.1** `bun lint && bun run build` — corregir errores
**10.2** Prisma migration: `prisma migrate dev --name ashley_leon_rebuild`
**10.3** Smoke tests manuales:
- Stripe checkout $33 (Rebuilding Reverence + Queer & Called)
- Circle reserva con spots dinámicos (cambiar env var y verificar UI)
- Newsletter desde home y footer
- Contact form (3 campos)
- Rutas nuevas, redirecciones 301, bilingüe toggle
- Validar JSON-LD con Schema.org validator
- Sitemap.xml y robots.txt

**10.4 Swap de dominio (último paso)**
- Vercel: añadir `ashleyleon.com` como production domain
- DNS: apuntar A/CNAME
- 301 `raicesreturnings.com` → `ashleyleon.com`
- Google Search Console: nueva propiedad
- Stripe webhook URL en Dashboard: `https://ashleyleon.com/api/checkout/webhook`
- Clerk: actualizar URLs de dashboard si cambian

---

## Dependencias entre fases

```
F0 → F1 → F2 → F3 → F4
F1.5 (dominio) → F7.3, F7.4 (sitemap/robots)
F2 (rutas nuevas) → F7.1, F7.2 (metadata/schema)
F5 (precios $33) → F2.2/2.3 (UI workbooks/circle)
F6 (spots env vars) → F2.3 (circle reserve)
F9 (DB migration) → F10 (build)
F10.4 (swap dominio) → último
```

## Archivos críticos de alto riesgo

- `src/lib/url.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/app/[locale]/layout.tsx`, `src/app/[locale]/(public)/page.tsx`
- `src/components/footer.tsx`, `src/const/navbar-options.ts`
- `src/data/books.ts`, `prisma/seed.ts`, `prisma/schema.prisma`
- `messages/en.json`, `messages/es.json`
- `src/app/api/checkout/webhook/route.ts`
- `.env`, `.env.template`