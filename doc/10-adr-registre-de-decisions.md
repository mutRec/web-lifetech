---
title: '10 — Registre de decisions (ADR)'
aliases:
  - ADR LifeTech
  - Decisions d'arquitectura
tags:
  - lifetech
  - adr
  - decisions
  - arquitectura
updated: 2026-11-17
status: vigent
---

# 10 — Registre de decisions (ADR)

Un **ADR** (*Architecture Decision Record*) documenta una decisió, el context i les conseqüències. No és documentació de com funciona el codi, sinó de **per què** és així i què implica canviar-ho.

## Format

Cada ADR té:

- **Context**: la situació i les forces en joc.
- **Decisió**: què es va triar.
- **Estat**: acceptat, provisional, substituït, obsolet.
- **Conseqüències**: què guanyem i què perdem.
- **Alternatives**: què es va descartar i per què.

## Índex

| ADR | Decisió | Estat |
|---|---|---|
| **ADR-001** | Lloc estàtic amb Astro | Acceptat |
| **ADR-002** | Content Collections amb Zod | Acceptat |
| **ADR-003** | `slug = id = URL` | Acceptat |
| **ADR-004** | Una sola col·lecció de solucions | Acceptat amb deute |
| **ADR-005** | Tailwind CSS 4 sense config | Acceptat |
| **ADR-006** | Fonts self-hosted amb preload | Acceptat |
| **ADR-007** | nginx + Docker + Dokploy | Acceptat |
| **ADR-008** | Formulari amb Web3Forms | Acceptat |
| **ADR-009** | Analítica sense cookies | Acceptat |
| **ADR-010** | Preservar URLs i barra final | Acceptat |
| **ADR-011** | JSON-LD en blocs separats | Acceptat |
| **ADR-012** | Sense i18n a la v1 | Provisional |

---

## ADR-001 — Lloc estàtic amb Astro

**Context**

Web corporatiu i de catàleg, sense usuaris, sense base de dades, sense ecommerce. Contingut textual que ha de posicionar. Equip petit. Migració des de WordPress + Divi amb terminis.

**Decisió**

Generar el lloc amb Astro en mode **estàtic** (`output: 'static'` per defecte), sense adaptador. El build produeix `dist/` i nginx el serveix.

**Estat**

Acceptat.

**Conseqüències**

- ✅ TTFB baix, cacheabilitat, zero runtime, zero cost de servidor d'aplicació.
- ✅ Superfície de seguretat mínima.
- ✅ Deploy trivial (contenidor nginx).
- ❌ Publicar requereix build.
- ❌ No hi ha personalització ni dades en temps real.
- ❌ La cerca i la interactivitat requereixen solucions client o build-time.

**Alternatives**

- WordPress: descartat per pes, manteniment i CWV.
- Next.js/Nuxt: descartat per sobreenginyeria sense backend.
- Eleventy/Hugo: viable, però menys ecosistema d'imatges i components.

---

## ADR-002 — Content Collections amb Zod

**Context**

Productes, solucions, projectes, legals i blog comparteixen formes repetibles. Cal validar, tipar i permetre edició sense tocar plantilles.

**Decisió**

Fer servir Content Collections amb loader `glob` i esquemes Zod a `src/content.config.ts`. Les pàgines úniques (home, contacto, FAQs) queden com a `.astro`.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Validació en build; errors detectats abans de publicar.
- ✅ Tipus inferits i autocompletat.
- ✅ Contingut separat de presentació.
- ❌ Cal mantenir l'esquema.
- ❌ Un canvi de camp pot requerir migrar entrades.
- ❌ No hi ha CMS visual.

**Alternatives**

- Dades hardcoded a `.astro`: massa duplicació.
- Markdown sense esquema: sense validació.
- CMS API: massa complexitat per a l'equip actual.

---

## ADR-003 — `slug = id = URL`

**Context**

Cal una identitat estable per a cada entrada que serveixi alhora per a la URL, les referències i el routing.

**Decisió**

El camp `slug` del frontmatter és la ruta completa sense barres. El loader `glob` el converteix en `id` de l'entrada. Totes les referències (`parent`, `related`, `products`) usen aquest valor.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Una sola font d'identitat.
- ✅ `getStaticPaths` trivial.
- ✅ Referències llegibles (`ress/ress-300-200`).
- ❌ Renombrar és una operació global.
- ❌ Un error de referència és silenciós.
- ❌ El `slug` ha de ser únic a la col·lecció i no ha de col·lisionar amb rutes estàtiques.

**Alternatives**

- `id` separat de `slug`: més flexible, més complex, dues fonts de veritat.
- `id` derivat del path del fitxer: obligaria a noms de fitxer amb barres, impossible.

---

## ADR-004 — Una sola col·lecció de solucions

**Context**

El web té àmbits de solució (residencial, industrial, plantes FV) i projectes niats sota industrial. Comparteixen hero, excerpt, stats i productes relacionats.

**Decisió**

Una sola col·lecció `solutions` amb `parent` opcional. L'índex `/soluciones/` és una entrada més. Els fills de l'índex es tracten com a àmbits; els fills d'un àmbit, com a projectes.

**Estat**

**Acceptat amb deute.** Funciona per a l'arbre actual, però la heurística `slug === 'soluciones'` no escala.

**Conseqüències**

- ✅ Menys col·leccions i menys codi ara.
- ✅ URLs niades sense fitxers de ruta addicionals.
- ❌ Barreja models de dades diferents.
- ❌ No hi ha camps de projecte (client, any, ubicació).
- ❌ Jerarquies de més de dos nivells no encaixen.
- ❌ El layout ha d'endevinar el tipus.

**Alternatives**

- Col·lecció `projects` separada: recomanada a mig termini ([08](08-escalabilitat-i-evolucio-del-model.md)).
- Camp `type`: més simple, però els camps segueixen barrejats.

---

## ADR-005 — Tailwind CSS 4 sense config

**Context**

Cal un sistema de disseny consistent, tokens de marca i utility classes, amb un build ràpid.

**Decisió**

Tailwind 4 via `@tailwindcss/vite`, sense `tailwind.config.js`. Els tokens es declaren a `src/styles/global.css` amb `@theme`.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Un sol fitxer de configuració visual.
- ✅ Tokens disponibles com a variables CSS i classes.
- ✅ Build ràpid amb Vite.
- ❌ Qui busqui `tailwind.config.js` no el trobarà.
- ❌ Cal conèixer la sintaxi `@theme` de Tailwind 4.
- ❌ Algunes integracions de tercers esperen config JS.

**Alternatives**

- Tailwind 3 amb config: més familiar, menys modern.
- CSS a mida: més control, més codi i menys consistència.

---

## ADR-006 — Fonts self-hosted amb preload

**Context**

La marca fa servir Montserrat (display) i Open Sans (text). Carregar-les des de Google Fonts afegeix una connexió externa, latència i problemes de privacitat.

**Decisió**

Fontsource via `fontProviders.fontsource()` d'Astro, subsets llatins, pesos variables, `preload` a `BaseLayout`.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Sense dependència de Google en runtime.
- ✅ Més privacitat i control.
- ✅ `woff2` amb hash i cache immutable.
- ❌ Dues peticions crítiques addicionals.
- ❌ Cal regenerar si canvia la tipografia.
- ❌ El subset llatí no cobreix símbols rars.

**Alternatives**

- Google Fonts: més simple, pitjor privacitat i latència.
- Fonts del sistema: zero peticions, però perd identitat de marca.

---

## ADR-007 — nginx + Docker + Dokploy

**Context**

Cal servir un lloc estàtic amb redirects, headers de seguretat, caché i un healthcheck. L'equip fa servir Dokploy.

**Decisió**

Imatge multi-stage: Node per construir, nginx per servir. Configuració pròpia a `deploy/nginx/`. Desplegament a Dokploy amb Build Type **Dockerfile**, no Static.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Control total de redirects, headers i caché.
- ✅ Build reproduïble.
- ✅ Healthcheck i rollback.
- ❌ Cal mantenir Docker i nginx.
- ❌ El build es fa al servidor o al CI.
- ❌ El tipus Static de Dokploy trencaria la configuració.

**Alternatives**

- Hosting estàtic (Netlify/Vercel/Cloudflare): més simple, menys control de redirects 410 i headers.
- nginx del sistema: menys reproduïble.

---

## ADR-008 — Formulari amb Web3Forms

**Context**

Cal un formulari de contacte sense backend, amb correu a `info@life-tech.es` i protecció anti-spam bàsica.

**Decisió**

Formulari HTML amb `action` de Web3Forms, clau pública, honeypot i enhancement JS per `fetch` i redirect a `/gracias/`.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Zero backend.
- ✅ Funciona sense JS.
- ✅ Honeypot i filtres del proveïdor.
- ❌ Dependència d'un tercer.
- ❌ La clau és pública (per disseny).
- ❌ Sense validació de servidor pròpia.
- ❌ La deliverability depèn de Web3Forms.

**Alternatives**

- Endpoint serverless: més control, més manteniment.
- `mailto:`: mala experiència.
- Formspree/Netlify Forms: similars, menys integrats.

---

## ADR-009 — Analítica sense cookies

**Context**

Cal mesurar visites sense banner de consentiment i amb respecte per la privacitat.

**Decisió**

Umami Cloud, només producció, `data-do-not-track`, domini restringit, sense cookies.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Sense banner de cookies.
- ✅ Mètriques bàsiques de tràfic.
- ✅ Més privacitat.
- ❌ Menys funcionalitats que GA4.
- ❌ Dependència d'Umami Cloud.
- ❌ Si s'afegeix GA4/Pixel, caldrà consentiment.

**Alternatives**

- GA4: potent, però cookies i consentiment.
- Plausible: similar, de pagament.
- Autoallotjat: més control, més manteniment.

---

## ADR-010 — Preservar URLs i barra final

**Context**

El WordPress original serveix totes les URLs amb barra final. Hi ha URLs indexades i enllaços externs.

**Decisió**

`trailingSlash: 'always'`, `build.format: 'directory'`, slugs idèntics als originals i redirects 301/410 a nginx.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Preserva SEO i enllaços.
- ✅ Evita canònics duplicats.
- ✅ Redirects clars per a canvis.
- ❌ Tots els enllaços interns han de portar barra.
- ❌ Un enllaç sense barra genera un 301.
- ❌ Cal mantenir el registre de redirects.

**Alternatives**

- Sense barra final: canvi massiu d'URLs i redirects.
- Ambdues: contingut duplicat.

---

## ADR-011 — JSON-LD en blocs separats

**Context**

Cal structured data per a organització, web, pàgines, productes, breadcrumbs i FAQ.

**Decisió**

`SEO.astro` injecta `Organization` + `WebSite` + el JSON-LD de la pàgina en un `<script>`. `Breadcrumbs` n'injecta un altre amb `BreadcrumbList`.

**Estat**

Acceptat.

**Conseqüències**

- ✅ Simple de compondre.
- ✅ Cada component és responsable del seu schema.
- ✅ Fàcil d'afegir tipus.
- ❌ No hi ha un `@graph` únic.
- ❌ Possibles `@id` duplicats si dos components emeten el mateix tipus.
- ❌ El validador pot veure entitats separades.

**Alternatives**

- Un sol graf global: més net, però més acoblament.
- Cap JSON-LD: pitjor SEO.

---

## ADR-012 — Sense i18n a la v1

**Context**

El web original tenia alguna URL catalana, però el contingut actual és castellà. L'equip no ha demanat multiidioma.

**Decisió**

Només `es-ES`. Es mantenen redirects de `/ca/*` per herència, però no hi ha rutes ni contingut en català.

**Estat**

**Provisional.** Es revisarà si hi ha expansió a Catalunya o mercats internacionals.

**Conseqüències**

- ✅ Menys complexitat i menys contingut a mantenir.
- ✅ Un sol sitemap i un sol canonical per pàgina.
- ❌ No es pot posicionar en català/anglès.
- ❌ Afegir i18n després requerirà routing, contingut i hreflang.

**Alternatives**

- i18n des del principi: més cost i contingut duplicat.
- Subdominis per idioma: aïllament, més complexitat.

---

## Com afegir un ADR

1. Copia el format.
2. Numera'l correlativament.
3. Explica el context **abans** de la decisió.
4. Inclou les conseqüències negatives: un ADR sense contrapartides és sospitós.
5. Actualitza l'índex i la data.
6. Si substitueix un ADR anterior, marca'l com a **substituït** i enllaça'l.

## Decisions pendents de formalitzar

| Tema | Estat |
|---|---|
| Navegació derivada vs manual | Proposat a [08](08-escalabilitat-i-evolucio-del-model.md) |
| Col·lecció `projects` separada | Proposat |
| Specs tipades | Proposat |
| Col·lecció `documents` | Proposat |
| CMS Git-based | Pendent de trigger |
| Pagefind | Pendent de volum |
| CSP enforcing | Pendent de revisió de violacions |
| `LocalBusiness` | Pendent de decisió SEO local |
