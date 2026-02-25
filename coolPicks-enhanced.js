// Cool Picks Widget - GitHub Lessons Version
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE SOURCE OF TRUTH for lesson recommendations.
// To add/remove/edit lessons: ONLY edit actualLessons[] below.
// The homepage (index.html) reads from this file automatically.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const coolPicksWidget = {

    // ════════════════════════════════════════════════
    // ✏️  EDIT HERE — and nowhere else
    // ════════════════════════════════════════════════
    actualLessons: [
        { url: '/chineserobotsbeginner/', time: '5 mins',  name: 'Pre-Intermediate: Chinese Robots on TV',    category: 'beginner',      icon: '🤖', fact: 'AI now stars in Chinese prime-time TV!' },
        { url: '/pancakedaybeginner/',    time: '4 mins',  name: 'Beginner: Pancake Day!',                    category: 'beginner',      icon: '🥞', fact: 'Brits toss pancakes every Shrove Tuesday.' },
        { url: '/coffee/',                time: '7 mins',  name: 'Beginner: The Legend of Coffee',            category: 'beginner',      icon: '☕', fact: 'Coffee was discovered by a goat herder in Ethiopia.' },
        { url: '/invisibleofficegame/',   time: '8 mins',  name: 'Tax: Invisible Office',                     category: 'tax',           icon: '🏢', fact: 'Remote work has changed tax residency rules worldwide.' },
        { url: '/transferpricing/',       time: '9 mins',  name: 'The Transfer Pricing Trap',                 category: 'tax',           icon: '💸', fact: 'Transfer pricing costs governments billions each year.' },
        { url: '/flyingtaxis/',           time: '9 mins',  name: 'Advanced: Flying Taxis',                    category: 'advanced',      icon: '🚕', fact: 'eVTOLs could be in commercial use by 2026.' },
        { url: '/sandwich/',              time: '5 mins',  name: 'Beginner: The Earl of Sandwich',            category: 'beginner',      icon: '🥪', fact: 'The 4th Earl invented the sandwich to keep gambling!' },
        { url: '/aivideos/',              time: '9 mins', name: 'Advanced: AI Videos',                       category: 'advanced',      icon: '🎬', fact: 'Sora can generate 60-second photorealistic videos.' },
        { url: '/muskman/',               time: '7 mins', name: "Intermediate: Elon Musk's Big Bet",         category: 'intermediate',  icon: '🚀', fact: 'SpaceX is valued at more than the entire Dutch economy!' },
        // ── Add new lessons below this line ──────────────────────────────
        // { url: '/yourlesson/', time: '8 mins', name: 'Your Lesson Title', category: 'beginner', icon: '✨', fact: 'Fun fact about this lesson.' },
    ],

    // Landing pages — edit these only if you add/remove course sections
    landingPages: [
        {
            name: 'Business English',    url: '/business/',      icon: '💼', category: 'business',
            tagline: 'Level up your professional game',          time: '',
            preview: 'Master meetings, emails & presentations',
            keyLearnings: ['Professional communication', 'Business vocabulary', 'Formal writing'],
            funFact: 'Did you know? "Think outside the box" originated in the 1970s!'
        },
        {
            name: 'Tax English',         url: '/tax/',           icon: '💰', category: 'tax',
            tagline: 'Master the money talk',                    time: '',
            preview: 'Navigate tax terminology with confidence',
            keyLearnings: ['Tax vocabulary', 'Accounting terms', 'Financial documentation'],
            funFact: 'Fun fact: The word "tax" comes from Latin "taxare" meaning "to assess"!'
        },
        {
            name: 'Legal English',       url: '/legal/',         icon: '⚖️', category: 'legal',
            tagline: 'Navigate legal lingo like a pro',          time: '',
            preview: 'Understand contracts & legal documents',
            keyLearnings: ['Contract language', 'Legal terminology', 'Court procedures'],
            funFact: 'Cool fact: "Hereby" and "herein" date back to Old English legal documents!'
        },
        {
            name: 'Beginner Course',     url: '/beginner/',      icon: '🌱', category: 'beginner',
            tagline: 'Start your English adventure',             time: '',
            preview: 'Build your foundation from scratch',
            keyLearnings: ['Basic grammar', 'Common phrases', 'Essential vocabulary'],
            funFact: "Every expert was once a beginner! You've got this! 💪"
        },
        {
            name: 'Intermediate Course', url: '/intermediate/',  icon: '🚀', category: 'intermediate',
            tagline: 'Take your skills to the next level',       time: '',
            preview: 'Expand your vocabulary & confidence',
            keyLearnings: ['Complex grammar', 'Idioms & expressions', 'Real-world situations'],
            funFact: "English has over 170,000 words in current use - let's learn them! 📚"
        },
        {
            name: 'Advanced Course',     url: '/advanced/',      icon: '🎯', category: 'advanced',
            tagline: 'Achieve English mastery',                  time: '',
            preview: 'Perfect your fluency & sophistication',
            keyLearnings: ['Native-like fluency', 'Advanced idioms', 'Subtle nuances'],
            funFact: 'Shakespeare invented over 1,700 words we still use today! 🎭'
        },
        {
            name: 'Game Zone',           url: '/games/',         icon: '🎮', category: 'fun',
            tagline: 'Learn while having fun',                   time: '',
            preview: 'Challenge yourself with fun games',
            keyLearnings: ['Interactive learning', 'Quick practice', 'Test your skills'],
            funFact: 'Playing games boosts memory retention by 40%! Time to play! 🎲'
        }
    ],

    categoryMapping: {
        'business': 'specialized', 'tax': 'specialized', 'legal': 'specialized',
        'beginner': 'general', 'intermediate': 'general', 'advanced': 'general', 'fun': 'fun'
    },

    allOptions: [],
    currentLesson: null,
    isAnimating: false,

    createLessonObjects() {
        const fallbackIcons    = ['📖', '✨', '🎯', '💡', '⚡', '🌟', '🔥', '💪', '🚀', '✏️'];
        const fallbackPreviews = [
            'Jump right into learning!', 'Direct lesson content awaits',
            'Start learning immediately', 'Quick and focused practice',
            'Get straight to the good stuff', "No intro needed - let's go!", 'Instant learning experience'
        ];

        return this.actualLessons.map((lesson, index) => {
            const url      = typeof lesson === 'string' ? lesson : lesson.url;
            const time     = typeof lesson === 'string' ? '8 min' : (lesson.time || '8 min');
            const category = typeof lesson === 'object' && lesson.category ? lesson.category : 'general';
            const icon     = (typeof lesson === 'object' && lesson.icon) ? lesson.icon : fallbackIcons[index % fallbackIcons.length];
            const fact     = (typeof lesson === 'object' && lesson.fact) ? lesson.fact : '🎯 This takes you straight to the lesson!';
            let lessonName = typeof lesson === 'object' && lesson.name ? lesson.name : null;

            if (!lessonName) {
                lessonName = url.replace(/\//g, '').replace(/-/g, ' ')
                    .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim()
                    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            }

            return {
                name: lessonName, url, icon, category, fact,
                tagline: 'Direct lesson access', time,
                preview: fallbackPreviews[Math.floor(Math.random() * fallbackPreviews.length)],
                keyLearnings: ['Practical skills', 'Real examples', 'Hands-on practice'],
                funFact: fact,
                isDirectLesson: true
            };
        });
    },

    init() {
        const picksBtn  = document.getElementById('picks-btn');
        const picksDesc = document.getElementById('picks-desc');

        if (!picksBtn || !picksDesc) {
            // Elements may not exist on non-homepage pages — fail silently
            return;
        }

        const lessonObjects = this.createLessonObjects();
        this.allOptions = [...this.landingPages, ...lessonObjects];

        this.updateRecommendation();

        picksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleButtonClick();
        });

        picksDesc.addEventListener('click', (e) => {
            if (e.target.classList.contains('lesson-name-link')) {
                e.preventDefault();
                this.handleButtonClick();
            }
        });

        // Auto-rotate every 15s (index.html also calls updateRecommendation via triggerNewPick)
        setInterval(() => {
            if (!this.isAnimating) this.updateRecommendation();
        }, 15000);
    },

    handleButtonClick() {
        if (this.isAnimating || !this.currentLesson) return;
        this.isAnimating = true;
        const picksBtn = document.getElementById('picks-btn');

        if (picksBtn && picksBtn.innerHTML.includes('Surprise Me')) {
            const categoryLessons = this.allOptions.filter(l =>
                l.isDirectLesson && l.category === this.currentLesson.category
            );
            const pool = categoryLessons.length > 0
                ? categoryLessons
                : this.allOptions.filter(l => l.isDirectLesson);
            if (pool.length > 0) this.currentLesson = pool[Math.floor(Math.random() * pool.length)];
        }

        const emoji   = this.currentLesson.isDirectLesson ? '🎯' : '🚀';
        if (picksBtn) {
            picksBtn.innerHTML      = `${emoji} Loading…`;
            picksBtn.style.transform = 'scale(0.95)';
        }

        setTimeout(() => {
            if (picksBtn) picksBtn.innerHTML = '✨ Here we go!';
            setTimeout(() => { window.location.href = this.currentLesson.url; }, 300);
        }, 200);
    },

    updateRecommendation() {
        const picksDesc = document.getElementById('picks-desc');
        const picksBtn  = document.getElementById('picks-btn');
        if (!picksDesc || this.allOptions.length === 0) return;

        // 60% chance of direct lesson, 40% landing page
        const preferDirect = Math.random() < 0.6;
        const directLessons = this.allOptions.filter(l => l.isDirectLesson);

        if (preferDirect && directLessons.length > 0) {
            this.currentLesson = directLessons[Math.floor(Math.random() * directLessons.length)];
        } else {
            this.currentLesson = this.allOptions[Math.floor(Math.random() * this.allOptions.length)];
        }

        picksDesc.style.opacity   = '0';
        picksDesc.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            const lesson      = this.currentLesson;
            const directBadge = lesson.isDirectLesson
                ? '<span class="picks-direct-badge">⚡ Direct Access</span>' : '';
            const styleChoice = Math.floor(Math.random() * 3);
            let content = '';

            switch (styleChoice) {
                case 0:
                    content = `
                        <div class="picks-full-preview">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                                ${lesson.time ? `<span class="picks-time">${lesson.time}</span>` : ''}
                            </div>
                            ${directBadge}
                            <div class="picks-preview">${lesson.preview}</div>
                            <div class="picks-learnings">💡 ${lesson.keyLearnings[0]} • ${lesson.keyLearnings[1]}</div>
                        </div>`;
                    if (picksBtn) picksBtn.innerHTML = lesson.isDirectLesson ? '🎯 Jump In!' : "🎯 Let's Go!";
                    break;
                case 1:
                    content = `
                        <div class="picks-funfact">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-fact">${lesson.funFact}</div>
                            <div class="picks-time-badge">${lesson.time ? lesson.time + ' • ' : ''}${lesson.preview}</div>
                        </div>`;
                    if (picksBtn) picksBtn.innerHTML = lesson.isDirectLesson ? '⚡ Start Now!' : '🚀 Discover!';
                    break;
                case 2:
                    content = `
                        <div class="picks-mystery">
                            <div class="picks-mystery-text">✨ ${lesson.isDirectLesson ? 'Quick Lesson' : 'Mystery Pick'} Revealed!</div>
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-tagline">${lesson.tagline}</div>
                            <div class="picks-meta">${lesson.time ? lesson.time + ' • ' : ''}${lesson.keyLearnings.length} key skills</div>
                        </div>`;
                    if (picksBtn) picksBtn.innerHTML = lesson.isDirectLesson ? "⚡ Let's Learn!" : '🎁 Surprise Me!';
                    break;
            }

            picksDesc.innerHTML = content;
            picksDesc.style.transition = 'opacity 0.5s, transform 0.5s';
            picksDesc.style.opacity    = '1';
            picksDesc.style.transform  = 'translateY(0)';
        }, 300);
    }
};

// ── Expose globally so index.html can delegate to it without duplication ──
window.coolPicksWidget = coolPicksWidget;

// Self-initialise when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => coolPicksWidget.init());
} else {
    coolPicksWidget.init();
}
