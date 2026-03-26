/**
 * interactions.js — EFCD micro-interactions
 * Drop-in for any lesson. Zero dependencies. No audio.
 *
 * What it does:
 *  - Button shimmer + pop on correct answer
 *  - Button shake pulse on wrong answer  
 *  - Combo counter that lives above the Next button
 *  - Combo counter glows at 5, pulses at 8, cracks on break
 *  - XP float already handled per-lesson — this enhances it
 *  - Screen edge flash (green correct, red wrong) — subtle, peripheral
 *
 * Public API:
 *  EFCD_FX.correct(buttonEl)   — call on correct answer
 *  EFCD_FX.wrong(buttonEl)     — call on wrong answer
 *  EFCD_FX.combo(n)            — call with current combo count
 *  EFCD_FX.comboBreak()        — call when combo resets
 *  EFCD_FX.attachCombo(parentEl) — inject combo counter above a button
 *  EFCD_FX.reset()             — reset combo display
 */

'use strict';

(function(){

// ── INJECT CSS ────────────────────────────────────────────
function injectCSS(){
    if(document.getElementById('efcd-fx-styles')) return;
    const s = document.createElement('style');
    s.id = 'efcd-fx-styles';
    s.textContent = `

/* ── EDGE FLASH ── */
@keyframes efcd-flash-green {
    0%   { opacity: .55; }
    100% { opacity: 0;   }
}
@keyframes efcd-flash-red {
    0%   { opacity: .45; }
    100% { opacity: 0;   }
}
.efcd-edge-flash {
    position: fixed; inset: 0; pointer-events: none; z-index: 8888;
    border-radius: 0;
    opacity: 0;
}
.efcd-edge-flash.green {
    box-shadow: inset 0 0 80px 20px rgba(88,204,2,.55);
    animation: efcd-flash-green .45s ease-out forwards;
}
.efcd-edge-flash.red {
    box-shadow: inset 0 0 80px 20px rgba(255,75,75,.45);
    animation: efcd-flash-red .4s ease-out forwards;
}

/* ── BUTTON SHIMMER on correct ── */
@keyframes efcd-shimmer {
    0%   { left: -100%; opacity: 0;   }
    10%  { opacity: 1;                }
    100% { left: 150%;  opacity: 0;   }
}
.efcd-shimmer-host {
    position: relative;
    overflow: hidden;
}
.efcd-shimmer-sweep {
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,.55), transparent);
    transform: skewX(-18deg);
    pointer-events: none;
    animation: efcd-shimmer .5s ease-out forwards;
}

/* ── BUTTON POP on correct ── */
@keyframes efcd-pop {
    0%   { transform: scale(1);    }
    35%  { transform: scale(1.07); }
    65%  { transform: scale(.97);  }
    100% { transform: scale(1);    }
}
.efcd-pop {
    animation: efcd-pop .35s cubic-bezier(.175,.885,.32,1.275) both !important;
}

/* ── BUTTON THUD on wrong ── */
@keyframes efcd-thud {
    0%,100% { transform: scale(1);    }
    30%     { transform: scale(.94);  }
    60%     { transform: scale(1.02); }
}
.efcd-thud {
    animation: efcd-thud .3s ease both !important;
}

/* ── COMBO COUNTER ── */
@keyframes efcd-combo-in {
    from { opacity:0; transform: scale(.7) translateY(6px); }
    to   { opacity:1; transform: scale(1)  translateY(0);   }
}
@keyframes efcd-combo-tick {
    0%   { transform: scale(1);    }
    40%  { transform: scale(1.18); }
    100% { transform: scale(1);    }
}
@keyframes efcd-combo-crack {
    0%,100% { transform: translateX(0);  }
    20%     { transform: translateX(-5px); }
    40%     { transform: translateX(5px);  }
    60%     { transform: translateX(-3px); }
    80%     { transform: translateX(3px);  }
}
@keyframes efcd-combo-out {
    from { opacity:1; transform: scale(1); }
    to   { opacity:0; transform: scale(.6) translateY(4px); }
}
@keyframes efcd-glow-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,200,0,0); }
    50%     { box-shadow: 0 0 18px 4px rgba(255,200,0,.55); }
}

.efcd-combo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    min-height: 36px;
    font-family: 'Nunito', system-ui, sans-serif;
}
.efcd-combo-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 16px;
    border-radius: 99px;
    font-size: 15px;
    font-weight: 900;
    letter-spacing: -.2px;
    border: 2px solid;
    border-bottom: 3px solid;
    transition: background .2s, border-color .2s, color .2s;
    animation: efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both;
    cursor: default;
    user-select: none;
}

/* states */
.efcd-combo-badge.state-1 {
    background: rgba(28,176,246,.1);
    border-color: rgba(28,176,246,.3);
    border-bottom-color: rgba(28,176,246,.4);
    color: #1899D6;
}
.efcd-combo-badge.state-2 {
    background: rgba(88,204,2,.12);
    border-color: rgba(88,204,2,.35);
    border-bottom-color: rgba(88,167,0,.5);
    color: #58A700;
}
.efcd-combo-badge.state-3 {
    background: rgba(255,200,0,.15);
    border-color: rgba(255,200,0,.5);
    border-bottom-color: rgba(229,180,0,.7);
    color: #B8860B;
    animation: efcd-glow-pulse 1.4s ease-in-out infinite, efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both;
}
.efcd-combo-badge.state-4 {
    background: linear-gradient(135deg, rgba(255,75,75,.12), rgba(206,130,255,.12));
    border-color: rgba(206,130,255,.5);
    border-bottom-color: rgba(165,89,217,.6);
    color: #A559D9;
    animation: efcd-glow-pulse 1s ease-in-out infinite, efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both;
}

.efcd-combo-badge.tick {
    animation: efcd-combo-tick .25s cubic-bezier(.175,.885,.32,1.275) both !important;
}
.efcd-combo-badge.crack {
    animation: efcd-combo-crack .35s ease both !important;
}
.efcd-combo-badge.out {
    animation: efcd-combo-out .25s ease both !important;
}

.efcd-combo-flame {
    display: inline-block;
    font-size: 17px;
    line-height: 1;
}
.efcd-combo-text {
    font-size: 14px;
    font-weight: 900;
}
.efcd-combo-num {
    font-size: 18px;
    font-weight: 900;
    min-width: 18px;
    text-align: center;
}
    `;
    document.head.appendChild(s);
}

// ── EDGE FLASH ────────────────────────────────────────────
function edgeFlash(type){
    const el = document.createElement('div');
    el.className = `efcd-edge-flash ${type}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
}

// ── CORRECT ───────────────────────────────────────────────
function correct(btnEl){
    edgeFlash('green');
    if(!btnEl) return;
    // pop
    btnEl.classList.remove('efcd-pop');
    void btnEl.offsetWidth;
    btnEl.classList.add('efcd-pop');
    // shimmer sweep
    btnEl.classList.add('efcd-shimmer-host');
    const sweep = document.createElement('span');
    sweep.className = 'efcd-shimmer-sweep';
    btnEl.appendChild(sweep);
    setTimeout(() => { sweep.remove(); }, 600);
}

// ── WRONG ─────────────────────────────────────────────────
function wrong(btnEl){
    edgeFlash('red');
    if(!btnEl) return;
    btnEl.classList.remove('efcd-thud');
    void btnEl.offsetWidth;
    btnEl.classList.add('efcd-thud');
}

// ── COMBO COUNTER ─────────────────────────────────────────
// comboWrap is injected once per section, reused across questions
let _comboWrap  = null;
let _comboBadge = null;
let _comboCount = 0;

function _getState(n){
    if(n >= 8) return 'state-4';
    if(n >= 5) return 'state-3';
    if(n >= 3) return 'state-2';
    return 'state-1';
}
function _getFlame(n){
    if(n >= 8) return '🔥🔥';
    if(n >= 5) return '🔥';
    return '⚡';
}
function _getLabel(n){
    if(n >= 8) return 'ON FIRE!';
    if(n >= 5) return 'Hot streak!';
    if(n >= 3) return 'Combo';
    return 'Combo';
}

/**
 * attachCombo(parentEl)
 * Call once when a section renders, passing the container
 * that holds the Next/Check button. The combo wrap is
 * injected as the first child so it sits above the button.
 */
function attachCombo(parentEl){
    if(!parentEl) return;
    // remove any existing
    const old = parentEl.querySelector('.efcd-combo-wrap');
    if(old) old.remove();
    _comboWrap  = document.createElement('div');
    _comboWrap.className = 'efcd-combo-wrap';
    _comboBadge = null;
    _comboCount = 0;
    parentEl.prepend(_comboWrap);
}

/**
 * combo(n) — call with the current running combo after each correct answer
 */
function combo(n){
    _comboCount = n;
    if(n < 3){
        // below threshold — hide quietly
        if(_comboBadge){
            _comboBadge.classList.add('out');
            setTimeout(()=>{
                if(_comboBadge){ _comboBadge.remove(); _comboBadge=null; }
            }, 280);
        }
        return;
    }
    if(!_comboWrap) return;
    const state = _getState(n);
    const flame = _getFlame(n);
    const label = _getLabel(n);

    if(!_comboBadge){
        // create
        _comboBadge = document.createElement('div');
        _comboBadge.className = `efcd-combo-badge ${state}`;
        _comboBadge.innerHTML = `
            <span class="efcd-combo-flame">${flame}</span>
            <span class="efcd-combo-text">${label}</span>
            <span class="efcd-combo-num">${n}</span>`;
        _comboWrap.appendChild(_comboBadge);
    } else {
        // update
        _comboBadge.className = `efcd-combo-badge ${state}`;
        _comboBadge.querySelector('.efcd-combo-flame').textContent = flame;
        _comboBadge.querySelector('.efcd-combo-text').textContent  = label;
        _comboBadge.querySelector('.efcd-combo-num').textContent   = n;
        // tick animation
        _comboBadge.classList.remove('tick');
        void _comboBadge.offsetWidth;
        _comboBadge.classList.add('tick');
    }
}

/**
 * comboBreak() — call when combo resets to 0
 */
function comboBreak(){
    _comboCount = 0;
    if(!_comboBadge) return;
    _comboBadge.classList.remove('tick','state-1','state-2','state-3','state-4');
    void _comboBadge.offsetWidth;
    _comboBadge.classList.add('crack');
    setTimeout(()=>{
        if(_comboBadge){
            _comboBadge.classList.add('out');
            setTimeout(()=>{
                if(_comboBadge){ _comboBadge.remove(); _comboBadge=null; }
            }, 280);
        }
    }, 380);
}

/**
 * reset() — call when moving to a new section
 */
function reset(){
    _comboCount = 0;
    _comboBadge = null;
    _comboWrap  = null;
}

// ── INIT ──────────────────────────────────────────────────
injectCSS();

window.EFCD_FX = { correct, wrong, combo, comboBreak, attachCombo, reset };
console.log('⚡ EFCD_FX loaded — micro-interactions ready');

})();
