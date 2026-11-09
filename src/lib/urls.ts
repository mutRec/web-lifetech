import { site } from '@/data/site';

/** Construeix una URL absoluta a partir d'una ruta interna. */
export function absoluteUrl(path: string, base: string | URL = site.url): string {
  return new URL(path, base).href;
}

/** Retorna la URL canònica (sense query ni hash) d'una pàgina. */
export function canonicalUrl(pathname: string, base: string | URL = site.url): string {
  const url = new URL(pathname, base);
  url.search = '';
  url.hash = '';
  return url.href;
}

/**
 * Títol SEO: evita duplicar el nom del lloc si ja hi és present.
 * La home fa servir el títol complet.
 */
export function formatTitle(title: string | undefined, isHome = false): string {
  if (!title) return site.defaultTitle;
  if (isHome) return title;
  if (title.includes(site.name)) return title;
  return `${title} | ${site.name}`;
}

/** Retalla una descripció sense tallar paraules a la meitat. */
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max - 1).replace(/[,;:.\-–]$/, '')}…`;
}

/** Ruta normalitzada amb barra final, com al lloc original. */
export function normalizePath(path: string): string {
  if (path === '/' || path === '') return '/';
  const clean = path.split('?')[0]?.split('#')[0] ?? path;
  return clean.endsWith('/') ? clean : `${clean}/`;
}

/** Indica si la ruta actual pertany a una secció. */
export function isActive(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(target);
}
