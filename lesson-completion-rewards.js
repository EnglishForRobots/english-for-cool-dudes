/* ═══════════════════════════════════════════════════════════════
   lesson-completion-rewards.js  v1.3-debug
   TEMPORARY DEBUG VERSION — replace submitToClass with this
   to find exactly where the score saving is failing.

   HOW TO USE:
   1. Replace your entire lesson-completion-rewards.js with this file
   2. Open browser DevTools → Console tab
   3. Join as a class, complete the tube lesson
   4. Look for the 🔍 EFCD DEBUG lines in the console
   5. Screenshot or copy what you see and share it
   6. That will tell us exactly where it's failing
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

  async function getSB () {
    if (window.efcdSupabaseClient) return window.efcdSupabaseClient;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (window.efcdSupabaseClient) return window.efcdSupabaseClient;
    }
    if (window.supabase) {
      window.efcdSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      return window.efcdSupabaseClient;
    }
    return null;
  }

  function hour ()      { return new Date().getHours(); }
  function dayOfWeek () { return new Date().getDay(); }

  const MOMENT_REWARDS = [
    { id:'dawn_patrol',       test: () => hour() >= 5 && hour() < 7,    emoji:'🌅', title:'Dawn Patrol!',          msg:'Before 7am and already doing English lessons. That is not normal. That is extraordinary.',                                                                   color:'#FF9600', shadow:'#D97800' },
    { id:'early_bird',        test: () => hour() >= 7 && hour() < 9,    emoji:'🐦', title:'Early Bird!',            msg:'Lesson done before 9am. You could have scrolled through your phone. You chose English instead.',                                                             color:'#FFC800', shadow:'#E5B400' },
    { id:'morning_hero',      test: () => hour() >= 9 && hour() < 12,   emoji:'☀️', title:'Morning Hero!',          msg:'Productive morning energy. Sharp mind, sharp English.',                                                                                                      color:'#1CB0F6', shadow:'#1899D6' },
    { id:'lunchtime_legend',  test: () => hour() >= 12 && hour() < 14,  emoji:'🥪', title:'Lunchtime Legend!',      msg:'You used your lunch break to learn English. Lunchtime Legend is not a title we hand out lightly.',                                                           color:'#FF9600', shadow:'#D97800' },
    { id:'afternoon_cool',    test: () => hour() >= 14 && hour() < 17,  emoji:'😎', title:'Afternoon Cool Dude!',   msg:'The afternoon slump is real. Scientists have confirmed it. You ignored it completely.',                                                                      color:'#58CC02', shadow:'#58A700' },
    { id:'golden_hour',       test: () => hour() >= 17 && hour() < 20,  emoji:'🌅', title:'Golden Hour!',           msg:'End of the working day and you still found the energy for a lesson.',                                                                                        color:'#CE82FF', shadow:'#A559D9' },
    { id:'night_owl',         test: () => hour() >= 20 && hour() < 23,  emoji:'🦉', title:'Night Owl!',             msg:'It is evening, most people have switched off, and here you are.',                                                                                            color:'#4B4B8F', shadow:'#2E2E6B' },
    { id:'midnight_scholar',  test: () => hour() >= 23 || hour() < 5,   emoji:'🌙', title:'Midnight Scholar!',      msg:'It is the middle of the night and you just finished an English lesson. Respect.',                                                                            color:'#1a2e5a', shadow:'#0d1a3a' },
    { id:'monday_crusher',    test: () => dayOfWeek() === 1,             emoji:'💪', title:'Monday Crusher!',        msg:'Monday. The hardest day. You did a lesson anyway.',                                                                                                          color:'#1CB0F6', shadow:'#1899D6' },
    { id:'friday_legend',     test: () => dayOfWeek() === 5,             emoji:'🎉', title:'Friday Legend!',         msg:'It is Friday and instead of winding down you did an English lesson.',                                                                                        color:'#CE82FF', shadow:'#A559D9' },
    { id:'weekend_warrior',   test: () => dayOfWeek() === 0 || dayOfWeek() === 6, emoji:'🎮', title:'Weekend Warrior!', msg:'The weekend. Most people are resting. You are learning.',                                                                                                color:'#2BDECC', shadow:'#1FBFAF' },
    { id:'perfectionist',     test: (d) => d.perfectScore === true,      emoji:'💯', title:'Perfectionist!',         msg:'Every. Single. Answer. Correct.',                                                                                                                           color:'#58CC02', shadow:'#58A700' },
    { id:'hot_streak',        test: (d) => d.bestCombo >= 10,            emoji:'🔥', title:'On Fire!',               msg:'10 correct in a row.',                                                                                                                                      color:'#FF4B4B', shadow:'#EA2B2B' },
    { id:'speed_learner',     test: (d) => d.completionTime && d.completionTime < 300, emoji:'⚡', title:'Speed Learner!', msg:'That was fast.',                                                                                                                                     color:'#FFC800', shadow:'#E5B400' },
    { id:'lesson_complete',   test: () => true,                          emoji:'🌟', title:'Lesson Complete!',       msg:'Another lesson done. Real progress.',                                                                                                                       color:'#58CC02', shadow:'#58A700' },
  ];

  function fireReward (lessonData) {
    const reward = MOMENT_REWARDS.find(r => r.test(lessonData));
    if (!reward) return;
    let msg = reward.msg;
    if (reward.id === 'hot_streak' && lessonData.bestCombo) {
      msg = `${lessonData.bestCombo} correct in a row. Your brain was in a different gear today.`;
    }
    setTimeout(() => {
      if (window.EFCD_FX && window.EFCD_FX.milestone) {
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

  /* ─── CLASS BRIDGE — FULL DEBUG VERSION ────────────────────── */
  async function submitToClass (lessonData) {
    console.log('🔍 EFCD DEBUG: submitToClass() called');
    console.log('🔍 EFCD DEBUG: lessonData =', JSON.stringify({
      lessonId:       lessonData.lessonId,
      correctAnswers: lessonData.correctAnswers,
      totalAnswers:   lessonData.totalAnswers,
      xp:             lessonData.xp,
      hasVocab:       !!(lessonData.vocabulary?.length),
      vocabCount:     lessonData.vocabulary?.length || 0,
    }));

    // STEP 1: Check localStorage
    const classId    = localStorage.getItem('efcd_class_id');
    const presentRaw = localStorage.getItem('efcd_present_names');
    const storedSessionId = localStorage.getItem('efcd_session_id');

    console.log('🔍 EFCD DEBUG: localStorage classId =', classId);
    console.log('🔍 EFCD DEBUG: localStorage sessionId =', storedSessionId);
    console.log('🔍 EFCD DEBUG: localStorage presentNames =', presentRaw);

    if (!classId) {
      console.log('🔍 EFCD DEBUG: ❌ STOPPED — no classId in localStorage. Not in class mode.');
      return null;
    }

    // STEP 2: Get Supabase client
    console.log('🔍 EFCD DEBUG: Getting Supabase client...');
    const client = await getSB();
    if (!client) {
      console.log('🔍 EFCD DEBUG: ❌ STOPPED — could not get Supabase client');
      return null;
    }
    console.log('🔍 EFCD DEBUG: ✅ Got Supabase client');

    try {
      // STEP 3: Get session ID
      let sessionId = storedSessionId;
      console.log('🔍 EFCD DEBUG: sessionId from localStorage =', sessionId);

      if (!sessionId) {
        console.log('🔍 EFCD DEBUG: No sessionId in localStorage, querying Supabase...');
        const { data: sessions, error: sessErr } = await client
          .from('efcd_sessions')
          .select('id')
          .eq('class_id', classId)
          .is('ended_at', null)
          .order('started_at', { ascending: false })
          .limit(1);
        console.log('🔍 EFCD DEBUG: sessions query result =', sessions, 'error =', sessErr);
        sessionId = sessions?.[0]?.id;
      }

      if (!sessionId) {
        console.log('🔍 EFCD DEBUG: ❌ STOPPED — could not find an open session for class', classId);
        return null;
      }
      console.log('🔍 EFCD DEBUG: ✅ Using sessionId =', sessionId);

      // STEP 4: Get class details
      console.log('🔍 EFCD DEBUG: Fetching class details...');
      const { data: classes, error: clsErr } = await client
        .from('efcd_classes')
        .select('id, name, team_name')
        .eq('id', classId)
        .limit(1);
      console.log('🔍 EFCD DEBUG: class query result =', classes, 'error =', clsErr);

      const cls = classes?.[0];
      if (!cls) {
        console.log('🔍 EFCD DEBUG: ❌ STOPPED — class not found in database for id:', classId);
        return null;
      }

      const displayName  = cls.team_name || cls.name;
      const presentNames = JSON.parse(presentRaw || '[]').filter(n => n !== 'the class');
      const xp           = lessonData.xp || 0;

      console.log('🔍 EFCD DEBUG: displayName =', displayName);
      console.log('🔍 EFCD DEBUG: presentNames =', presentNames);
      console.log('🔍 EFCD DEBUG: xp =', xp);

      // STEP 5: Insert score
      console.log('🔍 EFCD DEBUG: Inserting into efcd_scores...');
      const scorePayload = {
        student_id:   'class_' + classId,
        student_name: displayName,
        class_id:     classId,
        session_id:   sessionId,
        correct:      lessonData.correctAnswers || 0,
        answered:     lessonData.totalAnswers   || 0,
        xp:           xp,
        date:         new Date().toISOString().split('T')[0],
      };
      console.log('🔍 EFCD DEBUG: score payload =', scorePayload);

      const { data: scoreData, error: scoreErr } = await client
        .from('efcd_scores')
        .insert(scorePayload)
        .select();
      console.log('🔍 EFCD DEBUG: score insert result =', scoreData, 'error =', scoreErr);

      if (scoreErr) {
        console.log('🔍 EFCD DEBUG: ❌ SCORE INSERT FAILED:', scoreErr.message, scoreErr.code, scoreErr.details);
      } else {
        console.log('🔍 EFCD DEBUG: ✅ Score inserted successfully');
      }

      // STEP 6: Get students for badge insert
      console.log('🔍 EFCD DEBUG: Fetching students for badges...');
      const { data: students, error: stuErr } = await client
        .from('efcd_students')
        .select('id, name')
        .eq('class_id', classId);
      console.log('🔍 EFCD DEBUG: students =', students, 'error =', stuErr);

      const present = (students || []).filter(s => presentNames.includes(s.name));
      console.log('🔍 EFCD DEBUG: present students (matching presentNames) =', present);

      if (present.length === 0) {
        console.log('🔍 EFCD DEBUG: ⚠️ No present students found — badges will not be inserted');
        console.log('🔍 EFCD DEBUG: presentNames was:', presentNames);
        console.log('🔍 EFCD DEBUG: all student names in DB:', students?.map(s => s.name));
      }

      // STEP 7: Insert badges
      if (present.length > 0) {
        const badgePayload = present.map(s => ({
          student_id:   s.id,
          student_name: s.name,
          class_id:     classId,
          badge_key:    'lesson_' + (lessonData.lessonId || 'complete'),
          badge_emoji:  lessonData.badgeIcon || '🏅',
          badge_label:  lessonData.badgeName || 'Lesson Complete',
          is_manual:    false,
          session_id:   sessionId,
        }));
        console.log('🔍 EFCD DEBUG: Inserting badges for', present.length, 'students...');
        const { data: badgeData, error: badgeErr } = await client
          .from('efcd_badges')
          .insert(badgePayload)
          .select();
        console.log('🔍 EFCD DEBUG: badge insert result =', badgeData, 'error =', badgeErr);
        if (badgeErr) {
          console.log('🔍 EFCD DEBUG: ❌ BADGE INSERT FAILED:', badgeErr.message, badgeErr.code);
        } else {
          console.log('🔍 EFCD DEBUG: ✅ Badges inserted successfully');
        }
      }

      // STEP 8: Insert vocab
      if (lessonData.vocabulary?.length) {
        console.log('🔍 EFCD DEBUG: Inserting vocab (' + lessonData.vocabulary.length + ' words)...');
        const vocabPayload = {
          class_id:      classId,
          session_id:    sessionId,
          lesson_id:     lessonData.lessonId || 'unknown',
          lesson_title:  lessonData.lessonTitle || '',
          lesson_level:  lessonData.lessonLevel || '',
          vocab:         JSON.stringify(lessonData.vocabulary),
          grammar_focus: lessonData.grammarFocus || null,
          completed_at:  new Date().toISOString(),
        };
        console.log('🔍 EFCD DEBUG: vocab payload =', vocabPayload);
        const { data: vocabData, error: vocabErr } = await client
          .from('efcd_lesson_vocab')
          .insert(vocabPayload)
          .select();
        console.log('🔍 EFCD DEBUG: vocab insert result =', vocabData, 'error =', vocabErr);
        if (vocabErr) {
          console.log('🔍 EFCD DEBUG: ❌ VOCAB INSERT FAILED:', vocabErr.message, vocabErr.code);
        } else {
          console.log('🔍 EFCD DEBUG: ✅ Vocab inserted successfully');
        }
      } else {
        console.log('🔍 EFCD DEBUG: ⚠️ No vocabulary in lessonData — vocab not saved');
      }

      console.log('🔍 EFCD DEBUG: ✅ submitToClass() completed for', displayName);

      return {
        inClass:     true,
        displayName,
        presentNames,
        xp,
        correct:     lessonData.correctAnswers || 0,
        submitted:   true,
      };

    } catch (err) {
      console.log('🔍 EFCD DEBUG: ❌ EXCEPTION in submitToClass:', err.message, err);
      return null;
    }
  }

  /* ─── SESSION VALIDATOR ─────────────────────────────────── */
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

  /* ─── PUBLIC API ────────────────────────────────────────── */
  async function onLessonComplete (lessonData) {
    console.log('🔍 EFCD DEBUG: onLessonComplete() called');
    fireReward(lessonData);
    const classResult = await submitToClass(lessonData);
    console.log('🔍 EFCD DEBUG: classResult =', classResult);
    return classResult;
  }

  window.EFCD_Rewards = {
    onLessonComplete,
    fireReward,
    submitToClass,
    validateClassSession,
  };

  console.log('🔍 EFCD Rewards v1.3-debug loaded');

})();
