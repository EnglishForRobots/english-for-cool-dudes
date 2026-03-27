/**
 * interactions.js — EFCD micro-interactions v2.1
 * Pure kinetic typography. No emoji figures. No sticky popups.
 * Everything animates in, delivers, and disappears cleanly.
 *
 * Public API:
 *  EFCD_FX.correct(buttonEl)
 *  EFCD_FX.wrong(buttonEl)
 *  EFCD_FX.combo(n)
 *  EFCD_FX.comboBreak(currentStreak, bestCombo)  ← updated: celebrates streaks of 3+
 *  EFCD_FX.attachCombo(parentEl)
 *  EFCD_FX.reset()
 *  EFCD_FX.toast(icon, text)
 *  EFCD_FX.milestone(icon, title, msg, color, shadow)
 *  EFCD_FX.confetti()  ← now public, bigger and more celebratory
 */

'use strict';

(function(){

function injectCSS(){
    if(document.getElementById('efcd-fx-styles')) return;
    const s = document.createElement('style');
    s.id = 'efcd-fx-styles';
    s.textContent = [

'@keyframes efcd-flash-green { 0%{opacity:.6} 100%{opacity:0} }',
'@keyframes efcd-flash-red   { 0%{opacity:.5} 100%{opacity:0} }',
'.efcd-edge-flash { position:fixed; inset:0; pointer-events:none; z-index:8800; opacity:0; }',
'.efcd-edge-flash.green { box-shadow:inset 0 0 90px 24px rgba(88,204,2,.5); animation:efcd-flash-green .4s ease-out forwards; }',
'.efcd-edge-flash.red   { box-shadow:inset 0 0 90px 24px rgba(255,75,75,.45); animation:efcd-flash-red .38s ease-out forwards; }',

'@keyframes efcd-pop  { 0%{transform:scale(1)} 35%{transform:scale(1.06)} 65%{transform:scale(.97)} 100%{transform:scale(1)} }',
'@keyframes efcd-thud { 0%,100%{transform:scale(1)} 30%{transform:scale(.93)} 65%{transform:scale(1.02)} }',
'.efcd-pop  { animation:efcd-pop  .32s cubic-bezier(.175,.885,.32,1.275) both !important; }',
'.efcd-thud { animation:efcd-thud .28s ease both !important; }',

'@keyframes efcd-shimmer { 0%{left:-100%;opacity:0} 8%{opacity:1} 100%{left:150%;opacity:0} }',
'.efcd-shimmer-host { position:relative; overflow:hidden; }',
'.efcd-shimmer-sweep { position:absolute; top:0; left:-100%; width:55%; height:100%; background:linear-gradient(to right,transparent,rgba(255,255,255,.5),transparent); transform:skewX(-18deg); pointer-events:none; animation:efcd-shimmer .48s ease-out forwards; }',

'@keyframes efcd-word-up {',
'  0%   { opacity:0; transform:translateX(-50%) translateY(0) scale(.7); filter:blur(2px); }',
'  15%  { opacity:1; transform:translateX(-50%) translateY(-18px) scale(1.08); filter:blur(0); }',
'  60%  { opacity:1; transform:translateX(-50%) translateY(-38px) scale(1); filter:blur(0); }',
'  100% { opacity:0; transform:translateX(-50%) translateY(-64px) scale(.9); filter:blur(1px); }',
'}',
'@keyframes efcd-glitter {',
'  0%,100% { text-shadow:0 0 8px rgba(255,200,0,0); }',
'  25% { text-shadow:0 0 18px rgba(255,200,0,.9), 2px -2px 12px rgba(88,204,2,.7); }',
'  50% { text-shadow:-2px 0 20px rgba(28,176,246,.8), 0 2px 14px rgba(255,200,0,.8); }',
'  75% { text-shadow:2px 2px 16px rgba(206,130,255,.9), -1px -1px 10px rgba(255,200,0,.6); }',
'}',
'.efcd-word-burst { position:fixed; pointer-events:none; z-index:9100; font-family:"Nunito",system-ui,sans-serif; font-weight:900; font-size:clamp(24px,4vw,36px); letter-spacing:-.5px; color:#fff; text-shadow:0 2px 8px rgba(0,0,0,.25); animation:efcd-word-up .9s ease-out forwards, efcd-glitter .9s ease-out forwards; white-space:nowrap; transform-origin:center bottom; }',

'@keyframes efcd-word-wrong {',
'  0%   { opacity:0; transform:translateX(-50%) translateY(0) scale(.8); }',
'  15%  { opacity:1; transform:translateX(-50%) translateY(-14px) scale(1.04); }',
'  60%  { opacity:.9; transform:translateX(-50%) translateY(-28px) scale(1); }',
'  100% { opacity:0; transform:translateX(-50%) translateY(-50px) scale(.85); }',
'}',
'.efcd-word-burst.wrong { color:#FF4B4B; text-shadow:0 2px 8px rgba(255,75,75,.4); animation:efcd-word-wrong .7s ease-out forwards; }',

/* CONFETTI */
'@keyframes efcd-confetti-fall {',
'  0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }',
'  80%  { opacity:1; }',
'  100% { opacity:0; transform:translateY(140px) rotate(var(--efcd-rot,400deg)) scale(.7); }',
'}',
'.efcd-confetti-dot { position:fixed; pointer-events:none; z-index:9099; animation:efcd-confetti-fall var(--efcd-dur,1.1s) ease-out var(--efcd-delay,0s) both; }',

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
'.efcd-ms-card { position:fixed; top:50%; left:50%; transform:translateX(-50%) translateY(-50%); z-index:9301; background:#fff; border-radius:28px; padding:44px 40px 36px; text-align:center; max-width:420px; width:calc(100vw - 48px); animation:efcd-ms-card-in .38s cubic-bezier(.175,.885,.32,1.275) both; }',
'.efcd-ms-card.out { animation:efcd-ms-card-out .25s ease both; }',
'.efcd-ms-emoji { font-size:64px; line-height:1; display:block; margin-bottom:16px; }',
'.efcd-ms-title { font-size:clamp(28px,6vw,48px); font-weight:900; line-height:1.1; letter-spacing:-1.5px; margin-bottom:12px; }',
'.efcd-ms-msg   { font-size:clamp(14px,2.5vw,17px); font-weight:700; color:#4B4B4B; line-height:1.55; }',
'.efcd-ms-tap   { font-size:12px; font-weight:900; color:#AFAFAF; text-transform:uppercase; letter-spacing:1.5px; margin-top:20px; display:block; }',

/* STREAK BREAK milestone — uses same card but with motivator sub-line */
'.efcd-ms-target { font-size:clamp(13px,2.2vw,15px); font-weight:900; color:#1CB0F6; margin-top:10px; letter-spacing:-.2px; }',

/* COMBO */
'@keyframes efcd-combo-in    { from{opacity:0;transform:scale(.65) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }',
'@keyframes efcd-combo-tick  { 0%{transform:scale(1)} 40%{transform:scale(1.16)} 100%{transform:scale(1)} }',
'@keyframes efcd-combo-crack { 0%,100%{transform:translateX(0) rotate(0)} 20%{transform:translateX(-6px) rotate(-1deg)} 40%{transform:translateX(6px) rotate(1deg)} 60%{transform:translateX(-4px) rotate(-.5deg)} 80%{transform:translateX(3px) rotate(.5deg)} }',
'@keyframes efcd-combo-out   { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.55) translateY(6px)} }',
'@keyframes efcd-glow-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(255,200,0,0)} 50%{box-shadow:0 0 22px 5px rgba(255,200,0,.5)} }',
'@keyframes efcd-hot-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(255,75,75,0)} 50%{box-shadow:0 0 24px 6px rgba(255,150,0,.55)} }',
'.efcd-combo-wrap { display:flex; align-items:center; justify-content:center; min-height:40px; margin-bottom:10px; font-family:"Nunito",system-ui,sans-serif; }',
'.efcd-combo-badge { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:99px; font-size:14px; font-weight:900; letter-spacing:-.2px; border:2px solid; border-bottom:3px solid; transition:background .2s,border-color .2s,color .2s; animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both; user-select:none; cursor:default; }',
'.efcd-combo-badge.state-1 { background:rgba(28,176,246,.1);  border-color:rgba(28,176,246,.3);  border-bottom-color:rgba(28,176,246,.45); color:#1899D6; }',
'.efcd-combo-badge.state-2 { background:rgba(88,204,2,.1);    border-color:rgba(88,204,2,.35);   border-bottom-color:rgba(88,167,0,.5);   color:#58A700; animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both; }',
'.efcd-combo-badge.state-3 { background:rgba(255,200,0,.14);  border-color:rgba(255,200,0,.5);   border-bottom-color:rgba(229,180,0,.65); color:#a07800; animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both, efcd-glow-pulse 1.5s ease-in-out infinite .3s; }',
'.efcd-combo-badge.state-4 { background:linear-gradient(135deg,rgba(255,100,0,.12),rgba(255,75,75,.1)); border-color:rgba(255,120,0,.5); border-bottom-color:rgba(220,80,0,.65); color:#cc4400; animation:efcd-combo-in .3s cubic-bezier(.175,.885,.32,1.275) both, efcd-hot-pulse 1.1s ease-in-out infinite .3s; }',
'.efcd-combo-badge.tick  { animation:efcd-combo-tick  .22s cubic-bezier(.175,.885,.32,1.275) both !important; }',
'.efcd-combo-badge.crack { animation:efcd-combo-crack .35s ease both !important; }',
'.efcd-combo-badge.out   { animation:efcd-combo-out   .24s ease both !important; }',
'.efcd-combo-label { font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; opacity:.75; }',
'.efcd-combo-num   { font-size:20px; font-weight:900; line-height:1; min-width:20px; text-align:center; }'

    ].join('\n');
    document.head.appendChild(s);
}

/* ── WORD BURST ──────────────────────────────────────────── */
const CORRECT_WORDS = ['YES!','NICE!','BOOM!','SPOT ON!','GOT IT!','PERFECT!','NAILED IT!','CORRECT!','BRILLIANT!','GREAT!'];
const WRONG_WORDS   = ['NOT QUITE','ALMOST!','TRY AGAIN','NEARLY!'];
let _lastCorrectWord = '';
function _pickCorrect(){
    const pool = CORRECT_WORDS.filter(w => w !== _lastCorrectWord);
    const w = pool[Math.floor(Math.random() * pool.length)];
    _lastCorrectWord = w; return w;
}

function _wordBurst(text, isCorrect){
    const x = window.innerWidth  / 2;
    const y = window.innerHeight * 0.42;
    const el = document.createElement('div');
    el.className = 'efcd-word-burst' + (isCorrect ? '' : ' wrong');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

/* ── EDGE FLASH ──────────────────────────────────────────── */
function _edgeFlash(type){
    const el = document.createElement('div');
    el.className = 'efcd-edge-flash ' + type;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 450);
}

/* ── CONFETTI ────────────────────────────────────────────── */
const CONFETTI_COLOURS = ['#FFC800','#58CC02','#1CB0F6','#FF4B4B','#CE82FF','#2BDECC','#FF9600','#fff'];

function confetti(){
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight * 0.44;
    const COUNT = 52;

    for(let i = 0; i < COUNT; i++){
        const el = document.createElement('div');
        el.className = 'efcd-confetti-dot';

        /* random size — mix of small squares and larger rectangles */
        const size  = 7 + Math.random() * 13;               // 7–20px
        const tall  = Math.random() > 0.5;                   // some are tall rectangles
        const w     = Math.round(size);
        const h     = tall ? Math.round(size * (1.4 + Math.random())) : Math.round(size);
        const color = CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)];
        const rot   = Math.round(-360 + Math.random() * 720) + 'deg';
        const delay = (Math.random() * 0.28).toFixed(3) + 's';
        const dur   = (0.85 + Math.random() * 0.65).toFixed(3) + 's';

        /* spread angle: full 360° but weighted toward upward arc */
        const angle  = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 260;             // wider spread
        const startX = cx + Math.cos(angle) * (Math.random() * 30);
        const startY = cy + Math.sin(angle) * (Math.random() * 30);

        el.style.cssText = [
            'width:'  + w + 'px',
            'height:' + h + 'px',
            'border-radius:' + (tall ? '3px' : Math.round(w * 0.3) + 'px'),
            'background:' + color,
            'left:' + startX + 'px',
            'top:'  + startY + 'px',
            '--efcd-rot:'   + rot,
            '--efcd-dur:'   + dur,
            '--efcd-delay:' + delay,
            /* actual travel via transform offset baked in at start */
            'transform:translate(' +
                Math.round(Math.cos(angle) * radius) + 'px,' +
                Math.round(Math.sin(angle) * radius - 60) + 'px' +
            ') rotate(0deg)',
        ].join(';');

        /* override: use keyframe from spawn point so it looks explosive */
        el.style.transform = 'translate(0,0) rotate(0deg)';

        document.body.appendChild(el);

        /* translate outward during the animation using JS after paint */
        requestAnimationFrame(() => {
            el.style.transition = 'transform ' + dur + ' cubic-bezier(.2,.8,.4,1) ' + delay;
            el.style.transform  = 'translate(' +
                Math.round(Math.cos(angle) * radius) + 'px,' +
                Math.round((Math.sin(angle) * radius) - 80) + 'px' +
            ') rotate(' + rot + ')';
        });

        setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(delay) + 0.1) * 1000);
    }
}

/* ── CORRECT / WRONG ─────────────────────────────────────── */
function correct(btnEl){
    _edgeFlash('green');
    if(btnEl){
        btnEl.classList.remove('efcd-pop');
        void btnEl.offsetWidth;
        btnEl.classList.add('efcd-pop','efcd-shimmer-host');
        const sweep = document.createElement('span');
        sweep.className = 'efcd-shimmer-sweep';
        btnEl.appendChild(sweep);
        setTimeout(() => sweep.remove(), 550);
    }
    _wordBurst(_pickCorrect(), true);
}

function wrong(btnEl){
    _edgeFlash('red');
    if(btnEl){
        btnEl.classList.remove('efcd-thud');
        void btnEl.offsetWidth;
        btnEl.classList.add('efcd-thud');
    }
    _wordBurst(WRONG_WORDS[Math.floor(Math.random() * WRONG_WORDS.length)], false);
}

/* ── TOAST ───────────────────────────────────────────────── */
function toast(icon, text){
    document.querySelector('.efcd-toast')?.remove();
    const el = document.createElement('div');
    el.className = 'efcd-toast';
    el.innerHTML = '<span class="efcd-toast-icon">' + icon + '</span><span class="efcd-toast-text">' + text + '</span>';
    document.body.appendChild(el);
    const dismiss = () => { el.classList.add('out'); setTimeout(() => el.remove(), 320); };
    setTimeout(dismiss, 4000);
    el.addEventListener('click', dismiss);
}

/* ── MILESTONE ───────────────────────────────────────────── */
function milestone(icon, title, msg, color, shadow){
    color  = color  || '#58CC02';
    shadow = shadow || '#58A700';
    document.querySelector('.efcd-ms-overlay')?.remove();
    document.querySelector('.efcd-ms-card')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'efcd-ms-overlay';
    const card = document.createElement('div');
    card.className = 'efcd-ms-card';
    card.style.cssText = 'border:3px solid ' + color + '; border-bottom:8px solid ' + shadow + '; box-shadow:0 24px 80px rgba(0,0,0,.3);';
    card.innerHTML =
        '<span class="efcd-ms-emoji">' + icon + '</span>' +
        '<div class="efcd-ms-title" style="color:' + shadow + '">' + title + '</div>' +
        '<div class="efcd-ms-msg">' + msg + '</div>' +
        '<span class="efcd-ms-tap">Tap to continue</span>';
    document.body.appendChild(overlay);
    document.body.appendChild(card);
    const dismiss = () => {
        overlay.classList.add('out'); card.classList.add('out');
        setTimeout(() => { overlay.remove(); card.remove(); }, 280);
    };
    setTimeout(dismiss, 3200);
    overlay.addEventListener('click', dismiss);
    card.addEventListener('click', dismiss);
}

/* ── STREAK BREAK MILESTONE ──────────────────────────────── */

const STREAK_ICONS = ['🔥','⚡','💥','🎯','🏆'];

function _streakBreakMilestone(streakCount, bestCombo){
    const isPB = streakCount >= bestCombo;  /* this streak equals or beats the best passed in */

    /* pick icon — hotter the streak, more dramatic */
    const iconIdx = Math.min(Math.floor((streakCount - 3) / 2), STREAK_ICONS.length - 1);
    const icon    = isPB ? '🏆' : STREAK_ICONS[Math.max(0, iconIdx)];

    /* title */
    const title = isPB
        ? streakCount + ' in a row!'
        : streakCount + ' combo!';

    /* body message */
    let msg;
    if(isPB){
        msg = "That's a new personal best! You're on fire. Can you beat " + streakCount + " next time?";
    } else if(streakCount >= 7){
        msg = "Incredible run! Now go for " + (streakCount + 1) + " — you've got this.";
    } else if(streakCount >= 5){
        msg = "Great streak! Try to beat " + bestCombo + " next time — your personal best is waiting.";
    } else {
        msg = "Nice combo! Your best is " + bestCombo + ". Can you beat it?";
    }

    /* colour theme — escalates with streak length */
    let color, shadow;
    if(streakCount >= 7){
        color = '#FF4B4B'; shadow = '#EA2B2B';   /* punch red — on fire */
    } else if(streakCount >= 5){
        color = '#FF9600'; shadow = '#E07800';   /* orange — hot streak */
    } else {
        color = '#FFC800'; shadow = '#E5B400';   /* yellow — good combo */
    }

    document.querySelector('.efcd-ms-overlay')?.remove();
    document.querySelector('.efcd-ms-card')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'efcd-ms-overlay';

    const card = document.createElement('div');
    card.className = 'efcd-ms-card';
    card.style.cssText = 'border:3px solid ' + color + '; border-bottom:8px solid ' + shadow + '; box-shadow:0 24px 80px rgba(0,0,0,.3);';
    card.innerHTML =
        '<span class="efcd-ms-emoji">' + icon + '</span>' +
        '<div class="efcd-ms-title" style="color:' + shadow + '">' + title + '</div>' +
        '<div class="efcd-ms-msg">' + msg + '</div>' +
        (isPB ? '<div class="efcd-ms-target">🏆 New personal best!</div>' : '') +
        '<span class="efcd-ms-tap">Tap to keep going</span>';

    document.body.appendChild(overlay);
    document.body.appendChild(card);

    /* fire confetti for personal bests and big streaks */
    if(isPB || streakCount >= 5){
        confetti();
        if(isPB) setTimeout(confetti, 320);   /* double burst for PB */
    }

    const dismiss = () => {
        overlay.classList.add('out'); card.classList.add('out');
        setTimeout(() => { overlay.remove(); card.remove(); }, 280);
    };
    setTimeout(dismiss, 3800);   /* slightly longer than regular milestone — let it land */
    overlay.addEventListener('click', dismiss);
    card.addEventListener('click', dismiss);
}

/* ── COMBO BADGE ─────────────────────────────────────────── */
let _comboWrap=null, _comboBadge=null, _comboCount=0;
const COMBO_LABELS=[
    {min:8,state:'state-4',label:'ON FIRE'},
    {min:5,state:'state-3',label:'HOT STREAK'},
    {min:3,state:'state-2',label:'COMBO'},
    {min:0,state:'state-1',label:'COMBO'},
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
            setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 260);
        }
        return;
    }
    if(!_comboWrap) return;
    const cfg = _getConfig(n);
    if(!_comboBadge){
        _comboBadge = document.createElement('div');
        _comboBadge.className = 'efcd-combo-badge ' + cfg.state;
        _comboBadge.innerHTML = '<span class="efcd-combo-label">' + cfg.label + '</span><span class="efcd-combo-num">' + n + '</span>';
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

/**
 * comboBreak(currentStreak, bestCombo)
 *
 * currentStreak — the streak that just ended (passed in from lesson state)
 * bestCombo     — the user's personal best for this lesson session (passed in from lesson state)
 *
 * Both args are optional for backward compatibility.
 * Fires streak celebration milestone if streak >= 3.
 */
function comboBreak(currentStreak, bestCombo){
    _comboCount = 0;

    /* crack and dissolve the badge */
    if(_comboBadge){
        _comboBadge.classList.remove('tick','state-1','state-2','state-3','state-4');
        void _comboBadge.offsetWidth;
        _comboBadge.classList.add('crack');
        const b = _comboBadge;
        setTimeout(() => {
            b.classList.add('out');
            setTimeout(() => { b.remove(); if(_comboBadge===b) _comboBadge=null; }, 260);
        }, 370);
    }

    /* celebrate if streak was meaningful */
    const streak = (typeof currentStreak === 'number') ? currentStreak : 0;
    const best   = (typeof bestCombo     === 'number') ? bestCombo     : streak;

    if(streak >= 3){
        /* slight delay so badge crack plays first */
        setTimeout(() => _streakBreakMilestone(streak, best), 420);
    }
}

function reset(){ _comboCount=0; _comboBadge=null; _comboWrap=null; }

injectCSS();
window.EFCD_FX = { correct, wrong, combo, comboBreak, attachCombo, reset, toast, milestone, confetti };
console.log('⚡ EFCD_FX v2.1 — kinetic typography, streak celebrations, big confetti');

})();
