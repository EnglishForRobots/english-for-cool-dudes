/* ═══════════════════════════════════════════════════════════════
   srs-engine.js  v1.1
   EFCD Spaced Repetition Engine

   Pure functions — no DOM, no Supabase calls.
   Import this anywhere: lessons, review game, my-lessons page.

   EXPORTS:
     SM2.calculate(item, quality)            → updated item fields
     SM2.isDue(item)                         → boolean
     SM2.isLearned(item)                     → boolean
     SM2.sortForSession(items, max?)         → capped + sorted array
     SM2.forgiveLargeBacklog(items, thresh?) → spreads huge backlogs
     ITEMS.extract(lessonData)               → array of SRS items
     ITEMS.keyFor(type, ...parts)            → stable item key string
     QUALITY.fromResult(type, data)          → quality score 1-5

   v1.1 changes
   ────────────
   • sortForSession now accepts maxItems (default 25) — no more
     266-item doom walls. The queue is always manageable.
   • forgiveLargeBacklog() — when overdue count exceeds a threshold,
     quietly reschedules lower-priority items to tomorrow so the
     user never sees the full debt. Call in boot() before building
     the session, then batch-save the returned items to Supabase.
   • MAX_INTERVAL cap (30 days) — prevents items disappearing for
     months, which is the root cause of sudden backlog explosions.
   • daysOverdue label helper — returns neutral "Ready to review"
     copy instead of guilt-inducing "X days overdue" text.
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  // ── SM-2 CONSTANTS ──────────────────────────────────────────
  const MIN_EASE        = 1.3;
  const DEFAULT_EASE    = 2.5;
  const LEARNED_REVIEWS = 5;     // reviews needed before item is 'learned'
  const LEARNED_MIN_Q   = 3;     // minimum quality on final review
  const MAX_INTERVAL    = 30;    // v1.1: cap interval to avoid months-long gaps
  const SESSION_MAX     = 25;    // v1.1: default max items per session
  const BACKLOG_THRESH  = 40;    // v1.1: forgiveness kicks in above this many overdue

  // ── SM-2 ALGORITHM ──────────────────────────────────────────
  const SM2 = {

    /**
     * Calculate new interval and ease after a review.
     * @param {object} item    — current SRS item row
     * @param {number} quality — 1 (blackout) to 5 (perfect)
     * @returns {object} fields to update in efcd_srs_items
     */
    calculate(item, quality) {
      const q  = Math.max(1, Math.min(5, quality));
      const ef = item.ease_factor ?? DEFAULT_EASE;
      const n  = item.review_count ?? 0;
      const oldInterval = item.interval_days ?? 1;

      let newInterval;
      let newEase;

      if (q < 3) {
        // Failed — reset interval, decrease ease
        newInterval = 1;
        newEase = Math.max(MIN_EASE, ef - 0.2);
      } else {
        // Passed — extend interval
        if (n === 0)      newInterval = 1;
        else if (n === 1) newInterval = 3;
        else              newInterval = Math.round(oldInterval * ef);

        // v1.1: cap so items never vanish for months
        newInterval = Math.min(newInterval, MAX_INTERVAL);

        // SM-2 ease adjustment
        newEase = Math.max(
          MIN_EASE,
          ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        );
      }

      const newCount      = n + 1;
      const nextReview    = SM2._addDays(new Date(), newInterval);
      const willBeLearned = newCount >= LEARNED_REVIEWS && q >= LEARNED_MIN_Q;

      return {
        interval_days:    newInterval,
        ease_factor:      Math.round(newEase * 1000) / 1000,
        review_count:     newCount,
        next_review_at:   SM2._toDateString(nextReview),
        last_reviewed_at: new Date().toISOString(),
        status:           willBeLearned ? 'learned' : 'active',
        learned_at:       willBeLearned ? new Date().toISOString() : null,
      };
    },

    /**
     * Is this item due for review today or overdue?
     */
    isDue(item) {
      if (item.status !== 'active') return false;
      const today   = SM2._toDateString(new Date());
      const dueDate = item.next_review_at;
      return dueDate <= today;
    },

    /**
     * How many days overdue is this item? Negative = not yet due.
     */
    daysOverdue(item) {
      const today = new Date(); today.setHours(0,0,0,0);
      const due   = new Date(item.next_review_at); due.setHours(0,0,0,0);
      return Math.round((today - due) / 86400000);
    },

    /**
     * v1.1: Neutral, friendly label for overdue state — no guilt.
     * Use this instead of "X days overdue" in UI copy.
     * @param {object} item
     * @returns {string}
     */
    overdueLabel(item) {
      const d = SM2.daysOverdue(item);
      if (d <= 0) return 'Spaced repetition';
      if (d === 1) return '📬 Ready to review';
      return '📬 Ready to review';   // always calm, never shaming
    },

    /**
     * Has this item been fully learned?
     */
    isLearned(item) {
      return item.status === 'learned';
    },

    /**
     * v1.1: Sort items for a session AND cap the queue.
     *
     * Only the `maxItems` most important items are returned —
     * the rest stay pending and will surface in future sessions.
     * Most-overdue + lowest-ease items are prioritised.
     *
     * @param {Array}  items    — due SRS items
     * @param {number} maxItems — session cap (default SESSION_MAX = 25)
     * @returns {Array} sorted, capped array
     */
    sortForSession(items, maxItems = SESSION_MAX) {
      const sorted = [...items].sort((a, b) => {
        const aOverdue = SM2.daysOverdue(a);
        const bOverdue = SM2.daysOverdue(b);
        if (aOverdue > 0 && bOverdue <= 0) return -1;
        if (bOverdue > 0 && aOverdue <= 0) return  1;
        // Both overdue: most overdue first
        if (aOverdue !== bOverdue) return bOverdue - aOverdue;
        // Same overdue status: hardest (lowest ease) first
        return (a.ease_factor ?? DEFAULT_EASE) - (b.ease_factor ?? DEFAULT_EASE);
      });
      return sorted.slice(0, maxItems);
    },

    /**
     * v1.1: Forgive a large backlog before building a session.
     *
     * When the overdue count exceeds `threshold`, this quietly
     * reschedules lower-priority overdue items across the next
     * few days so the user never faces the full debt at once.
     *
     * ⚠️  IMPORTANT — caller must persist the returned items:
     *   const forgiven = SM2.forgiveLargeBacklog(allDueItems);
     *   const changed  = forgiven.filter(i => i._rescheduled);
     *   if (changed.length) await batchUpdateSrsItems(changed);
     *   // then pass forgiven to sortForSession() as normal
     *
     * Items that were rescheduled carry a `_rescheduled: true`
     * flag so the caller knows which rows need saving.
     *
     * @param {Array}  items     — all due SRS items
     * @param {number} threshold — overdue count that triggers forgiveness
     * @returns {Array} items with low-priority ones rescheduled
     */
    forgiveLargeBacklog(items, threshold = BACKLOG_THRESH) {
      const overdue = items.filter(i => SM2.daysOverdue(i) > 0);
      if (overdue.length <= threshold) return items;   // nothing to do

      // Sort overdue: most overdue + lowest ease = highest priority (keep these)
      const prioritised = [...overdue].sort((a, b) => {
        const dDiff = SM2.daysOverdue(b) - SM2.daysOverdue(a);
        if (dDiff !== 0) return dDiff;
        return (a.ease_factor ?? DEFAULT_EASE) - (b.ease_factor ?? DEFAULT_EASE);
      });

      // Keep top SESSION_MAX items for today; spread the rest across tomorrow+
      const keepSet = new Set(prioritised.slice(0, SESSION_MAX).map(i => i.item_key));
      const leftover = prioritised.slice(SESSION_MAX);

      // Spread leftover evenly across the next 1–5 days
      return items.map(item => {
        if (!SM2.isDue(item) || keepSet.has(item.item_key)) return item;

        const leftoverIdx = leftover.findIndex(l => l.item_key === item.item_key);
        if (leftoverIdx === -1) return item;

        // Stagger: 1 day for first batch, 2 for next, etc. (max 5 days out)
        const daysOut = Math.min(5, 1 + Math.floor(leftoverIdx / SESSION_MAX));
        const newDate = SM2._toDateString(SM2._addDays(new Date(), daysOut));

        return {
          ...item,
          next_review_at: newDate,
          _rescheduled:   true,   // flag for caller to persist
        };
      });
    },

    // ── Private helpers ──
    _addDays(date, days) {
      const d = new Date(date);
      d.setDate(d.getDate() + Math.ceil(days));
      return d;
    },

    _toDateString(date) {
      return date.toISOString().split('T')[0];
    },
  };

  // ── ITEM KEY GENERATION ──────────────────────────────────────
  const ITEMS = {

    /**
     * Generate a stable, unique key for an SRS item.
     */
    keyFor(type, ...parts) {
      return [type, ...parts].join(':').toLowerCase().replace(/\s+/g, '_');
    },

    /**
     * Extract all reviewable items from a lesson registry entry.
     */
    extract(lessonData) {
      const items = [];
      const ld    = lessonData;
      if (!ld) return items;

      // ── VOCAB ──────────────────────────────────────────────
      (ld.vocab || []).forEach(v => {
        items.push({
          item_key:  ITEMS.keyFor('vocab', v.word),
          item_type: 'vocab',
          item_data: v,
        });
      });

      // ── GRAMMAR (all grammar blocks) ───────────────────────
      ['grammar', 'grammar2', 'grammar3'].forEach(block => {
        const g = ld[block];
        if (!g?.exercises?.length) return;
        const topicSlug = (g.topic || block).toLowerCase().replace(/\s+/g, '_');
        g.exercises.forEach((ex, i) => {
          items.push({
            item_key:  ITEMS.keyFor(block, topicSlug, i),
            item_type: 'grammar',
            item_data: { ...ex, topic: g.topic, rule: g.rule, block },
          });
        });
      });

      // ── WORD BUILDER ───────────────────────────────────────
      (ld.word_builder || []).forEach(w => {
        items.push({
          item_key:  ITEMS.keyFor('builder', w.word),
          item_type: 'builder',
          item_data: w,
        });
      });

      // ── SENTENCE BUILDER ───────────────────────────────────
      (ld.sentences || []).forEach((s, i) => {
        const anchor = (s.answer || '').split(' ').slice(0, 3).join('_').toLowerCase();
        items.push({
          item_key:  ITEMS.keyFor('sentence', i, anchor),
          item_type: 'sentence',
          item_data: s,
        });
      });

      // ── TRUE / FALSE ───────────────────────────────────────
      (ld.true_false || []).forEach((tf, i) => {
        const anchor = (tf.statement || '').split(' ').slice(0, 4).join('_').toLowerCase();
        items.push({
          item_key:  ITEMS.keyFor('tf', i, anchor),
          item_type: 'tf',
          item_data: tf,
        });
      });

      return items;
    },

    /**
     * Given a saved SRS item row, find the content from the lesson registry.
     */
    resolve(srsItem, lessonData) {
      const allItems = ITEMS.extract(lessonData);
      return allItems.find(i => i.item_key === srsItem.item_key) || null;
    },

    /**
     * Count items by type for a lesson.
     */
    countByType(lessonData) {
      const items = ITEMS.extract(lessonData);
      return items.reduce((acc, i) => {
        acc[i.item_type] = (acc[i.item_type] || 0) + 1;
        return acc;
      }, {});
    },
  };

  // ── QUALITY SCORING ──────────────────────────────────────────
  const QUALITY = {

    /**
     * Convert a review result into a quality score.
     */
    fromResult(itemType, result) {
      const { correct, hintsUsed = 0, revealed = false, skipped = false } = result;

      if (skipped)  return 1;
      if (revealed) return 2;

      if (!correct) {
        return hintsUsed > 0 ? 2 : 1;
      }

      switch (itemType) {
        case 'vocab':
        case 'tf':
          return result.responseTimeMs < 4000 ? 5 : 4;

        case 'grammar':
          if (hintsUsed === 0) return 5;
          if (hintsUsed === 1) return 4;
          return 3;

        case 'builder':
        case 'sentence':
          if (hintsUsed === 0) return 5;
          if (hintsUsed === 1) return 4;
          if (hintsUsed === 2) return 3;
          return 3;

        default:
          return correct ? 4 : 2;
      }
    },

    label(q) {
      return ['', 'Blackout', 'Wrong', 'Hard', 'Good', 'Easy'][q] || '?';
    },

    emoji(q) {
      return ['', '💀', '❌', '😅', '✅', '⭐'][q] || '?';
    },
  };

  // ── XP REWARDS TABLE ─────────────────────────────────────────
  const XP = {
    LESSON_COMPLETE:    50,
    LESSON_PERFECT:     20,
    REVIEW_GAME_BASE:    5,
    REVIEW_GAME_MAX:    25,
    SRS_SESSION_BASE:   10,
    SRS_ITEM_CORRECT:    2,
    LESSON_LEARNED:     30,
    STREAK_DAILY:        5,
    STREAK_WEEK:        25,
    FIRST_IN_TRACK:     10,

    SRS_ACTIVATE_COST:  30,
    SRS_REACTIVATE_COST:10,

    forReviewGame(correctCount, totalCount) {
      if (totalCount === 0) return 0;
      const pct   = correctCount / totalCount;
      const range = XP.REVIEW_GAME_MAX - XP.REVIEW_GAME_BASE;
      return Math.round(XP.REVIEW_GAME_BASE + range * pct);
    },

    forSrsSession(correctCount) {
      return XP.SRS_SESSION_BASE + correctCount * XP.SRS_ITEM_CORRECT;
    },
  };

  // ── STATS HELPERS ────────────────────────────────────────────
  const STATS = {

    summarise(srsItems) {
      const today = new Date().toISOString().split('T')[0];
      return srsItems.reduce((acc, item) => {
        if (item.status === 'learned') {
          acc.learned++;
        } else if (item.status === 'active') {
          acc.active++;
          if (item.next_review_at <= today) {
            acc.due++;
            if (item.next_review_at < today) acc.overdue++;
          }
        }
        return acc;
      }, { due: 0, overdue: 0, active: 0, learned: 0 });
    },

    byLesson(srsItems) {
      const today = new Date().toISOString().split('T')[0];
      const map   = {};
      srsItems.forEach(item => {
        if (item.status !== 'active' || item.next_review_at > today) return;
        if (!map[item.lesson_id]) map[item.lesson_id] = 0;
        map[item.lesson_id]++;
      });
      return map;
    },

    lessonProgress(srsItems, lessonId) {
      const items   = srsItems.filter(i => i.lesson_id === lessonId);
      if (!items.length) return 0;
      const learned = items.filter(i => i.status === 'learned').length;
      return Math.round((learned / items.length) * 100);
    },
  };

  // ── PUBLIC API ────────────────────────────────────────────────
  window.EFCD_SRS = { SM2, ITEMS, QUALITY, XP, STATS };

  console.log('🧠 EFCD SRS Engine v1.1 loaded');

})();
