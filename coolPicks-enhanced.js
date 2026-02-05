// Cool Picks Widget - Enhanced Gamified Version
// Features: Mystery vibe, clickable lesson names, previews, time estimates, key learnings

const coolPicksWidget = {
    // Define all available lessons with enhanced data
    lessons: [
        {
            name: 'Business English',
            url: 'business/',
            icon: '💼',
            category: 'specialized',
            tagline: 'Level up your professional game',
            time: '8 min',
            preview: 'Master meetings, emails & presentations',
            keyLearnings: ['Professional communication', 'Business vocabulary', 'Formal writing'],
            funFact: 'Did you know? "Think outside the box" originated in the 1970s!'
        },
        {
            name: 'Tax English',
            url: 'tax/',
            icon: '💰',
            category: 'specialized',
            tagline: 'Master the money talk',
            time: '6 min',
            preview: 'Navigate tax terminology with confidence',
            keyLearnings: ['Tax vocabulary', 'Accounting terms', 'Financial documentation'],
            funFact: 'Fun fact: The word "tax" comes from Latin "taxare" meaning "to assess"!'
        },
        {
            name: 'Legal English',
            url: 'legal/',
            icon: '⚖️',
            category: 'specialized',
            tagline: 'Navigate legal lingo like a pro',
            time: '7 min',
            preview: 'Understand contracts & legal documents',
            keyLearnings: ['Contract language', 'Legal terminology', 'Court procedures'],
            funFact: 'Cool fact: "Hereby" and "herein" date back to Old English legal documents!'
        },
        {
            name: 'Beginner Course',
            url: 'beginner/',
            icon: '🌱',
            category: 'general',
            tagline: 'Start your English adventure',
            time: '5 min',
            preview: 'Build your foundation from scratch',
            keyLearnings: ['Basic grammar', 'Common phrases', 'Essential vocabulary'],
            funFact: 'Every expert was once a beginner! You\'ve got this! 💪'
        },
        {
            name: 'Intermediate Course',
            url: 'intermediate/',
            icon: '🚀',
            category: 'general',
            tagline: 'Take your skills to the next level',
            time: '10 min',
            preview: 'Expand your vocabulary & confidence',
            keyLearnings: ['Complex grammar', 'Idioms & expressions', 'Real-world situations'],
            funFact: 'English has over 170,000 words in current use - let\'s learn them! 📚'
        },
        {
            name: 'Advanced Course',
            url: 'advanced/',
            icon: '🎯',
            category: 'general',
            tagline: 'Achieve English mastery',
            time: '12 min',
            preview: 'Perfect your fluency & sophistication',
            keyLearnings: ['Native-like fluency', 'Advanced idioms', 'Subtle nuances'],
            funFact: 'Shakespeare invented over 1,700 words we still use today! 🎭'
        },
        {
            name: 'Game Zone',
            url: 'games/',
            icon: '🎮',
            category: 'fun',
            tagline: 'Learn while having fun',
            time: '3 min',
            preview: 'Challenge yourself with fun games',
            keyLearnings: ['Interactive learning', 'Quick practice', 'Test your skills'],
            funFact: 'Playing games boosts memory retention by 40%! Time to play! 🎲'
        }
    ],

    currentLesson: null,
    isAnimating: false,

    // Different recommendation strategies
    strategies: {
        random: function(lessons) {
            return lessons[Math.floor(Math.random() * lessons.length)];
        },
        specialized: function(lessons) {
            const specialized = lessons.filter(l => l.category === 'specialized');
            return specialized[Math.floor(Math.random() * specialized.length)];
        },
        general: function(lessons) {
            const general = lessons.filter(l => l.category === 'general');
            return general[Math.floor(Math.random() * general.length)];
        },
        fun: function(lessons) {
            const fun = lessons.filter(l => l.category === 'fun');
            return fun.length > 0 ? fun[0] : lessons[0];
        }
    },

    // Initialize the widget
    init: function() {
        const picksBtn = document.getElementById('picks-btn');
        const picksDesc = document.getElementById('picks-desc');
        const picksContainer = document.getElementById('cool-picks-widget');

        if (!picksBtn || !picksDesc) {
            console.error('Cool Picks: Required elements not found!');
            return;
        }

        console.log('✅ Cool Picks Enhanced initialized');

        // Set initial recommendation
        this.updateRecommendation();

        // Handle button click
        picksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleButtonClick();
        });

        // Make lesson name clickable
        picksDesc.addEventListener('click', (e) => {
            // Check if clicked on the lesson name
            if (e.target.classList.contains('lesson-name-link')) {
                e.preventDefault();
                this.handleButtonClick();
            }
        });

        // Change recommendation every 15 seconds
        setInterval(() => {
            if (!this.isAnimating) {
                this.updateRecommendation();
            }
        }, 15000);

        // Add hover effect to widget
        if (picksContainer) {
            picksContainer.addEventListener('mouseenter', () => {
                picksContainer.style.transform = 'translateY(-4px) scale(1.02)';
            });
            picksContainer.addEventListener('mouseleave', () => {
                picksContainer.style.transform = 'translateY(0) scale(1)';
            });
        }
    },

    // Handle button click with animation
    handleButtonClick: function() {
        if (this.isAnimating || !this.currentLesson) return;

        this.isAnimating = true;
        const picksBtn = document.getElementById('picks-btn');
        const picksWidget = document.getElementById('cool-picks-widget');

        // Exciting animation before navigation
        picksBtn.innerHTML = '🚀 Loading...';
        picksBtn.style.transform = 'scale(0.95)';
        
        picksWidget.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            picksBtn.innerHTML = '✨ Here we go!';
            
            setTimeout(() => {
                console.log('🚀 Navigating to:', this.currentLesson.url);
                window.location.href = this.currentLesson.url;
            }, 300);
        }, 200);
    },

    // Update the recommendation display
    updateRecommendation: function() {
        const picksDesc = document.getElementById('picks-desc');
        const picksBtn = document.getElementById('picks-btn');
        if (!picksDesc) return;

        // Choose a random strategy
        const strategyNames = Object.keys(this.strategies);
        const randomStrategy = strategyNames[Math.floor(Math.random() * strategyNames.length)];
        
        // Get recommendation
        const lesson = this.strategies[randomStrategy](this.lessons);
        this.currentLesson = lesson;

        console.log('🎲 New recommendation:', lesson.name);

        // Animate out
        picksDesc.style.opacity = '0';
        picksDesc.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            // Decide which style to show (rotate between different presentations)
            const styleChoice = Math.floor(Math.random() * 3);
            let content = '';

            switch(styleChoice) {
                case 0: // Full preview with key learnings
                    content = `
                        <div class="picks-full-preview">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                                <span class="picks-time">${lesson.time}</span>
                            </div>
                            <div class="picks-preview">${lesson.preview}</div>
                            <div class="picks-learnings">
                                💡 ${lesson.keyLearnings[0]} • ${lesson.keyLearnings[1]}
                            </div>
                        </div>
                    `;
                    picksBtn.innerHTML = '🎯 Let\'s Go!';
                    break;

                case 1: // Fun fact style
                    content = `
                        <div class="picks-funfact">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            <div class="picks-fact">${lesson.funFact}</div>
                            <div class="picks-time-badge">${lesson.time} • ${lesson.preview}</div>
                        </div>
                    `;
                    picksBtn.innerHTML = '🚀 Discover!';
                    break;

                case 2: // Mystery teaser style
                    content = `
                        <div class="picks-mystery">
                            <div class="picks-mystery-text">✨ Mystery Pick Revealed!</div>
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            <div class="picks-tagline">${lesson.tagline}</div>
                            <div class="picks-meta">${lesson.time} • ${lesson.keyLearnings.length} key skills</div>
                        </div>
                    `;
                    picksBtn.innerHTML = '🎁 Surprise Me!';
                    break;
            }

            picksDesc.innerHTML = content;
            
            // Animate in
            picksDesc.style.transition = 'opacity 0.5s, transform 0.5s';
            picksDesc.style.opacity = '1';
            picksDesc.style.transform = 'translateY(0)';

            // Add click handler to new lesson name link
            const lessonLink = picksDesc.querySelector('.lesson-name-link');
            if (lessonLink) {
                lessonLink.style.cursor = 'pointer';
            }
        }, 300);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        coolPicksWidget.init();
    });
} else {
    coolPicksWidget.init();
}
