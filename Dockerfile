# syntax=docker/dockerfile:1.7

# ---------- Build ----------
FROM node:24-bookworm-slim AS build
WORKDIR /app
# No fixem NODE_ENV=production: `npm ci` ometria les devDependencies i el
# build necessita eines com `tailwindcss`, `@tailwindcss/vite` o `typescript`.
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Les variables PUBLIC_* s'inlinen al bundle: han d'arribar com a build args.
ARG PUBLIC_SITE_URL=https://life-tech.es
ARG PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
ARG PUBLIC_FORM_ACCESS_KEY=""
ARG PUBLIC_ANALYTICS_SRC=https://cloud.umami.is/script.js
ARG PUBLIC_ANALYTICS_ID=""
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
    PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT \
    PUBLIC_FORM_ACCESS_KEY=$PUBLIC_FORM_ACCESS_KEY \
    PUBLIC_ANALYTICS_SRC=$PUBLIC_ANALYTICS_SRC \
    PUBLIC_ANALYTICS_ID=$PUBLIC_ANALYTICS_ID

RUN npm run build

# ---------- Runtime ----------
FROM nginx:1.29-alpine AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf

COPY deploy/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY deploy/nginx/redirects.conf        /etc/nginx/snippets/redirects.conf
COPY deploy/nginx/default.conf          /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist             /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

STOPSIGNAL SIGQUIT
