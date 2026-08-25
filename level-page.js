/* ════════════════════════════════════════════════════
   LEVEL PAGE ENGINE — shared by /beginner/, /intermediate/, /advanced/
   Renders lesson cards from a plain data array (LESSONS, set per page)
   and handles the auth-aware welcome strip.

   HOW TO USE ON A LEVEL PAGE:
   1. Include this file + level-page.css
   2. Before this script, define:
        window.LEVEL_CONFIG = {
          eyebrow: '🌱 Beginner English (A1/A2)',
          accent:  'green'   // 'green' | 'blue' | 'punch'
        };
        window.LESSONS = [ ...see lessons-data-beginner.js for shape... ];
   3. Call LevelPage.boot() on DOMContentLoaded (done automatically below)
════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const ACCENT_VARS = {
    green: { c: '#58CC02', shadow: '#58A700', light: 'rgba(88,204,2,.12)',  border: 'rgba(88,204,2,.28)',  text: '#3f8f01' },
    blue:  { c: '#1CB0F6', shadow: '#1899D6', light: 'rgba(28,176,246,.12)', border: 'rgba(28,176,246,.28)', text: '#0e7ab0' },
    punch: { c: '#FF4B4B', shadow: '#EA2B2B', light: 'rgba(255,75,75,.1)',   border: 'rgba(255,75,75,.25)',  text: '#C0392B' },
    gold:   { c: '#FFC800', shadow: '#E5B400', light: 'rgba(255,200,0,.13)', border: 'rgba(255,200,0,.4)',  text: '#92600A' },
    purple: { c: '#CE82FF', shadow: '#A559D9', light: 'rgba(206,130,255,.11)', border: 'rgba(206,130,255,.28)', text: '#7D3CB5' },
    teal:   { c: '#2BDECC', shadow: '#1FB8A8', light: 'rgba(43,222,204,.1)', border: 'rgba(43,222,204,.32)', text: '#0E8A80' },
    pink:   { c: '#FF6EB4', shadow: '#d94a8a', light: 'rgba(255,110,180,.12)', border: 'rgba(255,110,180,.3)', text: '#a0196a' },
  };

  /* ── Card rendering ──────────────────────────────────
     Lesson shape:
     {
       slug: 'travel-blogger-life-beginner' | null (null => coming-soon card),
       icon: '🧳✈️⛱️',
       badge: '⭐ Travel/Business',
       badgeType: 'new' | 'soon' | null,
       title: 'Meet The Travel Bloggers',
       desc: 'Can travel blogging really be a job?...',
       mins: 7,
       date: '2026-08-12',        // ISO — used for sorting AND display
       tags: ['culture','business'] // optional, powers future filter chips
     }
  ──────────────────────────────────────────────────── */

  // Matches DB lesson_link values against our data-file slugs even if they're
  // stored in a different text shape (leading/trailing slash, full URL,
  // trailing query string, different casing) — exact-string .has() lookups
  // fail silently on any of these, with no console error, which is why this
  // needs to be forgiving rather than assuming one exact format.
  function normalizeSlug(s) {
    if (!s) return '';
    return String(s)
      .trim()
      .replace(/^https?:\/\/[^/]+/i, '') // strip protocol+domain if a full URL
      .split('?')[0]                      // strip query string
      .replace(/^\/+|\/+$/g, '')          // strip leading/trailing slashes
      .toLowerCase();
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso; // fallback if already display-formatted
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function cardHTML(lesson, doneSet) {
    if (!lesson.slug && !lesson.href) {
      // Coming soon — no link, dimmed. Two styles supported:
      // - no lesson.badge given: generic "🔒 Coming Soon" badge, single "⏱️ Coming soon" meta (Legal-style)
      // - lesson.badge given: real category badge kept, mins shown plus a "📅 Coming soon" meta (Kids-style)
      const badge = lesson.badge
        ? `<div class="lcard-badge${lesson.badgeType ? ' ' + lesson.badgeType : ''}">${lesson.badge}</div>`
        : `<div class="lcard-badge soon">🔒 Coming Soon</div>`;
      const meta = lesson.mins
        ? `<span>⏱️ ${lesson.mins} mins</span><span>📅 Coming soon</span>`
        : `<span>⏱️ Coming soon</span>`;
      return `
        <div class="lcard coming-soon">
          <div class="lcard-body">
            <div class="lcard-icon">${lesson.icon}</div>
            ${badge}
            <div class="lcard-title">${lesson.title}</div>
            <div class="lcard-desc">${lesson.desc}</div>
            <div class="lcard-meta">${meta}</div>
          </div>
        </div>`;
    }

    const badgeClass = lesson.badgeType ? ` ${lesson.badgeType}` : '';
    const isDone = doneSet && doneSet.has(lesson.slug);
    const stamp = isDone
      ? `<div class="completed-stamp" aria-hidden="true"><span>😎</span>Nailed it!</div>`
      : '';
    const href = lesson.href || `/${lesson.slug}/`;

    return `
      <a href="${href}" class="lcard${isDone ? ' is-done' : ''}">
        ${stamp}
        <div class="lcard-body">
          <div class="lcard-icon">${lesson.icon}</div>
          <div class="lcard-badge${badgeClass}">${lesson.badge}</div>
          <div class="lcard-title">${lesson.title}</div>
          <div class="lcard-desc">${lesson.desc}</div>
          <div class="lcard-meta"><span>⏱️ ${lesson.mins} mins</span>${lesson.date ? `<span>📅 ${fmtDate(lesson.date)}</span>` : ''}</div>
          ${isDone ? `<span class="sr-only">Completed</span>` : ''}
          <div class="lcard-go">${isDone ? 'Review Again' : 'Start Lesson'} <span class="lcard-go-arrow">→</span></div>
        </div>
      </a>`;
  }

  function renderGrid(lessons, doneSet) {
    const grid = document.getElementById('lesson-grid');
    if (!grid) return;
    const sorted = lessons.slice().sort((a, b) => {
      const aSoon = !a.slug && !a.href, bSoon = !b.slug && !b.href;
      if (aSoon) return 1;   // coming-soon always last
      if (bSoon) return -1;
      return (b.date || '').localeCompare(a.date || ''); // newest first
    });
    grid.innerHTML = sorted.map(l => cardHTML(l, doneSet)).join('');
  }

  function applyAccent(name) {
    const v = ACCENT_VARS[name] || ACCENT_VARS.blue;
    const root = document.documentElement.style;
    root.setProperty('--accent', v.c);
    root.setProperty('--accent-shadow', v.shadow);
    root.setProperty('--accent-light', v.light);
    root.setProperty('--accent-border', v.border);
    root.setProperty('--accent-text', v.text);
  }

  /* ── Auth-aware welcome strip (was duplicated 3x, now lives once) ── */
  async function bootAuthStrip(eyebrowText) {
    const stripWrap = document.getElementById('strip-wrap');
    const secWrap = document.getElementById('section-label-wrap');

    const waitReady = () => new Promise(res => {
      const check = () => window.efcdReady ? res() : setTimeout(check, 50);
      check();
    });

    try {
      await waitReady();
      await window.efcdReady;
      await window.EFCD_Auth.initAuth();
      const user = window.EFCD_Auth.getCurrentUser();

      if (!user) {
        if (stripWrap) stripWrap.innerHTML = '';
        if (secWrap) secWrap.innerHTML = `
          <div class="guest-label">
            <div class="guest-eyebrow">${eyebrowText}</div>
            <a href="/signup/" class="guest-signup-pill">Create free account →</a>
            <a href="/login/" class="guest-login-pill">Log in →</a>
          </div>`;
        return null; // not logged in — no progress bar at all, distinct from "0 completed"
      }

      const stats = window.EFCD_Auth.getUserStats();
      const rawName = user.name || user.email?.split('@')[0] || 'Dude';
      const firstName = rawName.split(' ')[0].replace(/^\w/, c => c.toUpperCase());
      const streak = stats?.streak || 0;

      let completedSlugs = new Set();
      try {
        const { data: lessons } = await window.efcdSupabaseClient
          .from('lessons').select('lesson_link').eq('user_id', user.id);
        if (lessons) completedSlugs = new Set(lessons.map(l => l.lesson_link));
      } catch (_) {}

      const badgeCount = completedSlugs.size;
      const badgeLabel = badgeCount > 0 ? `<span class="ws-badges">🏅 ${badgeCount} badge${badgeCount !== 1 ? 's' : ''}</span>` : '';
      const streakLabel = streak > 0 ? `<span class="ws-streak">🔥 ${streak} day streak</span>` : '';

      if (stripWrap) stripWrap.innerHTML = `
        <div class="welcome-strip">
          <div class="ws-left">
            <span class="ws-name">👋 Welcome back, ${firstName}!</span>
            ${badgeLabel}
            ${streakLabel}
          </div>
          <a href="/my-lessons/" class="ws-link">📚 My Lessons →</a>
        </div>`;
      if (secWrap) secWrap.innerHTML = `<div class="sec-label">${eyebrowText}</div>`;

      if (window.EFCD_UI) window.EFCD_UI.updateHeaderUI();
      return completedSlugs;

    } catch (e) {
      if (stripWrap) stripWrap.innerHTML = '';
      return null;
    }
  }

  function renderProgressBar(total, doneCount) {
    const wrap = document.getElementById('progress-wrap');
    if (!wrap || total === 0) return;
    const pct = Math.round((doneCount / total) * 100);
    wrap.innerHTML = `
      <div class="level-progress">
        <div class="level-progress-track"><div class="level-progress-fill" style="width:${pct}%"></div></div>
        <div class="level-progress-label">${doneCount}/${total} lessons completed</div>
      </div>`;
  }

  async function boot() {
    const cfg = window.LEVEL_CONFIG || {};
    const lessons = window.LESSONS || [];
    applyAccent(cfg.accent);

    // Render immediately with no completion data so the page isn't blocked on auth
    renderGrid(lessons, new Set());

    const doneSet = await bootAuthStrip(cfg.eyebrow || '');

    try {
      // doneSet is null for guests (no bar at all) or a Set (possibly empty)
      // for logged-in users — that Set is SITE-WIDE (every track, every
      // level), so it must be intersected with this level's own lesson
      // slugs before it's used for a per-level "X/Y completed" count.
      if (doneSet) {
        const levelSlugs = new Set(lessons.filter(l => l.slug).map(l => l.slug));
        const normalizedCompleted = new Set([...doneSet].map(normalizeSlug));
        const doneInLevel = new Set(
          [...levelSlugs].filter(slug => normalizedCompleted.has(normalizeSlug(slug)))
        );

        if (doneInLevel.size) {
          renderGrid(lessons, doneInLevel);
        }
        renderProgressBar(levelSlugs.size, doneInLevel.size);
      }
    } catch (e) {
      // Fail loudly instead of silently — a bad lesson entry or auth hiccup
      // should never quietly blank the progress bar with no trace.
      console.error('[level-page] completion/progress render failed:', e);
    }
  }

  window.LevelPage = { boot, renderGrid, applyAccent };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
