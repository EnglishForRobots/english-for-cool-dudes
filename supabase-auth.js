// =========================================
// SUPABASE AUTH INTEGRATION
// Works with your existing Supabase login/signup
// Adds streak tracking and lesson progress
// =========================================

// Supabase Client (will be initialized by login.html/signup.html)
const supabase = window.efcdSupabaseClient;

// Current user session
let currentUser = null;

// Initialize authentication and get user profile
async function initAuth() {
    if (!supabase) {
        console.warn('⚠️ Supabase not initialized');
        return null;
    }

    try {
        // Get current session
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Auth error:', error);
            return null;
        }

        if (user) {
            // Get or create user profile with streak data
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

// Get or create user profile in Supabase
async function getOrCreateUserProfile(user) {
    try {
        // Try to fetch existing profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Profile fetch error:', error);
            // Return basic user data if profile table doesn't exist yet
            return {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                streak: 0,
                completedLessons: [],
                lastLessonDate: null,
                totalPoints: 0
            };
        }

        if (profile) {
            // Return existing profile
            return {
                id: profile.id,
                email: user.email,
                name: profile.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
                streak: profile.streak || 0,
                completedLessons: profile.completed_lessons || [],
                lastLessonDate: profile.last_lesson_date,
                totalPoints: profile.total_points || 0
            };
        }

        // Create new profile if it doesn't exist
        const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            streak: 0,
            completed_lessons: [],
            last_lesson_date: null,
            total_points: 0,
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
            streak: 0,
            completedLessons: [],
            lastLessonDate: null,
            totalPoints: 0
        };
    } catch (err) {
        console.error('Get/create profile error:', err);
        return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            streak: 0,
            completedLessons: [],
            lastLessonDate: null,
            totalPoints: 0
        };
    }
}

// Logout
async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    window.location.href = '/';
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Complete a lesson (handles streak logic and saves to Supabase)
async function completeLesson(lessonId) {
    if (!currentUser || !supabase) {
        console.warn('⚠️ No user logged in - lesson not saved');
        return false;
    }

    try {
        const today = new Date().toDateString();
        let streak = currentUser.streak || 0;
        let completedLessons = currentUser.completedLessons || [];

        // Check if lesson already completed
        if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
        }

        // Update streak logic
        const lastDate = currentUser.lastLessonDate;
        if (lastDate !== today) {
            if (isYesterday(lastDate)) {
                streak++; // Continue streak
            } else if (lastDate) {
                streak = 1; // Reset streak
            } else {
                streak = 1; // First lesson ever
            }
        }

        const totalPoints = (currentUser.totalPoints || 0) + 10;

        // Update in Supabase
        const { error } = await supabase
            .from('profiles')
            .update({
                streak: streak,
                completed_lessons: completedLessons,
                last_lesson_date: today,
                total_points: totalPoints,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (error) {
            console.error('Update error:', error);
            return false;
        }

        // Update local cache
        currentUser.streak = streak;
        currentUser.completedLessons = completedLessons;
        currentUser.lastLessonDate = today;
        currentUser.totalPoints = totalPoints;

        console.log('✅ Lesson completed and saved to Supabase');
        return true;
    } catch (err) {
        console.error('Complete lesson error:', err);
        return false;
    }
}

// Helper: Check if date is yesterday
function isYesterday(dateStr) {
    if (!dateStr) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toDateString();
}

// Get user stats for ticker
function getUserStats() {
    if (!currentUser) return null;

    return {
        streak: currentUser.streak || 0,
        lessonsCompleted: (currentUser.completedLessons || []).length,
        totalPoints: currentUser.totalPoints || 0,
        lastLesson: currentUser.lastLessonDate
    };
}

// Refresh user data from Supabase
async function refreshUserData() {
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
