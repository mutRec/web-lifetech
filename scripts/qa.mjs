/**
 * QA del build estàtic.
 *
 * Comprova, per a cada HTML de `dist/`:
 *  - <title> present i amb contingut
 *  - exactament un <h1>
 *  - canonical quan la pàgina és indexable
 *  - JSON-LD vàlid
 *  - <img> amb alt
 *  - cap href/src buit ni "undefined"
 *
 * I fa un crawl dels enllaços interns per detectar rutes inexistents.
 *
 * Els enllaços a fitxers (PDF, imatges) també es validen.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

async function exists(path) {
  try {
    const info = await stat(path);
    return info.isFile();
  } catch {
    return false;
  }
}

/** Fitxers estàtics que no han de faltar mai. */
const REQUIRED_FILES = ['robots.txt', 'sitemap-index.xml', 'favicon.svg', 'images/og-default.jpg'];

const files = await walk(DIST);
const structural = [];
const broken = new Set();

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = file.replace(DIST, '').split('\\').join('/');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
  const noindex = robots.includes('noindex');
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  const problems = [];
  if (title.length < 10) problems.push('title curt');
  if (h1s !== 1) problems.push(`h1=${h1s}`);
  if (!noindex && !canonical) problems.push('sense canonical');
  if (html.includes('undefined')) problems.push('conté "undefined"');
  if (/href=""/.test(html)) problems.push('href buit');
  if (/src=""/.test(html)) problems.push('src buit');
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt(=|[\s>])/.test(img[0])) problems.push('img sense alt');
  }
  for (const block of ld) {
    try {
      JSON.parse(block[1]);
    } catch {
      problems.push('JSON-LD invàlid');
      break;
    }
  }

  const links = new Set(
    [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((match) => match[1]).filter(Boolean),
  );

  for (const href of links) {
    if (href.startsWith('//')) continue;
    const clean = href.split('?')[0].split('#')[0];
    if (!clean || clean === '/') continue;

    const candidates = clean.endsWith('/')
      ? [`${DIST}${clean}index.html`]
      : [`${DIST}${clean}`, `${DIST}${clean}/index.html`];

    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }
    if (!found) broken.add(`${page} → ${clean}`);
  }

  structural.push({
    page,
    problems,
    size: (html.length / 1024).toFixed(1),
    noindex,
    h1s,
  });
}

for (const row of structural) {
  console.log(
    `${row.problems.length ? '✗' : '✓'} ${row.page.padEnd(22)} h1=${row.h1s} ${row.noindex ? 'noindex' : 'index  '} ${row.size.padStart(5)} KB${
      row.problems.length ? `  ${row.problems.join(', ')}` : ''
    }`,
  );
}

const failures = structural.filter((row) => row.problems.length).length;

const missingFiles = [];
for (const file of REQUIRED_FILES) {
  if (!(await exists(join(DIST, file)))) missingFiles.push(file);
}

console.log(`\n${files.length} pàgines · ${failures} amb problemes estructurals`);

if (broken.size > 0) {
  console.log('\nEnllaços trencats:');
  for (const item of broken) console.log(`  ✗ ${item}`);
}

if (missingFiles.length > 0) {
  console.log('\nFitxers obligatoris absents:');
  for (const file of missingFiles) console.log(`  ✗ ${file}`);
}

process.exit(failures > 0 || broken.size > 0 || missingFiles.length > 0 ? 1 : 0);
