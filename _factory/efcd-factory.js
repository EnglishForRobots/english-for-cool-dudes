#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   EFCD LESSON FACTORY — merge + check tool  (no dependencies, Node 18+)

   Run from the repo root:
     node _factory/efcd-factory.js check    → test every pack in _factory/packs/
     node _factory/efcd-factory.js merge    → write packs into the shared files
     node _factory/efcd-factory.js audit    → look for ID mismatches in the
                                              hand-written parts of the site
   Add --dry to merge to see what would change without writing anything.

   A "pack" is one JSON file per lesson in _factory/packs/ :
   {
     "slug":  "weeklydrop025",            // the lesson folder / URL
     "shelf": "weeklydrop",               // key of LEVEL_FILES below
     "adminLevel": "Weekly Drop",         // optional label for the admin page
     "grammarFocus": "…",                 // optional, else built from grammar topics
     "card": { icon, badge, badgeType, title, desc, mins, date, tags },
     "registry": { …the full LESSON_DATA_REGISTRY entry (id, title, vocab…) }
   }
   merge only ever rewrites text BETWEEN the two EFCD-AUTO markers.
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = process.cwd();
const PACK_DIR = path.join(ROOT, '_factory', 'packs');
const START = '/* EFCD-AUTO-START */', END = '/* EFCD-AUTO-END */';

const FILES = {
  registry:  'lesson-data-registry.js',
  rewards:   'lesson-completion-rewards.js',
  levelPage: 'level-page.js',
  myLessons: 'my-lessons/index.html',
  admin:     'admin/index.html',
};
/* ← EDIT THESE: which lessons-data file belongs to which shelf */
const LEVEL_FILES = {
  beginner:     'lessons-data-beginner.js',
  intermediate: 'lessons-data-intermediate.js',
  advanced:     'lessons-data-advanced.js',
  tax:          'lessons-data-tax.js',
  weeklydrop:   'lessons-data-weeklydrop.js',
};
const STRICT_LONGEST = true;   // correct answer must not be the strictly longest option

const q = JSON.stringify;
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));

/* ── marker handling ─────────────────────────────────────────── */
function markerPos(text, rel) {
  const s = text.indexOf(START), e = text.indexOf(END);
  if (s < 0 || e < 0 || e < s || text.indexOf(START, s + 1) >= 0 || text.indexOf(END, e + 1) >= 0)
    throw new Error(`${rel}: needs exactly one START marker followed by one END marker`);
  return [s, e];
}
function outside(text, rel) { const [s, e] = markerPos(text, rel); return text.slice(0, s) + text.slice(e + END.length); }
function withBlock(text, rel, lines) {
  const [s, e] = markerPos(text, rel);
  return text.slice(0, s + START.length) + '\n' + lines.join('\n') + (lines.length ? '\n' : '') + text.slice(e);
}

/* ── load packs ──────────────────────────────────────────────── */
function loadPacks() {
  if (!fs.existsSync(PACK_DIR)) return [];
  return fs.readdirSync(PACK_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_')).sort().map(file => {
    try { return { file, pack: JSON.parse(fs.readFileSync(path.join(PACK_DIR, file), 'utf8')) }; }
    catch (e) { return { file, pack: null, parseError: e.message }; }
  });
}

/* ── pack checks ─────────────────────────────────────────────── */
const norm = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '');
const strictlyLongest = (answer, others) => others.length && others.every(o => String(answer).length > String(o).length);

function checkPack({ file, pack, parseError }) {
  const E = [], W = [];
  const err = m => E.push(`${file}: ${m}`), warn = m => W.push(`${file}: ${m}`);
  if (parseError) { err('not valid JSON — ' + parseError); return { E, W }; }
  const r = pack.registry;
  for (const k of ['slug', 'shelf', 'card', 'registry']) if (!pack[k]) err(`missing "${k}"`);
  if (!r) return { E, W };
  if (!/^[A-Za-z0-9-]+$/.test(pack.slug || '')) err('slug may only contain letters, digits and hyphens');
  if (pack.shelf && !LEVEL_FILES[pack.shelf]) err(`shelf "${pack.shelf}" is not in LEVEL_FILES`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id || '')) err('registry.id must be lowercase-with-hyphens');
  for (const k of ['title', 'level', 'track', 'emoji', 'badge']) if (!r[k]) err(`registry.${k} missing`);
  if (!Array.isArray(r.vocab) || r.vocab.length < 6) err('registry.vocab needs at least 6 words');
  if (!Array.isArray(r.true_false) || r.true_false.length < 5) err('registry.true_false needs at least 5 statements');

  /* lesson files */
  if (pack.slug) {
    for (const f of [`${pack.slug}/index.html`, `${pack.slug}/print/index.html`])
      if (!exists(f)) err(`lesson file missing: ${f}`);
    if (exists(`${pack.slug}/index.html`) && !read(`${pack.slug}/index.html`).includes(r.id))
      err(`${pack.slug}/index.html never mentions the id "${r.id}" — completion tracking would break`);
  }

  /* card */
  const c = pack.card || {};
  for (const k of ['icon', 'badge', 'title', 'desc']) if (!c[k]) err(`card.${k} missing`);
  if (typeof c.mins !== 'number') err('card.mins must be a number');
  if (!/^\d{4}-\d\d-\d\d$/.test(c.date || '')) err('card.date must look like 2026-11-02');
  if (c.badgeType !== null && c.badgeType !== 'new' && c.badgeType !== undefined) err('card.badgeType must be null or "new"');

  /* vocab */
  (r.vocab || []).forEach((v, i) => {
    const t = `vocab[${i}] "${v.word}"`;
    if (!v.word || !v.definition) return err(`${t}: word/definition missing`);
    if (!String(v.example || '').includes('___')) err(`${t}: example needs ___`);
    const d = v.distractors || [];
    if (d.length < 2 || d.length > 4) err(`${t}: needs 2–4 distractors`);
    if (d.map(x => x.toLowerCase()).includes(v.word.toLowerCase())) err(`${t}: a distractor equals the answer`);
    if (new Set(d).size !== d.length) err(`${t}: duplicate distractors`);
    if (STRICT_LONGEST && strictlyLongest(v.word, d)) err(`${t}: correct answer is the longest option`);
  });

  /* grammar */
  for (const key of ['grammar', 'grammar2']) {
    const g = r[key]; if (!g) continue;
    if (!g.topic || !g.rule) err(`${key}: topic/rule missing`);
    if (!Array.isArray(g.exercises) || g.exercises.length < 3) { err(`${key}: needs at least 3 exercises`); continue; }
    g.exercises.forEach((x, i) => {
      const t = `${key}[${i}]`;
      const blanks = (String(x.sentence).match(/___/g) || []).length;
      if (!blanks) err(`${t}: sentence needs ___`);
      const parts = String(x.answer).split(' / ').length;
      if (blanks && blanks !== parts) err(`${t}: ${blanks} blank(s) but answer has ${parts} part(s) (use "a / b")`);
      const w = x.wrong || [];
      if (w.length < 2 || w.length > 3) err(`${t}: needs 2–3 wrong options`);
      if (w.includes(x.answer)) err(`${t}: a wrong option equals the answer`);
      if (STRICT_LONGEST && strictlyLongest(x.answer, w)) err(`${t}: correct answer is the longest option`);
      if (!x.explain) err(`${t}: explain missing`);
    });
  }

  /* sentence builder */
  (r.sentences || []).forEach((s, i) => {
    const t = `sentences[${i}]`;
    if (!Array.isArray(s.words) || !s.answer) return err(`${t}: words/answer missing`);
    const a = s.answer.split(' ').map(norm).filter(Boolean), w = s.words.map(norm).filter(Boolean);
    if (a.slice().sort().join('|') !== w.slice().sort().join('|')) err(`${t}: word bank and answer don't contain the same words`);
    else if (w.length > 2 && a.join('|') === w.join('|')) err(`${t}: word bank is already in answer order`);
  });

  /* true / false */
  let trues = 0;
  (r.true_false || []).forEach((x, i) => {
    const t = `true_false[${i}]`;
    if (typeof x.correct !== 'boolean') return err(`${t}: correct must be true or false`);
    if (x.correct) trues++;
    const rev = String(x.reveal || '');
    if (/^✅/.test(rev) && !x.correct) err(`${t}: reveal says ✅ but correct is false`);
    if (/^❌/.test(rev) && x.correct) err(`${t}: reveal says ❌ but correct is true`);
    if (!/^(✅|❌|True|False)/i.test(rev)) warn(`${t}: reveal doesn't start with ✅/❌`);
  });
  const n = (r.true_false || []).length;
  if (n && (trues / n > 0.7 || trues / n < 0.3)) warn(`true_false is lopsided (${trues} true of ${n})`);

  /* index-based games */
  for (const key of ['fix_mistakes', 'beat_clock', 'quiz_boss']) {
    const arr = r[key]; if (!Array.isArray(arr)) continue;
    arr.forEach((x, i) => {
      if (!Array.isArray(x.opts) || !Number.isInteger(x.correct) || x.correct < 0 || x.correct >= x.opts.length)
        err(`${key}[${i}]: "correct" must be a valid index into "opts"`);
    });
    if (arr.length > 2 && new Set(arr.map(x => x.correct)).size === 1) warn(`${key}: the correct answer is always option ${arr[0].correct}`);
  }
  return { E, W };
}

/* ── merge ───────────────────────────────────────────────────── */
function buildBlocks(packs) {
  const b = { registry: [], rewards: [], levelPage: [], myLessons: [], admin: [], levels: {} };
  for (const { pack } of packs) {
    const r = pack.registry, id = r.id, slug = pack.slug, link = `/${slug}/`;
    const grammar = pack.grammarFocus || [r.grammar && r.grammar.topic, r.grammar2 && r.grammar2.topic].filter(Boolean).join('; ');
    b.registry.push(`LESSON_DATA_REGISTRY[${q(id)}] = ${JSON.stringify(r, null, 2)};`);
    b.rewards.push(`LESSON_VOCAB_REGISTRY[${q(id)}] = ${JSON.stringify({ title: r.title, level: r.level, grammar,
      vocab: (r.vocab || []).map(v => ({ word: v.word, definition: v.definition })) }, null, 2)};`);
    b.levelPage.push(`CLASS_LESSON_IDS[${q(slug)}] = ${q(id)};`);
    b.myLessons.push(`LINK_TO_ID[${q(link)}] = ${q(id)};`, `ID_TO_LINK[${q(id)}] = ${q(link)};`);
    b.admin.push(`LESSON_META[${q(id)}] = ${q({ emoji: r.emoji, title: r.title, level: pack.adminLevel || r.level, worksheetLink: link + 'print/' })};`);
    (b.levels[pack.shelf] = b.levels[pack.shelf] || []).push(`window.LESSONS.push(${JSON.stringify({ ...pack.card, slug }, null, 2)});`);
  }
  return b;
}

function merge(dry) {
  const loaded = loadPacks(), E = [];
  loaded.forEach(l => E.push(...checkPack(l).E));
  if (E.length) { console.log('❌ Packs have errors — nothing was written:\n' + E.map(e => '  • ' + e).join('\n')); return 1; }
  const packs = loaded.map(l => l);
  const b = buildBlocks(packs);
  const plan = [
    [FILES.registry, b.registry, p => `'${p.pack.registry.id}'`],
    [FILES.rewards,  b.rewards,  p => `'${p.pack.registry.id}'`],
    [FILES.levelPage, b.levelPage, p => `'${p.pack.slug}'`],
    [FILES.myLessons, b.myLessons, p => `'/${p.pack.slug}/'`],
    [FILES.admin,    b.admin,    p => `'${p.pack.registry.id}'`],
    ...Object.entries(LEVEL_FILES).map(([k, f]) => [f, b.levels[k] || [], p => `'${p.pack.slug}'`, k]),
  ];
  const writes = [];
  for (const [rel, lines, needle, shelf] of plan) {
    if (!exists(rel)) {
      if (shelf && (b.levels[shelf] || []).length) E.push(`${rel} not found (shelf "${shelf}") — fix LEVEL_FILES`);
      else if (!shelf) E.push(`${rel} not found`);
      continue;
    }
    const text = read(rel);
    let out;
    try { out = outside(text, rel); } catch (e) { E.push(e.message); continue; }
    const mine = shelf ? packs.filter(p => p.pack.shelf === shelf) : packs;
    mine.forEach(p => { if (out.includes(needle(p))) E.push(`${rel}: ${needle(p)} is already defined by hand outside the markers`); });
    writes.push([rel, text, withBlock(text, rel, lines)]);
  }
  if (E.length) { console.log('❌ Nothing was written:\n' + E.map(e => '  • ' + e).join('\n')); return 1; }
  let changed = 0;
  for (const [rel, oldT, newT] of writes) {
    if (oldT === newT) { console.log(`  = ${rel} (unchanged)`); continue; }
    changed++; console.log(`  ✎ ${rel}`);
    if (!dry) fs.writeFileSync(path.join(ROOT, rel), newT);
  }
  console.log(`✅ ${packs.length} pack(s) merged, ${changed} file(s) ${dry ? 'would change (dry run)' : 'updated'}.`);
  return 0;
}

/* ── audit of hand-written parts ─────────────────────────────── */
function blockOf(text, re) {
  const i = text.search(re); if (i < 0) return '';
  const m = text.slice(i).search(/\n\s*\};/); return text.slice(i, m < 0 ? undefined : i + m);
}
const pairs = s => [...s.matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)].map(m => [m[1], m[2]]);
const keys = s => [...s.matchAll(/^\s*['"]([^'"]+)['"]\s*:\s*\{/gm)].map(m => m[1]);

function audit() {
  const ctx = { window: {}, module: { exports: {} }, console }; vm.createContext(ctx);
  vm.runInContext(read(FILES.registry), ctx);
  const reg = new Set(Object.keys(ctx.module.exports));
  const lp = read(FILES.levelPage), ml = read(FILES.myLessons), ad = read(FILES.admin), rw = read(FILES.rewards);
  const CLASS = pairs(blockOf(lp, /const\s+CLASS_LESSON_IDS\s*=\s*\{/));
  const L2I = pairs(blockOf(ml, /const\s+LINK_TO_ID\s*=\s*\{/));
  const I2L = Object.fromEntries(pairs(blockOf(ml, /const\s+ID_TO_LINK\s*=\s*\{/)));
  const META = keys(blockOf(ad, /const\s+LESSON_META\s*=\s*\{/));
  const metaLinks = Object.fromEntries(pairs(blockOf(ad, /const\s+LESSON_META\s*=\s*\{/)).filter(([k]) => k === 'worksheetLink').map((p, i) => [i, p[1]]));
  const RW = new Set([...keys(blockOf(rw, /const\s+LESSON_VOCAB_REGISTRY\s*=\s*\{/)),
    ...[...rw.matchAll(/LESSON_VOCAB_REGISTRY\[['"]([^'"]+)['"]\]\s*=/g)].map(m => m[1])]);
  const out = [];
  const sec = (t, a) => { if (a.length) out.push(`\n⚠️ ${t}\n` + [...new Set(a)].map(x => '  • ' + x).join('\n')); };

  sec('level-page.js: slug → id points to an id that is NOT in lesson-data-registry.js',
    CLASS.filter(([, id]) => !reg.has(id)).map(([s, id]) => `'${s}' → '${id}'`));
  sec('my-lessons: LINK_TO_ID points to an id that is NOT in the registry',
    L2I.filter(([, id]) => !reg.has(id)).map(([l, id]) => `${l} → ${id}`));
  sec('my-lessons: LINK_TO_ID and ID_TO_LINK disagree',
    L2I.filter(([l, id]) => I2L[id] !== l).map(([l, id]) => `${l} → ${id}, but ID_TO_LINK says ${I2L[id] || '(missing)'}`));
  sec('my-lessons: ID_TO_LINK has an id that is NOT in the registry',
    Object.keys(I2L).filter(id => !reg.has(id)));
  sec('admin: LESSON_META has an id that is NOT in the registry', META.filter(id => !reg.has(id)));
  sec('level-page and my-lessons disagree about a lesson\'s id',
    CLASS.filter(([s, id]) => { const hit = L2I.find(([l]) => l === `/${s}/`); return hit && hit[1] !== id; })
      .map(([s, id]) => `'${s}': level-page says ${id}, my-lessons says ${L2I.find(([l]) => l === `/${s}/`)[1]}`));
  sec('level-page: slug looks malformed (slashes/spaces)', CLASS.filter(([s]) => /[\/\s]/.test(s)).map(([s]) => s));
  sec('lesson folder missing for a slug', CLASS.filter(([s]) => !exists(`${s}/index.html`)).map(([s]) => s));
  sec('in registry but not in lesson-completion-rewards.js', [...reg].filter(id => !RW.has(id)));
  sec('in lesson-completion-rewards.js but not in registry (often fine for older lessons)', [...RW].filter(id => !reg.has(id)));
  console.log(out.length ? '🔎 Audit findings:' + out.join('\n') : '✅ Audit found nothing.');
  return 0;
}

/* ── CLI ─────────────────────────────────────────────────────── */
const cmd = process.argv[2];
if (cmd === 'check') {
  const loaded = loadPacks(); let bad = 0;
  loaded.forEach(l => { const { E, W } = checkPack(l);
    console.log(`${E.length ? '❌' : '✅'} ${l.file}`); E.forEach(e => console.log('   ERROR ' + e.replace(l.file + ': ', ''))); W.forEach(w => console.log('   warn  ' + w.replace(l.file + ': ', ''))); bad += E.length; });
  if (!loaded.length) console.log('No packs found in _factory/packs/');
  process.exit(bad ? 1 : 0);
} else if (cmd === 'merge') process.exit(merge(process.argv.includes('--dry')));
else if (cmd === 'audit') process.exit(audit());
else { console.log('Usage: node _factory/efcd-factory.js check | merge [--dry] | audit'); process.exit(2); }
