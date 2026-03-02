// ═══════════════════════════════════════════════════════════════
// EFCD BADGE SYSTEM — badge-system.js
// 18 collectible badges. Auto-awards from existing user data.
// Drop-in for homepage hero (compact shelf) + dashboard (full grid)
// Shiny badges read from Supabase profiles.shiny_badges column.
// ═══════════════════════════════════════════════════════════════

'use strict';

const EFCD_BADGES = [
    // ── FIRST STEPS ─────────────────────────────────────────
    { id:'first_lesson',  icon:'🎯', name:'First Steps',         description:'Complete your very first lesson',                          color:'#58CC02', shadow:'#58A700', category:'milestones', secret:false, check:(p)=>p.totalLessons>=1 },
    { id:'five_lessons',  icon:'🌟', name:'Getting Warmed Up',   description:'Complete 5 lessons',                                       color:'#FFC800', shadow:'#E5B400', category:'milestones', secret:false, check:(p)=>p.totalLessons>=5 },
    { id:'ten_lessons',   icon:'🏆', name:'Dedicated Learner',   description:'Complete 10 lessons',                                      color:'#FFC800', shadow:'#E5B400', category:'milestones', secret:false, check:(p)=>p.totalLessons>=10 },
    { id:'twenty_lessons',icon:'💎', name:'Cool Dude For Real',  description:"Complete 20 lessons — you're the real deal",               color:'#2BDECC', shadow:'#1FBFAF', category:'milestones', secret:false, check:(p)=>p.totalLessons>=20 },
    // ── STREAKS ──────────────────────────────────────────────
    { id:'streak_3',  icon:'🔥',    name:'On Fire',      description:'3-day learning streak',                     color:'#FF9600', shadow:'#E08000', category:'streaks', secret:false, check:(p)=>p.streak>=3 },
    { id:'streak_7',  icon:'🔥🔥', name:'Week Warrior', description:'7 days in a row — impressive!',              color:'#FF6B00', shadow:'#E05500', category:'streaks', secret:false, check:(p)=>p.streak>=7 },
    { id:'streak_30', icon:'💥',    name:'Unstoppable',  description:'30-day streak — absolutely legendary',       color:'#FF4B4B', shadow:'#EA2B2B', category:'streaks', secret:true,  check:(p)=>p.streak>=30 },
    // ── VOCAB ────────────────────────────────────────────────
    { id:'vocab_25',  icon:'📚', name:'Word Collector',     description:'Save 25 vocabulary words',                              color:'#CE82FF', shadow:'#A559D9', category:'vocab', secret:false, check:(p,l)=>_totalVocab(l)>=25 },
    { id:'vocab_50',  icon:'🧠', name:'Vocab Hoarder',      description:'Save 50 vocabulary words',                              color:'#CE82FF', shadow:'#A559D9', category:'vocab', secret:false, check:(p,l)=>_totalVocab(l)>=50 },
    { id:'vocab_100', icon:'🎓', name:'Walking Dictionary', description:"100 words saved — you're a lexical legend",             color:'#A559D9', shadow:'#7B3FAA', category:'vocab', secret:true,  check:(p,l)=>_totalVocab(l)>=100 },
    // ── COURSE TRACKS ────────────────────────────────────────
    { id:'track_beginner',    icon:'🌱', name:'Beginner Explorer',       description:'Complete a Beginner lesson',             color:'#58CC02', shadow:'#58A700', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Beginner') },
    { id:'track_intermediate',icon:'🚀', name:'Intermediate Adventurer', description:'Complete an Intermediate lesson',        color:'#1CB0F6', shadow:'#1899D6', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Intermediate') },
    { id:'track_advanced',    icon:'🎯', name:'Advanced Achiever',       description:'Complete an Advanced lesson',            color:'#FF4B4B', shadow:'#EA2B2B', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Advanced') },
    { id:'track_business',    icon:'💼', name:'Business Boss',           description:'Complete a Business English lesson',     color:'#CE82FF', shadow:'#A559D9', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Business') },
    { id:'track_tax',         icon:'💰', name:'Tax Terminator',          description:'Complete a Tax English lesson',          color:'#FFC800', shadow:'#E5B400', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Tax') },
    { id:'track_legal',       icon:'⚖️', name:'Legal Eagle',             description:'Complete a Legal English lesson',        color:'#2BDECC', shadow:'#1FBFAF', category:'tracks', secret:false, check:(p,l)=>_hasTrack(l,'Legal') },
    // ── LEVELS ───────────────────────────────────────────────
    { id:'level_3', icon:'⚡', name:'Cool Dude',      description:'Reach Level 3 — officially a Cool Dude',   color:'#1CB0F6', shadow:'#1899D6', category:'levels', secret:false, check:(p)=>p.level>=3 },
    { id:'level_5', icon:'👑', name:'English Legend', description:'Reach Level 5 — the highest honour',        color:'#FFC800', shadow:'#E5B400', category:'levels', secret:true,  check:(p)=>p.level>=5 },
    // ── LESSON BADGES ────────────────────────────────────────
    {
        id:'pancake_day', icon:'🥞', name:'Pancake Flipper',
        description:'Complete the Pancake Day lesson — a true British tradition!',
        color:'#FFC800', shadow:'#E5B400', category:'special', secret:false,
        check:(p,l)=>l?.some(x=>x.lesson_link==='/pancakeday/'||(x.lesson_title||'').toLowerCase().includes('pancake'))
    },
    // ── SPECIAL ──────────────────────────────────────────────
    { id:'night_owl',    icon:'🦉', name:'Night Owl',    description:'Complete a lesson between 10pm and 6am', color:'#4B4B8F', shadow:'#2E2E6B', category:'special', secret:true,  check:(p)=>p.achievements?.includes('night_owl') },
    { id:'early_bird',   icon:'🐦', name:'Early Bird',   description:'Complete a lesson before 9am',           color:'#FF9600', shadow:'#E08000', category:'special', secret:true,  check:(p)=>p.achievements?.includes('early_bird') },
    { id:'perfectionist',icon:'💯', name:'Perfectionist',description:'Get 100% on any exercise',               color:'#58CC02', shadow:'#58A700', category:'special', secret:false, check:(p)=>p.achievements?.includes('perfect_score') },
];

// ── PRIVATE HELPERS ──────────────────────────────────────────
function _totalVocab(lessons) {
    if (!lessons?.length) return 0;
    return lessons.reduce((t,l)=>t+(Array.isArray(l.vocabulary)?l.vocabulary.length:0),0);
}
function _hasTrack(lessons, trackName) {
    if (!lessons?.length) return false;
    return lessons.some(l=>(l.lesson_level||'').toLowerCase().includes(trackName.toLowerCase()));
}

// ── CORE ─────────────────────────────────────────────────────
function evaluateBadges(profile, lessons=[]) {
    return EFCD_BADGES.map(badge=>({ ...badge, earned: badge.check(profile, lessons) }));
}

// ── HOMEPAGE SHELF ───────────────────────────────────────────
function renderBadgeShelf(profile, lessons=[]) {
    const all     = evaluateBadges(profile, lessons);
    const earned  = all.filter(b=>b.earned);
    const locked  = all.filter(b=>!b.earned&&!b.secret);
    const toChase = locked.slice(0, Math.max(0,6-earned.length));
    const display = [...earned,...toChase].slice(0,6);
    const total   = all.length;

    const badgeHTML = display.map(b=>`
        <div class="bs-badge ${b.earned?'bs-earned':'bs-locked'}"
             title="${b.earned?b.name+': '+b.description:'🔒 '+b.name+' — '+b.description}"
             data-badge="${b.id}">
            <div class="bs-icon" style="${b.earned
                ?`background:${b.color};box-shadow:0 3px 0 ${b.shadow},0 0 14px ${b.color}55;`
                :'background:#E5E5E5;box-shadow:0 3px 0 #CECECE;'}">
                <span>${b.earned?b.icon:'🔒'}</span>
            </div>
            <div class="bs-label">${b.earned?b.name:'???'}</div>
        </div>`).join('');

    return `
        <div class="badge-shelf" id="badge-shelf">
            <div class="bs-header">
                <span class="bs-title">🏅 Your Badges</span>
                <a href="/dashboard-gamified/#badges" class="bs-see-all">${earned.length}/${total} earned →</a>
            </div>
            <div class="bs-row">${badgeHTML}</div>
        </div>
        <style>${SHELF_CSS}</style>`;
}

// ── DASHBOARD GRID ───────────────────────────────────────────
// shinyBadges: Set of badge ids that have been upgraded (from Supabase)
function renderBadgeGrid(profile, lessons=[], shinyBadges=new Set()) {
    const all    = evaluateBadges(profile, lessons);
    const earned = all.filter(b=>b.earned).length;

    // ── SHINIES SHOWCASE ──────────────────────────────────────
    const shinyList = all.filter(b=>b.earned && shinyBadges.has(b.id));
    const shinySectionHTML = shinyList.length ? `
        <div class="bdg-section bdg-shiny-section">
            <div class="bdg-cat-head">
                <span class="bdg-cat-title">✨ Shiny Collection</span>
                <span class="bdg-cat-sub">Your holographic upgrades</span>
            </div>
            <div class="bdg-grid">
                ${shinyList.map(b=>`
                <div class="bdg-item bdg-earned bdg-shiny-item">
                    <div class="bdg-icon bdg-shiny-icon">
                        ${b.icon}
                    </div>
                    <div class="bdg-name">${b.name}</div>
                    <div class="bdg-desc">${b.description}</div>
                    <div class="bdg-shiny-tick">✨ Holographic</div>
                </div>`).join('')}
            </div>
        </div>` : '';

    const categories = [
        { key:'milestones', label:'🎯 Milestones',   desc:'Lesson completion achievements' },
        { key:'streaks',    label:'🔥 Streaks',       desc:'Consistency rewards'            },
        { key:'vocab',      label:'📚 Vocabulary',    desc:'Word collection achievements'   },
        { key:'tracks',     label:'📖 Course Tracks', desc:'Complete different courses'     },
        { key:'levels',     label:'⚡ Levels',         desc:'XP level milestones'            },
        { key:'special',    label:'✨ Special',        desc:'Surprise achievements'          },
    ];

    const sectionsHTML = categories.map(cat=>{
        const badges = all.filter(b=>b.category===cat.key);
        if (!badges.length) return '';
        const badgesHTML = badges.map(b=>{
            const isSecret  = b.secret && !b.earned;
            const isShiny   = shinyBadges.has(b.id) && b.earned;
            return `
                <div class="bdg-item ${b.earned?'bdg-earned':'bdg-locked'}${isShiny?' bdg-shiny-item':''}">
                    <div class="bdg-icon${isShiny?' bdg-shiny-icon':''}" style="${b.earned&&!isShiny
                        ?`background:${b.color};box-shadow:0 4px 0 ${b.shadow},0 0 20px ${b.color}44;`
                        :b.earned?''
                        :'background:#F0F0F0;box-shadow:0 4px 0 #CECECE;'}">
                        ${b.earned?b.icon:(isSecret?'🔒':b.icon)}
                    </div>
                    <div class="bdg-name">${isSecret&&!b.earned?'???':b.name}</div>
                    <div class="bdg-desc">${isSecret&&!b.earned?'Secret badge — keep learning!':b.description}</div>
                    ${b.earned
                        ? isShiny
                            ? '<div class="bdg-shiny-tick">✨ Holographic</div>'
                            : '<div class="bdg-tick">✓ Earned</div>'
                        : '<div class="bdg-todo">Not yet</div>'}
                </div>`;
        }).join('');
        return `
            <div class="bdg-section">
                <div class="bdg-cat-head">
                    <span class="bdg-cat-title">${cat.label}</span>
                    <span class="bdg-cat-sub">${cat.desc}</span>
                </div>
                <div class="bdg-grid">${badgesHTML}</div>
            </div>`;
    }).join('');

    return `
        <div id="badges">
            <div class="bdg-summary">
                <div class="bdg-sum-num">${earned}</div>
                <div class="bdg-sum-of">/ ${all.length} badges earned</div>
                <div class="bdg-sum-bar-wrap">
                    <div class="bdg-sum-bar" style="width:${Math.round(earned/all.length*100)}%"></div>
                </div>
                <div class="bdg-sum-label">${_badgeSummaryMessage(earned,all.length)}</div>
            </div>
            ${shinySectionHTML}
            ${sectionsHTML}
        </div>
        <style>${GRID_CSS}</style>`;
}

function _badgeSummaryMessage(earned, total) {
    const pct = earned/total;
    if (pct===0)   return 'Start learning to earn your first badge!';
    if (pct<0.25)  return 'Nice start — keep going! 🌱';
    if (pct<0.5)   return 'Good progress — halfway there! 🚀';
    if (pct<0.75)  return 'Seriously impressive collection! 🔥';
    if (pct<1)     return 'Almost complete — legend status incoming! 👑';
    return 'FULL COLLECTION! You are a true Cool Dude Legend! 🎭';
}

// ── CSS: SHELF ───────────────────────────────────────────────
const SHELF_CSS = `
.badge-shelf { background:var(--white); border:2px solid var(--border-heavy); border-bottom:6px solid var(--border-heavy); border-radius:var(--r); padding:16px 18px 18px; position:relative; }
.bs-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.bs-title { font-size:15px; font-weight:900; color:var(--ink-bold); letter-spacing:-.2px; }
.bs-see-all { font-size:12px; font-weight:900; color:var(--blue); text-decoration:none; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid rgba(28,176,246,.3); }
.bs-row { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
@media(max-width:500px){ .bs-row{grid-template-columns:repeat(3,1fr);} }
.bs-badge { display:flex; flex-direction:column; align-items:center; gap:5px; cursor:default; }
.bs-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; transition:transform .15s; position:relative; }
.bs-badge:hover .bs-icon { transform:translateY(-3px) scale(1.08); }
.bs-locked .bs-icon { opacity:.45; filter:grayscale(1); }
.bs-label { font-size:9px; font-weight:900; color:var(--ink-3); text-align:center; text-transform:uppercase; letter-spacing:.4px; line-height:1.2; max-width:54px; }
.bs-earned .bs-label { color:var(--ink-bold); }
@keyframes badgePop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(4deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
.bs-earned .bs-icon { animation:badgePop .45s cubic-bezier(.175,.885,.32,1.275) both; }
`;

// ── CSS: GRID ────────────────────────────────────────────────
const GRID_CSS = `
#badges { display:flex; flex-direction:column; gap:24px; }

.bdg-summary { background:var(--ink-bold); border:2px solid #000; border-bottom:6px solid #000; border-radius:20px; padding:28px 24px; text-align:center; position:relative; overflow:hidden; }
.bdg-summary::after { content:'🏅'; position:absolute; font-size:120px; opacity:.08; right:-10px; bottom:-20px; pointer-events:none; }
.bdg-sum-num { font-size:64px; font-weight:900; color:var(--yellow); line-height:1; text-shadow:0 4px 0 var(--yellow-shadow); }
.bdg-sum-of { font-size:15px; font-weight:800; color:rgba(255,255,255,.6); margin-bottom:16px; }
.bdg-sum-bar-wrap { height:10px; background:rgba(255,255,255,.15); border-radius:99px; overflow:hidden; margin-bottom:10px; border:2px solid rgba(255,255,255,.1); }
.bdg-sum-bar { height:100%; background:var(--yellow); border-radius:99px; border-top:3px solid rgba(255,255,255,.4); transition:width 1.2s cubic-bezier(.4,0,.2,1); }
.bdg-sum-label { font-size:13px; font-weight:800; color:rgba(255,255,255,.7); }

/* ── SHINY SECTION ── */
.bdg-shiny-section { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border:2px solid rgba(206,130,255,.4); border-bottom:6px solid rgba(100,50,150,.8); border-radius:var(--r); padding:20px; }
.bdg-shiny-section .bdg-cat-head { border-bottom-color: rgba(206,130,255,.2); }
.bdg-shiny-section .bdg-cat-title { color:#fff; font-size:18px; }
.bdg-shiny-section .bdg-cat-sub { color:rgba(206,130,255,.7); }

.bdg-shiny-item { background:linear-gradient(135deg,#1a1a2e,#0f3460) !important; border-color:rgba(206,130,255,.3) !important; border-bottom-color:rgba(100,50,150,.6) !important; }
.bdg-shiny-item:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(206,130,255,.3) !important; }
.bdg-shiny-item .bdg-name { color:#fff !important; }
.bdg-shiny-item .bdg-desc { color:rgba(255,255,255,.5) !important; }

.bdg-shiny-icon {
    background: linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #FFD700) !important;
    background-size: 300% 300% !important;
    animation: holoShift 3s ease infinite, badgePop .5s cubic-bezier(.175,.885,.32,1.275) both !important;
    box-shadow: 0 4px 0 rgba(100,50,150,.6), 0 0 24px rgba(255,215,0,.5) !important;
}
@keyframes holoShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.bdg-shiny-tick {
    font-size:10px; font-weight:900;
    background: linear-gradient(135deg, #FFD700, #CE82FF);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-top:2px;
}

.bdg-section { display:flex; flex-direction:column; gap:12px; }
.bdg-cat-head { display:flex; align-items:baseline; gap:10px; padding-bottom:10px; border-bottom:2px solid var(--border); }
.bdg-cat-title { font-size:16px; font-weight:900; color:var(--ink-bold); }
.bdg-cat-sub { font-size:12px; font-weight:700; color:var(--ink-3); }
.bdg-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:10px; }
@media(max-width:480px){ .bdg-grid{grid-template-columns:repeat(2,1fr);} }
.bdg-item { background:var(--white); border:2px solid var(--border-heavy); border-bottom:5px solid var(--border-heavy); border-radius:16px; padding:16px 12px 14px; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; transition:transform .15s,box-shadow .15s; }
.bdg-earned { border-color:transparent; background:linear-gradient(white,white) padding-box,linear-gradient(135deg,var(--yellow),var(--green)) border-box; box-shadow:0 4px 16px rgba(0,0,0,.08); }
.bdg-earned:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.12); }
.bdg-locked { opacity:.55; filter:grayscale(.6); }
.bdg-icon { width:56px; height:56px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:26px; margin-bottom:2px; }
.bdg-earned .bdg-icon { animation:badgePop .5s cubic-bezier(.175,.885,.32,1.275) both; }
.bdg-name { font-size:12px; font-weight:900; color:var(--ink-bold); line-height:1.2; }
.bdg-desc { font-size:10px; font-weight:700; color:var(--ink-3); line-height:1.4; }
.bdg-tick { font-size:10px; font-weight:900; color:var(--green-shadow); background:rgba(88,204,2,.1); padding:3px 8px; border-radius:6px; margin-top:2px; }
.bdg-todo { font-size:10px; font-weight:900; color:var(--ink-3); margin-top:2px; }
@keyframes badgePop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(4deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
`;

// ── PUBLIC API ───────────────────────────────────────────────
window.EFCD_Badges = {
    BADGES:       EFCD_BADGES,
    evaluate:     evaluateBadges,
    renderShelf:  renderBadgeShelf,
    renderGrid:   renderBadgeGrid,   // now accepts optional 3rd arg: shinyBadges Set
};

console.log('🏅 EFCD Badge System loaded —', EFCD_BADGES.length, 'badges');
