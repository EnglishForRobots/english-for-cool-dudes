// --- Shared Data Source ---
const LESSON_STATES = [
    
    { text: "🐢 NEW! INTERMEDIATE: Meet Jonathan the Tortoise 😎", href: "/jonathan/" },
    { text: "🧩 NEW! INTERMEDIATE: Top 10 Phrasal Verbs For Work 😎", href: "/phrasals/" },
    { text: "🌐 NEW! TAX: The Netflix Tax 🎬🍿", href: "/VATdigital/" },
    { text: "🚩 NEW! LEGAL: Due Diligence in M&A 💼", href: "/duediligence/" },
    { text: "🐢 NEW! BEGINNER: Amazing Animals: Jonathan T 🐢", href: "/tortoise/" },
    { text: "🔥 NEW! BEGINNER: Bonfire Night and Guy Fawkes 🎆", href: "/bonfire/" },
    { text: "🏧 NEW! INTERMEDIATE: The Bank of England 💰", href: "/boe/" },
    { text: "🏧 NEW! TAX: Tax Audit Essentials 🔍", href: "/audit/" },
    { text: "🚀 NEW! BUSINESS: Career Progression 🎯", href: "/feedback/" },
    { text: "👻 NEW! BEGINNER: Trick or Treat! 🎃", href: "/trickortreat/" },
    { text: "🎃 NEW! INTERMEDIATE: Beware The Black Cat! 👻", href: "/halloween/" },
    { text: "🧟‍♂️ NEW! ADVANCED: The Creation's Ruin - Frankenstein ⚰️", href: "/frank/" },
    { text: "😎 NEW! ADVANCED: Unusual European Foods 🍴", href: "/weirdeurofoods/" },
    { text: "😎 NEW! BUSINESS: Change Management 🧭", href: "/changemanagement/" },
    { text: "😎 NEW! TAX: International Tax Essentials 🌎", href: "/internationaltaxation/" },
    { text: "😎 NEW! BEGINNER: What's The Weather Like? ☔", href: "/weather/" },
    { text: "😎 NEW! INTERMEDIATE: Fortune Cookie English 🥠", href: "/fortunecookies/" },
    { text: "😎 NEW! LEGAL: Intellectual Property Law 🏛️", href: "/iplaw/" },
    // **IMPORTANT:** In the future, you ONLY update this list here.
];

// --- Shared Ticker Logic ---
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

    // Set initial state
    ticker.textContent = LESSON_STATES[0].text;
    ticker.href = LESSON_STATES[0].href;

    // Start interval
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
