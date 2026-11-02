// scripts/figma/snapshot-components.js
//
// Snippet Figma Plugin API — modèle utilisé par le skill /sync-ds (et
// /sync-component) via l'outil MCP `use_figma` (fichier NZtxQVYKRqeaGcC7hT5pjw).
// Lecture seule. Ce n'est PAS un module Node : `await` et `return` de premier
// niveau sont fournis par l'environnement d'exécution de use_figma.
//
// Ne pas exécuter ce fichier directement : `node scripts/figma-sync-ds.mjs prepare`
// remplace le marqueur __REGISTRY__ par la liste des composants du DS (lue dans
// les fiches specs/) et écrit le snippet prêt à passer tel quel à use_figma.
//
// Sortie : { checksum, payload }
//   payload.tokens      empreinte de toutes les Figma Variables (noms + valeurs)
//   payload.components  par composant : nodes résolus, empreinte globale,
//                       empreinte par variante, composants du DS utilisés
//   payload.missing     composants dont aucun node n'existe plus dans Figma
//   payload.inventory   composants présents sur la page « Design system »
//                       (hors bibliothèque d'icônes), pour repérer les nouveaux
//   checksum            FNV-1a de JSON.stringify(payload), calculé ICI : le script
//                       Node le recalcule et refuse toute recopie altérée.

const REGISTRY = /*__REGISTRY__*/ {};
const DS_PAGE_ID = '1:2';
const ICON_CATEGORIES = /^(Shape|Media|User|System|Environment|Menu|Communication|Warning|Navigation|Edit|Calendar|Interface|File|Arrow) \//;

const fnv1a = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const toHex = (c) => '#' + hex2(c.r) + hex2(c.g) + hex2(c.b) + (c.a !== undefined && c.a < 1 ? hex2(c.a) : '');
const r2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

const varNames = new Map();
async function varName(id) {
  if (!varNames.has(id)) {
    const v = await figma.variables.getVariableByIdAsync(id);
    varNames.set(id, v ? v.name : '?' + id);
  }
  return varNames.get(id);
}
async function bindings(bv) {
  if (!bv) return undefined;
  const out = {};
  for (const k of Object.keys(bv).sort()) {
    const a = bv[k];
    const list = Array.isArray(a) ? a : [a];
    out[k] = [];
    for (const x of list) out[k].push(x && x.id ? await varName(x.id) : null);
  }
  return out;
}
async function paints(list) {
  if (!Array.isArray(list)) return list === figma.mixed ? 'mixed' : undefined;
  const out = [];
  for (const p of list) {
    const o = { t: p.type, v: p.visible !== false, o: r2(p.opacity ?? 1), bm: p.blendMode };
    if (p.type === 'SOLID') o.c = toHex(p.color);
    if (p.type === 'IMAGE') { o.img = p.imageHash; o.sm = p.scaleMode; }
    if (p.gradientStops) o.gs = p.gradientStops.map((s) => toHex(s.color) + '@' + r2(s.position));
    o.b = await bindings(p.boundVariables);
    out.push(o);
  }
  return out;
}
async function effects(list) {
  if (!Array.isArray(list)) return undefined;
  const out = [];
  for (const e of list) {
    out.push({ t: e.type, v: e.visible !== false, r: r2(e.radius), s: r2(e.spread),
      x: e.offset && r2(e.offset.x), y: e.offset && r2(e.offset.y), c: e.color && toHex(e.color),
      b: await bindings(e.boundVariables) });
  }
  return out;
}
const get = (n, k) => {
  try {
    const v = n[k];
    return v === figma.mixed ? 'mixed' : v;
  } catch (e) {
    return undefined;
  }
};

// Propriétés de composant (variantes, booléens, textes…) avec leurs défauts.
const propsSig = (n) => {
  const defs = n.componentPropertyDefinitions;
  return Object.keys(defs).sort().map((k) => [k.split('#')[0], defs[k].type, defs[k].defaultValue, defs[k].variantOptions || null]);
};

const NODE_PROPS = ['visible', 'opacity', 'rotation', 'layoutMode', 'layoutWrap', 'paddingLeft', 'paddingRight',
  'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing', 'primaryAxisAlignItems',
  'counterAxisAlignItems', 'primaryAxisSizingMode', 'counterAxisSizingMode', 'layoutSizingHorizontal',
  'layoutSizingVertical', 'layoutPositioning', 'layoutGrow', 'layoutAlign', 'minWidth', 'maxWidth', 'minHeight',
  'maxHeight', 'cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
  'strokeWeight', 'strokeAlign', 'dashPattern', 'clipsContent', 'blendMode', 'isMask'];

// Signature d'un node et de tout son sous-arbre (instances comprises : une
// surcharge locale, ex. couleur d'icône, est une décision de design).
// `deps` collecte les composants du DS instanciés dans le sous-arbre.
async function sig(n, deps, parent) {
  const s = { t: n.type, n: n.name, w: r2(n.width), h: r2(n.height) };
  for (const k of NODE_PROPS) {
    const v = get(n, k);
    if (v !== undefined) s[k] = Array.isArray(v) ? v.map(r2) : r2(v);
  }
  if (parent && parent.type !== 'COMPONENT_SET' && get(parent, 'layoutMode') === 'NONE') { s.x = r2(n.x); s.y = r2(n.y); }
  s.fills = await paints(get(n, 'fills'));
  s.strokes = await paints(get(n, 'strokes'));
  s.effects = await effects(get(n, 'effects'));
  s.b = await bindings(get(n, 'boundVariables'));
  if (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && (!n.parent || n.parent.type !== 'COMPONENT_SET'))) {
    s.props = propsSig(n);
  }
  if (n.type === 'TEXT') {
    s.chars = n.characters;
    s.auto = n.textAutoResize;
    s.align = [n.textAlignHorizontal, n.textAlignVertical];
    s.segs = [];
    const fields = ['fontName', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textDecoration', 'textCase', 'fills', 'boundVariables'];
    for (const g of n.getStyledTextSegments(fields)) {
      s.segs.push({ r: [g.start, g.end], f: g.fontName.family + ' ' + g.fontName.style, fs: g.fontSize, fw: g.fontWeight,
        lh: g.lineHeight, ls: g.letterSpacing, td: g.textDecoration, tc: g.textCase,
        fills: await paints(g.fills), b: await bindings(g.boundVariables) });
    }
  }
  if (n.type === 'VECTOR') s.paths = (get(n, 'vectorPaths') || []).map((p) => p.windingRule + ' ' + p.data);
  if (n.type === 'INSTANCE') {
    const main = await n.getMainComponentAsync();
    if (main) {
      const owner = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
      s.main = owner.name + ' / ' + main.name;
      deps.add(owner.id);
    }
    const cp = n.componentProperties;
    s.cp = Object.keys(cp).sort().map((k) => [k.split('#')[0], cp[k].value]);
  }
  if ('children' in n) {
    s.c = [];
    for (const child of n.children) s.c.push(await sig(child, deps, n));
  }
  return s;
}

// Un node de fiche peut être une variante ou une instance : on remonte au
// composant (ou set) de bibliothèque pour comparer la source, pas une copie.
async function resolveOwner(id) {
  let n = await figma.getNodeByIdAsync(id);
  if (!n) return null;
  if (n.type === 'INSTANCE') n = await n.getMainComponentAsync();
  if (n && n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') n = n.parent;
  return n;
}

// ─── Composants du DS ────────────────────────────────────────────────────────
const ownerToName = new Map();
const resolved = {};
const missing = [];
for (const name of Object.keys(REGISTRY).sort()) {
  const owners = [];
  for (const id of REGISTRY[name].ids) {
    const o = await resolveOwner(id);
    if (o && !owners.some((x) => x.id === o.id)) owners.push(o);
  }
  if (owners.length === 0) { missing.push(name); continue; }
  resolved[name] = owners;
  for (const o of owners) if (!ownerToName.has(o.id)) ownerToName.set(o.id, name);
}

const components = {};
for (const name of Object.keys(resolved)) {
  const deps = new Set();
  const variants = {};
  const rootSigs = [];
  for (const o of resolved[name]) {
    if (o.type === 'COMPONENT_SET') {
      // Le set lui-même : seulement ses propriétés (sa position et son cadre
      // sur le canvas ne sont pas du design) ; chaque variante a sa propre empreinte.
      rootSigs.push(fnv1a(JSON.stringify(propsSig(o))));
      for (const v of o.children) variants[v.name] = fnv1a(JSON.stringify(await sig(v, deps, o)));
    } else {
      variants[o.name] = fnv1a(JSON.stringify(await sig(o, deps, null)));
    }
  }
  const depNames = [...deps].map((id) => ownerToName.get(id)).filter((d) => d && d !== name);
  const keys = Object.keys(variants).sort();
  components[name] = {
    nodes: resolved[name].map((o) => o.id),
    hash: fnv1a(rootSigs.join(',') + '|' + keys.map((k) => k + '=' + variants[k]).join('|')),
    variants,
    deps: [...new Set(depNames)].sort(),
  };
}

// ─── Figma Variables (pour savoir s'il faut lancer /sync-tokens d'abord) ─────
const allVars = await figma.variables.getLocalVariablesAsync();
const varLines = [];
for (const v of allVars) {
  const vals = [];
  for (const m of Object.keys(v.valuesByMode).sort()) {
    const raw = v.valuesByMode[m];
    if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') vals.push('→' + (await varName(raw.id)));
    else if (raw && typeof raw === 'object' && 'r' in raw) vals.push(toHex(raw));
    else vals.push(String(raw));
  }
  varLines.push(v.name + '|' + v.resolvedType + '|' + vals.join(','));
}
varLines.sort();

// ─── Inventaire de la page « Design system » ─────────────────────────────────
const dsPage = await figma.getNodeByIdAsync(DS_PAGE_ID);
await figma.setCurrentPageAsync(dsPage);
const inventory = {};
for (const n of dsPage.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
  if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
  if (ICON_CATEGORIES.test(n.name)) continue;
  inventory[n.id] = n.name;
}

const payload = { tokens: { count: varLines.length, hash: fnv1a(varLines.join('\n')) }, components, missing, inventory };
return { checksum: fnv1a(JSON.stringify(payload)), payload };
