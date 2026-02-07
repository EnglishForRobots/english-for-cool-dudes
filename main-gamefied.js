// =========================================
// MAIN.JS - WITH GAMIFICATION & AUTH UI
// =========================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎉 English For Cool Dudes - Loading...');
    
    // Wait for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize authentication
    if (typeof window.EFCD_Auth !== 'undefined' && window.EFCD_Auth.initAuth) {
        await window.EFCD_Auth.initAuth();
    } else {
        console.error("⚠️ Auth system not loaded. Check if supabase-auth-gamified.js is loaded.");
    }
    
    // Update UI based on login status
    updateHeaderUI();
    
    // Initialize tickers
    initializeTopTicker();
    initializeBottomTicker();
});

// =========================================
// HEADER AUTH UI (Login/Logout Buttons)
// =========================================

function updateHeaderUI() {
    if (typeof window.EFCD_Auth === 'undefined') return;

    const user = window.EFCD_Auth.getCurrentUser();
    const headerContent = document.querySelector('.header-content');
    if (!headerContent) return;
    
    let authContainer = headerContent.querySelector('.header-auth');
    if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.className = 'header-auth';
        authContainer.style.cssText = `
            margin-left: auto;
            display: flex; 
            align-items: center; 
            gap: 12px;
        `;
        headerContent.appendChild(authContainer);
    }
    
    if (user) {
        // LOGGED IN - Show stats and logout
        const stats = window.EFCD_Auth.getUserStats();
        
        authContainer.innerHTML = `
            <div class="user-stats" style="
                display: flex;
                align-items: center;
                gap: 10px;
                background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                padding: 6px 14px;
                border-radius: 20px;
                border: 1px solid #FED7AA;
            ">
                <span class="level-badge" style="
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 800;
                ">
                    Lv.${stats.level}
                </span>
                <span class="xp-count" style="
                    color: #92400E;
                    font-size: 13px;
                    font-weight: 700;
                ">
                    ${stats.xp.toLocaleString()} XP
                </span>
                <span class="streak-display" style="
                    color: #DC2626;
                    font-size: 14px;
                    font-weight: 800;
                ">
                    ${stats.streakEmoji} ${stats.streak}
                </span>
            </div>
            <a href="/dashboard/" style="
                color: #667EEA; 
                font-weight: 600; 
                text-decoration: none;
                padding: 8px 14px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            " onmouseover="this.style.color='#764BA2'" onmouseout="this.style.color='#667EEA'">
                👋 ${user.name}
            </a>
            <button onclick="window.EFCD_Auth.logout()" style="
                background: #EF4444; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 6px; 
                font-weight: 600; 
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">
                Logout
            </button>
        `;
    } else {
        // NOT LOGGED IN - Show login/signup buttons
        authContainer.innerHTML = `
            <a href="/login/" style="
                color: #667EEA; 
                font-weight: 600; 
                text-decoration: none;
                padding: 8px 16px;
                transition: all 0.2s;
            " onmouseover="this.style.color='#764BA2'" onmouseout="this.style.color='#667EEA'">
                Login
            </a>
            <a href="/signup/" style="
                background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                color: white; 
                padding: 8px 20px; 
                border-radius: 6px; 
                font-weight: 600; 
                text-decoration: none;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(102, 126, 234, 0.3)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(102, 126, 234, 0.2)'">
                Sign Up Free
            </a>
        `;
    }
}

// =========================================
// TOP TICKER (User Progress or Latest News)
// =========================================

function initializeTopTicker() {
    const tickerEl = document.getElementById('latest-updates-ticker');
    if (!tickerEl) return;

    let user = null;
    if (typeof window.EFCD_Auth !== 'undefined') {
        user = window.EFCD_Auth.getCurrentUser();
    }
    
    if (user) {
        // LOGGED IN - Show personalized progress
        showProgressTicker(tickerEl);
    } else {
        // NOT LOGGED IN - Show latest news
        showNewsTicker(tickerEl);
    }
}

function showProgressTicker(tickerEl) {
    if (typeof window.EFCD_Auth === 'undefined') return;
    
    const stats = window.EFCD_Auth.getUserStats();
    const progress = window.EFCD_Auth.getProgressToNextLevel(stats.xp);
    const levelInfo = window.EFCD_Auth.getLevelInfo(stats.level);
    
    // Build message parts
    const parts = [];
    
    // Streak
    if (stats.streak > 0) {
        parts.push(`${stats.streakEmoji} ${stats.streak} day streak`);
    }
    
    // Level progress
    if (stats.level < 6) {
        parts.push(`${progress.percent}% to Level ${stats.level + 1}`);
    } else {
        parts.push(`${levelInfo.name} Level!`);
    }
    
    // Total lessons
    parts.push(`${stats.lessonsCompleted} lessons completed`);
    
    // XP to next level
    if (stats.level < 6 && progress.remaining) {
        parts.push(`${progress.remaining} XP to level up!`);
    }
    
    const messages = [
        parts.slice(0, 2).join(' • '),
        parts.slice(1, 3).join(' • '),
        `🎯 ${parts[2]} • ${parts[0]}`
    ];
    
    let currentIndex = 0;
    
    function updateTicker() {
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            tickerEl.innerText = messages[currentIndex];
            tickerEl.href = '/dashboard/';
            tickerEl.style.cursor = 'pointer';
            tickerEl.style.opacity = '1';
            currentIndex = (currentIndex + 1) % messages.length;
        }, 500);
    }
    
    updateTicker();
    setInterval(updateTicker, 6000);
    
    console.log('✅ Progress ticker initialized');
}

function showNewsTicker(tickerEl) {
    // Use latestTickerData from tickerData.js
    if (typeof latestTickerData !== 'undefined') {
        tickerEl.href = latestTickerData.link;
        tickerEl.innerText = latestTickerData.title;
        tickerEl.style.opacity = '1';
    } else {
        // Fallback
        tickerEl.href = '/signup/';
        tickerEl.innerText = '🎉 Sign up free to track progress & earn achievements!';
        tickerEl.style.opacity = '1';
    }
    
    console.log('✅ News ticker initialized');
}

// =========================================
// BOTTOM TICKER (Rotating Messages)
// =========================================

function initializeBottomTicker() {
    const tickerEl = document.getElementById('pulse-ticker-text');
    if (!tickerEl) return;

    let user = null;
    if (typeof window.EFCD_Auth !== 'undefined') {
        user = window.EFCD_Auth.getCurrentUser();
    }
    
    if (user) {
        // LOGGED IN - Show motivational messages
        showMotivationalTicker(tickerEl, user);
    } else {
        // NOT LOGGED IN - Show signup messages
        showSignupTicker(tickerEl);
    }
}

function showMotivationalTicker(tickerEl, user) {
    const stats = window.EFCD_Auth.getUserStats();
    
    const messages = [
        { text: `🔥 Keep your ${stats.streak} day streak alive!`, link: null },
        { text: `🎯 ${stats.lessonsCompleted} lessons down - what's next?`, link: null },
        { text: `⭐ ${stats.xp.toLocaleString()} XP earned - keep learning!`, link: null },
        { text: `🏆 ${stats.achievementCount} achievements unlocked!`, link: '/dashboard/' },
        { text: `💪 You're a ${stats.levelName} - level up to ${stats.level + 1}!`, link: null }
    ];
    
    // Add achievement-specific messages
    if (stats.streak >= 7 && stats.streak < 30) {
        messages.push({ text: '💎 30-day streak = Diamond achievement!', link: null });
    }
    
    if (stats.lessonsCompleted >= 5 && stats.lessonsCompleted < 10) {
        messages.push({ text: '🏆 5 more lessons = Dedicated Learner badge!', link: null });
    }
    
    rotateTicker(tickerEl, messages);
}

function showSignupTicker(tickerEl) {
    let messages = [];
    
    if (typeof tickerItems !== 'undefined' && Array.isArray(tickerItems) && tickerItems.length > 0) {
        messages = tickerItems;
    } else {
        messages = [
            { text: "📚 Sign up to track your progress and build streaks!", link: "/signup/" },
            { text: "🎯 Join now to earn XP & unlock achievements!", link: "/signup/" },
            { text: "🔥 Login to continue your learning journey!", link: "/login/" }
        ];
    }
    
    rotateTicker(tickerEl, messages);
}

function rotateTicker(tickerEl, messages) {
    let currentIndex = 0;
    
    function updateTicker() {
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            const item = messages[currentIndex];
            const text = item.text || item;
            const link = item.link || null;
            
            tickerEl.innerText = text;
            
            if (link) {
                tickerEl.href = link;
                tickerEl.style.cursor = 'pointer';
            } else {
                tickerEl.removeAttribute('href');
                tickerEl.style.cursor = 'default';
            }
            
            tickerEl.style.opacity = '1';
            currentIndex = (currentIndex + 1) % messages.length;
        }, 500);
    }
    
    tickerEl.style.opacity = '0';
    updateTicker();
    setInterval(updateTicker, 7000);
    
    console.log('✅ Ticker initialized with', messages.length, 'messages');
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

function getMotivationalMessage(streak) {
    if (streak >= 30) return "You're a legend! 30+ day streak! 🏆";
    if (streak >= 14) return "Two weeks strong! Unstoppable! 💎";
    if (streak >= 7) return "One week streak! You're on fire! 🔥";
    if (streak >= 3) return "Three days in a row! Building habits! 💪";
    if (streak >= 1) return "Great start! Keep the momentum going! ⚡";
    return "Start your streak today! 🌟";
}

// Make functions available globally if needed
window.EFCD_UI = {
    updateHeaderUI,
    initializeTopTicker,
    initializeBottomTicker
};
