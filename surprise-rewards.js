// ═══════════════════════════════════════════════════════════
// SURPRISE REWARDS — surprise-rewards.js  v3
// Auto-detects section → fires the right character
// Tone: dry British wit, understated, a bit sarcastic
// Fires: combo 5+, section complete — rare, never repetitive
// ═══════════════════════════════════════════════════════════
'use strict';

// ── AUTO-DETECT SECTION ──────────────────────────────────
function detectSection() {
    const id   = (window.LESSON_ID || '').toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const title= document.title.toLowerCase();
    const all  = id + ' ' + path + ' ' + title;

    if (/chatattack|vibecheck|wordthief|whatami|matching|phrasescramble|definitionary|fixit|forbidden|breakroom/.test(all)) return 'breakroom';
    if (/weekly.drop|newsletter|issue-\d/.test(all)) return 'weekly-drop';
    if (/\btax\b/.test(all))          return 'tax';
    if (/\blegal\b/.test(all))        return 'legal';
    if (/\bbusiness\b/.test(all))     return 'business';
    if (/\bkids\b/.test(all))         return 'kids';
    if (/\badvanced\b/.test(all))     return 'advanced';
    if (/\bintermediate\b/.test(all)) return 'intermediate';
    if (/\bbeginner\b/.test(all))     return 'beginner';
    return 'general';
}

// ── CHARACTER PORTRAITS ───────────────────────────────────
// Each character is rendered as a proper portrait:
// outer ring colour, inner bg, emoji face, optional accessories
// The CSS draws them as layered divs — not just a floating emoji

const CHARACTERS = {

    // The Mascot — no name, just "😎" — appears rarely as a treat
    mascot: {
        name: '😎',
        portrait: {
            bg: '#1CB0F6', ring: '#1899D6',
            face: '😎',
            // Sunglasses, slick hair — rendered via CSS layers
            style: 'cool',
        },
        sections: null, // everywhere — but LOW weight, rare guest
        lines: [
            "Correct. I'll try not to look too surprised.",
            "Right answer. Try not to make it a habit of showing everyone up.",
            "I've been cool my whole life and even I had to look that one up.",
            "At this rate you'll be correcting my English. Slightly annoying.",
            "Nailed it. I'd say well done but you clearly already know.",
            "That was suspiciously good.",
            "I've seen a lot of students. You're comfortably one of the better ones.",
        ]
    },

    doug: {
        name: 'Doug the Pup 🐶',
        portrait: { bg: '#FFC800', ring: '#E5B400', face: '🐶', style: 'bouncy' },
        sections: ['beginner'],
        lines: [
            "CORRECT!! Sorry. I get excited. Still correct though.",
            "You got it right! I also got it right! We're both brilliant!",
            "That was very good. I tried to do homework once. I ate it.",
            "Right answer! I'm going to tell everyone about this. Everyone.",
            "Brilliant! I don't fully understand the question but your energy is perfect.",
            "Correct! This is the best day! (Every day is the best day.)",
            "RIGHT ANSWER!! *knocks over everything* sorry sorry still though — brilliant.",
            // Guest appearances on other lessons:
            "I wandered over from the Beginner section. Just wanted to say: correct.",
            "They said I couldn't do Intermediate level. They were right. But YOU can.",
        ]
    },

    larry: {
        name: 'Legal Larry 🧑‍⚖️',
        portrait: { bg: '#CE82FF', ring: '#A559D9', face: '🧑‍⚖️', style: 'formal' },
        sections: ['legal'],
        lines: [
            "Objection — that answer was far too good. Sustained.",
            "Technically correct. Which is, as they say, the best kind of correct.",
            "I've argued cases for 20 years. You just made it look easy. Irritating.",
            "The jury finds you... suspiciously competent.",
            "Without prejudice: that was excellent.",
            "My client — that's you — did nothing wrong. Clearly.",
            "I'm going to need that in writing. Remarkable.",
            "The record will show: correct. As usual.",
            // Guest appearances:
            "I usually handle legal matters but I popped over to say: right answer.",
            "I could draft a contract to confirm that was correct. I won't. But I could.",
        ]
    },

    brenda: {
        name: 'Tax Brenda 🧾',
        portrait: { bg: '#FF9600', ring: '#E07800', face: '🧾', style: 'weary' },
        sections: ['tax'],
        lines: [
            "Correct. And unlike most things I deal with, that's not taxable.",
            "Right answer. I've seen grown adults get that wrong on their returns.",
            "Technically accurate. I've built a career on technically accurate.",
            "Perfect. Much better than the self-assessments I deal with.",
            "Right. If only everyone I worked with understood this as well as you do.",
            "Correct. I have feelings about this. Mostly relief.",
            "Right answer. No penalty. No late filing fee. Enjoy it.",
            // Guest appearances:
            "I deal with tax returns all day. Popping over to confirm: that was right.",
            "Not taxable. Not my department. But still correct.",
        ]
    },

    derek: {
        name: 'Business Derek 💼',
        portrait: { bg: '#1CB0F6', ring: '#1899D6', face: '💼', style: 'corporate' },
        sections: ['business'],
        lines: [
            "Correct. I'll circle back to congratulate you properly.",
            "Right. Let's take that offline and celebrate appropriately.",
            "Solid. Very much in line with our core competencies.",
            "That's the kind of answer that gets you to the next round of interviews.",
            "Right answer. Synergy achieved. I'll show myself out.",
            "Nailed it. I've sat in meetings for years waiting for someone to say that.",
            "Correct. Going forward, this is the benchmark.",
            // Guest appearances:
            "I'm between meetings so I thought I'd pop over. Correct answer. As expected.",
            "Not on my agenda today but I wanted to touch base — great answer.",
        ]
    },

    victoria: {
        name: 'Dr. Victoria Sharp 👩‍🏫',
        portrait: { bg: '#FF4B4B', ring: '#EA2B2B', face: '👩‍🏫', style: 'stern' },
        sections: ['advanced'],
        lines: [
            "Correct. I'd say impressive but I set the bar deliberately high.",
            "Right. The C1-C2 learner emerges. Finally.",
            "That's accurate. I was beginning to think I'd have to explain it again.",
            "Right answer. Technically. Pedantically. Perfectly.",
            "I've published four papers on this. You got it in seconds. Fine.",
            "Correct. Do carry on. I have marking to finish.",
            "Right. Now if everyone else in the room could manage that, we'd be somewhere.",
            "Correct. Sharp. Rather like my name.",
            // Guest appearances:
            "I don't usually visit Intermediate lessons. I'm making an exception. Correct.",
            "Your answer meets the C1 standard. You're welcome.",
        ]
    },

    ian: {
        name: 'Intermediate Ian ☕',
        portrait: { bg: '#58CC02', ring: '#58A700', face: '☕', style: 'distracted' },
        sections: ['intermediate'],
        lines: [
            "That's correct! Hang on — sorry, I was making a cup of tea. Well done.",
            "Right answer. Right. Yes. Good. Sorry, I was miles away.",
            "Correct! I learned something new today too. Accidentally.",
            "Nailed it. Honestly between everything going on, you're doing brilliantly.",
            "Right. I read about that somewhere. Didn't quite stick. It has for you though.",
            "Correct. I'm going to remember that one. Probably.",
            "That's right. See, this is why I signed up. Very satisfying.",
            "Right answer. I'd have got there eventually. You got there faster. Fair enough.",
            "Correct! Right. Good. Cup of tea to celebrate, I think.",
        ]
    },

    kitty: {
        name: 'Kitty 📻',
        portrait: { bg: '#FF9600', ring: '#E07800', face: '📻', style: 'retro' },
        sections: ['intermediate'],
        lines: [
            "Groovy! And I mean that — it was a compliment in 1965.",
            "Smashing. We said that in the Sixties. It still works.",
            "Correct. I'd ring to congratulate you but my phone is from 1964.",
            "I haven't been this excited since my record player started working again.",
            "Right answer. In my house everything is from the Sixties. Your English is timeless.",
            "Correct. The Sixties were full of people learning new things. You fit right in.",
            "Fab! That was the word. Fab. Still is, in my house.",
            // Guest appearances:
            "I popped over from my 1964 sitting room to say: correct.",
            "I don't usually leave the house — it's a whole era in there — but well done.",
        ]
    },

    nancy: {
        name: 'News Anchor Nancy 📺',
        portrait: { bg: '#FF4B4B', ring: '#EA2B2B', face: '📺', style: 'broadcast' },
        sections: ['weekly-drop'],
        lines: [
            "Breaking: local learner absolutely nails it. More at eleven.",
            "Sources confirm that answer was correct. We're getting more details.",
            "The headline writes itself. Brilliant student stuns everyone.",
            "We go live to the scene — and the scene looks excellent.",
            "In a world of misinformation, your correct answer is genuinely refreshing.",
            "That's the kind of answer that gets above the fold.",
            "This just in: you're very good at this.",
            "Live coverage of you getting everything right continues.",
            // Guest appearances:
            "Interrupting this lesson with breaking news: correct answer confirmed.",
            "We cross live to the learning zone — and it's going very well indeed.",
        ]
    },

    bubbles: {
        name: 'Bubbles 💅',
        portrait: { bg: '#FF6EB4', ring: '#D4408A', face: '💅', style: 'pop' },
        sections: ['kids'],
        lines: [
            "*blows bubble* ...correct! *pops it*",
            "That's right! Omg! Slay! Whatever! You got it!",
            "Correct!! I'd do a victory dance but I'm already doing one.",
            "*blows enormous bubble* That one was for you. You earned it.",
            "Correct! I wrote a song about this once. It went number one. Anyway — well done.",
            "Right! Main character energy. Right now. Keep it.",
            "*pops bubblegum* yeah that's correct babes",
            "OMG you got it!! That was so good!! I'm screaming!!",
            // Guest appearances:
            "I wandered over from the Kids section. *blows bubble* Correct.",
            "They said bubblegum pop stars don't do Intermediate English. Well.",
        ]
    },

    xl: {
        name: 'XL_Gamer99 🎮',
        portrait: { bg: '#58CC02', ring: '#58A700', face: '🎮', style: 'gamer' },
        sections: ['breakroom'],
        lines: [
            "CORRECT!! pog pog pog let's GOOO",
            "W answer. Absolute W. No notes. Pure W.",
            "no way you just got that right first try. no way. LET'S GO.",
            "that's a speedrun strat right there. correct AND efficient.",
            "bro just casually nailed it. bro.",
            "clutch answer. actual clutch. I'm not calm.",
            "correct!! touching grass later to celebrate. right after this though.",
            "right answer. my teammates could NEVER. you though? you could.",
            "chat is going CRAZY right now. and by chat I mean just me. CRAZY.",
            // Guest appearances:
            "I spawned into this lesson by accident and honestly? still going to say GG.",
            "wrong map, wrong lobby, right answer. let's go.",
        ]
    },

};

// ── SECTION CAST ─────────────────────────────────────────
// primary: shown most (60%)
// secondary: shown sometimes (25%)
// guests: cross-section characters for variety (15%)
// mascot always possible but low weight — treat not constant
const SECTION_CAST = {
    beginner:     { primary:'doug',     secondary:['kitty'],    guests:['bubbles','xl'] },
    intermediate: { primary:'ian',      secondary:['kitty'],    guests:['larry','brenda','nancy'] },
    advanced:     { primary:'victoria', secondary:['ian'],      guests:['larry','derek'] },
    kids:         { primary:'bubbles',  secondary:[],           guests:['doug'] },
    tax:          { primary:'brenda',   secondary:['larry'],    guests:['derek','victoria'] },
    business:     { primary:'derek',    secondary:['brenda'],   guests:['larry','victoria'] },
    legal:        { primary:'larry',    secondary:['victoria'], guests:['brenda','derek'] },
    'weekly-drop':{ primary:'nancy',    secondary:['ian'],      guests:['mascot','kitty'] },
    breakroom:    { primary:'xl',       secondary:[],           guests:['doug','bubbles','mascot'] },
    general:      { primary:'mascot',   secondary:[],           guests:[] },
};

// ── STREAK / XP MILESTONES ────────────────────────────────
const STREAK_MILESTONES = [
    { days:3,  emoji:'🔥',   title:'3-Day Streak',    msg:'Three days in a row. The habit is forming. Don\'t ruin it now.',  color:'#FF9600', shadow:'#E07800' },
    { days:7,  emoji:'🔥🔥', title:'Week Warrior!',   msg:'Seven days. An actual streak. Genuinely well done.',             color:'#FF4B4B', shadow:'#EA2B2B' },
    { days:14, emoji:'💪',   title:'Two Week Legend', msg:'Fourteen days. You\'re not stopping for anything, are you.',     color:'#CE82FF', shadow:'#A559D9' },
    { days:30, emoji:'💎',   title:'Diamond Streak!', msg:'Thirty days. This is just who you are now.',                    color:'#FFC800', shadow:'#E5B400' },
];
const XP_MILESTONES = [
    { xp:100,  emoji:'⚡', title:'100 XP',   msg:'First hundred. The journey has officially begun.',                     color:'#1CB0F6', shadow:'#1899D6' },
    { xp:250,  emoji:'⚡', title:'250 XP',   msg:'Quarter of a thousand. Feels good, doesn\'t it.',                     color:'#58CC02', shadow:'#58A700' },
    { xp:500,  emoji:'🌟', title:'500 XP',   msg:'Five hundred. You\'re properly into this now.',                       color:'#FFC800', shadow:'#E5B400' },
    { xp:1000, emoji:'🏆', title:'1,000 XP', msg:'One thousand XP. A real Cool Dude.',                                  color:'#FF9600', shadow:'#E07800' },
    { xp:2000, emoji:'💎', title:'2,000 XP', msg:'Two thousand. Whatever the opposite of a beginner is — that\'s you.', color:'#CE82FF', shadow:'#A559D9' },
    { xp:5000, emoji:'👑', title:'5,000 XP', msg:'Five thousand XP. Royalty.',                                          color:'#FF4B4B', shadow:'#EA2B2B' },
];

// ── CSS ───────────────────────────────────────────────────
function injectSRStyles() {
    if (document.getElementById('sr-styles')) return;
    const s = document.createElement('style');
    s.id = 'sr-styles';
    s.textContent = `
/* ── CAMEO CARD ── */
.sr-cameo {
    position:fixed; bottom:24px; right:16px;
    max-width:300px; width:calc(100vw - 32px);
    background:#fff;
    border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-radius:20px; overflow:hidden; z-index:8000;
    box-shadow:0 8px 32px rgba(0,0,0,.18);
    transform:translateX(calc(100% + 32px)); opacity:0;
    transition:transform .45s cubic-bezier(.175,.885,.32,1.275), opacity .35s ease;
    font-family:'Nunito',system-ui,sans-serif;
}
.sr-cameo.show { transform:translateX(0); opacity:1; }

/* Character header */
.sr-ch {
    display:flex; align-items:center; gap:12px;
    padding:12px 14px 11px;
}

/* Portrait — layered character look */
.sr-portrait {
    width:52px; height:52px; border-radius:16px;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; font-size:30px; position:relative;
    border:3px solid rgba(255,255,255,.4);
    box-shadow:0 3px 8px rgba(0,0,0,.2);
    overflow:hidden;
}
/* Shine layer */
.sr-portrait::after {
    content:'';
    position:absolute; top:0; left:0; right:0; height:50%;
    background:linear-gradient(180deg,rgba(255,255,255,.3),transparent);
    border-radius:13px 13px 0 0;
    pointer-events:none;
}
/* Accessory strip at bottom of portrait */
.sr-portrait-strip {
    position:absolute; bottom:0; left:0; right:0;
    height:14px;
    background:rgba(0,0,0,.15);
    display:flex; align-items:center; justify-content:center;
    font-size:8px; letter-spacing:1px; font-weight:900;
    color:rgba(255,255,255,.7);
}

.sr-ch-info { flex:1; min-width:0; }
.sr-ch-name {
    font-size:11px; font-weight:900;
    text-transform:uppercase; letter-spacing:1.2px;
    color:rgba(255,255,255,.95); line-height:1.2;
}
.sr-ch-tag {
    font-size:9px; font-weight:700;
    color:rgba(255,255,255,.6); margin-top:2px;
    text-transform:uppercase; letter-spacing:.8px;
}
.sr-close {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    background:rgba(255,255,255,.15); border:none;
    color:rgba(255,255,255,.7); font-size:16px; font-weight:900;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-family:inherit; transition:background .1s;
}
.sr-close:hover { background:rgba(255,255,255,.3); }

/* Speech bubble */
.sr-bubble {
    background:#fff; padding:14px 16px 16px;
    font-size:14px; font-weight:800; color:#111827;
    line-height:1.6; position:relative;
    border-top:2px solid rgba(0,0,0,.06);
}
/* Triangle pointer */
.sr-bubble::before {
    content:''; position:absolute; top:-10px; left:22px;
    border:5px solid transparent; border-bottom-color:rgba(0,0,0,.06);
}
.sr-bubble::after {
    content:''; position:absolute; top:-8px; left:23px;
    border:4px solid transparent; border-bottom-color:#fff;
}

/* Portrait entrance */
@keyframes srPortPop {
    0%   { transform:scale(0) rotate(-12deg); opacity:0; }
    60%  { transform:scale(1.12) rotate(2deg); }
    80%  { transform:scale(.96); }
    100% { transform:scale(1) rotate(0); opacity:1; }
}
.sr-cameo.show .sr-portrait { animation:srPortPop .5s cubic-bezier(.175,.885,.32,1.275) .08s both; }

/* Style variants — affects strip label */
.sr-style-cool    .sr-portrait-strip::before { content:'😎'; font-size:10px; }
.sr-style-formal  .sr-portrait-strip::before { content:'⚖️'; font-size:9px; }
.sr-style-weary   .sr-portrait-strip::before { content:'📋'; font-size:9px; }
.sr-style-stern   .sr-portrait-strip::before { content:'📐'; font-size:9px; }
.sr-style-pop     .sr-portrait-strip::before { content:'🎵'; font-size:9px; }
.sr-style-gamer   .sr-portrait-strip::before { content:'🕹'; font-size:9px; }
.sr-style-retro   .sr-portrait-strip::before { content:'🎵'; font-size:9px; }
.sr-style-bouncy  .sr-portrait-strip::before { content:'🦴'; font-size:9px; }
.sr-style-broadcast .sr-portrait-strip::before { content:'📡'; font-size:9px; }
.sr-style-corporate .sr-portrait-strip::before { content:'📊'; font-size:9px; }
.sr-style-distracted .sr-portrait-strip::before { content:'☕'; font-size:9px; }

/* ── MILESTONE TOAST ── */
.sr-milestone {
    position:fixed; top:72px; left:50%;
    transform:translateX(-50%) translateY(-90px); opacity:0;
    background:#fff; border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-radius:99px; padding:11px 22px;
    display:flex; align-items:center; gap:10px; z-index:8001;
    font-family:'Nunito',system-ui,sans-serif;
    box-shadow:0 6px 24px rgba(0,0,0,.12);
    transition:transform .4s cubic-bezier(.175,.885,.32,1.275), opacity .3s ease;
    white-space:nowrap; max-width:calc(100vw - 32px);
}
.sr-milestone.show { transform:translateX(-50%) translateY(0); opacity:1; }
.sr-ms-emoji { font-size:24px; flex-shrink:0; }
.sr-ms-title { font-size:15px; font-weight:900; }
.sr-ms-msg   { font-size:12px; font-weight:700; color:#AFAFAF; margin-top:1px; }

/* ── ACHIEVEMENT TOAST ── */
.sr-achievement {
    position:fixed; top:72px; right:16px; max-width:280px;
    background:#fff; border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-left:5px solid #FFC800; border-radius:16px; padding:12px 14px;
    z-index:8001; font-family:'Nunito',system-ui,sans-serif;
    box-shadow:0 6px 20px rgba(0,0,0,.1);
    transform:translateX(calc(100% + 24px)); opacity:0;
    transition:transform .4s cubic-bezier(.175,.885,.32,1.275), opacity .3s ease;
}
.sr-achievement.show { transform:translateX(0); opacity:1; }
.sr-ach-top   { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.sr-ach-icon  { font-size:28px; flex-shrink:0; }
.sr-ach-label { font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; color:#E5B400; }
.sr-ach-name  { font-size:14px; font-weight:900; color:#111827; }
.sr-ach-desc  { font-size:12px; font-weight:700; color:#AFAFAF; margin-top:2px; }

@keyframes srWiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
@keyframes srBounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} 60%{transform:translateY(-2px)} }
    `;
    document.head.appendChild(s);
}

// ── QUEUE ─────────────────────────────────────────────────
let _queue = [], _showing = false;
function enqueue(fn) { _queue.push(fn); if (!_showing) _processQueue(); }
function _processQueue() {
    if (!_queue.length) { _showing = false; return; }
    _showing = true;
    _queue.shift()(() => setTimeout(_processQueue, 400));
}

// ── SHOW CAMEO ────────────────────────────────────────────
function _showCameo(charId, done) {
    injectSRStyles();
    const char = CHARACTERS[charId] || CHARACTERS.mascot;
    const line = char.lines[Math.floor(Math.random() * char.lines.length)];
    const p    = char.portrait;

    document.querySelector('.sr-cameo')?.remove();

    const el = document.createElement('div');
    el.className = `sr-cameo sr-style-${p.style||'cool'}`;
    el.innerHTML = `
        <div class="sr-ch" style="background:${p.bg};border-bottom:2px solid ${p.ring}">
            <div class="sr-portrait" style="background:${p.ring}">
                ${p.face}
                <div class="sr-portrait-strip"></div>
            </div>
            <div class="sr-ch-info">
                <div class="sr-ch-name">${char.name}</div>
            </div>
            <button class="sr-close" aria-label="Close">×</button>
        </div>
        <div class="sr-bubble">${line}</div>`;

    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));

    const timer = setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => { el.remove(); done?.(); }, 450);
    }, 5500);

    el.querySelector('.sr-close').addEventListener('click', () => {
        clearTimeout(timer);
        el.classList.remove('show');
        setTimeout(() => { el.remove(); done?.(); }, 350);
    });
}

// ── SHOW MILESTONE TOAST ──────────────────────────────────
function _showMilestone(emoji, title, msg, color, shadow, done) {
    injectSRStyles();
    document.querySelector('.sr-milestone')?.remove();
    const el = document.createElement('div');
    el.className = 'sr-milestone';
    el.style.borderColor = color;
    el.style.borderBottomColor = shadow;
    el.innerHTML = `
        <span class="sr-ms-emoji" style="animation:srBounce 1s ease-in-out infinite">${emoji}</span>
        <div>
            <div class="sr-ms-title" style="color:${shadow}">${title}</div>
            <div class="sr-ms-msg">${msg}</div>
        </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => { el.remove(); done?.(); }, 400);
    }, 3800);
}

// ── SHOW ACHIEVEMENT TOAST ────────────────────────────────
function _showAchievement(ach, done) {
    injectSRStyles();
    document.querySelector('.sr-achievement')?.remove();
    const el = document.createElement('div');
    el.className = 'sr-achievement';
    el.innerHTML = `
        <div class="sr-ach-top">
            <span class="sr-ach-icon" style="animation:srBounce 1s ease-in-out infinite">${ach.icon}</span>
            <div>
                <div class="sr-ach-label">🏆 Achievement Unlocked</div>
                <div class="sr-ach-name">${ach.name}</div>
            </div>
        </div>
        <div class="sr-ach-desc">${ach.description}</div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => { el.remove(); done?.(); }, 400);
    }, 4500);
}

// ── PICK CHARACTER ────────────────────────────────────────
// Uses weighted random:
//   60% → primary character for this section
//   25% → secondary character
//   12% → guest from another section (adds variety + cross-promotion)
//    3% → the mascot (rare treat)
// If forced ID, use that directly
function _pickCharacter(forcedId) {
    if (forcedId && CHARACTERS[forcedId]) return forcedId;
    const section = detectSection();
    const cast    = SECTION_CAST[section] || SECTION_CAST.general;
    const roll    = Math.random();

    if (roll < 0.03) return 'mascot'; // rare treat

    if (roll < 0.15 && cast.guests.length) {
        return cast.guests[Math.floor(Math.random() * cast.guests.length)];
    }

    if (roll < 0.40 && cast.secondary.length) {
        return cast.secondary[Math.floor(Math.random() * cast.secondary.length)];
    }

    return cast.primary;
}

// ── CELEBRATE (post-lesson) ───────────────────────────────
function celebrate(result) {
    if (!result?.success) return;
    const { newStreak=0, newAchievements=[], xpEarned=0 } = result;
    const totalXP = window.EFCD_Auth?.getCurrentUser()?.xp || 0;
    const prevXP  = totalXP - xpEarned;

    for (const m of STREAK_MILESTONES) {
        if (newStreak === m.days)
            enqueue(done => _showMilestone(m.emoji, m.title, m.msg, m.color, m.shadow, done));
    }
    for (const m of XP_MILESTONES) {
        if (prevXP < m.xp && totalXP >= m.xp)
            enqueue(done => _showMilestone(m.emoji, m.title, m.msg, m.color, m.shadow, done));
    }
    for (const achId of newAchievements) {
        const ach = window.EFCD_Auth?.ACHIEVEMENTS?.[achId];
        if (ach) enqueue(done => _showAchievement(ach, done));
    }
}

// ── PUBLIC API ────────────────────────────────────────────
function cameo(characterId) {
    enqueue(done => _showCameo(_pickCharacter(characterId), done));
}
function milestone(emoji, title, msg, color, shadow) {
    enqueue(done => _showMilestone(emoji, title, msg, color||'#1CB0F6', shadow||'#1899D6', done));
}

window.SurpriseRewards = { cameo, celebrate, milestone, detectSection, CHARACTERS };

console.log('🎭 Surprise Rewards v3 — ' + Object.keys(CHARACTERS).length + ' characters, weighted rotation active');
