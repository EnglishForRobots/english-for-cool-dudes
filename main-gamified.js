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
// HEADER AUTH UI — matches lesson page style
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
            <div style="display:flex;align-items:center;gap:8px;">

                <div style="display:flex;align-items:center;gap:4px;font-size:14px;font-weight:900;color:#FF4B4B;">
                    <span style="display:inline-block;animation:flick 1.8s ease-in-out infinite;">🔥</span>
                    <span>${stats.streak}</span>
                </div>

                <div style="background:rgba(28,176,246,.08);border:2px solid rgba(28,176,246,.2);border-radius:99px;padding:5px 12px;font-size:14px;font-weight:900;color:#1899D6;display:flex;align-items:center;gap:5px;">
                    ⚡ <span>${stats.xp.toLocaleString()} XP</span>
                </div>

                <a href="/dashboard-gamified/" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:rgba(28,176,246,.08);border:2px solid rgba(28,176,246,.2);border-bottom:4px solid rgba(28,176,246,.25);border-radius:10px;font-size:18px;text-decoration:none;transition:all .15s;flex-shrink:0;" title="My Dashboard">📊</a>

                <button onclick="handleSignOut()" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:rgba(255,75,75,.08);border:2px solid rgba(255,75,75,.25);border-bottom:4px solid rgba(255,75,75,.3);border-radius:10px;font-size:18px;cursor:pointer;font-family:inherit;transition:all .15s;flex-shrink:0;" title="Sign out">👋</button>

            </div>
        `;

        // Wire up sign out
        window.handleSignOut = async function() {
            if (window.EFCD_Auth?.signOut) {
                await window.EFCD_Auth.signOut();
            } else if (window.EFCD_Auth?.logout) {
                await window.EFCD_Auth.logout();
            } else if (window.efcdSupabaseClient) {
                await window.efcdSupabaseClient.auth.signOut();
                window.location.href = '/';
            }
        };

    } else {
        console.log('ℹ️ Rendering logged-out UI');
        
        container.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <a href="/login/" style="color:#667EEA;font-weight:700;text-decoration:none;padding:8px 16px;border-radius:6px;transition:all .2s;font-family:inherit;" onmouseover="this.style.color='#5A67D8'" onmouseout="this.style.color='#667EEA'">
                    Log In
                </a>
                <a href="/signup/" style="background:linear-gradient(135deg,#667EEA 0%,#764BA2 100%);color:white;padding:8px 20px;border-radius:6px;font-weight:700;text-decoration:none;box-shadow:0 2px 8px rgba(102,126,234,.3);transition:all .2s;font-family:inherit;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    🚀 Sign Up Free
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
            <a href="/dashboard-gamified/" style="
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
    const topTicker = document.getElementById('latest-updates-ticker');
    if (topTicker) { topTicker.style.display = 'none'; console.log('🗑️ Top ticker hidden'); }
    
    const bottomTicker = document.getElementById('pulse-ticker-text');
    if (bottomTicker) {
        const infoBox = bottomTicker.closest('.info-box');
        if (infoBox) { infoBox.style.display = 'none'; console.log('🗑️ Bottom ticker hidden'); }
    }
}

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
