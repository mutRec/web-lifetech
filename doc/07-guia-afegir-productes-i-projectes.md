---
title: '07 — Guia per afegir productes i projectes'
aliases:
  - Receptes de contingut
  - Com afegir un producte
tags:
  - lifetech
  - contingut
  - guia
  - productes
  - projectes
updated: 2026-11-17
status: vigent
---

# 07 — Guia per afegir productes i projectes

Receptes operatives per afegir contingut sense tocar codi (o tocant-ne el mínim). Cada recepta indica què es crea, què s'actualitza, com es verifica i quins errors són típics.

> [!IMPORTANT]
> Abans de començar, recorda la regla: **`slug` = `id` = URL**. El `slug` d'un model inclou la sèrie; el d'un projecte inclou l'àmbit. Les referències (`parent`, `related`, `products`) han de fer servir exactament aquest valor.

## 0. Convencions prèvies

| Element | Convenció |
|---|---|
| Idioma del contingut | Castellà |
| Idioma del codi i comentaris | Català |
| Slugs | Minúscules, ASCII, guions, sense accents |
| Fitxers | Nom alineat amb el slug final |
| `order` | 10, 20, 30… per deixar marge |
| Imatges | WebP, `src/assets/images/<grup>/` |
| Hero | `<slug>-hero.webp` |
| `excerpt` | 1–2 frases, 120–160 caràcters |
| `seo.description` | ≤ 160 caràcters (Zod) |
| `alt` | Descriptiu, no “imagen de…” |
| `related` | No autoreferenciar-se |

## 1. Recepta: afegir un model a una sèrie existent

### Exemple: `RESS 400-250`

**1. Prepara la imatge**

```text
src/assets/images/products/ress-400-250-hero.webp
src/assets/images/products/ress-400-250-2.webp   (opcional)
```

**2. Crea el fitxer**

`src/content/products/ress-400-250.md`

```yaml
---
title: RESS 400-250
slug: ress/ress-400-250
kind: model
parent: ress
order: 5
excerpt: 'Nueva configuración de 400 kWh y 250 kW para proyectos industriales de mayor escala.'
hero: ../../assets/images/products/ress-400-250-hero.webp
gallery:
  - src: ../../assets/images/products/ress-400-250-2.webp
    alt: RESS 400-250, vista general
features:
  - icon: lucide:maximize
    title: Escalabilidad
    text: Varias unidades en paralelo para alcanzar capacidades de mWh.
highlights:
  - value: 400 kWh
    label: Capacidad
  - value: 250 kW
    label: Potencia del convertidor
specs:
  - label: Capacidad
    value: 400 kWh
  - label: Potencia del convertidor
    value: 250 kW
  - label: Tensión nominal de batería
    value: 768 VDC
downloads:
  - label: Ficha técnica RESS
    kind: datasheet
    href: /descargas/ficha-tecnica-ress.pdf
related:
  - ress/ress-300-200
  - ress/ress-225-150
seo:
  description: RESS 400-250 de LifeTech, 400 kWh y 250 kW para almacenamiento industrial y plantas FV.
---

## Texto de la ficha

Contenido narrativo en Markdown...
```

**3. Comprova**

```bash
npm run check
npm run build
npm run qa
npm run preview
```

- [ ] `/ress/ress-400-250/` respon 200.
- [ ] El breadcrumb mostra `Productos → RESS → RESS 400-250`.
- [ ] La fitxa de `ress` llista el nou model.
- [ ] Els relacionats es veuen.
- [ ] El sitemap inclou la URL.

**No cal tocar** `navigation.ts` si el model no ha de sortir al menú (els models no hi surten; les sèries sí).

## 2. Recepta: afegir una sèrie nova

### Exemple: `LT-MAX`

**1. Crea el fitxer de la sèrie**

`src/content/products/lt-max.md`

```yaml
---
title: LT-MAX Series
slug: lt-max-series
kind: series
order: 80
excerpt: 'Nueva familia de baterías LFP de alta densidad para instalaciones de gran capacidad.'
hero: ../../assets/images/products/lt-max-series-hero.webp
gallery:
  - src: ../../assets/images/products/lt-max-series-2.webp
    alt: LT-MAX Series, vista frontal
features:
  - icon: lucide:battery-charging
    title: Alta densidad
    text: Más capacidad en el mismo espacio.
highlights:
  - value: 10–30 kWh
    label: Rango por módulo
specs:
  - label: Química
    value: LFP
downloads:
  - label: Ficha técnica LT-MAX
    kind: datasheet
    href: /descargas/ficha-tecnica-lt-max.pdf
related:
  - lv-lite-series
  - hv-lite-series
seo:
  description: LT-MAX Series de LifeTech, baterías LFP de alta densidad para instalaciones de gran capacidad.
---
```

**2. Afegeix els models**

Un fitxer per model, amb `parent: lt-max-series` i `slug: lt-max-series/<model>`.

**3. Actualitza la navegació**

`src/data/navigation.ts`:

```ts
export const products: NavLink[] = [
  // ...
  { label: 'LT-MAX Series', href: '/lt-max-series/' },
];
```

El footer es deriva de `products`, així que s'actualitza sol. El mega-menú i el menú mòbil també llegeixen `products` (el mòbil només les columnes; els enllaços directes estan hardcoded — vegeu [09](09-deute-tecnic-i-riscos.md)).

**4. Comprova**

- [ ] `/lt-max-series/` i els models responen 200.
- [ ] `/productos/` mostra la sèrie i el recompte de models.
- [ ] El menú i el footer mostren la sèrie.
- [ ] El sitemap inclou totes les URLs.
- [ ] La sèrie apareix a “Productos relacionados” si escau.

**5. Si la sèrie no té models**

És vàlid. `children` serà buit i la secció “Configuraciones” no es renderitzarà.

## 3. Recepta: afegir un projecte

Els projectes són entrades de `solutions` amb `parent` apuntant a un àmbit.

### Exemple: projecte a industrial

`src/content/solutions/microgrid-industrial-port.md`

```yaml
---
title: Microgrid industrial en el puerto
slug: soluciones/soluciones-industriales-y-comerciales/microgrid-industrial-puerto
parent: soluciones/soluciones-industriales-y-comerciales
order: 6
eyebrow: Proyecto industrial
excerpt: 'Microgrid con FV, BESS y gestión de demanda para garantizar suministro en muelles y almacenes.'
hero: ../../assets/images/solutions/microgrid-puerto-hero.webp
icon: lucide:container
stats:
  - value: 1,2 MWh
    label: Almacenamiento
  - value: 500 kWp
    label: Cubierta FV
  - value: 24/7
    label: Monitorización
products:
  - ress
  - lt-hv
seo:
  description: Microgrid industrial con 1,2 MWh de almacenamiento y 500 kWp de FV en un entorno portuario.
---

## Contexto

...

## Configuración

- **Almacenamiento:** 1,2 MWh.
- **FV:** 500 kWp.
- **Gestión:** peak shaving y backup.
```

**Verificació**

- [ ] `/soluciones/soluciones-industriales-y-comerciales/microgrid-industrial-puerto/` respon 200.
- [ ] El breadcrumb mostra l'àmbit pare.
- [ ] Apareix a la llista de projectes de l'àmbit.
- [ ] Els productes relacionats es veuen.
- [ ] Si ha de sortir al menú, actualitza `projects` a `navigation.ts`.

> [!NOTE]
> El `slug` ha d'incloure `soluciones/<àmbit>/<projecte>`. El fitxer pot tenir un nom curt, però el `slug` és el que mana.

## 4. Recepta: afegir un àmbit de solució

`src/content/solutions/soluciones-agricolas.md`

```yaml
---
title: Soluciones agrícolas
slug: soluciones/soluciones-agricolas
parent: soluciones
order: 4
eyebrow: Agrícola
excerpt: 'Almacenamiento y autoconsumo para explotaciones agrícolas, bombeo y secaderos.'
hero: ../../assets/images/solutions/agricolas-hero.webp
icon: lucide:sprout
stats:
  - value: Autoconsumo
    label: Bombeo solar
  - value: Backup
    label: Continuidad
products:
  - lv-lite-series
  - lt5000-series
seo:
  description: Soluciones de almacenamiento LifeTech para explotaciones agrícolas, bombeo y secaderos.
---
```

Actualitza `solutions` a `navigation.ts` i, si cal, crea projectes fills amb `parent: soluciones/soluciones-agricolas`.

**Verificació**

- [ ] `/soluciones/soluciones-agricolas/` respon 200.
- [ ] Apareix a `/soluciones/` com a àmbit (targeta amb icona, no imatge).
- [ ] El menú i el footer l'inclouen.
- [ ] Els projectes fills es mostren com a “Proyectos”.

## 5. Recepta: publicar el primer article del blog

El blog està a mig fer. Cal completar tres peces.

### 5.1 Article

`src/content/blog/como-dimensionar-bateria-lfp.md`

```yaml
---
title: Cómo dimensionar una batería LFP para autoconsumo
description: 'Guía práctica para calcular capacidad, potencia y profundidad de descarga en una instalación residencial.'
pubDate: 2026-11-20
updatedDate: 2026-11-20
hero: ../../assets/images/blog/dimensionar-lfp-hero.webp
author: LifeTech
tags: [autoconsumo, lfp, dimensionado]
draft: false
seo:
  description: Guía para dimensionar una batería LFP de autoconsumo según consumo, potencia y DOD.
---
```

### 5.2 Ruta d'article

Crear `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<BaseLayout
  title={entry.data.seo?.title ?? entry.data.title}
  description={entry.data.seo?.description ?? entry.data.description}
  type="article"
  image={entry.data.hero?.src}
>
  <article class="prose ...">
    <Content />
  </article>
</BaseLayout>
```

> [!NOTE]
> `entry.id` d'un article **no** té `slug` al frontmatter, així que el loader el deriva del nom del fitxer. Per això la ruta fa servir `entry.id` i no `data.slug`.

### 5.3 Índex i sitemap

1. Treure `noindex` de `src/pages/blog/index.astro`.
2. Llistar els posts amb `getCollection('blog', ({data}) => !data.draft)`.
3. **Treure el filtre `/blog/` del sitemap** a `astro.config.mjs`.
4. Opcional: crear `src/pages/rss.xml.js` amb `@astrojs/rss`.
5. Opcional: afegir `Article` JSON-LD amb `datePublished`, `dateModified`, `author`.

**Verificació**

- [ ] `/blog/` ja no té `noindex`.
- [ ] L'article respon 200 i apareix al sitemap.
- [ ] `og:type=article` i dates correctes.
- [ ] `draft: true` no genera ruta.
- [ ] RSS vàlid (si s'ha creat).

## 6. Recepta: afegir una pàgina legal

`src/content/pages/politica-de-seguridad.md`

```yaml
---
title: Política de seguridad
slug: politica-de-seguridad
description: 'Medidas de seguridad de la información aplicadas en LifeTech.'
updated: 2026-11-17
seo:
  description: Política de seguridad de la información de LifeTech Energy Solucions.
---
```

La ruta es genera sola via `[...slug].astro`. Si ha de sortir al peu, afegeix-la a `site.legalLinks` a `src/data/site.ts`.

## 7. Recepta: afegir un PDF de descàrrega

**1. Puja el fitxer**

```text
public/descargas/ficha-tecnica-lt-max.pdf
```

**2. Afegeix-lo a la fitxa**

```yaml
downloads:
  - label: Ficha técnica LT-MAX
    kind: datasheet
    href: /descargas/ficha-tecnica-lt-max.pdf
```

**3. Afegeix-lo a la pàgina de descàrregues**

`src/pages/descarga-productos.astro`, dins del grup corresponent:

```ts
{ label: 'Ficha técnica LT-MAX', href: '/descargas/ficha-tecnica-lt-max.pdf' },
```

**4. Verifica**

- [ ] `npm run qa` no marca l'enllaç com a trencat.
- [ ] El PDF existeix a `dist/descargas/`.
- [ ] La fitxa i la pàgina de descàrregues hi enllacen.

## 8. Recepta: canviar NAP o SEO global

Fitxers afectats:

| Dada | Fitxer |
|---|---|
| Nom, raó social, URL, email, telèfon, adreça, xarxes | `src/data/site.ts` |
| URL del lloc per a canonicals/sitemap | `astro.config.mjs` (`SITE`) |
| Imatge OG per defecte | `public/images/og-default.jpg` o `npm run og` |
| Text del footer | `src/components/layout/Footer.astro` |
| JSON-LD | `src/lib/schema.ts` |
| Contacte i horaris | `src/pages/contacto.astro` |
| Legals | `src/content/pages/*.md` |

> [!WARNING]
> La URL apareix a **dos** llocs (`astro.config.mjs` i `site.ts`). Canviar només un provoca canonicals o sitemaps incoherents. Vegeu [09](09-deute-tecnic-i-riscos.md).

## 9. Errors típics

| Símptoma | Causa | Solució |
|---|---|---|
| La pàgina no es genera | Fitxer fora de `src/content/<col·lecció>/` | Moure'l |
| 404 a la URL esperada | `slug` incorrecte o amb barra inicial | `slug` sense `/` inicial |
| Breadcrumb sense pare | `parent` no coincideix amb l'id de la sèrie | Usar el slug complet exacte |
| Targeta relacionada desapareguda | `related` apunta a un id inexistent | Corregir el slug |
| El menú no mostra la sèrie | No s'ha afegit a `navigation.ts` | Afegir-la |
| El footer no la mostra | El footer deriva de `products` | Afegir-la a `products` |
| Imatge no trobada | Ruta relativa incorrecta | `../../assets/images/...` |
| Build falla per descripció | `seo.description` > 160 | Retallar |
| Build falla per id duplicat | Dos fitxers amb el mateix `slug` | Renombrar |
| `undefined` al HTML | Camp opcional pintat sense fallback | Revisar el layout |
| PDF 404 | Fitxer no a `public/descargas/` | Pujar-lo |
| Pàgina al sitemap quan no toca | Filtre insuficient | Afegir exclusió o `noindex` |
| Pàgina fora del sitemap quan toca | Filtre massa ampli (`/blog/`) | Ajustar el filtre |
| Ordre estrany | `order` repetit | Fer servir 10, 20, 30… |

## 10. Definition of Done

Una entrada nova està acabada quan:

- [ ] El fitxer és a la col·lecció correcta i l'esquema valida.
- [ ] El `slug` és únic, ASCII i coherent amb la jerarquia.
- [ ] `parent` i `related` apunten a ids existents.
- [ ] `excerpt` i `seo.description` són dins de límit.
- [ ] La imatge hero existeix i té una mida raonable.
- [ ] Les imatges de galeria tenen `alt`.
- [ ] Els PDFs existeixen.
- [ ] La pàgina respon 200 en local.
- [ ] El breadcrumb i els enllaços de navegació són correctes.
- [ ] El sitemap inclou la URL (si és indexable).
- [ ] `npm run check`, `build` i `qa` passen.
- [ ] S'ha revisat en mòbil.
- [ ] Si cal, s'han actualitzat `navigation.ts`, `descarga-productos.astro` i aquests documents.

## 11. Checklist editorial

- [ ] El text és en castellà i el codi en català.
- [ ] No hi ha faltes ni barreges d'idioma.
- [ ] Les unitats són consistents (`kWh`, `kW`, `VDC`, `IP54`).
- [ ] Les xifres de `highlights` coincideixen amb `specs`.
- [ ] No es promet res que no consti a la fitxa tècnica.
- [ ] Els enllaços interns apunten a URLs amb barra final.
- [ ] El contingut no duplica una altra fitxa.
- [ ] El títol no supera ~60 caràcters amb el sufix.
- [ ] La descripció és única i beneficiosa, no un llistat de paraules clau.
