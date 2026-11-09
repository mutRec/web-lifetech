# Desplegament a Dokploy

Aquesta web és un lloc estàtic generat per Astro i servit per nginx. No necessita
base de dades ni volums persistents: el contenidor només conté `dist/` i la
configuració de nginx.

> **Important:** no feu servir el tipus de build **Static** de Dokploy. Aquest
> tipus sobreescriu el nginx amb una configuració pròpia i es perdrien els
> redirects 301/410, les capçaleres de seguretat i `/healthz`. El projecte
> inclou el seu propi `Dockerfile` i `deploy/nginx/*`; cal usar **Dockerfile**.

## 1. Crear l'aplicació

Dins del projecte de Dokploy, **Create Application**:

| Camp                | Valor                                    |
| ------------------- | ---------------------------------------- |
| Source Type         | **Git** (GitHub)                         |
| Repositori          | `https://github.com/mutRec/web-lifetech` |
| Branch              | `main`                                   |
| Build Path          | `/`                                      |
| Build Type          | **Dockerfile**                           |
| Dockerfile Path     | `Dockerfile`                             |
| Docker Context Path | `.`                                      |
| Port del contenidor | `80`                                     |
| Healthcheck path    | `/healthz`                               |

Si el repositori és privat, connecteu abans el compte de GitHub a
**Settings → Git Sources** (GitHub App) i seleccioneu el repositori des de la
llista.

## 2. Build time arguments (imprescindibles)

A **Environment → Build Time Arguments** afegiu aquestes variables. Es passen
com a `ARG` durant el `docker build`:

| Build arg                | Valor                              |
| ------------------------ | ---------------------------------- |
| `PUBLIC_SITE_URL`        | `https://life-tech.es`             |
| `PUBLIC_FORM_ENDPOINT`   | `https://api.web3forms.com/submit` |
| `PUBLIC_FORM_ACCESS_KEY` | clau de Web3Forms                  |
| `PUBLIC_ANALYTICS_SRC`   | `https://cloud.umami.is/script.js` |
| `PUBLIC_ANALYTICS_ID`    | website-id d'Umami Cloud           |

`PUBLIC_*` s'inlina al bundle durant el `astro build`. Si les poseu només com a
variables d'entorn de runtime, el lloc es publicarà amb valors buits. La clau de
Web3Forms és pública (apareix a l'HTML), així que no cal tractar-la com un secret.

## 3. Domini i TLS

A la pestanya **Domains**, afegiu:

| Host               | Path | Container Port | HTTPS | Certificate   |
| ------------------ | ---- | -------------- | ----- | ------------- |
| `life-tech.es`     | `/`  | `80`           | ✅    | `letsencrypt` |
| `www.life-tech.es` | `/`  | `80`           | ✅    | `letsencrypt` |

DNS al proveïdor del domini:

| Tipus | Nom   | Valor           |
| ----- | ----- | --------------- |
| A     | `@`   | IP del servidor |
| CNAME | `www` | `life-tech.es`  |

Després, a **Advanced → Redirects**, seleccioneu el preset **www to non-www** i
desau. Així `www.life-tech.es` fa 301 cap a l'àpex i s'evita contingut duplicat.

Traefik gestiona el certificat i redirigeix HTTP → HTTPS. El contenidor només
escolta al port 80 en pla HTTP dins de la xarxa de Docker: no exposeu el port 80
directament a Internet.

## 4. Healthcheck i rollback (opcional)

El `Dockerfile` ja defineix un `HEALTHCHECK` amb `wget` contra `/healthz`. Si
configureu el healthcheck de Swarm a **Advanced → Cluster Settings → Swarm
Settings**, feu servir `wget` (la imatge `nginx:alpine` no inclou `curl`):

```json
{
  "Test": ["CMD-SHELL", "wget -qO- http://127.0.0.1/healthz || exit 1"],
  "Interval": 30000000000,
  "Timeout": 10000000000,
  "StartPeriod": 30000000000,
  "Retries": 3
}
```

Per activar rollback automàtic:

```json
{
  "Parallelism": 1,
  "Delay": 10000000000,
  "FailureAction": "rollback",
  "Order": "start-first"
}
```

## 5. Desplegar i automatitzar

1. **Deploy** i revisar **Logs** fins que el healthcheck passi a `healthy`.
2. Per desplegar automàticament a cada push: **Deployments → Webhook URL** i
   afegiu aquesta URL a **GitHub → Settings → Webhooks** (content-type
   `application/json`). També podeu activar **Auto Deploy** si feu servir la
   GitHub App.
3. Per desplegar una versió concreta: **Deployments → Rollback**.

### Alternativa per a producció: build a CI + registre

Si el servidor de Dokploy té pocs recursos, no hi feu el build. Un workflow de
GitHub Actions pot construir la imatge amb els mateixos _build args_ i pujar-la a
GHCR o Docker Hub. Aleshores a Dokploy:

- **Source Type**: `Docker`
- **Image**: `ghcr.io/mutrec/web-lifetech:latest`
- **Port**: `80`

El resultat és idèntic; només canvia on es fa el build.

## 6. Validació local de la imatge

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

## 7. Staging

Crear un segon servei amb el domini `staging.life-tech.es` i afegir-hi:

```
X-Robots-Tag: noindex, nofollow
```

Així el staging no s'indexa. L'analítica ja s'exclou sola gràcies a
`data-domains="life-tech.es,www.life-tech.es"`.

## 8. Smoke test després del desplegament

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

## 9. Post-llançament

1. Search Console: enviar `https://life-tech.es/sitemap-index.xml`.
2. Revisar _Pàgines → No indexades_ i els 404 durant 30 dies.
3. Comprovar que el formulari arriba a `info@life-tech.es` (prova real).
4. Verificar que Umami rep visites reals (no staging).
5. Passar la CSP de `Report-Only` a enforcing quan no hi hagi violacions.
