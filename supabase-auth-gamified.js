// =========================================
// SUPABASE AUTH WITH GAMIFICATION SYSTEM
// Complete XP, Levels, Streaks, Achievements
// =========================================

// Use existing client or wait for it to be created
function getSupabaseClient() {
    return window.efcdSupabaseClient;
}

let currentUser = null;

// =========================================
// GAMIFICATION CONSTANTS
// =========================================

const XP_REWARDS = {
    lesson_complete: 100,
    perfect_score: 50,
    daily_bonus: 25,
    streak_bonus_per_day: 10,
    first_category: 25,
    achievement: 50
};

const LEVELS = [
    { level: 1, name: 'Beginner', minXP: 0, maxXP: 499 },
    { level: 2, name: 'Learner', minXP: 500, maxXP: 1499 },
    { level: 3, name: 'Cool Dude', minXP: 1500, maxXP: 2999 },
    { level: 4, name: 'Expert', minXP: 3000, maxXP: 4999 },
    { level: 5, name: 'Legend', minXP: 5000, maxXP: 9999 },
    { level: 6, name: 'Master', minXP: 10000, maxXP: 999999 }
];

const ACHIEVEMENTS = {
    first_lesson: { 
        id: 'first_lesson',
        icon: '🎯', 
        name: 'First Steps', 
        description: 'Complete your first lesson',
        xp: 50,
        check: (user) => user.total_lessons >= 1
    },
    perfect_score: { 
        id: 'perfect_score',
        icon: '💯', 
        name: 'Perfectionist', 
        description: 'Get 100% on any quiz',
        xp: 100,
        check: (user, data) => data?.perfectScore === true
    },
    speed_demon: { 
        id: 'speed_demon',
        icon: '⚡', 
        name: 'Speed Demon', 
        description: 'Complete a lesson in under 5 minutes',
        xp: 75,
        check: (user, data) => data?.completionTime < 300
    },
    week_streak: { 
        id: 'week_streak',
        icon: '🔥', 
        name: 'Week Warrior', 
        description: 'Maintain a 7-day streak',
        xp: 100,
        check: (user) => user.streak >= 7
    },
    month_streak: { 
        id: 'month_streak',
        icon: '💎', 
        name: 'Diamond Streak', 
        description: 'Maintain a 30-day streak',
        xp: 500,
        check: (user) => user.streak >= 30
    },
    night_owl: { 
        id: 'night_owl',
        icon: '🦉', 
        name: 'Night Owl', 
        description: 'Complete a lesson between 10 PM and 6 AM',
        xp: 50,
        check: (user, data) => {
            const hour = new Date().getHours();
            return hour >= 22 || hour < 6;
        }
    },
    early_bird: { 
        id: 'early_bird',
        icon: '🐦', 
        name: 'Early Bird', 
        description: 'Complete a lesson between 6 AM and 9 AM',
        xp: 50,
        check: (user, data) => {
            const hour = new Date().getHours();
            return hour >= 6 && hour < 9;
        }
    },
    ten_lessons: { 
        id: 'ten_lessons',
        icon: '🏆', 
        name: 'Dedicated Learner', 
        description: 'Complete 10 lessons',
        xp: 200,
        check: (user) => user.total_lessons >= 10
    },
    vocab_collector: { 
        id: 'vocab_collector',
        icon: '📚', 
        name: 'Vocab Hoarder', 
        description: 'Save 50 vocabulary words',
        xp: 150,
        // ── FIX ──────────────────────────────────────────────────────
        // OLD CODE used data.totalVocab which was fetched AFTER the new
        // lesson was already saved to the DB — so the count was always
        // ahead of where it should fire.
        //
        // NEW CODE receives two separate values:
        //   totalVocabBefore   = words already in DB (fetched BEFORE save)
        //   currentLessonVocab = words in THIS lesson (not yet in DB)
        //
        // Adding them gives the true running total at the moment the
        // lesson completes, so the badge fires on exactly the right lesson.
        // ─────────────────────────────────────────────────────────────
        check: (user, data) => {
            const total = (data?.totalVocabBefore || 0) + (data?.currentLessonVocab || 0);
            console.log('🔍 Vocab Hoarder — before:', data?.totalVocabBefore, '+ this lesson:', data?.currentLessonVocab, '= total:', total);
            return total >= 50;
        }
    }
};

// =========================================
// INITIALIZATION
// =========================================

async function initAuth() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.warn('⚠️ Supabase not initialized');
        return null;
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Auth error:', error);
            return null;
        }

        if (user) {
            currentUser = await getOrCreateUserProfile(user);
            console.log('✅ User logged in:', currentUser.email);
            return currentUser;
        }
        
        return null;
    } catch (err) {
        console.error('Init auth error:', err);
        return null;
    }
}

// =========================================
// USER PROFILE MANAGEMENT
// =========================================

async function getOrCreateUserProfile(user) {
    const supabase = getSupabaseClient();
    if (!supabase) return createBasicProfile(user);
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Profile fetch error:', error);
            return createBasicProfile(user);
        }

        if (profile) {
            return {
                id: profile.id,
                email: user.email,
                name: profile.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
                xp: profile.xp || 0,
                level: profile.level || 1,
                streak: profile.streak || 0,
                streakFreezes: profile.streak_freezes || 0,
                completedLessons: profile.completed_lessons || [],
                totalLessons: profile.total_lessons || 0,
                totalPoints: profile.total_points || 0,
                achievements: profile.achievements || [],
                lastLessonDate: profile.last_lesson_date,
                createdAt: profile.created_at
            };
        }

        // Create new profile
        const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            xp: 0,
            level: 1,
            streak: 0,
            streak_freezes: 0,
            completed_lessons: [],
            total_lessons: 0,
            total_points: 0,
            achievements: [],
            last_lesson_date: null,
            created_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);

        if (insertError) {
            console.error('Profile creation error:', insertError);
        }

        return {
            id: newProfile.id,
            email: user.email,
            name: newProfile.full_name,
            xp: 0,
            level: 1,
            streak: 0,
            streakFreezes: 0,
            completedLessons: [],
            totalLessons: 0,
            totalPoints: 0,
            achievements: [],
            lastLessonDate: null,
            createdAt: newProfile.created_at
        };
    } catch (err) {
        console.error('Get/create profile error:', err);
        return createBasicProfile(user);
    }
}

function createBasicProfile(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        xp: 0,
        level: 1,
        streak: 0,
        streakFreezes: 0,
        completedLessons: [],
        totalLessons: 0,
        totalPoints: 0,
        achievements: [],
        lastLessonDate: null
    };
}

// =========================================
// LESSON COMPLETION (CORE GAMIFICATION)
// =========================================

async function completeLesson(lessonData) {
    const supabase = getSupabaseClient();
    if (!currentUser || !supabase) {
        console.warn('⚠️ No user logged in - lesson not saved');
        return { success: false, message: 'Please log in to save progress' };
    }

    try {
        const {
            lessonId,
            lessonTitle,
            lessonLevel,
            lessonLink,
            vocabulary = [],
            grammar = [],
            perfectScore = false,
            completionTime = null
        } = lessonData;

        const today = new Date().toDateString();

        // ── STEP 1: Fetch existing vocab count BEFORE saving anything ──
        // This is the key fix — we capture the "before" state so the
        // achievement check fires at exactly the right lesson (not after).
        const vocabCountBefore = await getTotalVocabCount(currentUser.id);
        console.log('📊 Vocab before this lesson:', vocabCountBefore);
        console.log('📊 Vocab in this lesson:', vocabulary.length);

        // Calculate XP earned
        let xpEarned = XP_REWARDS.lesson_complete;
        
        if (perfectScore) {
            xpEarned += XP_REWARDS.perfect_score;
        }
        
        if (currentUser.lastLessonDate !== today) {
            xpEarned += XP_REWARDS.daily_bonus;
        }
        
        const { newStreak, streakBonus } = calculateStreak(currentUser.lastLessonDate, today, currentUser.streak);
        xpEarned += streakBonus;
        
        let completedLessons = [...currentUser.completedLessons];
        const isFirstCompletion = !completedLessons.includes(lessonId);
        
        if (isFirstCompletion) {
            completedLessons.push(lessonId);
        }
        
        const newXP = currentUser.xp + xpEarned;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > currentUser.level;

        // ── STEP 2: Check achievements, passing BOTH vocab numbers ──
        // totalVocabBefore  = already saved in DB (fetched above, before insert)
        // currentLessonVocab = words being added in this lesson right now
        const newAchievements = await checkAchievements({
            ...currentUser,
            total_lessons: currentUser.totalLessons + (isFirstCompletion ? 1 : 0),
            streak: newStreak
        }, {
            perfectScore,
            completionTime,
            totalVocabBefore: vocabCountBefore,      // words already saved
            currentLessonVocab: vocabulary.length     // words being saved NOW
        });
        
        const achievementXP = newAchievements.reduce((sum, ach) => sum + (ACHIEVEMENTS[ach]?.xp || 0), 0);
        const finalXP = newXP + achievementXP;
        const finalLevel = calculateLevel(finalXP);
        
        // ── STEP 3: Save lesson to DB (AFTER achievement check) ──
        if (vocabulary.length > 0) {
            const { data: existingLesson, error: checkError } = await supabase
                .from('lessons')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('lesson_title', lessonTitle)
                .maybeSingle();
            
            if (checkError) {
                console.warn('Check existing lesson warning:', checkError.message);
            }
            
            if (!existingLesson) {
                const { error: lessonError } = await supabase.from('lessons').insert([{
                    user_id: currentUser.id,
                    lesson_title: lessonTitle,
                    lesson_level: lessonLevel,
                    lesson_link: lessonLink,
                    vocabulary: vocabulary,
                    grammar: grammar,
                    completed_at: new Date().toISOString()
                }]);
                
                if (lessonError) {
                    console.error('Lesson insert error:', lessonError);
                } else {
                    console.log('✅ Vocabulary saved:', vocabulary.length, 'words');
                    if (grammar.length > 0) {
                        console.log('✅ Grammar exercises saved:', grammar.length);
                    }
                }
            } else {
                console.log('ℹ️ Lesson already saved, skipping');
            }
        }
        
        // Update profile
        const { error } = await supabase
            .from('profiles')
            .update({
                xp: finalXP,
                level: finalLevel,
                streak: newStreak,
                completed_lessons: completedLessons,
                total_lessons: currentUser.totalLessons + (isFirstCompletion ? 1 : 0),
                total_points: currentUser.totalPoints + xpEarned,
                achievements: [...new Set([...currentUser.achievements, ...newAchievements])],
                last_lesson_date: today,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (error) {
            console.error('Update error:', error);
            return { success: false, message: 'Failed to save progress' };
        }

        for (const achievementId of newAchievements) {
            await supabase.from('achievements_log').insert([{
                user_id: currentUser.id,
                achievement_id: achievementId,
                unlocked_at: new Date().toISOString()
            }]);
        }

        // Update local cache
        currentUser.xp = finalXP;
        currentUser.level = finalLevel;
        currentUser.streak = newStreak;
        currentUser.completedLessons = completedLessons;
        currentUser.totalLessons += (isFirstCompletion ? 1 : 0);
        currentUser.totalPoints += xpEarned;
        currentUser.achievements = [...new Set([...currentUser.achievements, ...newAchievements])];
        currentUser.lastLessonDate = today;

        console.log('✅ Lesson completed and saved');
        
        return {
            success: true,
            xpEarned: xpEarned + achievementXP,
            newLevel: finalLevel,
            leveledUp,
            newStreak,
            streakBonus,
            newAchievements,
            perfectBonus: perfectScore ? XP_REWARDS.perfect_score : 0,
            dailyBonus: currentUser.lastLessonDate !== today ? XP_REWARDS.daily_bonus : 0
        };
    } catch (err) {
        console.error('Complete lesson error:', err);
        return { success: false, message: 'An error occurred' };
    }
}

// =========================================
// GAMIFICATION CALCULATIONS
// =========================================

function calculateStreak(lastDate, today, currentStreak) {
    if (!lastDate) {
        return { newStreak: 1, streakBonus: 0 };
    }
    
    if (lastDate === today) {
        return { newStreak: currentStreak, streakBonus: 0 };
    }
    
    if (isYesterday(lastDate)) {
        const newStreak = currentStreak + 1;
        const streakBonus = Math.min(newStreak * XP_REWARDS.streak_bonus_per_day, 100);
        return { newStreak, streakBonus };
    }
    
    // Streak broken
    return { newStreak: 1, streakBonus: 0 };
}

function calculateLevel(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].minXP) {
            return LEVELS[i].level;
        }
    }
    return 1;
}

function getLevelInfo(level) {
    return LEVELS.find(l => l.level === level) || LEVELS[0];
}

function getProgressToNextLevel(xp) {
    const currentLevel = calculateLevel(xp);
    const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
    
    if (!nextLevel) {
        return { percent: 100, current: xp, needed: 0 };
    }
    
    const currentLevelInfo = LEVELS.find(l => l.level === currentLevel);
    const xpInCurrentLevel = xp - currentLevelInfo.minXP;
    const xpNeededForNextLevel = nextLevel.minXP - currentLevelInfo.minXP;
    const percent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));
    
    return {
        percent,
        current: xpInCurrentLevel,
        needed: xpNeededForNextLevel,
        remaining: nextLevel.minXP - xp
    };
}

async function checkAchievements(user, data = {}) {
    const newAchievements = [];
    
    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (user.achievements?.includes(id)) continue;
        if (achievement.check(user, data)) {
            newAchievements.push(id);
            console.log('🏆 Achievement unlocked:', achievement.name);
        }
    }
    
    return newAchievements;
}

// Returns the vocab count from ALREADY SAVED lessons only.
// Must be called BEFORE inserting the new lesson so we get the true "before" state.
async function getTotalVocabCount(userId) {
    const supabase = getSupabaseClient();
    if (!supabase) return 0;
    
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('vocabulary')
            .eq('user_id', userId);
        
        if (error) {
            console.error('Vocab count error:', error);
            return 0;
        }
        
        if (!data || data.length === 0) return 0;
        
        return data.reduce((total, lesson) => {
            return total + (Array.isArray(lesson.vocabulary) ? lesson.vocabulary.length : 0);
        }, 0);
    } catch (err) {
        console.error('getTotalVocabCount exception:', err);
        return 0;
    }
}

// =========================================
// HELPER FUNCTIONS
// =========================================

function isYesterday(dateStr) {
    if (!dateStr) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toDateString();
}

function getStreakEmoji(streak) {
    if (streak >= 30) return '💎';
    if (streak >= 14) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '⭐';
}

function getStreakMessage(streak) {
    if (streak >= 30) return 'Diamond Streak! Legendary!';
    if (streak >= 14) return 'Two weeks strong!';
    if (streak >= 7) return 'One week streak!';
    if (streak >= 3) return 'Building momentum!';
    if (streak >= 1) return 'Day one! Keep it up!';
    return 'Start your streak today!';
}

// =========================================
// PUBLIC API
// =========================================

async function logout() {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    window.location.href = '/';
}

function getCurrentUser() {
    return currentUser;
}

function isLoggedIn() {
    return currentUser !== null;
}

function getUserStats() {
    if (!currentUser) return null;

    const progress = getProgressToNextLevel(currentUser.xp);
    const levelInfo = getLevelInfo(currentUser.level);

    return {
        xp: currentUser.xp || 0,
        level: currentUser.level || 1,
        levelName: levelInfo.name,
        progressPercent: progress.percent,
        xpToNextLevel: progress.remaining,
        streak: currentUser.streak || 0,
        streakEmoji: getStreakEmoji(currentUser.streak),
        streakMessage: getStreakMessage(currentUser.streak),
        streakFreezes: currentUser.streakFreezes || 0,
        lessonsCompleted: currentUser.totalLessons || 0,
        totalPoints: currentUser.totalPoints || 0,
        achievementCount: currentUser.achievements?.length || 0,
        achievements: currentUser.achievements || [],
        lastLesson: currentUser.lastLessonDate
    };
}

async function refreshUserData() {
    const supabase = getSupabaseClient();
    if (!supabase || !currentUser) return null;

    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;
        currentUser = await getOrCreateUserProfile(user);
        return currentUser;
    } catch (err) {
        console.error('Refresh error:', err);
        return null;
    }
}

window.EFCD_Auth = {
    initAuth,
    logout,
    getCurrentUser,
    isLoggedIn,
    getUserStats,
    refreshUserData,
    completeLesson,
    getLevelInfo,
    getProgressToNextLevel,
    ACHIEVEMENTS,
    XP_REWARDS,
    LEVELS
};
