// tickerData.js
// --- 1. DATA SOURCE ---
const LESSON_STATES = [
    { text: "☕ NEW! BEGINNER: The Legend of Coffee 🐐", href: "/coffee/" },
    { text: "🚨 NEW! BUSINESS: Damage Control ❗", href: "/crisismanagement/" },
    { text: "🐔 NEW! TAX: The Chicken Tax 🚚", href: "/chickentax/" },
    { text: "🏢 NEW! LEGAL: Corporate Empires 💼", href: "/corporateempires/" },
{ text: "🚨 NEW! INTERMEDIATE: AI on Patrol 👮", href: "/aipolicing/" },
{ text: "🦶 NEW! ADVANCED: Aussie Lifestyle 📺", href: "/barefoot/" },
    { text: "🧠 NEW! ADVANCED: Advanced Discourse Markers 🖊️", href: "/discourse/" },
    { text: "💸 NEW! TAX: Crypto - Cashing Out! 😎", href: "/crypto/" },
    { text: "📺 NEW! ADVANCED: Hollywood 2.0: The AI Revolution 🎬", href: "/aivideos/" },
    
    
];

// --- 2. INITIALIZATION: Set ticker immediately when this script loads ---
(function initializeTicker() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (ticker) {
        ticker.textContent = LESSON_STATES[0].text;
        ticker.href = LESSON_STATES[0].href;
        ticker.style.opacity = '1'; // Make it visible
    }
})();

// --- 3. ANIMATION LOGIC ---
let currentTickerIndex = 0; // Start at 0, will show first item initially

function updateTicker() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (!ticker) return;
    
    // Increment BEFORE updating, so next cycle shows index 1, then 2, etc.
    currentTickerIndex = (currentTickerIndex + 1) % LESSON_STATES.length;
    
    ticker.style.opacity = '0';
    
    setTimeout(() => {
        const newState = LESSON_STATES[currentTickerIndex];
        ticker.textContent = newState.text;
        ticker.href = newState.href;
        ticker.style.opacity = '1';
    }, 200);
}

function startTickerAnimation() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (!ticker) return;
    
    // Start 4-second interval
    setInterval(updateTicker, 4000);
    
    // Hover animation control
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animation = 'none';
        ticker.style.transform = 'scale(1.05)';
    });
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animation = 'pulse 2s infinite ease-in-out';
        ticker.style.transform = 'scale(1)';
    });
}
