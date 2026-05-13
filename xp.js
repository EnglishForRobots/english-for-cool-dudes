/* ═══════════════════════════════════════════════════════════════
   xp.js  v1.0
   EFCD XP Client

   Handles all XP operations against Supabase.
   Requires: supabase client at window.efcdSupabaseClient
             srs-engine.js loaded (for XP constants)

   EXPORTS (window.EFCD_XP):
     getBalance()                  → { balance, lifetime }
     earn(amount, reason, lessonId)→ new balance
     spend(amount, reason, lessonId)→ new balance | throws
     canAfford(amount)             → boolean
     getTransactions(limit)        → array
     onLessonComplete(lessonData)  → earn XP + trigger SRS activation prompt
     onReviewComplete(correct, total) → earn XP
     onSrsSessionComplete(correctCount) → earn XP
     checkAndAwardStreak()         → award daily streak XP if applicable
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  const SUPABASE_URL  = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
  const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

  // ── SUPABASE CLIENT ─────────────────────────────────────────
  async function getSB() {
    let attempts = 0;
    while (!window.efcdSupabaseClient && attempts < 40) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }
    if (!window.efcdSupabaseClient) {
      // Fallback: create our own
      if (window.supabase) {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      }
      throw new Error('Supabase not available');
    }
    return window.efcdSupabaseClient;
  }

  async function getCurrentUser() {
    const sb = await getSB();
    const { data: { user } } = await sb.auth.getUser();
    return user;
  }

  // ── GET BALANCE ──────────────────────────────────────────────
  async function getBalance() {
    try {
      const user = await getCurrentUser();
      if (!user) return { balance: 0, lifetime: 0 };
      const sb = await getSB();
      const { data } = await sb
        .from('efcd_xp')
        .select('balance, lifetime')
        .eq('user_id', user.id)
        .single();
      return data || { balance: 0, lifetime: 0 };
    } catch(e) {
      return { balance: 0, lifetime: 0 };
    }
  }

  // ── EARN XP ──────────────────────────────────────────────────
  async function earn(amount, reason, lessonId = null) {
    if (!amount || amount <= 0) return null;
    try {
      const user = await getCurrentUser();
      if (!user) return null;
      const sb = await getSB();
      const { data, error } = await sb.rpc('efcd_earn_xp', {
        p_user_id:   user.id,
        p_amount:    amount,
        p_reason:    reason,
        p_lesson_id: lessonId,
        p_meta:      null,
      });
      if (error) throw error;
      _notifyBalanceChange(data, amount, reason);
      return data; // new balance
    } catch(e) {
      console.warn('EFCD XP earn error:', e.message);
      return null;
    }
  }

  // ── SPEND XP ─────────────────────────────────────────────────
  async function spend(amount, reason, lessonId = null) {
    if (!amount || amount <= 0) throw new Error('Invalid amount');
    const user = await getCurrentUser();
    if (!user) throw new Error('Not logged in');
    const sb = await getSB();
    const { data, error } = await sb.rpc('efcd_spend_xp', {
      p_user_id:   user.id,
      p_amount:    amount,
      p_reason:    reason,
      p_lesson_id: lessonId,
      p_meta:      null,
    });
    if (error) throw new Error(error.message);
    _notifyBalanceChange(data, -amount, reason);
    return data; // new balance
  }

  // ── CAN AFFORD ───────────────────────────────────────────────
  async function canAfford(amount) {
    const { balance } = await getBalance();
    return balance >= amount;
  }

  // ── TRANSACTION HISTORY ──────────────────────────────────────
  async function getTransactions(limit = 20) {
    try {
      const user = await getCurrentUser();
      if (!user) return [];
      const sb = await getSB();
      const { data } = await sb
        .from('efcd_xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    } catch(e) {
      return [];
    }
  }

  // ── LESSON COMPLETE ──────────────────────────────────────────
  async function onLessonComplete(lessonData) {
    const XP_TABLE = window.EFCD_SRS?.XP;
    if (!XP_TABLE) {
      console.warn('EFCD XP: srs-engine.js not loaded');
      return;
    }

    let totalEarned = 0;

    // Base XP for completing the lesson
    const base = await earn(XP_TABLE.LESSON_COMPLETE, 'lesson_complete', lessonData.lessonId);
    if (base !== null) totalEarned += XP_TABLE.LESSON_COMPLETE;

    // Bonus for perfect score
    const pct = lessonData.totalAnswers > 0
      ? lessonData.correctAnswers / lessonData.totalAnswers
      : 0;
    if (pct === 1 && lessonData.totalAnswers >= 5) {
      await earn(XP_TABLE.LESSON_PERFECT, 'lesson_perfect', lessonData.lessonId);
      totalEarned += XP_TABLE.LESSON_PERFECT;
    }

    // Check streak
    const streakBonus = await checkAndAwardStreak();
    if (streakBonus) totalEarned += streakBonus;

    return totalEarned;
  }

  // ── REVIEW GAME COMPLETE ──────────────────────────────────────
  async function onReviewComplete(correct, total) {
    const XP_TABLE = window.EFCD_SRS?.XP;
    if (!XP_TABLE) return;
    const amount = XP_TABLE.forReviewGame(correct, total);
    if (amount > 0) await earn(amount, 'review_game');
    return amount;
  }

  // ── SRS SESSION COMPLETE ──────────────────────────────────────
  async function onSrsSessionComplete(correctCount) {
    const XP_TABLE = window.EFCD_SRS?.XP;
    if (!XP_TABLE) return;
    const amount = XP_TABLE.forSrsSession(correctCount);
    if (amount > 0) await earn(amount, 'srs_session');
    return amount;
  }

  // ── LESSON LEARNED (all items) ───────────────────────────────
  async function onLessonLearned(lessonId) {
    const XP_TABLE = window.EFCD_SRS?.XP;
    if (!XP_TABLE) return;
    await earn(XP_TABLE.LESSON_LEARNED, 'lesson_learned', lessonId);
  }

  // ── STREAK ───────────────────────────────────────────────────
  async function checkAndAwardStreak() {
    try {
      const user = await getCurrentUser();
      if (!user) return 0;
      const sb   = await getSB();
      const today = new Date().toISOString().split('T')[0];

      const { data: streak } = await sb
        .from('efcd_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const lastActivity = streak?.last_activity_at;
      const yesterday    = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Already recorded today
      if (lastActivity === today) return 0;

      let newStreak = 1;
      if (lastActivity === yesterdayStr) {
        newStreak = (streak?.current_streak || 0) + 1;
      }

      const newLongest = Math.max(streak?.longest_streak || 0, newStreak);

      // Upsert streak record
      await sb.from('efcd_streaks').upsert({
        user_id:          user.id,
        current_streak:   newStreak,
        longest_streak:   newLongest,
        last_activity_at: today,
        updated_at:       new Date().toISOString(),
      });

      // Award daily streak XP
      const XP_TABLE = window.EFCD_SRS?.XP;
      if (!XP_TABLE) return 0;

      await earn(XP_TABLE.STREAK_DAILY, 'streak_daily');
      let bonus = XP_TABLE.STREAK_DAILY;

      // Milestone bonuses
      if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
        await earn(XP_TABLE.STREAK_WEEK, 'streak_milestone');
        bonus += XP_TABLE.STREAK_WEEK;
      }

      return bonus;
    } catch(e) {
      console.warn('EFCD streak check error:', e.message);
      return 0;
    }
  }

  // ── ACTIVATE SRS FOR A LESSON ────────────────────────────────
  async function activateSRS(lessonId) {
    const XP_TABLE = window.EFCD_SRS?.XP;
    const ITEMS    = window.EFCD_SRS?.ITEMS;
    if (!XP_TABLE || !ITEMS) throw new Error('srs-engine.js not loaded');

    const cost = XP_TABLE.SRS_ACTIVATE_COST;

    // Check balance first
    const affordable = await canAfford(cost);
    if (!affordable) throw new Error(`Need ${cost} XP to activate SRS`);

    // Get lesson data from registry
    const lessonData = window.LESSON_DATA_REGISTRY?.[lessonId];
    if (!lessonData) throw new Error(`Lesson ${lessonId} not in registry`);

    // Extract all items
    const items = ITEMS.extract(lessonData);
    if (!items.length) throw new Error('No reviewable items found in lesson');

    const user = await getCurrentUser();
    if (!user) throw new Error('Not logged in');

    const sb       = await getSB();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Insert all SRS items (ignore conflicts — already activated)
    const rows = items.map(item => ({
      user_id:        user.id,
      lesson_id:      lessonId,
      item_key:       item.item_key,
      item_type:      item.item_type,
      interval_days:  1,
      ease_factor:    2.5,
      review_count:   0,
      next_review_at: tomorrowStr,
      status:         'active',
      activated_at:   new Date().toISOString(),
    }));

    const { error: insertError } = await sb
      .from('efcd_srs_items')
      .upsert(rows, { onConflict: 'user_id,lesson_id,item_key', ignoreDuplicates: true });

    if (insertError) throw new Error(insertError.message);

    // Spend XP
    const newBalance = await spend(cost, 'srs_activate', lessonId);

    return {
      itemsActivated: items.length,
      newBalance,
      firstReviewDate: tomorrowStr,
    };
  }

  // ── GET DUE ITEMS ────────────────────────────────────────────
  async function getDueItems(lessonId = null) {
    try {
      const user = await getCurrentUser();
      if (!user) return [];
      const sb    = await getSB();
      const today = new Date().toISOString().split('T')[0];

      let query = sb
        .from('efcd_srs_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lte('next_review_at', today)
        .order('ease_factor', { ascending: true }); // hardest first

      if (lessonId) query = query.eq('lesson_id', lessonId);

      const { data } = await query;
      return data || [];
    } catch(e) {
      return [];
    }
  }

  // ── GET ALL SRS ITEMS ────────────────────────────────────────
  async function getAllSRSItems(lessonId = null) {
    try {
      const user = await getCurrentUser();
      if (!user) return [];
      const sb = await getSB();

      let query = sb
        .from('efcd_srs_items')
        .select('*')
        .eq('user_id', user.id);

      if (lessonId) query = query.eq('lesson_id', lessonId);

      const { data } = await query;
      return data || [];
    } catch(e) {
      return [];
    }
  }

  // ── RECORD ITEM REVIEW ───────────────────────────────────────
  async function recordItemReview(itemKey, lessonId, quality, responseTimeMs = null) {
    try {
      const user    = await getCurrentUser();
      if (!user) return null;
      const sb      = await getSB();
      const SM2     = window.EFCD_SRS?.SM2;
      if (!SM2) throw new Error('srs-engine.js not loaded');

      // Get current item state
      const { data: item } = await sb
        .from('efcd_srs_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('item_key', itemKey)
        .single();

      if (!item) return null;

      // Calculate new SM-2 values
      const updates = SM2.calculate(item, quality);

      // Update item
      const { data: updated } = await sb
        .from('efcd_srs_items')
        .update(updates)
        .eq('id', item.id)
        .select()
        .single();

      // Log to history
      await sb.from('efcd_srs_history').insert({
        user_id:         user.id,
        lesson_id:       lessonId,
        item_key:        itemKey,
        quality,
        old_interval:    item.interval_days,
        new_interval:    updates.interval_days,
        old_ease:        item.ease_factor,
        new_ease:        updates.ease_factor,
        response_time_ms: responseTimeMs,
      });

      // Check if this lesson is now fully learned
      if (updates.status === 'learned') {
        await _checkLessonLearned(user.id, lessonId, sb);
      }

      return updated;
    } catch(e) {
      console.warn('EFCD recordItemReview error:', e.message);
      return null;
    }
  }

  // ── PRIVATE: CHECK IF WHOLE LESSON IS LEARNED ───────────────
  async function _checkLessonLearned(userId, lessonId, sb) {
    const { data: items } = await sb
      .from('efcd_srs_items')
      .select('status')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId);

    if (!items?.length) return;
    const allLearned = items.every(i => i.status === 'learned');
    if (allLearned) {
      await onLessonLearned(lessonId);
    }
  }

  // ── PRIVATE: NOTIFY BALANCE CHANGE (for UI updates) ─────────
  const _listeners = [];
  function _notifyBalanceChange(newBalance, delta, reason) {
    _listeners.forEach(fn => {
      try { fn({ newBalance, delta, reason }); } catch(e) {}
    });
  }

  function onBalanceChange(fn) {
    _listeners.push(fn);
  }

  // ── PUBLIC API ────────────────────────────────────────────────
  window.EFCD_XP = {
    getBalance,
    earn,
    spend,
    canAfford,
    getTransactions,
    onLessonComplete,
    onReviewComplete,
    onSrsSessionComplete,
    onLessonLearned,
    checkAndAwardStreak,
    activateSRS,
    getDueItems,
    getAllSRSItems,
    recordItemReview,
    onBalanceChange,
  };

  console.log('💰 EFCD XP v1.0 loaded');

})();
