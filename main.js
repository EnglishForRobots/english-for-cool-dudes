const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// --- 2. BRAIN BOOST (MATCHING GAME LOGIC) ---
async function checkForMistakesOnHomepage() {
    try {
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (!user) {
            const widget = document.getElementById('repair-shop-widget');
            if(widget) widget.style.display = 'none';
            return;
        }

        // 1. Spaced Repetition Timeframe (Review stuff older than 24h)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isoYesterday = yesterday.toISOString();

        // 2. Fetch Mistakes (Priority A - Red)
        const { data: mistakes } = await supabase
            .from('user_mistakes')
            .select('word, definition, word_type, lesson, lesson_link')
            .eq('user_id', user.id)
            .limit(4);

        let practiceBatch = mistakes || [];

        // 3. Fetch Spaced Reviews (Priority B - Green)
        if (practiceBatch.length < 4) {
            const slotsNeeded = 4 - practiceBatch.length;
            
            const { data: oldLessons } = await supabase
                .from('lessons')
                .select('vocabulary')
                .eq('user_id', user.id)
                .lt('completed_at', isoYesterday) 
                .limit(5);

            if (oldLessons && oldLessons.length > 0) {
                let poolOfKnownWords = [];
                oldLessons.forEach(lesson => {
                    if(Array.isArray(lesson.vocabulary)) {
                        lesson.vocabulary.forEach(v => {
                            const isAlreadyInBatch = practiceBatch.some(pb => pb.word === v.word);
                            if (!isAlreadyInBatch) poolOfKnownWords.push(v);
                        });
                    }
                });

                poolOfKnownWords = poolOfKnownWords.sort(() => 0.5 - Math.random()).slice(0, slotsNeeded);
                
                poolOfKnownWords.forEach(w => {
                    practiceBatch.push({
                        word: w.word,
                        definition: w.definition,
                        word_type: w.type || 'word',
                        lesson: 'Review',
                        is_review: true 
                    });
                });
            }
        }

        // 4. Render Widget
        const widget = document.getElementById('repair-shop-widget');
        const title = document.getElementById('repair-title');
        const desc = document.getElementById('repair-desc');
        const btn = document.getElementById('start-repair-btn');

        if (practiceBatch.length > 0) {
            widget.style.display = 'block';
            widget.style.background = '#F0F9FF'; 
            widget.style.borderColor = '#BAE6FD';
            widget.style.borderLeft = '4px solid #0EA5E9'; 

            const mistakeCount = practiceBatch.filter(x => !x.is_review).length;
            const reviewCount = practiceBatch.filter(x => x.is_review).length;
            
            let headline = "🚀 Daily Brain Boost";
            let subtext = "";
            let statsHtml = "";

            if (mistakeCount > 0 && reviewCount > 0) {
                subtext = "Stay sharp, Cool Dude. Don't let those words escape!";
                statsHtml = `(🎯 <span style="font-weight:bold; color:#B91C1C;">${mistakeCount} Focus Words</span> + 🧠 <span style="font-weight:bold; color:#15803D;">${reviewCount} Reviews</span>)`;
            } else if (mistakeCount === 0 && reviewCount > 0) {
                subtext = "Keep your streak alive! Master what you've learned.";
                statsHtml = `(🧠 <span style="font-weight:bold; color:#15803D;">${reviewCount} Words ready for review!</span>)`;
            } else if (mistakeCount > 0 && reviewCount === 0) {
                subtext = "Expand your world today. Learn something new!";
                statsHtml = `(🎯 <span style="font-weight:bold; color:#B91C1C;">${mistakeCount} New Words to learn!</span>)`;
            } else {
                headline = "🎉 All Caught Up!";
                subtext = "You are crushing it! Enjoy your day.";
                statsHtml = `(🌟 <span style="font-weight:bold; color:#D97706;">Zero pending tasks</span>)`;
            }

            title.innerHTML = headline;
            title.style.color = '#0369A1';
            
            desc.innerHTML = `${subtext}<br><span style="font-size:12px; color:#64748B;">${statsHtml}</span>`;
            
            btn.style.display = 'inline-flex';
            btn.innerHTML = "🧩 Play Match Game (1 min)";
            btn.style.background = '#0EA5E9'; 
            
            btn.onclick = () => startMatchGame(practiceBatch);
        } else {
            widget.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// --- 3. THE MATCH GAME ENGINE ---
function startMatchGame(batch) {
    let gridItems = [];
    
    batch.forEach((item, index) => {
        gridItems.push({
            id: index,
            type: 'term',
            content: item.word,
            matchId: index, 
            originalItem: item 
        });
        gridItems.push({
            id: index + 100, 
            type: 'def',
            content: item.definition || "Definition not found",
            matchId: index,
            originalItem: item
        });
    });

    // Shuffle
    gridItems.sort(() => 0.5 - Math.random());

    const practicePopup = document.createElement('div');
    practicePopup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 30px; border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4); z-index: 10000;
        max-width: 600px; width: 95%; max-height: 90vh; overflow-y: auto;
    `;

    const overlay = document.createElement('div');
    overlay.id = 'mistake-reminder-overlay-practice';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6); z-index: 9999; backdrop-filter: blur(2px);
    `;

    practicePopup.innerHTML = `
        <div style="text-align:center; margin-bottom: 20px;">
            <h2 style="color: #0EA5E9; margin: 0 0 5px 0; font-size: 24px; font-weight: 700;">🧩 Memory Match</h2>
            <p style="color: #64748B; margin: 0; font-size: 14px;">Tap a RED word and its WHITE definition. Correct pairs vanish!</p>
        </div>
        
        <div id="game-grid" class="match-grid">
            ${gridItems.map(item => `
                <div class="match-card ${item.type}" data-id="${item.id}" data-match="${item.matchId}">
                    ${item.content}
                </div>
            `).join('')}
        </div>

        <div id="game-feedback" style="text-align: center; margin-top: 20px; font-weight: 700; color: #0EA5E9; min-height: 24px;"></div>

        <div style="margin-top: 20px; text-align: center;">
            <button id="close-game-btn" style="
                background: #E2E8F0; color: #475569; border: none; padding: 10px 25px;
                border-radius: 99px; font-weight: 600; cursor: pointer; font-size: 14px;
            ">Give Up / Close</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(practicePopup);

    let selectedCards = [];
    let matchedCount = 0;
    const totalPairs = batch.length;
    const feedbackEl = document.getElementById('game-feedback');
    const positiveMsgs = ["BOOM! 💥", "Spot on! 🎯", "Too easy! 😎", "Memory Master! 🧠", "Correct! ✅"];
    const negativeMsgs = ["Not quite... 🤔", "Try again! ❌", "Keep looking! 👀", "Nope! 🛑", "Close! 🤏"];

    practicePopup.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('matched') || card.classList.contains('selected')) return;
            if (selectedCards.length >= 2) return;

            card.classList.add('selected');
            selectedCards.push(card);

            if (selectedCards.length === 2) {
                checkMatch();
            }
        });
    });

    async function checkMatch() {
        const [card1, card2] = selectedCards;
        const matchId1 = card1.dataset.match;
        const matchId2 = card2.dataset.match;

        if (matchId1 === matchId2) {
            const winMsg = positiveMsgs[Math.floor(Math.random() * positiveMsgs.length)];
            feedbackEl.textContent = winMsg;
            feedbackEl.style.color = "#16A34A"; 
            
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.classList.remove('selected');
                card2.classList.remove('selected');
            }, 300);

            matchedCount++;
            
            const originalItem = batch[matchId1]; 
            if (originalItem && !originalItem.is_review) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await supabase.from('user_mistakes').delete().eq('user_id', user.id).eq('word', originalItem.word);
                    }
                } catch (err) { console.error(err); }
            }

            if (matchedCount === totalPairs) {
                setTimeout(() => {
                    practicePopup.innerHTML = `
                        <div style="text-align:center; padding: 40px 20px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite;">🚀</div>
                            <h2 style="color: #0EA5E9; font-size: 28px; font-weight: 800; margin: 0 0 10px 0;">To The Moon!</h2>
                            <p style="color: #64748B; font-size: 18px; margin: 0;">Awesome job, you cleared the board!</p>
                            <div style="margin-top: 30px; font-size: 14px; color: #94A3B8;">
                                Time for something new!
                            </div>
                        </div>
                    `;
                    
                    checkForMistakesOnHomepage();

                    setTimeout(() => {
                        closeFn();
                    }, 2500);
                }, 800); 
            }

        } else {
            const failMsg = negativeMsgs[Math.floor(Math.random() * negativeMsgs.length)];
            feedbackEl.textContent = failMsg;
            feedbackEl.style.color = "#EF4444"; 
            setTimeout(() => {
                card1.classList.remove('selected');
                card2.classList.remove('selected');
            }, 1000);
        }
        
        selectedCards = [];
    }

    const closeFn = () => { 
        practicePopup.remove(); 
        overlay.remove(); 
        if (matchedCount > 0) checkForMistakesOnHomepage(); 
    };
    document.getElementById('close-game-btn').addEventListener('click', closeFn);
}

// --- 4. OFFICE PULSE ---
async function loadOfficePulse() {
    const pulseText = document.getElementById('pulse-ticker-text');
    if(!pulseText) return;

    const { data: feed } = await supabase.from('office_pulse').select('*');
    const messages = [];

    if (feed && feed.length > 0) {
        feed.forEach(item => {
            const time = getTimeAgo(new Date(item.completed_at));
            const link = item.lesson_link || '#'; 
            messages.push(`🥳 ${time}: A Cool Dude finished <a href="${link}" target="_blank">${item.lesson_title}</a> (+${item.word_count} words)`);
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
        const { data: { user } } = await supabase.auth.getUser();
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
            await supabase.auth.signOut();
            window.location.reload();
        });
    }
}

// --- MAIN INIT (NON-BLOCKING) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. UPDATE TICKER (Synchronous/Instant)
    const tickerEl = document.getElementById('latest-updates-ticker');
    if (tickerEl && typeof latestTickerData !== 'undefined') {
        tickerEl.href = latestTickerData.link;
        tickerEl.innerText = latestTickerData.title;
        tickerEl.style.opacity = 1; 
    }

    // 2. PARALLEL EXECUTION (Async)
    // Start Auth Check
    const authPromise = initializeAuthHeader();

    // Start Pulse Check (Doesn't wait for Auth)
    loadOfficePulse();
    
    // Start Animation if it exists
    if(typeof startTickerAnimation === 'function') startTickerAnimation();

    // 3. DEPENDENT EXECUTION
    // Run immediately when Auth is finished. No extra waiting.
    authPromise.then(() => {
        checkForMistakesOnHomepage(); 
    });
});
