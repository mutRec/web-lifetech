import { site } from '@/data/site';
import { absoluteUrl } from '@/lib/urls';

export type JsonLdObject = Record<string, unknown>;

export interface Crumb {
  label: string;
  href?: string;
}

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** Organization + LocalBusiness (NAP). */
export function organizationSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    logo: absoluteUrl('/brand/logo-life-tech.svg'),
    image: absoluteUrl(site.ogImage),
    email: site.email,
    telephone: site.phone.href,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    hasMap: site.mapsUrl,
    ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone.href,
        email: site.email,
        contactType: 'customer service',
        availableLanguage: ['es'],
      },
    ],
  };
}

/** WebSite amb inLanguage es-ES. */
export function websiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    inLanguage: 'es-ES',
    publisher: { '@id': ORG_ID },
  };
}

/** BreadcrumbList a partir d'una llista d'engrunes. */
export function breadcrumbSchema(items: Crumb[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/** WebPage genèrica per a pàgines corporatives. */
export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: 'es-ES',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}

/** Schema.org Product per a models concrets. */
export function productSchema(input: {
  name: string;
  description: string;
  path: string;
  image: string;
  brand?: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image,
    brand: {
      '@type': 'Brand',
      name: input.brand ?? site.name,
    },
    manufacturer: { '@id': ORG_ID },
  };
}

/** Schema.org FAQPage. */
export function faqSchema(items: Array<{ question: string; answer: string }>): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Elimina claus buides per no emetre JSON-LD amb valors nuls. */
export function compact<T extends JsonLdObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ) as T;
}
