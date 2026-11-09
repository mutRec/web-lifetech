/**
 * Dades globals del lloc. Punt únic de veritat per a NAP, SEO per defecte
 * i rutes legals.
 */

export const site = {
  name: 'LifeTech',
  legalName: 'LifeTech Energy Solucions',
  url: 'https://life-tech.es',
  lang: 'es',
  locale: 'es_ES',
  defaultTitle: 'LifeTech | Sistemas de almacenamiento de energía',
  description:
    'Productos de almacenamiento de energía de alta eficiencia para aplicaciones industriales, residenciales y comerciales.',
  email: 'info@life-tech.es',
  phone: {
    /** Format llegible */
    display: '931 840 551',
    /** Format per a `tel:` */
    href: '+34931840551',
  },
  /** Canal de suport tècnic (diferent del telèfon comercial). */
  support: {
    email: 'service@life-tech.es',
    phone: {
      display: '877 911 216',
      href: '+34877911216',
    },
  },
  address: {
    street: 'Avda. Madrid, 151, of. A',
    postalCode: '08028',
    city: 'Barcelona',
    country: 'ES',
    display: 'Avda. Madrid, 151, of. A, 08028 Barcelona',
  },
  mapsUrl: 'https://maps.app.goo.gl/2vxbGaCY7Bkncy8W7',
  ogImage: '/images/og-default.jpg',
  /** Xarxes socials (buit fins que el client confirmi els perfils) */
  sameAs: [] as string[],
  /** Text legal del peu */
  legalLinks: [
    { label: 'Aviso legal', href: '/aviso-legal/' },
    { label: 'Política de privacidad', href: '/politica-de-privacidad/' },
    { label: 'Política de cookies', href: '/politica-de-cookies/' },
  ],
} as const;

export type Site = typeof site;
