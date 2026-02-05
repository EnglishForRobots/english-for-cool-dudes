// Cool Picks Widget - Recommends lessons to users
// Fixed version with working button navigation

const coolPicksWidget = {
    // Define all available lessons
    lessons: [
        {
            name: 'Business English',
            url: 'business/',
            icon: '💼',
            category: 'specialized',
            tagline: 'Level up your professional game'
        },
        {
            name: 'Tax English',
            url: 'tax/',
            icon: '💰',
            category: 'specialized',
            tagline: 'Master the money talk'
        },
        {
            name: 'Legal English',
            url: 'legal/',
            icon: '⚖️',
            category: 'specialized',
            tagline: 'Navigate legal lingo like a pro'
        },
        {
            name: 'Beginner Course',
            url: 'beginner/',
            icon: '🌱',
            category: 'general',
            tagline: 'Start your English adventure'
        },
        {
            name: 'Intermediate Course',
            url: 'intermediate/',
            icon: '🚀',
            category: 'general',
            tagline: 'Take your skills to the next level'
        },
        {
            name: 'Advanced Course',
            url: 'advanced/',
            icon: '🎯',
            category: 'general',
            tagline: 'Achieve English mastery'
        },
        {
            name: 'Game Zone',
            url: 'games/',
            icon: '🎮',
            category: 'fun',
            tagline: 'Learn while having fun'
        }
    ],

    // Different recommendation strategies
    strategies: {
        // Random lesson
        random: function(lessons) {
            return lessons[Math.floor(Math.random() * lessons.length)];
        },

        // Prioritize specialized courses
        specialized: function(lessons) {
            const specialized = lessons.filter(l => l.category === 'specialized');
            return specialized[Math.floor(Math.random() * specialized.length)];
        },

        // Prioritize general courses
        general: function(lessons) {
            const general = lessons.filter(l => l.category === 'general');
            return general[Math.floor(Math.random() * general.length)];
        },

        // Fun stuff
        fun: function(lessons) {
            const fun = lessons.filter(l => l.category === 'fun');
            return fun.length > 0 ? fun[0] : lessons[0];
        }
    },

    // Initialize the widget
    init: function() {
        const picksBtn = document.getElementById('picks-btn');
        const picksDesc = document.getElementById('picks-desc');

        if (!picksBtn || !picksDesc) {
            console.error('Cool Picks: Button or description element not found!');
            return;
        }

        console.log('✅ Cool Picks initialized');

        // Set initial random recommendation on page load
        this.updateRecommendation();

        // Handle button click - FIXED VERSION
        picksBtn.addEventListener('click', () => {
            const currentLesson = this.getCurrentRecommendation();
            
            console.log('🔘 Button clicked! Current lesson:', currentLesson);
            
            if (currentLesson && currentLesson.url) {
                console.log('🚀 Navigating to:', currentLesson.url);
                window.location.href = currentLesson.url;
            } else {
                console.error('❌ No lesson found to navigate to!');
            }
        });

        // Change recommendation every 10 seconds
        setInterval(() => {
            this.updateRecommendation();
        }, 10000);
    },

    // Get current recommendation
    getCurrentRecommendation: function() {
        const picksDesc = document.getElementById('picks-desc');
        if (!picksDesc) return null;

        // Store current recommendation in data attribute
        const lessonName = picksDesc.getAttribute('data-current-lesson');
        const lesson = this.lessons.find(l => l.name === lessonName);
        
        console.log('📖 Current recommendation:', lesson);
        return lesson;
    },

    // Update the recommendation display
    updateRecommendation: function() {
        const picksDesc = document.getElementById('picks-desc');
        if (!picksDesc) return;

        // Choose a random strategy
        const strategyNames = Object.keys(this.strategies);
        const randomStrategy = strategyNames[Math.floor(Math.random() * strategyNames.length)];
        
        // Get recommendation
        const lesson = this.strategies[randomStrategy](this.lessons);

        console.log('🎲 New recommendation:', lesson.name);

        // Store current lesson
        picksDesc.setAttribute('data-current-lesson', lesson.name);

        // Update the description with animation
        picksDesc.style.opacity = '0';
        setTimeout(() => {
            picksDesc.innerHTML = `${lesson.icon} ${lesson.tagline} — Try <strong>${lesson.name}</strong>!`;
            picksDesc.style.transition = 'opacity 0.5s';
            picksDesc.style.opacity = '1';
        }, 300);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        coolPicksWidget.init();
    });
} else {
    // DOM already loaded
    coolPicksWidget.init();
}
