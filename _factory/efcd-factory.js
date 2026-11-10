#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   EFCD LESSON FACTORY — merge + check tool  (no dependencies, Node 18+)

   Run from the repo root:
     node _factory/efcd-factory.js build    → generate each lesson page + worksheet from its pack
        extra options:  --file <pack.json>  test one pack anywhere (touches nothing real)
                        --out <folder>      write the pages there instead of the real site
                        --base <url>        add <base href> so a downloaded preview loads the live site's scripts
                        --noindex           tell search engines to ignore the generated pages (previews)
     node _factory/efcd-factory.js check    → test every pack in _factory/packs/
     node _factory/efcd-factory.js merge    → write packs into the shared files
     node _factory/efcd-factory.js coverage → which grammar areas each track taught recently
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
const LEVEL_FILES = {   // shelf name (used in packs) → lessons-data file
  beginner:     'lessons-data-beginner.js',
  intermediate: 'lessons-data-intermediate.js',
  advanced:     'lessons-data-advanced.js',
  tax:          'lessons-data-tax.js',
  legal:        'lessons-data-legal.js',
  business:     'lessons-data-business.js',
  kids:         'lessons-data-kids.js',
  weeklydrop:   'lessons-data-weeklydrop.js',
};
/* "correct answer is the longest option": false = warning only, true = error.
   Weekly Drop 024's own grammar items break this (is wearing / wears / wear), so it starts as a warning. */
const LONGEST_IS_ERROR = false;

const ARGS = process.argv.slice(3);
const argVal = n => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
const PREVIEW = !!argVal('--file');   // --file <pack.json>: test a single pack anywhere, touch nothing real

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
  const one = argVal('--file');
  if (one) {
    try { return [{ file: path.basename(one), pack: JSON.parse(fs.readFileSync(path.resolve(ROOT, one), 'utf8')) }]; }
    catch (e) { return [{ file: path.basename(one), pack: null, parseError: e.message }]; }
  }
  if (!fs.existsSync(PACK_DIR)) return [];
  return fs.readdirSync(PACK_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_')).sort().map(file => {
    try { return { file, pack: JSON.parse(fs.readFileSync(path.join(PACK_DIR, file), 'utf8')) }; }
    catch (e) { return { file, pack: null, parseError: e.message }; }
  });
}

/* ── pack checks ─────────────────────────────────────────────── */
const norm = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '');
const strictlyLongest = (answer, others) => others.length && others.every(o => String(answer).length > String(o).length);
const lenCheck = (E, W, t, answer, others) => { if (/\s/.test(String(answer)) && strictlyLongest(answer, others)) (LONGEST_IS_ERROR ? E : W).push(`${t}: correct answer is the longest option`); };

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
  if (pack.slug && !PREVIEW) {
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
    lenCheck(E, W, `${file}: ${t}`, v.word, d);
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
      lenCheck(E, W, `${file}: ${t}`, x.answer, w);
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
  if (pack.page || pack.worksheet) checkPage(pack, err, warn, E, W, file);
  { const rw = repeatWarning(pack); if (rw) warn(rw); }
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
  const wsLinks = [...blockOf(ad, /const\s+LESSON_META\s*=\s*\{/).matchAll(/^\s*['"]([^'"]+)['"]\s*:\s*\{[^\n]*?worksheetLink\s*:\s*['"]([^'"]+)['"]/gm)].map(m => [m[1], m[2]]);
  const folderOk = l => exists(l.replace(/^\//, '') + 'index.html');
  sec('admin: worksheet link points to a folder that does not exist', wsLinks.filter(([, l]) => !folderOk(l)).map(([id, l]) => `${id} → ${l}`));
  sec('my-lessons: lesson link points to a folder that does not exist', Object.entries(I2L).filter(([, l]) => !folderOk(l)).map(([id, l]) => `${id} → ${l}`));
  sec('lesson folder missing for a slug', CLASS.filter(([s]) => !exists(`${s}/index.html`)).map(([s]) => s));
  sec('in registry but not in lesson-completion-rewards.js', [...reg].filter(id => !RW.has(id)));
  sec('in lesson-completion-rewards.js but not in registry (often fine for older lessons)', [...RW].filter(id => !reg.has(id)));
  console.log(out.length ? '🔎 Audit findings:' + out.join('\n') : '✅ Audit found nothing.');
  return 0;
}


/* ═══ PAGE + WORKSHEET: checks and rendering (Weekly Drop template) ═══ */
const TPL_DIR = path.join(ROOT, '_factory', 'templates');
const pad3 = n => String(n).padStart(3, '0');
const jsStr = v => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function sshuf(arr, rand) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function fillTpl(tpl, map, name) {
  let out = tpl;
  for (const [k, v] of Object.entries(map)) out = out.split(`__${k}__`).join(v);
  const left = out.match(/__[A-Z][A-Z0-9_]*__/g);
  if (left) throw new Error(`${name}: unfilled placeholders ${[...new Set(left)].join(', ')}`);
  return out;
}
const badTokenIndex = (w, wrong) => w.split(' ').findIndex(t => t.replace(/[^\w'’-]/g, '') === wrong);

function render(pack) {
  const r = pack.registry, pg = pack.page, ws = pack.worksheet, slug = pack.slug, link = `/${slug}/`;
  const issue = pad3(pg.issue), next = pad3(pg.issue + 1);
  const th = Object.assign({ pitch: '#0B2B3A', pitch2: '#0E7C86', yel: '#FF9F1C', yelD: '#D17A00' }, pg.theme || {});
  const nWords = Object.keys(pg.glossary).length;
  const stats = [...pg.hero.stats, [String(nWords), 'New words']].map(([n, l]) => `<div class="st"><b>${n}</b><small>${l}</small></div>`).join('\n');
  const tick = pg.hero.ticker.map(t => `<span>${t}</span>`).join('·');
  const content = { glossary: pg.glossary, ice: pg.ice, read: pg.read, vid: pg.vid, vidTitle: pg.vidTitle, vidTip: pg.vidTip, vidEnd: pg.vidEnd,
    youtubeId: pg.youtubeId, videoTitle: pg.videoTitle, emo: pg.emo, wp: pg.wp, wpEnd: pg.wpEnd, slip: pg.slip, slipEnd: pg.slipEnd, fin: pg.fin };
  const index = fillTpl(read('_factory/templates/weeklydrop-lesson.html'), {
    TITLE_TAG: `${pg.emoji} Issue ${issue} — ${pg.shortTitle} · The Weekly Drop`,
    PITCH: th.pitch, PITCH2: th.pitch2, YEL: th.yel, YELD: th.yelD,
    EMOJI: pg.emoji, ISSUE: issue, NEXT: next, DATE: pg.dateLabel.toUpperCase(),
    HERO_H1: pg.hero.h1, STATS: stats, TICKER: tick + '·' + tick, CTA: pg.hero.cta || "Let's play!",
    BADGE_NAME: pg.badgeName,
    J_LESSON_ID: jsStr(r.id), J_LESSON_TITLE: jsStr(r.title), J_LESSON_LINK: jsStr(link), J_LESSON_LEVEL: jsStr(r.level),
    J_EMOJI: jsStr(pg.emoji), J_BADGE_TITLE: jsStr(`${pg.badgeName} - Issue ${issue}`),
    PAGE_JSON: jsStr(content),
  }, 'weeklydrop-lesson.html');

  /* worksheet: every shuffle is seeded by the slug, and the answer key is computed from the same data */
  const L = 'ABCDEFGH';
  const mt = ws.matching; let order = mt.map((_, i) => i), seed = 0;
  do { order = sshuf(mt.map((_, i) => i), rng(slug + 'm' + seed++)); } while (order.every((v, i) => v === i) && seed < 20);
  const matchHtml = `<div class="wm-container"><div><div class="wm-col-head">Words</div>${mt.map((m, i) => `<div class="wm-term"><i>${i + 1}</i>${m[0]} &nbsp;____</div>`).join('')}</div><div><div class="wm-col-head">Meanings</div>${order.map((m, p) => `<div class="wm-def"><span class="wm-letter">${L[p]}</span>${mt[m][1]}</div>`).join('')}</div></div>`;
  const matchKey = mt.map((_, i) => `<em>${L[order.indexOf(i)]}</em>`);
  const bank = sshuf(ws.gaps.map(g => g.a), rng(slug + 'b'));
  const gapsHtml = `<div class="word-bank"><div class="word-bank-label">Word bank</div>${bank.map(w => `<span class="bank-word">${w}</span>`).join('')}</div><div class="vocab-grid">${ws.gaps.map((g, i) => `<div class="vocab-row"><div class="vocab-num">${i + 1}.</div><div class="vocab-sentence">${g.s.replace('___', '<span class="vocab-blank"></span>')}</div></div>`).join('')}</div>`;
  /* correct answers are spread evenly over A/B/C (each position used equally often, in a seeded random order) */
  const cpos = sshuf(ws.closest.map((_, i) => i % 3), rng(slug + 'p'));
  const closestOpts = ws.closest.map((c, i) => { const rest = sshuf(c.o.slice(1), rng(slug + 'c' + i)); rest.splice(cpos[i], 0, c.o[0]); return rest; });
  const closestHtml = `<div class="sw-grid">${ws.closest.map((c, i) => `<div class="sw-item"><div class="sw-q">${i + 1}. ${c.q.replace(/\[\[(.+?)\]\]/g, '<u>$1</u>')}</div><div class="sw-opts">${closestOpts[i].map(o => `<span class="sw-opt">${o}</span>`).join('')}</div></div>`).join('')}</div>`;
  const slipHtml = `<div class="vocab-grid">${pg.slip.map((x, i) => `<div class="vocab-row"><div class="vocab-num">${i + 1}.</div><div class="vocab-sentence">${x.w} <span class="vocab-blank long"></span></div></div>`).join('')}</div><div class="giggle">${ws.giggle}</div>`;
  const lines = (items, per) => { const out = []; for (let i = 0; i < items.length; i += per) { const ch = items.slice(i, i + per); out.push(`<div class="ans-line"><span class="ans-num">${i + 1}.</span><span class="ans-val">${ch.map((x, k) => k === 0 ? x : `${i + k + 1}. ${x}`).join(' · ')}</span></div>`); } return out.join(''); };
  const slipKey = pg.slip.map(x => { const ws_ = x.w.split(' '), i = badTokenIndex(x.w, x.wrong); const m = ws_[i].match(/^(\W*)(.*?)(\W*)$/); ws_[i] = `${m[1]}<em>${x.o[0]}</em>${m[3]}`; return ws_.join(' '); });
  const block = (t, inner) => `<div class="ans-block"><div class="ans-block-title">${t}</div>${inner}</div>`;
  const answers = [
    block('A — Matching', lines(matchKey, 6)),
    block('C — Closest meaning', lines(ws.closest.map(c => `<em>${c.o[0]}</em>`), 3)),
    block('B — Gap fill', lines(ws.gaps.map(g => `<em>${g.a}</em>`), 4)),
    block('D — Fix the slip', slipKey.map((k, i) => `<div class="ans-line"><span class="ans-num">${i + 1}.</span><span class="ans-val">${k}</span></div>`).join('')),
  ].join('\n');
  const print = fillTpl(read('_factory/templates/weeklydrop-worksheet.html'), {
    WS_TITLE_TAG: `The Weekly Drop · Issue ${issue} — ${pg.shortTitle} — Printable Worksheet`,
    EMOJI: pg.emoji, ISSUE: issue, WS_TITLE_HTML: ws.titleHtml, WS_SUB: ws.sub, WS_STUB: ws.stub || pg.emoji,
    WS_MATCH: matchHtml, WS_GAPS: gapsHtml, WS_CLOSEST: closestHtml, WS_SLIP: slipHtml, WS_ANSWERS: answers,
    J_LESSON_LINK: jsStr(link), J_LESSON_TITLE: jsStr(r.title),
  }, 'weeklydrop-worksheet.html');
  return { index, print };
}

function checkPage(pack, err, warn, E, W, file) {
  const pg = pack.page, ws = pack.worksheet, r = pack.registry;
  if (!pg) return err('has "worksheet" but no "page"');
  if (!ws) return err('has "page" but no "worksheet"');
  const need = (o, keys, where) => keys.forEach(k => { if (o[k] === undefined || o[k] === '') err(`${where}.${k} missing`); });
  need(pg, ['issue', 'dateLabel', 'shortTitle', 'emoji', 'badgeName', 'hero', 'youtubeId', 'videoTitle', 'vidTitle', 'vidTip', 'vidEnd', 'wpEnd', 'slipEnd', 'ice', 'glossary', 'read', 'vid', 'emo', 'wp', 'slip', 'fin'], 'page');
  need(ws, ['titleHtml', 'sub', 'matching', 'gaps', 'closest', 'giggle'], 'worksheet');
  if (!pg.hero || !pg.ice || !pg.glossary) return;
  if (!Number.isInteger(pg.issue)) err('page.issue must be a whole number');
  if (!/^[\w-]{11}$/.test(pg.youtubeId || '')) err('page.youtubeId must be the 11-character YouTube id');
  if (!Array.isArray(pg.hero.stats) || pg.hero.stats.length !== 3) err('page.hero.stats needs exactly 3 [number, label] pairs (the 4th, "New words", is automatic)');
  if (!pg.hero.h1) err('page.hero.h1 missing');
  if (!Array.isArray(pg.hero.ticker) || pg.hero.ticker.length < 4) err('page.hero.ticker needs at least 4 items');

  const G = pg.glossary, gk = Object.keys(G);
  if (gk.length < 10) err(`glossary has ${gk.length} words, expected at least 10`);
  gk.forEach(w => ['t', 'd', 'de', 'ex'].forEach(k => { if (!G[w][k]) err(`glossary "${w}".${k} missing`); }));
  const mc = (name, arr, n, extra) => {
    if (!Array.isArray(arr) || arr.length < n) return err(`page.${name} needs at least ${n} items`);
    arr.forEach((x, i) => {
      const t = `page.${name}[${i}]`;
      if ((!x.q && name !== 'slip') || !x.fb) err(`${t}: ${name === 'slip' ? 'fb' : 'q/fb'} missing`);
      if (!Array.isArray(x.o) || x.o.length !== 3) return err(`${t}: o needs exactly 3 options (first = correct)`);
      if (new Set(x.o).size !== 3) err(`${t}: duplicate options`);
      lenCheck(E, W, `${file}: ${t}`, x.o[0], x.o.slice(1));
      if (extra) extra(x, t);
    });
  };
  /* read */
  mc('read', pg.read, 4, (x, t) => { if (!x.txt) err(`${t}: txt missing`); if (!/Part \d of \d/.test(x.tag || '') || /stop/i.test(x.tag || '')) err(`${t}: tag must say "Part n of 4" (never "Stop")`); });
  (pg.read || []).forEach((x, i) => { if (!(x.tag || '').includes(`Part ${i + 1} of ${pg.read.length}`)) err(`page.read[${i}]: tag should say "Part ${i + 1} of ${pg.read.length}"`); });
  const used = new Set();
  (pg.read || []).forEach((x, i) => { for (const m of String(x.txt || '').matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) { used.add(m[1]); if (!G[m[1]]) err(`page.read[${i}]: [[${m[1]}]] is not in the glossary`); } });
  gk.filter(w => !used.has(w)).forEach(w => warn(`glossary word "${w}" is never highlighted in the story`));
  mc('vid', pg.vid, 6); mc('emo', pg.emo, 6, (x, t) => { if (!x.em) err(`${t}: em (emoji clue) missing`); }); mc('fin', pg.fin, 8);
  /* ice */
  const ice = pg.ice; need(ice, ['emoji', 'title', 'tip', 'options', 'cards', 'results'], 'page.ice');
  if (Array.isArray(ice.options) && ice.options.length !== 3) err('page.ice.options needs 3 [emoji, label] pairs');
  if (Array.isArray(ice.results) && ice.results.length !== 3) err('page.ice.results needs 3 [label with emoji at the end, text]');
  if (Array.isArray(ice.cards)) {
    if (ice.cards.length < 5) err('page.ice.cards needs at least 5 cards');
    ice.cards.forEach((c, i) => { if (![0, 1, 2].includes(c[2])) err(`page.ice.cards[${i}]: ruling must be 0, 1 or 2`); if (!c[3]) err(`page.ice.cards[${i}]: ruling text missing`); });
    if (new Set(ice.cards.map(c => c[2])).size === 1) warn('page.ice: every ruling is the same');
    const cnt = [0, 1, 2].map(k => ice.cards.filter(c => c[2] === k).length), top = Math.max(...cnt);
    if (top / ice.cards.length > 0.4) warn(`page.ice: one button is the answer for ${top} of ${ice.cards.length} cards (${cnt.join('/')} for buttons 1/2/3). The buttons stay in a fixed order, so players may spot the pattern — balance the rulings`);
  }
  /* word partners */
  if (!Array.isArray(pg.wp) || pg.wp.length !== 6) err('page.wp needs exactly 6 [verb, partner] pairs');
  else { if (new Set(pg.wp.map(p => p[0])).size !== 6 || new Set(pg.wp.map(p => p[1])).size !== 6) err('page.wp: verbs and partners must each be unique'); }
  /* slip */
  mc('slip', pg.slip, 5, (x, t) => { if (!x.w) err(`${t}: w missing`); else if (badTokenIndex(x.w, x.wrong) < 0) err(`${t}: "wrong" ("${x.wrong}") is not a word of the sentence`); });
  /* registry ↔ glossary */
  const gl = new Set(gk.map(w => w.toLowerCase()));
  (r.vocab || []).forEach(v => { if (!gl.has(String(v.word).toLowerCase())) err(`registry vocab "${v.word}" is not in page.glossary`); });
  const rv = new Set((r.vocab || []).map(v => String(v.word).toLowerCase()));
  gk.filter(w => !rv.has(w.toLowerCase())).forEach(w => warn(`glossary word "${w}" is not in registry.vocab (no SRS card for it)`));
  /* worksheet */
  if (!Array.isArray(ws.matching) || ws.matching.length !== 6) err('worksheet.matching needs exactly 6 [word, meaning] pairs');
  if (!Array.isArray(ws.gaps) || ws.gaps.length !== 8) err('worksheet.gaps needs exactly 8 {s, a} items');
  else ws.gaps.forEach((g, i) => { if ((String(g.s).match(/___/g) || []).length !== 1) err(`worksheet.gaps[${i}]: sentence needs exactly one ___`); if (!g.a) err(`worksheet.gaps[${i}]: a missing`); });
  if (Array.isArray(ws.gaps) && new Set(ws.gaps.map(g => g.a)).size !== ws.gaps.length) err('worksheet.gaps: two gaps share the same answer');
  if (!Array.isArray(ws.closest) || ws.closest.length !== 6) err('worksheet.closest needs exactly 6 {q, o} items');
  else ws.closest.forEach((c, i) => { if (!/\[\[.+?\]\]/.test(c.q || '')) err(`worksheet.closest[${i}]: q needs [[underlined words]]`); if (!Array.isArray(c.o) || c.o.length !== 3) err(`worksheet.closest[${i}]: o needs 3 options (first = correct)`); else lenCheck(E, W, `${file}: worksheet.closest[${i}]`, c.o[0], c.o.slice(1)); });
  /* freshness: the generated files must equal what the template would produce now */
  if (E.length === 0 && !PREVIEW) {
    try {
      const out = render(pack);
      for (const [rel, text] of [[`${pack.slug}/index.html`, out.index], [`${pack.slug}/print/index.html`, out.print]])
        if (exists(rel) && read(rel) !== text) err(`${rel} is out of date or was edited by hand — run: node _factory/efcd-factory.js build`);
    } catch (e) { err('render failed — ' + e.message); }
  }
}

function build() {
  const loaded = loadPacks().filter(l => l.pack && l.pack.page), E = [];
  loaded.forEach(l => E.push(...checkPack(l).E));
  const real = E.filter(e => !/lesson file missing|out of date or was edited by hand|never mentions the id/.test(e));
  if (real.length) { console.log('❌ Fix these before building:\n' + real.map(e => '  • ' + e).join('\n')); return 1; }
  const outDir = argVal('--out') ? path.resolve(ROOT, argVal('--out')) : ROOT;
  const base = argVal('--base');
  for (const { pack } of loaded) {
    const out = render(pack);
    for (const [rel, text0] of [[`${pack.slug}/index.html`, out.index], [`${pack.slug}/print/index.html`, out.print]]) {
      let text = base ? text0.replace('<head>', `<head>\n<base href="${base}">`) : text0;
      if (ARGS.includes('--noindex')) text = text.replace('<head>', '<head>\n<meta name="robots" content="noindex,nofollow">');
      const dest = path.join(outDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const same = fs.existsSync(dest) && fs.readFileSync(dest, 'utf8') === text;
      if (!same) fs.writeFileSync(dest, text);
      console.log(`  ${same ? '=' : '✎'} ${path.relative(ROOT, dest)}`);
    }
  }
  console.log(`✅ built ${loaded.length} lesson page(s) + worksheet(s)${outDir !== ROOT ? ' into ' + path.relative(ROOT, outDir) : ''}.`);
  return 0;
}


/* ═══ GRAMMAR COVERAGE: what has been taught recently, so lessons can vary ═══ */
const FAMILIES = [
  ['passive voice',            /passive/i],
  ['conditionals',             /conditional/i],
  ['reported speech',          /reported speech|backshift/i],
  ['present perfect',          /present perfect/i],
  ['past simple',              /past simple/i],
  ['present simple',           /present simple|simple present/i],
  ['present continuous',       /present continuous/i],
  ['future forms',             /future/i],
  ['modal verbs',              /modal|obligation|must\b|have to|might|could\b/i],
  ['comparatives/superlatives',/comparative|superlative/i],
  ['relative clauses',         /relative/i],
  ['countable/uncountable',    /countable|much\s*\/\s*many|fewer/i],
  ['prepositions',             /preposition|in \/ on \/ at|\bsince\b/i],
  ['contrast connectors',      /despite|although|even though|contrast/i],
  ['used to / wish / so-such', /used to|\bwish\b|so vs such|so\/such/i],
  ['inversion / formal',       /inversion|cleft|subjunctive/i],
  ['agreement / there is-are', /agreement|there is|there are/i],
];
const familiesOf = t => FAMILIES.filter(([, re]) => re.test(t)).map(([n]) => n);

/* group lessons by the level the learner sees, not by the registry's inconsistent "track" field */
function groupKey(id, l) {
  const lv = String(l.level || '').toLowerCase(), tr = String(l.track || '').toLowerCase().replace(/[^a-z]/g, '');
  if (/^weekly-?drop/.test(String(id))) return 'weekly drop';
  if (/tax/.test(lv) || tr === 'tax') return 'tax';
  if (/legal/.test(lv)) return 'legal';
  if (/business/.test(lv)) return 'business';
  if (/kids/.test(lv)) return 'kids';
  if (/beginner|\ba2\b|\ba1\b/.test(lv)) return 'beginner';
  if (/advanced/.test(lv)) return 'advanced';
  if (/intermediate/.test(lv)) return 'intermediate';
  return tr || lv.replace(/[^a-z]/g, '') || 'other';
}
const topicsOf = r => [r.grammar && r.grammar.topic, r.grammar2 && r.grammar2.topic].filter(Boolean);
function registryLessons() {
  if (!exists(FILES.registry)) return [];
  const ctx = { window: {}, module: { exports: {} }, console }; vm.createContext(ctx);
  vm.runInContext(read(FILES.registry), ctx);
  return Object.entries(ctx.module.exports).map(([key, l]) => ({ id: l.id || key, track: groupKey(l.id || key, l), topics: topicsOf(l) }));
}
function allLessonsForCoverage() {
  const hand = registryLessons(), ids = new Set(hand.map(l => l.id));
  const packs = loadPacks().filter(l => l.pack && l.pack.registry && !ids.has(l.pack.registry.id)).map(({ pack }) => ({
    id: pack.registry.id, track: groupKey(pack.registry.id, pack.registry), topics: topicsOf(pack.registry),
  }));
  return [...hand, ...packs];
}
function coverage() {
  const lessons = allLessonsForCoverage().filter(l => l.topics.length);
  const byTrack = {};
  lessons.forEach(l => (byTrack[l.track] = byTrack[l.track] || []).push(l));
  const WINDOW = 10, out = [];
  for (const [track, ls] of Object.entries(byTrack)) {
    const recent = ls.slice(-WINDOW), counts = {};
    recent.forEach(l => new Set(l.topics.flatMap(familiesOf)).forEach(f => counts[f] = (counts[f] || 0) + 1));
    const used = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const unused = FAMILIES.map(([n]) => n).filter(n => !counts[n]);
    out.push(`\n${track.toUpperCase()}  (last ${recent.length} lessons with a grammar section)\n  most used : ${used.slice(0, 5).map(([n, c]) => `${n} ×${c}`).join(', ') || '—'}\n  not used  : ${unused.join(', ') || '—'}\n  latest    : ${recent.slice(-3).map(l => l.id + ' [' + (l.topics.flatMap(familiesOf).join(', ') || 'other') + ']').join(' | ')}`);
  }
  console.log(out.length ? '📊 Grammar coverage by track' + out.join('\n') : 'No grammar data found.');
  return 0;
}
/* warn when a new pack repeats a grammar family used in each of the previous two lessons of its track */
function repeatWarning(pack) {
  try {
    const r = pack.registry, mine = new Set([r.grammar && r.grammar.topic, r.grammar2 && r.grammar2.topic].filter(Boolean).flatMap(familiesOf));
    const track = groupKey(r.id, r);
    const prev = allLessonsForCoverage().filter(l => l.track === track && l.id !== r.id && l.topics.length).slice(-2);
    if (prev.length < 2) return null;
    const rep = [...mine].filter(f => prev.every(l => l.topics.flatMap(familiesOf).includes(f)));
    return rep.length ? `grammar "${rep.join('", "')}" was also in each of the last two ${track} lessons (${prev.map(l => l.id).join(', ')}) — consider a different focus` : null;
  } catch (e) { return null; }
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
else if (cmd === 'build') process.exit(build());
else if (cmd === 'coverage') process.exit(coverage());
else { console.log('Usage: node _factory/efcd-factory.js build | check | merge [--dry] | audit | coverage'); process.exit(2); }
