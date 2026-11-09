/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** URL pública del lloc, p. ex. https://life-tech.es */
  readonly PUBLIC_SITE_URL?: string;
  /** Endpoint del formulari (Web3Forms) */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Clau pública de Web3Forms */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  /** Script d'analítica (Umami Cloud) */
  readonly PUBLIC_ANALYTICS_SRC?: string;
  /** Website ID d'Umami */
  readonly PUBLIC_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
