# Desplegament a Dokploy

## 1. Crear l'aplicació

| Camp                | Valor          |
| ------------------- | -------------- |
| Tipus               | **Dockerfile** |
| Repositori          | `web-lifetech` |
| Branch              | `main`         |
| Dockerfile path     | `Dockerfile`   |
| Port del contenidor | `80`           |
| Healthcheck path    | `/healthz`     |

## 2. Build args (imprescindibles)

`PUBLIC_*` s'inlina al bundle durant el `astro build`. Si les poses només com a
variables d'entorn de runtime, el lloc es publicarà amb valors buits.

| Build arg                | Valor                              |
| ------------------------ | ---------------------------------- |
| `PUBLIC_SITE_URL`        | `https://life-tech.es`             |
| `PUBLIC_FORM_ENDPOINT`   | `https://api.web3forms.com/submit` |
| `PUBLIC_FORM_ACCESS_KEY` | clau de Web3Forms                  |
| `PUBLIC_ANALYTICS_SRC`   | `https://cloud.umami.is/script.js` |
| `PUBLIC_ANALYTICS_ID`    | website-id d'Umami Cloud           |

## 3. Validació local de la imatge

```bash
docker build -t web-lifetech:local \
  --build-arg PUBLIC_FORM_ACCESS_KEY=... \
  --build-arg PUBLIC_ANALYTICS_ID=... .

docker run --rm -d --name lifetech -p 8080:80 web-lifetech:local
curl -sI http://localhost:8080/nosotros | findstr /i "HTTP location"
docker rm -f lifetech
```

Sense `PUBLIC_FORM_ACCESS_KEY`, la imatge es construeix igualment però el
formulari mostrarà un error en enviar-se. Cal passar les claus com a _build
args_, no com a variables de runtime.

## 4. Domini i TLS

1. Afegir `life-tech.es` com a domini de l'aplicació.
2. Afegir `www.life-tech.es` amb un middleware de Traefik `redirectregex` cap a
   l'àpex (301), per evitar contingut duplicat.
3. Activar Let's Encrypt (Traefik gestiona el certificat).

## 5. Staging

Crear un segon servei amb el domini `staging.life-tech.es` i afegir-hi:

```
X-Robots-Tag: noindex, nofollow
```

Així el staging no s'indexa. L'analítica ja s'exclou sola gràcies a
`data-domains="life-tech.es,www.life-tech.es"`.

## 6. Smoke test després del desplegament

| URL                        | Esperat                       |
| -------------------------- | ----------------------------- |
| `/`                        | 200                           |
| `/nosotros`                | 301 → `/nosotros/`            |
| `/contacto/`               | 200 + formulari visible       |
| `/hello-world/`            | 301 → `/blog/`                |
| `/category/uncategorized/` | 301 → `/blog/`                |
| `/ca/nosotros/`            | 301 → `/nosotros/`            |
| `/avis-legal/`             | 301 → `/aviso-legal/`         |
| `/politica-de-cookies-ue/` | 301 → `/politica-de-cookies/` |
| `/wp-login.php`            | 410                           |
| `/sitemap_index.xml`       | 301 → `/sitemap-index.xml`    |
| `/sitemap-index.xml`       | 200                           |
| `/robots.txt`              | 200 amb `Sitemap:`            |
| `/healthz`                 | 200 `ok`                      |

```bash
curl -sI https://life-tech.es/nosotros | findstr /i "HTTP location"
```

## 7. Post-llançament

1. Search Console: enviar `https://life-tech.es/sitemap-index.xml`.
2. Revisar _Pàgines → No indexades_ i els 404 durant 30 dies.
3. Comprovar que el formulari arriba a `info@life-tech.es` (prova real).
4. Verificar que Umami rep visites reals (no staging).
5. Passar la CSP de `Report-Only` a enforcing quan no hi hagi violacions.
