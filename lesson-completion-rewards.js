/* ═══════════════════════════════════════════════════════════════
   lesson-completion-rewards.js  v2.0
   EFCD — drop this into every lesson page

   What's new in v2.0:
   - Central LESSON_VOCAB_REGISTRY — vocab for every lesson in one place
   - Automatic vocab save on class completion — no lesson files need changing
   - Vocab insert into efcd_lesson_vocab table
   - Clean production version — debug logging removed
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

  /* ═══════════════════════════════════════════════════════════════
     LESSON VOCAB REGISTRY
     ───────────────────────────────────────────────────────────────
     This is the ONLY place you need to update when adding a lesson.
     Key = window.LESSON_ID as set at the top of each lesson file.
     Vocab saves automatically for every class session — no changes
     needed to individual lesson HTML files ever.
  ═══════════════════════════════════════════════════════════════ */
  const LESSON_VOCAB_REGISTRY = {

    // ── BEGINNER ──────────────────────────────────────────────

    'london-underground-beginner': {
      title:   'The London Underground',
      level:   'Beginner',
      grammar: 'Superlatives (the oldest), prepositions of time (in/on/at)',
      vocab: [
        { word:'platform',     definition:'The area at a station where you wait for the train' },
        { word:'journey',      definition:'A trip from one place to another by transport' },
        { word:'carriage',     definition:'One section of a train' },
        { word:'delay',        definition:'When something is late' },
        { word:'crowded',      definition:'Full of people — the opposite of empty' },
        { word:'underground',  definition:'Below the ground — tunnels beneath the city' },
        { word:'Oyster card',  definition:'The blue card used to pay for the Tube and buses' },
        { word:'Mind the gap', definition:'Be careful of the space between the train and the platform' },
      ],
    },

    'sandwich-beginner': {
      title:   'The Earl of Sandwich',
      level:   'Beginner',
      grammar: 'Past simple — regular and irregular verbs',
      vocab: [
        { word:'invention',  definition:'Something new that someone creates for the first time' },
        { word:'nobleman',   definition:'A person from a high social class in history' },
        { word:'gambling',   definition:'Playing games for money' },
        { word:'slice',      definition:'A flat piece cut from something larger' },
        { word:'filling',    definition:'The food that goes inside a sandwich' },
        { word:'popular',    definition:'Liked by many people' },
      ],
    },

    'coffee-beginner': {
      title:   'The Legend of Coffee',
      level:   'Beginner',
      grammar: 'Past simple — regular and irregular verbs',
      vocab: [
        { word:'legend',     definition:'An old story that may or may not be true' },
        { word:'goat',       definition:'A farm animal with horns' },
        { word:'energetic',  definition:'Full of energy, very active' },
        { word:'monastery',  definition:'A building where monks live and work' },
        { word:'berries',    definition:'Small round fruits that grow on bushes' },
        { word:'trade',      definition:'Buying and selling goods between countries' },
      ],
    },

    'chineserobotsbeginner': {
      title:   'Robots on Chinese TV',
      level:   'Beginner',
      grammar: 'Passive voice (was made, were shown, is used)',
      vocab: [
        { word:'robot',        definition:'A machine that can move and do tasks automatically' },
        { word:'performance',  definition:'An event where people show a skill to an audience' },
        { word:'artificial',   definition:'Made by humans, not natural' },
        { word:'demonstrate',  definition:'To show how something works' },
        { word:'advanced',     definition:'At a high level — more developed than others' },
        { word:'technology',   definition:'Scientific knowledge used to make useful things' },
      ],
    },

    'pancakedaybeginner': {
      title:   'Pancake Day',
      level:   'Beginner',
      grammar: 'Can and can\'t for ability',
      vocab: [
        { word:'Shrove Tuesday', definition:'The day before Lent begins — Pancake Day in Britain' },
        { word:'batter',         definition:'The liquid mixture used to make pancakes' },
        { word:'toss',           definition:'To throw something up in the air and catch it' },
        { word:'tradition',      definition:'A custom passed down through generations' },
        { word:'topping',        definition:'Something you put on top of food' },
        { word:'lemon',          definition:'A yellow citrus fruit with sour juice' },
      ],
    },

    'fuggereibeginner': {
      title:   'The Fuggerei',
      level:   'Beginner',
      grammar: 'Must and have to, passive voice',
      vocab: [
        { word:'social housing', definition:'Cheap or free homes provided for people who need them' },
        { word:'rent',           definition:'Money paid regularly to live in a building' },
        { word:'condition',      definition:'A rule you must follow to get something' },
        { word:'merchant',       definition:'A person who buys and sells goods for profit' },
        { word:'charity',        definition:'Giving help or money to people who need it' },
        { word:'prayer',         definition:'Words spoken to God — a religious practice' },
      ],
    },

    'carnivalbeginner': {
      title:   'Carnival and Satire',
      level:   'Beginner',
      grammar: 'Can/must/passive — permission and obligation',
      vocab: [
        { word:'satire',     definition:'Using humour to criticise powerful people' },
        { word:'float',      definition:'A decorated vehicle in a parade' },
        { word:'politician', definition:'A person who works in government' },
        { word:'costume',    definition:'Special clothes worn for a celebration or performance' },
        { word:'parade',     definition:'A public celebration where people march through the streets' },
        { word:'criticise',  definition:'To say what is wrong or bad about something' },
      ],
    },

    'flyingtaxisbeginner': {
      title:   'Flying Cars',
      level:   'Beginner',
      grammar: 'Future forms — will and going to',
      vocab: [
        { word:'air taxi',   definition:'A small aircraft that carries passengers like a taxi' },
        { word:'prototype',  definition:'The first version of something new being tested' },
        { word:'emission',   definition:'Gas or pollution released into the air' },
        { word:'urban',      definition:'Related to cities and towns' },
        { word:'passenger',  definition:'A person travelling in a vehicle' },
        { word:'regulate',   definition:'To control something with rules and laws' },
      ],
    },

    'whyeaster': {
      title:   'Why Easter?',
      level:   'Beginner',
      grammar: 'Present simple for facts and habits',
      vocab: [
        { word:'resurrection',  definition:'Coming back to life after death — in Christian belief' },
        { word:'symbol',        definition:'An object that represents something else' },
        { word:'celebrate',     definition:'To do something special for a happy occasion' },
        { word:'chocolate egg', definition:'An egg-shaped chocolate treat given at Easter' },
        { word:'spring',        definition:'The season after winter when plants start to grow' },
        { word:'religious',     definition:'Connected to belief in God or a religion' },
      ],
    },

    'fiveamazinglives': {
      title:   'Five Amazing Lives',
      level:   'Beginner',
      grammar: 'Present perfect vs past simple',
      vocab: [
        { word:'lifestyle',   definition:'The way a person lives their life' },
        { word:'adventurous', definition:'Willing to try new and exciting things' },
        { word:'inspire',     definition:'To make someone want to do something great' },
        { word:'challenge',   definition:'Something difficult that requires effort' },
        { word:'achieve',     definition:'To succeed in doing something difficult' },
        { word:'volunteer',   definition:'To do work without being paid, to help others' },
      ],
    },

    'pandas': {
      title:   'Pandas',
      level:   'Beginner',
      grammar: 'Comparatives and superlatives',
      vocab: [
        { word:'endangered',   definition:'At risk of dying out completely — very few left' },
        { word:'habitat',      definition:'The natural environment where an animal lives' },
        { word:'bamboo',       definition:'A tall plant that giant pandas eat' },
        { word:'conservation', definition:'Protecting animals and nature from harm' },
        { word:'breed',        definition:'To produce babies — especially in a protected programme' },
        { word:'extinct',      definition:'No longer existing — all of a species have died' },
      ],
    },

    'artemis': {
      title:   'Artemis 2: Mission Complete',
      level:   'Beginner',
      grammar: 'Past simple and past continuous',
      vocab: [
        { word:'spacecraft', definition:'A vehicle designed to travel in space' },
        { word:'orbit',      definition:'To travel in a curved path around a planet or moon' },
        { word:'astronaut',  definition:'A person trained to travel in space' },
        { word:'mission',    definition:'An important task or journey with a specific goal' },
        { word:'launch',     definition:'To send a rocket or spacecraft into space' },
        { word:'gravity',    definition:'The force that pulls objects towards the Earth' },
      ],
    },

    // ── INTERMEDIATE ──────────────────────────────────────────

    'bookshop-intermediate': {
      title:   'Running a Bookshop',
      level:   'Intermediate',
      grammar: 'Present perfect continuous, passive voice',
      vocab: [
        { word:'curate',      definition:'To carefully select and organise a collection' },
        { word:'proceeds',    definition:'Money made from a sale or event' },
        { word:'browsing',    definition:'Looking through things casually without a specific goal' },
        { word:'independent', definition:'Not part of a large chain — owned by one person' },
        { word:'stock',       definition:'The goods a shop has available to sell' },
        { word:'loyal',       definition:'Faithful and consistently supportive' },
      ],
    },

    // ── BUSINESS ──────────────────────────────────────────────

    'cadbury-business': {
      title:   'The Cadbury Story',
      level:   'Business',
      grammar: 'Reported speech, passive voice in business context',
      vocab: [
        { word:'acquisition', definition:'When one company buys another company' },
        { word:'brand',       definition:'The name, design and reputation of a product or company' },
        { word:'revenue',     definition:'The total money a company earns from its sales' },
        { word:'workforce',   definition:'All the people employed by a company' },
        { word:'merger',      definition:'When two companies join to become one' },
        { word:'shareholder', definition:'A person who owns part of a company' },
      ],
    },

    // ── TAX ───────────────────────────────────────────────────

    'restructuring-tax': {
      title:   'The Restructuring',
      level:   'Tax',
      grammar: 'Conditional sentences in professional context',
      vocab: [
        { word:'restructuring',   definition:'Reorganising a company to make it more efficient' },
        { word:'withholding tax', definition:'Tax deducted at source before payment reaches you' },
        { word:'liability',       definition:'A legal responsibility to pay money owed' },
        { word:'deductible',      definition:'An expense that can be subtracted from taxable income' },
        { word:'subsidiary',      definition:'A company owned or controlled by a larger company' },
        { word:'compliance',      definition:'Following the rules and laws that apply to you' },
      ],
    },

  };

  /* ─── SUPABASE CLIENT ───────────────────────────────────────── */
  async function getSB () {
  // Always create own client with explicit key — never rely on shared client
  // which may be missing the API key in class (non-auth) mode
  if (window.supabase) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  // Wait for supabase library to load
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 100));
    if (window.supabase) {
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }
  return null;
}

  /* ─── TIME HELPERS ──────────────────────────────────────────── */
  function hour ()      { return new Date().getHours(); }
  function dayOfWeek () { return new Date().getDay(); }

  /* ─── MOMENT REWARDS ────────────────────────────────────────── */
  const MOMENT_REWARDS = [
    { id:'dawn_patrol',      test: () => hour() >= 5 && hour() < 7,              emoji:'🌅', title:'Dawn Patrol!',        msg:'Before 7am and already doing English lessons. That is extraordinary.',                                      color:'#FF9600', shadow:'#D97800' },
    { id:'early_bird',       test: () => hour() >= 7 && hour() < 9,              emoji:'🐦', title:'Early Bird!',          msg:'Lesson done before 9am. You chose English over scrolling. That is the difference.',                        color:'#FFC800', shadow:'#E5B400' },
    { id:'morning_hero',     test: () => hour() >= 9 && hour() < 12,             emoji:'☀️', title:'Morning Hero!',        msg:'Productive morning energy. Sharp mind, sharp English.',                                                     color:'#1CB0F6', shadow:'#1899D6' },
    { id:'lunchtime_legend', test: () => hour() >= 12 && hour() < 14,            emoji:'🥪', title:'Lunchtime Legend!',    msg:'You used your lunch break to learn English. Lunchtime Legend is not a title we hand out lightly.',           color:'#FF9600', shadow:'#D97800' },
    { id:'afternoon_cool',   test: () => hour() >= 14 && hour() < 17,            emoji:'😎', title:'Afternoon Cool Dude!', msg:'The afternoon slump is real. Scientists confirmed it. You ignored it completely.',                          color:'#58CC02', shadow:'#58A700' },
    { id:'golden_hour',      test: () => hour() >= 17 && hour() < 20,            emoji:'🌅', title:'Golden Hour!',         msg:'End of the working day and you still found energy for a lesson.',                                           color:'#CE82FF', shadow:'#A559D9' },
    { id:'night_owl',        test: () => hour() >= 20 && hour() < 23,            emoji:'🦉', title:'Night Owl!',           msg:'It is evening, most people have switched off, and here you are.',                                           color:'#4B4B8F', shadow:'#2E2E6B' },
    { id:'midnight_scholar', test: () => hour() >= 23 || hour() < 5,             emoji:'🌙', title:'Midnight Scholar!',    msg:'It is the middle of the night and you just finished an English lesson. Respect.',                           color:'#1a2e5a', shadow:'#0d1a3a' },
    { id:'monday_crusher',   test: () => dayOfWeek() === 1,                       emoji:'💪', title:'Monday Crusher!',      msg:'Monday. The hardest day. You did a lesson anyway.',                                                          color:'#1CB0F6', shadow:'#1899D6' },
    { id:'friday_legend',    test: () => dayOfWeek() === 5,                       emoji:'🎉', title:'Friday Legend!',       msg:'It is Friday and instead of winding down you did an English lesson.',                                        color:'#CE82FF', shadow:'#A559D9' },
    { id:'weekend_warrior',  test: () => dayOfWeek() === 0 || dayOfWeek() === 6, emoji:'🎮', title:'Weekend Warrior!',     msg:'The weekend. Most people are resting. You are learning.',                                                   color:'#2BDECC', shadow:'#1FBFAF' },
    { id:'perfectionist',    test: (d) => d.perfectScore === true,                emoji:'💯', title:'Perfectionist!',       msg:'Every. Single. Answer. Correct. That is not luck — that is knowing your stuff.',                           color:'#58CC02', shadow:'#58A700' },
    { id:'hot_streak',       test: (d) => d.bestCombo >= 10,                      emoji:'🔥', title:'On Fire!',             msg:'10 correct in a row. Your brain was in a different gear today.',                                            color:'#FF4B4B', shadow:'#EA2B2B' },
    { id:'speed_learner',    test: (d) => d.completionTime && d.completionTime < 300, emoji:'⚡', title:'Speed Learner!',   msg:'That was fast. Either you knew everything or you are just built different.',                               color:'#FFC800', shadow:'#E5B400' },
    { id:'lesson_complete',  test: () => true,                                    emoji:'🌟', title:'Lesson Complete!',     msg:'Another lesson done. Every lesson is a tiny version of you becoming a better version of you.',              color:'#58CC02', shadow:'#58A700' },
  ];

  function fireReward (lessonData) {
    const reward = MOMENT_REWARDS.find(r => r.test(lessonData));
    if (!reward) return;
    let msg = reward.msg;
    if (reward.id === 'hot_streak' && lessonData.bestCombo) {
      msg = `${lessonData.bestCombo} correct in a row. Your brain was in a different gear today.`;
    }
    setTimeout(() => {
      if (window.EFCD_FX?.milestone) {
        window.EFCD_FX.milestone(reward.emoji, reward.title, msg, reward.color, reward.shadow);
        window.EFCD_FX.confetti();
      } else {
        _fallbackOverlay(reward, msg);
      }
    }, 800);
  }

  function _fallbackOverlay (reward, msg) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Nunito,system-ui,sans-serif;';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:24px;padding:36px 28px;max-width:380px;width:100%;text-align:center;border:3px solid ${reward.color};border-bottom:8px solid ${reward.shadow};">
        <div style="font-size:72px;line-height:1;margin-bottom:12px">${reward.emoji}</div>
        <div style="font-size:26px;font-weight:900;color:${reward.shadow};margin-bottom:10px">${reward.title}</div>
        <div style="font-size:14px;font-weight:700;color:#4B4B4B;line-height:1.6;margin-bottom:24px">${msg}</div>
        <button style="width:100%;padding:14px;background:${reward.color};color:#fff;border:none;border-radius:16px;font-size:16px;font-weight:900;cursor:pointer;font-family:inherit;" onclick="this.closest('div[style]').parentElement.remove()">Keep going! 🚀</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    setTimeout(() => overlay.remove(), 5000);
  }

  /* ─── CLASS BRIDGE ──────────────────────────────────────────── */
  async function submitToClass (lessonData) {
    const classId    = localStorage.getItem('efcd_class_id');
    const presentRaw = localStorage.getItem('efcd_present_names');
    if (!classId) return null;

    const client = await getSB();
    if (!client) return null;

    try {
      // Get session ID
      let sessionId = localStorage.getItem('efcd_session_id');
      if (!sessionId) {
        const { data: sessions } = await client
          .from('efcd_sessions')
          .select('id')
          .eq('class_id', classId)
          .is('ended_at', null)
          .order('started_at', { ascending: false })
          .limit(1);
        sessionId = sessions?.[0]?.id;
      }
      if (!sessionId) return null;

      // Get class details
      const { data: classes } = await client
        .from('efcd_classes')
        .select('id, name, team_name')
        .eq('id', classId)
        .limit(1);
      const cls = classes?.[0];
      if (!cls) return null;

      const displayName  = cls.team_name || cls.name;
      const presentNames = JSON.parse(presentRaw || '[]').filter(n => n !== 'the class');
      const xp           = lessonData.xp || 0;

      // Insert score
      await client.from('efcd_scores').insert({
        student_id:   'class_' + classId,
        student_name: displayName,
        class_id:     classId,
        session_id:   sessionId,
        correct:      lessonData.correctAnswers || 0,
        answered:     lessonData.totalAnswers   || 0,
        xp:           xp,
        date:         new Date().toISOString().split('T')[0],
      });

      // Award lesson badge to all present students
      if (presentNames.length > 0) {
        const { data: students } = await client
          .from('efcd_students')
          .select('id, name')
          .eq('class_id', classId);
        const present = (students || []).filter(s => presentNames.includes(s.name));
        if (present.length > 0) {
          await client.from('efcd_badges').insert(
            present.map(s => ({
              student_id:   s.id,
              student_name: s.name,
              class_id:     classId,
              badge_key:    'lesson_' + (lessonData.lessonId || 'complete'),
              badge_emoji:  lessonData.badgeIcon || '🏅',
              badge_label:  lessonData.badgeName || 'Lesson Complete',
              is_manual:    false,
              session_id:   sessionId,
            }))
          );
        }
      }

      // ── VOCAB SAVE ────────────────────────────────────────────
      // Priority 1: vocab passed directly from the lesson file
      // Priority 2: central registry lookup by lesson ID
      const lessonId      = lessonData.lessonId || '';
      const registryEntry = LESSON_VOCAB_REGISTRY[lessonId] || null;
      const vocabToSave   = lessonData.vocabulary?.length
        ? lessonData.vocabulary
        : registryEntry?.vocab || [];

      if (vocabToSave.length > 0) {
        await client.from('efcd_lesson_vocab').insert({
          class_id:      classId,
          session_id:    sessionId,
          lesson_id:     lessonId,
          lesson_title:  lessonData.lessonTitle  || registryEntry?.title   || '',
          lesson_level:  lessonData.lessonLevel  || registryEntry?.level   || '',
          vocab:         JSON.stringify(vocabToSave),
          grammar_focus: lessonData.grammarFocus || registryEntry?.grammar || null,
          completed_at:  new Date().toISOString(),
        });
      }
      // ─────────────────────────────────────────────────────────

      console.log('✅ EFCD v2.0: submitted for', displayName,
        '— correct:', lessonData.correctAnswers,
        '— XP:', xp,
        '— vocab words:', vocabToSave.length);

      return {
        inClass:     true,
        displayName,
        presentNames,
        xp,
        correct:     lessonData.correctAnswers || 0,
        submitted:   true,
      };

    } catch (err) {
      console.warn('EFCD Class Bridge error:', err.message);
      return null;
    }
  }

  /* ─── SESSION VALIDATOR ─────────────────────────────────────── */
  async function validateClassSession (pillElementId) {
    const classId = localStorage.getItem('efcd_class_id');
    if (!classId) return { wasActive: false, cleared: false };
    try {
      const client = await getSB();
      if (!client) return { wasActive: false, cleared: false };
      const { data } = await client
        .from('efcd_classes')
        .select('is_active')
        .eq('id', classId)
        .single();
      if (!data || !data.is_active) {
        localStorage.removeItem('efcd_class_id');
        localStorage.removeItem('efcd_session_id');
        localStorage.removeItem('efcd_present_names');
        if (pillElementId) {
          const pill = document.getElementById(pillElementId);
          if (pill) pill.classList.remove('show');
        }
        return { wasActive: false, cleared: true };
      }
      return { wasActive: true, cleared: false };
    } catch (e) {
      return { wasActive: false, cleared: false };
    }
  }

  /* ─── PUBLIC API ─────────────────────────────────────────────── */
  async function onLessonComplete (lessonData) {
    fireReward(lessonData);
    const classResult = await submitToClass(lessonData);
    return classResult;
  }

  window.EFCD_Rewards = {
    onLessonComplete,
    fireReward,
    submitToClass,
    validateClassSession,
    LESSON_VOCAB_REGISTRY,
  };

  console.log('🎉 EFCD Rewards v2.0 loaded — central vocab registry active');

})();
