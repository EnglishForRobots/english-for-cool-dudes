/**
 * interactions.js — EFCD micro-interactions v2
 * Pure kinetic typography. No emoji figures. No sticky popups.
 * Everything animates in, delivers, and disappears cleanly.
 *
 * Public API:
 *  EFCD_FX.correct(buttonEl)     — call on correct answer
 *  EFCD_FX.wrong(buttonEl)       — call on wrong answer
 *  EFCD_FX.combo(n)              — call with current combo count
 *  EFCD_FX.comboBreak()          — call when combo resets
 *  EFCD_FX.attachCombo(parentEl) — inject combo counter into a container
 *  EFCD_FX.reset()               — reset combo display
 */

'use strict';

(function(){

// ── CSS ───────────────────────────────────────────────────
function injectCSS(){
    if(document.getElementById('efcd-fx-styles')) return;
    const s = document.createElement('style');
    s.id = 'efcd-fx-styles';
    s.textContent = `

/* ── SCREEN EDGE FLASH ── */
@keyframes efcd-flash-green {
    0%   { opacity:.6; } 100% { opacity:0; }
}
@keyframes efcd-flash-red {
    0%   { opacity:.5; } 100% { opacity:0; }
}
.efcd-edge-flash {
    position:fixed; inset:0; pointer-events:none; z-index:8800; opacity:0;
}
.efcd-edge-flash.green {
    box-shadow:inset 0 0 90px 24px rgba(88,204,2,.5);
    animation:efcd-flash-green .4s ease-out forwards;
}
.efcd-edge-flash.red {
    box-shadow:inset 0 0 90px 24px rgba(255,75,75,.45);
    animation:efcd-flash-red .38s ease-out forwards;
}

/* ── BUTTON POP ── */
@keyframes efcd-pop {
    0%   { transform:scale(1);    }
    35%  { transform:scale(1.06); }
    65%  { transform:scale(.97);  }
    100% { transform:scale(1);    }
}
@keyframes efcd-thud {
    0%,100% { transform:scale(1);   }
    30%     { transform:scale(.93); }
    65%     { transform:scale(1.02);}
}
.efcd-pop  { animation:efcd-pop  .32s cubic-bezier(.175,.885,.32,1.275) both !important; }
.efcd-thud { animation:efcd-thud .28s ease both !important; }

/* ── BUTTON SHIMMER ── */
@keyframes efcd-shimmer {
    0%   { left:-100%; opacity:0;  }
    8%   { opacity:1;              }
    100% { left:150%;  opacity:0;  }
}
.efcd-shimmer-host { position:relative; overflow:hidden; }
.efcd-shimmer-sweep {
    position:absolute; top:0; left:-100%;
    width:55%; height:100%;
    background:linear-gradient(to right,transparent,rgba(255,255,255,.5),transparent);
    transform:skewX(-18deg);
    pointer-events:none;
    animation:efcd-shimmer .48s ease-out forwards;
}

/* ── WORD BURST (floats up from button, glitters, fades) ── */
@keyframes efcd-word-up {
    0%   { opacity:0;   transform:translateX(-50%) translateY(0)    scale(.7); filter:blur(2px);  }
    15%  { opacity:1;   transform:translateX(-50%) translateY(-18px) scale(1.08); filter:blur(0); }
    60%  { opacity:1;   transform:translateX(-50%) translateY(-38px) scale(1);    filter:blur(0); }
    100% { opacity:0;   transform:translateX(-50%) translateY(-64px) scale(.9); filter:blur(1px); }
}
@keyframes efcd-glitter {
    0%,100% { text-shadow: 0 0 8px rgba(255,200,0,0); }
    25%  { text-shadow: 0 0 18px rgba(255,200,0,.9), 2px -2px 12px rgba(88,204,2,.7); }
    50%  { text-shadow: -2px 0 20px rgba(28,176,246,.8), 0 2px 14px rgba(255,200,0,.8); }
    75%  { text-shadow: 2px 2px 16px rgba(206,130,255,.9), -1px -1px 10px rgba(255,200,0,.6); }
}
.efcd-word-burst {
    position:fixed;
    left:0; top:0;
    pointer-events:none;
    z-index:9100;
    font-family:'Nunito',system-ui,sans-serif;
    font-weight:900;
    font-size:clamp(20px,5vw,28px);
    letter-spacing:-.5px;
    color:#fff;
    text-shadow:0 2px 8px rgba(0,0,0,.25);
    animation:efcd-word-up .9s ease-out forwards, efcd-glitter .9s ease-out forwards;
    white-space:nowrap;
    transform-origin:center bottom;
}

/* ── WRONG WORD BURST ── */
@keyframes efcd-word-wrong {
    0%   { opacity:0;   transform:translateX(-50%) translateY(0)    scale(.8); }
    15%  { opacity:1;   transform:translateX(-50%) translateY(-14px) scale(1.04); }
    60%  { opacity:.9;  transform:translateX(-50%) translateY(-28px) scale(1);   }
    100% { opacity:0;   transform:translateX(-50%) translateY(-50px) scale(.85); }
}
.efcd-word-burst.wrong {
    color:#FF4B4B;
    text-shadow:0 2px 8px rgba(255,75,75,.4);
    animation:efcd-word-wrong .7s ease-out forwards;
}

/* ── COMBO BADGE ── */
@keyframes efcd-combo-in {
    from { opacity:0; transform:scale(.65) translateY(8px); }
    to   { opacity:1; transform:scale(1)   translateY(0);   }
}
@keyframes efcd-combo-tick {
    0%   { transform:scale(1);    }
    40%  { transform:scale(1.16); }
    100% { transform:scale(1);    }
}
@keyframes efcd-combo-crack {
    0%,100% { transform:translateX(0) rotate(0);      }
    20%     { transform:translateX(-6px) rotate(-1deg); }
    40%     { transform:translateX(6px)  rotate(1deg);  }
    60%     { transform:translateX(-4px) rotate(-.5deg);}
    80%     { transform:translateX(3px)  rotate(.5deg); }
}
@keyframes efcd-combo-out {
    from { opacity:1; transform:scale(1);    }
    to   { opacity:0; transform:scale(.55) translateY(6px); }
}
@keyframes efcd-glow-pulse {
    0%,100% { box-shadow:0 0 0   0   rgba(255,200,0,0);    }
    50%     { box-shadow:0 0 22px 5px rgba(255,200,0,.5);   }
}
@keyframes efcd-hot-pulse {
    0%,100% { box-shadow:0 0 0   0   rgba(255,75,75,0);     }
    50%     { box-shadow:0 0 24px 6px rgba(255,150,0,.55);   }
}

.efcd-combo-wrap {
    display:flex; align-items:center; justify-content:center;
    min-height:40px; margin-bottom:10px;
    font-family:'Nunito',system-ui,sans-serif;
}
.efcd-combo-badge {
    display:inline-flex; align-items:center; gap:8px;
    padding:7px 18px; border-radius:99px;
    font-size:14px; font-weight:900; letter-spacing:-.2px;
    border:2px solid; border-bottom:3px solid;
    transition:background .2s, border-color .2s, color .2s;
    animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both;
    user-select:none; cursor:default;
}

/* combo states — text only, no emoji */
.efcd-combo-badge.state-1 {
    background:rgba(28,176,246,.1);
    border-color:rgba(28,176,246,.3); border-bottom-color:rgba(28,176,246,.45);
    color:#1899D6;
}
.efcd-combo-badge.state-2 {
    background:rgba(88,204,2,.1);
    border-color:rgba(88,204,2,.35); border-bottom-color:rgba(88,167,0,.5);
    color:#58A700;
    animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both;
}
.efcd-combo-badge.state-3 {
    background:rgba(255,200,0,.14);
    border-color:rgba(255,200,0,.5); border-bottom-color:rgba(229,180,0,.65);
    color:#a07800;
    animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both,
              efcd-glow-pulse 1.5s ease-in-out infinite .3s;
}
.efcd-combo-badge.state-4 {
    background:linear-gradient(135deg,rgba(255,100,0,.12),rgba(255,75,75,.1));
    border-color:rgba(255,120,0,.5); border-bottom-color:rgba(220,80,0,.65);
    color:#cc4400;
    animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both,
              efcd-hot-pulse 1.1s ease-in-out infinite .3s;
}

.efcd-combo-badge.tick {
    animation:efcd-combo-tick .22s cubic-bezier(.175,.885,.32,1.275) both !important;
}
.efcd-combo-badge.crack {
    animation:efcd-combo-crack .35s ease both !important;
}
.efcd-combo-badge.out {
    animation:efcd-combo-out .24s ease both !important;
}

.efcd-combo-label { font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; opacity:.75; }
.efcd-combo-num   { font-size:20px; font-weight:900; line-height:1; min-width:20px; text-align:center; }
    `;
    document.head.appendChild(s);
}

// ── WORD BURST POOL ───────────────────────────────────────
const CORRECT_WORDS = [
    'YES!', 'NICE!', 'BOOM!', 'SPOT ON!', 'GOT IT!',
    'PERFECT!', 'NAILED IT!', 'CORRECT!', 'BRILLIANT!', 'GREAT!'
];
const WRONG_WORDS = [
    'NOT QUITE', 'ALMOST!', 'TRY AGAIN', 'NEARLY!'
];
let _lastCorrectWord = '';
function _pickCorrect(){
    const pool = CORRECT_WORDS.filter(w => w !== _lastCorrectWord);
    const w = pool[Math.floor(Math.random() * pool.length)];
    _lastCorrectWord = w;
    return w;
}

function _wordBurst(text, x, y, isCorrect){
    const el = document.createElement('div');
    el.className = 'efcd-word-burst' + (isCorrect ? '' : ' wrong');
    el.textContent = text;
    // position: centred on x, starting at y
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

// ── EDGE FLASH ────────────────────────────────────────────
function _edgeFlash(type){
    const el = document.createElement('div');
    el.className = `efcd-edge-flash ${type}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 450);
}

// ── PUBLIC: CORRECT ───────────────────────────────────────
function correct(btnEl){
    _edgeFlash('green');
    if(!btnEl) return;
    // pop + shimmer on button
    btnEl.classList.remove('efcd-pop');
    void btnEl.offsetWidth;
    btnEl.classList.add('efcd-pop', 'efcd-shimmer-host');
    const sweep = document.createElement('span');
    sweep.className = 'efcd-shimmer-sweep';
    btnEl.appendChild(sweep);
    setTimeout(() => sweep.remove(), 550);
    // word burst above button
    const r = btnEl.getBoundingClientRect();
    _wordBurst(_pickCorrect(), r.left + r.width / 2, r.top - 8, true);
}

// ── PUBLIC: WRONG ─────────────────────────────────────────
function wrong(btnEl){
    _edgeFlash('red');
    if(!btnEl) return;
    btnEl.classList.remove('efcd-thud');
    void btnEl.offsetWidth;
    btnEl.classList.add('efcd-thud');
    const r = btnEl.getBoundingClientRect();
    _wordBurst(WRONG_WORDS[Math.floor(Math.random() * WRONG_WORDS.length)], r.left + r.width / 2, r.top - 4, false);
}

// ── COMBO COUNTER ─────────────────────────────────────────
let _comboWrap  = null;
let _comboBadge = null;
let _comboCount = 0;

const COMBO_LABELS = [
    { min:8, state:'state-4', label:'ON FIRE' },
    { min:5, state:'state-3', label:'HOT STREAK' },
    { min:3, state:'state-2', label:'COMBO' },
    { min:0, state:'state-1', label:'COMBO' },
];

function _getConfig(n){
    return COMBO_LABELS.find(c => n >= c.min);
}

function attachCombo(parentEl){
    if(!parentEl) return;
    const old = parentEl.querySelector('.efcd-combo-wrap');
    if(old) old.remove();
    _comboWrap  = document.createElement('div');
    _comboWrap.className = 'efcd-combo-wrap';
    _comboBadge = null;
    _comboCount = 0;
    parentEl.prepend(_comboWrap);
}

function combo(n){
    _comboCount = n;
    if(n < 3){
        if(_comboBadge){
            _comboBadge.classList.add('out');
            const b = _comboBadge;
            setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 260);
        }
        return;
    }
    if(!_comboWrap) return;
    const cfg = _getConfig(n);
    if(!_comboBadge){
        _comboBadge = document.createElement('div');
        _comboBadge.className = `efcd-combo-badge ${cfg.state}`;
        _comboBadge.innerHTML = `
            <span class="efcd-combo-label">${cfg.label}</span>
            <span class="efcd-combo-num">${n}</span>`;
        _comboWrap.appendChild(_comboBadge);
    } else {
        _comboBadge.className = `efcd-combo-badge ${cfg.state}`;
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
        setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 260);
    }, 370);
}

function reset(){
    _comboCount = 0;
    _comboBadge = null;
    _comboWrap  = null;
}

// ── INIT ──────────────────────────────────────────────────
injectCSS();
window.EFCD_FX = { correct, wrong, combo, comboBreak, attachCombo, reset };
console.log('⚡ EFCD_FX v2 — kinetic typography, no emoji figures');

})();
