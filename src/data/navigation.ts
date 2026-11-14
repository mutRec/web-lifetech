/**
 * Navegació del lloc, derivada de l'estructura real de life-tech.es.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavColumn {
  title: string;
  /** Enllaç de la capçalera de columna (opcional) */
  href?: string;
  items: NavLink[];
}

export interface NavEntry {
  label: string;
  href?: string;
  columns?: NavColumn[];
}

export const solutions: NavLink[] = [
  {
    label: 'Soluciones residenciales',
    href: '/soluciones/soluciones-residenciales/',
    description: 'Autoconsumo y respaldo energético para el hogar',
    icon: 'lucide:home',
  },
  {
    label: 'Soluciones industriales y comerciales',
    href: '/soluciones/soluciones-industriales-y-comerciales/',
    description: 'Continuidad operativa y ahorro en industria',
    icon: 'lucide:factory',
  },
  {
    label: 'Soluciones plantas FV',
    href: '/soluciones/soluciones-plantas-fv/',
    description: 'Almacenamiento para plantas fotovoltaicas',
    icon: 'lucide:sun',
  },
];

/** Projectes industrials niats sota la solució industrial. */
export const projects: NavLink[] = [
  {
    label: 'Sistemas de almacenamiento de energía',
    href: '/soluciones/soluciones-industriales-y-comerciales/sistemas-de-almacenamiento-de-energia/',
  },
  {
    label: 'Sistemas de almacenamiento portátil',
    href: '/soluciones/soluciones-industriales-y-comerciales/sistemas-de-almacenamiento-portatil/',
  },
  {
    label: 'Energy Storage para plantas FV',
    href: '/soluciones/soluciones-industriales-y-comerciales/energy-storage-para-plantas-de-produccion-fv/',
  },
  {
    label: 'Sistema BESS en modo peaking shifting',
    href: '/soluciones/soluciones-industriales-y-comerciales/sistema-bess-en-modo-peaking-shifting/',
  },
  {
    label: 'Estación de carga solar BESS',
    href: '/soluciones/soluciones-industriales-y-comerciales/estacion-de-carga-solar-bess/',
  },
];

export const products: NavLink[] = [
  { label: 'RESS', href: '/ress/' },
  { label: 'LV-LITE Series', href: '/lv-lite-series/' },
  { label: 'HV-LITE Series', href: '/hv-lite-series/' },
  { label: 'LT5000 Series', href: '/lt5000-series/' },
  { label: 'LT5000R Series', href: '/lt5000r-series/' },
  { label: 'LT-12V/24V Series', href: '/lt-12v-24v-series/' },
  { label: 'LT-HV', href: '/lt-hv/' },
];

/** Menú principal (header) */
export const mainNav: NavEntry[] = [
  { label: 'Nosotros', href: '/nosotros/' },
  {
    label: 'Soluciones y productos',
    columns: [
      { title: 'Soluciones', href: '/soluciones/', items: solutions },
      { title: 'Productos', href: '/productos/', items: products },
      {
        title: 'Proyectos',
        href: '/soluciones/soluciones-industriales-y-comerciales/',
        items: projects,
      },
    ],
  },
  { label: 'Contacto', href: '/contacto/' },
];

/** Peu de pàgina */
export interface FooterColumn {
  title: string;
  href?: string;
  items: NavLink[];
}

export const footerNav: FooterColumn[] = [
  {
    title: 'Soluciones',
    href: '/soluciones/',
    items: solutions,
  },
  {
    title: 'Proyectos',
    href: '/soluciones/soluciones-industriales-y-comerciales/',
    items: projects,
  },
  {
    title: 'Productos',
    href: '/productos/',
    items: products,
  },
  {
    title: 'Empresa',
    items: [
      { label: 'Nosotros', href: '/nosotros/' },
      { label: 'Contacto', href: '/contacto/' },
      { label: 'Vídeos', href: '/videos/' },
    ],
  },
  {
    title: 'Soporte técnico',
    items: [
      { label: 'FAQs', href: '/faqs/' },
      { label: 'Soporte en línea', href: '/soporte-en-linea/' },
      { label: 'Descarga de productos', href: '/descarga-productos/' },
      { label: 'Garantía del inversor', href: '/garantia-del-inversor/' },
      { label: 'Garantía de la batería', href: '/garantia-de-la-bateria/' },
    ],
  },
];
