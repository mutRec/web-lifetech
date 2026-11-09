# web-lifetech

Migració de `https://life-tech.es/` (WordPress + Divi) a **Astro 7** en mode
estàtic, amb Tailwind CSS 4, Content Collections i desplegament a **Dokploy**
via Docker + nginx.

## Requisits

- Node.js `>= 22.23.4` (desenvolupat amb Node 24)
- npm `>= 9.6.5`

## Comandes

```bash
npm install       # dependències
npm run dev       # servidor local a http://localhost:4321
npm run build     # build estàtic a dist/
npm run preview   # previsualitza el build
npm run check     # TypeScript + diagnòstics d'Astro
npm run qa        # QA del build: SEO, h1, JSON-LD, enllaços
npm run format    # Prettier
npm run og        # regenera la imatge Open Graph per defecte
```

## Estructura

```
src/
├─ assets/            imatges optimitzables amb astro:assets
├─ components/
│  ├─ analytics/      Umami (sense cookies)
│  ├─ forms/          ContactForm (Web3Forms)
│  ├─ layout/         Header, Footer, Breadcrumbs, PageHero
│  ├─ seo/            SEO, JsonLd
│  └─ ui/             Button, Card, Container, Section, Icon...
├─ content/           col·leccions (products, solutions, pages, blog)
├─ data/              site.ts (NAP, SEO), navigation.ts
├─ layouts/           BaseLayout, ProductLayout, SolutionLayout, LegalLayout
├─ lib/               urls, schema (JSON-LD), cn
├─ pages/             rutes
├─ styles/            global.css (tokens Tailwind 4)
└─ content.config.ts  esquemes Zod
deploy/
├─ nginx/             default.conf, security-headers.conf, redirects.conf
└─ dokploy.md         runbook de desplegament
```

## Rutes

| Grup           | Rutes                                                                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home           | `/`                                                                                                                                                                                                |
| Productes (16) | `/ress/` + 4 models · `/lv-lite-series/` · `/hv-lite-series/` · `/lt5000-series/` + 2 models · `/lt5000r-series/` · `/lt-12v-24v-series/` + `/lt-12v-24v-series/lfp-24100/` · `/lt-hv/` + 2 models |
| Solucions (9)  | `/soluciones/` · `/soluciones/soluciones-residenciales/` · `/soluciones/soluciones-industriales-y-comerciales/` (+ 5 projectes) · `/soluciones/soluciones-plantas-fv/`                             |
| Corporatiu (8) | `/nosotros/` · `/contacto/` · `/faqs/` · `/soporte-en-linea/` · `/videos/` · `/descarga-productos/` · `/garantia-del-inversor/` · `/garantia-de-la-bateria/`                                       |
| Legal (3)      | `/aviso-legal/` · `/politica-de-privacidad/` · `/politica-de-cookies/`                                                                                                                             |
| Sistema        | `/gracias/` (`noindex`) · `/blog/` (`noindex` fins al primer article) · `/404` · `/robots.txt` · `/sitemap-index.xml`                                                                              |

`/politica-de-cookies-ue/` (URL antiga) no es genera: nginx la redirigeix 301 a
`/politica-de-cookies/`.

## Variables d'entorn

Copia `.env.example` a `.env` i omple:

| Variable                 | Ús                                   |
| ------------------------ | ------------------------------------ |
| `PUBLIC_SITE_URL`        | URL pública (`https://life-tech.es`) |
| `PUBLIC_FORM_ENDPOINT`   | `https://api.web3forms.com/submit`   |
| `PUBLIC_FORM_ACCESS_KEY` | clau pública de Web3Forms            |
| `PUBLIC_ANALYTICS_SRC`   | `https://cloud.umami.is/script.js`   |
| `PUBLIC_ANALYTICS_ID`    | website-id d'Umami Cloud             |

> Les variables `PUBLIC_*` s'inlinen **en build time**. A producció han
> d'arribar com a build args de Docker (vegeu `deploy/dokploy.md`).

## Convencions de contingut

- Les URLs conserven la barra final (`trailingSlash: 'always'`).
- El camp `slug` de cada entrada de col·lecció és la **ruta completa sense
  barres** (p. ex. `ress/ress-300-200`). Astro fa servir aquest valor com a
  `id` de l'entrada, així que les referències entre col·leccions (`parent`,
  `related`, `products`) també han d'usar el slug complet.
- Els textos són en castellà; el codi i els comentaris, en català.

## Estat de les fases

| Fase                                         | Estat                                                   |
| -------------------------------------------- | ------------------------------------------------------- |
| 0. Setup + desplegament                      | ✅                                                      |
| 1. Shell (layout, header, footer, SEO, form) | ✅                                                      |
| 2. Home                                      | ✅                                                      |
| 3. Productes (16 URLs)                       | ✅                                                      |
| 4. Solucions (9 URLs)                        | ✅                                                      |
| 5. Corporatives i legals (11 URLs)           | ✅                                                      |
| 6. Blog                                      | 🟡 `/blog/` creat amb `noindex` a l'espera de contingut |
| 7. SEO/QA                                    | ✅ `npm run qa` sense errors ni enllaços trencats       |
| 8. Deploy                                    | 🟡 imatge Docker validada; pendent Dokploy/DNS          |

### Notes

- `/blog/` porta `noindex` i no té canonical fins que hi hagi el primer article;
  tampoc no apareix al sitemap.
- El formulari mostra un avís en desenvolupament si falta `PUBLIC_FORM_ACCESS_KEY`.
- La imatge Open Graph es genera amb `npm run og` a partir del logotip de marca.
- Pendents de confirmar: `PUBLIC_FORM_ACCESS_KEY` (Web3Forms),
  `PUBLIC_ANALYTICS_ID` (Umami Cloud) i accés DNS/Dokploy.
