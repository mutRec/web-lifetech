---
title: '05 — SEO, rendiment i accessibilitat'
aliases:
  - SEO LifeTech
  - Rendiment i accessibilitat
tags:
  - lifetech
  - seo
  - rendiment
  - accessibilitat
  - json-ld
updated: 2026-11-17
status: vigent
---

# 05 — SEO, rendiment i accessibilitat

## 1. Capes del SEO tècnic

| Capa | Implementació | Fitxer |
|---|---|---|
| Títol i descripció | `formatTitle`, `clampDescription` | `src/lib/urls.ts` |
| Canonical | `canonicalUrl` | `src/lib/urls.ts` |
| Robots | Meta `noindex`/`index` | `src/components/seo/SEO.astro` |
| Open Graph / Twitter | Meta tags | `src/components/seo/SEO.astro` |
| Dades estructurades | Constructors JSON-LD | `src/lib/schema.ts` |
| Sitemap | `@astrojs/sitemap` | `astro.config.mjs` |
| Robots.txt | Fitxer estàtic | `public/robots.txt` |
| URLs llegades | Redirects 301/410 | `deploy/nginx/redirects.conf` |
| Contingut | Markdown + frontmatter | `src/content/**` |

## 2. Títol i descripció

### 2.1 Títol

```ts
export function formatTitle(title: string | undefined, isHome = false): string {
  if (!title) return site.defaultTitle;
  if (isHome) return title;
  if (title.includes(site.name)) return title;
  return `${title} | ${site.name}`;
}
```

| Cas | Resultat |
|---|---|
| Home | `LifeTech \| Sistemas de almacenamiento de energía` (tal qual) |
| `/productos/` | `Productos \| LifeTech` |
| Fitxa sense `seo.title` | `RESS 300-200 \| LifeTech` |
| `seo.title` que ja conté “LifeTech” | No duplica el sufix |
| Sense títol | `site.defaultTitle` |

La longitud no es valida. Un títol llarg es truncarà a la SERP. Convenció: **50–60 caràcters** incloent el sufix.

### 2.2 Descripció

```ts
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max - 1).replace(/[,;:.\-–]$/, '')}…`;
}
```

- Retalla sense trencar paraules.
- Neteja espais múltiples.
- Afegeix `…`.
- S'aplica tant a `seo.description` com a `excerpt`/`description` base.

L'esquema Zod limita `seo.description` a 160, però no `excerpt`. Per això el clamp és imprescindible: una fitxa pot tenir un `excerpt` llarg i la meta description es retalla sola.

### 2.3 Prioritat de fonts

| Pàgina | Títol | Descripció |
|---|---|---|
| Producte | `seo.title ?? title` | `seo.description ?? excerpt` |
| Solució/projecte | `seo.title ?? title` | `seo.description ?? excerpt` |
| Legal | `title` | `seo.description ?? description` |
| Corporativa | `title` del component | `description` del component |
| Home | títol complet | `site.description` |

## 3. Canonical, robots i indexació

```astro
{!noindex && <link rel="canonical" href={canonical} />}
<meta
  name="robots"
  content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
/>
```

| Estat | Canonical | Robots | Sitemap |
|---|---|---|---|
| Normal | Sí | `index, follow, max-image-preview:large` | Sí |
| `noindex` | **No** | `noindex, follow` | Exclòs per filtre |
| `/gracias/` | No | `noindex` | Exclòs |
| `/blog/` | No (avui) | `noindex` | Exclòs |
| `404.html` | No | — | No |

`canonicalUrl` elimina query i hash:

```ts
const url = new URL(pathname, base);
url.search = '';
url.hash = '';
return url.href;
```

No normalitza la barra final per si mateix; confia que `Astro.url.pathname` ja la porta (gràcies a `trailingSlash: 'always'` i al redirect d'nginx).

### Sobre `noindex` + canonical

Treure el canonical de les pàgines `noindex` és una pràctica conservadora. Google accepta canonical en pàgines noindex, però no és necessari. No és un error.

## 4. Open Graph i Twitter

| Meta | Valor |
|---|---|
| `og:type` | `website` o `article` |
| `og:site_name` | LifeTech |
| `og:locale` | `es_ES` |
| `og:title` | Títol formatat |
| `og:description` | Descripció retallada |
| `og:url` | Canonical |
| `og:image` | Hero de la pàgina o `/images/og-default.jpg` |
| `og:image:width/height` | Només per a la imatge per defecte (1200×630) |
| `og:image:alt` | Genèric: `LifeTech - LifeTech Energy Solucions` |
| `twitter:card` | `summary_large_image` |
| `twitter:title/description/image` | Equivalent |

Punts febles:

- **`og:image:alt` no és específic per pàgina**: sempre el mateix text.
- No hi ha `twitter:site` ni `twitter:creator`.
- Si la imatge hero no és 1200×630, no s'indiquen dimensions; algunes xarxes retallaran.
- La imatge per defecte es genera amb `npm run og` (sharp + SVG), no es regenera al build.

## 5. Dades estructurades (JSON-LD)

### 5.1 Composició

`SEO.astro` sempre injecta:

```ts
const structuredData = [organizationSchema(), websiteSchema(), ...jsonLd];
```

La pàgina afegeix `webPageSchema` i, si escau, `productSchema` o `faqSchema`. `Breadcrumbs` afegeix un bloc separat de `breadcrumbSchema`.

### 5.2 Tipus emesos

| Tipus | On | Camps principals |
|---|---|---|
| `Organization` | Totes | `@id`, `name`, `legalName`, `url`, `logo`, `image`, `email`, `telephone`, `address`, `hasMap`, `sameAs`, `contactPoint` |
| `WebSite` | Totes | `@id`, `url`, `name`, `description`, `inLanguage: es-ES`, `publisher` |
| `WebPage` | Totes | `@id` (`url#webpage`), `url`, `name`, `description`, `inLanguage`, `isPartOf`, `about` |
| `Product` | Només `kind: model` | `name`, `description`, `url`, `image`, `brand`, `manufacturer` |
| `BreadcrumbList` | Totes les pàgines amb `Breadcrumbs` | `itemListElement` amb `position`, `name`, `item` |
| `FAQPage` | `/faqs/` | `mainEntity` amb `Question`/`Answer` |

### 5.3 Exemple real

Al build, una fitxa de model conté:

```json
[
  { "@type": "Organization", "@id": "https://life-tech.es/#organization" },
  { "@type": "WebSite", "@id": "https://life-tech.es/#website" },
  { "@type": "WebPage", "@id": "https://life-tech.es/ress/ress-300-200/#webpage" },
  { "@type": "Product", "name": "RESS 300-200", "url": "..." }
]
```

I, en un altre `<script>`, el `BreadcrumbList`.

### 5.4 Buits i discrepàncies

| Tema | Estat | Impacte |
|---|---|---|
| `Organization` vs `LocalBusiness` | El comentari diu “Organization + LocalBusiness”, però el codi emet només `Organization` | Si es vol rich result local, cal `LocalBusiness` o subtipus |
| `sameAs` | Buit | No s'enllaça cap perfil social |
| `Product.offers` | Absent | Correcte si no es ven online; sense preu no hi ha rich result de producte |
| `Product.sku`/`mpn` | Absent | Opcional |
| `Article` | No implementat | El blog no té rutes ni articles |
| `Service` | No implementat | Les solucions es marquen com `WebPage` |
| `@graph` | No s'usa | Diversos blocs; funciona, però un graf únic és més net |
| `compact()` | Definit a `schema.ts` però no s'usa | Codi mort menor |

## 6. Sitemap i robots

### 6.1 Sitemap

- `@astrojs/sitemap` genera `sitemap-index.xml` i `sitemap-0.xml`.
- Filtre: exclou `/gracias/`, `/politica-de-cookies-ue/` i **qualsevol URL que contingui `/blog/`**.
- `serialize`: home `weekly` + `1.0`; resta `monthly` + `0.7` (incloses les fitxes de producte).
- Al build auditat: **37 URLs**.
- El nou `/productos/` no hi és perquè `dist/` és anterior; després del build seran 38.

> [!WARNING]
> El filtre `!page.includes('/blog/')` exclourà **tots** els articles futurs. Quan es publiqui el blog cal eliminar aquesta condició (o fer-la dependre de `draft`/`noindex`), no només treure el `noindex` de l'índex.

### 6.2 Robots.txt

```text
User-agent: *
Allow: /

Disallow: /gracias/
Disallow: /404

Sitemap: https://life-tech.es/sitemap-index.xml
```

`Disallow: /404` no bloqueja `/404.html` literalment, però la pàgina no s'enllaça. És un detall menor.

### 6.3 URLs llegades

Els redirects 301/410 són part de l'estratègia SEO:

- 301 per a català → castellà, slugs antics, sitemaps de Yoast.
- 410 per a superfície WordPress i directoris interns.
- `/politica-de-cookies-ue/` no es genera; nginx la redirigeix.

No hi ha un mapa 1:1 documentat de totes les URLs del WordPress. L'XML de migració i `redirects.conf` són les fonts. Recomanació: generar una taula `URL antiga → URL nova → estat` i validar-la amb Search Console després del llançament.

## 7. Rendiment

### 7.1 Pressupost real

| Recurs | Mida | Notes |
|---|---:|---|
| HTML | ~52 KB de mitjana (54,4 KB a la home) | Inclou CSS crític? No; inclou scripts inline |
| CSS | 63,5 KB sense comprimir (1 fitxer) | ~10–13 KB amb gzip |
| JS | **Inline al HTML** | No hi ha fitxers JS a `_astro/`; els scripts module s'inlinen |
| Fonts | 2 `.woff2` variables | Subset llatí; preload |
| Hero | 100–260 KB WebP | Depèn de la imatge i l'amplada |
| PDFs | 20,7 MB | No es carreguen en navegar |

El build auditat no genera cap fitxer `.js` a `dist/_astro/`: els scripts del header i del formulari s'inlinen a cada pàgina. Això estalvia peticions però duplica codi a cada HTML. És acceptable amb dos scripts petits; si creixen, convé forçar bundles externs.

### 7.2 Per què hauria de rendir bé

- **HTML estàtic**: TTFB dominat per xarxa i nginx.
- **Zero hidratació**: no hi ha parseig de framework ni hidratació.
- **Imatges responsives**: `srcset`/`sizes` generats per Astro, WebP.
- **Hero amb prioritat**: `eager` + `fetchpriority="high"`.
- **Resta lazy**: galeries, targetes, relacionats.
- **Fonts subset**: només llatí, variables.
- **CSS únic**: Tailwind purga el que no s'usa.
- **Cache immutable**: `_astro` i fonts.
- **Icons inline**: sense peticions ni JS.

### 7.3 Riscos de CWV

| Mètrica | Risc | Causa probable | Mitigació |
|---|---|---|---|
| LCP | Mitjà | Hero gran o font que bloqueja | Comprimir hero, `fetchpriority`, preload selectiu |
| CLS | Baix | Imatges amb dimensions correctes; fonts amb swap | Mantenir `width`/`height` i evitar insercions tardanes |
| INP | Baix | Poc JS | Vigilar el menú si s'afegeixen animacions |
| TBT | Baix | Sense frameworks | — |

No hi ha dades de camp (CrUX) al repositori. Cal mesurar amb PageSpeed Insights/Lighthouse i, si es vol, amb `web-vitals` enviat a Umami.

### 7.4 Com mesurar

```bash
npm run build
npm run preview
# Lighthouse sobre http://localhost:4321/
```

Checklist:

- [ ] Lighthouse mobile ≥ 90 en Performance, Accessibility, Best Practices, SEO.
- [ ] LCP < 2,5 s en 4G simulada.
- [ ] CLS < 0,1.
- [ ] INP < 200 ms.
- [ ] Cap imatge > 300 KB en above-the-fold.
- [ ] Cap font > 100 KB.

## 8. Accessibilitat

### 8.1 Què està ben resolt

| Element | Implementació |
|---|---|
| Idioma | `<html lang="es">` |
| Skip link | “Saltar al contenido” → `#contenido` |
| Landmarks | `header`, `nav`, `main`, `footer` |
| Un sol `h1` | Verificat per `npm run qa` |
| Alt d'imatges | Obligatori a galeria; decoratives amb `alt=""` |
| Focus visible | `:focus-visible` amb outline de marca |
| Reduced motion | `prefers-reduced-motion` desactiva animacions |
| Menú | `aria-expanded`, `aria-controls`, Escape, clic fora |
| Breadcrumbs | `aria-label`, `aria-current="page"` |
| Formulari | Labels, `required`, `autocomplete`, `inputmode`, honeypot `aria-hidden` |
| Taula d'specs | `<th scope="row">`, `caption` sr-only |
| Icones | `aria-hidden` si són decoratives; `label` si són significatives |

### 8.2 Mancances

| Mancança | Impacte | Recomanació |
|---|---|---|
| El menú mòbil no atrapa el focus | Usuaris de teclat poden sortir del panell | Focus trap o `<dialog>` |
| Errors de formulari no associats | `aria-invalid`/`aria-describedby` absents | Afegir-los per camp |
| Mega-menú sense fletxes | Navegació només amb Tab | Afegir roving tabindex |
| Contrast no auditat | Podria fallar en textos `muted` sobre `surface` | Auditar amb axe/Lighthouse |
| `aria-current` al menú principal | Només enllaços simples, no columnes | Marcar la columna activa |
| Botons icònics | Tenen `sr-only`, però cal revisar-ne tots | Auditoria |
| Taules grans en mòbil | Scroll horitzontal | `overflow-x-auto` o layout de targetes |

## 9. Analítica i privacitat

`Analytics.astro`:

```astro
const enabled = import.meta.env.PROD && Boolean(src) && Boolean(websiteId);
```

- Només producció.
- Umami Cloud, sense cookies.
- `data-domains="life-tech.es,www.life-tech.es"` exclou staging.
- `data-do-not-track="true"`.
- `data-exclude-search="true"`.

Conseqüències legals:

- No cal banner de cookies per a l'analítica (així ho declara `/politica-de-cookies/`).
- El formulari envia dades a Web3Forms (encarregat de tractament), documentat a `/politica-de-privacidad/`.
- No hi ha cookies pròpies ni de tercers amb finalitats publicitàries.
- Si s'afegeix GA4, Meta Pixel o YouTube amb cookies, caldrà consentiment i actualitzar la política.

## 10. i18n

- `site.lang = 'es'`, `site.locale = 'es_ES'`.
- Contingut en castellà.
- No hi ha rutes per idioma, ni `hreflang`, ni selector.
- Els redirects `/ca/*` existeixen perquè hi havia una versió catalana antiga, no perquè el web actual sigui multiidioma.

Si s'afegeix català/anglès, caldrà:

1. Estratègia de routing (`/ca/`, `/en/` o subdominis).
2. Contingut per locale o referències de traducció.
3. `hreflang` recíproc i canonical per locale.
4. Sitemap per locale.
5. Redirects de les URLs actuals.

Vegeu [08](08-escalabilitat-i-evolucio-del-model.md), secció i18n.

## 11. Checklist SEO per pàgina nova

- [ ] `title` únic, 50–60 caràcters, amb `| LifeTech` no duplicat.
- [ ] `description` ≤ 160, amb proposta de valor i paraula clau.
- [ ] Un sol `h1`; H2/H3 jeràrquics.
- [ ] `slug` en minúscules, guions, sense accents ni stop words innecessàries.
- [ ] Canonical correcte (automàtic).
- [ ] `og:image` adequada (hero o default).
- [ ] JSON-LD del tipus correcte.
- [ ] Enllaços interns des de `/productos/`, solució o menú.
- [ ] Imatge hero amb `alt` descriptiu.
- [ ] Contingut únic, no duplicat d'una altra fitxa.
- [ ] Afegida al sitemap (si és indexable).
- [ ] `npm run qa` sense errors.
