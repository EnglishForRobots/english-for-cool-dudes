// ═══════════════════════════════════════════════════════════
// DAILY CHALLENGES SYSTEM — daily-challenges-system.js
// v3.1 — fixes:
//  FIX E: Time-sensitive challenges show deadline timer not midnight
//  FIX F: HUD auto-restores reliably on lesson pages (DOMContentLoaded guard)
//  FIX G: Early Bird widget shows bird animation + urgency when active
// v3 — major update:
//  NEW: 9 new challenges, contextual rotation, bulletproof checkProgress
//  FIX: Dismiss persists across pages
// ═══════════════════════════════════════════════════════════

'use strict';

// ── SECTION LEVEL ORDER (for level_up challenge) ─────────
const SECTION_LEVELS = {
    'beginner':     1,
    'intermediate': 2,
    'advanced':     3,
    'business':     4,
    'tax':          4,
    'legal':        4,
};

const DAILY_CHALLENGES = {

    // ── EXISTING CHALLENGES ───────────────────────────────

    perfect_score: {
        id:           'perfect_score',
        title:        'PERFECT SCORE 💯',
        description:  'Zero mistakes. Zero. Absolute domination of this lesson.',
        icon:         '💯',
        target:       1,
        xpReward:     75,
        ctaLabel:     '💯 GO FOR PERFECTION',
        ctaAction:    'picker',
        motivational: "FLAWLESS!! You just proved you're built different. LEGEND. 🏆",
        color:        '#1a1a2e', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) => data?.perfectScore === true ? 1 : cur,
    },

    vocab_learner: {
        id:           'vocab_learner',
        title:        'Word BEAST 📚',
        description:  'Devour 10 new vocabulary words. Knowledge is POWER.',
        icon:         '📚',
        target:       10,
        xpReward:     50,
        ctaLabel:     '📚 HUNT THOSE WORDS',
        ctaAction:    'picker',
        motivational: "10 new words locked in your brain FOREVER. You're unstoppable! 🧠⚡",
        color:        '#6B21A8', colorAccent: '#CE82FF', colorShadow: '#A559D9',
        checkProgress: (cur, data) => Math.min(cur + (data?.vocabCount || 0), 10),
    },

    speed_run: {
        id:           'speed_run',
        title:        'SPEED DEMON ⚡',
        description:  'Smash a lesson in under 8 minutes. Fast brain. BIG XP.',
        icon:         '⚡',
        target:       1,
        xpReward:     60,
        ctaLabel:     '⚡ LAUNCH SPEED RUN',
        ctaAction:    'picker',
        motivational: "BLAZING FAST!! They said it couldn't be done. You said watch me. 🚀",
        color:        '#92400E', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) =>
            (data?.completionTime && data.completionTime < 480) ? 1 : cur,
    },

    double_trouble: {
        id:           'double_trouble',
        title:        'DOUBLE TROUBLE 🔥🔥',
        description:  'Two different lessons. Today. Because one just isn\'t enough.',
        icon:         '🔥',
        target:       2,
        xpReward:     100,
        ctaLabel:     '🔥 START LESSON #1',
        ctaAction:    'picker',
        motivational: "TWO LESSONS DOWN!! While everyone else napped, you DOMINATED. 🏆🏆",
        color:        '#991B1B', colorAccent: '#FF4B4B', colorShadow: '#EA2B2B',
        checkProgress: (cur, data) => {
            if (!data?.lessonId) return cur + 1; // fallback if no lessonId
            try {
                var stored = localStorage.getItem('dc_double_trouble_ids');
                var ids = stored ? JSON.parse(stored) : [];
                // Only count if this lesson hasn't been counted today
                if (ids.indexOf(data.lessonId) === -1) {
                    ids.push(data.lessonId);
                    localStorage.setItem('dc_double_trouble_ids', JSON.stringify(ids));
                    return Math.min(cur + 1, 2);
                }
            } catch(_) {}
            return cur;
        },
    },

    early_bird: {
        id:           'early_bird',
        title:        'EARLY BIRD 🐦',
        description:  'The worm is YOURS — complete a lesson before 10 AM!',
        icon:         '🐦',
        target:       1,
        xpReward:     50,
        ctaLabel:     '🌅 GRAB THAT WORM NOW',
        ctaAction:    'picker',
        motivational: "UP BEFORE THE WORLD AND ALREADY LEARNING?! You absolute MACHINE! 🌅🔥",
        color:        '#92400E', colorAccent: '#FFB800', colorShadow: '#cc9000',
        checkProgress: (cur) => new Date().getHours() < 10 ? 1 : cur,
    },

    weekend_warrior: {
        id:           'weekend_warrior',
        title:        'WEEKEND WARRIOR 🎮',
        description:  'Most people are chilling. You\'re LEVELLING UP. Respect.',
        icon:         '🎮',
        target:       1,
        xpReward:     75,
        ctaLabel:     '🎮 WARRIOR MODE: ON',
        ctaAction:    'picker',
        motivational: "WEEKEND WARRIOR STATUS UNLOCKED!! You chose growth over the sofa. ELITE. 🏆",
        color:        '#065F46', colorAccent: '#2BDECC', colorShadow: '#1FBFAF',
        checkProgress: (cur) => {
            var d = new Date().getDay();
            return (d === 0 || d === 6) ? 1 : cur;
        },
    },

    grammar_guru: {
        id:           'grammar_guru',
        title:        'GRAMMAR GURU 📝',
        description:  'Ace every grammar question. No errors. Pure mastery.',
        icon:         '📝',
        target:       1,
        xpReward:     60,
        ctaLabel:     '📝 SHOW YOUR MASTERY',
        ctaAction:    'picker',
        motivational: "GRAMMAR GURU ACHIEVED!! Your English is getting seriously DANGEROUS. The world isn't ready! 🌍⚡",
        color:        '#1e3a5f', colorAccent: '#1CB0F6', colorShadow: '#1899D6',
        checkProgress: (cur, data) => data?.grammarPerfect === true ? 1 : cur,
    },

    // ── NEW CHALLENGES ────────────────────────────────────

    night_owl: {
        id:           'night_owl',
        title:        'NIGHT OWL 🦉',
        description:  'The whole world is asleep. You\'re in here LEARNING. Iconic.',
        icon:         '🦉',
        target:       1,
        xpReward:     60,
        ctaLabel:     '🌙 OWL MODE: ACTIVATED',
        ctaAction:    'picker',
        motivational: "11PM AND YOU JUST CRUSHED A LESSON?! You are absolutely WILD for this. We love it. 🦉🔥",
        color:        '#1e1b4b', colorAccent: '#818CF8', colorShadow: '#6366F1',
        checkProgress: (cur) => new Date().getHours() >= 21 ? 1 : cur,
    },

    lunchtime_learner: {
        id:           'lunchtime_learner',
        title:        'LUNCH BREAK LEGEND 🥪',
        description:  'Sandwich in one hand, English in the other. That\'s EFFICIENCY.',
        icon:         '🥪',
        target:       1,
        xpReward:     50,
        ctaLabel:     '🥪 SMASH YOUR LUNCH BREAK',
        ctaAction:    'picker',
        motivational: "LUNCH BREAK LEGEND!! You just out-learned every single person eating at their desk. 🏆",
        color:        '#713f12', colorAccent: '#FCD34D', colorShadow: '#F59E0B',
        checkProgress: (cur) => {
            var h = new Date().getHours();
            return (h >= 12 && h < 14) ? 1 : cur;
        },
    },

    monday_motivation: {
        id:           'monday_motivation',
        title:        'MONDAY CRUSHER 💪',
        description:  'Monday is scared of you. Complete a lesson and PROVE IT.',
        icon:         '💪',
        target:       1,
        xpReward:     60,
        ctaLabel:     '💪 DESTROY MONDAY',
        ctaAction:    'picker',
        motivational: "MONDAY CRUSHED!! The week didn't stand a chance. You came in SWINGING. 🥊🔥",
        color:        '#1e3a5f', colorAccent: '#60A5FA', colorShadow: '#3B82F6',
        checkProgress: (cur) => new Date().getDay() === 1 ? 1 : cur,
    },

    friday_feeling: {
        id:           'friday_feeling',
        title:        'FRIDAY LEGEND 🎉',
        description:  'It\'s FRIDAY and you\'re still learning?! Absolute royalty.',
        icon:         '🎉',
        target:       1,
        xpReward:     65,
        ctaLabel:     '🎉 END THE WEEK IN STYLE',
        ctaAction:    'picker',
        motivational: "FRIDAY LEGEND CONFIRMED!! You learned ALL week and finished with a BANG. Royalty. 👑",
        color:        '#4c1d95', colorAccent: '#C084FC', colorShadow: '#A855F7',
        checkProgress: (cur) => new Date().getDay() === 5 ? 1 : cur,
    },

    hat_trick: {
        id:           'hat_trick',
        title:        'HAT TRICK 🎩🎩🎩',
        description:  'THREE lessons. ONE day. Pure. Unstoppable. POWER.',
        icon:         '🎩',
        target:       3,
        xpReward:     150,
        ctaLabel:     '🎩 GO FOR THE HAT TRICK',
        ctaAction:    'picker',
        motivational: "THREE LESSONS IN ONE DAY?! You are NOT human. You are a LANGUAGE MACHINE. 🤖🔥 LEGENDARY.",
        color:        '#064e3b', colorAccent: '#34D399', colorShadow: '#10B981',
        checkProgress: (cur, data) => {
            if (!data?.lessonId) return Math.min(cur + 1, 3);
            try {
                var stored = localStorage.getItem('dc_hat_trick_ids');
                var ids = stored ? JSON.parse(stored) : [];
                if (ids.indexOf(data.lessonId) === -1) {
                    ids.push(data.lessonId);
                    localStorage.setItem('dc_hat_trick_ids', JSON.stringify(ids));
                    return Math.min(cur + 1, 3);
                }
            } catch(_) {}
            return cur;
        },
    },

    perfectionist: {
        id:           'perfectionist',
        title:        'DOUBLE PERFECT 🌟🌟',
        description:  '100% on TWO different lessons. Anything less? Not your style.',
        icon:         '🌟',
        target:       2,
        xpReward:     120,
        ctaLabel:     '🌟 PERFECTION ONLY',
        ctaAction:    'picker',
        motivational: "DOUBLE PERFECTION!! Flawless. Twice. In one day. You don't miss. EVER. 💎👑",
        color:        '#1a1a2e', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) => {
            if (data?.perfectScore !== true) return cur;
            if (!data?.lessonId) return Math.min(cur + 1, 2);
            try {
                var stored = localStorage.getItem('dc_perfectionist_ids');
                var ids = stored ? JSON.parse(stored) : [];
                if (ids.indexOf(data.lessonId) === -1) {
                    ids.push(data.lessonId);
                    localStorage.setItem('dc_perfectionist_ids', JSON.stringify(ids));
                    return Math.min(cur + 1, 2);
                }
            } catch(_) {}
            return cur;
        },
    },

    comeback_kid: {
        id:           'comeback_kid',
        title:        'COMEBACK KID 🔄',
        description:  'You were away. Now you\'re BACK. And you\'re stronger than ever.',
        icon:         '🔄',
        target:       1,
        xpReward:     100,
        ctaLabel:     '🔄 MAKE YOUR COMEBACK',
        ctaAction:    'picker',
        motivational: "YOU CAME BACK AND YOU SMASHED IT!! The comeback is ALWAYS better than the setback. PROUD of you! 🙌🔥",
        color:        '#7c2d12', colorAccent: '#FB923C', colorShadow: '#EA580C',
        checkProgress: (cur) => {
            try {
                var last = localStorage.getItem('dc_last_lesson_date');
                if (!last) return cur;
                var lastDate = new Date(last);
                var today = new Date();
                var diffDays = Math.floor((today - lastDate) / 86400000);
                return diffDays >= 3 ? 1 : cur;
            } catch(_) {}
            return cur;
        },
    },

    section_hopper: {
        id:           'section_hopper',
        title:        'SECTION HOPPER 🦘',
        description:  'Mix it up! Try a completely different section today.',
        icon:         '🦘',
        target:       1,
        xpReward:     75,
        ctaLabel:     '🦘 JUMP TO SOMETHING NEW',
        ctaAction:    'picker',
        motivational: "SECTION HOPPER UNLOCKED!! Your brain is firing on ALL cylinders. Versatile genius! 🧠✨",
        color:        '#064e3b', colorAccent: '#2BDECC', colorShadow: '#1FBFAF',
        checkProgress: (cur, data) => {
            if (!data?.lessonSection) return cur;
            try {
                var last = localStorage.getItem('dc_last_lesson_section');
                if (!last) return 1;
                return data.lessonSection !== last ? 1 : cur;
            } catch(_) {}
            return cur;
        },
    },

    level_up: {
        id:           'level_up',
        title:        'LEVEL UP 📈',
        description:  'You\'ve outgrown easy. Go HARDER. You\'re ready.',
        icon:         '📈',
        target:       1,
        xpReward:     80,
        ctaLabel:     '📈 LEVEL UP RIGHT NOW',
        ctaAction:    'picker',
        motivational: "LEVELLED UP!! You chose the harder path and CONQUERED IT. That's how legends are made! 👑🚀",
        color:        '#1e3a5f', colorAccent: '#FFC800', colorShadow: '#E5B400',
        checkProgress: (cur, data) => {
            if (!data?.lessonSection) return cur;
            try {
                var last = localStorage.getItem('dc_last_lesson_section');
                if (!last) return cur;
                var lastLevel = SECTION_LEVELS[last] || 0;
                var thisLevel = SECTION_LEVELS[data.lessonSection] || 0;
                return thisLevel > lastLevel ? 1 : cur;
            } catch(_) {}
            return cur;
        },
    },
};

// ── CONTEXTUAL ROTATION ───────────────────────────────────
// Priority: contextual day/time checks first,
// then a 10-day rotating pool by day-of-year index.

var CHALLENGE_POOL = [
    'perfect_score',
    'speed_run',
    'double_trouble',
    'grammar_guru',
    'hat_trick',
    'comeback_kid',
    'section_hopper',
    'perfectionist',
    'level_up',
    'vocab_learner',
];

function getTodaysChallenge() {
    var now  = new Date();
    var day  = now.getDay();   // 0=Sun, 1=Mon … 6=Sat
    var hour = now.getHours();

    // 1. Weekend → always Weekend Warrior
    if (day === 0 || day === 6) return DAILY_CHALLENGES.weekend_warrior;

    // 2. Monday → Monday Motivation
    if (day === 1) return DAILY_CHALLENGES.monday_motivation;

    // 3. Friday → Friday Feeling
    if (day === 5) return DAILY_CHALLENGES.friday_feeling;

    // 4. Weekday before 10am → Early Bird
    if (hour < 10) return DAILY_CHALLENGES.early_bird;

    // 5. Weekday after 9pm → Night Owl
    if (hour >= 21) return DAILY_CHALLENGES.night_owl;

    // 6. Lunch window 12–2pm → Lunchtime Learner
    if (hour >= 12 && hour < 14) return DAILY_CHALLENGES.lunchtime_learner;

    // 7. Otherwise — rotating 10-day pool by day-of-year
    var start      = new Date(now.getFullYear(), 0, 1);
    var dayOfYear  = Math.floor((now - start) / 86400000);
    var idx        = dayOfYear % CHALLENGE_POOL.length;
    return DAILY_CHALLENGES[CHALLENGE_POOL[idx]];
}

function getTomorrowsChallenge() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // assume mid-morning for preview
    var day = tomorrow.getDay();
    if (day === 0 || day === 6) return DAILY_CHALLENGES.weekend_warrior;
    if (day === 1) return DAILY_CHALLENGES.monday_motivation;
    if (day === 5) return DAILY_CHALLENGES.friday_feeling;
    // rotating pool
    var start     = new Date(tomorrow.getFullYear(), 0, 1);
    var dayOfYear = Math.floor((tomorrow - start) / 86400000);
    var idx       = dayOfYear % CHALLENGE_POOL.length;
    return DAILY_CHALLENGES[CHALLENGE_POOL[idx]];
}

function isSameChallengeTomorrow() {
    var today    = getTodaysChallenge();
    var tomorrow = getTomorrowsChallenge();
    return today.id === tomorrow.id;
}

function getTimeUntilMidnight() {
    var now = new Date(), mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    var diff = mid - now;
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    return { h: h, m: m, label: h + 'h ' + m + 'm' };
}

// Returns the deadline for the current challenge.
// Time-sensitive challenges expire before midnight — show that deadline instead.
function getChallengeDeadline(challenge) {
    var now  = new Date();
    var h    = now.getHours();
    var min  = now.getMinutes();

    if (challenge.id === 'early_bird') {
        // Expires at 10:00am
        var minsLeft = (10 * 60) - (h * 60 + min);
        if (minsLeft <= 0) return { label: '⏰ Expired', urgent: true, expired: true };
        var hh = Math.floor(minsLeft / 60);
        var mm = minsLeft % 60;
        var urgent = minsLeft <= 30;
        var label = hh > 0 ? hh + 'h ' + mm + 'm left' : mm + 'm left';
        return { label: (urgent ? '🚨 ' : '⏰ ') + label, urgent: urgent, expired: false };
    }

    if (challenge.id === 'night_owl') {
        // Active from 21:00 to midnight
        var minsLeft = (24 * 60) - (h * 60 + min);
        if (h < 21) return { label: '🦉 Unlocks at 9pm', urgent: false, expired: false };
        var hh = Math.floor(minsLeft / 60);
        var mm = minsLeft % 60;
        var urgent = minsLeft <= 30;
        var label = hh > 0 ? hh + 'h ' + mm + 'm left' : mm + 'm left';
        return { label: (urgent ? '🚨 ' : '⏰ ') + label, urgent: urgent, expired: false };
    }

    if (challenge.id === 'lunchtime_learner') {
        // Active 12:00–14:00
        if (h < 12) {
            var minsTo = (12 * 60) - (h * 60 + min);
            var hh = Math.floor(minsTo / 60); var mm = minsTo % 60;
            return { label: '⏰ Unlocks in ' + (hh > 0 ? hh + 'h ' : '') + mm + 'm', urgent: false, expired: false };
        }
        if (h >= 14) return { label: '⏰ Expired', urgent: true, expired: true };
        var minsLeft = (14 * 60) - (h * 60 + min);
        var urgent = minsLeft <= 20;
        return { label: (urgent ? '🚨 ' : '⏰ ') + minsLeft + 'm left', urgent: urgent, expired: false };
    }

    // Default: time until midnight
    return getTimeUntilMidnight();
}

function getStoredProgress(challenge) {
    try {
        var stored = localStorage.getItem('dailyChallenge');
        if (!stored) return 0;
        var d = JSON.parse(stored);
        if (d.date === new Date().toDateString() && d.challengeId === challenge.id) {
            return d.progress || 0;
        }
    } catch(_) {}
    return 0;
}

// ── Clear per-lesson dedup lists at midnight ──────────────
// Called lazily on first load each day
(function clearDailyDedupIfNeeded() {
    try {
        var lastClear = localStorage.getItem('dc_dedup_date');
        var today = new Date().toDateString();
        if (lastClear !== today) {
            localStorage.removeItem('dc_double_trouble_ids');
            localStorage.removeItem('dc_hat_trick_ids');
            localStorage.removeItem('dc_perfectionist_ids');
            localStorage.setItem('dc_dedup_date', today);
        }
    } catch(_) {}
})();

// ── SESSION STORAGE — HUD persists across navigation ─────
var DC_HUD_KEY = 'dc_active_hud';

function storeHUDChallenge(ch) {
    try {
        sessionStorage.setItem(DC_HUD_KEY, JSON.stringify({
            id:           ch.id,
            title:        ch.title,
            icon:         ch.icon,
            xpReward:     ch.xpReward,
            motivational: ch.motivational,
            color:        ch.color,
            colorAccent:  ch.colorAccent,
            colorShadow:  ch.colorShadow,
        }));
        // Explicit accept always clears any previous dismiss
        sessionStorage.removeItem('dc_dismissed');
    } catch(_) {}
}

function loadHUDChallenge() {
    try {
        var raw = sessionStorage.getItem(DC_HUD_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch(_) { return null; }
}

function clearHUDChallenge() {
    try { sessionStorage.removeItem(DC_HUD_KEY); } catch(_) {}
}

// ── FIX D: acceptAndNavigate — public helper ─────────────
function acceptAndNavigate(challenge, destination) {
    storeHUDChallenge(challenge);
    window.location.href = destination || '/';
}

// ── CSS ───────────────────────────────────────────────────
function injectCSS() {
    if (document.getElementById('dc-styles')) return;
    var style = document.createElement('style');
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
.dc-quest-btn--active {
    background: #58CC02 !important;
    color: #fff !important;
    border-color: #58A700 !important;
    border-bottom-color: #48a800 !important;
    cursor: pointer !important;
    font-size: 15px;
    letter-spacing: -.1px;
    animation: dcBtnPulse 2.5s ease-in-out infinite;
}
.dc-quest-btn--active:active { border-bottom-width: 2px; transform: translateY(3px); }
@keyframes dcBtnPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(88,204,2,.55); }
    50%     { box-shadow: 0 0 0 7px rgba(88,204,2,0); }
}
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
.dc-bird-banner {
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #FF9500 0%, #FFB800 100%);
    border: 2px solid #E5B400; border-bottom: none;
    border-radius: 16px 16px 0 0; padding: 8px 16px;
    margin-bottom: -6px;
    font-family: 'Nunito', -apple-system, sans-serif;
}
.dc-bird-fly {
    font-size: 22px;
    animation: dcBirdFly 1.2s ease-in-out infinite;
    display: inline-block;
}
.dc-bird-worm {
    font-size: 18px;
    animation: wormWiggle .8s ease-in-out infinite;
    display: inline-block;
}
@keyframes dcBirdFly {
    0%,100% { transform: translateY(0) rotate(-5deg); }
    50%     { transform: translateY(-6px) rotate(5deg); }
}
.dc-quest-timer--urgent {
    background: rgba(255,50,50,.35) !important;
    color: #fff !important;
    animation: dcTimerPulse 1s ease-in-out infinite;
}
@keyframes dcTimerPulse {
    0%,100% { opacity: 1; }
    50%     { opacity: .6; }
}
.dc-quest-btn--urgent {
    background: #FF4B4B !important;
    border-color: #EA2B2B !important;
    border-bottom-color: #c92020 !important;
    animation: dcBtnPulse .8s ease-in-out infinite !important;
}
    `;
    document.head.appendChild(style);
}

// ── RENDER WIDGET ─────────────────────────────────────────
function renderDailyChallengeWidget(context) {
    var challenge  = getTodaysChallenge();
    var tomorrow   = getTomorrowsChallenge();
    var progress   = getStoredProgress(challenge);
    var isComplete = progress >= challenge.target;
    var pct        = Math.min(100, Math.round((progress / challenge.target) * 100));
    var time       = getTimeUntilMidnight();
    var deadline   = getChallengeDeadline(challenge);
    injectCSS();
    if (isComplete) return renderCompletedState(challenge, tomorrow, time);
    return renderActiveState(challenge, progress, pct, deadline, context);
}

function renderActiveState(challenge, progress, pct, deadline, context) {
    var timerId = 'dc-quest-timer-' + Math.random().toString(36).slice(2, 7);

    setInterval(function() {
        var el = document.getElementById(timerId);
        if (!el) return;
        var d = getChallengeDeadline(getTodaysChallenge());
        el.textContent = d.label;
    }, 30000); // update every 30s for time-sensitive challenges

    var hudInDOM  = !!document.getElementById('dc-hud');
    var hudStored = !!loadHUDChallenge();
    var isActive  = hudInDOM || hudStored;
    var onDash    = !!document.getElementById('dc-slot');

    // Early bird special: animated bird + urgency copy when active
    var isEarlyBird = challenge.id === 'early_bird';
    var isUrgent    = deadline.urgent;

    var btnLabel, btnClass;
    if (isActive && onDash) {
        btnLabel = challenge.icon + ' Continue Challenge →';
        btnClass = 'dc-quest-btn dc-quest-btn--active';
    } else if (isActive) {
        if (isEarlyBird) {
            btnLabel = isUrgent
                ? '🚨 HURRY! Get that worm before 10am! 🐦'
                : '🐦 Early Bird active — do this lesson NOW! 🪱';
        } else {
            btnLabel = challenge.icon + ' Challenge On! Let\'s do this 💪';
        }
        btnClass = 'dc-quest-btn dc-quest-btn--active' + (isUrgent ? ' dc-quest-btn--urgent' : '');
    } else {
        btnLabel = challenge.ctaLabel + ' <span class="dc-quest-arrow">›</span>';
        btnClass = 'dc-quest-btn';
    }

    // Early bird active: show flying bird animation above card
    var birdBanner = '';
    if (isEarlyBird && isActive) {
        birdBanner = '<div class="dc-bird-banner">'
            + '<span class="dc-bird-fly">🐦</span>'
            + '<span class="dc-bird-worm">🪱</span>'
            + '<span style="font-size:11px;font-weight:900;color:rgba(255,255,255,.9);text-transform:uppercase;letter-spacing:1px;">'
            + (isUrgent ? '⚠️ Less than 30 mins to grab that worm!' : 'The early bird gets the worm!')
            + '</span>'
            + '</div>';
    }

    // Card background — urgent early bird gets orange tint
    var cardStyle = '';
    if (isEarlyBird && isUrgent) {
        cardStyle = ' style="background:linear-gradient(135deg,#c05000 0%,#e07000 100%);border-color:#FF9500;"';
    }

    return birdBanner
        + '<div class="dc-quest-card" id="dc-quest-card"' + cardStyle + '>'
        + '<div class="dc-quest-glow"></div>'
        + '<div class="dc-quest-eyebrow">'
        + '<span>⚔️ Daily Quest</span>'
        + '<span class="dc-quest-timer' + (deadline.urgent ? ' dc-quest-timer--urgent' : '') + '" id="' + timerId + '">' + deadline.label + '</span>'
        + '</div>'
        + '<div class="dc-quest-hero">'
        + '<div class="dc-quest-icon">' + challenge.icon + '</div>'
        + '<div class="dc-quest-info">'
        + '<div class="dc-quest-title">' + challenge.title + '</div>'
        + '<div class="dc-quest-desc">' + challenge.description + '</div>'
        + '</div>'
        + '<div class="dc-quest-xp">+' + challenge.xpReward + '<span>XP</span></div>'
        + '</div>'
        + '<div class="dc-quest-progress">'
        + '<div class="dc-quest-bar-track"><div class="dc-quest-bar-fill" style="width:' + pct + '%"></div></div>'
        + '<div class="dc-quest-progress-row"><span>' + progress + ' / ' + challenge.target + '</span><span>' + pct + '% complete</span></div>'
        + '</div>'
        + '<button class="' + btnClass + '">' + btnLabel + '</button>'
        + '</div>';
}

function renderCompletedState(challenge, tomorrow, time) {
    var timerId = 'dc-tomorrow-timer-' + Math.random().toString(36).slice(2, 7);
    setInterval(function() {
        var el = document.getElementById(timerId);
        if (!el) return;
        var t = getTimeUntilMidnight();
        el.textContent = t.label;
    }, 60000);
    var sameChallenge = isSameChallengeTomorrow();
    var nextBlock;
    if (sameChallenge) {
        nextBlock = '<div class="dc-quest-tomorrow">'
            + '<div class="dc-quest-tomorrow-label">🎉 You\'re a Weekend Warrior!</div>'
            + '<div style="font-size:13px;font-weight:800;color:rgba(255,255,255,.8);margin-top:4px;">New challenge drops Monday — enjoy the weekend!</div>'
            + '</div>';
    } else {
        nextBlock = '<div class="dc-quest-tomorrow">'
            + '<div class="dc-quest-tomorrow-label">⏳ Next challenge unlocks in</div>'
            + '<div class="dc-quest-tomorrow-timer" id="' + timerId + '">' + time.label + '</div>'
            + '<div class="dc-quest-tomorrow-preview">'
            + '<span class="dc-tomorrow-icon">' + tomorrow.icon + '</span>'
            + '<div><div class="dc-tomorrow-name">Tomorrow: ' + tomorrow.title + '</div>'
            + '<div class="dc-tomorrow-desc">' + tomorrow.description + '</div></div>'
            + '</div></div>';
    }
    return '<div class="dc-quest-card dc-quest-done">'
        + '<div class="dc-quest-done-confetti">🎊</div>'
        + '<div class="dc-quest-done-top">'
        + '<div class="dc-quest-done-check">✓</div>'
        + '<div><div class="dc-quest-done-title">🏆 QUEST CRUSHED!!</div>'
        + '<div class="dc-quest-done-sub">' + challenge.title + ' · +' + challenge.xpReward + ' XP EARNED 🔥</div></div>'
        + '</div>'
        + '<div class="dc-quest-done-msg">' + challenge.motivational + '</div>'
        + nextBlock
        + '</div>';
}

// ── CONTEXT DETECTION ────────────────────────────────────
function isOnDashboard() { return !!document.getElementById('dc-slot'); }
function isOnLessonPage() {
    if (isOnDashboard()) return false;
    return !!(
        document.getElementById('sections')         ||
        document.querySelector('.quest-section')    ||
        document.getElementById('daily-challenge-widget')
    );
}

// ── CHALLENGE CLICK MODAL ─────────────────────────────────
function showChallengeClickModal() {
    var ch     = getTodaysChallenge();
    var onDash = isOnDashboard();
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';

    if (ch.id === 'early_bird') {
        overlay.innerHTML = '<div style="background:linear-gradient(135deg,#FF9500 0%,#FFB800 100%);padding:36px 28px;border-radius:24px;border:2px solid #E5B400;border-bottom:6px solid #cc9000;text-align:center;max-width:360px;width:100%;font-family:Nunito,sans-serif;">'
            + '<div style="font-size:72px;margin-bottom:4px;display:inline-block;animation:wormWiggle 1s ease infinite;">🐦</div>'
            + '<div style="font-size:72px;margin-bottom:16px;display:inline-block;animation:wormWiggle 1s ease infinite .15s;">🪱</div>'
            + '<div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:8px;">THE EARLY BIRD GETS THE WORM!</div>'
            + '<div style="font-size:15px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:24px;">You absolute legend — most people are still asleep. Go smash this lesson! 🔥</div>'
            + '<button id="dc-modal-go" style="width:100%;padding:15px;background:#fff;color:#cc7000;border:none;border-radius:16px;font-size:17px;font-weight:900;cursor:pointer;margin-bottom:10px;box-shadow:0 4px 0 rgba(0,0,0,.15);">🌅 Let\'s get that worm — start now!</button>'
            + '<button id="dc-modal-close" style="background:none;border:none;color:rgba(255,255,255,.7);font-size:13px;font-weight:800;cursor:pointer;display:block;width:100%;">I\'ll do it later...</button>'
            + '</div>';
    } else {
        var bg  = ch.color       || '#1CB0F6';
        var acc = ch.colorAccent || '#FFC800';
        var shd = ch.colorShadow || '#E5B400';
        var goLabel = onDash
            ? '🚀 Let\'s do this — pick a lesson!'
            : 'Let\'s do this! 🚀';
        overlay.innerHTML = '<div id="dc-launch-card" style="background:' + bg + ';padding:36px 28px;border-radius:24px;border:2px solid ' + acc + ';border-bottom:6px solid ' + shd + ';text-align:center;max-width:360px;width:100%;font-family:Nunito,sans-serif;">'
            + '<div style="font-size:72px;margin-bottom:12px;display:inline-block;">' + ch.icon + '</div>'
            + '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:' + acc + ';margin-bottom:6px;">Challenge Accepted</div>'
            + '<div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px;margin-bottom:8px;">' + ch.title + '</div>'
            + '<div style="font-size:14px;font-weight:800;color:rgba(255,255,255,.8);margin-bottom:20px;line-height:1.6;">' + ch.description + '</div>'
            + '<div style="background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.2);border-radius:12px;padding:12px 14px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:8px;">'
            + '<span style="font-size:20px;">⚡</span>'
            + '<span style="font-size:14px;font-weight:900;color:' + acc + ';">+' + ch.xpReward + ' XP bonus on completion!</span>'
            + '</div>'
            + '<button id="dc-modal-go" style="width:100%;padding:16px;background:' + acc + ';color:#111827;border:2px solid ' + shd + ';border-bottom:5px solid ' + shd + ';border-radius:16px;font-size:17px;font-weight:900;cursor:pointer;margin-bottom:10px;letter-spacing:-.2px;">' + goLabel + '</button>'
            + '<button id="dc-modal-close" style="background:none;border:none;color:rgba(255,255,255,.4);font-size:13px;font-weight:800;cursor:pointer;display:block;width:100%;">maybe later</button>'
            + '</div>';
    }

    document.body.appendChild(overlay);

    document.getElementById('dc-modal-go').addEventListener('click', function() {
        var card = document.getElementById('dc-launch-card') || overlay.querySelector('div');
        card.style.transition = 'transform .2s ease, opacity .25s ease';
        card.style.transform  = 'scale(1.05)';
        setTimeout(function() { card.style.transform = 'scale(0)'; card.style.opacity = '0'; }, 120);
        setTimeout(function() {
            overlay.remove();
            storeHUDChallenge(ch);
            if (isOnLessonPage()) {
                activateChallengeHUD(ch, false);
            } else {
                activateChallengeHUD(ch, true);
            }
        }, 350);
    });

    document.getElementById('dc-modal-close').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ── CHALLENGE HUD LAUNCH SEQUENCE ────────────────────────
function activateChallengeHUD(ch, navigateAfter) {
    if (document.getElementById('dc-hud')) return;

    var acc = ch.colorAccent || '#FFC800';
    var bg  = ch.color       || '#1CB0F6';
    var shd = ch.colorShadow || '#E5B400';

    if (!document.getElementById('dc-hud-styles')) {
        var s = document.createElement('style');
        s.id  = 'dc-hud-styles';
        s.textContent = ''
            + '@keyframes dcHudSlideIn { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }'
            + '@keyframes dcHudPulse   { 0%,100%{opacity:1} 50%{opacity:.6} }'
            + '@keyframes dcFlashIn    { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }'
            + '@keyframes dcCountPop   { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }'
            + '@keyframes dcDestPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }';
        document.head.appendChild(s);
    }

    var flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:' + bg + ';z-index:99990;pointer-events:none;animation:dcFlashIn .6s ease both;';
    document.body.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 650);

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
                if (navigateAfter) {
                    showLaunchRedirect(ch, acc, bg, shd);
                } else {
                    buildHUD(ch, acc, bg, shd);
                    var sections = document.getElementById('sections')
                        || document.querySelector('.quest-section.active')
                        || document.querySelector('.lesson-banner');
                    if (sections) sections.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
        }
    }
    setTimeout(showCount, 300);

    function showLaunchRedirect(ch, acc, bg, shd) {
        var redir = document.createElement('div');
        redir.style.cssText = 'position:fixed;inset:0;background:' + bg + ';z-index:99992;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-family:Nunito,sans-serif;';
        redir.innerHTML = ''
            + '<div style="font-size:96px;line-height:1;animation:dcDestPulse .6s ease-in-out infinite;">' + ch.icon + '</div>'
            + '<div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:-.5px;text-align:center;padding:0 24px;line-height:1.2;">' + ch.title + '</div>'
            + '<div style="font-size:16px;font-weight:900;color:' + acc + ';text-transform:uppercase;letter-spacing:3px;margin-top:4px;">ACTIVATED 🔥</div>';
        document.body.appendChild(redir);
        setTimeout(function() { window.location.href = '/?picker=1'; }, 900);
    }

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
            +     '<div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:' + acc + ';line-height:1;">' + ch.title + ' — Active 🔥</div>'
            +     '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.8);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + ch.motivational + '</div>'
            +   '</div>'
            + '</div>'
            + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
            +   '<div style="background:rgba(255,255,255,.12);border:2px solid ' + acc + ';border-radius:10px;padding:6px 12px;font-size:13px;font-weight:900;color:' + acc + ';white-space:nowrap;">+' + ch.xpReward + ' XP</div>'
            +   '<button id="dc-hud-dismiss" style="background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.2);border-radius:8px;color:rgba(255,255,255,.5);font-size:16px;font-weight:900;width:30px;height:30px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>'
            + '</div>';
        document.body.prepend(hud);
        var existingPad = parseInt(document.body.style.paddingTop) || 0;
        document.body.style.paddingTop = (existingPad + hud.offsetHeight) + 'px';
        document.getElementById('dc-hud-dismiss').addEventListener('click', function() {
            clearHUDChallenge();
            sessionStorage.setItem('dc_dismissed', new Date().toDateString());
            hud.style.transition = 'transform .3s ease, opacity .3s ease';
            hud.style.transform  = 'translateY(-110%)';
            hud.style.opacity    = '0';
            var pad = parseInt(document.body.style.paddingTop) || 0;
            document.body.style.paddingTop = Math.max(0, pad - hud.offsetHeight) + 'px';
            setTimeout(function() { hud.remove(); }, 320);
        });
        setTimeout(function() {
            var todaysCh = getTodaysChallenge();
            document.querySelectorAll('.dc-quest-btn').forEach(function(btn) {
                if (btn.classList.contains('dc-quest-btn--active')) return;
                btn.classList.add('dc-quest-btn--active');
                btn.innerHTML = todaysCh.icon + ' Challenge On! Let\'s do this 💪';
            });
        }, 600);
    }
}

// ── AUTO-RESTORE HUD ON LESSON PAGES ─────────────────────
function restoreHUDIfNeeded() {
    if (isOnDashboard()) return;

    var ch       = getTodaysChallenge();
    var progress = getStoredProgress(ch);
    if (progress >= ch.target) { clearHUDChallenge(); return; }

    // If user explicitly accepted a challenge (dc_active_hud is set),
    // always show — their accept overrides any previous dismiss.
    // Only skip if they dismissed AND there's no active stored challenge.
    var hasActiveHUD = !!loadHUDChallenge();
    var dismissed    = sessionStorage.getItem('dc_dismissed');
    if (!hasActiveHUD && dismissed === new Date().toDateString()) return;

    // Auto-store so HUD can read it (no-op if already stored from accept)
    storeHUDChallenge(ch);
    var stored = loadHUDChallenge();
    if (!stored) return;

    // Don't show if HUD already in DOM
    if (document.getElementById('dc-hud')) return;

    var acc = stored.colorAccent || '#FFC800';
    var bg  = stored.color       || '#1CB0F6';

    if (!document.getElementById('dc-hud-styles')) {
        var s = document.createElement('style');
        s.id  = 'dc-hud-styles';
        s.textContent = ''
            + '@keyframes dcHudSlideIn { from{transform:translateY(-110%);opacity:0} to{transform:translateY(0);opacity:1} }'
            + '@keyframes dcHudPulse   { 0%,100%{opacity:1} 50%{opacity:.6} }';
        document.head.appendChild(s);
    }

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

    // Early bird HUD gets extra urgency styling
    var deadline   = getChallengeDeadline(ch);
    var timerColor = deadline.urgent ? '#FF4B4B' : acc;
    var deadlineChip = '<div style="background:rgba(0,0,0,.2);border-radius:8px;padding:3px 8px;font-size:11px;font-weight:900;color:' + timerColor + ';white-space:nowrap;">' + deadline.label + '</div>';

    hud.innerHTML = ''
        + '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">'
        +   '<span style="font-size:24px;flex-shrink:0;animation:dcHudPulse 2s ease infinite;">' + stored.icon + '</span>'
        +   '<div style="min-width:0;">'
        +     '<div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:' + acc + ';line-height:1;">' + stored.title + ' — Active 🔥</div>'
        +     '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.8);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + stored.motivational + '</div>'
        +   '</div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
        +   deadlineChip
        +   '<div style="background:rgba(255,255,255,.12);border:2px solid ' + acc + ';border-radius:10px;padding:6px 12px;font-size:13px;font-weight:900;color:' + acc + ';white-space:nowrap;">+' + stored.xpReward + ' XP</div>'
        +   '<button id="dc-hud-dismiss" style="background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.2);border-radius:8px;color:rgba(255,255,255,.5);font-size:16px;font-weight:900;width:30px;height:30px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>'
        + '</div>';

    document.body.prepend(hud);
    var existingPad = parseInt(document.body.style.paddingTop) || 0;
    document.body.style.paddingTop = (existingPad + hud.offsetHeight) + 'px';

    document.getElementById('dc-hud-dismiss').addEventListener('click', function() {
        clearHUDChallenge();
        sessionStorage.setItem('dc_dismissed', new Date().toDateString());
        hud.style.transition = 'transform .3s ease, opacity .3s ease';
        hud.style.transform  = 'translateY(-110%)';
        hud.style.opacity    = '0';
        var pad = parseInt(document.body.style.paddingTop) || 0;
        document.body.style.paddingTop = Math.max(0, pad - hud.offsetHeight) + 'px';
        setTimeout(function() { hud.remove(); }, 320);
    });

    setTimeout(function() {
        var todaysCh = getTodaysChallenge();
        document.querySelectorAll('.dc-quest-btn').forEach(function(btn) {
            if (btn.classList.contains('dc-quest-btn--active')) return;
            btn.classList.add('dc-quest-btn--active');
            btn.innerHTML = todaysCh.icon + ' Challenge On! Let\'s do this 💪';
        });
    }, 600);
}

// Run after DOM ready — fixes padding calculation on cold page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(restoreHUDIfNeeded, 200);
    });
} else {
    // DOM already ready (script loaded late / deferred)
    setTimeout(restoreHUDIfNeeded, 200);
}

// ── GLOBAL EVENT DELEGATION ───────────────────────────────
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.dc-quest-btn');
    if (!btn) return;
    e.preventDefault();

    var ch = getTodaysChallenge();

    // "Continue Challenge" button — challenge already active, send to picker
    if (btn.classList.contains('dc-quest-btn--active')) {
        if (isOnDashboard()) {
            // Full launch sequence then open picker
            activateChallengeHUD(ch, true);
        } else {
            // Already on a lesson page — scroll to lesson content
            var target = document.getElementById('sections')
                || document.querySelector('.quest-section')
                || document.querySelector('.lesson-banner');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }

    // Dashboard registers _dcButtonHandler — still run full launch
    if (typeof window._dcButtonHandler === 'function') {
        window._dcButtonHandler(ch);
        return;
    }

    // HUD already showing on a lesson page — scroll to content
    if (document.getElementById('dc-hud')) {
        var target = document.getElementById('sections')
            || document.querySelector('.quest-section')
            || document.querySelector('.lesson-banner');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    // On a lesson page without HUD — activate it here
    if (isOnLessonPage()) {
        activateChallengeHUD(ch, false);
        return;
    }

    // On index — open picker directly if available, else show modal
    if (typeof openPicker === 'function') { openPicker(); return; }
    showChallengeClickModal();
});

// ── UPDATE PROGRESS ───────────────────────────────────────
async function updateChallengeProgress(lessonData) {
    var challenge = getTodaysChallenge();
    var today     = new Date().toDateString();
    var current   = getStoredProgress(challenge);
    var next      = challenge.checkProgress(current, lessonData);
    localStorage.setItem('dailyChallenge', JSON.stringify({
        date:        today,
        challengeId: challenge.id,
        progress:    next,
        completed:   next >= challenge.target,
    }));
    if (next >= challenge.target && current < challenge.target) {
        clearHUDChallenge();
        return { justCompleted: true, xpEarned: challenge.xpReward, challenge: challenge };
    }
    return { justCompleted: false, progress: next, target: challenge.target };
}

// ── CELEBRATION MODAL ─────────────────────────────────────
function showChallengeCompletionCelebration(challenge) {
    var tomorrow = getTomorrowsChallenge();
    var time     = getTimeUntilMidnight();
    var overlay  = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = '<div style="background:linear-gradient(135deg,#58CC02 0%,#48a800 100%);padding:36px 28px;border-radius:24px;border:2px solid #58A700;border-bottom:6px solid #48a800;text-align:center;max-width:380px;width:100%;font-family:Nunito,sans-serif;color:#fff;">'
        + '<div style="font-size:72px;margin-bottom:8px;">' + challenge.icon + '</div>'
        + '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,.8);margin-bottom:6px;">🏆 QUEST DESTROYED 🏆</div>'
        + '<div style="font-size:28px;font-weight:900;letter-spacing:-.5px;margin-bottom:8px;">' + challenge.title + '</div>'
        + '<div style="font-size:15px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:20px;font-style:italic;line-height:1.5;">' + challenge.motivational + '</div>'
        + '<div style="background:rgba(255,255,255,.2);border-radius:16px;padding:16px;margin-bottom:16px;">'
        + '<div style="font-size:48px;font-weight:900;color:#FFC800;text-shadow:0 2px 0 rgba(0,0,0,.2);">+' + challenge.xpReward + ' XP</div>'
        + '<div style="font-size:13px;font-weight:800;color:rgba(255,255,255,.8);margin-top:4px;">💰 BONUS XP BANKED!</div>'
        + '</div>'
        + '<div style="background:rgba(0,0,0,.2);border-radius:14px;padding:14px;margin-bottom:20px;text-align:left;">'
        + (isSameChallengeTomorrow()
            ? '<div style="font-size:13px;font-weight:800;color:rgba(255,255,255,.8);">New challenge drops Monday — enjoy the rest of the weekend! 🎉</div>'
            : '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.65);margin-bottom:6px;">Next challenge in ' + time.label + '</div>'
              + '<div style="display:flex;align-items:center;gap:10px;">'
              + '<span style="font-size:28px;">' + tomorrow.icon + '</span>'
              + '<div><div style="font-size:15px;font-weight:900;">' + tomorrow.title + '</div>'
              + '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.75);">' + tomorrow.description + '</div></div>'
              + '</div>'
          )
        + '</div>'
        + '<button id="dc-celeb-close" style="width:100%;padding:14px;background:#FFC800;color:#111827;border:2px solid #E5B400;border-bottom:4px solid #E5B400;border-radius:16px;font-size:17px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:-.2px;">LET\'S GO!! 🚀🔥</button>'
        + '</div>';
    document.body.appendChild(overlay);
    document.getElementById('dc-celeb-close').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ── PUBLIC API ────────────────────────────────────────────
if (typeof window !== 'undefined') {
    window.DailyChallenges = {
        getTodaysChallenge,
        getTomorrowsChallenge,
        renderDailyChallengeWidget,
        updateChallengeProgress,
        showChallengeCompletionCelebration,
        storeHUDChallenge,
        acceptAndNavigate,
        DAILY_CHALLENGES,
    };
    console.log('⚔️ Daily Challenges loaded v3 — ' + Object.keys(DAILY_CHALLENGES).length + ' challenges');
}
