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
    mascot:   { name:'The Cool Dude',      emoji:'😎', color:'#1CB0F6', shadow:'#1899D6', linesSeen:[],
        lines:["Correct. I'll try not to look too surprised.","Right answer. Try not to make it a habit of showing everyone up.","Nailed it. I'd say well done but you clearly already know.","That was suspiciously good.","I've seen a lot of students. You're comfortably one of the better ones.","Correct. Don't let it go to your head. (Let it go to your head.)","Right. Very much on brand for you at this point.","I've been cool my whole life and even I had to look that one up."]},
    doug:     { name:'Doug the Pup',        emoji:'🐶', color:'#FFC800', shadow:'#E5B400', linesSeen:[],
        lines:["CORRECT!! Sorry. I get excited. Still correct though.","You got it right! I also got it right! We're both brilliant!","I tried to do homework once. I ate it. This is going better.","Right answer! I'm going to tell everyone. Everyone.","Brilliant! I don't fully understand the question but your energy is perfect.","Correct! This is the best day! (Every day is the best day.)","RIGHT ANSWER!! Sorry — still though. Brilliant.","They said I couldn't do Intermediate level. They were right. But YOU can."]},
    larry:    { name:'Legal Larry',         emoji:'👨‍⚖️', color:'#CE82FF', shadow:'#A559D9', linesSeen:[],
        lines:["Objection — that answer was far too good. Sustained.","Technically correct. Which is, as they say, the best kind of correct.","I've argued cases for 20 years. You just made it look easy. Irritating.","The jury finds you... suspiciously competent.","Without prejudice: that was excellent.","My client — that's you — did nothing wrong. Clearly.","The record will show: correct. As usual.","I could draft a contract to confirm that was correct. I won't. But I could."]},
    brenda:   { name:'Tax Brenda',          emoji:'👩‍💼', color:'#FF9600', shadow:'#E07800', linesSeen:[],
        lines:["Correct. And unlike most things I deal with, that's not taxable.","Right answer. I've seen grown adults get that wrong on their returns.","Technically accurate. I've built a career on technically accurate.","Perfect. Much better than the self-assessments I deal with.","Right. If only everyone I worked with understood this as well as you do.","Correct. I have feelings about this. Mostly relief.","Right answer. No penalty. No late filing fee. Enjoy it.","Not my department. But still correct."]},
    derek:    { name:'Business Derek',      emoji:'👨‍💼', color:'#1CB0F6', shadow:'#1899D6', linesSeen:[],
        lines:["Correct. I'll circle back to congratulate you properly.","Right. Let's take that offline and celebrate appropriately.","Solid. Very much in line with our core competencies.","That's the kind of answer that gets you to the next round.","Right answer. Synergy achieved. I'll show myself out.","Nailed it. I've sat in meetings for years waiting for someone to say that.","Correct. Going forward, this is the benchmark.","I'm between meetings so I thought I'd pop over. Correct. As expected."]},
    victoria: { name:'Dr. Victoria Sharp',  emoji:'👩‍🏫', color:'#FF4B4B', shadow:'#EA2B2B', linesSeen:[],
        lines:["Correct. I'd say impressive but I set the bar deliberately high.","Right. The C1-C2 learner emerges. Finally.","That's accurate. I was beginning to think I'd have to explain it again.","Right answer. Technically. Pedantically. Perfectly.","I've published four papers on this. You got it in seconds. Fine.","Correct. Do carry on. I have marking to finish.","Right. Now if everyone else could manage that, we'd be somewhere.","Correct. Sharp. Rather like my name."]},
    ian:      { name:'Intermediate Ian',    emoji:'☕', color:'#58CC02', shadow:'#58A700', linesSeen:[],
        lines:["That's correct! Sorry, I was making a cup of tea. Well done.","Right answer. Right. Yes. Good. Sorry, I was miles away.","Correct! I learned something new today too. Accidentally.","Nailed it. Between everything going on, you're doing brilliantly.","Right. I read about that somewhere. Didn't quite stick. It has for you though.","Correct. I'm going to remember that one. Probably.","That's right. See, this is why I signed up. Very satisfying.","Right answer. I'd have got there eventually. You got there faster. Fair enough."]},
    kitty:    { name:'Kitty',               emoji:'📻', color:'#FF9600', shadow:'#E07800', linesSeen:[],
        lines:["Groovy! And I mean that — it was a compliment in 1965.","Smashing. We said that in the Sixties. It still works.","Correct. I'd ring to congratulate you but my phone is from 1964.","I haven't been this excited since my record player started working again.","Your English is timeless. Just like my décor.","Fab! That was the word. Fab. Still is, in my house.","Correct. The Sixties were full of people learning new things. You fit right in.","I popped over from my 1964 sitting room to say: correct."]},
    nancy:    { name:'News Anchor Nancy',   emoji:'👩‍💼', color:'#FF4B4B', shadow:'#EA2B2B', linesSeen:[],
        lines:["Breaking: local learner absolutely nails it. More at eleven.","Sources confirm that answer was correct. We're getting more details.","The headline writes itself. Brilliant student stuns everyone.","We go live to the scene — and the scene looks excellent.","In a world of misinformation, your correct answer is genuinely refreshing.","This just in: you're very good at this.","Live coverage of you getting everything right continues.","Interrupting this lesson with breaking news: correct answer confirmed."]},
    bubbles:  { name:'Bubbles',             emoji:'💅', color:'#FF6EB4', shadow:'#D4408A', linesSeen:[],
        lines:["Oh. My. Gosh. That was correct! I'm literally shaking!","That's right! Omg! Slay! Whatever! You got it!","Correct!! I'd do a victory dance but I'm already doing one.","Right answer! I literally cannot believe how good you are at this!","Correct! I wrote a song about this once. Anyway — well done.","Right! Main character energy. Right now. Keep it.","OMG you got it!! That was so good!! I'm screaming!!","They said bubblegum pop stars don't do Intermediate English. Well."]},
    xl:       { name:'XL_Gamer99',          emoji:'🎮', color:'#58CC02', shadow:'#58A700', linesSeen:[],
        lines:["CORRECT!! pog pog pog let's GOOO","W answer. Absolute W. No notes. Pure W.","no way you just got that right first try. no way. LET'S GO.","bro just casually nailed it. bro.","clutch answer. actual clutch. I'm not calm.","correct!! touching grass later to celebrate. right after this though.","right answer. my teammates could NEVER. you though? you could.","chat is going CRAZY right now. and by chat I mean just me. CRAZY."]},
};

const SECTION_CAST = {
    beginner:     { primary:'doug',     secondary:['kitty'],    guests:['bubbles','xl'] },
    intermediate: { primary:'ian',      secondary:['kitty'],    guests:['larry','brenda','nancy'] },
    advanced:     { primary:'victoria', secondary:['ian'],      guests:['larry','derek'] },
    kids:         { primary:'bubbles',  secondary:[],           guests:['doug'] },
    tax:          { primary:'brenda',   secondary:['larry'],    guests:['derek','victoria'] },
    business:     { primary:'derek',    secondary:['brenda'],   guests:['larry','victoria'] },
    legal:        { primary:'larry',    secondary:['victoria'], guests:['brenda','derek'] },
    'weekly-drop':{ primary:'nancy',    secondary:['ian'],      guests:['kitty'] },
    breakroom:    { primary:'xl',       secondary:[],           guests:['doug','bubbles'] },
    general:      { primary:'mascot',   secondary:[],           guests:[] },
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
