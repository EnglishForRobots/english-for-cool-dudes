// ═══════════════════════════════════════════════════════════════
// EFCD XP SHOP — xp-shop.js  v2.0
// FIXES & OVERHAUL:
//   1. Shiny badges: SET accumulates correctly, never replaces
//   2. Themes: subtle accent-only CSS — site stays readable
//   3. Emoji packs: MutationObserver covers dynamic content
//   4. Titles: displayed in dashboard hero + leaderboard, described clearly
//   5. Lesson request: Supabase insert + mailto fallback → tonyfrombrighton@gmail.com
//   6. XP rebalance: themes 100xp, titles show real value, better copy
// ═══════════════════════════════════════════════════════════════
'use strict';

const SK = {
    shiny:  'efcd_shiny_badges',
    theme:  'efcd_active_theme',
    emoji:  'efcd_emoji_pack',
    title:  'efcd_custom_title',
    owned:  'efcd_owned_titles',
};

// ── THEMES — accent-only, site stays readable ─────────────────
// Rules: only change header bg, accent colour, XP bar, button highlights.
// NEVER override --bg, --white, --ink, --ink-bold, --border — those kill readability.
const THEMES = [
    {
        id:'sunset_vibes', name:'Sunset Vibes', icon:'🌅', cost:100, duration:7,
        preview:'#FF6B35',
        desc:'Warm oranges and coral. Cool Dude energy with holiday feels.',
        css:`
            .header { background: #FFF5F0 !important; border-bottom-color: #FFCBA4 !important; }
            .logo { background: #FF6B35 !important; box-shadow: 0 3px 0 #D94F1A !important; }
            .hero, .dash-hero { background: linear-gradient(135deg,#FF6B35,#FF8C42) !important; border-color: #D94F1A !important; border-bottom-color: #D94F1A !important; }
            .dh-xp-fill, .xp-fill { background: #FFF !important; }
            .hero-cta { background: #FF6B35 !important; border-color: #D94F1A !important; }
            .dc-card { background: linear-gradient(135deg,#FF6B35,#FF8C42) !important; border-color: #D94F1A !important; }
            .stat-card::before, .cc[data-c=blue]::before { background: #FF6B35 !important; }
            .picks-go-btn { background: #FF6B35 !important; border-color: #D94F1A !important; }
        `
    },
    {
        id:'forest_mode', name:'Forest Mode', icon:'🌿', cost:100, duration:7,
        preview:'#2D6A4F',
        desc:'Deep greens. Calm, focused, like studying in a forest clearing.',
        css:`
            .header { background: #F0FAF4 !important; border-bottom-color: #B7DFC8 !important; }
            .logo { background: #52B788 !important; box-shadow: 0 3px 0 #2D6A4F !important; }
            .hero, .dash-hero { background: linear-gradient(135deg,#2D6A4F,#40916C) !important; border-color: #1B4332 !important; border-bottom-color: #1B4332 !important; }
            .dh-xp-fill, .xp-fill { background: #B7E4C7 !important; }
            .hero-cta { background: #40916C !important; border-color: #2D6A4F !important; }
            .dc-card { background: linear-gradient(135deg,#2D6A4F,#40916C) !important; border-color: #1B4332 !important; }
            .stat-card::before, .cc[data-c=blue]::before { background: #40916C !important; }
            .picks-go-btn { background: #40916C !important; border-color: #2D6A4F !important; }
        `
    },
    {
        id:'ocean_breeze', name:'Ocean Breeze', icon:'🌊', cost:100, duration:7,
        preview:'#0077B6',
        desc:'Deep ocean blues. Sharp, clean, powerful. Make waves.',
        css:`
            .header { background: #EFF8FF !important; border-bottom-color: #BAE0FF !important; }
            .logo { background: #0096C7 !important; box-shadow: 0 3px 0 #0077B6 !important; }
            .hero, .dash-hero { background: linear-gradient(135deg,#0077B6,#0096C7) !important; border-color: #005F8F !important; border-bottom-color: #005F8F !important; }
            .dh-xp-fill, .xp-fill { background: #ADE8F4 !important; }
            .hero-cta { background: #0096C7 !important; border-color: #0077B6 !important; }
            .dc-card { background: linear-gradient(135deg,#0077B6,#0096C7) !important; border-color: #005F8F !important; }
            .stat-card::before, .cc[data-c=blue]::before { background: #0096C7 !important; }
            .picks-go-btn { background: #0096C7 !important; border-color: #0077B6 !important; }
        `
    },
    {
        id:'candy_pop', name:'Candy Pop', icon:'🍬', cost:100, duration:7,
        preview:'#E040FB',
        desc:'Hot pink energy. Loud and proud. Not for the faint-hearted.',
        css:`
            .header { background: #FFF0FE !important; border-bottom-color: #F5B8FF !important; }
            .logo { background: #E040FB !important; box-shadow: 0 3px 0 #AA00FF !important; }
            .hero, .dash-hero { background: linear-gradient(135deg,#E040FB,#CE82FF) !important; border-color: #AA00FF !important; border-bottom-color: #AA00FF !important; }
            .dh-xp-fill, .xp-fill { background: #FFF !important; }
            .hero-cta { background: #E040FB !important; border-color: #AA00FF !important; }
            .dc-card { background: linear-gradient(135deg,#E040FB,#CE82FF) !important; border-color: #AA00FF !important; }
            .stat-card::before, .cc[data-c=blue]::before { background: #E040FB !important; }
            .picks-go-btn { background: #E040FB !important; border-color: #AA00FF !important; }
        `
    },
    {
        id:'gold_vip', name:'Gold VIP', icon:'👑', cost:150, duration:7,
        preview:'#F59E0B',
        desc:'Everything glitters. Reserved for legends only.',
        css:`
            .header { background: #FFFBEB !important; border-bottom-color: #FDE68A !important; }
            .logo { background: #F59E0B !important; box-shadow: 0 3px 0 #D97706 !important; }
            .hero, .dash-hero { background: linear-gradient(135deg,#D97706,#F59E0B) !important; border-color: #B45309 !important; border-bottom-color: #B45309 !important; }
            .dh-xp-fill, .xp-fill { background: #FFF !important; }
            .hero-cta { background: #F59E0B !important; border-color: #D97706 !important; }
            .dc-card { background: linear-gradient(135deg,#D97706,#F59E0B) !important; border-color: #B45309 !important; }
            .stat-card.c-yellow::before, .stat-card.c-blue::before { background: #F59E0B !important; }
            .picks-go-btn { background: #F59E0B !important; border-color: #D97706 !important; color: #111 !important; }
            .eyebrow, .cc-badge { background: #FDE68A !important; }
        `
    },
];

// ── EMOJI PACKS ───────────────────────────────────────────────
const EMOJI_PACKS = [
    { id:'cats',     name:'Cat Mode',      icon:'🐱', cost:75, duration:7,
      desc:'Every emoji becomes a cat. Meow.',
      map:{'😎':'😼','🔥':'🐱‍🔥','⚡':'✨','🏆':'🏅','📚':'📖','🎯':'🐾','🚀':'🐈','💎':'🐱','🌟':'⭐','💪':'🐾','🎉':'🎊','✅':'🐾','❌':'🙀'} },
    { id:'space',    name:'Space Mode',    icon:'🚀', cost:75, duration:7,
      desc:'One giant leap for vocabulary kind.',
      map:{'😎':'👨‍🚀','🔥':'☄️','⚡':'🌟','🏆':'🛸','📚':'🔭','🎯':'🪐','🚀':'🛸','💎':'🌙','🌟':'✨','💪':'👨‍🚀','🎉':'🎆','✅':'🌍','❌':'💥'} },
    { id:'food',     name:'Food Mode',     icon:'🍕', cost:75, duration:7,
      desc:'Learning is delicious. Nom nom.',
      map:{'😎':'🍕','🔥':'🌶️','⚡':'☕','🏆':'🍰','📚':'🍱','🎯':'🎂','🚀':'🍔','💎':'🍣','🌟':'🌮','💪':'🥑','🎉':'🎂','✅':'🥗','❌':'🍋'} },
    { id:'medieval', name:'Medieval Mode', icon:'⚔️', cost:75, duration:7,
      desc:'Hark! Thy learning journey begins, noble scholar.',
      map:{'😎':'🧙','🔥':'🐉','⚡':'⚔️','🏆':'🏰','📚':'📜','🎯':'🏹','🚀':'🗡️','💎':'👑','🌟':'⭐','💪':'🛡️','🎉':'🎺','✅':'🛡️','❌':'💀'} },
];

// ── TITLES — now with clear descriptions of where they show ──
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

// ── FIX 1: getShinyBadges ALWAYS returns a Set ───────────────
function getShinyBadges() {
    try {
        const raw = localStorage.getItem(SK.shiny);
        const arr = JSON.parse(raw || '[]');
        return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
}

// ── FIX 1: saveShinyBadges ADDS to existing set, never replaces ─
async function saveShinyBadges(set) {
    const arr = [...set];
    localStorage.setItem(SK.shiny, JSON.stringify(arr));
    // Sync full array to Supabase — read existing first, merge, then write
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (user && window.efcdSupabaseClient) {
        try {
            const { data } = await window.efcdSupabaseClient
                .from('profiles').select('shiny_badges').eq('id', user.id).single();
            const existing = new Set(Array.isArray(data?.shiny_badges) ? data.shiny_badges : []);
            arr.forEach(id => existing.add(id)); // merge — never wipe
            const merged = [...existing];
            await window.efcdSupabaseClient
                .from('profiles').update({ shiny_badges: merged }).eq('id', user.id);
            // Also update localStorage to match merged truth
            localStorage.setItem(SK.shiny, JSON.stringify(merged));
        } catch(e) { console.warn('shiny_badges sync error:', e); }
    }
}

function getActiveTheme() {
    try { const d = JSON.parse(localStorage.getItem(SK.theme)); if (d && d.expires > Date.now()) return d; } catch {}
    localStorage.removeItem(SK.theme); return null;
}
function getActiveEmojiPack() {
    try { const d = JSON.parse(localStorage.getItem(SK.emoji)); if (d && d.expires > Date.now()) return d; } catch {}
    localStorage.removeItem(SK.emoji); return null;
}
function getCustomTitle() { return localStorage.getItem(SK.title) || null; }

// ── FIX 4: getCustomTitleObj — for rendering title in UI ─────
function getCustomTitleObj() {
    const id = getCustomTitle();
    if (!id) return null;
    return TITLES.find(t => t.id === id) || null;
}

function applyActiveTheme() {
    const active = getActiveTheme(); if (!active) return;
    const theme  = THEMES.find(t => t.id === active.id); if (!theme) return;
    let el = document.getElementById('efcd-theme-override');
    if (!el) { el = document.createElement('style'); el.id = 'efcd-theme-override'; document.head.appendChild(el); }
    el.textContent = theme.css;
}

// ── FIX 3: Emoji pack — covers dynamic content via persistent observer ──
let _emojiObserver = null;
function applyActiveEmojiPack() {
    const active = getActiveEmojiPack(); if (!active) return;
    const pack   = EMOJI_PACKS.find(p => p.id === active.id); if (!pack) return;
    const map    = pack.map;
    const keys   = Object.keys(map);
    const regex  = new RegExp(keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

    function replaceInNode(node) {
        if (node.nodeType === 3) {
            const o = node.textContent;
            const r = o.replace(regex, m => map[m] || m);
            if (r !== o) node.textContent = r;
        } else if (node.nodeType === 1 && !['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.tagName)) {
            node.childNodes.forEach(replaceInNode);
        }
    }

    function runOnBody() {
        replaceInNode(document.body);
        if (_emojiObserver) _emojiObserver.disconnect();
        _emojiObserver = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => replaceInNode(n)));
        });
        _emojiObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) runOnBody();
    else document.addEventListener('DOMContentLoaded', runOnBody);
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
.shop-sheet{background:#0f0f1a;width:100%;max-width:560px;max-height:92vh;border-radius:28px 28px 0 0;overflow:hidden;display:flex;flex-direction:column;animation:shopSlideUp .35s cubic-bezier(.4,0,.2,1) both;box-shadow:0 -8px 60px rgba(0,0,0,.6)}
@media(min-width:600px){.shop-sheet{border-radius:28px;max-height:86vh}}
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

.shop-balance{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:12px;padding:10px 14px;margin-bottom:16px;position:relative;z-index:1}
.shop-bal-label{font-size:11px;font-weight:900;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1.5px}
.shop-bal-xp{font-size:26px;font-weight:900;color:#FFC800;line-height:1}
.shop-bal-sub{font-size:11px;font-weight:800;color:rgba(255,200,0,.6)}

.shop-tabs{display:flex;gap:4px;padding:0 20px 14px;overflow-x:auto;scrollbar-width:none;position:relative;z-index:1}
.shop-tabs::-webkit-scrollbar{display:none}
.shop-tab{flex-shrink:0;padding:8px 14px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:99px;font-size:12px;font-weight:900;color:rgba(255,255,255,.5);cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:5px}
.shop-tab.active{background:#CE82FF;color:#fff;border-color:#A559D9;box-shadow:0 0 12px rgba(206,130,255,.4)}

.shop-body{flex:1;overflow-y:auto;padding:16px 16px 24px}
.shop-body::-webkit-scrollbar{width:4px}
.shop-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}

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

@keyframes holographic{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes shimmer{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(300%) skewX(-15deg)}}
.shiny-badge-icon{position:relative;background:linear-gradient(135deg,#FFD700,#FF6B6B,#4ECDC4,#45B7D1,#96CEB4,#FFEAA7,#FFD700);background-size:300% 300%;animation:holographic 3s ease infinite;border-radius:14px;box-shadow:0 0 20px rgba(255,215,0,.5),0 0 40px rgba(255,100,150,.3);overflow:hidden}
.shiny-badge-icon::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.6) 50%,transparent 70%);animation:shimmer 2s ease-in-out infinite}
.shiny-badge-icon span{position:relative;z-index:1}

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

@keyframes successPop{0%{opacity:0;transform:scale(.8) rotate(-5deg) translate(-50%,-50%)}60%{transform:scale(1.1) rotate(2deg) translate(-50%,-50%)}100%{opacity:1;transform:scale(1) rotate(0) translate(-50%,-50%)}}
.shop-success{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#0f3020,#0a2010);border:2px solid #58CC02;border-bottom:5px solid #3a8a00;border-radius:20px;padding:28px 24px;text-align:center;z-index:99999;min-width:260px;animation:successPop .4s cubic-bezier(.175,.885,.32,1.275) both;box-shadow:0 0 40px rgba(88,204,2,.3)}
.shop-success-icon{font-size:56px;display:block;margin-bottom:8px}
.shop-success-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
.shop-success-sub{font-size:13px;font-weight:700;color:rgba(255,255,255,.6)}

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

.req-form{display:flex;flex-direction:column;gap:12px}
.req-label{font-size:12px;font-weight:900;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.req-input,.req-textarea{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:12px 14px;font-size:14px;font-weight:700;color:#fff;font-family:inherit;transition:border-color .15s}
.req-input:focus,.req-textarea:focus{outline:none;border-color:#CE82FF;box-shadow:0 0 0 3px rgba(206,130,255,.15)}
.req-input::placeholder,.req-textarea::placeholder{color:rgba(255,255,255,.3)}
.req-textarea{min-height:100px;resize:vertical}
.req-submit{width:100%;padding:14px;background:linear-gradient(135deg,#CE82FF,#A559D9);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:900;font-family:inherit;cursor:pointer;transition:opacity .15s,transform .1s;box-shadow:0 4px 16px rgba(206,130,255,.3)}
.req-submit:hover{opacity:.9}
.req-submit:active{transform:scale(.98)}
.req-submit:disabled{opacity:.4;cursor:not-allowed}

.shop-section-hd{font-size:11px;font-weight:900;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;margin-top:4px;display:flex;align-items:center;gap:8px}
.shop-section-hd::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.btn-shop{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(206,130,255,.15);border:2px solid rgba(206,130,255,.3);border-bottom:4px solid rgba(165,89,217,.4);border-radius:12px;font-size:13px;font-weight:900;color:#CE82FF;cursor:pointer;font-family:inherit;transition:all .15s;text-decoration:none;white-space:nowrap}
.btn-shop:hover{background:rgba(206,130,255,.25);border-color:rgba(206,130,255,.5)}
.btn-shop:active{border-bottom-width:2px;transform:translateY(2px)}

/* ── FIX 4: Title badge shown in hero/leaderboard ── */
.efcd-title-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,rgba(255,200,0,.2),rgba(255,200,0,.1));border:1.5px solid rgba(255,200,0,.4);border-radius:99px;padding:3px 10px;font-size:11px;font-weight:900;color:#FFC800;letter-spacing:.3px;margin-left:8px;vertical-align:middle;}
    `;
    document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
//  RENDER SHOP
// ─────────────────────────────────────────────────────────────
let _currentTab = 'themes', _shopXP = 0;

function open(tab) {
    injectShopCSS();
    _currentTab = tab || 'themes';
    _shopXP = getXP();
    const existing = document.getElementById('efcd-shop-overlay');
    if (existing) existing.remove();
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
                    <div style="text-align:right"><div class="shop-bal-xp" id="shop-bal-xp">⚡ ${_shopXP.toLocaleString()} XP</div></div>
                </div>
                <div class="shop-tabs">
                    <button class="shop-tab ${_currentTab==='themes' ?'active':''}" onclick="window.EFCD_Shop._tab('themes')">🎨 Themes</button>
                    <button class="shop-tab ${_currentTab==='emoji'  ?'active':''}" onclick="window.EFCD_Shop._tab('emoji')">😎 Emoji</button>
                    <button class="shop-tab ${_currentTab==='shiny'  ?'active':''}" onclick="window.EFCD_Shop._tab('shiny')">✨ Shiny</button>
                    <button class="shop-tab ${_currentTab==='titles' ?'active':''}" onclick="window.EFCD_Shop._tab('titles')">🏷️ Titles</button>
                    <button class="shop-tab ${_currentTab==='request'?'active':''}" onclick="window.EFCD_Shop._tab('request')">📬 Request</button>
                </div>
            </div>
            <div class="shop-body" id="shop-body"></div>
        </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
    renderTab(_currentTab);
}

function close() {
    const o = document.getElementById('efcd-shop-overlay');
    if (o) { o.style.cssText += ';opacity:0;transition:opacity .2s'; setTimeout(() => o.remove(), 200); }
}

function _tab(tab) {
    _currentTab = tab;
    const tabMap = { themes:0, emoji:1, shiny:2, titles:3, request:4 };
    document.querySelectorAll('.shop-tab').forEach((t, i) => t.classList.toggle('active', i === tabMap[tab]));
    renderTab(tab);
}

function renderTab(tab) {
    const body = document.getElementById('shop-body');
    if (!body) return;
    const fns = { themes: renderThemes, emoji: renderEmoji, shiny: renderShiny, titles: renderTitles, request: renderRequest };
    Promise.resolve((fns[tab] || renderThemes)(body));
}

// ─────────────────────────────────────────────────────────────
//  TAB: THEMES
// ─────────────────────────────────────────────────────────────
function renderThemes(body) {
    const active = getActiveTheme();
    let html = `
        <div class="shop-section-hd">Site Themes · 7 days · Site stays fully readable ✅</div>
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;line-height:1.6;">
            Changes your site's colour accent — hero, header, buttons. Everything stays readable. Promise! 👌
        </div>
        <div class="shop-grid">`;
    THEMES.forEach(t => {
        const isActive = active?.id === t.id;
        const canAfford = _shopXP >= t.cost;
        html += `
        <div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyTheme('${t.id}')"
             style="border-top:3px solid ${t.preview};">
            <div class="theme-swatch" style="background:${t.preview};"></div>
            <div class="si-icon" style="background:${t.preview}22;border:1.5px solid ${t.preview}66;font-size:28px;">${t.icon}</div>
            <div class="si-name">${t.name}</div>
            <div class="si-desc">${t.desc}</div>
            <div class="si-footer">
                <div class="si-cost">${isActive ? '✓ Active' : `⚡ ${t.cost} XP`}</div>
                ${isActive ? '<div class="si-badge active">Active</div>' : `<div class="si-badge expires">${t.duration}d</div>`}
            </div>
        </div>`;
    });
    html += '</div>';
    if (active) {
        html += `<div style="margin-top:12px;text-align:center;">
            <button onclick="window.EFCD_Shop._removeTheme()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove theme</button>
        </div>`;
    }
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: EMOJI
// ─────────────────────────────────────────────────────────────
function renderEmoji(body) {
    const active = getActiveEmojiPack();
    let html = `
        <div class="shop-section-hd">Emoji Packs · 7 days</div>
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;line-height:1.6;">
            Transforms emojis across the whole site — including lesson pages, HUD, and modals! 🎉
        </div>
        <div class="shop-grid">`;
    EMOJI_PACKS.forEach(p => {
        const isActive = active?.id === p.id;
        const canAfford = _shopXP >= p.cost;
        const preview = Object.values(p.map).slice(0, 5).join(' ');
        html += `
        <div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyEmoji('${p.id}')">
            <div class="si-icon" style="background:rgba(255,255,255,.06);font-size:28px;">${p.icon}</div>
            <div class="si-name">${p.name}</div>
            <div class="si-desc">${p.desc}</div>
            <div style="font-size:16px;letter-spacing:3px;margin:2px 0;">${preview}</div>
            <div class="si-footer">
                <div class="si-cost">${isActive ? '✓ Active' : `⚡ ${p.cost} XP`}</div>
                ${isActive ? '<div class="si-badge active">Active</div>' : `<div class="si-badge expires">${p.duration}d</div>`}
            </div>
        </div>`;
    });
    html += '</div>';
    if (active) {
        html += `<div style="margin-top:12px;text-align:center;">
            <button onclick="window.EFCD_Shop._removeEmoji()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove emoji pack</button>
        </div>`;
    }
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: SHINY BADGES
// ─────────────────────────────────────────────────────────────
async function renderShiny(body) {
    const profile  = window.EFCD_Auth?.getCurrentUser();
    if (!profile) {
        body.innerHTML = `<div style="text-align:center;padding:40px 20px;color:rgba(255,255,255,.4);font-weight:800;">Log in to manage shiny badges ✨</div>`;
        return;
    }
    body.innerHTML = `<div style="text-align:center;padding:20px;color:rgba(255,255,255,.4);font-weight:800;">Loading your badges...</div>`;

    // ── FIX 1: Load shiny set from BOTH localStorage AND Supabase, then merge ──
    let shinySet = getShinyBadges();
    try {
        const { data: profileData } = await window.efcdSupabaseClient
            .from('profiles').select('shiny_badges').eq('id', profile.id).single();
        if (Array.isArray(profileData?.shiny_badges)) {
            profileData.shiny_badges.forEach(id => shinySet.add(id));
            // Keep localStorage in sync with Supabase truth
            localStorage.setItem(SK.shiny, JSON.stringify([...shinySet]));
        }
    } catch(e) { console.warn('Could not load shiny_badges from Supabase:', e); }

    const { data: lessons } = await window.efcdSupabaseClient
        .from('lessons')
        .select('lesson_link, lesson_level, badge_icon, badge_name, lesson_title')
        .eq('user_id', profile.id);

    const owned = (window.EFCD_Badges?.evaluate?.(profile, lessons || []) || []).filter(b => b.earned);

    if (!owned.length) {
        body.innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <div style="font-size:48px;margin-bottom:12px;">🔒</div>
                <div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:6px;">No badges yet!</div>
                <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.4);">Complete lessons to earn badges, then make them SHINY! ✨</div>
            </div>`;
        return;
    }

    const SHINY_COST = 200;
    let html = `
        <div class="shop-section-hd">Shiny Upgrades · Permanent · ⚡ ${SHINY_COST} XP each</div>
        <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;line-height:1.6;">
            Make your badge holographic — it shimmers and glows on your dashboard. Permanent upgrade, yours forever! ✨
        </div>
        <div class="shop-grid">`;

    owned.forEach(b => {
        const isShiny   = shinySet.has(b.id);
        const canAfford = _shopXP >= SHINY_COST;
        html += `
        <div class="shop-item ${isShiny?'owned':''} ${!canAfford&&!isShiny?'cant-afford':''}"
             onclick="window.EFCD_Shop._buyShiny('${b.id}','${b.name?.replace(/'/g,"\\'")}','${b.icon}')">
            <div class="si-icon ${isShiny?'shiny-badge-icon':''}"
                 style="${!isShiny ? `background:${b.color||'#333'}22;border:1.5px solid ${b.color||'#333'}44;` : ''}">
                <span>${b.icon}</span>
            </div>
            <div class="si-name">${b.name}</div>
            <div class="si-desc">${isShiny ? '✨ Already holographic and gorgeous!' : 'Tap to upgrade to holographic shimmer'}</div>
            <div class="si-footer">
                <div class="si-cost ${isShiny?'free':''}">${isShiny ? '✓ Shiny' : `⚡ ${SHINY_COST} XP`}</div>
                ${isShiny ? '<div class="si-badge owned">Upgraded ✨</div>' : '<div class="si-badge expires">Permanent</div>'}
            </div>
        </div>`;
    });
    html += '</div>';
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: TITLES  (FIX 4 — clear description + actual display)
// ─────────────────────────────────────────────────────────────
function renderTitles(body) {
    const currentTitle = getCustomTitle();
    let ownedTitles;
    try { ownedTitles = new Set(JSON.parse(localStorage.getItem(SK.owned) || '[]')); }
    catch { ownedTitles = new Set(); }

    let html = `
        <div class="shop-section-hd">Profile Titles · Permanent · Buy once, keep forever</div>
        <div style="background:rgba(255,200,0,.08);border:1.5px solid rgba(255,200,0,.2);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
            <div style="font-size:13px;font-weight:900;color:#FFC800;margin-bottom:4px;">📍 Where does my title show?</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);line-height:1.6;">
                Your title appears <strong style="color:rgba(255,255,255,.8);">next to your name on the leaderboard</strong> and in your <strong style="color:rgba(255,255,255,.8);">dashboard hero</strong>. 
                It's how other Cool Dudes know you mean business. 💪
            </div>
        </div>
        <div class="title-list">`;

    TITLES.forEach(t => {
        const isOwned    = ownedTitles.has(t.id);
        const isEquipped = currentTitle === t.id;
        const canAfford  = _shopXP >= t.cost;
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
                    : `<div class="ti-cost" style="${!canAfford?'color:#ff4b4b':''}">⚡ ${t.cost}</div>`
            }
        </div>`;
    });
    html += '</div>';
    if (currentTitle) {
        html += `<div style="margin-top:12px;text-align:center;">
            <button onclick="window.EFCD_Shop._removeTitle()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove title</button>
        </div>`;
    }
    body.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  TAB: LESSON REQUEST  (FIX 5 — real email + success msg)
// ─────────────────────────────────────────────────────────────
function renderRequest(body) {
    const cost      = 250;
    const canAfford = _shopXP >= cost;
    body.innerHTML = `
        <div class="shop-section-hd">Request a Lesson · ⚡ ${cost} XP</div>
        <div style="background:rgba(206,130,255,.08);border:1.5px solid rgba(206,130,255,.2);border-radius:12px;padding:14px;margin-bottom:16px;">
            <div style="font-size:13px;font-weight:900;color:#CE82FF;margin-bottom:4px;">📬 Goes straight to the teacher!</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);line-height:1.6;">
                Your request lands in Tony's inbox. Cool ideas with good reasons get made first. 
                Spend ${cost} XP to send — the more XP you burn, the more it shows you mean it! 🔥
            </div>
        </div>
        <div class="req-form">
            <div>
                <div class="req-label">Your topic idea ✏️</div>
                <input class="req-input" id="req-topic" placeholder="e.g. British pub culture, AI vocabulary, job interviews..." maxlength="100">
            </div>
            <div>
                <div class="req-label">Level &amp; why you want it (optional)</div>
                <textarea class="req-textarea" id="req-detail" placeholder="What level are you? Why this topic? Any specific vocabulary you need?" maxlength="400"></textarea>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,200,0,.08);border:1px solid rgba(255,200,0,.2);border-radius:10px;">
                <span style="font-size:13px;font-weight:800;color:rgba(255,255,255,.6);">Cost</span>
                <span style="font-size:16px;font-weight:900;color:#FFC800;">⚡ ${cost} XP</span>
            </div>
            <button class="req-submit" id="req-submit-btn" onclick="window.EFCD_Shop._submitRequest()" ${canAfford ? '' : 'disabled'}>
                ${canAfford ? '📬 Send to Tony!' : `⚡ Need ${cost - _shopXP} more XP`}
            </button>
        </div>`;
}

// ─────────────────────────────────────────────────────────────
//  PURCHASE HANDLERS
// ─────────────────────────────────────────────────────────────
async function _buyTheme(id) {
    const theme = THEMES.find(t => t.id === id);
    if (!theme || getActiveTheme()?.id === id) return;
    await _confirmPurchase(theme.icon, theme.name, theme.cost, `${theme.duration}-day colour accent`, async () => {
        if (!await spendXP(theme.cost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.theme, JSON.stringify({ id, expires: Date.now() + theme.duration * 864e5 }));
        applyActiveTheme();
        _shopXP = getXP();
        _showSuccess(theme.icon, `${theme.name} unlocked!`, 'Active for 7 days — looking fresh! 🎨');
        setTimeout(() => renderTab('themes'), 900);
    });
}

async function _buyEmoji(id) {
    const pack = EMOJI_PACKS.find(p => p.id === id);
    if (!pack || getActiveEmojiPack()?.id === id) return;
    await _confirmPurchase(pack.icon, pack.name, pack.cost, `${pack.duration}-day emoji swap`, async () => {
        if (!await spendXP(pack.cost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        localStorage.setItem(SK.emoji, JSON.stringify({ id, expires: Date.now() + pack.duration * 864e5 }));
        if (_emojiObserver) _emojiObserver.disconnect();
        applyActiveEmojiPack();
        _shopXP = getXP();
        _showSuccess(pack.icon, `${pack.name} activated!`, 'Emojis transformed everywhere for 7 days! ✨');
        setTimeout(() => renderTab('emoji'), 900);
    });
}

// ── FIX 1: _buyShiny accumulates — never replaces ────────────
async function _buyShiny(badgeId, badgeName, badgeIcon) {
    // Re-load from Supabase first to get the current truth
    let shinySet = getShinyBadges();
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (user) {
        try {
            const { data } = await window.efcdSupabaseClient
                .from('profiles').select('shiny_badges').eq('id', user.id).single();
            if (Array.isArray(data?.shiny_badges)) {
                data.shiny_badges.forEach(id => shinySet.add(id));
            }
        } catch(e) { console.warn('Could not fetch shiny_badges:', e); }
    }

    if (shinySet.has(badgeId)) {
        _showToast('Already shiny! ✨', 'success'); return;
    }
    const COST = 200;
    await _confirmPurchase('✨', `Shiny ${badgeName}`, COST, 'Permanent holographic upgrade', async () => {
        if (!await spendXP(COST)) { _showToast('Not enough XP! 😬', 'error'); return; }
        shinySet.add(badgeId);
        await saveShinyBadges(shinySet); // FIX: saves merged set to both localStorage + Supabase
        _shopXP = getXP();
        _showSuccess(badgeIcon, `${badgeName} is now SHINY!`, '✨ Holographic forever — check your dashboard!');
        setTimeout(() => renderTab('shiny'), 900);
    });
}

// ── FIX 4: _buyTitle — equip/unequip + inject into UI ────────
async function _buyTitle(titleId, titleName, titleIcon) {
    let ownedTitles;
    try { ownedTitles = new Set(JSON.parse(localStorage.getItem(SK.owned) || '[]')); }
    catch { ownedTitles = new Set(); }

    if (ownedTitles.has(titleId)) {
        // Already owned — just equip or unequip
        if (getCustomTitle() === titleId) {
            localStorage.removeItem(SK.title);
            _showToast('Title removed', 'success');
        } else {
            localStorage.setItem(SK.title, titleId);
            _injectTitleIntoPage(titleIcon, titleName);
            _showToast(`${titleIcon} "${titleName}" equipped!`, 'success');
        }
        _updateBalanceDisplay();
        renderTab('titles');
        return;
    }

    const title = TITLES.find(t => t.id === titleId);
    if (!title) return;
    await _confirmPurchase(titleIcon, titleName, title.cost, 'Permanent title — shows on leaderboard + dashboard', async () => {
        if (!await spendXP(title.cost)) { _showToast('Not enough XP! 😬', 'error'); return; }
        ownedTitles.add(titleId);
        localStorage.setItem(SK.owned, JSON.stringify([...ownedTitles]));
        localStorage.setItem(SK.title, titleId);
        _shopXP = getXP();
        _injectTitleIntoPage(titleIcon, titleName);
        _showSuccess(titleIcon, `"${titleName}" unlocked!`, 'Now showing on your dashboard + leaderboard! 🏷️');
        setTimeout(() => renderTab('titles'), 900);
    });
}

// ── FIX 4: Inject title badge into page UI immediately ───────
function _injectTitleIntoPage(icon, name) {
    // Remove any existing title badge
    document.querySelectorAll('.efcd-title-badge').forEach(el => el.remove());
    const badge = `<span class="efcd-title-badge">${icon} ${name}</span>`;
    // Dashboard hero name
    const dhName = document.querySelector('.dh-name, .uname');
    if (dhName) dhName.insertAdjacentHTML('afterend', badge);
}

// ── FIX 5: _submitRequest — Supabase + mailto fallback ───────
async function _submitRequest() {
    const topic  = document.getElementById('req-topic')?.value?.trim();
    const detail = document.getElementById('req-detail')?.value?.trim();
    if (!topic) { _showToast('Please enter a topic first! ✏️', 'error'); return; }
    const user = window.EFCD_Auth?.getCurrentUser();
    if (!user) { _showToast('Please log in first!', 'error'); return; }

    await _confirmPurchase('📬', 'Lesson Request', 250, 'Sent directly to Tony!', async () => {
        if (!await spendXP(250)) { _showToast('Not enough XP! 😬', 'error'); return; }

        // Try Supabase first
        let supabaseOk = false;
        try {
            const { error } = await window.efcdSupabaseClient.from('lesson_requests').insert([{
                user_id:    user.id,
                user_name:  user.name || 'Anonymous Cool Dude',
                user_email: user.email || '',
                topic,
                detail:     detail || null,
                created_at: new Date().toISOString(),
            }]);
            if (!error) supabaseOk = true;
        } catch(e) { console.warn('lesson_requests insert failed:', e.message); }

        // mailto fallback — fires regardless so Tony always gets it
        const subject = encodeURIComponent(`EFCD Lesson Request: ${topic}`);
        const body    = encodeURIComponent(
            `New lesson request from ${user.name || 'Anonymous'} (${user.email || 'no email'})\n\n`
            + `TOPIC: ${topic}\n\n`
            + `DETAILS: ${detail || 'None provided'}\n\n`
            + `---\nSent via EFCD XP Shop\n`
            + `Supabase saved: ${supabaseOk ? 'yes' : 'no (table may not exist yet)'}`
        );
        // Open in background tab so shop stays open
        const link = document.createElement('a');
        link.href   = `mailto:tonyfrombrighton@gmail.com?subject=${subject}&body=${body}`;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 1000);

        _shopXP = getXP();
        _showSuccess('📬', "Request sent to Tony!", "He'll review it and the best ideas get made. Fingers crossed! 🤞");
        setTimeout(() => renderTab('request'), 1400);
    });
}

// ─────────────────────────────────────────────────────────────
//  REMOVE HANDLERS
// ─────────────────────────────────────────────────────────────
function _removeTheme() {
    localStorage.removeItem(SK.theme);
    const el = document.getElementById('efcd-theme-override');
    if (el) el.remove();
    renderTab('themes');
    _showToast('Theme removed — back to default', 'success');
}
function _removeEmoji() {
    localStorage.removeItem(SK.emoji);
    if (_emojiObserver) { _emojiObserver.disconnect(); _emojiObserver = null; }
    renderTab('emoji');
    _showToast('Emoji pack removed — refresh to reset emojis', 'success');
}
function _removeTitle() {
    localStorage.removeItem(SK.title);
    document.querySelectorAll('.efcd-title-badge').forEach(el => el.remove());
    renderTab('titles');
    _showToast('Title removed', 'success');
}

// ─────────────────────────────────────────────────────────────
//  CONFIRM DIALOG
// ─────────────────────────────────────────────────────────────
function _confirmPurchase(icon, name, cost, desc, onConfirm) {
    return new Promise(resolve => {
        const bg  = document.createElement('div');
        bg.className = 'shop-confirm-bg';
        const box = document.createElement('div');
        box.className = 'shop-confirm';
        box.innerHTML = `
            <div class="sc-icon">${icon}</div>
            <div class="sc-title">${name}</div>
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:6px;">${desc}</div>
            <div class="sc-cost">⚡ ${cost} XP</div>
            <div style="font-size:11px;color:rgba(255,255,255,.35);margin-bottom:8px;">Balance after: ${(_shopXP - cost).toLocaleString()} XP</div>
            <div class="sc-btns">
                <button class="sc-btn no"  id="sc-no">Cancel</button>
                <button class="sc-btn yes" id="sc-yes">Buy it! ⚡</button>
            </div>`;
        bg.appendChild(box);
        document.body.appendChild(bg);
        box.querySelector('#sc-yes').onclick = async () => { bg.remove(); await onConfirm(); _updateBalanceDisplay(); resolve(true); };
        box.querySelector('#sc-no').onclick  = () => { bg.remove(); resolve(false); };
        bg.addEventListener('click', e => { if (e.target === bg) { bg.remove(); resolve(false); } });
    });
}

// ─────────────────────────────────────────────────────────────
//  SUCCESS + TOAST
// ─────────────────────────────────────────────────────────────
function _showSuccess(icon, title, sub) {
    const el = document.createElement('div');
    el.className = 'shop-success';
    el.innerHTML = `<span class="shop-success-icon">${icon}</span><div class="shop-success-title">${title}</div><div class="shop-success-sub">${sub}</div>`;
    document.body.appendChild(el);
    if (typeof burst === 'function') burst(16);
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2200);
}

function _showToast(msg, type) {
    const t = document.getElementById('toast');
    if (t) {
        t.textContent = msg;
        t.className = `toast ${type} show`;
        setTimeout(() => t.classList.remove('show'), 3000);
    } else {
        const el = document.createElement('div');
        el.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${type==='error'?'#ff4b4b':'#58CC02'};color:#fff;padding:12px 20px;border-radius:10px;font-weight:900;font-size:14px;z-index:99999;`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2800);
    }
}

function _updateBalanceDisplay() {
    _shopXP = getXP();
    const el = document.getElementById('shop-bal-xp');
    if (el) el.textContent = `⚡ ${_shopXP.toLocaleString()} XP`;
}

// ─────────────────────────────────────────────────────────────
//  BOOT — apply on page load + inject shop button
// ─────────────────────────────────────────────────────────────
function applyActive() {
    applyActiveTheme();
    applyActiveEmojiPack();
    // FIX 4: Inject title into page on load if one is equipped
    const titleObj = getCustomTitleObj();
    if (titleObj) {
        const run = () => _injectTitleIntoPage(titleObj.icon, titleObj.name);
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 600));
        else setTimeout(run, 600);
    }
}

function injectShopButton() {
    injectShopCSS();
    const signout = document.querySelector('.btn-signout');
    if (signout && !document.querySelector('.btn-shop')) {
        const btn = document.createElement('button');
        btn.className = 'btn-shop';
        btn.innerHTML = '🛍️ Shop';
        btn.onclick   = () => open();
        signout.parentNode.insertBefore(btn, signout);
    }
    const headerXP = document.querySelector('.header-xp');
    if (headerXP && !document.querySelector('.btn-shop')) {
        const btn = document.createElement('button');
        btn.className = 'btn-shop';
        btn.innerHTML = '🛍️';
        btn.title     = 'XP Shop';
        btn.onclick   = () => open();
        headerXP.prepend(btn);
    }
}

window.EFCD_Shop = {
    open, close, applyActive, injectShopButton,
    getShinyBadges, getCustomTitle, getCustomTitleObj, getActiveTheme, getActiveEmojiPack,
    _tab, _buyTheme, _buyEmoji, _buyShiny, _buyTitle, _submitRequest,
    _removeTheme, _removeEmoji, _removeTitle,
};

applyActive();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(injectShopButton, 500));
} else {
    setTimeout(injectShopButton, 500);
}

console.log('🛍️ EFCD XP Shop v2.0 loaded');
