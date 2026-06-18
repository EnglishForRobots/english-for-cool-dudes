/* ═══════════════════════════════════════════════════════════════
   BOSS REGISTRY — Boss Battle mode
   Each boss pulls real questions from existing lessons in
   LESSON_DATA_REGISTRY via feedsFrom. No new content needed.

   HOW TO ADD A NEW BOSS:
   1. Copy a block below
   2. Pick a unique key (e.g. 'legal-leviathan')
   3. Set levelGate to match the track(s) it should be visible for
   4. List feedsFrom lesson ids that already exist in
      LESSON_DATA_REGISTRY — their vocab/grammar/true_false/sentences
      become the boss's question pool
   5. Done — boss.html picks it up automatically
═══════════════════════════════════════════════════════════════ */

const BOSS_REGISTRY = {

  'sandwich-slime': {
    id:               'smelly-sandwich',
    name:             'The Smelly Sandwich',
    emoji:            '🥪',
    tier:             'Beginner',
    levelGate:        ['beginner'],
    xpCost:           900,
    bossHP:           80,
    playerHP:         100,
    damagePerCorrect: 14,
    damagePerWrong:   12,
    timerSecs:        90,
    feedsFrom:        ['sandwich-beginner', 'royal-corgis-beginner', 'london-underground-beginner', 'worldcup2026-beginner'],
    winReward:        { xp: 300, badge: 'Slime Slayer' },
    modalTone:        'low',
  },

  'grammar-dragon': {
    id:               'grammar-dragon',
    name:             'The Grammar Dragon',
    emoji:            '🐉',
    tier:             'Intermediate',
    levelGate:        ['intermediate'],
    xpCost:           1800,
    bossHP:           120,
    playerHP:         100,
    damagePerCorrect: 11,
    damagePerWrong:   14,
    timerSecs:        120,
    feedsFrom:        ['ikea-effect-intermediate', 'crown-estate-intermediate', 'worldcup2026-intermediate', 'shepherds-pie-intermediate'],
    winReward:        { xp: 600, badge: 'Dragon Slayer' },
    modalTone:        'medium',
  },

  'tax-titan': {
    id:               'tax-titan',
    name:             'The Tax Titan',
    emoji:            '🗿',
    tier:             'Tax English',
    levelGate:        ['tax'],
    xpCost:           3500,
    bossHP:           150,
    playerHP:         100,
    damagePerCorrect: 9,
    damagePerWrong:   16,
    timerSecs:        150,
    feedsFrom:        ['merger-machine-tax', 'phantom-parent-tax', 'saudi-machine-deal-tax', 'e-invoice-era-tax'],
    winReward:        { xp: 1200, badge: 'Titan Slayer' },
    modalTone:        'high',
  },

};

window.BOSS_REGISTRY = BOSS_REGISTRY;
if (typeof module !== 'undefined') module.exports = BOSS_REGISTRY;
