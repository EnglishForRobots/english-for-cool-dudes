// SURPRISE REWARDS — surprise-rewards.js  final
// Emoji popup cards — clean, polished, no fake animations
// Frequency: combo 8+ + sectionComplete() 40% chance + 4min cooldown
// No line repeats until pool exhausted
'use strict';

function detectSection() {
    const ds = document.body?.dataset?.section;
    if (ds && ds !== 'general') return ds;
    const all = (window.LESSON_ID||'').toLowerCase()+' '+window.location.pathname.toLowerCase()+' '+document.title.toLowerCase();
    if (/chatattack|vibecheck|wordthief|whatami|matching|phrasescramble|definitionary|fixit|forbidden|breakroom/.test(all)) return 'breakroom';
    if (/weekly.drop|newsletter|issue-\d/.test(all)) return 'weekly-drop';
    if (/\btax\b/.test(all))      return 'tax';
    if (/\blegal\b/.test(all))    return 'legal';
    if (/\bbusiness\b/.test(all)) return 'business';
    if (/\bkids\b/.test(all))     return 'kids';
    if (/\badvanced\b|c1|c2/.test(all))      return 'advanced';
    if (/\bintermediate\b|b1|b2/.test(all))  return 'intermediate';
    if (/\bbeginner\b|a1|a2/.test(all))      return 'beginner';
    const lid = (window.LESSON_ID||'').toLowerCase();
    if (/-(intermediate|b1|b2)/.test(lid)) return 'intermediate';
    if (/-(advanced|c1|c2)/.test(lid))     return 'advanced';
    if (/-(beginner|a1|a2)/.test(lid))     return 'beginner';
    return 'general';
}

const CHARACTERS = {

    mascot: { name:'The Cool Dude', emoji:'😎', color:'#1CB0F6', shadow:'#1899D6', linesSeen:[],
        lines:["Correct. Try not to look smug about it.","Right. Didn't even flinch.","Nailed it. Obviously.","Suspiciously good, that.","One of the better ones. Don't tell anyone.","Correct. Don't let it go to your head.","Very on brand for you.","Even I had to look that one up."]},

    doug: { name:'Doug the Pup', emoji:'🐶', color:'#FFC800', shadow:'#E5B400', linesSeen:[],
        lines:["CORRECT!! Sorry. Still though — CORRECT!!","RIGHT!! I'm telling everyone. Everyone.","I ate my homework once. This is better.","Brilliant! I don't know why but BRILLIANT!!","Best day ever!! (Every day is the best day.)","You got it!! I also got it!! We're the same!!","RIGHT ANSWER!! *knocks something over* Sorry.","They said I couldn't. You proved them wrong!!"]},

    farmer: { name:'The Farmer', emoji:'👨‍🌾', color:'#92400E', shadow:'#78350F', linesSeen:[],
        lines:["Correct. No fuss. I respect that.","Right. Early start, honest work.","Good, clean answer. Like a good harvest.","Correct. Patience. You've got it.","Right. No shortcuts. You understand that.","I've been up since four. Worth it.","Correct. You're flourishing.","Right answer. Straight and true."]},

    detective: { name:'The Detective', emoji:'🕵️', color:'#1e3a5f', shadow:'#1e3a5f', linesSeen:[],
        lines:["Correct. Exactly as I suspected.","Right. The evidence was clear from the start.","Elementary. Though not everyone sees it.","I've been watching. The pattern was obvious.","A lesser mind might have hesitated. You didn't.","I deduce — I am never wrong — excellent.","Case closed. Another triumph.","My suspicions about you were all positive."]},

    brenda: { name:'Tax Brenda', emoji:'👩‍💼', color:'#FF9600', shadow:'#E07800', linesSeen:[],
        lines:["Correct. Not taxable. Enjoy it.","Right. No penalty. No late fee.","Technically accurate. My whole career.","I've seen adults get that wrong. Not you.","Correct. I have feelings. Mostly relief.","Much better than the self-assessments.","Not my department. Still correct.","Right answer. No liability whatsoever."]},

    astronaut: { name:'The Astronaut', emoji:'👩🏻‍🚀', color:'#0f172a', shadow:'#0f172a', linesSeen:[],
        lines:["Houston, we have a correct answer. Over.","One small step for vocabulary. Well done.","From orbit: that looked great.","Six months in zero gravity. Still impressed.","Mission control is very pleased.","In space no one hears you get it wrong.","250 miles up. Confirmed: correct.","Circling back — literally — to say: excellent."]},

    wizard: { name:'The Wizard', emoji:'🧙', color:'#4c1d95', shadow:'#3b0764', linesSeen:[],
        lines:["Correct. I foresaw it. Three seconds ago.","The ancient texts mentioned this. Loosely.","You've passed the trial. There are more trials.","Nine hundred years of study. You're catching up.","The stars aligned. I checked.","I could tell you what's next. I won't.","Some earn the gift. You're earning it.","The spell is cast. Don't waste it."]},

    ian: { name:'Intermediate Ian', emoji:'🧔', color:'#58CC02', shadow:'#58A700', linesSeen:[],
        lines:["Correct! This is my year. Definitely.","That's what I would've said. Bit slower.","I'm basically B2 now. This confirms it.","Five-year plan. You've inspired phase two.","One day I'll be this good. One day.","Taking this very seriously. Very.","My English turned a corner today.","Not stopping till C2. Or confident B1."]},

    olivia: { name:'Overworked Olivia', emoji:'👩‍🦰', color:'#8B5CF6', shadow:'#7C3AED', linesSeen:[],
        lines:["Correct! Do you know how many emails I have?","Right. You just gave me hope. Genuinely.","Maybe next month I'll do the full lesson.","47 items on my list. You're thriving. Respect.","You did the quiz. I've watched it three times.","Five minutes free. You make it look easy.","Full lesson this weekend. Definitely. Probably.","I admire your focus. Truly."]},

    raccoon: { name:'The Raccoon', emoji:'🦝', color:'#374151', shadow:'#1f2937', linesSeen:[],
        lines:["Found that in a bin once. Still correct.","Watching from the shadows. Very impressed.","You're getting the good stuff.","I collect facts. You do too. We're the same.","I grabbed it first. Now you have. Good.","Only came out for this. Worth it.","Unconventional methods. Correct answers.","Scrappy and resourceful. That's both of us."]},

    fairy: { name:'Fairy', emoji:'🧚', color:'#EC4899', shadow:'#BE185D', linesSeen:[],
        lines:["Correct!! Stars. Everywhere. For you!!","SO well!! I knew you could!!","Wings going faster. Every correct answer!!","Best one in the lesson. Obviously!!","One wish — but your English is already magic!","Wand going crazy. In a good way!!","Favourite lesson today. It's this one!!","Basically magic. I would know!!"]},

    grandma: { name:'Grandma', emoji:'👵', color:'#BE185D', shadow:'#9D174D', linesSeen:[],
        lines:["Correct, dear. I always knew.","That's wonderful. I'm telling everyone.","Just like me at your age. Very bright.","Don't understand it all. Know that was good.","Have you eaten? Also — very well done.","Watching and so proud I could cry.","Got a bit confused myself. You're brilliant.","Whatever you're doing — keep doing it, darling."]},

    xl: { name:'XL_Gamer99', emoji:'👾', color:'#16a34a', shadow:'#15803d', linesSeen:[],
        lines:["CORRECT!! four days inside. highlight of week.","W answer. told mum: after this round.","paused my game for this. worth it.","bro. BRO. from my room to your screen. respect.","blinds closed. snacks ready. you are thriving.","should go outside. but not until you're done.","chair hasn't moved. score only goes up.","going feral in here. neighbours can probably hear."]},

};


const SECTION_CAST = {
    beginner:     { primary:'doug',      secondary:['farmer'],   guests:['grandma','xl'] },
    intermediate: { primary:'ian',       secondary:['olivia'],   guests:['grandma','farmer','raccoon'] },
    advanced:     { primary:'wizard',    secondary:['detective'],guests:['grandma','olivia'] },
    kids:         { primary:'fairy',     secondary:[],           guests:['doug','grandma'] },
    tax:          { primary:'brenda',    secondary:['detective'],guests:['olivia','grandma'] },
    business:     { primary:'astronaut', secondary:['detective'],guests:['olivia','grandma'] },
    legal:        { primary:'detective', secondary:['wizard'],   guests:['brenda','grandma'] },
    'weekly-drop':{ primary:'raccoon',   secondary:['ian'],      guests:['grandma','olivia'] },
    breakroom:    { primary:'xl',        secondary:['farmer'],   guests:['raccoon','grandma'] },
    general:      { primary:'mascot',    secondary:[],           guests:['grandma'] },
};


const STREAK_MILESTONES = [
    { days:3,  emoji:'🔥',   title:'3-Day Streak',    msg:"Three days in a row. The habit is forming.",         color:'#FF9600', shadow:'#E07800' },
    { days:7,  emoji:'🔥🔥', title:'Week Warrior!',   msg:"Seven days. An actual streak. Genuinely well done.", color:'#FF4B4B', shadow:'#EA2B2B' },
    { days:14, emoji:'💪',   title:'Two Week Legend', msg:"Fourteen days. You're not stopping for anything.",    color:'#CE82FF', shadow:'#A559D9' },
    { days:30, emoji:'💎',   title:'Diamond Streak!', msg:"Thirty days. This is just who you are now.",         color:'#FFC800', shadow:'#E5B400' },
];
const XP_MILESTONES = [
    { xp:100,  emoji:'⚡', title:'100 XP',   msg:"First hundred. The journey has officially begun.",                    color:'#1CB0F6', shadow:'#1899D6' },
    { xp:250,  emoji:'⚡', title:'250 XP',   msg:"Quarter of a thousand. Feels good, doesn't it.",                     color:'#58CC02', shadow:'#58A700' },
    { xp:500,  emoji:'🌟', title:'500 XP',   msg:"Five hundred. You're properly into this now.",                       color:'#FFC800', shadow:'#E5B400' },
    { xp:1000, emoji:'🏆', title:'1,000 XP', msg:"One thousand XP. A real Cool Dude.",                                 color:'#FF9600', shadow:'#E07800' },
    { xp:2000, emoji:'💎', title:'2,000 XP', msg:"Two thousand. Whatever the opposite of a beginner is — that's you.", color:'#CE82FF', shadow:'#A559D9' },
    { xp:5000, emoji:'👑', title:'5,000 XP', msg:"Five thousand XP. Royalty.",                                         color:'#FF4B4B', shadow:'#EA2B2B' },
];

function injectCSS() {
    if (document.getElementById('sr-styles')) return;
    const s = document.createElement('style');
    s.id = 'sr-styles';
    s.textContent = `
@keyframes sr-slidein  { from{transform:translateX(calc(100% + 24px));opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes sr-slideout { from{transform:translateX(0);opacity:1} to{transform:translateX(calc(100% + 24px));opacity:0} }
@keyframes sr-pop      { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.1) rotate(2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes sr-up       { from{transform:translateX(-50%) translateY(-90px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
@keyframes sr-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes sr-bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

.sr-cameo {
    position:fixed; bottom:24px; right:16px;
    max-width:290px; width:calc(100vw - 32px);
    background:#fff;
    border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-radius:20px; overflow:hidden;
    z-index:8000; box-shadow:0 8px 28px rgba(0,0,0,.14);
    font-family:'Nunito',system-ui,sans-serif;
    animation:sr-slidein .4s cubic-bezier(.175,.885,.32,1.275) both;
}
.sr-cameo.out { animation:sr-slideout .35s ease both; }

.sr-cameo-head {
    display:flex; align-items:center; gap:12px;
    padding:13px 14px 12px;
}
.sr-cameo-emoji {
    font-size:42px; line-height:1; flex-shrink:0;
    animation:sr-float 2.5s ease-in-out infinite;
    display:block;
}
.sr-cameo-info { flex:1; min-width:0; }
.sr-cameo-name {
    font-size:10px; font-weight:900;
    text-transform:uppercase; letter-spacing:1.5px;
    color:rgba(255,255,255,.85); margin-bottom:1px;
}
.sr-cameo-close {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    background:rgba(255,255,255,.18); border:none;
    color:rgba(255,255,255,.8); font-size:16px; font-weight:900;
    cursor:pointer; font-family:inherit;
    display:flex; align-items:center; justify-content:center;
    transition:background .1s;
}
.sr-cameo-close:hover { background:rgba(255,255,255,.32); }

.sr-cameo-body {
    background:#fff; padding:13px 16px 16px;
    font-size:14px; font-weight:800;
    color:#111827; line-height:1.6;
    border-top:2px solid rgba(0,0,0,.06);
    position:relative;
}
.sr-cameo-body::before {
    content:'';
    position:absolute; top:-10px; left:22px;
    border:5px solid transparent;
    border-bottom-color:rgba(0,0,0,.06);
}
.sr-cameo-body::after {
    content:'';
    position:absolute; top:-8px; left:23px;
    border:4px solid transparent;
    border-bottom-color:#fff;
}

/* milestone toast */
.sr-milestone {
    position:fixed; top:72px; left:50%;
    transform:translateX(-50%) translateY(-90px); opacity:0;
    background:#fff; border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-radius:99px; padding:10px 22px;
    display:flex; align-items:center; gap:10px;
    z-index:8001; font-family:'Nunito',system-ui,sans-serif;
    box-shadow:0 6px 24px rgba(0,0,0,.12);
    transition:transform .4s cubic-bezier(.175,.885,.32,1.275), opacity .3s ease;
    white-space:nowrap; max-width:calc(100vw - 32px);
    pointer-events:none;
}
.sr-milestone.show { transform:translateX(-50%) translateY(0); opacity:1; }
.sr-ms-emoji { font-size:22px; flex-shrink:0; }
.sr-ms-title { font-size:15px; font-weight:900; }
.sr-ms-msg   { font-size:12px; font-weight:700; color:#AFAFAF; margin-top:1px; }

/* achievement toast */
.sr-achievement {
    position:fixed; top:72px; right:16px; max-width:280px;
    background:#fff; border:2px solid #CECECE; border-bottom:5px solid #CECECE;
    border-left:5px solid #FFC800; border-radius:16px; padding:12px 14px;
    z-index:8001; font-family:'Nunito',system-ui,sans-serif;
    box-shadow:0 6px 20px rgba(0,0,0,.1);
    transform:translateX(calc(100% + 24px)); opacity:0;
    transition:transform .4s cubic-bezier(.175,.885,.32,1.275), opacity .3s ease;
    pointer-events:none;
}
.sr-achievement.show { transform:translateX(0); opacity:1; }
.sr-ach-top   { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.sr-ach-icon  { font-size:28px; flex-shrink:0; animation:sr-bounce 1s ease-in-out infinite; }
.sr-ach-label { font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; color:#E5B400; }
.sr-ach-name  { font-size:14px; font-weight:900; color:#111827; }
.sr-ach-desc  { font-size:12px; font-weight:700; color:#AFAFAF; margin-top:2px; }
    `;
    document.head.appendChild(s);
}

// ── NO-REPEAT LINE PICKER ─────────────────────────────────
function getLine(char) {
    if (char.linesSeen.length >= char.lines.length) char.linesSeen = [];
    const unseen = char.lines.map((l,i)=>({l,i})).filter(x=>!char.linesSeen.includes(x.i));
    const pick = unseen[Math.floor(Math.random()*unseen.length)];
    char.linesSeen.push(pick.i);
    return pick.l;
}

// ── QUEUE ─────────────────────────────────────────────────
let _queue=[], _showing=false, _lastCameo=0;
const COOLDOWN = 4*60*1000;
function enqueue(fn){_queue.push(fn); if(!_showing) _processQ();}
function _processQ(){
    if(!_queue.length){_showing=false;return;}
    _showing=true; _queue.shift()(()=>setTimeout(_processQ,400));
}

// ── SHOW CAMEO ────────────────────────────────────────────
function _showCameo(charId, done) {
    injectCSS();
    const char = CHARACTERS[charId] || CHARACTERS.mascot;
    const line = getLine(char);
    document.querySelector('.sr-cameo')?.remove();

    const el = document.createElement('div');
    el.className = 'sr-cameo';
    el.innerHTML = `
        <div class="sr-cameo-head" style="background:${char.color};border-bottom:2px solid ${char.shadow}">
            <span class="sr-cameo-emoji">${char.emoji}</span>
            <div class="sr-cameo-info">
                <div class="sr-cameo-name">${char.name}</div>
            </div>
            <button class="sr-cameo-close">×</button>
        </div>
        <div class="sr-cameo-body">${line}</div>`;

    document.body.appendChild(el);

    const dismiss = () => {
        clearTimeout(timer);
        el.classList.add('out');
        setTimeout(()=>{el.remove(); done?.();}, 360);
    };

    const timer = setTimeout(dismiss, 5500);
    el.querySelector('.sr-cameo-close').addEventListener('click', dismiss);
}

// ── MILESTONE TOAST ───────────────────────────────────────
function _showMilestone(emoji, title, msg, color, shadow, done) {
    injectCSS();
    document.querySelector('.sr-milestone')?.remove();
    const el = document.createElement('div');
    el.className = 'sr-milestone';
    el.style.borderColor = color;
    el.style.borderBottomColor = shadow;
    el.innerHTML = `
        <span class="sr-ms-emoji">${emoji}</span>
        <div>
            <div class="sr-ms-title" style="color:${shadow}">${title}</div>
            <div class="sr-ms-msg">${msg}</div>
        </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('show')));
    setTimeout(()=>{
        el.classList.remove('show');
        setTimeout(()=>{el.remove(); done?.();}, 400);
    }, 3800);
}

// ── ACHIEVEMENT TOAST ─────────────────────────────────────
function _showAchievement(ach, done) {
    injectCSS();
    document.querySelector('.sr-achievement')?.remove();
    const el = document.createElement('div');
    el.className = 'sr-achievement';
    el.innerHTML = `
        <div class="sr-ach-top">
            <span class="sr-ach-icon">${ach.icon}</span>
            <div>
                <div class="sr-ach-label">Achievement Unlocked</div>
                <div class="sr-ach-name">${ach.name}</div>
            </div>
        </div>
        <div class="sr-ach-desc">${ach.description}</div>`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('show')));
    setTimeout(()=>{
        el.classList.remove('show');
        setTimeout(()=>{el.remove(); done?.();}, 400);
    }, 4500);
}

// ── PICK CHARACTER ────────────────────────────────────────
// 60% primary, 25% secondary, 12% guest, 3% mascot
function _pickChar(forced) {
    if (forced && CHARACTERS[forced]) return forced;
    const cast = SECTION_CAST[detectSection()] || SECTION_CAST.general;
    const roll = Math.random();
    if (roll < 0.03) return 'mascot';
    if (roll < 0.15 && cast.guests.length)    return cast.guests[Math.floor(Math.random()*cast.guests.length)];
    if (roll < 0.40 && cast.secondary.length) return cast.secondary[Math.floor(Math.random()*cast.secondary.length)];
    return cast.primary;
}

// ── PUBLIC API ────────────────────────────────────────────

// Combo 8+ trigger
function cameo(forcedId) {
    const now = Date.now();
    if (now - _lastCameo < COOLDOWN) return;
    _lastCameo = now;
    enqueue(done => _showCameo(_pickChar(forcedId), done));
}

// Section complete — 40% chance
function sectionComplete() {
    if (Math.random() < 0.4) cameo();
}

// After completeLesson() — streaks, XP milestones, achievements
function celebrate(result) {
    if (!result?.success) return;
    const {newStreak=0, newAchievements=[], xpEarned=0} = result;
    const totalXP = window.EFCD_Auth?.getCurrentUser()?.xp || 0;
    const prevXP  = totalXP - xpEarned;
    for (const m of STREAK_MILESTONES)
        if (newStreak === m.days)
            enqueue(done => _showMilestone(m.emoji, m.title, m.msg, m.color, m.shadow, done));
    for (const m of XP_MILESTONES)
        if (prevXP < m.xp && totalXP >= m.xp)
            enqueue(done => _showMilestone(m.emoji, m.title, m.msg, m.color, m.shadow, done));
    for (const achId of newAchievements) {
        const ach = window.EFCD_Auth?.ACHIEVEMENTS?.[achId];
        if (ach) enqueue(done => _showAchievement(ach, done));
    }
}

// Manual milestone
function milestone(emoji, title, msg, color, shadow) {
    enqueue(done => _showMilestone(emoji, title, msg, color||'#1CB0F6', shadow||'#1899D6', done));
}

window.SurpriseRewards = { cameo, sectionComplete, celebrate, milestone, detectSection, CHARACTERS };
console.log('🎭 Surprise Rewards final — emoji cards, '+Object.keys(CHARACTERS).length+' characters, no repeats, 4min cooldown');
