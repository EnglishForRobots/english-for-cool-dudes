// Cool Picks Widget - GitHub Lessons Version
// Simple config-based system that mixes landing pages with actual lessons

const coolPicksWidget = {
    // CONFIGURATION: Add your actual lesson URLs here
    // Format: { url: '/lessonname/', time: '7 min', name: 'Custom Name', category: 'beginner' }
    // Categories: 'beginner', 'intermediate', 'advanced', 'business', 'tax', 'legal', 'fun'
    actualLessons: [
        // Add your lesson folders here with their actual durations, names, and categories:
       { url: '/coffee/', time: '7 mins', name: 'Beginner: The Legend of Coffee', category: 'beginner' },
        { url: '/invisibleofficegame/', time: '8 mins', name: 'Tax: Invisible Office', category: 'tax' },
{ url: '/transferpricing/', time: '9 mins', name: 'The Transfer Pricing Trap', category: 'tax' },
        { url: '/flyingtaxis/', time: '9 mins', name: 'Advanced: Flying Taxis', category: 'advanced' },
        { url: '/sandwich/', time: '5 mins', name: 'Beginner: The Earl of Sandwich', category: 'beginner' },
        { url: '/aivideos/', time: '11 mins', name: 'Advanced: AI Videos', category: 'advanced' },
        { url: '/whatami/', time: '5 mins', name: 'Games: What Am I?', category: 'games' },
        { url: '/sleepscience/', time: '9 mins', name: 'Intermediate: The Science of Sleep', category: 'intermediate' },
        { url: '/crisismanagement/', time: '5 mins', name: 'Business: Crisis Management', category: 'business' },
         
        { url: '/corporateempires/', time: '7 mins', name: 'Legal: Corporate Empires', category: 'legal' },
        
         { url: '/aipolicing/', time: '7 mins', name: 'Intermediate: AI on Patrol: When Algorithms Lie', category: 'intermediate' },
        
        // Add more lessons with appropriate categories:
        // { url: '/taxterms/', time: '10 min', name: 'Tax Terms', category: 'tax' },
        // { url: '/contracts/', time: '12 min', name: 'Contracts', category: 'legal' },
        // { url: '/wordgame/', time: '7 min', name: 'Word Game', category: 'fun' },
    ],

    // Landing pages (keep these as they are)
    landingPages: [
        {
            name: 'Business English',
            url: '/business/',
            icon: '💼',
            category: 'business',
            tagline: 'Level up your professional game',
            time: '', // No time for landing pages
            preview: 'Master meetings, emails & presentations',
            keyLearnings: ['Professional communication', 'Business vocabulary', 'Formal writing'],
            funFact: 'Did you know? "Think outside the box" originated in the 1970s!'
        },
        {
            name: 'Tax English',
            url: '/tax/',
            icon: '💰',
            category: 'tax',
            tagline: 'Master the money talk',
            time: '', // No time for landing pages
            preview: 'Navigate tax terminology with confidence',
            keyLearnings: ['Tax vocabulary', 'Accounting terms', 'Financial documentation'],
            funFact: 'Fun fact: The word "tax" comes from Latin "taxare" meaning "to assess"!'
        },
        {
            name: 'Legal English',
            url: '/legal/',
            icon: '⚖️',
            category: 'legal',
            tagline: 'Navigate legal lingo like a pro',
            time: '', // No time for landing pages
            preview: 'Understand contracts & legal documents',
            keyLearnings: ['Contract language', 'Legal terminology', 'Court procedures'],
            funFact: 'Cool fact: "Hereby" and "herein" date back to Old English legal documents!'
        },
        {
            name: 'Beginner Course',
            url: '/beginner/',
            icon: '🌱',
            category: 'beginner',
            tagline: 'Start your English adventure',
            time: '', // No time for landing pages
            preview: 'Build your foundation from scratch',
            keyLearnings: ['Basic grammar', 'Common phrases', 'Essential vocabulary'],
            funFact: 'Every expert was once a beginner! You\'ve got this! 💪'
        },
        {
            name: 'Intermediate Course',
            url: '/intermediate/',
            icon: '🚀',
            category: 'intermediate',
            tagline: 'Take your skills to the next level',
            time: '', // No time for landing pages
            preview: 'Expand your vocabulary & confidence',
            keyLearnings: ['Complex grammar', 'Idioms & expressions', 'Real-world situations'],
            funFact: 'English has over 170,000 words in current use - let\'s learn them! 📚'
        },
        {
            name: 'Advanced Course',
            url: '/advanced/',
            icon: '🎯',
            category: 'advanced',
            tagline: 'Achieve English mastery',
            time: '', // No time for landing pages
            preview: 'Perfect your fluency & sophistication',
            keyLearnings: ['Native-like fluency', 'Advanced idioms', 'Subtle nuances'],
            funFact: 'Shakespeare invented over 1,700 words we still use today! 🎭'
        },
        {
            name: 'Game Zone',
            url: '/games/',
            icon: '🎮',
            category: 'fun',
            tagline: 'Learn while having fun',
            time: '', // No time for landing pages
            preview: 'Challenge yourself with fun games',
            keyLearnings: ['Interactive learning', 'Quick practice', 'Test your skills'],
            funFact: 'Playing games boosts memory retention by 40%! Time to play! 🎲'
        }
    ],

    // Category mapping for specialized categories
    categoryMapping: {
        'business': 'specialized',
        'tax': 'specialized',
        'legal': 'specialized',
        'beginner': 'general',
        'intermediate': 'general',
        'advanced': 'general',
        'fun': 'fun'
    },

    allOptions: [],
    currentLesson: null,
    isAnimating: false,

    // Convert lesson URLs to nice display objects
    createLessonObjects() {
        const lessonIcons = ['📖', '✨', '🎯', '💡', '⚡', '🌟', '🔥', '💪', '🚀', '✏️'];
        const lessonPreviews = [
            'Jump right into learning!',
            'Direct lesson content awaits',
            'Start learning immediately',
            'Quick and focused practice',
            'Get straight to the good stuff',
            'No intro needed - let\'s go!',
            'Instant learning experience'
        ];

        return this.actualLessons.map((lesson, index) => {
            // Handle three formats: string URL, object with {url, time}, or object with {url, time, name, category}
            const url = typeof lesson === 'string' ? lesson : lesson.url;
            const time = typeof lesson === 'string' ? '8 min' : (lesson.time || '8 min');
            const category = typeof lesson === 'object' && lesson.category ? lesson.category : 'general';
            let lessonName = typeof lesson === 'object' && lesson.name ? lesson.name : null;
            
            // If no custom name provided, try to generate one
            if (!lessonName) {
                lessonName = url.replace(/\//g, '').replace(/-/g, ' ');
                
                // Try to split common compound words
                lessonName = lessonName
                    // Add space before capital letters
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    // Common word boundaries
                    .replace(/office/gi, ' Office')
                    .replace(/management/gi, ' Management')
                    .replace(/crisis/gi, 'Crisis ')
                    .replace(/video/gi, ' Video')
                    .replace(/bread/gi, ' Bread')
                    .replace(/sliced/gi, 'Sliced ')
                    .replace(/flying/gi, 'Flying ')
                    .replace(/taxi/gi, ' Taxi')
                    .replace(/invisible/gi, 'Invisible ')
                    // Clean up multiple spaces
                    .replace(/\s+/g, ' ')
                    .trim()
                    // Capitalize each word
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            }

            return {
                name: lessonName,
                url: url,
                icon: lessonIcons[index % lessonIcons.length],
                category: category,
                tagline: 'Direct lesson access',
                time: time,
                preview: lessonPreviews[Math.floor(Math.random() * lessonPreviews.length)],
                keyLearnings: ['Practical skills', 'Real examples', 'Hands-on practice'],
                funFact: '🎯 This takes you straight to the lesson!',
                isDirectLesson: true
            };
        });
    },

    // Initialize the widget
    init() {
        const picksBtn = document.getElementById('picks-btn');
        const picksDesc = document.getElementById('picks-desc');
        const picksContainer = document.getElementById('cool-picks-widget');

        if (!picksBtn || !picksDesc) {
            console.error('Cool Picks: Required elements not found!');
            return;
        }

        // Combine landing pages with actual lessons
        const lessonObjects = this.createLessonObjects();
        this.allOptions = [...this.landingPages, ...lessonObjects];

        console.log(`✅ Cool Picks initialized with ${this.landingPages.length} landing pages and ${lessonObjects.length} direct lessons`);
        
        // Log category breakdown
        const categoryCount = {};
        lessonObjects.forEach(lesson => {
            categoryCount[lesson.category] = (categoryCount[lesson.category] || 0) + 1;
        });
        console.log('📊 Lessons by category:', categoryCount);

        // Set initial recommendation
        this.updateRecommendation();

        // Handle button click
        picksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleButtonClick();
        });

        // Make lesson name clickable
        picksDesc.addEventListener('click', (e) => {
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
    handleButtonClick() {
        if (this.isAnimating || !this.currentLesson) return;

        this.isAnimating = true;
        const picksBtn = document.getElementById('picks-btn');
        const picksWidget = document.getElementById('cool-picks-widget');

        // If "Surprise Me" button (landing page), pick a random direct lesson FROM THE SAME CATEGORY
        if (picksBtn.innerHTML.includes('Surprise Me')) {
            const currentCategory = this.currentLesson.category;
            const categoryLessons = this.allOptions.filter(l => 
                l.isDirectLesson && l.category === currentCategory
            );
            
            if (categoryLessons.length > 0) {
                this.currentLesson = categoryLessons[Math.floor(Math.random() * categoryLessons.length)];
                console.log(`🎁 Surprise Me! Picked random ${currentCategory} lesson:`, this.currentLesson.name);
            } else {
                // Fallback: if no lessons in this category, pick any direct lesson
                const directLessons = this.allOptions.filter(l => l.isDirectLesson);
                if (directLessons.length > 0) {
                    this.currentLesson = directLessons[Math.floor(Math.random() * directLessons.length)];
                    console.warn(`⚠️ No ${currentCategory} lessons found, picked random lesson:`, this.currentLesson.name);
                }
            }
        }

        // Different animations for direct lessons vs landing pages
        const emoji = this.currentLesson.isDirectLesson ? '🎯' : '🚀';
        const message = this.currentLesson.isDirectLesson ? 'Jumping to lesson...' : 'Loading...';

        picksBtn.innerHTML = `${emoji} ${message}`;
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
    updateRecommendation() {
        const picksDesc = document.getElementById('picks-desc');
        const picksBtn = document.getElementById('picks-btn');
        if (!picksDesc || this.allOptions.length === 0) return;

        // 60% chance of direct lesson, 40% chance of landing page
        const preferDirectLessons = Math.random() < 0.6;
        
        if (preferDirectLessons) {
            const directLessons = this.allOptions.filter(l => l.isDirectLesson);
            if (directLessons.length > 0) {
                this.currentLesson = directLessons[Math.floor(Math.random() * directLessons.length)];
            } else {
                this.currentLesson = this.allOptions[Math.floor(Math.random() * this.allOptions.length)];
            }
        } else {
            this.currentLesson = this.allOptions[Math.floor(Math.random() * this.allOptions.length)];
        }

        console.log(`🎲 New recommendation:`, this.currentLesson.name, 
            `(${this.currentLesson.category})`,
            this.currentLesson.isDirectLesson ? '(Direct Lesson ⚡)' : '(Landing Page)');

        // Animate out
        picksDesc.style.opacity = '0';
        picksDesc.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            // Choose presentation style
            const styleChoice = Math.floor(Math.random() * 3);
            let content = '';

            // Add special badge for direct lessons
            const directBadge = this.currentLesson.isDirectLesson 
                ? '<span class="picks-direct-badge">⚡ Direct Access</span>' 
                : '';

            switch(styleChoice) {
                case 0: // Full preview with key learnings
                    content = `
                        <div class="picks-full-preview">
                            <div class="picks-header-row">
                                ${this.currentLesson.icon} <span class="lesson-name-link">${this.currentLesson.name}</span>
                                ${this.currentLesson.time ? `<span class="picks-time">${this.currentLesson.time}</span>` : ''}
                            </div>
                            ${directBadge}
                            <div class="picks-preview">${this.currentLesson.preview}</div>
                            <div class="picks-learnings">
                                💡 ${this.currentLesson.keyLearnings[0]} • ${this.currentLesson.keyLearnings[1]}
                            </div>
                        </div>
                    `;
                    picksBtn.innerHTML = this.currentLesson.isDirectLesson ? '🎯 Jump In!' : '🎯 Let\'s Go!';
                    break;

                case 1: // Fun fact style
                    content = `
                        <div class="picks-funfact">
                            <div class="picks-header-row">
                                ${this.currentLesson.icon} <span class="lesson-name-link">${this.currentLesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-fact">${this.currentLesson.funFact}</div>
                            <div class="picks-time-badge">${this.currentLesson.time ? this.currentLesson.time + ' • ' : ''}${this.currentLesson.preview}</div>
                        </div>
                    `;
                    picksBtn.innerHTML = this.currentLesson.isDirectLesson ? '⚡ Start Now!' : '🚀 Discover!';
                    break;

                case 2: // Mystery teaser style
                    // "Surprise Me" for landing pages (mystery), specific buttons for direct lessons
                    const buttonText = this.currentLesson.isDirectLesson ? '⚡ Let\'s Learn!' : '🎁 Surprise Me!';
                    content = `
                        <div class="picks-mystery">
                            <div class="picks-mystery-text">✨ ${this.currentLesson.isDirectLesson ? 'Quick Lesson' : 'Mystery Pick'} Revealed!</div>
                            <div class="picks-header-row">
                                ${this.currentLesson.icon} <span class="lesson-name-link">${this.currentLesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-tagline">${this.currentLesson.tagline}</div>
                            <div class="picks-meta">${this.currentLesson.time ? this.currentLesson.time + ' • ' : ''}${this.currentLesson.keyLearnings.length} key skills</div>
                        </div>
                    `;
                    picksBtn.innerHTML = buttonText;
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
