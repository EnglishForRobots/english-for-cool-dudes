// ═══════════════════════════════════════════════════════════════
// EFCD XP SHOP — xp-shop.js  [FIXED]
// Spend XP on cosmetic upgrades: shiny badges, site themes,
// emoji packs, custom titles, lesson requests.
// FIXES:
//   1. renderRequest() syntax error — broken template literal with
//      unescaped quotes in disabled attribute has been rewritten cleanly
//   2. getShinyBadges() now always returns a Set (never undefined/null)
//      so calling .has() on the result is always safe
// ═══════════════════════════════════════════════════════════════
'use strict';

const SK = {
    shiny:  'efcd_shiny_badges',
    theme:  'efcd_active_theme',
    emoji:  'efcd_emoji_pack',
    title:  'efcd_custom_title',
};

const THEMES = [
    { id:'night_owl',    name:'Night Owl',        icon:'🦉', cost:150, duration:7, preview:'#1a1a2e', desc:'Dark mode for the late-night learner', css:`:root{--bg:#0f0f1a!important;--white:#1a1a2e!important;--border:#2a2a3e!important;--border-heavy:#3a3a5e!important;--ink:#c8d0e0!important;--ink-bold:#e8eaf0!important;--ink-3:#6b7280!important}body{background:#0f0f1a!important}.chunky-card,.stat-card,.chart-card,.lesson-card,.grammar-item,.quest-card,.completion-card,.lb-row,.ach-badge{background:#1a1a2e!important}.header{background:#0f0f1a!important;border-bottom-color:#3a3a5e!important}` },
    { id:'gold_vip',     name:'Gold VIP',         icon:'👑', cost:150, duration:7, preview:'#F59E0B', desc:"Everything glitters. Because you're worth it.", css:`:root{--blue:#F59E0B!important;--blue-shadow:#D97706!important;--green:#F59E0B!important;--green-shadow:#D97706!important}.header{border-bottom-color:#F59E0B!important;background:#FFFBEB!important}.dash-hero{background:linear-gradient(135deg,#F59E0B,#D97706)!important;border-color:#D97706!important}.stat-card::before{background:#F59E0B!important}.dh-xp-fill{background:#F59E0B!important}` },
    { id:'neon_max',     name:'Cool Dude MAX',    icon:'⚡', cost:150, duration:7, preview:'#00ff88', desc:'Neon cyberpunk energy. Turn it up to 11.', css:`:root{--blue:#00ff88!important;--blue-shadow:#00cc6a!important;--punch:#ff0080!important;--yellow:#ffe000!important;--bg:#050510!important;--white:#0d0d1f!important;--ink:#b0ffd0!important;--ink-bold:#e0fff0!important;--border:#002040!important;--border-heavy:#003060!important}body{background:#050510!important}.header{background:#0a0a20!important;border-bottom:2px solid #00ff88!important}.chunky-card,.stat-card,.lesson-card{background:#0d0d1f!important;border-color:#002040!important}.dash-hero{background:linear-gradient(135deg,#001a0a,#000d20)!important;border-color:#00ff88!important}.site-title,.dh-name{color:#00ff88!important}` },
    { id:'pancake_mode', name:'Pancake Mode 🥞', icon:'🥞', cost:100, duration:7, preview:'#F59E0B', desc:'Warm amber vibes. Lemon and sugar sold separately.', css:`:root{--bg:#FFFBEB!important;--blue:#D97706!important;--blue-shadow:#B45309!important}.header{border-bottom-color:#F59E0B!important;background:#FEF3C7!important}.dash-hero{background:linear-gradient(135deg,#F59E0B,#B45309)!important}.logo{background:#FEF3C7!important}` },
];

const EMOJI_PACKS = [
    { id:'cats',     name:'Cat Mode',     icon:'🐱', cost:100, duration:7, desc:'Everything becomes a cat. Meow.',                     map:{'😎':'😼','🔥':'🐱‍🔥','⚡':'✨','🏆':'🏅','📚':'📖','🎯':'🐾','🚀':'🐈','💎':'🐱','🌟':'⭐','💪':'🐾','🎉':'🎊'} },
    { id:'space',    name:'Space Mode',   icon:'🚀', cost:100, duration:7, desc:'One giant leap for vocabulary kind.',                  map:{'😎':'👨‍🚀','🔥':'☄️','⚡':'🌟','🏆':'🛸','📚':'🔭','🎯':'🪐','🚀':'🛸','💎':'🌙','🌟':'✨','💪':'👨‍🚀','🎉':'🎆'} },
    { id:'food',     name:'Food Mode',    icon:'🍕', cost:100, duration:7, desc:'Learning is delicious. Nom nom.',                     map:{'😎':'🍕','🔥':'🌶️','⚡':'☕','🏆':'🍰','📚':'🍱','🎯':'🎂','🚀':'🍔','💎':'🍣','🌟':'🌮','💪':'🥑','🎉':'🎂'} },
    { id:'medieval', name:'Medieval Mode',icon:'⚔️', cost:100, duration:7, desc:'Hark! Thy learning journey begins, noble scholar.',   map:{'😎':'🧙','🔥':'🐉','⚡':'⚔️','🏆':'🏰','📚':'📜','🎯':'🏹','🚀':'🗡️','💎':'👑','🌟':'⭐','💪':'🛡️','🎉':'🎺'} },
];

const TITLES = [
    {id:'grammar_wizard',    name:'Grammar Wizard',    icon:'🧙', cost:300},
    {id:'vocab_legend',      name:'Vocab Legend',       icon:'📚', cost:300},
    {id:'cool_dude_supreme', name:'Cool Dude Supreme',  icon:'😎', cost:500},
    {id:'pancake_flipper',   name:'Pancake Flipper',    icon:'🥞', cost:200},
    {id:'tax_terminator',    name:'Tax Terminator',     icon:'💰', cost:200},
    {id:'legal_eagle',       name:'Legal Eagle',        icon:'⚖️', cost:200},
    {id:'night_scholar',     name:'Night Scholar',      icon:'🌙', cost:250},
    {id:'speed_demon',       name:'Speed Demon',        icon:'⚡', cost:250},
    {id:'streak_machine',    name:'Streak Machine',     icon:'🔥', cost:350},
    {id:'english_legend',    name:'English Legend',     icon:'👑', cost:600},
];

// ── HELPERS ───────────────────────────────────────────────────
function getXP() { return window.EFCD_Auth?.getUserStats?.()?.xp || 0; }

async function spendXP(amount) {
    const auth = window.EFCD_Auth;
    if (!auth?.getCurrentUser) return false;
    const user = auth.getCurrentUser();
    if (!user) return false;
    const current = getXP();
    if (current < amount) return false;
    try {
        const {error} = await window.efcdSupabaseClient.from('profiles').update({xp: current - amount}).eq('id', user.id);
        if (error) throw error;
        if (auth.refreshUserData) await auth.refreshUserData();
        return true;
    } catch(e) { console.error('XP spend error:', e); return false; }
}

// ── FIX 2: getShinyBadges ALWAYS returns a Set ────────────────
function getShinyBadges() {
    try {
        const raw = localStorage.getItem(SK.shiny);
        const arr = JSON.parse(raw || '[]');
        return new Set(Array.isArray(arr) ? arr : []);
    } catch { return new Set(); }
}
function saveShinyBadges(set) {
    const arr = [...set];
    localStorage.setItem(SK.shiny, JSON.stringify(arr));
    // Sync to Supabase so dashboard reads it correctly
    const user = window.EFCD_Auth?.getCurrentUser?.();
    if (user && window.efcdSupabaseClient) {
        window.efcdSupabaseClient
            .from('profiles')
            .update({ shiny_badges: arr })
            .eq('id', user.id)
            .then(({ error }) => { if (error) console.warn('shiny_badges sync error:', error); });
    }
}

function getActiveTheme() {
    try { const d=JSON.parse(localStorage.getItem(SK.theme)); if (d&&d.expires>Date.now()) return d; } catch {}
    localStorage.removeItem(SK.theme); return null;
}
function getActiveEmojiPack() {
    try { const d=JSON.parse(localStorage.getItem(SK.emoji)); if (d&&d.expires>Date.now()) return d; } catch {}
    localStorage.removeItem(SK.emoji); return null;
}
function getCustomTitle() { return localStorage.getItem(SK.title) || null; }

function applyActiveTheme() {
    const active = getActiveTheme(); if (!active) return;
    const theme  = THEMES.find(t=>t.id===active.id); if (!theme) return;
    const style  = document.createElement('style');
    style.id = 'efcd-theme-override'; style.textContent = theme.css;
    document.head.appendChild(style);
}

function applyActiveEmojiPack() {
    const active = getActiveEmojiPack(); if (!active) return;
    const pack   = EMOJI_PACKS.find(p=>p.id===active.id); if (!pack) return;
    const map    = pack.map;
    const keys   = Object.keys(map);
    const regex  = new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
    function replaceInNode(node) {
        if (node.nodeType===3) { const o=node.textContent, r=o.replace(regex,m=>map[m]||m); if(r!==o) node.textContent=r; }
        else if (node.nodeType===1&&!['SCRIPT','STYLE'].includes(node.tagName)) node.childNodes.forEach(replaceInNode);
    }
    const run = () => {
        replaceInNode(document.body);
        new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(replaceInNode))).observe(document.body,{childList:true,subtree:true});
    };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
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
.si-icon{font-size:32px;line-height:1;width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:14px}
.si-name{font-size:13px;font-weight:900;color:#fff;line-height:1.2}
.si-desc{font-size:11px;font-weight:700;color:rgba(255,255,255,.45);line-height:1.4;flex:1}
.si-footer{display:flex;align-items:center;justify-content:space-between;margin-top:4px}
.si-cost{font-size:12px;font-weight:900;color:#FFC800;background:rgba(255,200,0,.12);border:1px solid rgba(255,200,0,.3);padding:3px 8px;border-radius:6px}
.si-cost.free{color:#58CC02;background:rgba(88,204,2,.1);border-color:rgba(88,204,2,.3)}
.si-badge{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:6px}
.si-badge.owned{background:rgba(88,204,2,.15);color:#58CC02}
.si-badge.active{background:rgba(255,200,0,.15);color:#FFC800}
.si-badge.expires{color:rgba(255,255,255,.4);font-size:9px}
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
.ti-name{font-size:14px;font-weight:900;color:#fff;flex:1}
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
    `;
    document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
//  RENDER SHOP
// ─────────────────────────────────────────────────────────────
let _currentTab = 'themes', _shopXP = 0;

function open(tab) {
    injectShopCSS(); _currentTab = tab || 'themes'; _shopXP = getXP();
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
                        <div><div class="shop-hd-title">XP Shop</div><div class="shop-hd-sub">Spend your XP on cool stuff</div></div>
                    </div>
                    <button class="shop-close" onclick="window.EFCD_Shop.close()">×</button>
                </div>
                <div class="shop-balance">
                    <div><div class="shop-bal-label">Your Balance</div><div class="shop-bal-sub">earned through lessons</div></div>
                    <div style="text-align:right"><div class="shop-bal-xp" id="shop-bal-xp">⚡ ${_shopXP.toLocaleString()} XP</div></div>
                </div>
                <div class="shop-tabs">
                    <button class="shop-tab ${_currentTab==='themes'?'active':''}"  onclick="window.EFCD_Shop._tab('themes')">🎨 Themes</button>
                    <button class="shop-tab ${_currentTab==='emoji'?'active':''}"   onclick="window.EFCD_Shop._tab('emoji')">😎 Emoji</button>
                    <button class="shop-tab ${_currentTab==='shiny'?'active':''}"   onclick="window.EFCD_Shop._tab('shiny')">✨ Shiny</button>
                    <button class="shop-tab ${_currentTab==='titles'?'active':''}"  onclick="window.EFCD_Shop._tab('titles')">🏷️ Titles</button>
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
    const tabMap = {themes:0,emoji:1,shiny:2,titles:3,request:4};
    document.querySelectorAll('.shop-tab').forEach((t,i) => t.classList.toggle('active', i === tabMap[tab]));
    renderTab(tab);
}

function renderTab(tab) {
    const body = document.getElementById('shop-body');
    if (!body) return;
    ({themes:renderThemes,emoji:renderEmoji,shiny:renderShiny,titles:renderTitles,request:renderRequest}[tab]||renderThemes)(body);
}

function renderThemes(body) {
    const active = getActiveTheme();
    let html = '<div class="shop-section-hd">Site Themes · 7 days</div><div class="shop-grid">';
    THEMES.forEach(t => {
        const isActive = active?.id === t.id, canAfford = _shopXP >= t.cost;
        html += `<div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}" onclick="window.EFCD_Shop._buyTheme('${t.id}')" style="border-top:3px solid ${t.preview}40;">
            <div class="si-icon" style="background:${t.preview}22;border:1.5px solid ${t.preview}44;font-size:28px;">${t.icon}</div>
            <div class="si-name">${t.name}</div><div class="si-desc">${t.desc}</div>
            <div class="si-footer"><div class="si-cost">${isActive?'✓ Active':`⚡ ${t.cost} XP`}</div>${isActive?'<div class="si-badge active">Active</div>':`<div class="si-badge expires">${t.duration}d</div>`}</div>
        </div>`;
    });
    html += '</div>';
    if (active) html += `<div style="margin-top:10px;text-align:center;"><button onclick="window.EFCD_Shop._removeTheme()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove theme</button></div>`;
    body.innerHTML = html;
}

function renderEmoji(body) {
    const active = getActiveEmojiPack();
    let html = '<div class="shop-section-hd">Emoji Packs · 7 days</div><div class="shop-grid">';
    EMOJI_PACKS.forEach(p => {
        const isActive = active?.id === p.id, canAfford = _shopXP >= p.cost;
        const preview  = Object.values(p.map).slice(0,4).join(' ');
        html += `<div class="shop-item ${isActive?'active-item':''} ${!canAfford&&!isActive?'cant-afford':''}" onclick="window.EFCD_Shop._buyEmoji('${p.id}')">
            <div class="si-icon" style="background:rgba(255,255,255,.06);font-size:28px;">${p.icon}</div>
            <div class="si-name">${p.name}</div><div class="si-desc">${p.desc}</div>
            <div style="font-size:18px;letter-spacing:2px;">${preview}</div>
            <div class="si-footer"><div class="si-cost">${isActive?'✓ Active':`⚡ ${p.cost} XP`}</div>${isActive?'<div class="si-badge active">Active</div>':`<div class="si-badge expires">${p.duration}d</div>`}</div>
        </div>`;
    });
    html += '</div>';
    if (active) html += `<div style="margin-top:10px;text-align:center;"><button onclick="window.EFCD_Shop._removeEmoji()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove emoji pack</button></div>`;
    body.innerHTML = html;
}

function renderShiny(body) {
    const profile  = window.EFCD_Auth?.getCurrentUser();
    const shinySet = getShinyBadges(); // always a Set
    if (!profile) { body.innerHTML = `<div style="text-align:center;padding:40px 20px;color:rgba(255,255,255,.4);font-weight:800;">Log in to manage shiny badges ✨</div>`; return; }
    const owned = (window.EFCD_Badges?.evaluate?.(profile, []) || []).filter(b => b.earned);
    if (!owned.length) { body.innerHTML = `<div style="text-align:center;padding:40px 20px;"><div style="font-size:48px;margin-bottom:12px;">🔒</div><div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:6px;">No badges yet!</div><div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.4);">Complete lessons to earn badges first.</div></div>`; return; }
    const SHINY_COST = 200;
    let html = `<div class="shop-section-hd">Shiny Upgrades · Permanent · ⚡ ${SHINY_COST} XP each</div><div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;">Permanent holographic upgrade — trade XP to make your badge shimmer.</div><div class="shop-grid">`;
    owned.forEach(b => {
        const isShiny = shinySet.has(b.id), canAfford = _shopXP >= SHINY_COST;
        html += `<div class="shop-item ${isShiny?'owned':''} ${!canAfford&&!isShiny?'cant-afford':''}" onclick="window.EFCD_Shop._buyShiny('${b.id}','${b.name}','${b.icon}')">
            <div class="si-icon ${isShiny?'shiny-badge-icon':''}" style="${!isShiny?`background:${b.color}22;border:1.5px solid ${b.color}44;`:''}"><span>${b.icon}</span></div>
            <div class="si-name">${b.name}</div><div class="si-desc">${isShiny?'✨ Already holographic!':'Upgrade to holographic shimmer'}</div>
            <div class="si-footer"><div class="si-cost ${isShiny?'free':''}">${isShiny?'✓ Shiny':`⚡ ${SHINY_COST} XP`}</div>${isShiny?'<div class="si-badge owned">Upgraded</div>':'<div class="si-badge expires">Permanent</div>'}</div>
        </div>`;
    });
    html += '</div>'; body.innerHTML = html;
}

function renderTitles(body) {
    const currentTitle = getCustomTitle();
    let ownedTitles; try { ownedTitles = new Set(JSON.parse(localStorage.getItem('efcd_owned_titles')||'[]')); } catch { ownedTitles = new Set(); }
    let html = `<div class="shop-section-hd">Profile Titles · Permanent</div><div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:12px;">Shown on the leaderboard. Buy once, keep forever.</div><div class="title-list">`;
    TITLES.forEach(t => {
        const isOwned = ownedTitles.has(t.id), isEquipped = currentTitle === t.id, canAfford = _shopXP >= t.cost;
        html += `<div class="title-item ${isEquipped?'equipped':''} ${isOwned&&!isEquipped?'owned':''}" onclick="window.EFCD_Shop._buyTitle('${t.id}','${t.name}','${t.icon}')">
            <div class="ti-icon">${t.icon}</div><div class="ti-name">${t.name}</div>
            ${isEquipped?`<div class="ti-eq">✓ Equipped</div>`:isOwned?`<div class="ti-eq" style="color:rgba(255,255,255,.4)">Tap to equip</div>`:`<div class="ti-cost" style="${!canAfford?'color:#ff4b4b':''}">⚡ ${t.cost}</div>`}
        </div>`;
    });
    html += '</div>';
    if (currentTitle) html += `<div style="margin-top:10px;text-align:center;"><button onclick="window.EFCD_Shop._removeTitle()" style="background:none;border:1px solid rgba(255,75,75,.3);border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:rgba(255,75,75,.6);cursor:pointer;font-family:inherit;">✕ Remove title</button></div>`;
    body.innerHTML = html;
}

// ── FIX 1: renderRequest — clean disabled attribute, no string escaping issues ──
function renderRequest(body) {
    const cost      = 250;
    const canAfford = _shopXP >= cost;
    body.innerHTML = `
    <div class="shop-section-hd">Request a Lesson · ⚡ ${cost} XP</div>
    <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:16px;line-height:1.6;">
        Got a topic you'd love? Spend ${cost} XP to send a request directly to the teacher.
        Cool ideas get priority! 🎯
    </div>
    <div class="req-form">
        <div>
            <div class="req-label">Your topic idea</div>
            <input class="req-input" id="req-topic" placeholder="e.g. British pub culture, AI vocabulary..." maxlength="100">
        </div>
        <div>
            <div class="req-label">Level &amp; reason (optional)</div>
            <textarea class="req-textarea" id="req-detail" placeholder="Why this topic? What level? Specific vocabulary?" maxlength="400"></textarea>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,200,0,.08);border:1px solid rgba(255,200,0,.2);border-radius:10px;">
            <span style="font-size:13px;font-weight:800;color:rgba(255,255,255,.6);">Cost</span>
            <span style="font-size:16px;font-weight:900;color:#FFC800;">⚡ ${cost} XP</span>
        </div>
        <button class="req-submit"
                id="req-submit-btn"
                onclick="window.EFCD_Shop._submitRequest()"
                ${canAfford ? '' : 'disabled'}>
            ${canAfford ? '📬 Send Request' : `⚡ Need ${cost - _shopXP} more XP`}
        </button>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
//  PURCHASE HANDLERS
// ─────────────────────────────────────────────────────────────
async function _buyTheme(id) {
    const theme = THEMES.find(t=>t.id===id); if (!theme||getActiveTheme()?.id===id) return;
    await _confirmPurchase(theme.icon, theme.name, theme.cost, `${theme.duration}-day unlock`, async () => {
        if (!await spendXP(theme.cost)) { _showToast('Not enough XP! 😬','error'); return; }
        localStorage.setItem(SK.theme, JSON.stringify({id, expires: Date.now()+theme.duration*864e5}));
        const old = document.getElementById('efcd-theme-override'); if (old) old.remove();
        const s = document.createElement('style'); s.id='efcd-theme-override'; s.textContent=theme.css; document.head.appendChild(s);
        _shopXP = getXP(); _showSuccess(theme.icon,`${theme.name} unlocked!`,'Active for 7 days 🎨');
        setTimeout(() => renderTab('themes'), 800);
    });
}

async function _buyEmoji(id) {
    const pack = EMOJI_PACKS.find(p=>p.id===id); if (!pack||getActiveEmojiPack()?.id===id) return;
    await _confirmPurchase(pack.icon, pack.name, pack.cost, `${pack.duration}-day unlock`, async () => {
        if (!await spendXP(pack.cost)) { _showToast('Not enough XP! 😬','error'); return; }
        localStorage.setItem(SK.emoji, JSON.stringify({id, expires: Date.now()+pack.duration*864e5}));
        applyActiveEmojiPack(); _shopXP = getXP();
        _showSuccess(pack.icon,`${pack.name} activated!`,'Emojis transformed for 7 days ✨');
        setTimeout(() => renderTab('emoji'), 800);
    });
}

async function _buyShiny(badgeId, badgeName, badgeIcon) {
    const shinySet = getShinyBadges(); // always a Set
    if (shinySet.has(badgeId)) return;
    const COST = 200;
    await _confirmPurchase('✨', `Shiny ${badgeName}`, COST, 'Permanent holographic upgrade', async () => {
        if (!await spendXP(COST)) { _showToast('Not enough XP! 😬','error'); return; }
        shinySet.add(badgeId); saveShinyBadges(shinySet); _shopXP = getXP();
        _showSuccess(badgeIcon, `${badgeName} is now SHINY!`, '✨ Holographic forever');
        setTimeout(() => renderTab('shiny'), 800);
    });
}

async function _buyTitle(titleId, titleName, titleIcon) {
    let ownedTitles; try { ownedTitles = new Set(JSON.parse(localStorage.getItem('efcd_owned_titles')||'[]')); } catch { ownedTitles = new Set(); }
    if (ownedTitles.has(titleId)) {
        if (getCustomTitle()===titleId) localStorage.removeItem(SK.title); else localStorage.setItem(SK.title, titleId);
        _updateBalanceDisplay(); renderTab('titles'); return;
    }
    const title = TITLES.find(t=>t.id===titleId); if (!title) return;
    await _confirmPurchase(titleIcon, titleName, title.cost, 'Permanent title', async () => {
        if (!await spendXP(title.cost)) { _showToast('Not enough XP! 😬','error'); return; }
        ownedTitles.add(titleId); localStorage.setItem('efcd_owned_titles', JSON.stringify([...ownedTitles]));
        localStorage.setItem(SK.title, titleId); _shopXP = getXP();
        _showSuccess(titleIcon, `"${titleName}" unlocked!`, 'Now equipped on your profile 🎉');
        setTimeout(() => renderTab('titles'), 800);
    });
}

async function _submitRequest() {
    const topic  = document.getElementById('req-topic')?.value?.trim();
    const detail = document.getElementById('req-detail')?.value?.trim();
    if (!topic) { _showToast('Please enter a topic! ✏️','error'); return; }
    const user = window.EFCD_Auth?.getCurrentUser();
    if (!user) { _showToast('Please log in first!','error'); return; }
    await _confirmPurchase('📬','Lesson Request',250,'Send to teacher', async () => {
        if (!await spendXP(250)) { _showToast('Not enough XP! 😬','error'); return; }
        try { await window.efcdSupabaseClient.from('lesson_requests').insert([{user_id:user.id,user_name:user.name||'Anonymous',topic,detail:detail||null,created_at:new Date().toISOString()}]); }
        catch(e) { console.warn('lesson_requests table may not exist yet:', e.message); }
        _shopXP = getXP(); _showSuccess('📬','Request sent!',"The teacher will review it. Fingers crossed! 🤞");
        setTimeout(() => renderTab('request'), 1200);
    });
}

function _removeTheme() { localStorage.removeItem(SK.theme); const o=document.getElementById('efcd-theme-override'); if(o) o.remove(); renderTab('themes'); _showToast('Theme removed','success'); }
function _removeEmoji() { localStorage.removeItem(SK.emoji); renderTab('emoji'); _showToast('Emoji pack removed — refresh to reset','success'); }
function _removeTitle() { localStorage.removeItem(SK.title); renderTab('titles'); _showToast('Title removed','success'); }

function _confirmPurchase(icon, name, cost, desc, onConfirm) {
    return new Promise(resolve => {
        const bg = document.createElement('div');
        bg.className = 'shop-confirm-bg';
        const box = document.createElement('div');
        box.className = 'shop-confirm';
        box.innerHTML = `<div class="sc-icon">${icon}</div><div class="sc-title">${name}</div><div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:6px;">${desc}</div><div class="sc-cost">⚡ ${cost} XP</div><div style="font-size:11px;color:rgba(255,255,255,.35);margin-bottom:8px;">Balance after: ${(_shopXP-cost).toLocaleString()} XP</div><div class="sc-btns"><button class="sc-btn no" id="sc-no">Cancel</button><button class="sc-btn yes" id="sc-yes">Buy it! ⚡</button></div>`;
        bg.appendChild(box); document.body.appendChild(bg);
        box.querySelector('#sc-yes').onclick = async () => { bg.remove(); await onConfirm(); _updateBalanceDisplay(); resolve(true); };
        box.querySelector('#sc-no').onclick  = () => { bg.remove(); resolve(false); };
        bg.addEventListener('click', e => { if (e.target===bg) { bg.remove(); resolve(false); } });
    });
}

function _showSuccess(icon, title, sub) {
    const el = document.createElement('div'); el.className = 'shop-success';
    el.innerHTML = `<span class="shop-success-icon">${icon}</span><div class="shop-success-title">${title}</div><div class="shop-success-sub">${sub}</div>`;
    document.body.appendChild(el);
    if (typeof burst === 'function') burst(16);
    setTimeout(() => { el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, 1800);
}

function _showToast(msg, type) {
    const t = document.getElementById('toast');
    if (t) { t.textContent=msg; t.className=`toast ${type} show`; setTimeout(()=>t.classList.remove('show'),3000); }
    else { const el=document.createElement('div'); el.style.cssText=`position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${type==='error'?'#ff4b4b':'#58CC02'};color:#fff;padding:12px 20px;border-radius:10px;font-weight:900;font-size:14px;z-index:99999;`; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2800); }
}

function _updateBalanceDisplay() {
    _shopXP = getXP();
    const el = document.getElementById('shop-bal-xp');
    if (el) el.textContent = `⚡ ${_shopXP.toLocaleString()} XP`;
}

function applyActive() { applyActiveTheme(); applyActiveEmojiPack(); }

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

window.EFCD_Shop = {
    open, close, applyActive, injectShopButton,
    getShinyBadges, getCustomTitle, getActiveTheme, getActiveEmojiPack,
    _tab, _buyTheme, _buyEmoji, _buyShiny, _buyTitle, _submitRequest,
    _removeTheme, _removeEmoji, _removeTitle,
};

applyActive();
if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(injectShopButton,500));
else setTimeout(injectShopButton, 500);

console.log('🛍️ EFCD XP Shop loaded');
