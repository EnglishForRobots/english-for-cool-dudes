// ═══════════════════════════════════════════════════════════
// DAILY CHALLENGES SYSTEM — daily-challenges-system.js
// Passive display — progress completes automatically
// as users complete lessons. No button, no confusion.
// ═══════════════════════════════════════════════════════════

'use strict';

const DAILY_CHALLENGES = {
    perfect_score: {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Get 100% on any lesson',
        icon: '💯',
        target: 1,
        xpReward: 75,
        checkProgress: (currentProgress, lessonData) => {
            if (lessonData?.perfectScore === true) return 1;
            return 0;
        }
    },
    vocab_learner: {
        id: 'vocab_learner',
        title: 'Word Hunter',
        description: 'Learn 10 new vocabulary words',
        icon: '📚',
        target: 10,
        xpReward: 50,
        checkProgress: (currentProgress, lessonData) => {
            const vocabCount = lessonData?.vocabCount || 0;
            return Math.min(currentProgress + vocabCount, 10);
        }
    },
    speed_run: {
        id: 'speed_run',
        title: 'Speed Runner',
        description: 'Complete a lesson in under 8 minutes',
        icon: '⚡',
        target: 1,
        xpReward: 60,
        checkProgress: (currentProgress, lessonData) => {
            if (lessonData?.completionTime && lessonData.completionTime < 480) return 1;
            return 0;
        }
    },
    double_trouble: {
        id: 'double_trouble',
        title: 'Double Trouble',
        description: 'Complete 2 lessons today',
        icon: '🎯',
        target: 2,
        xpReward: 100,
        checkProgress: (currentProgress) => currentProgress + 1
    },
    early_bird: {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete a lesson before 10 AM',
        icon: '🐦',
        target: 1,
        xpReward: 50,
        checkProgress: (currentProgress) => {
            const hour = new Date().getHours();
            return hour < 10 ? 1 : 0;
        }
    },
    weekend_warrior: {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Learn on Saturday or Sunday',
        icon: '🎮',
        target: 1,
        xpReward: 75,
        checkProgress: (currentProgress) => {
            const day = new Date().getDay();
            return (day === 0 || day === 6) ? 1 : 0;
        }
    },
    grammar_guru: {
        id: 'grammar_guru',
        title: 'Grammar Guru',
        description: 'Get 100% on grammar exercises',
        icon: '📝',
        target: 1,
        xpReward: 60,
        checkProgress: (currentProgress, lessonData) => {
            if (lessonData?.grammarPerfect === true) return 1;
            return 0;
        }
    }
};

// ── Which challenge runs on which day ────────────────────────
function getTodaysChallenge() {
    const day = new Date().getDay(); // 0=Sun … 6=Sat
    const map = [
        'perfect_score',   // Sunday
        'vocab_learner',   // Monday
        'speed_run',       // Tuesday
        'double_trouble',  // Wednesday
        'grammar_guru',    // Thursday
        'early_bird',      // Friday
        'weekend_warrior', // Saturday
    ];
    if (day === 0 || day === 6) return DAILY_CHALLENGES.weekend_warrior;
    return DAILY_CHALLENGES[map[day]];
}

// ── Helper ───────────────────────────────────────────────────
function getTimeUntilMidnight() {
    const now = new Date(), mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
}

// ── PASSIVE WIDGET ───────────────────────────────────────────
// No button — progress fills automatically as users do lessons.
// Shown on homepage DC card and dashboard.
function renderDailyChallengeWidget() {
    const challenge = getTodaysChallenge();
    const today     = new Date().toDateString();

    let progress = 0;
    try {
        const stored = localStorage.getItem('dailyChallenge');
        if (stored) {
            const d = JSON.parse(stored);
            if (d.date === today && d.challengeId === challenge.id) progress = d.progress || 0;
        }
    } catch(_) {}

    const isComplete     = progress >= challenge.target;
    const progressPercent = Math.min(100, Math.round((progress / challenge.target) * 100));

    return `
        <div style="
            background: linear-gradient(135deg, #1CB0F6 0%, #0d8fd4 100%);
            border: 2px solid #1899D6;
            border-bottom: 6px solid #1899D6;
            border-radius: 24px;
            padding: 20px;
            position: relative;
            overflow: hidden;
            font-family: 'Nunito', -apple-system, sans-serif;
        ">
            <div style="position:absolute;right:-8px;bottom:-14px;font-size:90px;opacity:.12;pointer-events:none;user-select:none;">🏆</div>

            ${isComplete ? `
                <div style="position:absolute;top:12px;right:12px;background:#58CC02;color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:8px;border:2px solid #58A700;z-index:1;">
                    ✓ Done!
                </div>` : ''}

            <div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.8);margin-bottom:12px;">
                Today's Challenge
            </div>

            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;position:relative;z-index:1;">
                <span style="font-size:44px;display:block;">${challenge.icon}</span>
                <div>
                    <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-.3px;margin-bottom:3px;">${challenge.title}</div>
                    <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.9);">${challenge.description}</div>
                </div>
            </div>

            <div style="background:rgba(255,255,255,.25);border-radius:99px;height:10px;overflow:hidden;margin-bottom:8px;">
                <div style="background:#FFC800;height:100%;width:${progressPercent}%;border-radius:99px;border-top:3px solid rgba(255,255,255,.4);transition:width .8s ease;min-width:${progress > 0 ? '4px' : '0'};"></div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-size:12px;font-weight:800;color:rgba(255,255,255,.8);">${progress} / ${challenge.target}</div>
                <div style="font-size:12px;font-weight:800;color:rgba(255,255,255,.7);" id="challenge-timer">⏰ ${getTimeUntilMidnight()}</div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:2px solid rgba(255,255,255,.15);">
                <div style="font-size:14px;font-weight:900;color:#FFC800;">🎁 +${challenge.xpReward} XP</div>
                ${isComplete
                    ? `<div style="font-size:13px;font-weight:900;color:#FFC800;">✓ Reward earned!</div>`
                    : `<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.55);">Completes automatically as you learn</div>`
                }
            </div>
        </div>`;
}

// ── Update challenge progress (called from lesson complete) ──
async function updateChallengeProgress(lessonData) {
    const challenge = getTodaysChallenge();
    const today     = new Date().toDateString();

    let currentProgress = 0;
    try {
        const stored = localStorage.getItem('dailyChallenge');
        if (stored) {
            const d = JSON.parse(stored);
            if (d.date === today && d.challengeId === challenge.id) currentProgress = d.progress || 0;
        }
    } catch(_) {}

    const newProgress = challenge.checkProgress(currentProgress, lessonData);

    localStorage.setItem('dailyChallenge', JSON.stringify({
        date:      today,
        challengeId: challenge.id,
        progress:  newProgress,
        completed: newProgress >= challenge.target,
    }));

    if (newProgress >= challenge.target && currentProgress < challenge.target) {
        return { justCompleted: true, xpEarned: challenge.xpReward, challenge };
    }
    return { justCompleted: false, progress: newProgress, target: challenge.target };
}

// ── Celebration modal (still used when challenge completes) ──
function showChallengeCompletionCelebration(challenge) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;animation:dcFadeIn .3s;`;
    overlay.innerHTML = `
        <div style="background:linear-gradient(135deg,#1CB0F6 0%,#0d8fd4 100%);padding:40px 30px;border-radius:24px;border:2px solid #1899D6;border-bottom:6px solid #1899D6;text-align:center;max-width:380px;width:100%;animation:dcScaleIn .4s;color:white;font-family:'Nunito',sans-serif;">
            <div style="font-size:72px;margin-bottom:16px;">${challenge.icon}</div>
            <div style="font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.8);margin-bottom:8px;">Challenge Complete!</div>
            <div style="font-size:26px;font-weight:900;margin-bottom:20px;">${challenge.title}</div>
            <div style="background:rgba(255,255,255,.2);border-radius:16px;padding:20px;margin-bottom:24px;">
                <div style="font-size:48px;font-weight:900;color:#FFC800;">+${challenge.xpReward} XP</div>
                <div style="font-size:13px;font-weight:800;color:rgba(255,255,255,.8);margin-top:4px;">Bonus reward earned!</div>
            </div>
            <button onclick="this.closest('div[style]').remove()" style="background:#FFC800;color:#111827;border:2px solid #E5B400;border-bottom:4px solid #E5B400;padding:14px 32px;border-radius:16px;font-weight:900;font-size:16px;cursor:pointer;width:100%;font-family:inherit;">
                Let's go! 🎉
            </button>
        </div>`;
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes dcFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes dcScaleIn { from{transform:scale(.85);opacity:0} to{transform:scale(1);opacity:1} }
    `;
    document.head.appendChild(style);
}

// ── Timer tick ───────────────────────────────────────────────
setInterval(() => {
    const el = document.getElementById('challenge-timer');
    if (el) el.textContent = `⏰ ${getTimeUntilMidnight()}`;
}, 60000);

// ── Public API ───────────────────────────────────────────────
if (typeof window !== 'undefined') {
    window.DailyChallenges = {
        getTodaysChallenge,
        renderDailyChallengeWidget,
        updateChallengeProgress,
        showChallengeCompletionCelebration,
        DAILY_CHALLENGES,
    };
}
