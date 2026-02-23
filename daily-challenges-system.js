// ═══════════════════════════════════════════════════════════
// DAILY CHALLENGES SYSTEM
// Adds gamified daily challenges to boost engagement
// ═══════════════════════════════════════════════════════════

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


function getTodaysChallenge() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const challenges = Object.values(DAILY_CHALLENGES);
    
    // Map specific challenges to specific days
    const weekdayChallenges = [
        'perfect_score',      // Sunday
        'vocab_learner',      // Monday
        'speed_run',          // Tuesday
        'double_trouble',     // Wednesday
        'grammar_guru',       // Thursday
        'early_bird',         // Friday
        'weekend_warrior'     // Saturday
    ];
    
    // For weekend_warrior, only show on Saturday/Sunday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return DAILY_CHALLENGES.weekend_warrior;
    }
    
    // For other days, use the mapped challenge
    const challengeId = weekdayChallenges[dayOfWeek];
    return DAILY_CHALLENGES[challengeId] || challenges[dayOfWeek % challenges.length];
}

// Render daily challenge widget (for use in lessons)
function renderDailyChallengeWidget() {
    const challenge = getTodaysChallenge();
    const today = new Date().toDateString();
    
    // Get progress from localStorage (temporary until we implement DB tracking)
    const stored = localStorage.getItem('dailyChallenge');
    let progress = 0;
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today && data.challengeId === challenge.id) {
            progress = data.progress || 0;
        }
    }
    
    const isComplete = progress >= challenge.target;
    const progressPercent = Math.min(100, (progress / challenge.target) * 100);
    
    return `
        <div class="daily-challenge-widget" style="
            background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
            color: white;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        ">
            ${isComplete ? `
                <div style="position: absolute; top: 10px; right: 10px; background: rgba(16, 185, 129, 0.9); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800;">
                    ✓ COMPLETE
                </div>
            ` : ''}
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 16px;">
                <div style="font-size: 48px; animation: bounce 2s infinite;">${challenge.icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 700; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Today's Challenge
                    </div>
                    <div style="font-size: 20px; font-weight: 900; margin-bottom: 4px;">
                        ${challenge.title}
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        ${challenge.description}
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 12px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 13px; font-weight: 700;">Progress</span>
                    <span style="font-size: 13px; font-weight: 800;">${progress} / ${challenge.target}</span>
                </div>
                <div style="background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: white; height: 100%; width: ${progressPercent}%; transition: width 0.5s; box-shadow: 0 0 10px rgba(255,255,255,0.5);"></div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 16px; font-weight: 800;">
                    🎁 Reward: +${challenge.xpReward} XP
                </div>
                <div style="font-size: 12px; opacity: 0.9;" id="challenge-timer">
                    ⏰ Resets in ${getTimeUntilMidnight()}
                </div>
            </div>
        </div>
        
        <style>
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>
    `;
}

// Update challenge progress
async function updateChallengeProgress(lessonData) {
    const challenge = getTodaysChallenge();
    const today = new Date().toDateString();
    
    // Get current progress
    const stored = localStorage.getItem('dailyChallenge');
    let currentProgress = 0;
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today && data.challengeId === challenge.id) {
            currentProgress = data.progress || 0;
        }
    }
    
    // Calculate new progress
    const newProgress = challenge.checkProgress(currentProgress, lessonData);
    
    // Save progress
    localStorage.setItem('dailyChallenge', JSON.stringify({
        date: today,
        challengeId: challenge.id,
        progress: newProgress,
        completed: newProgress >= challenge.target
    }));
    
    // Check if just completed
    if (newProgress >= challenge.target && currentProgress < challenge.target) {
        return {
            justCompleted: true,
            xpEarned: challenge.xpReward,
            challenge: challenge
        };
    }
    
    return {
        justCompleted: false,
        progress: newProgress,
        target: challenge.target
    };
}

// Helper: Get time until midnight
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

// Update timer every minute
setInterval(() => {
    const timerEl = document.getElementById('challenge-timer');
    if (timerEl) {
        timerEl.textContent = `⏰ Resets in ${getTimeUntilMidnight()}`;
    }
}, 60000);

// Show celebration when challenge is completed
function showChallengeCompletionCelebration(challenge) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        z-index: 99998;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: scaleIn 0.4s;
            color: white;
        ">
            <div style="font-size: 80px; margin-bottom: 20px; animation: spin 1s;">${challenge.icon}</div>
            <h2 style="font-size: 28px; font-weight: 900; margin-bottom: 15px;">
                Challenge Complete!
            </h2>
            <p style="font-size: 18px; margin-bottom: 20px; opacity: 0.95;">
                ${challenge.title}
            </p>
            <div style="
                background: rgba(255,255,255,0.2);
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 25px;
            ">
                <div style="font-size: 48px; font-weight: 900;">+${challenge.xpReward} XP</div>
                <div style="font-size: 14px; opacity: 0.9; margin-top: 5px;">Bonus Reward!</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: white;
                color: #667EEA;
                border: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-weight: 800;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            ">
                Awesome! 🎉
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.DailyChallenges = {
        getTodaysChallenge,
        renderDailyChallengeWidget,
        updateChallengeProgress,
        showChallengeCompletionCelebration,
        DAILY_CHALLENGES
    };
}
