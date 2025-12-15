// tickerData.js

// --- 1. DATA SOURCE ---
const LESSON_STATES = [
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

// --- 2. EXPORT FOR HTML (Crucial for Instant Load) ---
const latestTickerData = {
    title: LESSON_STATES[0].text,
    link: LESSON_STATES[0].href
};

// --- 3. ANIMATION LOGIC ---
let currentTickerIndex = 0;

function updateTicker() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (!ticker) return;
    
    currentTickerIndex = (currentTickerIndex + 1) % LESSON_STATES.length;
    ticker.style.opacity = 0;
    
    setTimeout(() => {
        const newState = LESSON_STATES[currentTickerIndex];
        ticker.textContent = newState.text;
        ticker.href = newState.href;
        ticker.style.opacity = 1;
    }, 200);
}

function startTickerAnimation() {
    const ticker = document.getElementById('latest-updates-ticker');
    if (!ticker) return;

    // === SAFETY NET: ENSURE VISIBILITY IMMEDIATELY ===
    // If the HTML script missed it, we fix it right now.
    if (ticker.style.opacity === '0' || ticker.style.opacity === '') {
        ticker.textContent = LESSON_STATES[0].text;
        ticker.href = LESSON_STATES[0].href;
        ticker.style.opacity = 1;
    }

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
