/**
 * Genera la imatge Open Graph per defecte (1200×630) a partir del logotip
 * blanc de marca. Executa'l amb `npm run og` quan canviï la identitat visual.
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = 'public/images/og-default.jpg';

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00283f"/>
      <stop offset="0.55" stop-color="#00436d"/>
      <stop offset="1" stop-color="#03587c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.7">
      <stop offset="0" stop-color="#006699" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#006699" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="#006699"/>
</svg>
`;

await mkdir('public/images', { recursive: true });

const logo = await sharp('public/brand/logo-life-tech-footer.svg')
  .resize({ width: 560 })
  .png()
  .toBuffer();

const logoMeta = await sharp(logo).metadata();

await sharp(Buffer.from(background))
  .composite([
    {
      input: logo,
      left: Math.round((WIDTH - (logoMeta.width ?? 560)) / 2),
      top: Math.round((HEIGHT - (logoMeta.height ?? 300)) / 2),
    },
  ])
  .jpeg({ quality: 82, progressive: true })
  .toFile(OUTPUT);

console.log(`✓ ${OUTPUT} (${WIDTH}×${HEIGHT})`);
