// Cool Picks Widget - Auto-Discovery Version
// Automatically finds lessons and mixes landing pages with actual content
// Zero maintenance - just add lessons to your site and they'll be discovered!

const coolPicksWidget = {
    lessons: [],
    currentLesson: null,
    isAnimating: false,
    initialized: false,

    // Base lesson categories with their landing pages
    baseLessons: [
        {
            name: 'Business English',
            url: 'business/',
            icon: '💼',
            category: 'specialized',
            tagline: 'Level up your professional game',
            time: '8 min',
            preview: 'Master meetings, emails & presentations',
            keyLearnings: ['Professional communication', 'Business vocabulary', 'Formal writing'],
            funFact: 'Did you know? "Think outside the box" originated in the 1970s!',
            hasSubLessons: true
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
            funFact: 'Fun fact: The word "tax" comes from Latin "taxare" meaning "to assess"!',
            hasSubLessons: true
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
            funFact: 'Cool fact: "Hereby" and "herein" date back to Old English legal documents!',
            hasSubLessons: true
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
            funFact: 'Every expert was once a beginner! You\'ve got this! 💪',
            hasSubLessons: true
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
            funFact: 'English has over 170,000 words in current use - let\'s learn them! 📚',
            hasSubLessons: true
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
            funFact: 'Shakespeare invented over 1,700 words we still use today! 🎭',
            hasSubLessons: true
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
            funFact: 'Playing games boosts memory retention by 40%! Time to play! 🎲',
            hasSubLessons: false
        }
    ],

    // Common lesson patterns to look for
    lessonPatterns: [
        { pattern: 'lesson', icon: '📖', type: 'lesson' },
        { pattern: 'unit', icon: '📚', type: 'lesson' },
        { pattern: 'chapter', icon: '📝', type: 'lesson' },
        { pattern: 'module', icon: '🎓', type: 'lesson' },
        { pattern: 'exercise', icon: '✏️', type: 'practice' },
        { pattern: 'quiz', icon: '❓', type: 'practice' },
        { pattern: 'practice', icon: '💪', type: 'practice' },
        { pattern: 'test', icon: '📋', type: 'practice' }
    ],

    // Auto-discover lessons from the current directory structure
    async discoverLessons() {
        console.log('🔍 Starting lesson discovery...');
        const allLessons = [...this.baseLessons];

        // For each base lesson that has sub-lessons, try to discover them
        for (const baseLesson of this.baseLessons) {
            if (!baseLesson.hasSubLessons) continue;

            try {
                // Try to fetch the landing page to find links
                const response = await fetch(baseLesson.url);
                if (!response.ok) continue;

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Find all links in the page
                const links = doc.querySelectorAll('a[href]');
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    const text = link.textContent.trim();
                    
                    // Skip if empty, external, or hash link
                    if (!href || href.startsWith('http') || href.startsWith('#') || href === '../') return;
                    
                    // Check if it matches our lesson patterns
                    const lowerHref = href.toLowerCase();
                    const lowerText = text.toLowerCase();
                    
                    for (const {pattern, icon, type} of this.lessonPatterns) {
                        if (lowerHref.includes(pattern) || lowerText.includes(pattern)) {
                            // Build full URL
                            let fullUrl = baseLesson.url;
                            if (!fullUrl.endsWith('/')) fullUrl += '/';
                            fullUrl += href;

                            // Extract lesson number/name if possible
                            const lessonName = this.extractLessonName(text, baseLesson.name, pattern);
                            
                            allLessons.push({
                                name: lessonName,
                                url: fullUrl,
                                icon: icon,
                                category: baseLesson.category,
                                tagline: `Part of ${baseLesson.name}`,
                                time: this.estimateTime(type),
                                preview: `Direct ${type} content - jump right in!`,
                                keyLearnings: baseLesson.keyLearnings,
                                funFact: `🎯 This takes you straight to the content!`,
                                isDirectLesson: true,
                                parentLesson: baseLesson.name
                            });

                            console.log(`✅ Found: ${lessonName} at ${fullUrl}`);
                            break; // Only match first pattern
                        }
                    }
                });

            } catch (error) {
                console.log(`⚠️ Could not scan ${baseLesson.name}:`, error.message);
            }
        }

        console.log(`🎉 Discovery complete! Found ${allLessons.length} total lessons (${allLessons.filter(l => l.isDirectLesson).length} direct lessons)`);
        return allLessons;
    },

    // Extract a nice lesson name from link text
    extractLessonName(text, parentName, pattern) {
        // Clean up the text
        let name = text.replace(/\s+/g, ' ').trim();
        
        // If it's too short or generic, enhance it
        if (name.length < 3 || name.toLowerCase() === pattern) {
            const match = text.match(/\d+/);
            if (match) {
                name = `${parentName} - Part ${match[0]}`;
            } else {
                name = `${parentName} - ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}`;
            }
        }
        
        // Limit length
        if (name.length > 50) {
            name = name.substring(0, 47) + '...';
        }
        
        return name;
    },

    // Estimate time based on lesson type
    estimateTime(type) {
        const times = {
            'lesson': ['8 min', '10 min', '12 min', '15 min'],
            'practice': ['5 min', '7 min', '10 min']
        };
        const timeArray = times[type] || times['lesson'];
        return timeArray[Math.floor(Math.random() * timeArray.length)];
    },

    // Recommendation strategies (now includes direct lessons)
    strategies: {
        random: function(lessons) {
            return lessons[Math.floor(Math.random() * lessons.length)];
        },
        directLesson: function(lessons) {
            const direct = lessons.filter(l => l.isDirectLesson);
            return direct.length > 0 
                ? direct[Math.floor(Math.random() * direct.length)]
                : lessons[Math.floor(Math.random() * lessons.length)];
        },
        landingPage: function(lessons) {
            const landing = lessons.filter(l => !l.isDirectLesson);
            return landing[Math.floor(Math.random() * landing.length)];
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
    async init() {
        const picksBtn = document.getElementById('picks-btn');
        const picksDesc = document.getElementById('picks-desc');
        const picksContainer = document.getElementById('cool-picks-widget');

        if (!picksBtn || !picksDesc) {
            console.error('Cool Picks: Required elements not found!');
            return;
        }

        console.log('🚀 Cool Picks Enhanced Auto-Discovery starting...');

        // Show loading state
        picksDesc.innerHTML = '<div class="picks-loading">🔍 Finding awesome lessons...</div>';

        // Discover all lessons
        this.lessons = await this.discoverLessons();
        this.initialized = true;

        console.log('✅ Cool Picks initialized with', this.lessons.length, 'lessons');

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
            if (!this.isAnimating && this.initialized) {
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

        // If "Surprise Me" button, always pick a random direct lesson
        if (picksBtn.innerHTML.includes('Surprise Me')) {
            const directLessons = this.lessons.filter(l => l.isDirectLesson);
            if (directLessons.length > 0) {
                this.currentLesson = directLessons[Math.floor(Math.random() * directLessons.length)];
                console.log('🎁 Surprise Me! Picked:', this.currentLesson.name);
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
        if (!picksDesc || this.lessons.length === 0) return;

        // Weight strategies to favor direct lessons
        const strategyPool = [
            'directLesson', 'directLesson', 'directLesson', // 3x weight for direct lessons
            'random', 'random', // 2x weight for random
            'landingPage', // 1x weight for landing pages
            'specialized',
            'general',
            'fun'
        ];
        
        const randomStrategy = strategyPool[Math.floor(Math.random() * strategyPool.length)];
        
        // Get recommendation
        const lesson = this.strategies[randomStrategy](this.lessons);
        this.currentLesson = lesson;

        console.log(`🎲 New recommendation (${randomStrategy}):`, lesson.name, lesson.isDirectLesson ? '(Direct Lesson)' : '(Landing Page)');

        // Animate out
        picksDesc.style.opacity = '0';
        picksDesc.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            // Choose presentation style
            const styleChoice = Math.floor(Math.random() * 3);
            let content = '';

            // Add special badge for direct lessons
            const directBadge = lesson.isDirectLesson 
                ? '<span class="picks-direct-badge">⚡ Direct Access</span>' 
                : '';

            switch(styleChoice) {
                case 0: // Full preview with key learnings
                    content = `
                        <div class="picks-full-preview">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                                <span class="picks-time">${lesson.time}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-preview">${lesson.preview}</div>
                            <div class="picks-learnings">
                                💡 ${lesson.keyLearnings[0]} • ${lesson.keyLearnings[1]}
                            </div>
                        </div>
                    `;
                    picksBtn.innerHTML = lesson.isDirectLesson ? '🎯 Jump In!' : '🎯 Let\'s Go!';
                    break;

                case 1: // Fun fact style
                    content = `
                        <div class="picks-funfact">
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-fact">${lesson.funFact}</div>
                            <div class="picks-time-badge">${lesson.time} • ${lesson.preview}</div>
                        </div>
                    `;
                    picksBtn.innerHTML = lesson.isDirectLesson ? '⚡ Start Now!' : '🚀 Discover!';
                    break;

                case 2: // Mystery teaser style
                    content = `
                        <div class="picks-mystery">
                            <div class="picks-mystery-text">✨ ${lesson.isDirectLesson ? 'Quick Lesson' : 'Mystery Pick'} Revealed!</div>
                            <div class="picks-header-row">
                                ${lesson.icon} <span class="lesson-name-link">${lesson.name}</span>
                            </div>
                            ${directBadge}
                            <div class="picks-tagline">${lesson.tagline}</div>
                            <div class="picks-meta">${lesson.time} • ${lesson.keyLearnings.length} key skills</div>
                        </div>
                    `;
                    picksBtn.innerHTML = lesson.isDirectLesson ? '⚡ Let\'s Learn!' : '🎁 Surprise Me!';
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
