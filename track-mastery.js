// ═══════════════════════════════════════════════════════════════
// EFCD TRACK MASTERY SYSTEM — track-mastery.js
// Detects which tracks a user has studied from lesson_link URLs.
// Renders a "Track Mastery" section for the dashboard.
// Zero DB changes needed — reads existing lessons table.
// ═══════════════════════════════════════════════════════════════

'use strict';

// ── TRACK DEFINITIONS ────────────────────────────────────────
// urlKey: the path segment in lesson_link (e.g. /business/)
const EFCD_TRACKS = [
    {
        id:     'business',
        urlKey: '/business/',
        levelNames: ['business'],
        icon:   '💼',
        name:   'Business English',
        color:  '#CE82FF',
        shadow: '#A559D9',
        desc:   'Meetings, emails & negotiations',
        titles: ['Business Curious', 'Business Novice', 'Business Apprentice', 'Business Practitioner', 'Business Pro', 'Business Expert', 'Business Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
    {
        id:     'tax',
        urlKey: '/tax/',
        levelNames: ['tax'],
        icon:   '💰',
        name:   'Tax English',
        color:  '#FFC800',
        shadow: '#E5B400',
        desc:   'Tax terminology & accounting',
        titles: ['Tax Curious', 'Tax Novice', 'Tax Apprentice', 'Tax Practitioner', 'Tax Specialist', 'Tax Expert', 'Tax Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
    {
        id:     'legal',
        urlKey: '/legal/',
        levelNames: ['legal'],
        icon:   '⚖️',
        name:   'Legal English',
        color:  '#2BDECC',
        shadow: '#1FBFAF',
        desc:   'Contracts, law & legal writing',
        titles: ['Legal Curious', 'Legal Novice', 'Legal Apprentice', 'Legal Practitioner', 'Legal Specialist', 'Legal Expert', 'Legal Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
    {
        id:     'advanced',
        urlKey: '/advanced/',
        levelNames: ['advanced', 'c1', 'c2'],
        icon:   '🎯',
        name:   'Advanced English',
        color:  '#FF4B4B',
        shadow: '#EA2B2B',
        desc:   'Idioms, fluency & C1–C2 mastery',
        titles: ['Advanced Curious', 'Advanced Novice', 'Advanced Apprentice', 'Advanced Practitioner', 'Advanced Speaker', 'Advanced Expert', 'Advanced Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
    {
        id:     'intermediate',
        urlKey: '/intermediate/',
        levelNames: ['intermediate', 'b1', 'b2'],
        icon:   '🚀',
        name:   'Intermediate English',
        color:  '#1CB0F6',
        shadow: '#1899D6',
        desc:   'Real-world grammar & vocabulary',
        titles: ['Intermediate Curious', 'Intermediate Novice', 'Intermediate Apprentice', 'Intermediate Practitioner', 'Intermediate Speaker', 'Intermediate Expert', 'Intermediate Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
    {
        id:     'beginner',
        urlKey: '/beginner/',
        levelNames: ['beginner', 'a1', 'a2'],
        icon:   '🌱',
        name:   'Beginner English',
        color:  '#58CC02',
        shadow: '#58A700',
        desc:   'Foundation vocabulary & grammar',
        titles: ['Beginner Curious', 'Beginner Novice', 'Beginner Apprentice', 'Beginner Practitioner', 'Beginner Speaker', 'Beginner Expert', 'Beginner Master'],
        thresholds: [0, 1, 3, 6, 10, 15, 20],
    },
];

// ── CORE: count lessons per track ────────────────────────────
// Matches on lesson_link URL first, then falls back to lesson_level string.
// This handles both URL-based slugs (/spacex-elon-musk/) and direct
// track URLs (/intermediate/), plus the lesson_level field ("Intermediate").
function countByTrack(lessons) {
    const counts = {};
    EFCD_TRACKS.forEach(t => counts[t.id] = 0);

    (lessons || []).forEach(lesson => {
        const link  = (lesson.lesson_link  || '').toLowerCase();
        const level = (lesson.lesson_level || '').toLowerCase();

        // 1. Try matching the lesson_link against track URL keys
        //    e.g. "/intermediate/vocabulary-lesson/" matches "/intermediate/"
        let track = EFCD_TRACKS.find(t => link.includes(t.urlKey));

        // 2. Fallback: match lesson_level string against levelNames
        //    e.g. "Intermediate" → lowercased → matches ["intermediate","b1","b2"]
        if (!track && level) {
            track = EFCD_TRACKS.find(t =>
                t.levelNames.some(n => level.includes(n))
            );
        }

        if (track) counts[track.id]++;
    });

    return counts;
}

// ── Get title index for a lesson count ──────────────────────
function getTitleIndex(track, count) {
    let idx = 0;
    for (let i = 0; i < track.thresholds.length; i++) {
        if (count >= track.thresholds[i]) idx = i;
    }
    return idx;
}

// ── Get next threshold ───────────────────────────────────────
function getNextThreshold(track, count) {
    for (let i = 0; i < track.thresholds.length; i++) {
        if (track.thresholds[i] > count) return track.thresholds[i];
    }
    return null; // maxed out
}

// ── Progress % within current title band ────────────────────
function getBandProgress(track, count) {
    const idx = getTitleIndex(track, count);
    const current = track.thresholds[idx];
    const next    = track.thresholds[idx + 1];
    if (!next) return 100; // maxed
    return Math.round(((count - current) / (next - current)) * 100);
}

// ── SITE ORDER for not-yet pills ─────────────────────────────
const SITE_ORDER = ['business', 'tax', 'legal', 'beginner', 'intermediate', 'advanced'];

// ── RENDER ───────────────────────────────────────────────────
function renderTrackMastery(lessons) {
    const counts = countByTrack(lessons);

    const started = EFCD_TRACKS
        .filter(t => counts[t.id] > 0)
        .sort((a, b) => counts[b.id] - counts[a.id]);

    const notYet = SITE_ORDER
        .map(id => EFCD_TRACKS.find(t => t.id === id))
        .filter(t => t && counts[t.id] === 0);

    const startedHTML = started.map(track => {
        const count     = counts[track.id];
        const idx       = getTitleIndex(track, count);
        const title     = track.titles[idx];
        const nextIdx   = idx + 1;
        const nextTitle = track.titles[nextIdx] || null;
        const pct       = getBandProgress(track, count);
        const nextAt    = getNextThreshold(track, count);
        const toNext    = nextAt ? nextAt - count : 0;
        const maxed     = !nextTitle;

        return `
        <div class="tm-track" data-track="${track.id}">
            <div class="tm-track-head">
                <div class="tm-icon" style="background:${track.color};box-shadow:0 3px 0 ${track.shadow};">
                    ${track.icon}
                </div>
                <div class="tm-info">
                    <div class="tm-name">${track.name}</div>
                    <div class="tm-title-badge" style="background:${track.color}22;color:${track.shadow};border-color:${track.color}44;">
                        ${title}
                    </div>
                </div>
                <div class="tm-count">
                    <span class="tm-count-n">${count}</span>
                    <span class="tm-count-l">lesson${count !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="tm-bar-wrap">
                <div class="tm-bar" style="width:${pct}%;background:${track.color};box-shadow:0 0 8px ${track.color}66;"></div>
            </div>
            <div class="tm-bar-meta">
                ${maxed
                    ? `<span style="color:${track.shadow};font-weight:900;">🏆 Maximum rank achieved!</span>`
                    : `<span style="color:#AFAFAF;">${toNext} more lesson${toNext !== 1 ? 's' : ''} to <strong style="color:${track.shadow};">${nextTitle}</strong></span>`
                }
                <span style="color:#AFAFAF;">${pct}%</span>
            </div>
        </div>`;
    }).join('');

    const notYetHTML = notYet.length ? `
        <div class="tm-notyet">
            ${notYet.map(track => `
                <a href="/${track.id}/" class="tm-notyet-pill" style="border-color:${track.color}44;">
                    <span>${track.icon}</span>
                    <span class="tm-notyet-name">${track.name}</span>
                    <span class="tm-notyet-cta" style="color:${track.shadow};">Start →</span>
                </a>`).join('')}
        </div>` : '';

    return `
        <div class="track-mastery" id="track-mastery">
            ${started.length === 0
                ? `<div class="tm-empty">
                        <div style="font-size:48px;margin-bottom:12px;">🗺️</div>
                        <div style="font-size:16px;font-weight:900;color:var(--ink-bold);margin-bottom:6px;">No tracks started yet</div>
                        <div style="font-size:13px;font-weight:700;color:var(--ink-3);">Complete a lesson to start building your expertise!</div>
                   </div>`
                : startedHTML
            }
            ${notYetHTML}
        </div>
        <style>${TRACK_CSS}</style>`;
}

// ── CSS ──────────────────────────────────────────────────────
const TRACK_CSS = `
.track-mastery {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.tm-track {
    background: var(--white);
    border: 2px solid var(--border-heavy);
    border-bottom: 5px solid var(--border-heavy);
    border-radius: var(--r);
    padding: 16px 18px;
    transition: transform .15s, box-shadow .15s;
}
.tm-track:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,.08);
}
.tm-track-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
}
.tm-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
    animation: tmPop .5s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes tmPop {
    from { transform: scale(0) rotate(-12deg); opacity: 0; }
    to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}
.tm-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.tm-name {
    font-size: 15px;
    font-weight: 900;
    color: var(--ink-bold);
    letter-spacing: -.2px;
}
.tm-title-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 99px;
    border: 2px solid;
    letter-spacing: .3px;
    width: fit-content;
}
.tm-count {
    text-align: center;
    flex-shrink: 0;
}
.tm-count-n {
    display: block;
    font-size: 28px;
    font-weight: 900;
    color: var(--ink-bold);
    line-height: 1;
}
.tm-count-l {
    font-size: 10px;
    font-weight: 900;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: .5px;
}
.tm-bar-wrap {
    height: 12px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 8px;
    border: 2px solid var(--border-heavy);
}
.tm-bar {
    height: 100%;
    border-radius: 99px;
    border-top: 3px solid rgba(255,255,255,.4);
    transition: width 1.2s cubic-bezier(.4,0,.2,1);
    min-width: 4px;
}
.tm-bar-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 800;
}
.tm-notyet {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 4px;
}
.tm-notyet-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    background: var(--white);
    border: 2px solid;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 800;
    color: var(--ink-bold);
    text-decoration: none;
    transition: transform .12s, box-shadow .12s;
    opacity: .6;
}
.tm-notyet-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,.1);
    opacity: 1;
}
.tm-notyet-name { color: var(--ink-bold); }
.tm-notyet-cta  { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .5px; }
.tm-empty {
    text-align: center;
    padding: 32px 20px;
    background: var(--bg);
    border: 2px dashed var(--border-heavy);
    border-radius: var(--r);
}
`;

// ── PUBLIC API ───────────────────────────────────────────────
window.EFCD_TrackMastery = {
    TRACKS:      EFCD_TRACKS,
    countByTrack,
    render:      renderTrackMastery,
};

console.log('🗺️ EFCD Track Mastery loaded —', EFCD_TRACKS.length, 'tracks');
