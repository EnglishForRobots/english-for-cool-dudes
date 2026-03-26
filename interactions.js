/**
 * interactions.js — EFCD micro-interactions v3
 * Bigger. More impact. Centre-screen triumph moment.
 *
 * Public API:
 *  EFCD_FX.correct(buttonEl)
 *  EFCD_FX.wrong(buttonEl)
 *  EFCD_FX.combo(n)
 *  EFCD_FX.comboBreak()
 *  EFCD_FX.attachCombo(parentEl)
 *  EFCD_FX.reset()
 *  EFCD_FX.toast(icon, text)          — top-centre notification pill
 *  EFCD_FX.milestone(icon, title, msg, color, shadow) — centre-screen celebration card
 */

'use strict';

(function(){

function injectCSS(){
    if(document.getElementById('efcd-fx-styles')) return;
    const s = document.createElement('style');
    s.id = 'efcd-fx-styles';
    s.textContent = [

/* EDGE FLASH */
'@keyframes efcd-flash-green { 0%{opacity:1} 100%{opacity:0} }',
'@keyframes efcd-flash-red   { 0%{opacity:1} 100%{opacity:0} }',
'.efcd-edge-flash { position:fixed; inset:0; pointer-events:none; z-index:8800; opacity:0; }',
'.efcd-edge-flash.green { box-shadow:inset 0 0 120px 40px rgba(88,204,2,.55); animation:efcd-flash-green .55s ease-out forwards; }',
'.efcd-edge-flash.red   { box-shadow:inset 0 0 120px 40px rgba(255,75,75,.5);  animation:efcd-flash-red   .45s ease-out forwards; }',

/* BUTTON ANIMATIONS */
'@keyframes efcd-pop  { 0%{transform:scale(1)} 35%{transform:scale(1.08)} 65%{transform:scale(.96)} 100%{transform:scale(1)} }',
'@keyframes efcd-thud { 0%,100%{transform:scale(1)} 30%{transform:scale(.91)} 65%{transform:scale(1.02)} }',
'.efcd-pop  { animation:efcd-pop  .35s cubic-bezier(.175,.885,.32,1.275) both !important; }',
'.efcd-thud { animation:efcd-thud .3s ease both !important; }',

/* SHIMMER */
'@keyframes efcd-shimmer { 0%{left:-100%;opacity:0} 8%{opacity:1} 100%{left:150%;opacity:0} }',
'.efcd-shimmer-host { position:relative; overflow:hidden; }',
'.efcd-shimmer-sweep { position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(to right,transparent,rgba(255,255,255,.6),transparent); transform:skewX(-18deg); pointer-events:none; animation:efcd-shimmer .5s ease-out forwards; }',

/* WORD BURST — CORRECT */
'@keyframes efcd-word-slam {',
'  0%   { opacity:0; transform:translateX(-50%) translateY(30px) scale(.45); filter:blur(6px); }',
'  18%  { opacity:1; transform:translateX(-50%) translateY(-8px) scale(1.14); filter:blur(0); }',
'  30%  { transform:translateX(-50%) translateY(0) scale(1); }',
'  68%  { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }',
'  100% { opacity:0; transform:translateX(-50%) translateY(-55px) scale(.82); filter:blur(4px); }',
'}',
'@keyframes efcd-glitter {',
'  0%,100% { text-shadow:0 0 0 transparent; }',
'  20%  { text-shadow: 0 0 32px rgba(255,200,0,1), 0 0 64px rgba(255,200,0,.6), 4px -4px 22px rgba(88,204,2,.9); }',
'  45%  { text-shadow: -3px 0 32px rgba(28,176,246,1), 0 4px 26px rgba(255,200,0,.9), 0 0 55px rgba(88,204,2,.5); }',
'  70%  { text-shadow: 3px 3px 28px rgba(206,130,255,1), -2px -2px 20px rgba(255,200,0,.8), 0 0 45px rgba(28,176,246,.5); }',
'}',
'.efcd-word-burst { position:fixed; pointer-events:none; z-index:9100; font-family:"Nunito",system-ui,sans-serif; font-weight:900; font-size:clamp(44px,6vw,74px); letter-spacing:-2px; color:#fff; text-shadow:0 4px 20px rgba(0,0,0,.4); animation:efcd-word-slam 1.15s cubic-bezier(.23,1,.32,1) forwards, efcd-glitter 1.15s ease-out forwards; white-space:nowrap; transform-origin:center center; }',

/* WORD BURST — WRONG */
'@keyframes efcd-word-wrong {',
'  0%   { opacity:0; transform:translateX(-50%) scale(.55) rotate(-5deg); filter:blur(4px); }',
'  16%  { opacity:1; transform:translateX(-50%) scale(1.06) rotate(1.5deg); filter:blur(0); }',
'  30%  { transform:translateX(-50%) scale(1) rotate(0); }',
'  65%  { opacity:.95; transform:translateX(-50%) scale(1) rotate(0); }',
'  100% { opacity:0; transform:translateX(-50%) translateY(-44px) scale(.78) rotate(-2deg); }',
'}',
'.efcd-word-burst.wrong { color:#FF4B4B; font-size:clamp(34px,5vw,58px); letter-spacing:-1px; text-shadow:0 4px 18px rgba(255,75,75,.55); animation:efcd-word-wrong .9s ease-out forwards; }',

/* BACKDROP */
'@keyframes efcd-backdrop-in { 0%{opacity:0;transform:translateX(-50%) scaleX(.2)} 20%{opacity:1;transform:translateX(-50%) scaleX(1.03)} 35%{transform:translateX(-50%) scaleX(1)} 70%{opacity:.8} 100%{opacity:0;transform:translateX(-50%) scaleX(.88)} }',
'.efcd-burst-backdrop { position:fixed; pointer-events:none; z-index:9099; height:96px; width:520px; max-width:88vw; background:rgba(0,0,0,.5); border-radius:99px; transform:translateX(-50%); animation:efcd-backdrop-in 1.15s cubic-bezier(.23,1,.32,1) forwards; }',

/* TOAST — top-centre pill */
'@keyframes efcd-toast-in  { from{opacity:0;transform:translateX(-50%) translateY(-20px) scale(.88)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }',
'@keyframes efcd-toast-out { from{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} to{opacity:0;transform:translateX(-50%) translateY(-16px) scale(.9)} }',
'.efcd-toast { position:fixed; top:72px; left:50%; transform:translateX(-50%); z-index:9200; display:flex; align-items:center; gap:10px; background:#fff; border:2px solid #CECECE; border-bottom:4px solid #CECECE; border-left:4px solid #58CC02; border-radius:16px; padding:12px 20px; box-shadow:0 6px 24px rgba(0,0,0,.12); font-family:"Nunito",system-ui,sans-serif; white-space:nowrap; animation:efcd-toast-in .35s cubic-bezier(.175,.885,.32,1.275) both; }',
'.efcd-toast.out { animation:efcd-toast-out .28s ease both; }',
'.efcd-toast-icon { font-size:22px; flex-shrink:0; }',
'.efcd-toast-text { font-size:14px; font-weight:900; color:#111827; }',

/* MILESTONE — centre-screen card */
'@keyframes efcd-ms-overlay-in  { from{opacity:0} to{opacity:1} }',
'@keyframes efcd-ms-overlay-out { from{opacity:1} to{opacity:0} }',
'@keyframes efcd-ms-card-in  { from{opacity:0;transform:translateX(-50%) translateY(-50%) scale(.78)} to{opacity:1;transform:translateX(-50%) translateY(-50%) scale(1)} }',
'@keyframes efcd-ms-card-out { from{opacity:1;transform:translateX(-50%) translateY(-50%) scale(1)} to{opacity:0;transform:translateX(-50%) translateY(-50%) scale(.84)} }',
'.efcd-ms-overlay { position:fixed; inset:0; z-index:9300; background:rgba(0,0,0,.72); cursor:pointer; animation:efcd-ms-overlay-in .25s ease both; }',
'.efcd-ms-overlay.out { animation:efcd-ms-overlay-out .25s ease both; }',
'.efcd-ms-card { position:fixed; top:50%; left:50%; transform:translateX(-50%) translateY(-50%); z-index:9301; background:#fff; border-radius:28px; padding:44px 40px 36px; text-align:center; max-width:420px; width:calc(100vw - 48px); pointer-events:none; animation:efcd-ms-card-in .38s cubic-bezier(.175,.885,.32,1.275) both; }',
'.efcd-ms-card.out { animation:efcd-ms-card-out .25s ease both; pointer-events:none; }',
'.efcd-ms-emoji { font-size:64px; line-height:1; display:block; margin-bottom:16px; }',
'.efcd-ms-title { font-size:clamp(28px,6vw,48px); font-weight:900; line-height:1.1; letter-spacing:-1.5px; margin-bottom:12px; }',
'.efcd-ms-msg   { font-size:clamp(14px,2.5vw,17px); font-weight:700; color:#4B4B4B; line-height:1.55; }',
'.efcd-ms-tap   { font-size:12px; font-weight:900; color:#AFAFAF; text-transform:uppercase; letter-spacing:1.5px; margin-top:20px; display:block; }',

/* COMBO */
'@keyframes efcd-combo-in    { from{opacity:0;transform:scale(.65) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }',
'@keyframes efcd-combo-tick  { 0%{transform:scale(1)} 40%{transform:scale(1.22)} 100%{transform:scale(1)} }',
'@keyframes efcd-combo-crack { 0%,100%{transform:translateX(0) rotate(0)} 20%{transform:translateX(-7px) rotate(-2deg)} 40%{transform:translateX(7px) rotate(2deg)} 60%{transform:translateX(-4px) rotate(-1deg)} 80%{transform:translateX(4px) rotate(1deg)} }',
'@keyframes efcd-combo-out   { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.5) translateY(8px)} }',
'@keyframes efcd-glow-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(255,200,0,0)} 50%{box-shadow:0 0 28px 6px rgba(255,200,0,.6)} }',
'@keyframes efcd-hot-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(255,75,75,0)} 50%{box-shadow:0 0 32px 8px rgba(255,150,0,.65)} }',
'.efcd-combo-wrap { display:flex; align-items:center; justify-content:center; min-height:44px; margin-bottom:12px; font-family:"Nunito",system-ui,sans-serif; }',
'.efcd-combo-badge { display:inline-flex; align-items:center; gap:10px; padding:8px 22px; border-radius:99px; font-size:15px; font-weight:900; letter-spacing:-.2px; border:2px solid; border-bottom:4px solid; animation:efcd-combo-in .35s cubic-bezier(.175,.885,.32,1.275) both; user-select:none; cursor:default; }',
'.efcd-combo-badge.state-1 { background:rgba(28,176,246,.1);  border-color:rgba(28,176,246,.35); border-bottom-color:rgba(28,176,246,.5);  color:#1899D6; }',
'.efcd-combo-badge.state-2 { background:rgba(88,204,2,.12);   border-color:rgba(88,204,2,.4);    border-bottom-color:rgba(88,167,0,.55);   color:#58A700; }',
'.efcd-combo-badge.state-3 { background:rgba(255,200,0,.16);  border-color:rgba(255,200,0,.55);  border-bottom-color:rgba(229,180,0,.7);   color:#a07800; animation:efcd-combo-in .35s cubic-bezier(.175,.885,.32,1.275) both, efcd-glow-pulse 1.5s ease-in-out infinite .35s; }',
'.efcd-combo-badge.state-4 { background:linear-gradient(135deg,rgba(255,100,0,.14),rgba(255,75,75,.12)); border-color:rgba(255,120,0,.55); border-bottom-color:rgba(220,80,0,.7); color:#cc4400; animation:efcd-combo-in .35s cubic-bezier(.175,.885,.32,1.275) both, efcd-hot-pulse 1.1s ease-in-out infinite .35s; }',
'.efcd-combo-badge.tick  { animation:efcd-combo-tick  .25s cubic-bezier(.175,.885,.32,1.275) both !important; }',
'.efcd-combo-badge.crack { animation:efcd-combo-crack .38s ease both !important; }',
'.efcd-combo-badge.out   { animation:efcd-combo-out   .26s ease both !important; }',
'.efcd-combo-label { font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; opacity:.75; }',
'.efcd-combo-num   { font-size:22px; font-weight:900; line-height:1; min-width:22px; text-align:center; }'

    ].join('\n');
    document.head.appendChild(s);
}

// ── WORD POOLS ────────────────────────────────────────────
const CORRECT_WORDS = ['YES!','NICE!','BOOM!','SPOT ON!','GOT IT!','PERFECT!','NAILED IT!','CORRECT!','BRILLIANT!','GREAT!'];
const WRONG_WORDS   = ['NOT QUITE!','ALMOST!','TRY AGAIN!','NEARLY!'];
let _lastCorrectWord = '';
function _pickCorrect(){
    const pool = CORRECT_WORDS.filter(w => w !== _lastCorrectWord);
    const w = pool[Math.floor(Math.random() * pool.length)];
    _lastCorrectWord = w; return w;
}

// ── WORD BURST ────────────────────────────────────────────
function _wordBurst(text, isCorrect){
    const x = window.innerWidth  / 2;
    const y = window.innerHeight * 0.40;
    if(isCorrect){
        const bg = document.createElement('div');
        bg.className = 'efcd-burst-backdrop';
        bg.style.left = x + 'px';
        bg.style.top  = (y - 12) + 'px';
        document.body.appendChild(bg);
        setTimeout(() => bg.remove(), 1300);
    }
    const el = document.createElement('div');
    el.className = 'efcd-word-burst' + (isCorrect ? '' : ' wrong');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
}

// ── EDGE FLASH ────────────────────────────────────────────
function _edgeFlash(type){
    const el = document.createElement('div');
    el.className = 'efcd-edge-flash ' + type;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
}

// ── PUBLIC: CORRECT ───────────────────────────────────────
function correct(btnEl){
    _edgeFlash('green');
    if(btnEl){
        btnEl.classList.remove('efcd-pop');
        void btnEl.offsetWidth;
        btnEl.classList.add('efcd-pop','efcd-shimmer-host');
        const sweep = document.createElement('span');
        sweep.className = 'efcd-shimmer-sweep';
        btnEl.appendChild(sweep);
        setTimeout(() => sweep.remove(), 600);
    }
    _wordBurst(_pickCorrect(), true);
}

// ── PUBLIC: WRONG ─────────────────────────────────────────
function wrong(btnEl){
    _edgeFlash('red');
    if(btnEl){
        btnEl.classList.remove('efcd-thud');
        void btnEl.offsetWidth;
        btnEl.classList.add('efcd-thud');
    }
    _wordBurst(WRONG_WORDS[Math.floor(Math.random() * WRONG_WORDS.length)], false);
}

// ── PUBLIC: TOAST — top-centre notification ───────────────
// Replaces the old badge-wrap system. Call instead of toast() in lessons.
// EFCD_FX.toast('🔥', 'Section done! +15 XP')
function toast(icon, text){
    // Remove any existing toast first
    document.querySelector('.efcd-toast')?.remove();
    const el = document.createElement('div');
    el.className = 'efcd-toast';
    el.innerHTML =
        '<span class="efcd-toast-icon">' + icon + '</span>' +
        '<span class="efcd-toast-text">' + text + '</span>';
    document.body.appendChild(el);
    // Auto-dismiss after 4s
    const dismiss = () => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 320);
    };
    setTimeout(dismiss, 4000);
    el.addEventListener('click', dismiss);
}

// ── PUBLIC: MILESTONE — centre-screen celebration card ────
// For streak moments, section completions, combo milestones.
// EFCD_FX.milestone('🔥', '5 Combo!', 'You are on fire!', '#FF9600', '#E07800')
// color/shadow are the card's border colour — defaults to green if omitted.
function milestone(icon, title, msg, color, shadow){
    color  = color  || '#58CC02';
    shadow = shadow || '#58A700';
    // Remove any existing milestone
    document.querySelector('.efcd-ms-overlay')?.remove();
    document.querySelector('.efcd-ms-card')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'efcd-ms-overlay';

    const card = document.createElement('div');
    card.className = 'efcd-ms-card';
    card.style.border = '3px solid ' + color;
    card.style.borderBottom = '8px solid ' + shadow;
    card.style.boxShadow = '0 24px 80px rgba(0,0,0,.3), 0 0 0 1px ' + color + '22';
    card.innerHTML =
        '<span class="efcd-ms-emoji">' + icon + '</span>' +
        '<div class="efcd-ms-title" style="color:' + shadow + '">' + title + '</div>' +
        '<div class="efcd-ms-msg">' + msg + '</div>' +
        '<span class="efcd-ms-tap">Tap to continue</span>';

    document.body.appendChild(overlay);
    document.body.appendChild(card);

    const dismiss = () => {
        overlay.classList.add('out');
        card.classList.add('out');
        setTimeout(() => { overlay.remove(); card.remove(); }, 280);
    };
    setTimeout(dismiss, 3200);
    overlay.addEventListener('click', dismiss);
    card.style.pointerEvents = 'auto';
    card.addEventListener('click', dismiss);
}

// ── COMBO COUNTER ─────────────────────────────────────────
let _comboWrap=null, _comboBadge=null, _comboCount=0;
const COMBO_LABELS=[
    {min:8, state:'state-4', label:'ON FIRE'},
    {min:5, state:'state-3', label:'HOT STREAK'},
    {min:3, state:'state-2', label:'COMBO'},
    {min:0, state:'state-1', label:'COMBO'},
];
function _getConfig(n){ return COMBO_LABELS.find(c => n >= c.min); }

function attachCombo(parentEl){
    if(!parentEl) return;
    const old = parentEl.querySelector('.efcd-combo-wrap');
    if(old) old.remove();
    _comboWrap = document.createElement('div');
    _comboWrap.className = 'efcd-combo-wrap';
    _comboBadge = null; _comboCount = 0;
    parentEl.prepend(_comboWrap);
}

function combo(n){
    _comboCount = n;
    if(n < 3){
        if(_comboBadge){
            _comboBadge.classList.add('out');
            const b = _comboBadge;
            setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 280);
        }
        return;
    }
    if(!_comboWrap) return;
    const cfg = _getConfig(n);
    if(!_comboBadge){
        _comboBadge = document.createElement('div');
        _comboBadge.className = 'efcd-combo-badge ' + cfg.state;
        _comboBadge.innerHTML =
            '<span class="efcd-combo-label">' + cfg.label + '</span>' +
            '<span class="efcd-combo-num">'   + n          + '</span>';
        _comboWrap.appendChild(_comboBadge);
    } else {
        _comboBadge.className = 'efcd-combo-badge ' + cfg.state;
        _comboBadge.querySelector('.efcd-combo-label').textContent = cfg.label;
        _comboBadge.querySelector('.efcd-combo-num').textContent   = n;
        _comboBadge.classList.remove('tick');
        void _comboBadge.offsetWidth;
        _comboBadge.classList.add('tick');
    }
}

function comboBreak(){
    _comboCount = 0;
    if(!_comboBadge) return;
    _comboBadge.classList.remove('tick','state-1','state-2','state-3','state-4');
    void _comboBadge.offsetWidth;
    _comboBadge.classList.add('crack');
    const b = _comboBadge;
    setTimeout(() => {
        b.classList.add('out');
        setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 280);
    }, 400);
}

function reset(){ _comboCount=0; _comboBadge=null; _comboWrap=null; }

// ── INIT ──────────────────────────────────────────────────
injectCSS();
window.EFCD_FX = { correct, wrong, combo, comboBreak, attachCombo, reset, toast, milestone };
console.log('⚡ EFCD_FX v3 — toast + milestone system');

})();
