// tickerData.js
// --- 1. DATA SOURCE ---
const LESSON_STATES = [
    { text: "🎅🏻 NEW! TAX: The Audit Before Christmas 🎄", href: "/santatax/" },
    { text: "🍷 NEW! ADVANCED: The Science and Culture of Mulled Wine 😎", href: "/mulledwine/" },
    { text: "🎁 NEW! INTERMEDIATE: The History of Advent Calendars 😎", href: "/adventcalendarint/" },
    { text: "🎅🏻 NEW! BEGINNER: The Advent Calendar 😎", href: "/adventcalendar/" },
    { text: "🎵 NEW! LEGAL: Music vs. AI: The GEMA Ruling 😎", href: "/aicopyright/" },
    { text: "📦 NEW! ADVANCED: Alibaba: The E-Commerce Empire 😎", href: "/alibaba/" },
    { text: "🎤 NEW! BUSINESS: The Elevator Pitch 😎", href: "/elevator/" },
    { text: "🐢 NEW! INTERMEDIATE: Meet Jonathan the Tortoise 😎", href: "/jonathan/" },
    { text: "🧩 NEW! INTERMEDIATE: Top 10 Phrasal Verbs For Work 😎", href: "/phrasals/" },
    { text: "🌐 NEW! TAX: The Netflix Tax 🎬🍿", href: "/VATdigital/" },
    { text: "🚩 NEW! LEGAL: Due Diligence in M&A 💼", href: "/duediligence/" },
    { text: "🐢 NEW! BEGINNER: Amazing Animals: Jonathan T 🐢", href: "/tortoise/" },
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
