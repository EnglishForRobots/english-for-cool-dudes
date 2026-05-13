/* ═══════════════════════════════════════════════════════════════
   srs-engine.js  v1.0
   EFCD Spaced Repetition Engine

   Pure functions — no DOM, no Supabase calls.
   Import this anywhere: lessons, review game, my-lessons page.

   EXPORTS:
     SM2.calculate(item, quality)   → updated item fields
     SM2.isDue(item)                → boolean
     SM2.isLearned(item)            → boolean
     ITEMS.extract(lessonData)      → array of SRS items from registry
     ITEMS.keyFor(type, ...parts)   → stable item key string
     QUALITY.fromResult(type, data) → quality score 1-5
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  // ── SM-2 CONSTANTS ──────────────────────────────────────────
  const MIN_EASE        = 1.3;
  const DEFAULT_EASE    = 2.5;
  const LEARNED_REVIEWS = 5;     // reviews needed before item is 'learned'
  const LEARNED_MIN_Q   = 3;     // minimum quality on final review

  // ── SM-2 ALGORITHM ──────────────────────────────────────────
  const SM2 = {

    /**
     * Calculate new interval and ease after a review.
     * @param {object} item   — current SRS item row
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

        // SM-2 ease adjustment
        newEase = Math.max(
          MIN_EASE,
          ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        );
      }

      const newCount     = n + 1;
      const nextReview   = SM2._addDays(new Date(), newInterval);
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
      const today    = SM2._toDateString(new Date());
      const dueDate  = item.next_review_at;
      return dueDate <= today;
    },

    /**
     * How many days overdue is this item? Negative = not yet due.
     */
    daysOverdue(item) {
      const today   = new Date(); today.setHours(0,0,0,0);
      const due     = new Date(item.next_review_at); due.setHours(0,0,0,0);
      return Math.round((today - due) / 86400000);
    },

    /**
     * Has this item been fully learned?
     */
    isLearned(item) {
      return item.status === 'learned';
    },

    /**
     * Sort items for a review session: hardest (lowest ease) first.
     * Overdue items bumped to top.
     */
    sortForSession(items) {
      return [...items].sort((a, b) => {
        const aOverdue = SM2.daysOverdue(a);
        const bOverdue = SM2.daysOverdue(b);
        if (aOverdue > 0 && bOverdue <= 0) return -1;
        if (bOverdue > 0 && aOverdue <= 0) return  1;
        return (a.ease_factor ?? DEFAULT_EASE) - (b.ease_factor ?? DEFAULT_EASE);
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
     * Keys are derived from content — not DB IDs — so they're
     * stable across deployments and registry updates.
     */
    keyFor(type, ...parts) {
      return [type, ...parts].join(':').toLowerCase().replace(/\s+/g, '_');
    },

    /**
     * Extract all reviewable items from a lesson registry entry.
     * Returns array of { item_key, item_type, item_data } objects.
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
        // Use first 3 words of answer as key to keep stable
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
     * Given a saved SRS item row (with item_key + item_type),
     * find the actual content from the lesson registry.
     * Returns the item_data needed to render the review question.
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
  // Maps game outcomes to SM-2 quality scores (1-5)
  const QUALITY = {

    /**
     * Convert a review result into a quality score.
     * @param {string} itemType  — 'vocab'|'grammar'|'builder'|'sentence'|'tf'
     * @param {object} result    — { correct, hintsUsed, revealed, skipped, responseTimeMs }
     */
    fromResult(itemType, result) {
      const { correct, hintsUsed = 0, revealed = false, skipped = false } = result;

      if (skipped)  return 1;
      if (revealed) return 2;

      if (!correct) {
        return hintsUsed > 0 ? 2 : 1;
      }

      // Correct answer — quality depends on type and hints
      switch (itemType) {
        case 'vocab':
        case 'tf':
          // Binary correct/wrong — fast response = 5, slow = 4
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

    /**
     * Human-readable label for a quality score.
     */
    label(q) {
      return ['', 'Blackout', 'Wrong', 'Hard', 'Good', 'Easy'][q] || '?';
    },

    /**
     * Emoji for quality score (shown in post-session summary).
     */
    emoji(q) {
      return ['', '💀', '❌', '😅', '✅', '⭐'][q] || '?';
    },
  };

  // ── XP REWARDS TABLE ─────────────────────────────────────────
  const XP = {
    LESSON_COMPLETE:    50,
    LESSON_PERFECT:     20,   // bonus on top of LESSON_COMPLETE
    REVIEW_GAME_BASE:    5,
    REVIEW_GAME_MAX:    25,   // scales with accuracy
    SRS_SESSION_BASE:   10,
    SRS_ITEM_CORRECT:    2,   // per correct item in SRS session
    LESSON_LEARNED:     30,   // all items in a lesson reach 'learned'
    STREAK_DAILY:        5,
    STREAK_WEEK:        25,   // milestone bonus
    FIRST_IN_TRACK:     10,

    SRS_ACTIVATE_COST:  30,
    SRS_REACTIVATE_COST:10,

    /**
     * Calculate XP earned for a review game session.
     */
    forReviewGame(correctCount, totalCount) {
      if (totalCount === 0) return 0;
      const pct   = correctCount / totalCount;
      const range = XP.REVIEW_GAME_MAX - XP.REVIEW_GAME_BASE;
      return Math.round(XP.REVIEW_GAME_BASE + range * pct);
    },

    /**
     * Calculate XP earned for an SRS session.
     */
    forSrsSession(correctCount) {
      return XP.SRS_SESSION_BASE + correctCount * XP.SRS_ITEM_CORRECT;
    },
  };

  // ── STATS HELPERS ────────────────────────────────────────────
  const STATS = {

    /**
     * Summarise a user's full SRS queue into dashboard numbers.
     */
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

    /**
     * Group due items by lesson_id for the dashboard card list.
     */
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

    /**
     * What percentage of a lesson's items are learned?
     */
    lessonProgress(srsItems, lessonId) {
      const items   = srsItems.filter(i => i.lesson_id === lessonId);
      if (!items.length) return 0;
      const learned = items.filter(i => i.status === 'learned').length;
      return Math.round((learned / items.length) * 100);
    },
  };

  // ── PUBLIC API ────────────────────────────────────────────────
  window.EFCD_SRS = { SM2, ITEMS, QUALITY, XP, STATS };

  console.log('🧠 EFCD SRS Engine v1.0 loaded');

})();
