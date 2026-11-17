---
title: '09 — Deute tècnic i riscos'
aliases:
  - Riscos LifeTech
  - Deute tècnic
tags:
  - lifetech
  - riscos
  - deute-tecnic
  - prioritzacio
updated: 2026-11-17
status: vigent
---

# 09 — Deute tècnic i riscos

Registre prioritzat de problemes detectats a l'auditoria. Cada risc té evidència, impacte, probabilitat, esforç i mitigació. L'objectiu no és fer una llista de desitjos, sinó decidir **què es toca ara, què s'espera i què no val la pena**.

## 1. Mètode

| Camp | Escala |
|---|---|
| **Impacte** | Alt: afecta SEO, conversió o correcció del contingut. Mitjà: afecta manteniment. Baix: cosmètic |
| **Probabilitat** | Alta: passa segur en créixer. Mitjana: pot passar. Baixa: cal un cas estrany |
| **Esforç** | XS < 2 h, S < 1 dia, M 1–3 dies, L 1–2 setmanes |
| **Prioritat** | P0: ara; P1: proper sprint; P2: proper trimestre; P3: backlog |

## 2. Registre

| ID | Trobada | Evidència | Impacte | Prob. | Esforç | Prioritat |
|---|---|---|---|---|---:|---|
| **R-01** | Navegació duplicada a `navigation.ts` | `src/data/navigation.ts:25-96`; `Header.astro:216-296` | Alt | Alta | S | **P1** |
| **R-02** | `solutions` barreja àmbits i projectes | `src/layouts/SolutionLayout.astro:42` | Alt | Alta | M | **P1** |
| **R-03** | Referències orfes silencioses | `src/pages/[...slug].astro:66-74`; `soluciones/[...slug].astro:36-46` | Alt | Alta | S | **P1** |
| **R-04** | Specs com a text sense unitats | `src/content.config.ts:35` | Mitjà | Alta | L | P2 |
| **R-05** | URL hardcoded en dos llocs; `PUBLIC_SITE_URL` no usada | `astro.config.mjs:7`; `src/data/site.ts:9`; `src/env.d.ts:5` | Alt | Mitjana | XS | **P1** |
| **R-06** | Descàrregues duplicades | `src/content.config.ts:36-44`; `src/pages/descarga-productos.astro:11-55` | Mitjà | Alta | M | P2 |
| **R-07** | Sitemap exclou tot `/blog/` | `astro.config.mjs:24-27` | Mitjà | Alta (en publicar blog) | XS | **P1** |
| **R-08** | QA amb punts cecs SEO/a11y | `scripts/qa.mjs:51-75` | Mitjà | Alta | M | **P1** |
| **R-09** | Sense CI ni tests | No hi ha `.github/workflows/` | Mitjà | Mitjana | S | **P1** |
| **R-10** | CSP en `Report-Only` indefinidament | `deploy/nginx/security-headers.conf:8-12` | Mitjà | Mitjana | M | P2 |
| **R-11** | Menú mòbil hardcoded i sense focus trap | `Header.astro:216-296, 443-472` | Mitjà | Mitjana | S | P2 |
| **R-12** | Dependències mortes (`mdx`, `rss`) | `package.json:20-21`; 0 `.mdx`; cap ruta RSS | Baix | Baixa | XS | P3 |
| **R-13** | `dist/` local desactualitzat | `dist/` no inclou `/productos/` | Baix | Baixa | XS | P3 |
| **R-14** | `Organization` vs `LocalBusiness` | `src/lib/schema.ts:14-17` | Baix | Mitjana | XS | P3 |
| **R-15** | Sense i18n ni cerca | Config i rutes actuals | Mitjà (futur) | Baixa | L | P3 |

## 3. Fitxes dels riscos principals

### R-01 — Navegació duplicada

**Què passa**

`navigation.ts` conté els productes, les solucions i els projectes escrits a mà. El header i el footer els importen. La versió mòbil del header torna a escriure alguns enllaços directament.

**Per què importa**

- Afegir un producte no el fa aparèixer al menú.
- Afegir una solució requereix editar `solutions` i, si és un projecte, `projects`.
- El menú mòbil pot divergir del d'escriptori.
- Els slugs poden quedar desincronitzats de les col·leccions.

**Evidència**

```ts
// src/data/navigation.ts
export const products: NavLink[] = [
  { label: 'RESS', href: '/ress/' },
  // ...
];
```

```astro
<!-- Header.astro, versió mòbil -->
<a href="/nosotros/">Nosotros</a>
<a href="/contacto/">Contacto</a>
<a href="/faqs/">FAQs</a>
```

**Mitigació**

1. Afegir `nav: { show, label, order, group }` a les col·leccions.
2. Crear `buildNavigation()` a `src/lib/navigation.ts`.
3. Fer que header, footer i mòbil consumeixin la mateixa estructura.
4. Eliminar els enllaços hardcoded del mòbil.

**Esforç**: S (1 dia). **Risc del canvi**: baix.

### R-02 — `solutions` barreja àmbits i projectes

**Què passa**

Una sola col·lecció i una heurística:

```ts
const childKind = data.slug === 'soluciones' ? 'solucion' : 'proyecto';
```

**Per què importa**

- No es poden afegir camps de projecte (client, any, ubicació, resultats).
- No es poden fer jerarquies de més de dos nivells.
- El layout ha de saber què és cada entrada per decidir com pintar-la.
- Un projecte penjat directament de `/soluciones/` es tractaria com un àmbit.

**Mitigació**

Separar `projects` en una col·lecció pròpia amb `solution: reference('solutions')`, mantenint les URLs actuals via `getStaticPaths`. Vegeu [08](08-escalabilitat-i-evolucio-del-model.md), §5.3.

**Esforç**: M (3–5 dies). **Risc**: mitjà; cal migrar 5 projectes i provar totes les URLs.

### R-03 — Referències orfes silencioses

**Què passa**

Els layouts fan:

```ts
const parent = allProducts.find((item) => item.id === entry.data.parent?.id);
const related = entry.data.related
  .map((reference) => allProducts.find((item) => item.id === reference.id))
  .filter((item): item is CollectionEntry<'products'> => Boolean(item));
```

Si el `parent` o un `related` no existeix, el resultat és `undefined` i es descarta. **El build no falla.**

**Per què importa**

- Un error tipogràfic en un slug elimina el breadcrumb o una targeta sense avís.
- Pot passar desapercebut durant mesos.
- El contingut sembla correcte però està incomplet.

**Mitigació**

Script de validació:

```js
// pseudo
for (const entry of products) {
  if (entry.data.parent && !ids.has(entry.data.parent.id)) fail(...);
  for (const ref of entry.data.related) if (!ids.has(ref.id)) fail(...);
}
```

Afegir-lo a `npm run qa` o com a `prebuild`. També ha de comprovar `solutions.parent` i `solutions.products`.

**Esforç**: S (mig dia). **Risc del canvi**: nul (només afegeix validació).

### R-05 — URL en dos llocs i variable no usada

**Què passa**

- `astro.config.mjs` defineix `const SITE = 'https://life-tech.es'`.
- `src/data/site.ts` defineix `url: 'https://life-tech.es'`.
- `src/env.d.ts` declara `PUBLIC_SITE_URL`.
- `.env.example` la documenta.
- **No s'usa enlloc.**

**Per què importa**

Canviar de domini o provar staging pot deixar canonicals, sitemap o JSON-LD apuntant al lloc equivocat. `PUBLIC_SITE_URL` dona una falsa sensació de configurabilitat.

**Mitigació**

Opció A (mínima):

```js
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://life-tech.es';
```

I a `site.ts`:

```ts
url: import.meta.env.PUBLIC_SITE_URL ?? 'https://life-tech.es',
```

Opció B (més neta): una sola font en un mòdul compartit que importin tots dos. Astro config pot importar un fitxer TS/JS.

**Esforç**: XS. **Risc**: baix.

### R-07 — Sitemap i blog

**Què passa**

```js
filter: (page) =>
  !page.includes('/gracias/') &&
  !page.includes('/politica-de-cookies-ue/') &&
  !page.includes('/blog/'),
```

Mentre el blog està buit, és correcte. Quan es publiqui el primer article, **tots** els articles quedaran fora del sitemap.

**Mitigació**

- Quan el blog estigui actiu, eliminar la condició `/blog/`.
- Si es volen excloure esborranys, no generar ruta per a `draft: true` i deixar que el sitemap inclogui només les rutes generades.
- Documentar-ho a [07](07-guia-afegir-productes-i-projectes.md), recepta 5.

**Esforç**: XS. **Risc**: alt si s'oblida; baix si es documenta.

### R-08 — QA amb punts cecs

**Què passa**

`scripts/qa.mjs` valida títol, h1, canonical, JSON-LD parsejable, `alt`, enllaços interns i fitxers obligatoris. No valida:

- Descripció ni longitud.
- Canonical correcte.
- OG/Twitter.
- Semàntica del JSON-LD.
- Referències de contingut.
- Cobertura del sitemap.
- Accessibilitat ni rendiment.

**Mitigació**

Ampliar el script per fases:

1. `meta description` i canonical esperat.
2. OG/Twitter + URL absoluta.
3. Referències de col·leccions.
4. Sitemap vs rutes indexables.
5. Lighthouse CI.

**Esforç**: M. **Risc**: baix.

### R-09 — Sense CI

**Què passa**

No hi ha `.github/workflows/`. Les validacions depenen de fer-les a mà. Un `build` trencat es pot descobrir a Dokploy.

**Mitigació**

Pipeline de [06](06-qualitat-operacions-i-desplegament.md), §4: `npm ci`, `format:check`, `check`, `build`, `qa`, artifact. Opcional: Lighthouse CI i Docker build.

**Esforç**: S. **Risc**: baix.

## 4. Riscos de seguretat i operacions

| Risc | Detall | Prioritat |
|---|---|---|
| CSP Report-Only | No protegeix; només reporta | P2 |
| `unsafe-inline` | Necessari per scripts/estils inline | P2 |
| nginx root | El master corre com a root | P3 |
| Sense `npm audit` | Dependències no revisades | P2 |
| Formulari third-party | Dades a Web3Forms; documentat | Acceptat |
| Sense rate limit | nginx estàtic; Web3Forms filtra | Acceptat |
| Sense còpia de PDFs | Són a Git; si es perden, es recuperen | Acceptat |

## 5. Riscos de contingut i SEO

| Risc | Detall | Prioritat |
|---|---|---|
| Canonical erroni per domini | R-05 | P1 |
| Articles fora del sitemap | R-07 | P1 |
| Referències orfes | R-03 | P1 |
| Descripcions duplicades | No validat | P2 |
| Títols massa llargs | No validat | P2 |
| Imatges OG no òptimes | Hero no 1200×630 | P2 |
| `og:image:alt` genèric | `SEO.astro:70` | P3 |
| Sense `Article` schema | Blog no actiu | P3 |
| Sense `sameAs` | `site.sameAs` buit | P3 |

## 6. Què **no** val la pena fer ara

| Idea | Per què no |
|---|---|
| Canviar de framework | Astro és adequat; el problema és el model |
| Afegir un CMS | L'equip pot editar Markdown; el cost no compensa encara |
| Afegir tests unitaris a tot | El build + QA cobreixen el 80% amb menys manteniment |
| Optimitzar els 30 MB de `dist/` | Els PDFs no es descarreguen en navegar |
| Afegir SSR | No hi ha cap necessitat dinàmica |
| Migrar a TypeScript estricte màxim | Ja s'usa `strict`; no cal més |
| Reescriure el header amb React | Afegiria JS i complexitat sense benefici |

## 7. Full de ruta prioritzat

### Sprint 1 — Xarxa de seguretat (1 setmana)

- [ ] R-05: unificar la URL.
- [ ] R-03: validació de referències i rutes.
- [ ] R-09: CI bàsic.
- [ ] R-07: documentar i parametritzar el filtre del blog.

**Resultat**: els errors de contingut fallen al CI, no a producció.

### Sprint 2 — Model (1–2 setmanes)

- [ ] R-01: navegació derivada.
- [ ] R-02: col·lecció `projects`.
- [ ] R-08: ampliar QA (description, canonical, OG).

**Resultat**: afegir contingut no requereix recordar tres fitxers.

### Sprint 3 — Catàleg (2–3 setmanes)

- [ ] R-04: specs tipades (o camps addicionals).
- [ ] R-06: col·lecció `documents`.
- [ ] Taxonomia bàsica.
- [ ] Pagefind si >50 entrades.

**Resultat**: es pot filtrar, comparar i descarregar sense duplicació.

### Backlog

- [ ] R-10: CSP enforcing.
- [ ] R-11: accessibilitat del menú mòbil.
- [ ] R-12: netejar dependències.
- [ ] R-13: regenerar `dist/` o ignorar-lo (ja és a `.gitignore`).
- [ ] R-14: `LocalBusiness`.
- [ ] R-15: i18n/cerca si el negoci ho demana.

## 8. Mètriques de salut

| Mètrica | Objectiu | Com mesurar |
|---|---|---|
| Pàgines amb problemes de QA | 0 | `npm run qa` |
| Referències orfes | 0 | Script de validació |
| Enllaços trencats | 0 | `npm run qa` |
| Pàgines indexables fora del sitemap | 0 | Comparació |
| Temps de build | < 3 min per a 100 pàgines | `time npm run build` |
| Mida HTML mitjana | < 60 KB | `dist/` |
| LCP mòbil | < 2,5 s | PageSpeed |
| Errors 404 | < 1% de sessions | Search Console/nginx |
| Formularis lliurats | > 95% | Web3Forms |

## 9. Revisió

Aquest registre s'hauria de revisar:

- Cada cop que s'afegeix una col·lecció o camp.
- Cada cop que es publica contingut massiu.
- Cada trimestre, encara que no passi res.
- Abans de qualsevol refactor gran.
