// ═══════════════════════════════════════════════════════════
// DAILY CHALLENGES SYSTEM — daily-challenges-system.js
// ═══════════════════════════════════════════════════════════

'use strict';

const DAILY_CHALLENGES = {
    perfect_score: {
        id:          'perfect_score',
        title:       'Perfect Score',
        description: 'Complete any lesson and score 100%',
        icon:        '💯',
        target:      1,
        xpReward:    75,
        ctaLabel:    '🎯 Pick a Lesson',
        ctaAction:   'picker',
        motivational: "You've got an eye for detail — keep it up!",
        color:       '#1a1a2e', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) => data?.perfectScore === true ? 1 : cur,
    },
    vocab_learner: {
        id:          'vocab_learner',
        title:       'Word Hunter',
        description: 'Learn 10 new vocabulary words today',
        icon:        '📚',
        target:      10,
        xpReward:    50,
        ctaLabel:    '📖 Find a Vocab Lesson',
        ctaAction:   'picker',
        motivational: "Your vocabulary is growing fast — impressive!",
        color:       '#6B21A8', colorAccent: '#CE82FF', colorShadow: '#A559D9',
        checkProgress: (cur, data) => Math.min(cur + (data?.vocabCount || 0), 10),
    },
    speed_run: {
        id:          'speed_run',
        title:       'Speed Runner',
        description: 'Complete any lesson in under 8 minutes',
        icon:        '⚡',
        target:      1,
        xpReward:    60,
        ctaLabel:    '⚡ Start a Quick Lesson',
        ctaAction:   'picker',
        motivational: "Fast AND smart — that's the Cool Dude way!",
        color:       '#92400E', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) => (data?.completionTime && data.completionTime < 480) ? 1 : cur,
    },
    double_trouble: {
        id:          'double_trouble',
        title:       'Double Trouble',
        description: 'Complete 2 lessons today',
        icon:        '🎯',
        target:      2,
        xpReward:    100,
        ctaLabel:    '🚀 Start a Lesson',
        ctaAction:   'picker',
        motivational: "Two lessons in one day — you're on fire! 🔥",
        color:       '#991B1B', colorAccent: '#FF4B4B', colorShadow: '#EA2B2B',
        checkProgress: (cur) => cur + 1,
    },
    early_bird: {
        id:          'early_bird',
        title:       'Early Bird',
        description: 'Complete a lesson before 10 AM',
        icon:        '🐦',
        target:      1,
        xpReward:    50,
        ctaLabel:    '🌅 Start Early',
        ctaAction:   'picker',
        motivational: "Early mornings = early wins. Respect!",
        color:       '#92400E', colorAccent: '#FFB800', colorShadow: '#cc9000',
        checkProgress: (cur) => new Date().getHours() < 10 ? 1 : cur,
    },
    weekend_warrior: {
        id:          'weekend_warrior',
        title:       'Weekend Warrior',
        description: 'Learn something new this weekend',
        icon:        '🎮',
        target:      1,
        xpReward:    75,
        ctaLabel:    '🎮 Pick Any Lesson',
        ctaAction:   'picker',
        motivational: "Who said weekends are for rest? Legend status!",
        color:       '#065F46', colorAccent: '#2BDECC', colorShadow: '#1FBFAF',
        checkProgress: (cur) => { const d = new Date().getDay(); return (d===0||d===6) ? 1 : cur; },
    },
    grammar_guru: {
        id:          'grammar_guru',
        title:       'Grammar Guru',
        description: 'Ace the grammar exercises in any lesson',
        icon:        '📝',
        target:      1,
        xpReward:    60,
        ctaLabel:    '✏️ Accept the Challenge',
        ctaAction:   'picker',
        motivational: "Grammar master in the making — brilliant!",
        color:       '#1e3a5f', colorAccent: '#1CB0F6', colorShadow: '#1899D6',
        checkProgress: (cur, data) => data?.grammarPerfect === true ? 1 : cur,
    },
};

const DAY_ORDER = [
    'perfect_score',   // Sunday
    'vocab_learner',   // Monday
    'speed_run',       // Tuesday
    'double_trouble',  // Wednesday
    'grammar_guru',    // Thursday
    'early_bird',      // Friday
    'weekend_warrior', // Saturday
];

// ── GET CHALLENGES ───────────────────────────────────────────
function getTodaysChallenge() {
    const day  = new Date().getDay();
    const hour = new Date().getHours();
    if (day === 0 || day === 6) return DAILY_CHALLENGES.weekend_warrior;
    // Early bird expires after 10am — swap to perfect_score
    if (DAY_ORDER[day] === 'early_bird' && hour >= 10) return DAILY_CHALLENGES.perfect_score;
    return DAILY_CHALLENGES[DAY_ORDER[day]];
}

function getTomorrowsChallenge() {
    const tomorrow = (new Date().getDay() + 1) % 7;
    if (tomorrow === 0 || tomorrow === 6) return DAILY_CHALLENGES.weekend_warrior;
    return DAILY_CHALLENGES[DAY_ORDER[tomorrow]];
}

// ── TIME HELPERS ─────────────────────────────────────────────
function getTimeUntilMidnight() {
    const now = new Date(), mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return { h, m, label: h + 'h ' + m + 'm' };
}

// ── PROGRESS HELPERS ─────────────────────────────────────────
function getStoredProgress(challenge) {
    try {
        const stored = localStorage.getItem('dailyChallenge');
        if (!stored) return 0;
        const d = JSON.parse(stored);
        if (d.date === new Date().toDateString() && d.challengeId === challenge.id) {
            return d.progress || 0;
        }
    } catch(_) {}
    return 0;
}

// ── INJECT CSS ONCE ──────────────────────────────────────────
function injectCSS() {
    if (document.getElementById('dc-styles')) return;
    const style = document.createElement('style');
    style.id = 'dc-styles';
    style.textContent = `
.dc-quest-card {
    background: linear-gradient(135deg, #1CB0F6 0%, #0d8fd4 100%);
    border: 2px solid #1899D6;
    border-bottom: 6px solid #1899D6;
    border-radius: 24px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Nunito', -apple-system, sans-serif;
    margin-bottom: 16px;
}
.dc-quest-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,.12) 0%, transparent 60%);
}
.dc-quest-eyebrow {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; font-weight: 900; text-transform: uppercase;
    letter-spacing: 1.5px; color: rgba(255,255,255,.75);
    margin-bottom: 14px;
}
.dc-quest-timer {
    background: rgba(0,0,0,.2); padding: 3px 10px;
    border-radius: 99px; font-size: 11px;
}
.dc-quest-hero {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.dc-quest-icon {
    font-size: 44px; flex-shrink: 0; line-height: 1;
    animation: dcFloat 3s ease-in-out infinite;
}
@keyframes dcFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.dc-quest-info { flex: 1; }
.dc-quest-title {
    font-size: 20px; font-weight: 900; color: #fff;
    letter-spacing: -.3px; margin-bottom: 3px;
}
.dc-quest-desc { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.85); }
.dc-quest-xp {
    text-align: center; flex-shrink: 0;
    font-size: 26px; font-weight: 900; color: #FFC800;
    text-shadow: 0 2px 0 rgba(0,0,0,.2); line-height: 1;
}
.dc-quest-xp span {
    display: block; font-size: 11px; font-weight: 900;
    color: rgba(255,200,0,.8); text-transform: uppercase; letter-spacing: 1px;
}
.dc-quest-bar-track {
    height: 10px; background: rgba(255,255,255,.25);
    border-radius: 99px; overflow: hidden; margin-bottom: 6px;
}
.dc-quest-bar-fill {
    height: 100%; background: #FFC800; border-radius: 99px;
    border-top: 3px solid rgba(255,255,255,.4);
    transition: width 1s cubic-bezier(.4,0,.2,1); min-width: 0;
}
.dc-quest-progress-row {
    display: flex; justify-content: space-between;
    font-size: 11px; font-weight: 800; color: rgba(255,255,255,.7);
    margin-bottom: 14px;
}
.dc-quest-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 14px 20px;
    background: #FFC800; color: #111827;
    font-size: 16px; font-weight: 900; font-family: inherit;
    border-radius: 16px; border: 2px solid #E5B400; border-bottom: 5px solid #E5B400;
    cursor: pointer; letter-spacing: -.2px;
    transition: transform .1s, border-bottom-width .1s;
}
.dc-quest-btn:active { border-bottom-width: 2px; transform: translateY(3px); }
.dc-quest-arrow { font-size: 20px; font-weight: 900; }
.dc-quest-done {
    background: linear-gradient(135deg, #58CC02 0%, #48a800 100%);
    border-color: #58A700;
}
.dc-quest-done-confetti {
    position: absolute; top: -10px; right: -5px;
    font-size: 80px; opacity: .15; pointer-events: none; transform: rotate(15deg);
}
.dc-quest-done-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.dc-quest-done-check {
    width: 52px; height: 52px; flex-shrink: 0;
    background: rgba(255,255,255,.25); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 900; color: #fff;
    border: 3px solid rgba(255,255,255,.4);
    animation: dcCheckPop .5s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes dcCheckPop {
    from { transform: scale(0) rotate(-20deg); opacity: 0; }
    to   { transform: scale(1) rotate(0deg);   opacity: 1; }
}
.dc-quest-done-title { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -.3px; }
.dc-quest-done-sub { font-size: 13px; font-weight: 800; color: rgba(255,255,255,.8); margin-top: 2px; }
.dc-quest-done-msg {
    font-size: 14px; font-weight: 800; color: rgba(255,255,255,.9);
    background: rgba(255,255,255,.15); border-radius: 12px;
    padding: 10px 14px; margin-bottom: 16px; font-style: italic;
}
.dc-quest-tomorrow { background: rgba(0,0,0,.15); border-radius: 16px; padding: 14px 16px; }
.dc-quest-tomorrow-label {
    font-size: 11px; font-weight: 900; text-transform: uppercase;
    letter-spacing: 1.5px; color: rgba(255,255,255,.7); margin-bottom: 4px;
}
.dc-quest-tomorrow-timer {
    font-size: 32px; font-weight: 900; color: #FFC800;
    text-shadow: 0 2px 0 rgba(0,0,0,.2); margin-bottom: 12px; line-height: 1;
}
.dc-quest-tomorrow-preview {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.12); border-radius: 12px; padding: 10px 12px;
}
.dc-tomorrow-icon { font-size: 28px; flex-shrink: 0; }
.dc-tomorrow-name { font-size: 14px; font-weight: 900; color: #fff; margin-bottom: 2px; }
.dc-tomorrow-desc { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.75); }
@keyframes wormPop { from{transform:scale(.8);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes wormWiggle { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
    `;
    document.head.appendChild(style);
}

// ── RENDER WIDGET ────────────────────────────────────────────
function renderDailyChallengeWidget(context) {
    const challenge  = getTodaysChallenge();
    const tomorrow   = getTomorrowsChallenge();
    const progress   = getStoredProgress(challenge);
    const isComplete = progress >= challenge.target;
    const pct        = Math.min(100, Math.round((progress / challenge.target) * 100));
    const time       = getTimeUntilMidnight();

    injectCSS();

    if (isComplete) return renderCompletedState(challenge, tomorrow, time);
    return renderActiveState(challenge, progress, pct, time, context);
}

// ── ACTIVE STATE ─────────────────────────────────────────────
function renderActiveState(challenge, progress, pct, time, context) {
    const timerId = 'dc-quest-timer-' + Math.random().toString(36).slice(2, 7);

    setInterval(function() {
        var el = document.getElementById(timerId);
        if (!el) return;
        var t = getTimeUntilMidnight();
        el.textContent = '⏰ ' + t.label + ' left';
    }, 60000);

    return '<div class="dc-quest-card" id="dc-quest-card">'
        + '<div class="dc-quest-glow"></div>'
        + '<div class="dc-quest-top">'
        + '<div class="dc-quest-eyebrow">'
        + '<span>⚔️ Daily Quest</span>'
        + '<span class="dc-quest-timer" id="' + timerId + '">⏰ ' + time.label + ' left</span>'
        + '</div>'
        + '<div class="dc-quest-hero">'
        + '<div class="dc-quest-icon">' + challenge.icon + '</div>'
        + '<div class="dc-quest-info">'
        + '<div class="dc-quest-title">' + challenge.title + '</div>'
        + '<div class="dc-quest-desc">' + challenge.description + '</div>'
        + '</div>'
        + '<div class="dc-quest-xp">+' + challenge.xpReward + '<span>XP</span></div>'
        + '</div>'
        + '</div>'
        + '<div class="dc-quest-progress">'
        + '<div class="dc-quest-bar-track"><div class="dc-quest-bar-fill" style="width:' + pct + '%"></div></div>'
        + '<div class="dc-quest-progress-row"><span>' + progress + ' / ' + challenge.target + '</span><span>' + pct + '% complete</span></div>'
        + '</div>'
        + '<button class="dc-quest-btn">' + challenge.ctaLabel + ' <span class="dc-quest-arrow">›</span></button>'
        + '</div>';
}

// ── COMPLETED STATE ──────────────────────────────────────────
function renderCompletedState(challenge, tomorrow, time) {
    const timerId = 'dc-tomorrow-timer-' + Math.random().toString(36).slice(2, 7);

    setInterval(function() {
        var el = document.getElementById(timerId);
        if (!el) return;
        var t = getTimeUntilMidnight();
        el.textContent = t.label;
    }, 60000);

    return '<div class="dc-quest-card dc-quest-done">'
        + '<div class="dc-quest-done-confetti">🎊</div>'
        + '<div class="dc-quest-done-top">'
        + '<div class="dc-quest-done-check">✓</div>'
        + '<div><div class="dc-quest-done-title">Quest Complete!</div>'
        + '<div class="dc-quest-done-sub">' + challenge.title + ' · +' + challenge.xpReward + ' XP earned</div></div>'
        + '</div>'
        + '<div class="dc-quest-done-msg">' + challenge.motivational + '</div>'
        + '<div class="dc-quest-tomorrow">'
        + '<div class="dc-quest-tomorrow-label">⏳ Next challenge unlocks in</div>'
        + '<div class="dc-quest-tomorrow-timer" id="' + timerId + '">' + time.label + '</div>'
        + '<div class="dc-quest-tomorrow-preview">'
        + '<span class="dc-tomorrow-icon">' + tomorrow.icon + '</span>'
        + '<div><div class="dc-tomorrow-name">Tomorrow: ' + tomorrow.title + '</div>'
        + '<div class="dc-tomorrow-desc">' + tomorrow.description + '</div></div>'
        + '</div></div></div>';
}

// ── CHALLENGE CLICK MODAL ────────────────────────────────────
// Works on ANY lesson page — called by global event delegation below
function showChallengeClickModal() {
    var ch = getTodaysChallenge();
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    if (ch.id === 'early_bird') {
        // Early bird gets the worm treatment
        overlay.innerHTML = '<div style="background:linear-gradient(135deg,#FF9500 0%,#FFB800 100%);padding:36px 28px;border-radius:24px;border:2px solid #E5B400;border-bottom:6px solid #cc9000;text-align:center;max-width:360px;width:100%;font-family:Nunito,sans-serif;">'
            + '<div style="font-size:72px;margin-bottom:4px;display:inline-block;animation:wormWiggle 1s ease infinite;">🐦</div>'
            + '<div style="font-size:72px;margin-bottom:16px;display:inline-block;animation:wormWiggle 1s ease infinite .15s;">🪱</div>'
            + '<div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:8px;">THE EARLY BIRD GETS THE WORM!</div>'
            + '<div style="font-size:15px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:24px;">You absolute legend — most people are still asleep. Go smash this lesson! 🔥</div>'
            + '<button id="dc-modal-go" style="width:100%;padding:15px;background:#fff;color:#cc7000;border:none;border-radius:16px;font-size:17px;font-weight:900;cursor:pointer;margin-bottom:10px;box-shadow:0 4px 0 rgba(0,0,0,.15);">🌅 Let\'s get that worm — start now!</button>'
            + '<button id="dc-modal-close" style="background:none;border:none;color:rgba(255,255,255,.7);font-size:13px;font-weight:800;cursor:pointer;display:block;width:100%;">I\'ll do it later...</button>'
            + '</div>';
    } else {
        // All other challenges — coloured modal with launch sequence
        var bg  = ch.color       || '#1CB0F6';
        var acc = ch.colorAccent || '#FFC800';
        var shd = ch.colorShadow || '#E5B400';
        overlay.innerHTML = '<div id="dc-launch-card" style="background:' + bg + ';padding:36px 28px;border-radius:24px;border:2px solid ' + acc + ';border-bottom:6px solid ' + shd + ';text-align:center;max-width:360px;width:100%;font-family:Nunito,sans-serif;">'
            + '<div style="font-size:72px;margin-bottom:12px;display:inline-block;">' + ch.icon + '</div>'
            + '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:' + acc + ';margin-bottom:6px;">Challenge Accepted</div>'
            + '<div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px;margin-bottom:8px;">' + ch.title + '</div>'
            + '<div style="font-size:14px;font-weight:800;color:rgba(255,255,255,.8);margin-bottom:20px;line-height:1.6;">' + ch.description + '</div>'
            + '<div style="background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.2);border-radius:12px;padding:12px 14px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:8px;">'
            + '<span style="font-size:20px;">⚡</span>'
            + '<span style="font-size:14px;font-weight:900;color:' + acc + ';">+' + ch.xpReward + ' XP bonus on completion!</span>'
            + '</div>'
            + '<button id="dc-modal-go" style="width:100%;padding:16px;background:' + acc + ';color:#111827;border:2px solid ' + shd + ';border-bottom:5px solid ' + shd + ';border-radius:16px;font-size:17px;font-weight:900;cursor:pointer;margin-bottom:10px;letter-spacing:-.2px;">🚀 Let's do this!</button>'
            + '<button id="dc-modal-other" style="width:100%;padding:13px;background:rgba(255,255,255,.12);color:rgba(255,255,255,.8);border:2px solid rgba(255,255,255,.2);border-radius:16px;font-size:15px;font-weight:900;cursor:pointer;margin-bottom:10px;">🏠 Browse all lessons</button>'
            + '<button id="dc-modal-close" style="background:none;border:none;color:rgba(255,255,255,.4);font-size:13px;font-weight:800;cursor:pointer;display:block;width:100%;">maybe later</button>'
            + '</div>';
    }

    document.body.appendChild(overlay);

    document.getElementById('dc-modal-go').addEventListener('click', function() {
        var card = document.getElementById('dc-launch-card') || overlay.querySelector('div');
        // Dramatic scale-out
        card.style.transition = 'transform .2s ease, opacity .25s ease';
        card.style.transform  = 'scale(1.05)';
        setTimeout(function() {
            card.style.transform = 'scale(0)';
            card.style.opacity   = '0';
        }, 120);
        setTimeout(function() {
            overlay.remove();
            // Only activate HUD on lesson pages
            if (document.getElementById('sections')) {
                activateChallengeHUD(ch);
            }
        }, 350);
    });
    var otherBtn = document.getElementById('dc-modal-other');
    if (otherBtn) otherBtn.addEventListener('click', function() {
        window.location.href = '/';
    });
    document.getElementById('dc-modal-close').addEventListener('click', function() {
        overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

// ── CHALLENGE HUD LAUNCH SEQUENCE ────────────────────────────
// Full-screen flash → 3-second countdown → HUD slides in → scroll to lesson
function activateChallengeHUD(ch) {
    if (document.getElementById('dc-hud')) return; // already active

    var acc = ch.colorAccent || '#FFC800';
    var bg  = ch.color       || '#1CB0F6';
    var shd = ch.colorShadow || '#E5B400';

    // Inject HUD keyframes once
    if (!document.getElementById('dc-hud-styles')) {
        var s = document.createElement('style');
        s.id  = 'dc-hud-styles';
        s.textContent = `
@keyframes dcHudSlideIn  { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes dcHudPulse    { 0%,100%{opacity:1} 50%{opacity:.6} }
@keyframes dcFlashIn     { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }
@keyframes dcCountPop    { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        `;
        document.head.appendChild(s);
    }

    // 1. Full-screen colour flash
    var flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:' + bg + ';z-index:99990;pointer-events:none;animation:dcFlashIn .6s ease both;';
    document.body.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 650);

    // 2. Countdown overlay (3…2…1…GO!)
    var countEl = document.createElement('div');
    countEl.style.cssText = 'position:fixed;inset:0;z-index:99991;display:flex;align-items:center;justify-content:center;pointer-events:none;';
    document.body.appendChild(countEl);

    var counts = ['3', '2', '1', 'GO! 🚀'];
    var ci = 0;
    function showCount() {
        countEl.innerHTML = '<div style="font-size:120px;font-weight:900;font-family:Nunito,sans-serif;color:' + acc + ';text-shadow:0 4px 32px rgba(0,0,0,.4);animation:dcCountPop .35s cubic-bezier(.175,.885,.32,1.275) both;">' + counts[ci] + '</div>';
        ci++;
        if (ci < counts.length) {
            setTimeout(showCount, 700);
        } else {
            setTimeout(function() {
                countEl.remove();
                buildHUD(ch, acc, bg, shd);
                // Scroll to top of lesson content
                var sections = document.getElementById('sections') || document.querySelector('.lesson-banner');
                if (sections) sections.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 800);
        }
    }
    setTimeout(showCount, 300); // slight delay after flash

    function buildHUD(ch, acc, bg, shd) {
        var hud = document.createElement('div');
        hud.id  = 'dc-hud';
        hud.style.cssText = [
            'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9000',
            'background:' + bg,
            'border-bottom:3px solid ' + acc,
            'padding:10px 16px',
            'display:flex', 'align-items:center', 'justify-content:space-between', 'gap:12px',
            'font-family:Nunito,-apple-system,sans-serif',
            'animation:dcHudSlideIn .5s cubic-bezier(.175,.885,.32,1.275) both',
            'box-shadow:0 4px 24px rgba(0,0,0,.3)'
        ].join(';');

        hud.innerHTML = ''
            + '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">'
            +   '<span style="font-size:24px;flex-shrink:0;animation:dcHudPulse 2s ease infinite;">' + ch.icon + '</span>'
            +   '<div style="min-width:0;">'
            +     '<div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:' + acc + ';line-height:1;">' + ch.title + ' — Active</div>'
            +     '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.7);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + ch.motivational + '</div>'
            +   '</div>'
            + '</div>'
            + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
            +   '<div style="background:rgba(255,255,255,.12);border:2px solid ' + acc + ';border-radius:10px;padding:6px 12px;font-size:13px;font-weight:900;color:' + acc + ';white-space:nowrap;">+' + ch.xpReward + ' XP</div>'
            +   '<button id="dc-hud-dismiss" style="background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.2);border-radius:8px;color:rgba(255,255,255,.5);font-size:16px;font-weight:900;width:30px;height:30px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;">×</button>'
            + '</div>';

        document.body.prepend(hud);

        // Push content down so HUD doesn't cover sticky header
        var existingPad = parseInt(document.body.style.paddingTop) || 0;
        document.body.style.paddingTop = (existingPad + hud.offsetHeight) + 'px';

        document.getElementById('dc-hud-dismiss').addEventListener('click', function() {
            hud.style.transition = 'transform .3s ease, opacity .3s ease';
            hud.style.transform  = 'translateY(-110%)';
            hud.style.opacity    = '0';
            setTimeout(function() { hud.remove(); }, 320);
        });
    }
}

// ── GLOBAL EVENT DELEGATION ──────────────────────────────────
// Listens at document level so it works on every lesson page automatically.
// No per-page wiring ever needed.
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.dc-quest-btn');
    if (!btn) return;
    e.preventDefault();
    if (typeof openPicker === 'function') { openPicker(); return; }
    showChallengeClickModal(getTodaysChallenge());
});

// ── UPDATE PROGRESS ──────────────────────────────────────────
async function updateChallengeProgress(lessonData) {
    const challenge = getTodaysChallenge();
    const today     = new Date().toDateString();
    const current   = getStoredProgress(challenge);
    const next      = challenge.checkProgress(current, lessonData);

    localStorage.setItem('dailyChallenge', JSON.stringify({
        date:        today,
        challengeId: challenge.id,
        progress:    next,
        completed:   next >= challenge.target,
    }));

    if (next >= challenge.target && current < challenge.target) {
        return { justCompleted: true, xpEarned: challenge.xpReward, challenge };
    }
    return { justCompleted: false, progress: next, target: challenge.target };
}

// ── CELEBRATION MODAL ────────────────────────────────────────
function showChallengeCompletionCelebration(challenge) {
    const tomorrow = getTomorrowsChallenge();
    const time     = getTimeUntilMidnight();

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = '<div style="background:linear-gradient(135deg,#58CC02 0%,#48a800 100%);padding:36px 28px;border-radius:24px;border:2px solid #58A700;border-bottom:6px solid #48a800;text-align:center;max-width:380px;width:100%;font-family:Nunito,sans-serif;color:#fff;">'
        + '<div style="font-size:72px;margin-bottom:8px;">' + challenge.icon + '</div>'
        + '<div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.75);margin-bottom:6px;">Quest Complete!</div>'
        + '<div style="font-size:28px;font-weight:900;letter-spacing:-.5px;margin-bottom:8px;">' + challenge.title + '</div>'
        + '<div style="font-size:14px;font-weight:800;color:rgba(255,255,255,.85);margin-bottom:20px;font-style:italic;">' + challenge.motivational + '</div>'
        + '<div style="background:rgba(255,255,255,.2);border-radius:16px;padding:16px;margin-bottom:16px;">'
        + '<div style="font-size:48px;font-weight:900;color:#FFC800;">+' + challenge.xpReward + ' XP</div>'
        + '<div style="font-size:12px;font-weight:800;color:rgba(255,255,255,.75);margin-top:4px;">Bonus reward earned!</div>'
        + '</div>'
        + '<div style="background:rgba(0,0,0,.2);border-radius:14px;padding:14px;margin-bottom:20px;text-align:left;">'
        + '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.65);margin-bottom:6px;">Next challenge in ' + time.label + '</div>'
        + '<div style="display:flex;align-items:center;gap:10px;">'
        + '<span style="font-size:28px;">' + tomorrow.icon + '</span>'
        + '<div><div style="font-size:15px;font-weight:900;">' + tomorrow.title + '</div>'
        + '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.75);">' + tomorrow.description + '</div></div>'
        + '</div></div>'
        + '<button id="dc-celeb-close" style="width:100%;padding:14px;background:#FFC800;color:#111827;border:2px solid #E5B400;border-bottom:4px solid #E5B400;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;font-family:inherit;">Let\'s go! 🎉</button>'
        + '</div>';

    document.body.appendChild(overlay);
    document.getElementById('dc-celeb-close').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ── PUBLIC API ───────────────────────────────────────────────
if (typeof window !== 'undefined') {
    window.DailyChallenges = {
        getTodaysChallenge,
        getTomorrowsChallenge,
        renderDailyChallengeWidget,
        updateChallengeProgress,
        showChallengeCompletionCelebration,
        DAILY_CHALLENGES,
    };
    console.log('⚔️ Daily Challenges loaded');
}
