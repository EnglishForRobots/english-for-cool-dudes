// =========================================
// MAIN-GAMIFIED.JS - FIXED VERSION
// =========================================

console.log('📦 Loading main-gamified.js...');

// Wait for auth system
window.efcdReady.then(init);

async function init() {
    console.log('🎬 Initializing UI components...');
    
    // Wait a bit for DOM to settle
    await new Promise(r => setTimeout(r, 200));
    
    updateHeaderUI();
    initializeTopTicker();
    initializeBottomTicker();
}

// =========================================
// HEADER AUTH UI
// =========================================

function updateHeaderUI() {
    console.log('🔧 Updating header UI...');
    
    const user = window.EFCD_Auth?.getCurrentUser();
    let container = document.getElementById('header-auth-container');
    
    if (!container) {
        // Create container if it doesn't exist
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            container = document.createElement('div');
            container.id = 'header-auth-container';
            headerContent.appendChild(container);
        } else {
            console.error('❌ Header not found');
            return;
        }
    }
    
    if (user) {
        console.log('✅ User logged in:', user.email);
        const stats = window.EFCD_Auth.getUserStats();
        
        container.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                margin-left: auto;
            ">
                <!-- User Stats Badge -->
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 2px solid #FED7AA;
                    box-shadow: 0 2px 8px rgba(251, 146, 60, 0.2);
                ">
                    <span style="
                        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                        color: white;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 800;
                    ">Lv.${stats.level}</span>
                    
                    <span style="
                        color: #92400E;
                        font-size: 14px;
                        font-weight: 700;
                    ">${stats.xp.toLocaleString()} XP</span>
                    
                    <span style="
                        color: #DC2626;
                        font-size: 16px;
                        font-weight: 800;
                    ">${stats.streakEmoji} ${stats.streak}</span>
                </div>
                
                <!-- Dashboard Link -->
                <a href="/dashboard/" style="
                    color: #667EEA;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    background: #EEF2FF;
                    border: 1px solid #C7D2FE;
                ">
                    👋 ${user.name}
                </a>
                
                <!-- Logout Button -->
                <button onclick="window.EFCD_Auth.logout()" style="
                    background: #EF4444;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                ">
                    Logout
                </button>
            </div>
        `;
    } else {
        console.log('ℹ️ User not logged in');
        
        container.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-left: auto;
            ">
                <a href="/login/" style="
                    color: #667EEA;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    transition: all 0.2s;
                ">
                    Login
                </a>
                
                <a href="/signup/" style="
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    text-decoration: none;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                    transition: all 0.2s;
                ">
                    Sign Up Free
                </a>
            </div>
        `;
    }
    
    console.log('✅ Header UI updated');
}

// =========================================
// TOP TICKER (Progress or News)
// =========================================

function initializeTopTicker() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (!ticker) {
        console.warn('⚠️ Top ticker element not found');
        return;
    }
    
    const user = window.EFCD_Auth?.getCurrentUser();
    
    if (user) {
        showProgressTicker(ticker);
    } else {
        showNewsTicker(ticker);
    }
}

function showProgressTicker(ticker) {
    const stats = window.EFCD_Auth.getUserStats();
    const progress = window.EFCD_Auth.getProgressToNextLevel(stats.xp);
    
    const messages = [
        `${stats.streakEmoji} ${stats.streak} day streak • ${stats.lessonsCompleted} lessons`,
        `Level ${stats.level} • ${progress.percent}% to next level`,
        `${stats.xp.toLocaleString()} XP • ${stats.achievementCount} achievements`
    ];
    
    let index = 0;
    
    function rotate() {
        ticker.style.opacity = '0';
        setTimeout(() => {
            ticker.textContent = messages[index];
            ticker.href = '/dashboard/';
            ticker.style.opacity = '1';
            index = (index + 1) % messages.length;
        }, 500);
    }
    
    rotate();
    setInterval(rotate, 6000);
    
    console.log('✅ Progress ticker initialized');
}

function showNewsTicker(ticker) {
    if (typeof latestTickerData !== 'undefined') {
        ticker.href = latestTickerData.link;
        ticker.textContent = latestTickerData.title;
        ticker.style.opacity = '1';
    } else {
        ticker.href = '/signup/';
        ticker.textContent = '🎉 Sign up free to track your progress!';
        ticker.style.opacity = '1';
    }
    
    console.log('✅ News ticker initialized');
}

// =========================================
// BOTTOM TICKER (Motivational Messages)
// =========================================

function initializeBottomTicker() {
    const ticker = document.getElementById('pulse-ticker-text');
    if (!ticker) {
        console.warn('⚠️ Bottom ticker element not found');
        return;
    }
    
    const user = window.EFCD_Auth?.getCurrentUser();
    
    if (user) {
        const stats = window.EFCD_Auth.getUserStats();
        const messages = [
            `🔥 Keep that ${stats.streak} day streak alive!`,
            `🎯 ${stats.lessonsCompleted} lessons completed - amazing!`,
            `⭐ ${stats.xp.toLocaleString()} XP earned!`,
            `🏆 ${stats.achievementCount} achievements unlocked!`
        ];
        rotateTicker(ticker, messages);
    } else {
        const messages = [
            { text: '📚 Sign up to track your progress!', link: '/signup/' },
            { text: '🎯 Join now to earn XP & achievements!', link: '/signup/' }
        ];
        rotateTicker(ticker, messages);
    }
    
    console.log('✅ Bottom ticker initialized');
}

function rotateTicker(ticker, messages) {
    let index = 0;
    
    function rotate() {
        ticker.style.opacity = '0';
        setTimeout(() => {
            const msg = messages[index];
            const text = msg.text || msg;
            const link = msg.link || null;
            
            ticker.textContent = text;
            if (link) {
                ticker.href = link;
            } else {
                ticker.removeAttribute('href');
            }
            ticker.style.opacity = '1';
            index = (index + 1) % messages.length;
        }, 500);
    }
    
    rotate();
    setInterval(rotate, 7000);
}

// Export functions
window.EFCD_UI = {
    updateHeaderUI,
    initializeTopTicker,
    initializeBottomTicker
};

console.log('✅ main-gamified.js loaded');
