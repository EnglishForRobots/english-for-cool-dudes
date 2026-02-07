// =========================================
// MAIN-GAMIFIED.JS - CLEAN VERSION (NO TICKERS)
// =========================================

console.log('📦 Loading main-gamified.js...');

// Wait for initialization
if (typeof window.efcdReady !== 'undefined') {
    window.efcdReady.then(init);
} else {
    console.warn('⚠️ efcdReady not found, trying direct init');
    document.addEventListener('DOMContentLoaded', init);
}

async function init() {
    console.log('🎬 Initializing UI components...');
    
    // Wait for DOM to settle
    await new Promise(r => setTimeout(r, 200));
    
    updateHeaderUI();
    
    // Optional: Show welcome message for logged-in users
    showWelcomeMessage();
}

// =========================================
// HEADER AUTH UI (ENHANCED)
// =========================================

function updateHeaderUI() {
    console.log('🔧 Updating header UI...');
    
    if (typeof window.EFCD_Auth === 'undefined') {
        console.error('❌ EFCD_Auth not available');
        return;
    }
    
    const user = window.EFCD_Auth.getCurrentUser();
    let container = document.getElementById('header-auth-container');
    
    // Create container if missing
    if (!container) {
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            container = document.createElement('div');
            container.id = 'header-auth-container';
            container.style.cssText = 'margin-left: auto;';
            headerContent.appendChild(container);
        } else {
            console.error('❌ .header-content not found');
            return;
        }
    }
    
    if (user) {
        console.log('✅ Rendering logged-in UI for:', user.email);
        const stats = window.EFCD_Auth.getUserStats();
        
        container.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 12px;
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
                        letter-spacing: 0.5px;
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
                " onmouseover="this.style.background='#E0E7FF'" onmouseout="this.style.background='#EEF2FF'">
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
                " onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">
                    Logout
                </button>
            </div>
        `;
    } else {
        console.log('ℹ️ Rendering logged-out UI');
        
        container.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <a href="/login/" style="
                    color: #667EEA;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    transition: all 0.2s;
                " onmouseover="this.style.color='#5A67D8'" onmouseout="this.style.color='#667EEA'">
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
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(102, 126, 234, 0.3)'">
                    Sign Up Free
                </a>
            </div>
        `;
    }
    
    console.log('✅ Header UI updated');
}

// =========================================
// WELCOME MESSAGE (OPTIONAL)
// =========================================

function showWelcomeMessage() {
    if (typeof window.EFCD_Auth === 'undefined') return;
    
    const user = window.EFCD_Auth.getCurrentUser();
    if (!user) return;
    
    const stats = window.EFCD_Auth.getUserStats();
    
    // Check if we're on homepage
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    if (!isHomepage) return;
    
    // Find the container (the main content area)
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Check if welcome card already exists
    if (document.getElementById('welcome-card')) return;
    
    // Create welcome card (only if streak > 0 or recent activity)
    if (stats.streak > 0 || stats.lessonsCompleted > 0) {
        const welcomeCard = document.createElement('div');
        welcomeCard.id = 'welcome-card';
        welcomeCard.style.cssText = `
            background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
            border: 2px solid #C7D2FE;
            border-radius: 12px;
            padding: 20px 30px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        `;
        
        let message = `Welcome back, ${user.name}! `;
        if (stats.streak > 0) {
            message += `You're on a ${stats.streakEmoji} ${stats.streak} day streak!`;
        } else if (stats.lessonsCompleted > 0) {
            message += `You've completed ${stats.lessonsCompleted} lessons. Keep going!`;
        } else {
            message += `Ready to start learning?`;
        }
        
        welcomeCard.innerHTML = `
            <div style="flex: 1;">
                <div style="font-size: 18px; font-weight: 700; color: #1E293B; margin-bottom: 5px;">
                    ${message}
                </div>
                <div style="font-size: 14px; color: #64748B;">
                    Level ${stats.level} • ${stats.xp.toLocaleString()} XP • ${stats.achievementCount} achievements
                </div>
            </div>
            <a href="/dashboard/" style="
                background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                transition: all 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                View Dashboard →
            </a>
        `;
        
        // Insert at the beginning of container
        container.insertBefore(welcomeCard, container.firstChild);
        
        console.log('✅ Welcome card displayed');
    }
}

// =========================================
// HIDE TICKERS (IF THEY EXIST)
// =========================================

function hideTickers() {
    // Hide top ticker
    const topTicker = document.getElementById('latest-updates-ticker');
    if (topTicker) {
        topTicker.style.display = 'none';
        console.log('🗑️ Top ticker hidden');
    }
    
    // Hide bottom ticker
    const bottomTicker = document.getElementById('pulse-ticker-text');
    if (bottomTicker) {
        const infoBox = bottomTicker.closest('.info-box');
        if (infoBox) {
            infoBox.style.display = 'none';
            console.log('🗑️ Bottom ticker hidden');
        }
    }
}

// Hide tickers on load
document.addEventListener('DOMContentLoaded', hideTickers);

// =========================================
// EXPORT PUBLIC API
// =========================================

window.EFCD_UI = {
    updateHeaderUI,
    showWelcomeMessage,
    hideTickers
};

console.log('✅ main-gamified.js loaded successfully');
