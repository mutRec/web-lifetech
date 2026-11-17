---
title: '08 — Escalabilitat i evolució del model'
aliases:
  - Escalar el catàleg
  - Model v2
tags:
  - lifetech
  - astro
  - escalabilitat
  - refactor
  - model-de-dades
updated: 2026-11-17
status: proposta
---

# 08 — Escalabilitat i evolució del model

> [!NOTE]
> Aquest document és **diagnosi i proposta**. Cap dels canvis de codi d'aquesta pàgina està aplicat al projecte. Els esquemes són il·lustratius per dimensionar l'esforç i acordar el rumb.

## 1. Tesi

Astro escala bé: afegeix fitxers, genera rutes, transforma imatges i llest. El que no escala sola és **la informació que s'ha de mantenir en dos llocs**. Avui el projecte té cinc acoblaments manuals que, amb 16 productes, són molestos; amb 100, seran un problema:

1. La navegació duplica els slugs de les col·leccions.
2. `solutions` barreja àmbits i projectes i ho resol amb una heurística.
3. Les especificacions són text lliure sense unitats ni grups.
4. Les descàrregues es declaren a la fitxa i a la pàgina de descàrregues.
5. No hi ha validació de referències ni de col·lisions de rutes.

La bona notícia: cap d'aquests problemes és d'Astro. Tots es poden resoldre **sense canviar de framework** i, en la majoria de casos, **sense canviar URLs**.

## 2. Què escala bé avui

| Capacitat | Per què escala |
|---|---|
| Afegir una pàgina | Un fitxer Markdown + `getStaticPaths` |
| Afegir imatges | `astro:assets` genera renditions automàticament |
| Afegir un idioma de camp | Zod + TypeScript |
| Afegir una secció | Layouts i components reutilitzables |
| Afegir una ruta | Catch-all + slug |
| Desplegar | `dist/` estàtic, sense estat |
| Cache | Assets amb hash, HTML revalidat |
| SEO bàsic | Canonical, sitemap i JSON-LD automàtics |
| Cost | Zero runtime; només build i hosting |

## 3. Llindars i símptomes

| Volum | Què funciona | Què comença a fallar | Què cal |
|---:|---|---|---|
| **10–25 productes** | Model actual | Oblits de navegació, specs inconsistents | Validació de referències |
| **25–50** | Encara acceptable | Navegació manual feixuga; comparació impossible | Navegació derivada; specs tipades |
| **50–200** | Cal refactor | Cerca i filtres necessaris; build més lent | Taxonomies, Pagefind, documents |
| **200–1.000** | Fora del model actual | Build llarg; imatges massives; SEO de variants | Build incremental, CDN d'imatges, i18n, CMS |
| **>1.000** | Cal replantejar | Sitemap i crawl; governança | Arquitectura de catàleg, potser SSR híbrid |

Símptomes que ja es poden observar:

- Afegir una sèrie requereix editar `navigation.ts` i recordar el footer.
- Un `parent` mal escrit no falla: simplement desapareix el breadcrumb.
- Dues fitxes poden tenir `specs` amb unitats diferents (`300 kWh` vs `300kWh`).
- Un PDF nou s'ha de declarar dues vegades.
- El menú mòbil té enllaços hardcoded que no segueixen `mainNav`.

## 4. Diagnosi d'acoblaments

### 4.1 Navegació manual

**Evidència**: `src/data/navigation.ts` conté `products` i `projects` amb slugs escrits a mà. `Header.astro` i `Footer.astro` els importen. La versió mòbil del header té, a més, enllaços fixos (`/nosotros/`, `/contacto/`, `/faqs/`, `/soporte-en-linea/`, `/descarga-productos/`).

**Impacte**: afegir un producte no el fa aparèixer al menú. Afegir una solució requereix tres edicions. El menú mòbil i el d'escriptori poden divergir.

**Solució**: derivar la navegació de les col·leccions amb un camp `nav` o convencions d'ordre.

### 4.2 `solutions` barreja àmbits i projectes

**Evidència**:

```ts
const childKind = data.slug === 'soluciones' ? 'solucion' : 'proyecto';
```

**Impacte**:

- No es poden tenir projectes penjats directament de `/soluciones/`.
- No es poden tenir àmbits amb subàmbits.
- Els camps d'un projecte (client, any, ubicació, resultats) no existeixen a l'esquema.
- El layout ha de saber si l'entrada és àmbit o projecte per decidir com pintar els fills.

**Solució**: camp `type: 'area' | 'project'` o col·lecció `projects` separada. Recomanació: **col·lecció separada**, perquè els camps divergeixen molt i les URLs es poden preservar.

### 4.3 Specs com a text lliure

**Evidència**:

```ts
specs: z.array(z.object({ label: z.string(), value: z.string() }))
```

**Impacte**:

- No es pot filtrar per capacitat, potència o tensió.
- No es poden comparar models.
- No es poden generar taules agrupades.
- Les unitats són inconsistents.
- No es pot validar que `highlights` coincideixi amb `specs`.

**Solució**: specs tipades amb `value` numèric + `unit` + `group`, i un `display` opcional per al text.

### 4.4 Descàrregues duplicades

**Evidència**: `downloads` al frontmatter de cada producte i `groups` a `src/pages/descarga-productos.astro`.

**Impacte**: un PDF nou requereix dues edicions; la pàgina de descàrregues pot quedar desactualitzada; no hi ha versió ni idioma.

**Solució**: col·lecció `documents` amb referències a productes; la pàgina de descàrregues es genera de la col·lecció.

### 4.5 Sense validació de referències ni rutes

**Evidència**: els layouts fan `find` + `filter(Boolean)`. Si el `parent` no existeix, `undefined` i la secció desapareix. `getStaticPaths` no comprova duplicats entre col·leccions.

**Impacte**: errors silenciosos; pàgines òrfenes; enllaços interns que no existeixen.

**Solució**: script de validació post-build o integració d'Astro que construeixi un graf i comprovi:

- Tots els `parent` existeixen.
- Tots els `related` existeixen.
- Tots els `products` existeixen.
- Cap slug duplicat entre col·leccions.
- Cap ruta col·lisiona amb una ruta estàtica.
- Cap entrada indexable fora del sitemap.

### 4.6 Altres

| Acoblament | Evidència | Efecte |
|---|---|---|
| URL en dos llocs | `astro.config.mjs` i `site.ts` | Deriva de canonicals |
| `PUBLIC_SITE_URL` no usada | `env.d.ts` | Falsa sensació de configurabilitat |
| Sitemap exclou tot `/blog/` | `astro.config.mjs` | Articles futurs fora del sitemap |
| Sense taxonomia | No hi ha `tags`/`applications` | No es poden fer landings filtrades |
| Sense variants | `kind: series/model` | Un model amb 3 capacitats no encaixa |
| Sense i18n | Només `es` | Expansió requereix refactor |
| Sense cerca | Cap índex | Catàleg gran sense descobriment |

## 5. Model v2 proposat

### 5.1 Principi

**Una dada, un lloc.** La col·lecció és la font de veritat; la navegació, les pàgines índex, el sitemap i les descàrregues es deriven.

### 5.2 Navegació derivada

Afegir a `products` i `solutions` un camp opcional:

```ts
const nav = z.object({
  show: z.boolean().default(false),
  label: z.string().optional(),
  order: z.number().default(0),
  group: z.enum(['products', 'solutions', 'projects']).optional(),
}).optional();
```

I un helper a `src/lib/navigation.ts`:

```ts
export async function buildNavigation() {
  const [products, solutions] = await Promise.all([
    getCollection('products', ({ data }) => data.nav?.show === true),
    getCollection('solutions', ({ data }) => data.nav?.show === true),
  ]);

  const byGroup = (group: string, entries: typeof products) =>
    entries
      .filter((entry) => entry.data.nav?.group === group)
      .sort((a, b) => (a.data.nav?.order ?? 0) - (b.data.nav?.order ?? 0))
      .map((entry) => ({
        label: entry.data.nav?.label ?? entry.data.title,
        href: `/${entry.data.slug}/`,
      }));

  return {
    products: byGroup('products', products),
    solutions: byGroup('solutions', solutions),
    projects: byGroup('projects', solutions),
  };
}
```

Avantatges:

- Afegir `nav: { show: true, order: 20 }` al frontmatter és suficient.
- El header i el footer comparteixen la mateixa font.
- El menú mòbil es deriva de `mainNav`, no d'enllaços fixos.

Cost: una mica més de complexitat al header; cal decidir si el menú és editorial (manual) o automàtic (derivat). Per a un catàleg, derivat és millor.

### 5.3 Projectes com a col·lecció pròpia

```ts
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),                 // soluciones/<area>/<projecte> per preservar URL
      solution: reference('solutions'), // àmbit pare
      order: z.number().default(0),
      client: z.string().optional(),
      year: z.number().optional(),
      location: z.string().optional(),
      excerpt: z.string(),
      hero: image(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      products: z.array(reference('products')).default([]),
      results: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      seo: seo.optional(),
    }),
});
```

Ruta proposada, **mantenint les URLs actuals**:

```ts
// src/pages/soluciones/[...slug].astro
export async function getStaticPaths() {
  const [areas, projects] = await Promise.all([
    getCollection('solutions'),
    getCollection('projects'),
  ]);

  return [
    ...areas
      .filter((entry) => entry.data.slug !== 'soluciones')
      .map((entry) => ({
        params: { slug: entry.data.slug.replace(/^soluciones\//, '') },
        props: { type: 'area' as const, entry },
      })),
    ...projects.map((entry) => ({
      params: { slug: entry.data.slug.replace(/^soluciones\//, '') },
      props: { type: 'project' as const, entry },
    })),
  ];
}
```

Així `/soluciones/soluciones-industriales-y-comerciales/estacion-de-carga-solar-bess/` no canvia, però els projectes tenen esquema propi i el layout no ha d'endevinar el tipus.

Alternativa si es volen URLs més netes (`/proyectos/<slug>/`): cal redirect 301 i actualitzar enllaços. No recomanat a curt termini per SEO.

### 5.4 Specs tipades

```ts
const specValue = z.union([
  z.object({ kind: z.literal('number'), value: z.number(), unit: z.string() }),
  z.object({ kind: z.literal('text'), value: z.string() }),
  z.object({ kind: z.literal('range'), min: z.number(), max: z.number(), unit: z.string() }),
]);

const spec = z.object({
  group: z.enum(['battery', 'power', 'environment', 'communication', 'mechanics']),
  label: z.string(),
  value: specValue,
  display: z.string().optional(), // per al text exacte de la fitxa
  notes: z.string().optional(),
});
```

Beneficis:

- Filtres (`capacity >= 100`, `chemistry === 'LFP'`).
- Taules agrupades.
- Comparador de models.
- Validació d'unitats.
- `display` preserva el text original (“75 kWh – 1,84 MWh”).

Cost: migrar 16 fitxes; els valors actuals són text i cal normalitzar-los. Es pot fer de forma incremental: mantenir `specs` i afegir `specsStructured` opcional.

### 5.5 Documents com a col·lecció

```ts
const documents = defineCollection({
  loader: glob({ base: './src/content/documents', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['datasheet', 'manual', 'warranty', 'guide', 'certificate']),
    file: z.string(),                 // /descargas/...
    language: z.enum(['es', 'ca', 'en']).default('es'),
    version: z.string().optional(),
    updated: z.coerce.date(),
    products: z.array(reference('products')).default([]),
    seo: seo.optional(),
  }),
});
```

La pàgina `/descarga-productos/` es genera agrupant per `kind`; les fitxes llisten els documents que les referencien. S'elimina la duplicació.

### 5.6 Taxonomies

Per a landings filtrades i cerca:

```ts
const taxonomy = z.object({
  applications: z.array(z.string()).default([]), // residencial, industrial, FV, EV...
  chemistry: z.enum(['LFP', 'NMC', 'other']).optional(),
  format: z.enum(['rack', 'stacked', 'container', 'portable']).optional(),
  phase: z.enum(['single', 'three']).optional(),
});
```

Es pot implementar com a camps a `products` o com a col·lecció `tags` amb referències. Per a un catàleg mitjà, camps és suficient; per a un gran, col·lecció.

### 5.7 Variants

Si un model té diverses capacitats/potències, no cal crear una pàgina per combinació. Opcions:

| Opció | Quan | Cost |
|---|---|---|
| Un model per variant | Poques variants i SEO propi | Moltes pàgines |
| `variants` dins del model | Variants sense URL pròpia | Una pàgina, taula |
| Model + taula de configuracions | El cas habitual | Una pàgina, specs |
| Pàgina per variant amb canonical | SEO fort per variant | Més contingut i manteniment |

Recomanació: **model + taula de configuracions** fins que una variant tingui demanda de cerca pròpia.

### 5.8 Registre de rutes i validació

Un script `scripts/validate-content.mjs` (o una integració `astro:build:done`) que:

1. Carregui totes les col·leccions.
2. Construeixi un mapa `slug → entry`.
3. Comprovi referències.
4. Detecti slugs duplicats entre col·leccions.
5. Detecti rutes que col·lisionen amb pàgines estàtiques.
6. Generi un informe i falli el build si hi ha errors.

Es pot executar dins de `npm run qa` o com a `prebuild`.

## 6. Pla de migració per fases

| Fase | Abast | Fitxers | Esforç | Risc | Criteri d'acceptació |
|---|---|---|---:|---|---|
| **0. Baseline** | CI + validació de referències + smoke tests | `.github/`, `scripts/` | 1–2 dies | Baix | El CI falla si una referència és orfena |
| **1. Navegació derivada** | `nav` a col·leccions + `buildNavigation()` | `content.config.ts`, `navigation.ts`, `Header`, `Footer` | 1–2 dies | Baix | Afegir `nav.show` fa aparèixer l'entrada |
| **2. Projectes** | Col·lecció `projects` + ruta | `content.config.ts`, `soluciones/[...slug].astro`, `SolutionLayout` | 3–5 dies | Mitjà | URLs actuals es mantenen; projectes tenen camps propis |
| **3. Specs i documents** | Specs tipades + `documents` | Esquemes, 16 fitxes, pàgina de descàrregues | 1–2 setmanes | Mitjà-alt | Filtres i descàrregues generades |
| **4. Taxonomia i cerca** | Camps de taxonomia + Pagefind | Esquemes, pàgines de filtre, `_pagefind` | 1 setmana | Mitjà | Cerca funcional i landings filtrades |
| **5. i18n / CMS / híbrid** | Segons trigger | Config, contingut, adaptador | Variable | Alt | Només si el negoci ho demana |

### Ordre recomanat

1. **Fase 0** primer: sense xarxa de seguretat, la resta és més arriscada.
2. **Fase 1** després: baix risc, benefici immediat.
3. **Fase 2** quan hi hagi 3–5 projectes nous o calgui camps de client/any.
4. **Fase 3** quan es vulgui comparar o filtrar.
5. **Fase 4** quan el catàleg superi ~50 productes o hi hagi blog.
6. **Fase 5** només amb un trigger de negoci clar.

### Estratègia de no-breaking change

- Mantenir els camps antics (`specs`, `downloads`) i afegir els nous en paral·lel.
- Fer que els layouts acceptin els dos formats durant una fase.
- No canviar URLs; si cal, redirect 301.
- Versionar l'esquema i documentar la migració.
- No esborrar camps fins que totes les entrades estiguin migrades.

## 7. i18n

Si s'afegeix català o anglès:

```js
// astro.config.mjs
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'ca', 'en'],
  routing: { prefixDefaultLocale: false },
},
```

Opcions de contingut:

| Estratègia | Estructura | Avantatges | Inconvenients |
|---|---|---|---|
| Carpetes per locale | `src/content/products/es/...`, `.../ca/...` | Clara, fàcil de validar | Duplicació d'esquema |
| Camp `locale` | Un fitxer per locale | Flexible | Cal filtrar i relacionar |
| Referència de traducció | `translationKey` compartit | Permet traduccions parcials | Més lògica |

Cal:

- `hreflang` recíproc i canonical per locale.
- Sitemap per locale.
- Slugs traduïts o unificats (decisió SEO).
- Redirects de les URLs actuals.
- Selector d'idioma al header.
- JSON-LD amb `inLanguage` correcte.

Cost estimat: alt. No fer-ho fins que hi hagi una demanda real.

## 8. Cerca

### Pagefind

- Indexa `dist/` després del build: `npx pagefind --site dist`.
- Genera `dist/pagefind/` amb índex estàtic i UI pròpia.
- No necessita servidor.
- Suporta filtres per metadata (`data-pagefind-filter`).
- Cost: ~1 dia d'integració + ajustos d'UI.

### Alternativa JSON + Fuse.js

- Generar un `search-index.json` amb títol, excerpt, URL i tags.
- Carregar-lo sota demanda.
- Més control, menys funcionalitats.
- Pitjor per a catàlegs grans.

Recomanació: Pagefind quan el catàleg+b blog superi ~50 entrades.

## 9. CMS

| Opció | Tipus | Avantatges | Inconvenients |
|---|---|---|---|
| **Decap CMS** | Git-based | Gratis, Markdown, encaixa amb l'esquema | UI antiga, auth Git |
| **Sveltia CMS** | Git-based | Modern, més ràpid, compatible Decap | Més nou |
| **Keystatic** | Git-based | TypeScript, bona DX, Astro-friendly | Requereix configuració |
| **Sanity** | API | Editing potent, preview, col·laboració | Cost, dependència externa |
| **Storyblok** | API | Visual editing | Cost, complexitat |
| **Contentful** | API | Madur | Cost, sobreenginyeria |

Per a aquest equip, **Git-based** és la millor opció: el contingut continua sent Markdown, l'esquema Zod es manté i no s'afegeix runtime. Decap/Sveltia permeten editar sense tocar Git directament.

## 10. Quan passar a híbrid/SSR

| Necessitat | Solució |
|---|---|
| Preus o stock en temps real | SSR/híbrid o API client |
| Configurador de producte | Illa interactiva o API |
| Login de distribuïdors | SSR + auth |
| Formulari propi | Endpoint serverless/API |
| Personalització per compte | SSR o edge |
| A/B testing | Client o edge |
| Cerca avançada | Pagefind o servei extern |

Mentre no hi hagi cap d'aquestes, **no cal adaptador**. Si n'hi ha una, es pot fer híbrid: mantenir les rutes de contingut estàtiques i renderitzar només les dinàmiques.

## 11. Rendiment del build a escala

Amb 200 productes i 5 imatges cadascun, `astro:assets` pot generar milers de fitxers. Mesures:

- Limitar les amplades a les necessàries (no 5 si només se'n fan servir 3).
- Usar `loading="lazy"` i `sizes` correctes.
- Considerar un CDN d'imatges (Cloudinary, imgix) si el build es dispara.
- Cachejar `.astro` i `node_modules` al CI/Docker.
- Paral·lelitzar el build (Astro ja ho fa per pàgines).
- Dividir el sitemap si supera 50.000 URLs (no serà el cas).
- Monitoritzar el temps de build; pressupost: **< 3 min** per a 100 pàgines.

## 12. Governança

- **Esquema versionat**: quan es canvia un camp, documentar-ho a [10](10-adr-registre-de-decisions.md).
- **Revisió de contingut**: checklist de [07](07-guia-afegir-productes-i-projectes.md).
- **Redirects**: registre `URL antiga → nova → motiu`.
- **Deprecacions**: mantenir camps antics un cicle, després eliminar.
- **Mètriques**: nombre d'entrades, temps de build, mida de `dist/`, pàgines indexades, errors 404.

## 13. Matriu de decisió

| Si... | Llavors... |
|---|---|
| Afegeixes 1–2 productes l'any | No cal refactor; receptes de [07](07-guia-afegir-productes-i-projectes.md) |
| Afegeixes productes cada mes | Fase 1 (navegació derivada) |
| Necessites comparar models | Fase 3 (specs tipades) |
| Tens >5 projectes | Fase 2 (col·lecció `projects`) |
| Tens >50 productes | Fase 4 (taxonomia + Pagefind) |
| Un editor no tècnic publica | CMS Git-based |
| Necessites català/anglès | i18n |
| Necessites preus/stock | Híbrid/SSR o API |
| El build supera 5 min | CDN d'imatges + caché de build |
