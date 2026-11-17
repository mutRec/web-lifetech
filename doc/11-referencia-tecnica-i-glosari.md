---
title: '11 — Referència tècnica i glosari'
aliases:
  - Referència LifeTech
  - Glosari
tags:
  - lifetech
  - referencia
  - glosari
updated: 2026-11-17
status: vigent
---

# 11 — Referència tècnica i glosari

Consulta ràpida de fitxers, comandes, variables, rutes, esquemes i vocabulari.

## 1. Inventari de fitxers

```text
web-lifetech/
├─ astro.config.mjs          configuració d'Astro, sitemap, fonts
├─ package.json              dependències i scripts
├─ tsconfig.json             TypeScript strict + alias @/*
├─ Dockerfile                build Node + runtime nginx
├─ .env.example              variables públiques
├─ .prettierrc               format (100 cols, cometes simples)
├─ .dockerignore             exclusions del context Docker
├─ .gitignore                dist/, .astro/, .env...
├─ README.md                 guia ràpida del projecte
├─ lifetech.WordPress.*.xml  exportació de WordPress (migració)
│
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ brand/                 logos SVG
│  ├─ descargas/             15 PDFs (20,7 MB)
│  └─ images/og-default.jpg  1200×630
│
├─ deploy/
│  ├─ nginx/default.conf
│  ├─ nginx/security-headers.conf
│  ├─ nginx/redirects.conf
│  └─ dokploy.md             runbook de desplegament
│
├─ scripts/
│  ├─ qa.mjs                 QA post-build
│  ├─ import-media.mjs       migració d'imatges des de WordPress
│  └─ generate-og.mjs        genera la imatge OG
│
├─ src/
│  ├─ assets/images/         53 fitxers en total (2,7 MB)
│  │  ├─ corporate/          6 imatges
│  │  ├─ products/           33 imatges per a 16 entrades
│  │  └─ solutions/          14 imatges
│  ├─ components/
│  │  ├─ analytics/Analytics.astro
│  │  ├─ forms/ContactForm.astro
│  │  ├─ layout/{Header,Footer,Breadcrumbs,PageHero}.astro
│  │  ├─ seo/{SEO,JsonLd}.astro
│  │  └─ ui/{Button,Card,Container,Icon,Section,SectionHeading}.astro
│  ├─ content/
│  │  ├─ products/           16 .md
│  │  ├─ solutions/          9 .md
│  │  ├─ pages/              3 .md
│  │  └─ blog/               buit (.gitkeep)
│  ├─ data/
│  │  ├─ site.ts             NAP, SEO global, legals
│  │  └─ navigation.ts       menú, footer, productes, projectes
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  ├─ ProductLayout.astro
│  │  ├─ SolutionLayout.astro
│  │  └─ LegalLayout.astro
│  ├─ lib/
│  │  ├─ cn.ts
│  │  ├─ schema.ts           JSON-LD
│  │  └─ urls.ts             URLs, títols, descripcions
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ [...slug].astro     productes + legals
│  │  ├─ 404.astro
│  │  ├─ blog/index.astro
│  │  ├─ productos/index.astro
│  │  ├─ soluciones/index.astro
│  │  ├─ soluciones/[...slug].astro
│  │  └─ corporatives...
│  ├─ styles/global.css      Tailwind 4 + tokens
│  ├─ content.config.ts      esquemes Zod
│  └─ env.d.ts               tipus de variables públiques
│
└─ doc/                      aquest conjunt documental
```

## 2. Comandes

| Comanda | Ús |
|---|---|
| `npm install` | Instal·lar dependències |
| `npm run dev` | Servidor local `:4321` |
| `npm run build` | Generar `dist/` |
| `npm run preview` | Servir `dist/` |
| `npm run check` | TypeScript + Astro |
| `npm run qa` | QA post-build |
| `npm run format` | Prettier |
| `npm run format:check` | Comprovar format |
| `npm run og` | Regenerar OG |

## 3. Variables d'entorn

| Variable | Obligatòria | Ús | On |
|---|---|---|---|
| `PUBLIC_SITE_URL` | No | **No usada actualment** | `env.d.ts` |
| `PUBLIC_FORM_ENDPOINT` | No | Endpoint Web3Forms | `ContactForm.astro` |
| `PUBLIC_FORM_ACCESS_KEY` | Sí per al formulari | Clau pública Web3Forms | `ContactForm.astro` |
| `PUBLIC_ANALYTICS_SRC` | No | Script Umami | `Analytics.astro` |
| `PUBLIC_ANALYTICS_ID` | No | Website ID | `Analytics.astro` |

Totes són `PUBLIC_*` i s'inlinen **en build time**. Al Docker han d'arribar com a `ARG`/`ENV`.

## 4. Inventari de rutes

| Ruta | Font | Tipus |
|---|---|---|
| `/` | `index.astro` | Estàtica |
| `/nosotros/` | `nosotros.astro` | Estàtica |
| `/contacto/` | `contacto.astro` | Estàtica |
| `/faqs/` | `faqs.astro` | Estàtica |
| `/soporte-en-linea/` | `soporte-en-linea.astro` | Estàtica |
| `/videos/` | `videos.astro` | Estàtica |
| `/descarga-productos/` | `descarga-productos.astro` | Estàtica |
| `/garantia-del-inversor/` | `garantia-del-inversor.astro` | Estàtica |
| `/garantia-de-la-bateria/` | `garantia-de-la-bateria.astro` | Estàtica |
| `/productos/` | `productos/index.astro` | Estàtica |
| `/ress/` + 4 models | `[...slug].astro` | Dinàmica |
| `/lv-lite-series/` | `[...slug].astro` | Dinàmica |
| `/hv-lite-series/` | `[...slug].astro` | Dinàmica |
| `/lt5000-series/` + 2 models | `[...slug].astro` | Dinàmica |
| `/lt5000r-series/` | `[...slug].astro` | Dinàmica |
| `/lt-12v-24v-series/` + 1 model | `[...slug].astro` | Dinàmica |
| `/lt-hv/` + 2 models | `[...slug].astro` | Dinàmica |
| `/soluciones/` | `soluciones/index.astro` | Estàtica |
| `/soluciones/<àmbit>/` (3) | `soluciones/[...slug].astro` | Dinàmica |
| `/soluciones/<àmbit>/<projecte>/` (5) | `soluciones/[...slug].astro` | Dinàmica |
| `/aviso-legal/` | `[...slug].astro` | Dinàmica |
| `/politica-de-privacidad/` | `[...slug].astro` | Dinàmica |
| `/politica-de-cookies/` | `[...slug].astro` | Dinàmica |
| `/blog/` | `blog/index.astro` | Estàtica, `noindex` |
| `/gracias/` | `gracias.astro` | Estàtica, `noindex` |
| `404.html` | `404.astro` | Sistema |

## 5. Esquemes: referència ràpida

### `products`

| Camp | Tipus | Default |
|---|---|---|
| `title` | string | — |
| `slug` | string | — |
| `kind` | `series` \| `model` | — |
| `parent` | ref products | — |
| `order` | number | 0 |
| `excerpt` | string | — |
| `hero` | image | — |
| `gallery` | `{src, alt}[]` | `[]` |
| `features` | `{icon, title, text}[]` | `[]` |
| `highlights` | `{value, label}[]` | `[]` |
| `specs` | `{label, value}[]` | `[]` |
| `downloads` | `{label, kind, href?}[]` | `[]` |
| `related` | ref products[] | `[]` |
| `seo` | objecte | — |

### `solutions`

| Camp | Tipus | Default |
|---|---|---|
| `title` | string | — |
| `slug` | string | — |
| `parent` | ref solutions | — |
| `order` | number | 0 |
| `eyebrow` | string | — |
| `excerpt` | string | — |
| `hero` | image | — |
| `icon` | string | `lucide:home` |
| `stats` | `{value, label}[]` | `[]` |
| `products` | ref products[] | `[]` |
| `seo` | objecte | — |

### `pages`

| Camp | Tipus |
|---|---|
| `title` | string |
| `slug` | string |
| `description` | string |
| `updated` | date |
| `seo` | objecte |

### `blog`

| Camp | Tipus | Default |
|---|---|---|
| `title` | string | — |
| `description` | string | — |
| `pubDate` | date | — |
| `updatedDate` | date | — |
| `hero` | image | — |
| `author` | string | LifeTech |
| `tags` | string[] | `[]` |
| `draft` | boolean | `false` |
| `seo` | objecte | — |

### `seo`

| Camp | Tipus | Restricció |
|---|---|---|
| `title` | string | — |
| `description` | string | ≤ 160 |
| `image` | string | — |
| `noindex` | boolean | default `false` |

## 6. API de components

| Component | Props |
|---|---|
| `Button` | `href?`, `variant?`, `size?`, `icon?`, `iconPosition?`, `type?`, `external?`, `disabled?`, `class?` |
| `Card` | `href?`, `padded?`, `hover?`, `class?` |
| `Container` | `as?`, `size?`, `class?` |
| `Icon` | `name`, `class?`, `size?`, `label?` |
| `Section` | `id?`, `tone?`, `padding?`, `container?`, `size?`, `class?` |
| `SectionHeading` | `eyebrow?`, `title`, `description?`, `align?`, `as?`, `tone?`, `class?` |
| `Breadcrumbs` | `items`, `tone?`, `class?`, `withSchema?` |
| `PageHero` | `title`, `description?`, `eyebrow?`, `crumbs?`, `align?`, `image?`, `imageAlt?`, `offsetHeader?` |
| `SEO` | `title?`, `description?`, `image?`, `noindex?`, `type?`, `publishedTime?`, `modifiedTime?`, `jsonLd?` |
| `JsonLd` | `data` |

## 7. JSON-LD

| Funció | Sortida |
|---|---|
| `organizationSchema()` | `Organization` amb NAP, logo, contactPoint |
| `websiteSchema()` | `WebSite` amb `inLanguage: es-ES` |
| `breadcrumbSchema(items)` | `BreadcrumbList` |
| `webPageSchema({name, description, path})` | `WebPage` |
| `productSchema({name, description, path, image, brand?})` | `Product` |
| `faqSchema(items)` | `FAQPage` |
| `compact(value)` | Filtra claus buides (**no usat**) |

## 8. nginx: referència

| Bloc | Funció |
|---|---|
| `location = /healthz` | Healthcheck de Dokploy |
| `location ^~ /_astro/` | Assets amb hash, cache 1 any |
| `location ~* \.(imatges)` | Cache 30 dies |
| `location ~* \.(fonts)` | Cache 1 any |
| `location ~* \.pdf$` | Cache 7 dies |
| `location ~* sitemap/rss/robots` | Cache 1 dia |
| `location /` | HTML, `try_files`, `expires epoch` |
| `error_page 404` | `404.html` |

Redirects: 301 per a llegat, 410 per a WordPress i directoris interns.

## 9. Glosari

| Terme | Definició |
|---|---|
| **ADR** | Architecture Decision Record; document de decisions |
| **Astro** | Framework de llocs estàtics amb components i illes |
| **`astro:assets`** | API d'imatges i fonts amb optimització en build |
| **Build** | Procés que genera `dist/` |
| **Canonical** | URL preferida d'una pàgina |
| **Catch-all** | Ruta `[...slug]` que captura múltiples segments |
| **CLS** | Cumulative Layout Shift; estabilitat visual |
| **Content Collection** | Grup d'entrades validades per esquema |
| **Content Layer** | Sistema de càrrega i emmagatzematge de contingut d'Astro |
| **CSP** | Content Security Policy |
| **CWV** | Core Web Vitals (LCP, CLS, INP) |
| **`dist/`** | Directori de sortida del build |
| **Frontmatter** | Bloc YAML al principi d'un Markdown |
| **Glob loader** | Loader que llegeix fitxers per patró |
| **`hreflang`** | Indicador de versions per idioma |
| **INP** | Interaction to Next Paint |
| **Illa (island)** | Component interactiu dins d'una pàgina estàtica |
| **JSON-LD** | Dades estructurades en JSON |
| **LCP** | Largest Contentful Paint |
| **Loader** | Funció que carrega contingut en una col·lecció |
| **Markdown** | Format de text amb sintaxi lleugera |
| **MDX** | Markdown amb components JSX (no usat) |
| **nginx** | Servidor web que serveix `dist/` |
| **Noindex** | Directiva per no indexar una pàgina |
| **Open Graph** | Metadades per a xarxes socials |
| **Prerender** | Generar HTML en build |
| **`reference()`** | Tipus Zod que apunta a una altra entrada |
| **Schema** | Contracte de dades (Zod) |
| **Sharp** | Llibreria de transformació d'imatges |
| **Slug** | Identificador llegible d'una entrada |
| **Sitemap** | Índex d'URLs per a cercadors |
| **SSG** | Static Site Generation |
| **SSR** | Server-Side Rendering |
| **Static-first** | Prioritzar HTML estàtic |
| **Tailwind** | Framework de CSS utilitari |
| **TTFB** | Time To First Byte |
| **Zod** | Llibreria de validació i tipus |

## 10. Protocol de re-auditoria

Quan canviï el projecte, torna a mesurar:

```bash
# 1. Build net
rm -rf dist .astro
npm ci
npm run check
npm run build
npm run qa

# 2. Recompte de pàgines
find dist -name '*.html' | wc -l

# 3. Mida
du -sh dist
du -sh dist/_astro

# 4. Rutes noves
find dist -name 'index.html' | sort

# 5. Sitemap
grep -o '<loc>[^<]*' dist/sitemap-0.xml | wc -l
```

A Windows PowerShell:

```powershell
(Get-ChildItem dist -Recurse -File -Filter *.html).Count
"{0:N1} MB" -f ((Get-ChildItem dist -Recurse -File | Measure-Object Length -Sum).Sum/1MB)
```

Actualitza:

- Mètriques del [README](README.md).
- Inventari de rutes d'aquest document.
- Esquemes si han canviat.
- Riscos de [09](09-deute-tecnic-i-riscos.md).
- ADR si hi ha una decisió nova.

## 11. Snapshot de mètriques (2026-11-17)

| Mètrica | Valor |
|---|---:|
| Commit | `57dda43` |
| Pàgines HTML a `dist/` | 40 |
| Pàgines esperades a `src/` | 41 |
| Productes | 16 (7 sèries + 9 models) |
| Solucions | 9 entrades (1 índex + 3 àmbits + 5 projectes) |
| Legals | 3 |
| Articles | 0 |
| Imatges font | 53 |
| PDFs | 15 |
| `dist/` | 30,2 MB |
| `dist/_astro/` | 7,4 MB |
| HTML total | 2,07 MB |
| CSS | 63,5 KB |
| URLs al sitemap | 37 |
| Scripts de client | 3 |

> [!NOTE]
> Les 9 entrades de solucions generen 9 URLs públiques: l'índex `/soluciones/`, 3 àmbits i 5 projectes.
