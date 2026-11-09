import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = 'https://life-tech.es/wp-content/uploads';

/** [origen, destí dins src/assets/images] */
const IMAGES = [
  // RESS
  ['2023/11/life-tech-ress-75-50-6.webp', 'products/ress-75-50-hero.webp'],
  ['2023/11/life-tech-ress-75-50-2.webp', 'products/ress-75-50-2.webp'],
  ['2023/10/life-tech-ress-75-50-3.webp', 'products/ress-75-50-3.webp'],
  ['2023/10/life-tech-ress-75-50-5.webp', 'products/ress-75-50-5.webp'],
  ['2023/11/life-tech-ress-75-50-1.webp', 'products/ress-75-50-1.webp'],
  ['2023/11/life-tech-ress-150-100-1.webp', 'products/ress-150-100-hero.webp'],
  ['2023/11/life-tech-ress-150-100-2.webp', 'products/ress-150-100-2.webp'],
  ['2023/11/life-tech-ress-225-150-2.webp', 'products/ress-225-150-hero.webp'],
  ['2023/10/life-tech-ress-225-150-4.webp', 'products/ress-225-150-4.webp'],
  ['2023/11/life-tech-ress-225-150-3.webp', 'products/ress-225-150-3.webp'],
  ['2023/11/life-tech-ress-300-200-1.webp', 'products/ress-300-200-hero.webp'],
  ['2023/11/life-tech-ress-300-200-2.webp', 'products/ress-300-200-2.webp'],
  ['2023/11/life-tech-ress-300-200-3.webp', 'products/ress-300-200-3.webp'],
  ['2023/11/life-tech-ress-300-200-4.webp', 'products/ress-300-200-4.webp'],
  // LV-LITE / HV-LITE
  ['2023/10/life-tech-lv-lite-mate-lv-1.webp', 'products/lv-lite-series-hero.webp'],
  ['2023/10/life-tech-lv-lite-mate-lv-2.webp', 'products/lv-lite-series-2.webp'],
  ['2023/10/life-tech-hv-lite-mate-hv-3.webp', 'products/hv-lite-series-hero.webp'],
  ['2023/10/life-tech-hv-lite-mate-hv-2.webp', 'products/hv-lite-series-2.webp'],
  ['2023/10/life-tech-hv-lite-mate-hv-1.webp', 'products/hv-lite-series-1.webp'],
  // LT5000
  ['2023/10/life-tech-LT5000-FC-WIFI-REDUX-FC-stacked-1.webp', 'products/lt5000-series-hero.webp'],
  ['2023/10/life-tech-LT5000-FC-WIFI-REDUX-FC-stacked-2.webp', 'products/lt5000-fc-stacked-2.webp'],
  ['2023/10/life-tech-LT5000-FC-WIFI-REDUX-FC-stacked-3.webp', 'products/lt5000-fc-stacked-3.webp'],
  [
    '2023/11/life-tech-LT5000-FC-single-module-redux-3-.webp',
    'products/lt5000-fc-single-module-hero.webp',
  ],
  [
    '2023/11/life-tech-LT5000-FC-single-module-redux-2-.webp',
    'products/lt5000-fc-single-module-2.webp',
  ],
  [
    '2023/11/life-tech-LT5000-FC-single-module-redux.webp',
    'products/lt5000-fc-single-module-1.webp',
  ],
  // LT5000R
  ['2023/10/life-tech-LT5000R-X1-redux-2.webp', 'products/lt5000r-series-hero.webp'],
  ['2023/10/life-tech-LT5000R-X1-redux-3.webp', 'products/lt5000r-series-3.webp'],
  ['2023/10/life-tech-LT5000R-X1-redux-1.webp', 'products/lt5000r-series-1.webp'],
  // LT-12V/24V
  ['2023/10/life-tech-LT-12V-24V-LFP-24100-redux.webp', 'products/lt-12v-24v-series-hero.webp'],
  ['2023/10/life-tech-LT12V-24V-LFP-12020-redux.webp', 'products/lt-12v-24v-series-2.webp'],
  ['2023/10/life-teh-LT-12V-24V-LFP-24100-redux.webp', 'products/lfp-24100-hero.webp'],
  // LT-HV
  ['2023/10/life-tech-LT-HV-480-EBC-battery-system.webp', 'products/lt-hv-series-hero.webp'],
  ['2023/10/life-tech-LT-HV-758-EBC-battery-system.webp', 'products/lt-hv-768-hero.webp'],
  // Solucions
  ['2023/10/imagen-soluciones-residenciales-life-tech.webp', 'solutions/residenciales-hero.webp'],
  ['2023/11/esquema-sistemas-ess-life-tech.webp', 'solutions/residenciales-esquema.webp'],
  ['2023/11/life-tech-soluciones-sistemas-industriales.jpeg', 'solutions/industriales-hero.jpg'],
  ['2023/11/life-tech-almacenamiento-energia.webp', 'solutions/industriales-sistema.webp'],
  ['2023/11/proyecto-1-life-tech.webp', 'solutions/proyecto-1.webp'],
  ['2023/11/proyecto-3-life-tech.webp', 'solutions/proyecto-3.webp'],
  ['2024/02/life-tech-soluciones-sistemas-plantas-FV.webp', 'solutions/plantas-fv-hero.webp'],
  ['2023/10/producto-ress-life-tech.webp', 'solutions/plantas-fv-ress.webp'],
  [
    '2023/11/imagen-sistemas-almacenamiento-energia-life-tech.webp',
    'solutions/almacenamiento-hero.webp',
  ],
  [
    '2023/11/esquema-sistema-almacenamiento-energia-life-tech.webp',
    'solutions/almacenamiento-esquema.webp',
  ],
  ['2023/11/life-tech-enery-storage-solution.webp', 'solutions/energy-storage-plantas-fv.webp'],
  [
    '2023/11/life-tech-solutions-solar-bess-charging-station-2-1-1.webp',
    'solutions/estacion-carga-hero.webp',
  ],
  [
    '2023/11/life-tech-hybrid-BESS-peak-shifting-1-1-1.webp',
    'solutions/peaking-shifting-hero.webp',
  ],
  ['2023/11/life-tech-almacenamiento-energia-portatil.webp', 'solutions/portatil-hero.webp'],
  // Corporatiu
  ['2023/11/imagen-1-quienes-somos-life-tech.webp', 'corporate/nosotros-1.webp'],
  ['2023/11/imagen-2-quienes-somos-life-tech.webp', 'corporate/nosotros-2.webp'],
  ['2023/11/life-tech-plantas-fv.webp', 'corporate/plantas-fv.webp'],
];

/** [origen, nom final dins public/descargas] */
const PDFS = [
  ['2023/11/lifetech-manual-Datos_Tecnicos_Liftech-_RESS.pdf', 'ficha-tecnica-ress.pdf'],
  ['2025/10/LIFETECH-LV-LITE.pdf', 'ficha-tecnica-lv-lite.pdf'],
  ['2025/10/LiFeTECH-HV.pdf', 'ficha-tecnica-hv-lite.pdf'],
  ['2025/10/LiFeTECH-LT5000.pdf.pdf', 'ficha-tecnica-lt5000.pdf'],
  ['2025/10/LiFeTECH-LT5000R.pdf', 'ficha-tecnica-lt5000r.pdf'],
  ['2025/11/LT-LFP-v2.pdf', 'ficha-tecnica-lt-12v-24v.pdf'],
  ['2023/11/lifetech-manual-high-rate-LT-HV.pdf', 'ficha-tecnica-lt-hv.pdf'],
  ['2023/11/lifetech-manual-LV-LITE-Mate-LV.pdf', 'manual-lv-lite.pdf'],
  ['2023/11/lifetech-manual-HV-LITE-Mate-HV.pdf', 'manual-hv-lite.pdf'],
  ['2023/11/lifetech-manual-LT5000-with-WIFI-FC.pdf', 'manual-lt5000.pdf'],
  ['2023/11/lifetech-manual-LT5000R-X1.pdf', 'manual-lt5000r.pdf'],
  ['2023/11/lifetech-manual-LT12020-LT24100.pdf', 'manual-lt-12v-24v.pdf'],
  ['2025/11/1_SLA-Replacement-Lithium-Battery-EN.pdf', 'manual-sustitucion-plomo-acido.pdf'],
  [
    '2025/11/inverter-compatibility-statements-Lifetech-V2.pdf',
    'guia-compatibilidad-inversores.pdf',
  ],
  ['2023/11/Documento-Garantia-Lifetech.pdf', 'carta-de-garantia-lifetech.pdf'],
];

for (const dir of ['products', 'solutions', 'corporate']) {
  await mkdir(`src/assets/images/${dir}`, { recursive: true });
}
await mkdir('public/descargas', { recursive: true });

let okImages = 0;
const dims = {};

for (const [origin, dest] of IMAGES) {
  const url = `${BASE}/${origin}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`✗ ${res.status} ${origin}`);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const target = `src/assets/images/${dest}`;
  const out = await sharp(buffer)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(target, out.data);
  dims[dest] = { width: out.info.width, height: out.info.height };
  okImages++;
  console.log(
    `✓ ${dest} ${out.info.width}×${out.info.height} ${(out.data.length / 1024).toFixed(0)} KB`,
  );
}

let okPdfs = 0;
for (const [origin, dest] of PDFS) {
  const res = await fetch(`${BASE}/${origin}`);
  if (!res.ok) {
    console.log(`✗ PDF ${res.status} ${origin}`);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(`public/descargas/${dest}`, buffer);
  okPdfs++;
  console.log(`✓ public/descargas/${dest} ${(buffer.length / 1024).toFixed(0)} KB`);
}

await writeFile(
  'D:/Users/awypu/AppData/Local/Temp/opencode/image-dims.json',
  JSON.stringify(dims, null, 2),
);
console.log(`\n${okImages} imatges, ${okPdfs} PDFs`);
