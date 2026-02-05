const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

// FIX: Renamed variable to 'supabaseClient' to avoid conflict with the library
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- 1. DICTIONARY FUNCTIONS ---
function showDictionary(word, definition, type) {
    document.getElementById('dictionary-popup').style.display = 'block';
    document.getElementById('dictionary-overlay').style.display = 'block';
    const content = document.getElementById('dictionary-content');
    content.innerHTML = `
        <h3 style="color: #667EEA; font-size: 20px; margin-bottom: 10px; font-weight: 600;">${word} <span style="font-size: 14px; color: #718096; font-weight: 600;">(${type})</span></h3>
        <p style="color: #4A5568; line-height: 1.7; margin-bottom: 20px;">${definition}</p>
        <button onclick="closeDictionary()" style="background: #E5E9F2; color: #4A5568; border: none; padding: 10px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; margin-top: 20px; ">Close</button>
    `;
}

function closeDictionary() {
    document.getElementById('dictionary-popup').style.display = 'none';
    document.getElementById('dictionary-overlay').style.display = 'none';
}
const dictOverlay = document.getElementById('dictionary-overlay');
if(dictOverlay) dictOverlay.addEventListener('click', closeDictionary);

// --- 2. REMOVED: OLD REPAIR SHOP / BRAIN BOOST CODE ---
// The repair shop widget has been replaced with Cool Picks
// All mistake-checking logic has been removed

// --- 3. OFFICE PULSE ---
async function loadOfficePulse() {
    const pulseText = document.getElementById('pulse-ticker-text');
    if(!pulseText) return;

    const { data: feed } = await supabaseClient.from('office_pulse').select('*');
    const messages = [];

    if (feed && feed.length > 0) {
        feed.forEach(item => {
            const time = getTimeAgo(new Date(item.completed_at));
            const link = item.lesson_link || '#'; 
            messages.push(`🥳 ${time}: A Cool Dude finished <a href="${link}">${item.lesson_title}</a> (+${item.word_count} words)`);
        });
    } else {
        messages.push("🚀 Be the first Cool Dude to complete a lesson today!");
    }

    if (messages.length > 0) pulseText.innerHTML = messages[0];

    if (messages.length > 1) {
        let msgIndex = 1; 
        setInterval(() => {
            pulseText.style.opacity = 0;
            setTimeout(() => {
                pulseText.innerHTML = messages[msgIndex];
                pulseText.style.opacity = 1;
                msgIndex = (msgIndex + 1) % messages.length;
            }, 500);
        }, 5000);
    }
}

// --- HELPER FUNCTIONS ---
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
}

// --- AUTH ---
async function initializeAuthHeader() {
    const loggedOutButtons = document.getElementById('logged-out-buttons');
    const loggedInButtons = document.getElementById('logged-in-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const userGreeting = document.getElementById('user-greeting');

     try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            let userName = 'Cool Dude';
            if (user.user_metadata && user.user_metadata.full_name) userName = user.user_metadata.full_name.split(' ')[0];
            else if (user.email) userName = user.email.split('@')[0];
            
            if (userGreeting) userGreeting.textContent = `Hey ${userName}! 👋`;
            if (loggedInButtons) loggedInButtons.style.display = 'flex';
            if (loggedOutButtons) loggedOutButtons.style.display = 'none';
        } else {
            if (loggedOutButtons) loggedOutButtons.style.display = 'flex';
            if (loggedInButtons) loggedInButtons.style.display = 'none';
        }
    } catch (err) { console.error('Error checking auth:', err); }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.reload();
        });
    }
}

// --- SERVICE WORKER (FIXED - NO AUTO RELOAD) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js?v=' + Date.now())
        .then(registration => {
            console.log('✅ Service Worker registered');
            
            // Check for updates but DON'T auto-reload
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🆕 New Service Worker found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        console.log('✨ Service Worker updated');
                        // DON'T reload automatically - this was causing the infinite loop!
                    }
                });
            });
        })
        .catch(err => console.error('❌ Service Worker registration failed:', err));
}

// --- MAIN INIT (NON-BLOCKING) ---
document.addEventListener('DOMContentLoaded', () => {
    // Start Auth Check
    const authPromise = initializeAuthHeader();

    // Start Pulse Check (Doesn't wait for Auth)
    loadOfficePulse();
    
    // Start Animation if it exists
    if(typeof startTickerAnimation === 'function') startTickerAnimation();

    // Cool Picks widget is initialized by coolPicks.js
    // No need to call anything here!
});
