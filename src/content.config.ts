import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seo = z.object({
  title: z.string().optional(),
  description: z.string().max(160).optional(),
  image: z.string().optional(),
  noindex: z.boolean().default(false),
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Ruta completa sense barres: "ress/ress-300-200". Defineix la URL final. */
      slug: z.string(),
      kind: z.enum(['series', 'model']),
      parent: reference('products').optional(),
      order: z.number().default(0),
      excerpt: z.string(),
      hero: image(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      features: z
        .array(
          z.object({
            icon: z.string().default('lucide:check'),
            title: z.string(),
            text: z.string(),
          }),
        )
        .default([]),
      highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      downloads: z
        .array(
          z.object({
            label: z.string(),
            kind: z.enum(['datasheet', 'warranty', 'inverter-guide', 'manual']),
            href: z.string().optional(),
          }),
        )
        .default([]),
      related: z.array(reference('products')).default([]),
      seo: seo.optional(),
    }),
});

const solutions = defineCollection({
  loader: glob({ base: './src/content/solutions', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Ruta completa sense barres: "soluciones/soluciones-residenciales". */
      slug: z.string(),
      parent: reference('solutions').optional(),
      order: z.number().default(0),
      eyebrow: z.string().optional(),
      excerpt: z.string(),
      hero: image(),
      icon: z.string().default('lucide:home'),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      products: z.array(reference('products')).default([]),
      seo: seo.optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** Ruta completa sense barres: "aviso-legal". */
    slug: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    seo: seo.optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      hero: image().optional(),
      author: z.string().default('LifeTech'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      seo: seo.optional(),
    }),
});

export const collections = { products, solutions, pages, blog };
