---
title: 'LifeTech — Arquitectura web i model de contingut'
aliases:
  - LifeTech docs
  - MOC LifeTech
tags:
  - lifetech
  - astro
  - arquitectura
  - moc
updated: 2026-11-17
status: vigent
---

# LifeTech — Arquitectura web i model de contingut

Documentació tècnica de `web-lifetech`, la migració de `life-tech.es` de WordPress + Divi a **Astro 7 en mode estàtic**. L'objectiu és explicar **com està pensat el web**, **per què** s'han pres les decisions actuals i **com ampliar-lo** quan creixin el catàleg de productes, els projectes i el contingut editorial.

> [!NOTE]
> Auditoria feta el **2026-11-17** sobre el commit `57dda43` (`main`). Els números provenen de `src/`, `dist/` i de la configuració real; quan una afirmació és una inferència i no una evidència del codi, s'indica explícitament.

## Mètriques clau

| Mètrica | Valor auditat | Notes |
|---|---:|---|
| Pàgines HTML a `dist/` | 40 | L'arbre actual afegeix `/productos/`; build pendent → 41 esperades |
| Productes | 16 entrades | 7 sèries + 9 models = 16 URLs |
| Solucions i projectes | 9 entrades | índex + 3 àmbits + 5 projectes = 9 URLs |
| Pàgines legals | 3 | `pages`: avís legal, privacitat, cookies |
| Articles de blog | 0 | Índex `noindex`; col·lecció i esquema a punt |
| Imatges font | 53 fitxers / 2,7 MB | `src/assets/images` |
| `dist/` total | 30,2 MB | 20,7 MB PDFs + 7,4 MB `_astro` + 2,1 MB HTML |
| HTML mitjà | ~52 KB sense comprimir | ~10–14 KB amb gzip/brotli |
| JavaScript de client | 3 scripts | Header, formulari, Umami; sense hidratació |
| Dependències de UI | 0 | No React/Vue/Svelte |
| URLs al sitemap | 37 | Build anterior a `/productos/`; després seran 38 |

## Com llegir aquest conjunt

### Per rol

| Rol | Recorregut recomanat |
|---|---|
| **Editor/a de continguts** | [03 Model de contingut](03-model-de-contingut.md) → [07 Guia per afegir contingut](07-guia-afegir-productes-i-projectes.md) → [05 SEO](05-seo-rendiment-i-accessibilitat.md) |
| **Desenvolupador/a** | [01 Arquitectura](01-arquitectura-i-fonaments.md) → [02 Pipeline](02-pipeline-build-i-distribucio.md) → [03 Model](03-model-de-contingut.md) → [04 Rutes i layouts](04-rutes-layouts-i-components.md) |
| **SEO / màrqueting** | [05 SEO i rendiment](05-seo-rendiment-i-accessibilitat.md) → [03 Model](03-model-de-contingut.md) → [09 Riscos](09-deute-tecnic-i-riscos.md) |
| **Ops / desplegament** | [02 Pipeline](02-pipeline-build-i-distribucio.md) → [06 Qualitat i operacions](06-qualitat-operacions-i-desplegament.md) → [`deploy/dokploy.md`](../deploy/dokploy.md) |
| **Qui hagi de decidir l'evolució** | [08 Escalabilitat](08-escalabilitat-i-evolucio-del-model.md) → [10 ADR](10-adr-registre-de-decisions.md) → [09 Riscos](09-deute-tecnic-i-riscos.md) |

### Ordre de lectura lineal

1. [01 — Arquitectura i fonaments](01-arquitectura-i-fonaments.md)
2. [02 — Pipeline de build i distribució](02-pipeline-build-i-distribucio.md)
3. [03 — Model de contingut](03-model-de-contingut.md)
4. [04 — Rutes, layouts i components](04-rutes-layouts-i-components.md)
5. [05 — SEO, rendiment i accessibilitat](05-seo-rendiment-i-accessibilitat.md)
6. [06 — Qualitat, operacions i desplegament](06-qualitat-operacions-i-desplegament.md)
7. [07 — Guia per afegir productes i projectes](07-guia-afegir-productes-i-projectes.md)
8. [08 — Escalabilitat i evolució del model](08-escalabilitat-i-evolucio-del-model.md)
9. [09 — Deute tècnic i riscos](09-deute-tecnic-i-riscos.md)
10. [10 — Registre de decisions (ADR)](10-adr-registre-de-decisions.md)
11. [11 — Referència tècnica i glosari](11-referencia-tecnica-i-glosari.md)

## Mapa de documents

| Document | Què respon |
|---|---|
| [01 Arquitectura i fonaments](01-arquitectura-i-fonaments.md) | Per què Astro, per què estàtic, quines capes hi ha i quin contracte les uneix |
| [02 Pipeline de build i distribució](02-pipeline-build-i-distribucio.md) | Com es transforma el codi en 40 HTML i com arriba a producció |
| [03 Model de contingut](03-model-de-contingut.md) | Quines col·leccions hi ha, quins camps, com es relacionen i com s'escriuen |
| [04 Rutes, layouts i components](04-rutes-layouts-i-components.md) | Com es generen les URLs i com es compon cada pàgina |
| [05 SEO, rendiment i accessibilitat](05-seo-rendiment-i-accessibilitat.md) | Metadades, JSON-LD, sitemap, Core Web Vitals, a11y i analítica |
| [06 Qualitat, operacions i desplegament](06-qualitat-operacions-i-desplegament.md) | Comandes de QA, CI, Docker/nginx, Dokploy, rollback i incidents |
| [07 Guia per afegir contingut](07-guia-afegir-productes-i-projectes.md) | Receptes pas a pas per afegir models, sèries, projectes, blog i PDFs |
| [08 Escalabilitat](08-escalabilitat-i-evolucio-del-model.md) | On es trenca el model actual i com evolucionar-lo a 50, 200 o 1.000 pàgines |
| [09 Deute tècnic i riscos](09-deute-tecnic-i-riscos.md) | Registre prioritzat de problemes, impacte i mitigació |
| [10 ADR](10-adr-registre-de-decisions.md) | Per què es va decidir cada cosa i què implica |
| [11 Referència tècnica i glosari](11-referencia-tecnica-i-glosari.md) | Inventari de fitxers, comandes, variables, rutes i vocabulari |

## Convencions d'aquests documents

- **Idioma**: català. Els noms de fitxers, camps, rutes i codi es mantenen tal com són al projecte.
- **Enllaços**: relatius entre notes. Funcionen a Obsidian i s'importen raonablement bé a Notion.
- **Frontmatter**: mínim, pensat per a Obsidian (`title`, `aliases`, `tags`, `updated`, `status`). Notion el mostrarà com a text inicial; no afecta el contingut.
- **Diagrames**: Mermaid dins de blocs ` ```mermaid `. Sempre hi ha una explicació textual al costat per si el visor no els renderitza.
- **Codificació de colors**: els blocs de codi són il·lustratius. Els canvis proposats a [08](08-escalabilitat-i-evolucio-del-model.md) **no estan aplicats** al projecte.
- **Evidència**: les afirmacions tècniques es poden traçar a un fitxer (`src/...`, `deploy/...`, `scripts/...`) o a una sortida de build.

## Comandes ràpides

```bash
npm install       # instal·lar dependències
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # previsualitza el build
npm run check     # TypeScript + diagnòstics d'Astro
npm run qa        # QA post-build (SEO bàsic, h1, JSON-LD, enllaços)
npm run format    # Prettier
npm run og        # regenera la imatge Open Graph per defecte
```

## Estat del projecte

| Fase | Estat | Observació |
|---|---|---|
| 0. Setup i desplegament | ✅ | Dockerfile validat; Dokploy/DNS pendents segons README |
| 1. Shell (layout, header, footer, SEO, formulari) | ✅ | |
| 2. Home | ✅ | |
| 3. Productes | ✅ | 16 URLs + nou índex `/productos/` |
| 4. Solucions | ✅ | 9 URLs, inclou 5 projectes niats |
| 5. Corporatives i legals | ✅ | 11 URLs |
| 6. Blog | 🟡 | Índex `noindex`; 0 articles; RSS no implementat |
| 7. SEO/QA | ✅ | `npm run qa` sense errors a l'últim build conegut |
| 8. Deploy | 🟡 | Imatge validada; producció pendent de confirmar |

## Manteniment d'aquesta documentació

Actualitza els documents quan canviï alguna d'aquestes coses:

| Canvi | Documents a revisar |
|---|---|
| Nou camp o col·lecció | 03, 04, 07, 11 |
| Nova ruta o plantilla | 04, 05, 11 |
| Canvi de deploy, nginx o variables | 02, 06, 11 |
| Canvi de model de navegació | 03, 04, 08, 09 |
| Canvi d'estratègia SEO o i18n | 05, 08, 10 |
| Refactor gran | 08, 09, 10 i aquest índex |

### Registre de canvis

| Data | Commit | Canvi |
|---|---|---|
| 2026-11-17 | `57dda43` | Creació del conjunt documental i auditoria inicial |
