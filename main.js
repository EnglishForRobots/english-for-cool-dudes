// =========================================
// MAIN.JS - WITH SUPABASE AUTHENTICATION
// =========================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎉 English For Cool Dudes - Loading...');
    
    // Wait a moment for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize authentication (make sure supabase-auth.js is loaded!)
    if (typeof initAuth === 'function') {
        await initAuth();
    } else {
        console.error("⚠️ initAuth function not found. Check if supabase-auth.js is loaded.");
    }
    
    // Update UI based on login status
    updateHeaderUI();
    
    // Initialize the personalized ticker
    initializeTicker();
});

// =========================================
// UPDATE HEADER WITH LOGIN STATUS
// =========================================
function updateHeaderUI() {
    // Check if auth functions exist
    if (typeof getCurrentUser !== 'function') return;

    const user = getCurrentUser();
    const headerContent = document.querySelector('.header-content');
    if (!headerContent) return;
    
    // Check if we already have auth buttons
    let authContainer = headerContent.querySelector('.header-auth');
    if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.className = 'header-auth';
        // FIXED: Used backticks ` for multi-line string to prevent SyntaxError
        authContainer.style.cssText = `
            margin-left: auto;
            display: flex; 
            align-items: center; 
            gap: 10px;
        `;
        headerContent.appendChild(authContainer);
    }
    
    if (user) {
        // Logged in - show user info and logout
        authContainer.innerHTML = `
            <a href="/dashboard/" style="
                color: #667EEA; 
                font-weight: 600; 
                text-decoration: none;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                👋 ${user.name}
            </a>
            <button onclick="logout()" style="
                background: #EF4444; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 6px; 
                font-weight: 600; 
                cursor: pointer;
                transition: all 0.2s;
            ">
                Logout
            </button>
        `;
    } else {
        // Not logged in - show login/signup buttons
        authContainer.innerHTML = `
            <a href="/login/" style="
                color: #667EEA; 
                font-weight: 600; 
                text-decoration: none;
                padding: 8px 16px;
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
                transition: all 0.2s;
            ">
                Sign Up
            </a>
        `;
    }
}

// =========================================
// PERSONALIZED TICKER
// =========================================
function initializeTicker() {
    const tickerEl = document.getElementById('pulse-ticker-text');
    if (!tickerEl) return;

    let user = null;
    if (typeof getCurrentUser === 'function') {
        user = getCurrentUser();
    }
    
    if (user) {
        // LOGGED IN - Show personalized progress
        showPersonalizedTicker(tickerEl, user);
    } else {
        // NOT LOGGED IN - Show the messages from tickerData.js
        showMotivationalTicker(tickerEl);
    }
}

function showPersonalizedTicker(tickerEl, user) {
    const stats = getUserStats();
    
    // Personalized messages for logged-in users
    const messages = [
        `🔥 ${stats.streak} day streak! Keep it going!`,
        `🎯 ${stats.lessonsCompleted} lessons completed - You're crushing it!`,
        `⭐ ${stats.totalPoints} points earned so far!`,
        `💪 You've learned ${stats.lessonsCompleted * 15} new words!`,
        `🚀 ${getMotivationalMessage(stats.streak)}`,
        `📊 Lesson completion rate: ${Math.min(100, stats.lessonsCompleted * 5)}%`
    ];

    // If no activity yet, show welcome messages
    if (stats.lessonsCompleted === 0) {
        messages.splice(0, messages.length,
            `👋 Welcome back, ${user.name}! Ready to start learning?`,
            `🎯 Your first lesson is waiting - let's build that streak!`,
            `✨ Complete a lesson today to start your streak!`,
            `🚀 Pick any lesson below to get started!`
        );
    }
    
    let currentIndex = 0;
    
    function updateTicker() {
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            // For personalized ticker, we just set text (no specific links)
            tickerEl.innerText = messages[currentIndex];
            tickerEl.removeAttribute('href');
            tickerEl.style.cursor = 'default';
            
            tickerEl.style.opacity = '1';
            currentIndex = (currentIndex + 1) % messages.length;
        }, 500);
    }
    
    // Initial display
    updateTicker(); // Call immediately to set first state
    
    // Rotate every 6 seconds
    setInterval(updateTicker, 6000);
    
    console.log('✅ Personalized ticker initialized');
}

function showMotivationalTicker(tickerEl) {
    // FIXED: Use tickerItems from tickerData.js if available, otherwise fallback
    let messages = [];
    
    if (typeof tickerItems !== 'undefined' && Array.isArray(tickerItems) && tickerItems.length > 0) {
        // Use your custom ticker data
        messages = tickerItems;
    } else {
        // Fallback if file missing
        messages = [
            { text: "📚 Sign up to track your progress and build streaks!", link: "/signup/" },
            { text: "🎯 Join now to save your lessons across all devices!", link: "/signup/" },
            { text: "🔥 Login to continue your learning journey!", link: "/login/" }
        ];
    }
    
    let currentIndex = 0;
    
    function updateTicker() {
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            const item = messages[currentIndex];
            
            // Handle both object format {text, link} and simple string format
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
    
    // Initial display
    // Start with opacity 0 so the first transition works
    tickerEl.style.opacity = '0'; 
    updateTicker();
    
    // Rotate every 7 seconds
    setInterval(updateTicker, 7000);
    
    console.log('✅ Office/Motivational ticker initialized');
}

function getMotivationalMessage(streak) {
    if (streak >= 30) return "You're a legend! 30+ day streak! 🏆";
    if (streak >= 14) return "Two weeks strong! Unstoppable! 💎";
    if (streak >= 7) return "One week streak! You're on fire! 🔥";
    if (streak >= 3) return "Three days in a row! Building habits! 💪";
    if (streak >= 1) return "Great start! Keep the momentum going! ⚡";
    return "Start your streak today! 🌟";
}
