/**
 * interactions.js — EFCD micro-interactions v2.2
 * Pure kinetic typography. No emoji figures. No sticky popups.
 * Everything animates in, delivers, and disappears cleanly.
 *
 * Public API:
 *  EFCD_FX.correct(buttonEl)
 *  EFCD_FX.wrong(buttonEl)
 *  EFCD_FX.combo(n)
 *  EFCD_FX.comboBreak(currentStreak, bestCombo)
 *  EFCD_FX.attachCombo(parentEl)
 *  EFCD_FX.reset()
 *  EFCD_FX.toast(icon, text)
 *  EFCD_FX.milestone(icon, title, msg, color, shadow)
 *  EFCD_FX.confetti()
 *
 * v2.2 changes:
 *  - confetti: radial explosive burst (chess.com style) — particles fire outward
 *    in all directions from screen centre, gravity pulls them down
 *  - streak break card: no dark overlay, floats over lesson content,
 *    lesson stays fully visible and readable behind it
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

/* TOAST — top-centre pill */
'@keyframes efcd-toast-in  { from{opacity:0;transform:translateX(-50%) translateY(-20px) scale(.88)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }',
'@keyframes efcd-toast-out { from{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} to{opacity:0;transform:translateX(-50%) translateY(-16px) scale(.9)} }',
'.efcd-toast { position:fixed; top:72px; left:50%; transform:translateX(-50%); z-index:9200; display:flex; align-items:center; gap:10px; background:#fff; border:2px solid #CECECE; border-bottom:4px solid #CECECE; border-left:4px solid #58CC02; border-radius:16px; padding:12px 20px; box-shadow:0 6px 24px rgba(0,0,0,.12); font-family:"Nunito",system-ui,sans-serif; white-space:nowrap; animation:efcd-toast-in .35s cubic-bezier(.175,.885,.32,1.275) both; }',
'.efcd-toast.out { animation:efcd-toast-out .28s ease both; }',
'.efcd-toast-icon { font-size:22px; flex-shrink:0; }',
'.efcd-toast-text { font-size:14px; font-weight:900; color:#111827; }',

/* MILESTONE — centre-screen card, NO overlay */
'@keyframes efcd-ms-card-in  { from{opacity:0;transform:translateX(-50%) translateY(calc(-50% - 12px)) scale(.82)} to{opacity:1;transform:translateX(-50%) translateY(-50%) scale(1)} }',
'@keyframes efcd-ms-card-out { from{opacity:1;transform:translateX(-50%) translateY(-50%) scale(1)} to{opacity:0;transform:translateX(-50%) translateY(calc(-50% - 8px)) scale(.88)} }',
'.efcd-ms-card { position:fixed; top:50%; left:50%; transform:translateX(-50%) translateY(-50%); z-index:9301; background:#fff; border-radius:28px; padding:36px 32px 28px; text-align:center; max-width:380px; width:calc(100vw - 48px); animation:efcd-ms-card-in .4s cubic-bezier(.175,.885,.32,1.275) both; pointer-events:all; }',
'.efcd-ms-card.out { animation:efcd-ms-card-out .22s ease both; }',
'.efcd-ms-emoji { font-size:56px; line-height:1; display:block; margin-bottom:12px; }',
'.efcd-ms-title { font-size:clamp(24px,5vw,40px); font-weight:900; line-height:1.1; letter-spacing:-1.5px; margin-bottom:10px; }',
'.efcd-ms-msg   { font-size:clamp(13px,2.2vw,15px); font-weight:700; color:#4B4B4B; line-height:1.55; }',
'.efcd-ms-tap   { font-size:11px; font-weight:900; color:#AFAFAF; text-transform:uppercase; letter-spacing:1.5px; margin-top:16px; display:block; }',
'.efcd-ms-target { font-size:clamp(12px,2vw,14px); font-weight:900; color:#1CB0F6; margin-top:8px; letter-spacing:-.2px; }',

/* STREAK CARD — same card styles, no overlay, shadow does the lifting */
'.efcd-streak-card { position:fixed; top:50%; left:50%; transform:translateX(-50%) translateY(-50%); z-index:9301; background:#fff; border-radius:24px; padding:28px 28px 22px; text-align:center; max-width:340px; width:calc(100vw - 48px); pointer-events:all; }',
'.efcd-streak-card.out { animation:efcd-ms-card-out .22s ease both; }',

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

/* ── CONFETTI — radial explosive burst ───────────────────── */
/*
 * Chess.com style: particles fire outward from a single point
 * in all directions simultaneously. Each gets a random angle,
 * speed, and spin. Gravity is simulated by reducing the
 * vertical component over time — implemented by giving each
 * particle a steeper downward travel target than its initial
 * angle suggests.
 */
const CONFETTI_COLOURS = [
    '#FFC800','#58CC02','#1CB0F6','#FF4B4B',
    '#CE82FF','#2BDECC','#FF9600','#FFFFFF',
    '#FF6B9D','#00D4FF'
];

function confetti(originX, originY){
    /* Default origin: centre of viewport */
    const cx = (typeof originX === 'number') ? originX : window.innerWidth  * 0.5;
    const cy = (typeof originY === 'number') ? originY : window.innerHeight * 0.42;

    const COUNT = 72;    /* particle count — dense burst */
    const DURATION_BASE = 900;  /* ms */

    for(let i = 0; i < COUNT; i++){
        const el = document.createElement('canvas');

        /* Shape: mix of squares, rectangles, and circles */
        const shape = Math.random();
        const size  = 6 + Math.random() * 10;  /* 6–16px */
        const w     = Math.round(size);
        const h     = shape > 0.6 ? Math.round(size * (1.5 + Math.random())) : Math.round(size);
        el.width  = w;
        el.height = h;

        const color = CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)];
        const ctx   = el.getContext('2d');
        if(shape > 0.85){
            /* circle */
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(w/2, h/2, w/2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, w, h);
        }

        el.style.cssText = [
            'position:fixed',
            'pointer-events:none',
            'z-index:9099',
            'left:' + cx + 'px',
            'top:'  + cy + 'px',
            'border-radius:' + (shape > 0.85 ? '50%' : '2px'),
        ].join(';');

        document.body.appendChild(el);

        /* Physics parameters per particle */
        const angle    = Math.random() * Math.PI * 2;  /* any direction */
        const speed    = 180 + Math.random() * 320;    /* px travel distance */
        const gravity  = 140 + Math.random() * 120;    /* extra downward pull */
        const duration = DURATION_BASE + Math.random() * 500;
        const delay    = Math.random() * 120;           /* stagger up to 120ms */
        const spin     = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);

        /* Target position: angle + gravity bias downward */
        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed + gravity;  /* gravity adds downward travel */

        const start = performance.now() + delay;
        let raf;

        function animate(now){
            if(now < start){ raf = requestAnimationFrame(animate); return; }
            const elapsed = now - start;
            const t       = Math.min(elapsed / duration, 1);

            /* Ease out — fast burst then decelerate */
            const ease = 1 - Math.pow(1 - t, 3);

            /* Fade out in final 30% */
            const opacity = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

            const x = cx + tx * ease;
            const y = cy + ty * ease;
            const r = spin * ease;

            el.style.left      = x + 'px';
            el.style.top       = y + 'px';
            el.style.transform = 'rotate(' + r + 'deg)';
            el.style.opacity   = opacity;

            if(t < 1){
                raf = requestAnimationFrame(animate);
            } else {
                el.remove();
            }
        }

        raf = requestAnimationFrame(animate);
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

/* ── MILESTONE — no overlay, card only ───────────────────── */
function milestone(icon, title, msg, color, shadow){
    color  = color  || '#58CC02';
    shadow = shadow || '#58A700';
    document.querySelector('.efcd-ms-card')?.remove();
    const card = document.createElement('div');
    card.className = 'efcd-ms-card';
    card.style.cssText = [
        'border:3px solid ' + color,
        'border-bottom:8px solid ' + shadow,
        'box-shadow:0 8px 48px rgba(0,0,0,.22), 0 2px 12px rgba(0,0,0,.12)',
    ].join(';');
    card.innerHTML =
        '<span class="efcd-ms-emoji">' + icon + '</span>' +
        '<div class="efcd-ms-title" style="color:' + shadow + '">' + title + '</div>' +
        '<div class="efcd-ms-msg">' + msg + '</div>' +
        '<span class="efcd-ms-tap">Tap to continue</span>';
    document.body.appendChild(card);
    const dismiss = () => {
        card.classList.add('out');
        setTimeout(() => card.remove(), 240);
    };
    setTimeout(dismiss, 3200);
    card.addEventListener('click', dismiss);
}

/* ── STREAK BREAK CARD — no overlay ─────────────────────── */
const STREAK_ICONS = ['🔥','⚡','💥','🎯','🏆'];

function _streakBreakCard(streakCount, bestCombo){
    const isPB  = streakCount >= bestCombo;
    const iconIdx = Math.min(Math.floor((streakCount - 3) / 2), STREAK_ICONS.length - 1);
    const icon    = isPB ? '🏆' : STREAK_ICONS[Math.max(0, iconIdx)];
    const title   = isPB ? streakCount + ' Correct answers in a row!' : streakCount + ' combo!';

    let msg;
    if(isPB){
        msg = "New personal best! Can you beat " + streakCount + " next time?";
    } else if(streakCount >= 7){
        msg = "Incredible run! Go for " + (streakCount + 1) + " — you've got this.";
    } else if(streakCount >= 5){
        msg = "Great streak! Your best is " + bestCombo + ". Can you beat it?";
    } else {
        msg = "Nice combo! Your best is " + bestCombo + ". Go again!";
    }

    let color, shadow;
    if(streakCount >= 7){
        color = '#FF4B4B'; shadow = '#EA2B2B';
    } else if(streakCount >= 5){
        color = '#FF9600'; shadow = '#E07800';
    } else {
        color = '#FFC800'; shadow = '#E5B400';
    }

    /* Remove any existing streak card */
    document.querySelector('.efcd-streak-card')?.remove();

    const card = document.createElement('div');
    card.className = 'efcd-streak-card';
    card.style.cssText = [
        'border:3px solid ' + color,
        'border-bottom:7px solid ' + shadow,
        /* Shadow lifts card without overlay — feels floating, not blocking */
        'box-shadow:0 12px 60px rgba(0,0,0,.18), 0 3px 16px rgba(0,0,0,.10)',
    ].join(';');

    card.innerHTML =
        '<div style="font-size:44px;line-height:1;margin-bottom:10px">' + icon + '</div>' +
        '<div style="font-size:clamp(22px,5vw,34px);font-weight:900;line-height:1.1;letter-spacing:-1px;color:' + shadow + ';margin-bottom:8px">' + title + '</div>' +
        '<div style="font-size:clamp(12px,2.2vw,14px);font-weight:700;color:#4B4B4B;line-height:1.5;margin-bottom:' + (isPB ? '6px' : '12px') + '">' + msg + '</div>' +
        (isPB ? '<div style="font-size:13px;font-weight:900;color:#1CB0F6;margin-bottom:12px">🏆 New personal best!</div>' : '') +
        '<div style="font-size:11px;font-weight:900;color:#AFAFAF;text-transform:uppercase;letter-spacing:1.5px">Tap to keep going</div>';

    document.body.appendChild(card);

    /* Confetti for PBs and big streaks — fires from card position */
    if(isPB || streakCount >= 5){
        confetti(window.innerWidth * 0.5, window.innerHeight * 0.4);
        if(isPB) setTimeout(() => confetti(window.innerWidth * 0.5, window.innerHeight * 0.4), 280);
    }

    const dismiss = () => {
        card.classList.add('out');
        setTimeout(() => card.remove(), 240);
    };
    setTimeout(dismiss, 3600);
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
 * currentStreak — the streak that just ended (pass BEFORE resetting S.combo)
 * bestCombo     — personal best for this session
 *
 * Both args optional — backward compatible with zero-arg calls.
 * Fires non-blocking streak card if streak >= 3.
 */
function comboBreak(currentStreak, bestCombo){
    _comboCount = 0;

    /* Crack and dissolve the badge */
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

    const streak = (typeof currentStreak === 'number') ? currentStreak : 0;
    const best   = (typeof bestCombo     === 'number') ? bestCombo     : streak;

    if(streak >= 3){
        /* Slight delay so badge crack plays first */
        setTimeout(() => _streakBreakCard(streak, best), 420);
    }
}

function reset(){ _comboCount=0; _comboBadge=null; _comboWrap=null; }

injectCSS();
window.EFCD_FX = { correct, wrong, combo, comboBreak, attachCombo, reset, toast, milestone, confetti };
console.log('⚡ EFCD_FX v2.2 — explosive radial confetti, non-blocking streak card');

})();
