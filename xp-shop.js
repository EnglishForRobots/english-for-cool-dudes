// ═══════════════════════════════════════════════════════════════
// EFCD XP SHOP — xp-shop.js  v3.0
// NEW IN v3:
//   • Daily Deal — 1 item, 40% off, rotates every 24h
//   • Streak Freeze — protect your streak for 1 missed day (100 XP)
//   • Double XP Token — 2x XP for 24 hours (150 XP)
//   • Mystery Box — 50 XP, random reward, always exciting
//   • Nameplate — coloured leaderboard entry background
//   • Expiry warnings — header badge pulses when something expires soon
//   • Purchase reveal — full-screen transformation animation on theme buy
//   • Titles everywhere — lesson completion, HUD strip, daily challenge
//   • Lesson requests — upvote system, public request board
//   • Streak freeze auto-triggers on login if streak would break
// ═══════════════════════════════════════════════════════════════
'use strict';

const SK = {
    shiny:        'efcd_shiny_badges',
    theme:        'efcd_active_theme',
    emoji:        'efcd_emoji_pack',
    title:        'efcd_custom_title',
    owned:        'efcd_owned_titles',
    freeze:       'efcd_streak_freeze',
    doubleXP:     'efcd_double_xp',
    nameplate:    'efcd_nameplate',
    ownedNP:      'efcd_owned_nameplates',
    dealSeen:     'efcd_daily_deal_seen',
    mysteryOwned: 'efcd_mystery_owned',
};

// ── THEMES ────────────────────────────────────────────────────
const THEMES = [
    { id:'sunset_vibes',  name:'Sunset Vibes',  icon:'🌅', cost:100, duration:7, preview:'#FF6B35',
      desc:'Warm oranges and coral. Holiday energy.', css:`
        .header{background:#FFF5F0!important;border-bottom-color:#FFCBA4!important}
        .logo{background:#FF6B35!important;box-shadow:0 3px 0 #D94F1A!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#FF6B35,#FF8C42)!important;border-color:#D94F1A!important;border-bottom-color:#D94F1A!important}
        .dh-xp-fill,.xp-fill{background:#FFF!important}
        .hero-cta{background:#FF6B35!important;border-color:#D94F1A!important}
        .dc-card{background:linear-gradient(135deg,#FF6B35,#FF8C42)!important;border-color:#D94F1A!important}
        .stat-card::before,.cc[data-c=blue]::before{background:#FF6B35!important}
        .picks-go-btn{background:#FF6B35!important;border-color:#D94F1A!important}`},
    { id:'forest_mode',   name:'Forest Mode',   icon:'🌿', cost:100, duration:7, preview:'#2D6A4F',
      desc:'Deep greens. Calm, focused, powerful.', css:`
        .header{background:#F0FAF4!important;border-bottom-color:#B7DFC8!important}
        .logo{background:#52B788!important;box-shadow:0 3px 0 #2D6A4F!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#2D6A4F,#40916C)!important;border-color:#1B4332!important;border-bottom-color:#1B4332!important}
        .dh-xp-fill,.xp-fill{background:#B7E4C7!important}
        .hero-cta{background:#40916C!important;border-color:#2D6A4F!important}
        .dc-card{background:linear-gradient(135deg,#2D6A4F,#40916C)!important;border-color:#1B4332!important}
        .stat-card::before,.cc[data-c=blue]::before{background:#40916C!important}
        .picks-go-btn{background:#40916C!important;border-color:#2D6A4F!important}`},
    { id:'ocean_breeze',  name:'Ocean Breeze',  icon:'🌊', cost:100, duration:7, preview:'#0077B6',
      desc:'Deep ocean blues. Sharp, clean, powerful.', css:`
        .header{background:#EFF8FF!important;border-bottom-color:#BAE0FF!important}
        .logo{background:#0096C7!important;box-shadow:0 3px 0 #0077B6!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#0077B6,#0096C7)!important;border-color:#005F8F!important;border-bottom-color:#005F8F!important}
        .dh-xp-fill,.xp-fill{background:#ADE8F4!important}
        .hero-cta{background:#0096C7!important;border-color:#0077B6!important}
        .dc-card{background:linear-gradient(135deg,#0077B6,#0096C7)!important;border-color:#005F8F!important}
        .stat-card::before,.cc[data-c=blue]::before{background:#0096C7!important}
        .picks-go-btn{background:#0096C7!important;border-color:#0077B6!important}`},
    { id:'candy_pop',     name:'Candy Pop',     icon:'🍬', cost:100, duration:7, preview:'#E040FB',
      desc:'Hot pink energy. Loud and proud.', css:`
        .header{background:#FFF0FE!important;border-bottom-color:#F5B8FF!important}
        .logo{background:#E040FB!important;box-shadow:0 3px 0 #AA00FF!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#E040FB,#CE82FF)!important;border-color:#AA00FF!important;border-bottom-color:#AA00FF!important}
        .dh-xp-fill,.xp-fill{background:#FFF!important}
        .hero-cta{background:#E040FB!important;border-color:#AA00FF!important}
        .dc-card{background:linear-gradient(135deg,#E040FB,#CE82FF)!important;border-color:#AA00FF!important}
        .stat-card::before,.cc[data-c=blue]::before{background:#E040FB!important}
        .picks-go-btn{background:#E040FB!important;border-color:#AA00FF!important}`},
    { id:'gold_vip',      name:'Gold VIP',      icon:'👑', cost:150, duration:7, preview:'#F59E0B',
      desc:'Everything glitters. Reserved for legends.', css:`
        .header{background:#FFFBEB!important;border-bottom-color:#FDE68A!important}
        .logo{background:#F59E0B!important;box-shadow:0 3px 0 #D97706!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#D97706,#F59E0B)!important;border-color:#B45309!important;border-bottom-color:#B45309!important}
        .dh-xp-fill,.xp-fill{background:#FFF!important}
        .hero-cta{background:#F59E0B!important;border-color:#D97706!important}
        .dc-card{background:linear-gradient(135deg,#D97706,#F59E0B)!important;border-color:#B45309!important}
        .stat-card.c-yellow::before,.stat-card.c-blue::before{background:#F59E0B!important}
        .picks-go-btn{background:#F59E0B!important;border-color:#D97706!important;color:#111!important}`},
    { id:'midnight_black', name:'Midnight Black', icon:'🖤', cost:125, duration:7, preview:'#111111',
      desc:'Ultra dark. Stealth mode. Pure focus.', css:`
        .header{background:#0a0a0a!important;border-bottom-color:#222!important}
        .logo{background:#333!important;box-shadow:0 3px 0 #000!important}
        .hero,.dash-hero{background:linear-gradient(135deg,#111,#222)!important;border-color:#000!important;border-bottom-color:#000!important}
        .dh-xp-fill,.xp-fill{background:#555!important}
        .hero-cta{background:#333!important;border-color:#111!important}
        .dc-card{background:linear-gradient(135deg,#111,#222)!important;border-color:#000!important}
        .stat-card::before{background:#333!important}
        .picks-go-btn{background:#333!important;border-color:#111!important}`},
];

// ── EMOJI PACKS ───────────────────────────────────────────────
const EMOJI_PACKS = [
    { id:'cats',     name:'Cat Mode',      icon:'🐱', cost:75, duration:7,
      desc:'Every emoji becomes a cat. Meow.',
      map:{'😎':'😼','🔥':'🐱‍🔥','⚡':'✨','🏆':'🏅','📚':'📖','🎯':'🐾','🚀':'🐈','💎':'🐱','🌟':'⭐','💪':'🐾','🎉':'🎊','✅':'🐾','❌':'🙀','🎓':'🐱'} },
    { id:'space',    name:'Space Mode',    icon:'🚀', cost:75, duration:7,
      desc:'One giant leap for vocabulary kind.',
      map:{'😎':'👨‍🚀','🔥':'☄️','⚡':'🌟','🏆':'🛸','📚':'🔭','🎯':'🪐','🚀':'🛸','💎':'🌙','🌟':'✨','💪':'👨‍🚀','🎉':'🎆','✅':'🌍','❌':'💥','🎓':'🛰️'} },
    { id:'food',     name:'Food Mode',     icon:'🍕', cost:75, duration:7,
      desc:'Learning is delicious. Nom nom.',
      map:{'😎':'🍕','🔥':'🌶️','⚡':'☕','🏆':'🍰','📚':'🍱','🎯':'🎂','🚀':'🍔','💎':'🍣','🌟':'🌮','💪':'🥑','🎉':'🎂','✅':'🥗','❌':'🍋','🎓':'🧁'} },
    { id:'medieval', name:'Medieval Mode', icon:'⚔️', cost:75, duration:7,
      desc:'Hark! Thy learning journey begins, noble scholar.',
      map:{'😎':'🧙','🔥':'🐉','⚡':'⚔️','🏆':'🏰','📚':'📜','🎯':'🏹','🚀':'🗡️','💎':'👑','🌟':'⭐','💪':'🛡️','🎉':'🎺','✅':'🛡️','❌':'💀','🎓':'📯'} },
];

// ── TITLES ────────────────────────────────────────────────────
const TITLES = [
    {id:'grammar_wizard',    name:'Grammar Wizard',    icon:'🧙', cost:200, desc:'For those who never miss a tense'},
    {id:'vocab_legend',      name:'Vocab Legend',      icon:'📚', cost:200, desc:'500+ words? This is you'},
    {id:'speed_demon',       name:'Speed Demon',       icon:'⚡', cost:150, desc:'Finish lessons faster than anyone'},
    {id:'night_scholar',     name:'Night Scholar',     icon:'🌙', cost:150, desc:'Learning after dark, every night'},
    {id:'pancake_flipper',   name:'Pancake Flipper',   icon:'🥞', cost:100, desc:'You flipped the pancake. Legendary.'},
    {id:'streak_machine',    name:'Streak Machine',    icon:'🔥', cost:250, desc:'30+ days. Unstoppable.'},
    {id:'tax_terminator',    name:'Tax Terminator',    icon:'💰', cost:150, desc:'Tax English mastered'},
    {id:'legal_eagle',       name:'Legal Eagle',       icon:'⚖️', cost:150, desc:'Contracts? No problem.'},
    {id:'cool_dude_supreme', name:'Cool Dude Supreme', icon:'😎', cost:400, desc:'The highest honour. Need we say more.'},
    {id:'english_legend',    name:'English Legend',    icon:'👑', cost:500, desc:'Reserved for the truly elite'},
];

// ── NAMEPLATES ────────────────────────────────────────────────
const NAMEPLATES = [
    { id:'fire',        name:'Fire',         icon:'🔥', cost:120, preview:'linear-gradient(135deg,#FF4500,#FF8C00)', desc:'Blazing hot leaderboard entry' },
    { id:'ice',         name:'Ice',          icon:'🧊', cost:120, preview:'linear-gradient(135deg,#00B4D8,#90E0EF)', desc:'Cool as ice on the leaderboard' },
    { id:'galaxy',      name:'Galaxy',       icon:'🌌', cost:150, preview:'linear-gradient(135deg,#1a0a3e,#6B21A8)', desc:'Deep space vibes. Mysterious.' },
    { id:'holographic', name:'Holographic',  icon:'💎', cost:200, preview:'linear-gradient(135deg,#FF6B6B,#4ECDC4,#45B7D1,#FFC800)', desc:'Shimmering rainbow effect. Rare.' },
    { id:'toxic',       name:'Toxic Green',  icon:'☢️', cost:120, preview:'linear-gradient(135deg,#16A34A,#84CC16)', desc:'Radioactive energy. Stand out.' },
    { id:'royal',       name:'Royal Gold',   icon:'👑', cost:175, preview:'linear-gradient(135deg,#B45309,#F59E0B)', desc:'Gold-plated glory. For legends only.' },
];

// ── MYSTERY BOX POOL ─────────────────────────────────────────
const MYSTERY_POOL = [
    { type:'xp',      icon:'⚡', name:'XP Bonus',       desc:'You got 75 bonus XP!',                    value:75  },
    { type:'xp',      icon:'⚡', name:'XP Bonus',       desc:'You got 150 bonus XP!',                   value:150 },
    { type:'xp',      icon:'💰', name:'XP Jackpot',     desc:'JACKPOT! 300 bonus XP!',                  value:300 },
    { type:'double',  icon:'🔥', name:'Double XP',      desc:'2x XP for the next 12 hours!',            value:12  },
    { type:'freeze',  icon:'🛡️', name:'Streak Freeze',  desc:'Your streak is protected for 1 day!',     value:1   },
    { type:'discount',icon:'🏷️', name:'10% Discount',   desc:'10% off your next shop purchase!',        value:10  },
    { type:'emoji',   icon:'🎲', name:'Random Emoji Pack',desc:'Cat Mode activated for 3 days!',        value:'cats', duration:3 },
];

// ── DAILY DEAL ENGINE ─────────────────────────────────────────
function getDailyDeal() {
    const allItems = [
        ...THEMES.map(t  => ({ ...t, type:'theme'     })),
        ...EMOJI_PACKS.map(p => ({ ...p, type:'emoji' })),
        ...NAMEPLATES.map(n => ({ ...n, type:'nameplate' })),
    ];
    const dayIndex = Math.floor(Date.now() / 864e5); // changes every 24h
    const item     = allItems[dayIndex % allItems.length];
    const discount = 0.4; // 40% off
    const sale     = Math.round(item.cost * (1 - discount));
    const expires  = (Math.floor(Date.now() / 864e5) + 1) * 864e5; // end of today UTC
    return { ...item, salePrice: sale, originalCost: item.cost, expires };
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function getXP() { return window.EFCD_Auth?.getUserStats?.()?.xp || 0; }

async function spendXP(amount) {
    const auth = window.EFCD_Auth;
    if (!auth?.getCurrentUser) return false;
    const user = auth.getCurrentUser();
    if (!user) return false;
    const current = getXP();
    if (current < amount) return false;
    try {
        const { error } = await window.efcdSupabaseClient
            .from('profiles').update({ xp: current - amount }).eq('id', user.id);
        if (error) throw error;
        if (auth.refreshUserData) await auth.refreshUserData();
        return true;
    } catch(e) { console.error('XP spend error:', e); return false; }
}

async function addXP(amount) {
    const auth = window.EFCD_Auth;
    if (!auth?.getCurrentUser) return;
    const user = auth.getCurrentUser();
    if (!user) return;
    const current = getXP();
    try {
        await window.efcdSupabaseClient
            .from('profiles').update({ xp: current + amount }).eq('id', user.id);
        if (auth.refreshUserData) await auth.refreshUserData();
    } catch(e) { console.error('addXP error:', e); }
}

function getShinyBadges() {
    try { const arr = JSON.parse(localStorage.getItem(SK.shiny) || '[]'); return new Set(Array.isArray(arr) ? arr : []); }
    catch { return new Set(); }
}

async function saveShinyBadges(set) {
    const arr = [...set];
    localStorage.setItem(SK.shiny, JSON.stringify(arr));
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (user && window.efcdSupabaseClient) {
        try {
            const { data } = await window.efcdSupabaseClient
                .from('profiles').select('shiny_badges').eq('id', user.id).single();
            const existing = new Set(Array.isArray(data?.shiny_badges) ? data.shiny_badges : []);
            arr.forEach(id => existing.add(id));
            const merged = [...existing];
            await window.efcdSupabaseClient.from('profiles').update({ shiny_badges: merged }).eq('id', user.id);
            localStorage.setItem(SK.shiny, JSON.stringify(merged));
        } catch(e) { console.warn('shiny_badges sync error:', e); }
    }
}

function getActiveTheme()    { try { const d = JSON.parse(localStorage.getItem(SK.theme));    if (d && d.expires > Date.now()) return d; } catch {} localStorage.removeItem(SK.theme);    return null; }
function getActiveEmojiPack(){ try { const d = JSON.parse(localStorage.getItem(SK.emoji));    if (d && d.expires > Date.now()) return d; } catch {} localStorage.removeItem(SK.emoji);    return null; }
function getStreakFreeze()    { try { const d = JSON.parse(localStorage.getItem(SK.freeze));   if (d && d.expires > Date.now()) return d; } catch {} localStorage.removeItem(SK.freeze);   return null; }
function getDoubleXP()       { try { const d = JSON.parse(localStorage.getItem(SK.doubleXP)); if (d && d.expires > Date.now()) return d; } catch {} localStorage.removeItem(SK.doubleXP); return null; }
function getActiveNameplate(){ try { const d = JSON.parse(localStorage.getItem(SK.nameplate));if (d) return d; } catch {} return null; }
function getCustomTitle()    { return localStorage.getItem(SK.title) || null; }
function getCustomTitleObj() { const id = getCustomTitle(); if (!id) return null; return TITLES.find(t => t.id === id) || null; }
function getDiscount()       { try { const d = JSON.parse(localStorage.getItem('efcd_discount')); if (d && d.expires > Date.now()) return d.pct; } catch {} return 0; }

function applyDiscount(cost) {
    const pct = getDiscount();
    return pct > 0 ? Math.round(cost * (1 - pct / 100)) : cost;
}

// ── Double XP multiplier — call from lesson completion ────────
function getXPMultiplier() {
    return getDoubleXP() ? 2 : 1;
}

// ── Streak freeze auto-check on login ────────────────────────
function checkStreakFreeze() {
    const freeze = getStreakFreeze();
    if (!freeze) return;
    const stats = window.EFCD_Auth?.getUserStats?.();
    if (!stats) return;
    const lastDate = localStorage.getItem('dc_last_lesson_date');
    if (!lastDate) return;
    const daysSince = Math.floor((Date.now() - new Date(lastDate).getTime()) / 864e5);
    if (daysSince === 1) {
        // Missed exactly 1 day — freeze protects it
        console.log('🛡️ Streak freeze used! Streak protected.');
        localStorage.removeItem(SK.freeze);
        _showToast('🛡️ Streak freeze used! Your streak is safe!', 'success');
    }
}

// ─────────────────────────────────────────────────────────────
//  APPLY ACTIVE ITEMS
// ─────────────────────────────────────────────────────────────
function applyActiveTheme() {
    const active = getActiveTheme(); if (!active) return;
    const theme  = THEMES.find(t => t.id === active.id); if (!theme) return;
    let el = document.getElementById('efcd-theme-override');
    if (!el) { el = document.createElement('style'); el.id = 'efcd-theme-override'; document.head.appendChild(el); }
    el.textContent = theme.css;
}

let _emojiObserver = null;
function applyActiveEmojiPack() {
    const active = getActiveEmojiPack(); if (!active) return;
    const pack   = EMOJI_PACKS.find(p => p.id === active.id); if (!pack) return;
    const map    = pack.map;
    const keys   = Object.keys(map);
    const regex  = new RegExp(keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    function replaceInNode(node) {
        if (node.nodeType === 3) { const o = node.textContent; const r = o.replace(regex, m => map[m] || m); if (r !== o) node.textContent = r; }
        else if (node.nodeType === 1 && !['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.tagName)) node.childNodes.forEach(replaceInNode);
    }
    function runOnBody() {
        replaceInNode(document.body);
        if (_emojiObserver) _emojiObserver.disconnect();
        _emojiObserver = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => replaceInNode(n))));
        _emojiObserver.observe(document.body, { childList: true, subtree: true });
    }
    if (document.body) runOnBody();
    else document.addEventListener('DOMContentLoaded', runOnBody);
}

function applyActiveNameplate() {
    const active = getActiveNameplate(); if (!active) return;
    const np     = NAMEPLATES.find(n => n.id === active.id); if (!np) return;
    // Apply to leaderboard rows matching current user
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (!user) return;
    function injectNP() {
        document.querySelectorAll('.lb-row, .leaderboard-row').forEach(row => {
            const nameEl = row.querySelector('.lb-name, .player-name');
            if (nameEl && nameEl.textContent.includes(user.name || user.email)) {
                row.style.cssText += `;background:${np.preview}!important;border-color:rgba(255,255,255,.2)!important;`;
            }
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(injectNP, 800));
    else setTimeout(injectNP, 800);
    // Re-apply whenever leaderboard re-renders
    const obs = new MutationObserver(() => injectNP());
    const lb  = document.querySelector('.leaderboard, #leaderboard, .lb-list');
    if (lb) obs.observe(lb, { childList: true, subtree: true });
}

// ─────────────────────────────────────────────────────────────
//  EXPIRY WARNING BADGE
// ─────────────────────────────────────────────────────────────
function injectExpiryBadge() {
    const WARNING_HOURS = 48;
    const now = Date.now();
    const items = [
        { label: 'Theme', d: getActiveTheme()    },
        { label: 'Emoji', d: getActiveEmojiPack()},
        { label: 'Double XP', d: getDoubleXP()  },
    ].filter(x => x.d && (x.d.expires - now) < WARNING_HOURS * 3600000);

    const existing = document.getElementById('efcd-expiry-badge');
    if (existing) existing.remove();
    if (!items.length) return;

    const soonest = items.reduce((a, b) => a.d.expires < b.d.expires ? a : b);
    const hoursLeft = Math.max(1, Math.round((soonest.d.expires - now) / 3600000));

    const badge = document.createElement('div');
    badge.id = 'efcd-expiry-badge';
    badge.title = `${items.map(i => i.label).join(', ')} expiring soon — tap to renew`;
    badge.style.cssText = `
        position:fixed;bottom:20px;right:20px;z-index:9000;
        background:linear-gradient(135deg,#FF4500,#FF8C00);
        color:#fff;font-weight:900;font-size:12px;
        padding:8px 14px;border-radius:99px;cursor:pointer;
        border:2px solid rgba(255,255,255,.3);
        box-shadow:0 4px 16px rgba(255,69,0,.5);
        animation:expiryPulse 2s ease-in-out infinite;
    `;
    badge.innerHTML = `⏰ ${soonest.label} expires in ${hoursLeft}h`;
    badge.onclick = () => open('themes');

    if (!document.getElementById('efcd-expiry-kf')) {
        const kf = document.createElement('style');
        kf.id = 'efcd-expiry-kf';
        kf.textContent = `@keyframes expiryPulse{0%,100%{transform:scale(1);box-shadow:0 4px 16px rgba(255,69,0,.5)}50%{transform:scale(1.05);box-shadow:0 4px 24px rgba(255,69,0,.8)}}`;
        document.head.appendChild(kf);
    }
    document.body.appendChild(badge);
}

// ─────────────────────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────────────────────
function injectShopCSS() {
    if (document.getElementById('efcd-shop-css')) return;
    const s = document.createElement('style'); s.id = 'efcd-shop-css';
    s.textContent = `
#efcd-shop-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:99000;display:none;align-items:flex-end;justify-content:center;padding:0}
#efcd-shop-overlay.open{display:flex}
@media(min-width:600px){#efcd-shop-overlay{align-items:center;padding:20px}}
.shop-sheet{background:#0f0f1a;width:100%;max-width:580px;max-height:92vh;border-radius:28px 28px 0 0;overflow:hidden;display:flex;flex-direction:column;animation:shopSlideUp .35s cubic-bezier(.4,0,.2,1) both;box-shadow:0 -8px 60px rgba(0,0,0,.6)}
@media(min-width:600px){.shop-sheet{border-radius:28px;max-height:88vh}}
@keyframes shopSlideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}

.shop-hd{flex-shrink:0;background:linear-gradient(135deg,#1a0a3e,#0f1a3e);padding:20px 20px 0;position:relative;overflow:hidden}
.shop-hd::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top right,rgba(206,130,255,.15),transparent 60%);pointer-events:none}
.shop-hd-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;position:relative;z-index:1}
.shop-hd-left{display:flex;align-items:center;gap:12px}
.shop-hd-icon{width:48px;height:48px;background:linear-gradient(135deg,#CE82FF,#7B3FAA);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 16px rgba(206,130,255,.4)}
.shop-hd-title{font-size:20px;font-weight:900;color:#fff;letter-spacing:-.4px}
.shop-hd-sub{font-size:12px;font-weight:800;color:rgba(255,255,255,.5);margin-top:2px}
.shop-close{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);color:rgba(255,255,255,.5);font-size:18px;font-weight:900;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s}
.shop-close:hover{background:#ff4b4b;color:#fff;border-color:#ff4b4b}

.shop-balance{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:12px;padding:10px 14px;margin-bottom:4px;position:relative;z-index:1}
.shop-bal-label{font-size:11px;font-weight:900;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1.5px}
.shop-bal-xp{font-size:26px;font-weight:900;color:#FFC800;line-height:1}
.shop-bal-sub{font-size:11px;font-weight:800;color:rgba(255,200,0,.6)}

/* Active items strip */
.shop-active-strip{display:flex;gap:6px;flex-wrap:wrap;padding:8px 0 14px;position:relative;z-index:1}
.shop-active-pill{display:flex;align-items:center;gap:5px;background:rgba(88,204,2,.12);border:1px solid rgba(88,204,2,.3);border-radius:99px;padding:4px 10px;font-size:11px;font-weight:900;color:#58CC02;cursor:pointer}
.shop-active-pill.warn{background:rgba(255,140,0,.12);border-color:rgba(255,140,0,.3);color:#FF8C00}

.shop-tabs{display:flex;gap:4px;padding:0 0 14px;overflow-x:auto;scrollbar-width:thin;scrollbar-color:rgba(206,130,255,.3) transparent;position:relative;z-index:1;-webkit-overflow-scrolling:touch}
.shop-tabs::-webkit-scrollbar{display:none}
.shop-tab{flex-shrink:0;padding:7px 12px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:99px;font-size:11px;font-weight:900;color:rgba(255,255,255,.5);cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:4px;white-space:nowrap}
.shop-tab.active{background:#CE82FF;color:#fff;border-color:#A559D9;box-shadow:0 0 12px rgba(206,130,255,.4)}
.shop-tab .tab-dot{width:6px;height:6px;border-radius:50%;background:#FF4500;display:none}
.shop-tab.has-deal .tab-dot{display:block}

.shop-body{flex:1;overflow-y:auto;padding:16px 16px 32px}
.shop-body::-webkit-scrollbar{width:4px}
.shop-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}

/* Daily deal banner */
.deal-banner{background:linear-gradient(135deg,#7B1FA2,#E040FB);border-radius:16px;padding:14px 16px;margin-bottom:14px;position:relative;overflow:hidden;cursor:pointer}
.deal-banner::before{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.12) 50%,transparent 60%);animation:dealShimmer 2.5s ease-in-out infinite}
@keyframes dealShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
.deal-tag{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:4px}
.deal-name{font-size:16px;font-weight:900;color:#fff;margin-bottom:2px}
.deal-prices{display:flex;align-items:center;gap:8px;margin-top:6px}
.deal-old{font-size:13px;font-weight:900;color:rgba(255,255,255,.5);text-decoration:line-through}
.deal-new{font-size:18px;font-weight:900;color:#FFC800}
.deal-save{font-size:11px;font-weight:900;background:rgba(255,200,0,.2);color:#FFC800;padding:2px 8px;border-radius:6px}
.deal-timer{font-size:11px;font-weight:800;color:rgba(255,255,255,.6);margin-top:6px}

.shop-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.shop-item{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 12px;display:flex;flex-direction:column;gap:8px;transition:border-color .15s,background .15s,transform .1s;cursor:pointer;position:relative;overflow:hidden}
.shop-item:hover{border-color:rgba(206,130,255,.4);background:rgba(206,130,255,.06)}
.shop-item:active{transform:scale(.97)}
.shop-item.owned{border-color:#58CC02;background:rgba(88,204,2,.08);cursor:default}
.shop-item.active-item{border-color:#FFC800;background:rgba(255,200,0,.08)}
.shop-item.cant-afford{opacity:.45}
.shop-item.cant-afford .si-cost{color:#ff4b4b;border-color:rgba(255,75,75,.3);background:rgba(255,75,75,.08)}

.si-icon{font-size:28px;line-height:1;width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:14px}
.si-name{font-size:13px;font-weight:900;color:#fff;line-height:1.2}
.si-desc{font-size:11px;font-weight:700;color:rgba(255,255,255,.45);line-height:1.4;flex:1}
.si-footer{display:flex;align-items:center;justify-content:space-between;margin-top:4px}
.si-cost{font-size:12px;font-weight:900;color:#FFC800;background:rgba(255,200,0,.12);border:1px solid rgba(255,200,0,.3);padding:3px 8px;border-radius:6px}
.si-cost.free{color:#58CC02;background:rgba(88,204,2,.1);border-color:rgba(88,204,2,.3)}
.si-badge{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:6px}
.si-badge.owned{background:rgba(88,204,2,.15);color:#58CC02}
.si-badge.active{background:rgba(255,200,0,.15);color:#FFC800}
.si-badge.expires{color:rgba(255,255,255,.4);font-size:9px}
.theme-swatch{width:100%;height:6px;border-radius:3px;margin-bottom:4px;opacity:.8}

/* Utility items (full width) */
.utility-grid{display:flex;flex-direction:column;gap:8px}
.utility-item{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 16px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.utility-item:hover{border-color:rgba(206,130,255,.4);background:rgba(206,130,255,.06)}
.utility-item:active{transform:scale(.98)}
.utility-item.active-item{border-color:#58CC02;background:rgba(88,204,2,.08)}
.utility-item.cant-afford{opacity:.45}
.ui-icon{font-size:32px;flex-shrink:0;width:48px;text-align:center}
.ui-body{flex:1}
.ui-name{font-size:14px;font-weight:900;color:#fff}
.ui-desc{font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-top:2px;line-height:1.4}
.ui-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.ui-cost{font-size:13px;font-weight:900;color:#FFC800}
.ui-status{font-size:10px;font-weight:900;color:#58CC02}

/* Mystery box */
.mystery-box{background:linear-gradient(135deg,#1a0a3e,#2D0060);border:2px solid rgba(206,130,255,.3);border-radius:20px;padding:20px;text-align:center;cursor:pointer;position:relative;overflow:hidden;transition:transform .15s,border-color .15s}
.mystery-box:hover{transform:translateY(-2px);border-color:rgba(206,130,255,.6)}
.mystery-box:active{transform:scale(.97)}
.mb-icon{font-size:64px;display:block;margin-bottom:10px;animation:mbFloat 3s ease-in-out infinite}
@keyframes mbFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}
.mb-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
.mb-sub{font-size:12px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:12px;line-height:1.5}
.mb-cost{font-size:20px;font-weight:900;color:#FFC800}
.mb-odds{font-size:10px;font-weight:800;color:rgba(255,255,255,.3);margin-top:6px}

/* Nameplates */
.np-item{border-radius:16px;padding:14px 16px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden;margin-bottom:8px}
.np-item:hover{transform:translateY(-2px)}
.np-item:active{transform:scale(.98)}
.np-inner{display:flex;align-items:center;justify-content:space-between}
.np-left{display:flex;align-items:center;gap:10px}
.np-icon{font-size:24px}
.np-name{font-size:14px;font-weight:900;color:#fff}
.np-desc{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);margin-top:2px}

@keyframes holographic{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes shimmer{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(300%) skewX(-15deg)}}
.shiny-badge-icon{position:relative;background:linear-gradient(135deg,#FFD700,#FF6B6B,#4ECDC4,#45B7D1,#96CEB4,#FFEAA7,#FFD700);background-size:300% 300%;animation:holographic 3s ease infinite;border-radius:14px;box-shadow:0 0 20px rgba(255,215,0,.5),0 0 40px rgba(255,100,150,.3);overflow:hidden}
.shiny-badge-icon::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.6) 50%,transparent 70%);animation:shimmer 2s ease-in-out infinite}
.shiny-badge-icon span{position:relative;z-index:1}

/* Confirm dialog */
.shop-confirm-bg{position:fixed;inset:0;z-index:99100;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.5)}
.shop-confirm{background:#1a1a3e;border:2px solid rgba(206,130,255,.3);border-radius:20px;padding:28px 24px;max-width:300px;width:100%;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;animation:shopSlideUp .2s ease both}
.sc-icon{font-size:44px}
.sc-title{font-size:14px;font-weight:900;color:#fff}
.sc-cost{font-size:18px;font-weight:900;color:#FFC800}
.sc-btns{display:flex;gap:8px;width:100%;margin-top:4px}
.sc-btn{flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:900;font-family:inherit;cursor:pointer;border:1.5px solid;border-bottom:3px solid;transition:transform .1s,border-bottom-width .1s}
.sc-btn:active{border-bottom-width:1px;transform:translateY(2px)}
.sc-btn.yes{background:#CE82FF;color:#fff;border-color:#A559D9}
.sc-btn.no{background:rgba(255,255,255,.06);color:rgba(255,255,255,.5);border-color:rgba(255,255,255,.1)}

/* Success popup */
@keyframes successPop{0%{opacity:0;transform:scale(.8) rotate(-5deg) translate(-50%,-50%)}60%{transform:scale(1.1) rotate(2deg) translate(-50%,-50%)}100%{opacity:1;transform:scale(1) rotate(0) translate(-50%,-50%)}}
.shop-success{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#0f3020,#0a2010);border:2px solid #58CC02;border-bottom:5px solid #3a8a00;border-radius:20px;padding:28px 24px;text-align:center;z-index:99999;min-width:260px;animation:successPop .4s cubic-bezier(.175,.885,.32,1.275) both;box-shadow:0 0 40px rgba(88,204,2,.3)}
.shop-success-icon{font-size:56px;display:block;margin-bottom:8px}
.shop-success-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
.shop-success-sub{font-size:13px;font-weight:700;color:rgba(255,255,255,.6)}

/* Theme reveal overlay */
@keyframes revealFade{0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0}}
.theme-reveal{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;animation:revealFade 2s ease both;pointer-events:none}
.theme-reveal-icon{font-size:96px;animation:mbFloat 1s ease-in-out 3}
.theme-reveal-title{font-size:28px;font-weight:900;color:#fff;text-shadow:0 0 30px rgba(255,255,255,.8)}

/* Title badge */
.efcd-title-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,rgba(255,200,0,.2),rgba(255,200,0,.1));border:1.5px solid rgba(255,200,0,.4);border-radius:99px;padding:3px 10px;font-size:11px;font-weight:900;color:#FFC800;letter-spacing:.3px;margin-left:8px;vertical-align:middle}

/* Double XP indicator */
.double-xp-badge{position:fixed;top:70px;right:12px;z-index:8999;background:linear-gradient(135deg,#FF4500,#FF8C00);color:#fff;font-size:11px;font-weight:900;padding:6px 12px;border-radius:99px;box-shadow:0 4px 16px rgba(255,69,0,.5);animation:expiryPulse 2s ease-in-out infinite;cursor:pointer}

/* Titles */
.title-list{display:flex;flex-direction:column;gap:8px}
.title-item{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:14px;padding:12px 14px;cursor:pointer;transition:all .15s}
.title-item:hover{border-color:rgba(206,130,255,.4);background:rgba(206,130,255,.06)}
.title-item.owned{border-color:#FFC800;background:rgba(255,200,0,.06)}
.title-item.equipped{border-color:#58CC02;background:rgba(88,204,2,.08)}
.ti-icon{font-size:24px;width:40px;text-align:center;flex-shrink:0}
.ti-body{flex:1}
.ti-name{font-size:14px;font-weight:900;color:#fff}
.ti-desc{font-size:11px;font-weight:700;color:rgba(255,255,255,.4);margin-top:2px}
.ti-cost{font-size:12px;font-weight:900;color:#FFC800}
.ti-eq{font-size:11px;font-weight:900;color:#58CC02}

/* Request tab */
.req-board{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.req-row{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:14px;padding:10px 14px}
.req-votes{display:flex;flex-direction:column;align-items:center;background:rgba(206,130,255,.1);border:1px solid rgba(206,130,255,.2);border-radius:10px;padding:4px 8px;min-width:40px;cursor:pointer;transition:all .15s}
.req-votes:hover{background:rgba(206,130,255,.25)}
.req-vote-count{font-size:16px;font-weight:900;color:#CE82FF}
.req-vote-label{font-size:9px;font-weight:900;color:rgba(206,130,255,.6);text-transform:uppercase;letter-spacing:.5px}
.req-topic-text{font-size:13px;font-weight:900;color:#fff;flex:1}
.req-form{display:flex;flex-direction:column;gap:10px}
.req-label{font-size:12px;font-weight:900;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.req-input,.req-textarea{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:12px 14px;font-size:14px;font-weight:700;color:#fff;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
.req-input:focus,.req-textarea:focus{outline:none;border-color:#CE82FF;box-shadow:0 0 0 3px rgba(206,130,255,.15)}
.req-input::placeholder,.req-textarea::placeholder{color:rgba(255,255,255,.3)}
.req-textarea{min-height:90px;resize:vertical}
.req-submit{width:100%;padding:14px;background:linear-gradient(135deg,#CE82FF,#A559D9);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:900;font-family:inherit;cursor:pointer;transition:opacity .15s,transform .1s;box-shadow:0 4px 16px rgba(206,130,255,.3)}
.req-submit:hover{opacity:.9}
.req-submit:active{transform:scale(.98)}
.req-submit:disabled{opacity:.4;cursor:not-allowed}

.shop-section-hd{font-size:11px;font-weight:900;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;margin-top:4px;display:flex;align-items:center;gap:8px}
.shop-section-hd::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.btn-shop{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(206,130,255,.15);border:2px solid rgba(206,130,255,.3);border-bottom:4px solid rgba(165,89,217,.4);border-radius:12px;font-size:13px;font-weight:900;color:#CE82FF;cursor:pointer;font-family:inherit;transition:all .15s;text-decoration:none;white-space:nowrap}
.btn-shop:hover{background:rgba(206,130,255,.25);border-color:rgba(206,130,255,.5)}
.btn-shop:active{border-bottom-width:2px;transform:translateY(2px)}
    `;
    document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
//  RENDER SHOP
// ─────────────────────────────────────────────────────────────
let _currentTab = 'deal', _shopXP = 0;

function open(tab) {
    injectShopCSS();
    _currentTab = tab || 'deal';
    _shopXP = getXP();
    const existing = document.getElementById('efcd-shop-overlay');
    if (existing) existing.remove();

    const activeItems = _getActiveItemPills();
    const deal = getDailyDeal();
    const hoursLeft = Math.max(1, Math.round((deal.expires - Date.now()) / 3600000));

    const overlay = document.createElement('div');
    overlay.id = 'efcd-shop-overlay';
    overlay.innerHTML = `
        <div class="shop-sheet">
            <div class="shop-hd">
                <div class="shop-hd-top">
                    <div class="shop-hd-left">
                        <div class="shop-hd-icon">🛍️</div>
                        <div><div class="shop-hd-title">XP Shop</div><div class="shop-hd-sub">Spend your hard-earned XP on cool stuff</div></div>
                    </div>
                    <button class="shop-close" onclick="window.EFCD_Shop.close()">×</button>
                </div>
                <div class="shop-balance">
                    <div><div class="shop-bal-label">Your Balance</div><div class="shop-bal-sub">earned through lessons 💪</div></div>
                    <div style="text-align:right">
                        <div class="shop-bal-xp" id="shop-bal-xp">⚡ ${_shopXP.toLocaleString()} XP</div>
                        ${getDoubleXP() ? '<div style="font-size:10px;font-weight:900;color:#FF8C00;">🔥 2x XP active!</div>' : ''}
                    </div>
                </div>
                ${activeItems ? `<div class="shop-active-strip">${activeItems}</div>` : '<div style="height:10px"></div>'}
                <div class="shop-tabs">
                    <button class="shop-tab has-deal ${_currentTab==='deal'     ?'active':''}" onclick="window.EFCD_Shop._tab('deal')"><span class="tab-dot"></span>🔥 Deal</button>
                    <button class="shop-tab ${_currentTab==='power'    ?'active':''}" onclick="window.EFCD_Shop._tab('power')">⚡ Power-ups</button>
                    <button class="shop-tab ${_currentTab==='themes'   ?'active':''}" onclick="window.EFCD_Shop._tab('themes')">🎨 Themes</button>
                    <button class="shop-tab ${_currentTab==='emoji'    ?'active':''}" onclick="window.EFCD_Shop._tab('emoji')">😎 Emoji</button>
                    <button class="shop-tab ${_currentTab==='shiny'    ?'active':''}" onclick="window.EFCD_Shop._tab('shiny')">✨ Shiny</button>
                    <button class="shop-tab ${_currentTab==='titles'   ?'active':''}" onclick="window.EFCD_Shop._tab('titles')">🏷️ Titles</button>
                    <button class="shop-tab ${_currentTab==='plates'   ?'active':''}" onclick="window.EFCD_Shop._tab('plates')">🎨 Nameplates</button>
                    <button class="shop-tab ${_currentTab==='request'  ?'active':''}" onclick="window.EFCD_Shop._tab('request')">📬 Requests</button>
                </div>
            </div>
            <div class="shop-body" id="shop-body"></div>
        </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
    renderTab(_currentTab);
}

function _getActiveItemPills() {
    const now = Date.now();
    const WARNING = 48 * 3600000;
    let pills = '';
    const theme = getActiveTheme();
    if (theme) {
        const obj = THEMES.find(t => t.id === theme.id);
        const hrs  = Math.round((theme.expires - now) / 3600000);
        const warn = (theme.expires - now) < WARNING;
        pills += `<div class="shop-active-pill ${warn?'warn':''}" onclick="window.EFCD_Shop._tab('themes')">${obj?.icon||'🎨'} ${obj?.name||'Theme'} ${warn ? `⚠️ ${hrs}h` : `· ${hrs}h`}</div>`;
    }
    const emoji = getActiveEmojiPack();
    if (emoji) {
        const obj = EMOJI_PACKS.find(p => p.id === emoji.id);
        const hrs  = Math.round((emoji.expires - now) / 3600000);
        const warn = (emoji.expires - now) < WARNING;
        pills += `<div class="shop-active-pill ${warn?'warn':''}" onclick="window.EFCD_Shop._tab('emoji')">${obj?.icon||'😎'} ${obj?.name||'Emoji'} ${warn ? `⚠️ ${hrs}h` : `· ${hrs}h`}</div>`;
    }
    const dxp = getDoubleXP();
    if (dxp) {
        const hrs  = Math.round((dxp.expires - now) / 3600000);
        pills += `<div class="shop-active-pill warn" onclick="window.EFCD_Shop._tab('power')">🔥 2x XP · ${hrs}h left</div>`;
    }
    const freeze = getStreakFreeze();
    if (freeze) pills += `<div class="shop-active-pill" onclick="window.EFCD_Shop._tab('power')">🛡️ Streak Freeze ready</div>`;
    return pills;
}

function close() {
    const o = document.getElementById('efcd-shop-overlay');
    if (o) { o.style.cssText += ';opacity:0;transition:opacity .2s'; setTimeout(() => o.remove(), 200); }
}

function _tab(tab) {
    _currentTab = tab;
    const tabs = ['deal','power','themes','emoji','shiny','titles','plates','request'];
    document.querySelectorAll('.shop-tab').forEach((t, i) => t.classList.toggle('active', i === tabs.indexOf(tab)));
    renderTab(tab);
}

function renderTab(tab) {
    const body = document.getElementById('shop-body');
    if (!body) return;
    const fns = { deal:renderDeal, power:renderPower, themes:renderThemes, emoji:renderEmoji, shiny:renderShiny, titles:renderTitles, plates:renderNameplates, request:renderRequest };
    Promise.resolve((fns[tab] || renderDeal)(body));
}

// ─────────────────────────────────────────────────────────────
//  TAB: DAILY DEAL
// ─────────────────────────────────────────────────────────────
function renderDeal(body) {
    const deal = getDailyDeal();
    const hoursLeft = Math.max(1, Math.round((deal.expires - Date.now()) / 3600000));
    const canAfford = _shopXP >= deal.salePrice;
    const finalPrice = applyDiscount(deal.salePrice);
    const saving = deal.originalCost - finalPrice;

    // Also show mystery box here
    body.innerHTML = `
        <div class="shop-section-hd">Today's Deal · Changes in ${hoursLeft} hour${hoursLeft===1?'':'s'}</div>
        <div class="deal-banner" onclick="window.EFCD_Shop._buyDeal()">
            <div class="deal-tag">⚡ 40% OFF TODAY ONLY</div>
            <div class="deal-name">${deal.icon} ${deal.name}</div>
            <div style="font-size:12px;color:rgba(255,255,255,.6);margin-top:2px;">${deal.desc || ''}</div>
            <div class="deal-prices">
                <div class="deal-old">⚡ ${deal.originalCost} XP</div>
                <div class="deal-new">⚡ ${finalPrice} XP</div>
                <div class="deal-save">Save ${saving} XP!</div>
            </div>
            <div class="deal-timer">⏰ Expires in ${hoursLeft}h — then it's gone!</div>
        </div>

        <div class="shop-section-hd">Mystery Box · What will you get?</div>
        <div class="mystery-box" onclick="window.EFCD_Shop._buyMystery()">
            <span class="mb-icon">🎁</span>
            <div class="mb-title">Mystery Box</div>
            <div class="mb-sub">Could be bonus XP, a streak freeze, double XP, an emoji pack, or a discount token. You never know until you open it! Every box is a win.</div>
            <div class="mb-cost ${_shopXP<50?'':''}">⚡ 50 XP</div>
            <div class="mb-odds">Possible: +75 XP · +150 XP · +300 XP jackpot · 2x XP · Streak Freeze · Discount token · Emoji pack</div>
        </div>
    `;
}

// ─────────────────────────────────────────────────────────────
//  TAB: POWER-UPS
// ─────────────────────────────────────────────────────────────
function renderPower(body) {
    const freeze  = getStreakFreeze();
    const dxp     = getDoubleXP();
    const now     = Date.now();

    body.innerHTML = `
        <div class="shop-section-hd">Power-Ups · Consumable boosts</div>
        <div class="utility-grid">

            <div class="utility-item ${freeze?'active-item':''} ${!freeze&&_shopXP<100?'cant-afford':''}"
                 onclick="window.EFCD_Shop._buyFreeze()">
                <div class="ui-icon">🛡️</div>
                <div class="ui-body">
                    <div class="ui-name">Streak Freeze</div>
                    <div class="ui-desc">${freeze
                        ? `Active — protects your streak for 1 missed day. Auto-triggers on your next login after a miss.`
                        : `Miss a day without losing your streak. Activates automatically if you come back after 1 day away.`}
                    </div>
                </div>
                <div class="ui-right">
                    ${freeze
                        ? `<div class="ui-status">✓ Ready</div>`
                        : `<div class="ui-cost">⚡ 100 XP</div>`}
                </div>
            </div>

            <div class="utility-item ${dxp?'active-item':''} ${!dxp&&_shopXP<150?'cant-afford':''}"
                 onclick="window.EFCD_Shop._buyDoubleXP()">
                <div class="ui-icon">🔥</div>
                <div class="ui-body">
                    <div class="ui-name">Double XP Token</div>
                    <div class="ui-desc">${dxp
                        ? `Active! Expires in ${Math.round((dxp.expires - now)/3600000)}h. All lessons give 2x XP right now!`
                        : `2x XP on every lesson for 24 hours. Stack with daily challenges for MASSIVE gains. Plan a binge session!`}
                    </div>
                </div>
                <div class="ui-right">
                    ${dxp
                        ? `<div class="ui-status">🔥 ${Math.round((dxp.expires-now)/3600000)}h left</div>`
                        : `<div class="ui-cost">⚡ 150 XP</div>`}
                </div>
            </div>

        </div>
    `;
}

// ─────────────────────────────────────────────────────────────
//  TAB: THEMES
// ─────────────────────────────────────────────────────────────
function renderThemes(body) {
    const active = getActiveTheme();
    let html = `
        <div class="shop-section-hd">Site Themes · 7 days · Accent-only — site stays readable ✅</div>
        <div class="shop-grid">`;
    THEMES.forEach(t => {
        const isActive  = active?.id === t.id;
        const finalCost = applyDiscount(t.cost);
        const canAfford = _shopXP >= finalCost;
        html += `
        <div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyTheme('${t.id}')"
             style="border-top:3px solid ${t.preview};">
            <div class="theme-swatch" style="background:${t.preview};"></div>
            <div class="si-icon" style="background:${t.preview}22;border:1.5px solid ${t.preview}66;">${t.icon}</div>
            <div class="si-name">${t.name}</div>
            <div class="si-desc">${t.desc}</div>
            <div class="si-footer">
                <div class="si-cost">${isActive ? '✓ Active' : `⚡ ${finalCost} XP`}</div>
                ${isActive ? `<div class="si-badge active">${Math.round((active.expires-Date.now())/3600000)}h left</div>` : `<div class="si-badge expires">7d</div>`}
            </div>
        </div>`;
    });
    html += '</div>';
    if (active) html += `<div style="margin-top:12px;text-align:center;"><button onclick="window.EFCD_Shop._removeTheme()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove theme</button></div>`;
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: EMOJI
// ─────────────────────────────────────────────────────────────
function renderEmoji(body) {
    const active = getActiveEmojiPack();
    let html = `
        <div class="shop-section-hd">Emoji Packs · 7 days · Site-wide transformation</div>
        <div class="shop-grid">`;
    EMOJI_PACKS.forEach(p => {
        const isActive  = active?.id === p.id;
        const finalCost = applyDiscount(p.cost);
        const canAfford = _shopXP >= finalCost;
        const preview   = Object.values(p.map).slice(0,5).join(' ');
        html += `
        <div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyEmoji('${p.id}')">
            <div class="si-icon" style="background:rgba(255,255,255,.06);">${p.icon}</div>
            <div class="si-name">${p.name}</div>
            <div class="si-desc">${p.desc}</div>
            <div style="font-size:16px;letter-spacing:3px;margin:2px 0;">${preview}</div>
            <div class="si-footer">
                <div class="si-cost">${isActive ? '✓ Active' : `⚡ ${finalCost} XP`}</div>
                ${isActive ? `<div class="si-badge active">${Math.round((active.expires-Date.now())/3600000)}h left</div>` : `<div class="si-badge expires">7d</div>`}
            </div>
        </div>`;
    });
    html += '</div>';
    if (active) html += `<div style="margin-top:12px;text-align:center;"><button onclick="window.EFCD_Shop._removeEmoji()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove emoji pack</button></div>`;
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: SHINY BADGES
// ─────────────────────────────────────────────────────────────
async function renderShiny(body) {
    const profile = window.EFCD_Auth?.getCurrentUser();
    if (!profile) { body.innerHTML = `<div style="text-align:center;padding:40px 20px;color:rgba(255,255,255,.4);font-weight:800;">Log in to manage shiny badges ✨</div>`; return; }
    body.innerHTML = `<div style="text-align:center;padding:20px;color:rgba(255,255,255,.4);font-weight:800;">Loading...</div>`;

    let shinySet = getShinyBadges();
    try {
        const { data } = await window.efcdSupabaseClient.from('profiles').select('shiny_badges').eq('id', profile.id).single();
        if (Array.isArray(data?.shiny_badges)) { data.shiny_badges.forEach(id => shinySet.add(id)); localStorage.setItem(SK.shiny, JSON.stringify([...shinySet])); }
    } catch(e) { console.warn('shiny load error:', e); }

    const { data: lessons } = await window.efcdSupabaseClient.from('lessons').select('lesson_link,lesson_level,badge_icon,badge_name,lesson_title').eq('user_id', profile.id);
    const owned = (window.EFCD_Badges?.evaluate?.(profile, lessons||[])||[]).filter(b => b.earned);

    if (!owned.length) {
        body.innerHTML = `<div style="text-align:center;padding:40px 20px;"><div style="font-size:48px;margin-bottom:12px;">🔒</div><div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:6px;">No badges yet!</div><div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.4);">Complete lessons to earn badges, then make them SHINY! ✨</div></div>`;
        return;
    }

    const COST = applyDiscount(200);
    let html = `<div class="shop-section-hd">Shiny Upgrades · Permanent · ⚡ ${COST} XP each</div>
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;line-height:1.6;">Holographic shimmer on your badge. Permanent. Yours forever. ✨</div>
        <div class="shop-grid">`;
    owned.forEach(b => {
        const isShiny   = shinySet.has(b.id);
        const canAfford = _shopXP >= COST;
        html += `
        <div class="shop-item ${isShiny?'owned':''} ${!canAfford&&!isShiny?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyShiny('${b.id}','${(b.name||'').replace(/'/g,"\\'")}','${b.icon||'🏅'}')">
            <div class="si-icon ${isShiny?'shiny-badge-icon':''}" style="${!isShiny?`background:${b.color||'#333'}22;border:1.5px solid ${b.color||'#333'}44;`:''}">
                <span>${b.icon||'🏅'}</span>
            </div>
            <div class="si-name">${b.name||'Badge'}</div>
            <div class="si-desc">${isShiny ? '✨ Already holographic!' : 'Tap to upgrade to holographic shimmer'}</div>
            <div class="si-footer">
                <div class="si-cost ${isShiny?'free':''}">${isShiny ? '✓ Shiny' : `⚡ ${COST} XP`}</div>
                ${isShiny ? '<div class="si-badge owned">Upgraded ✨</div>' : '<div class="si-badge expires">Permanent</div>'}
            </div>
        </div>`;
    });
    html += '</div>';
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: TITLES
// ─────────────────────────────────────────────────────────────
function renderTitles(body) {
    const currentTitle = getCustomTitle();
    let ownedTitles;
    try { ownedTitles = new Set(JSON.parse(localStorage.getItem(SK.owned)||'[]')); } catch { ownedTitles = new Set(); }

    let html = `
        <div class="shop-section-hd">Profile Titles · Permanent · Buy once, keep forever</div>
        <div style="background:rgba(255,200,0,.08);border:1.5px solid rgba(255,200,0,.2);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:900;color:#FFC800;margin-bottom:4px;">📍 Where does my title show?</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);line-height:1.6;">
                Next to your name on the <strong style="color:rgba(255,255,255,.8);">leaderboard</strong>, in your <strong style="color:rgba(255,255,255,.8);">dashboard hero</strong>, and in <strong style="color:rgba(255,255,255,.8);">lesson completion screens</strong>. 💪
            </div>
        </div>
        <div class="title-list">`;

    TITLES.forEach(t => {
        const isOwned    = ownedTitles.has(t.id);
        const isEquipped = currentTitle === t.id;
        const finalCost  = applyDiscount(t.cost);
        const canAfford  = _shopXP >= finalCost;
        html += `
        <div class="title-item ${isEquipped?'equipped':isOwned?'owned':''}"
             onclick="window.EFCD_Shop._buyTitle('${t.id}','${t.name}','${t.icon}')">
            <div class="ti-icon">${t.icon}</div>
            <div class="ti-body">
                <div class="ti-name">${t.name}</div>
                <div class="ti-desc">${t.desc}</div>
            </div>
            ${isEquipped
                ? '<div class="ti-eq">✓ Equipped</div>'
                : isOwned
                    ? '<div class="ti-eq" style="color:rgba(255,255,255,.4)">Tap to equip</div>'
                    : `<div class="ti-cost" style="${!canAfford?'color:#ff4b4b':''}">⚡ ${finalCost}</div>`
            }
        </div>`;
    });
    html += '</div>';
    if (currentTitle) html += `<div style="margin-top:12px;text-align:center;"><button onclick="window.EFCD_Shop._removeTitle()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove title</button></div>`;
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: NAMEPLATES
// ─────────────────────────────────────────────────────────────
function renderNameplates(body) {
    const active = getActiveNameplate();
    let ownedNP;
    try { ownedNP = new Set(JSON.parse(localStorage.getItem(SK.ownedNP)||'[]')); } catch { ownedNP = new Set(); }

    let html = `
        <div class="shop-section-hd">Leaderboard Nameplates · Permanent · Stand out from the crowd</div>
        <div style="background:rgba(206,130,255,.08);border:1.5px solid rgba(206,130,255,.2);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:900;color:#CE82FF;margin-bottom:4px;">📍 Where does this show?</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);line-height:1.6;">
                Your leaderboard row gets a <strong style="color:rgba(255,255,255,.8);">coloured background</strong>. Everyone sees it. Be the most visible player on the board. 👑
            </div>
        </div>`;

    NAMEPLATES.forEach(np => {
        const isOwned    = ownedNP.has(np.id);
        const isActive   = active?.id === np.id;
        const finalCost  = applyDiscount(np.cost);
        const canAfford  = _shopXP >= finalCost;
        html += `
        <div class="np-item" style="background:${np.preview};opacity:${!canAfford&&!isOwned?'0.5':'1'};"
             onclick="window.EFCD_Shop._buyNameplate('${np.id}','${np.name}','${np.icon}')">
            <div class="np-inner">
                <div class="np-left">
                    <div class="np-icon">${np.icon}</div>
                    <div>
                        <div class="np-name">${np.name}</div>
                        <div class="np-desc">${np.desc}</div>
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    ${isActive
                        ? '<div style="font-size:12px;font-weight:900;color:#fff;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:8px;">✓ Active</div>'
                        : isOwned
                            ? '<div style="font-size:12px;font-weight:900;color:#fff;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:8px;">Tap to equip</div>'
                            : `<div style="font-size:13px;font-weight:900;color:#fff;background:rgba(0,0,0,.3);padding:4px 10px;border-radius:8px;">⚡ ${finalCost}</div>`
                    }
                </div>
            </div>
        </div>`;
    });
    if (active) html += `<div style="margin-top:8px;text-align:center;"><button onclick="window.EFCD_Shop._removeNameplate()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove nameplate</button></div>`;
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: REQUESTS — public board with upvotes
// ─────────────────────────────────────────────────────────────
async function renderRequest(body) {
    body.innerHTML = `<div style="text-align:center;padding:16px;color:rgba(255,255,255,.4);font-weight:800;">Loading requests...</div>`;

    let requests = [];
    try {
        const { data } = await window.efcdSupabaseClient
            .from('lesson_requests')
            .select('id,topic,votes')
            .order('votes', { ascending: false })
            .limit(8);
        requests = data || [];
    } catch(e) { console.warn('Could not load requests:', e); }

    const userVotes = JSON.parse(localStorage.getItem('efcd_req_votes') || '[]');
    const canAfford = _shopXP >= 250;

    let html = '';
    if (requests.length) {
        html += `
            <div class="shop-section-hd">Most wanted lessons · Vote to push them up! 🗳️</div>
            <div class="req-board">`;
        requests.forEach(r => {
            const voted = userVotes.includes(r.id);
            html += `
            <div class="req-row">
                <div class="req-votes" onclick="window.EFCD_Shop._voteRequest('${r.id}','${(r.topic||'').replace(/'/g,"\\'")}')">
                    <div class="req-vote-count">${r.votes || 0}</div>
                    <div class="req-vote-label">${voted ? '✓' : '▲'}</div>
                </div>
                <div class="req-topic-text">${r.topic || ''}</div>
            </div>`;
        });
        html += `</div>`;
    }

    html += `
        <div class="shop-section-hd">Submit your own idea · ⚡ 250 XP</div>
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;line-height:1.6;">
            Got a topic idea? Spend 250 XP to submit it — it goes on the public board so other Cool Dudes can vote it up. Most votes = gets made first! 🔥
        </div>
        <div class="req-form">
            <div>
                <div class="req-label">Your topic idea ✏️</div>
                <input class="req-input" id="req-topic" placeholder="e.g. British pub culture, AI vocabulary, job interviews..." maxlength="100">
            </div>
            <div>
                <div class="req-label">Why do you want it? (optional)</div>
                <textarea class="req-textarea" id="req-detail" placeholder="What level are you? Why this topic? The more you explain, the more votes it gets!" maxlength="400"></textarea>
            </div>
            <button class="req-submit" onclick="window.EFCD_Shop._submitRequest()" ${canAfford?'':'disabled'}>
                ${canAfford ? '📬 Submit for 250 XP' : `⚡ Need ${250-_shopXP} more XP`}
            </button>
        </div>`;

    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  PURCHASE HANDLERS
// ─────────────────────────────────────────────────────────────

// ── Daily Deal ───────────────────────────────────────────────
async function _buyDeal() {
    const deal = getDailyDeal();
    const finalPrice = applyDiscount(deal.salePrice);
    await _confirmPurchase(deal.icon, deal.name, finalPrice, `40% off — today only! ${deal.type==='theme'?'7-day theme':deal.type==='emoji'?'7-day emoji pack':'permanent'}`, async () => {
        if (!await spendXP(finalPrice)) { _showToast('Not enough XP! 😬', 'error'); return; }
        if (deal.type === 'theme')    { localStorage.setItem(SK.theme, JSON.stringify({ id:deal.id, expires: Date.now() + 7*864e5 })); applyActiveTheme(); _themeReveal(deal); }
        if (deal.type === 'emoji')    { localStorage.setItem(SK.emoji, JSON.stringify({ id:deal.id, expires: Date.now() + 7*864e5 })); if (_emojiObserver) _emojiObserver.disconnect(); applyActiveEmojiPack(); }
        if (deal.type === 'nameplate'){ let s; try{s=new Set(JSON.parse(localStorage.getItem(SK.ownedNP)||'[]'))}catch{s=new Set()} s.add(deal.id); localStorage.setItem(SK.ownedNP,JSON.stringify([...s])); localStorage.setItem(SK.nameplate,JSON.stringify({id:deal.id})); applyActiveNameplate(); }
        _shopXP = getXP();
        _showSuccess(deal.icon, `${deal.name} unlocked!`, `40% off deal — you saved ${deal.originalCost-finalPrice} XP! 🎉`);
        setTimeout(() => renderTab('deal'), 900);
    });
}

// ── Mystery Box ──────────────────────────────────────────────
async function _buyMystery() {
    if (!await _confirmPurchase('🎁', 'Mystery Box', 50, 'Random reward — every box is a win!', async () => {
        if (!await spendXP(50)) { _showToast('Not enough XP! 😬', 'error'); return; }
        const reward = MYSTERY_POOL[Math.floor(Math.random() * MYSTERY_POOL.length)];
        await _applyMysteryReward(reward);
        _shopXP = getXP();
        setTimeout(() => renderTab('deal'), 1400);
    })) return;
}

async function _applyMysteryReward(r) {
    if (r.type === 'xp') {
        await addXP(r.value);
        _showSuccess(r.icon, r.name, r.desc);
    } else if (r.type === 'double') {
        localStorage.setItem(SK.doubleXP, JSON.stringify({ expires: Date.now() + r.value * 3600000 }));
        _showSuccess(r.icon, r.name, r.desc);
        _injectDoubleXPBadge();
    } else if (r.type === 'freeze') {
        localStorage.setItem(SK.freeze, JSON.stringify({ expires: Date.now() + 7*864e5 }));
        _showSuccess(r.icon, r.name, r.desc);
    } else if (r.type === 'discount') {
        localStorage.setItem('efcd_discount', JSON.stringify({ pct: r.value, expires: Date.now() + 7*864e5 }));
        _showSuccess(r.icon, r.name, `${r.value}% off your next purchase in the shop! 🏷️`);
    } else if (r.type === 'emoji') {
        localStorage.setItem(SK.emoji, JSON.stringify({ id: r.value, expires: Date.now() + (r.duration||3)*864e5 }));
        applyActiveEmojiPack();
        _showSuccess(r.icon, r.name, r.desc);
    }
}

// ── Streak Freeze ─────────────────────────────────────────────
async function _buyFreeze() {
    if (getStreakFreeze()) { _showToast('You already have a streak freeze ready! 🛡️', 'success'); return; }
    await _confirmPurchase('🛡️', 'Streak Freeze', 100, 'Auto-triggers if you miss 1 day — streak stays safe', async () => {
        if (!await spendXP(100)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.freeze, JSON.stringify({ expires: Date.now() + 30*864e5 }));
        _shopXP = getXP();
        _showSuccess('🛡️', 'Streak Freeze ready!', 'Miss a day and come back — your streak will be waiting. 💪');
        setTimeout(() => renderTab('power'), 900);
    });
}

// ── Double XP ─────────────────────────────────────────────────
async function _buyDoubleXP() {
    if (getDoubleXP()) { _showToast('Double XP is already active! 🔥', 'success'); return; }
    await _confirmPurchase('🔥', 'Double XP Token', 150, '2x XP on every lesson for 24 hours', async () => {
        if (!await spendXP(150)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.doubleXP, JSON.stringify({ expires: Date.now() + 24*3600000 }));
        _shopXP = getXP();
        _showSuccess('🔥', 'DOUBLE XP ACTIVATED!', 'Every lesson gives 2x XP for the next 24 hours! GO GO GO! 🚀');
        _injectDoubleXPBadge();
        setTimeout(() => renderTab('power'), 900);
    });
}

function _injectDoubleXPBadge() {
    const existing = document.getElementById('efcd-dxp-badge');
    if (existing) existing.remove();
    const dxp = getDoubleXP();
    if (!dxp) return;
    const hrs = Math.round((dxp.expires - Date.now()) / 3600000);
    const el = document.createElement('div');
    el.id = 'efcd-dxp-badge';
    el.className = 'double-xp-badge';
    el.innerHTML = `🔥 2x XP · ${hrs}h`;
    el.onclick = () => open('power');
    document.body.appendChild(el);
}

// ── Themes ────────────────────────────────────────────────────
async function _buyTheme(id) {
    const theme = THEMES.find(t => t.id === id);
    if (!theme || getActiveTheme()?.id === id) return;
    const finalCost = applyDiscount(theme.cost);
    await _confirmPurchase(theme.icon, theme.name, finalCost, `${theme.duration}-day colour accent`, async () => {
        if (!await spendXP(finalCost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.theme, JSON.stringify({ id, expires: Date.now() + theme.duration * 864e5 }));
        applyActiveTheme();
        _themeReveal(theme);
        _shopXP = getXP();
        setTimeout(() => renderTab('themes'), 2200);
    });
}

function _themeReveal(theme) {
    // Full-screen colour flash reveal
    const rev = document.createElement('div');
    rev.className = 'theme-reveal';
    rev.style.background = `radial-gradient(ellipse at center, ${theme.preview}cc 0%, ${theme.preview}44 50%, transparent 80%)`;
    rev.innerHTML = `<div class="theme-reveal-icon">${theme.icon}</div><div class="theme-reveal-title">${theme.name} ACTIVATED!</div>`;
    document.body.appendChild(rev);
    setTimeout(() => rev.remove(), 2000);
}

// ── Emoji ─────────────────────────────────────────────────────
async function _buyEmoji(id) {
    const pack = EMOJI_PACKS.find(p => p.id === id);
    if (!pack || getActiveEmojiPack()?.id === id) return;
    const finalCost = applyDiscount(pack.cost);
    await _confirmPurchase(pack.icon, pack.name, finalCost, `${pack.duration}-day emoji swap`, async () => {
        if (!await spendXP(finalCost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.emoji, JSON.stringify({ id, expires: Date.now() + pack.duration * 864e5 }));
        if (_emojiObserver) _emojiObserver.disconnect();
        applyActiveEmojiPack();
        _shopXP = getXP();
        _showSuccess(pack.icon, `${pack.name} activated!`, 'Emojis transformed everywhere for 7 days! ✨');
        setTimeout(() => renderTab('emoji'), 900);
    });
}

// ── Shiny ─────────────────────────────────────────────────────
async function _buyShiny(badgeId, badgeName, badgeIcon) {
    let shinySet = getShinyBadges();
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (user) {
        try {
            const { data } = await window.efcdSupabaseClient.from('profiles').select('shiny_badges').eq('id', user.id).single();
            if (Array.isArray(data?.shiny_badges)) data.shiny_badges.forEach(id => shinySet.add(id));
        } catch(e) { console.warn('Could not fetch shiny_badges:', e); }
    }
    if (shinySet.has(badgeId)) { _showToast('Already shiny! ✨', 'success'); return; }
    const COST = applyDiscount(200);
    await _confirmPurchase('✨', `Shiny ${badgeName}`, COST, 'Permanent holographic upgrade', async () => {
        if (!await spendXP(COST)) { _showToast('Not enough XP! 😬', 'error'); return; }
        shinySet.add(badgeId);
        await saveShinyBadges(shinySet);
        _shopXP = getXP();
        _showSuccess(badgeIcon, `${badgeName} is now SHINY!`, '✨ Holographic forever — applied right now!');
        // Instantly refresh the badge collection on the dashboard if it's visible
        setTimeout(() => {
            renderTab('shiny');
            const userId = window.EFCD_Auth?.getCurrentUser?.()?.id;
            if (userId && typeof renderBadgeCollection === 'function') {
                renderBadgeCollection(userId);
            }
        }, 900);
    });
}

// ── Titles ────────────────────────────────────────────────────
async function _buyTitle(titleId, titleName, titleIcon) {
    let ownedTitles;
    try { ownedTitles = new Set(JSON.parse(localStorage.getItem(SK.owned)||'[]')); } catch { ownedTitles = new Set(); }
    if (ownedTitles.has(titleId)) {
        if (getCustomTitle() === titleId) { localStorage.removeItem(SK.title); _showToast('Title removed', 'success'); }
        else { localStorage.setItem(SK.title, titleId); _injectTitleIntoPage(titleIcon, titleName); _showToast(`${titleIcon} "${titleName}" equipped!`, 'success'); }
        _updateBalanceDisplay(); renderTab('titles'); return;
    }
    const title    = TITLES.find(t => t.id === titleId); if (!title) return;
    const finalCost = applyDiscount(title.cost);
    await _confirmPurchase(titleIcon, titleName, finalCost, 'Permanent — shows on leaderboard, dashboard + lesson screens', async () => {
        if (!await spendXP(finalCost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        ownedTitles.add(titleId);
        localStorage.setItem(SK.owned, JSON.stringify([...ownedTitles]));
        localStorage.setItem(SK.title, titleId);
        _shopXP = getXP();
        _injectTitleIntoPage(titleIcon, titleName);
        _showSuccess(titleIcon, `"${titleName}" unlocked!`, 'Showing on your dashboard + leaderboard + lesson screens! 🏷️');
        setTimeout(() => renderTab('titles'), 900);
    });
}

// ── Nameplates ────────────────────────────────────────────────
async function _buyNameplate(npId, npName, npIcon) {
    let ownedNP;
    try { ownedNP = new Set(JSON.parse(localStorage.getItem(SK.ownedNP)||'[]')); } catch { ownedNP = new Set(); }
    if (ownedNP.has(npId)) {
        if (getActiveNameplate()?.id === npId) { localStorage.removeItem(SK.nameplate); _showToast('Nameplate removed', 'success'); }
        else { localStorage.setItem(SK.nameplate, JSON.stringify({id:npId})); applyActiveNameplate(); _showToast(`${npIcon} "${npName}" equipped!`, 'success'); }
        renderTab('plates'); return;
    }
    const np = NAMEPLATES.find(n => n.id === npId); if (!np) return;
    const finalCost = applyDiscount(np.cost);
    await _confirmPurchase(npIcon, npName, finalCost, 'Permanent coloured leaderboard background', async () => {
        if (!await spendXP(finalCost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        ownedNP.add(npId);
        localStorage.setItem(SK.ownedNP, JSON.stringify([...ownedNP]));
        localStorage.setItem(SK.nameplate, JSON.stringify({id:npId}));
        applyActiveNameplate();
        _shopXP = getXP();
        _showSuccess(npIcon, `${npName} nameplate!`, "Now visible on the leaderboard — everyone can see it! 👑");
        setTimeout(() => renderTab('plates'), 900);
    });
}

// ── Lesson request submit ─────────────────────────────────────
async function _submitRequest() {
    const topic  = document.getElementById('req-topic')?.value?.trim();
    const detail = document.getElementById('req-detail')?.value?.trim();
    if (!topic) { _showToast('Please enter a topic first! ✏️', 'error'); return; }
    const user = window.EFCD_Auth?.getCurrentUser();
    if (!user) { _showToast('Please log in first!', 'error'); return; }

    await _confirmPurchase('📬', 'Submit Lesson Request', 250, 'Goes on the public vote board — others can upvote it!', async () => {
        if (!await spendXP(250)) { _showToast('Not enough XP! 😬', 'error'); return; }
        try {
            const { error } = await window.efcdSupabaseClient.from('lesson_requests').insert([{
                user_id: user.id, user_name: user.name||'Anonymous Cool Dude',
                user_email: user.email||'', topic, detail: detail||null,
                votes: 0, created_at: new Date().toISOString(),
            }]);
            if (error) throw error;
        } catch(e) {
            console.error('lesson_requests insert failed:', e.message);
            try { await addXP(250); } catch(_) {}
            _showToast('Could not save — XP refunded, try again!', 'error'); return;
        }
        _shopXP = getXP();
        _showSuccess('📬', 'Request on the board!', 'Other Cool Dudes can now vote it up. Most votes = gets built first! 🔥');
        setTimeout(() => renderTab('request'), 1400);
    });
}

// ── Vote on request ───────────────────────────────────────────
async function _voteRequest(id, topic) {
    const votes = JSON.parse(localStorage.getItem('efcd_req_votes')||'[]');
    if (votes.includes(id)) { _showToast('Already voted! 🗳️', 'success'); return; }
    try {
        const { data } = await window.efcdSupabaseClient.from('lesson_requests').select('votes').eq('id', id).single();
        const newVotes = (data?.votes || 0) + 1;
        await window.efcdSupabaseClient.from('lesson_requests').update({ votes: newVotes }).eq('id', id);
        votes.push(id);
        localStorage.setItem('efcd_req_votes', JSON.stringify(votes));
        _showToast(`Voted for "${topic}"! 🗳️`, 'success');
        setTimeout(() => renderTab('request'), 400);
    } catch(e) { console.warn('Vote error:', e); _showToast('Could not vote right now', 'error'); }
}

// ─────────────────────────────────────────────────────────────
//  REMOVE HANDLERS
// ─────────────────────────────────────────────────────────────
function _removeTheme()     { localStorage.removeItem(SK.theme); const el=document.getElementById('efcd-theme-override'); if(el)el.remove(); renderTab('themes'); _showToast('Theme removed', 'success'); }
function _removeEmoji()     { localStorage.removeItem(SK.emoji); if(_emojiObserver){_emojiObserver.disconnect();_emojiObserver=null;} renderTab('emoji'); _showToast('Emoji pack removed — refresh to reset emojis', 'success'); }
function _removeTitle()     { localStorage.removeItem(SK.title); document.querySelectorAll('.efcd-title-badge').forEach(el=>el.remove()); renderTab('titles'); _showToast('Title removed', 'success'); }
function _removeNameplate() { localStorage.removeItem(SK.nameplate); renderTab('plates'); _showToast('Nameplate removed', 'success'); }

// ─────────────────────────────────────────────────────────────
//  CONFIRM DIALOG
// ─────────────────────────────────────────────────────────────
function _confirmPurchase(icon, name, cost, desc, onConfirm) {
    return new Promise(resolve => {
        const bg = document.createElement('div'); bg.className = 'shop-confirm-bg';
        const box = document.createElement('div'); box.className = 'shop-confirm';
        box.innerHTML = `
            <div class="sc-icon">${icon}</div>
            <div class="sc-title">${name}</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:6px;">${desc}</div>
            <div class="sc-cost">⚡ ${cost} XP</div>
            <div style="font-size:11px;color:rgba(255,255,255,.35);margin-bottom:8px;">Balance after: ${Math.max(0,_shopXP-cost).toLocaleString()} XP</div>
            <div class="sc-btns">
                <button class="sc-btn no" id="sc-no">Cancel</button>
                <button class="sc-btn yes" id="sc-yes">Buy it! ⚡</button>
            </div>`;
        bg.appendChild(box); document.body.appendChild(bg);
        box.querySelector('#sc-yes').onclick = async () => { bg.remove(); await onConfirm(); _updateBalanceDisplay(); resolve(true); };
        box.querySelector('#sc-no').onclick  = () => { bg.remove(); resolve(false); };
        bg.addEventListener('click', e => { if(e.target===bg){bg.remove();resolve(false);} });
    });
}

// ─────────────────────────────────────────────────────────────
//  SUCCESS + TOAST + UI
// ─────────────────────────────────────────────────────────────
function _showSuccess(icon, title, sub) {
    const el = document.createElement('div'); el.className = 'shop-success';
    el.innerHTML = `<span class="shop-success-icon">${icon}</span><div class="shop-success-title">${title}</div><div class="shop-success-sub">${sub}</div>`;
    document.body.appendChild(el);
    if (typeof burst === 'function') burst(16);
    setTimeout(() => { el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, 2200);
}

function _showToast(msg, type) {
    const t = document.getElementById('toast');
    if (t) { t.textContent=msg; t.className=`toast ${type} show`; setTimeout(()=>t.classList.remove('show'),3000); }
    else {
        const el = document.createElement('div');
        el.style.cssText=`position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${type==='error'?'#ff4b4b':'#58CC02'};color:#fff;padding:12px 20px;border-radius:10px;font-weight:900;font-size:14px;z-index:99999;`;
        el.textContent = msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2800);
    }
}

function _updateBalanceDisplay() {
    _shopXP = getXP();
    const el = document.getElementById('shop-bal-xp');
    if (el) el.textContent = `⚡ ${_shopXP.toLocaleString()} XP`;
}

function _injectTitleIntoPage(icon, name) {
    document.querySelectorAll('.efcd-title-badge').forEach(el=>el.remove());
    const badge = `<span class="efcd-title-badge">${icon} ${name}</span>`;
    const dhName = document.querySelector('.dh-name, .uname');
    if (dhName) dhName.insertAdjacentHTML('afterend', badge);
}

// ─────────────────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────────────────
function applyActive() {
    applyActiveTheme();
    applyActiveEmojiPack();
    applyActiveNameplate();
    const titleObj = getCustomTitleObj();
    if (titleObj) {
        const run = () => _injectTitleIntoPage(titleObj.icon, titleObj.name);
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 600));
        else setTimeout(run, 600);
    }
    // Double XP badge
    if (getDoubleXP()) {
        const run = () => _injectDoubleXPBadge();
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 800));
        else setTimeout(run, 800);
    }
    // Expiry warnings
    const runExpiry = () => injectExpiryBadge();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(runExpiry, 1000));
    else setTimeout(runExpiry, 1000);
    // Streak freeze check
    const runFreeze = () => checkStreakFreeze();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(runFreeze, 1500));
    else setTimeout(runFreeze, 1500);
}

function injectShopButton() {
    injectShopCSS();
    const signout = document.querySelector('.btn-signout');
    if (signout && !document.querySelector('.btn-shop')) {
        const btn = document.createElement('button'); btn.className='btn-shop'; btn.innerHTML='🛍️ Shop'; btn.onclick=()=>open();
        signout.parentNode.insertBefore(btn, signout);
    }
    const headerXP = document.querySelector('.header-xp');
    if (headerXP && !document.querySelector('.btn-shop')) {
        const btn = document.createElement('button'); btn.className='btn-shop'; btn.innerHTML='🛍️'; btn.title='XP Shop'; btn.onclick=()=>open();
        headerXP.prepend(btn);
    }
}

// ─────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────
window.EFCD_Shop = {
    open, close, applyActive, injectShopButton, getXPMultiplier,
    getShinyBadges, getCustomTitle, getCustomTitleObj, getActiveTheme,
    getActiveEmojiPack, getStreakFreeze, getDoubleXP, getActiveNameplate,
    _tab, _buyDeal, _buyMystery, _buyFreeze, _buyDoubleXP,
    _buyTheme, _buyEmoji, _buyShiny, _buyTitle, _buyNameplate,
    _removeTheme, _removeEmoji, _removeTitle, _removeNameplate,
    _submitRequest, _voteRequest,
};

applyActive();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(injectShopButton, 500));
else setTimeout(injectShopButton, 500);

console.log('🛍️ EFCD XP Shop v3.0 loaded');
