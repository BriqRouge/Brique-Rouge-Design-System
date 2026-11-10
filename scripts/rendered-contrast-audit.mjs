#!/usr/bin/env node
// scripts/rendered-contrast-audit.mjs
//
// Contrôle du contraste RENDU (WCAG 1.4.3) : complément de contrast-audit.mjs.
//
// contrast-audit.mjs vérifie les paires de tokens déclarées dans
// packages/tokens/contrast-pairs.config.js ; il ne voit pas une combinaison
// que personne n'a déclarée (ex. un libellé posé sur le fond d'un composant
// parent). Ce script ouvre chaque story du Storybook construit dans Chromium
// (Playwright) et y lance la règle axe-core `color-contrast`, qui calcule le
// contraste à partir des styles réellement calculés par le navigateur.
//
// Pourquoi un navigateur : jest-axe tourne sous jsdom, qui ne calcule pas les
// styles ; il ne détecte aucun défaut de contraste (démontré le 2026-11-10).
//
// - Violation : échec (code de sortie 1).
// - « incomplete » (fond indéterminable : image, superposition, dégradé) :
//   signalé, sans échec — à vérifier à l'œil.
// - Limite : seul l'état affiché au chargement est contrôlé. Les états
//   :hover / :focus restent couverts par contrast-audit.mjs.
//
// Usage :
//   pnpm --filter @brique-rouge/storybook exec storybook build -o storybook-static
//   node scripts/rendered-contrast-audit.mjs [dossier-storybook-static]
// Par défaut : packages/storybook/storybook-static

import { createServer } from 'http';
import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { extname, join, normalize, resolve } from 'path';
import { pathToFileURL } from 'url';

const repoRoot = join(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

// Sert le Storybook statique (fichiers uniquement, sans sortir du dossier).
function serve(root) {
  const server = createServer(async (req, res) => {
    const rel = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    const file = resolve(root, rel || 'index.html');
    if (!file.startsWith(resolve(root))) { res.writeHead(403); return res.end(); }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

// Stories à contrôler, dans l'ordre de l'index (les pages de documentation sont ignorées).
export function storiesFromIndex(index) {
  return Object.values(index.entries ?? {}).filter((e) => e.type === 'story').map((e) => ({ id: e.id, title: e.title, name: e.name }));
}

async function main() {
  const root = resolve(process.argv[2] ?? join(repoRoot, 'packages/storybook/storybook-static'));
  if (!existsSync(join(root, 'index.json'))) {
    console.error(`Storybook statique introuvable dans ${root} — lancer d'abord « storybook build ».`);
    process.exit(2);
  }
  const stories = storiesFromIndex(JSON.parse(readFileSync(join(root, 'index.json'), 'utf8')));
  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const { chromium } = await import('playwright');

  const server = await serve(root);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const violations = [];
  const incomplete = [];
  const errors = [];

  try {
    for (const story of stories) {
      try {
        await page.goto(`${base}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForSelector('#storybook-root > *', { timeout: 10000 });
        // État final des animations d'entrée, sans transition en cours.
        await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}' });
        await page.evaluate(() => document.fonts.ready);
        await page.addScriptTag({ content: axeSource });
        const result = await page.evaluate(async () => {
          // eslint-disable-next-line no-undef
          const r = await axe.run('#storybook-root', { runOnly: ['color-contrast'] });
          const nodes = (list) => list.flatMap((v) => v.nodes.map((n) => ({ target: n.target.join(' '), data: n.any[0]?.data ?? {}, message: n.any[0]?.message ?? '' })));
          return { violations: nodes(r.violations), incomplete: nodes(r.incomplete) };
        });
        for (const n of result.violations) violations.push({ story, ...n });
        for (const n of result.incomplete) incomplete.push({ story, ...n });
      } catch (e) {
        errors.push({ story, error: String(e.message ?? e).split('\n')[0] });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`Contraste rendu : ${stories.length} stories contrôlées dans Chromium (axe-core color-contrast)`);
  for (const n of incomplete) console.log(`   ⚠️  à vérifier à l'œil — ${n.story.title} › ${n.story.name} : ${n.target} — ${n.message}`);
  for (const e of errors) console.error(`   ❌ story non contrôlée — ${e.story.title} › ${e.story.name} : ${e.error}`);
  if (violations.length) {
    console.error(`\n❌ ${violations.length} élément(s) sous le seuil WCAG :`);
    for (const n of violations) {
      const d = n.data;
      console.error(`   ${d.contrastRatio}:1 < ${d.expectedContrastRatio}  ${d.fgColor} sur ${d.bgColor}  — ${n.story.title} › ${n.story.name} : ${n.target}`);
    }
    console.error('\nCorriger le token dans Figma (puis /sync-tokens) ou le token utilisé par le composant, et déclarer la paire dans packages/tokens/contrast-pairs.config.js.');
  }
  if (violations.length || errors.length) process.exit(1);
  console.log(`✅ Aucun défaut de contraste rendu${incomplete.length ? ` (${incomplete.length} élément(s) à vérifier à l'œil)` : ''}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
