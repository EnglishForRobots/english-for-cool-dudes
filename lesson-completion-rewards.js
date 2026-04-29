/* ═══════════════════════════════════════════════════════════════
   lesson-completion-rewards.js  v1.0
   EFCD — drop this into every lesson page

   TWO systems in one file:

   1. MOMENT REWARDS — contextual celebration at lesson completion
      No accounts. No database. Pure immediate joy.
      Call: EFCD_Rewards.onLessonComplete(lessonData)

   2. CLASS BRIDGE — submits score to Supabase if a class session
      is currently active (student joined via /live/ or homepage).
      Call: EFCD_Rewards.onLessonComplete(lessonData) — same call,
      bridge runs automatically if a session is detected.

   lessonData shape:
   {
     lessonId:    'wigtown-bookshop-intermediate',  // unique slug
     lessonTitle: 'The Town That Was Saved by Books',
     lessonLevel: 'Intermediate',                   // Beginner / Intermediate / Advanced / Business / Tax / Legal / Kids
     badgeIcon:   '📚',
     badgeName:   'Honorary Bookseller',
     correctAnswers: 18,   // total correct in this lesson
     totalAnswers:   22,   // total answered
     bestCombo:       5,   // longest streak
     perfectScore:  false, // true if 100%
     completionTime: 480,  // seconds (optional)
   }
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  /* ─── SUPABASE ────────────────────────────────────────────────
     The bridge reads the URL + key from the same global the rest
     of the site uses. If it's not there we skip silently.         */
  function getSB () {
    return window.efcdSupabaseClient || null;
  }

  /* ─── TIME HELPERS ───────────────────────────────────────────── */
  function hour () { return new Date().getHours(); }
  function dayOfWeek () { return new Date().getDay(); } // 0=Sun … 6=Sat

  /* ─── MOMENT-REWARD CATALOGUE ────────────────────────────────
     Each entry:
       test()      → boolean — fires if true
       emoji       → big icon shown in EFCD_FX.milestone card
       title       → bold headline (short, punchy)
       msg         → warm personal message
       color       → card border colour
       shadow      → darker shade for border-bottom
     Priority: first match wins — order matters.                   */
  const MOMENT_REWARDS = [

    // ── TIME-BASED ────────────────────────────────────────────
    {
      id: 'dawn_patrol',
      test: () => hour() >= 5 && hour() < 7,
      emoji: '🌅',
      title: 'Dawn Patrol!',
      msg: 'Before 7am and already doing English lessons. That is not normal. That is extraordinary. The rest of the world is still asleep and you are already better than you were yesterday.',
      color: '#FF9600', shadow: '#D97800',
    },
    {
      id: 'early_bird',
      test: () => hour() >= 7 && hour() < 9,
      emoji: '🐦',
      title: 'Early Bird!',
      msg: 'Lesson done before 9am. You could have scrolled through your phone for twenty minutes. You chose English instead. That is the difference between people who improve and people who don\'t.',
      color: '#FFC800', shadow: '#E5B400',
    },
    {
      id: 'morning_hero',
      test: () => hour() >= 9 && hour() < 12,
      emoji: '☀️',
      title: 'Morning Hero!',
      msg: 'Productive morning energy. You got this lesson done before the afternoon slump even had a chance. Sharp mind, sharp English.',
      color: '#1CB0F6', shadow: '#1899D6',
    },
    {
      id: 'lunchtime_legend',
      test: () => hour() >= 12 && hour() < 14,
      emoji: '🥪',
      title: 'Lunchtime Legend!',
      msg: 'You used your lunch break to learn English. Not your sofa. Not your phone. English. Lunchtime Legend is not a title we hand out lightly. Today it is yours.',
      color: '#FF9600', shadow: '#D97800',
    },
    {
      id: 'afternoon_cool_dude',
      test: () => hour() >= 14 && hour() < 17,
      emoji: '😎',
      title: 'Afternoon Cool Dude!',
      msg: 'The afternoon slump is real. Scientists have confirmed it. You ignored it completely. That is not just impressive — that is Cool Dude energy.',
      color: '#58CC02', shadow: '#58A700',
    },
    {
      id: 'golden_hour',
      test: () => hour() >= 17 && hour() < 20,
      emoji: '🌅',
      title: 'Golden Hour!',
      msg: 'End of the working day and you still found the energy for a lesson. That is the kind of commitment that compounds over time. Well done.',
      color: '#CE82FF', shadow: '#A559D9',
    },
    {
      id: 'night_owl',
      test: () => hour() >= 20 && hour() < 23,
      emoji: '🦉',
      title: 'Night Owl!',
      msg: 'It is evening, most people have switched off, and here you are — doing an English lesson. Absolutely unhinged. We love it.',
      color: '#4B4B8F', shadow: '#2E2E6B',
    },
    {
      id: 'midnight_scholar',
      test: () => hour() >= 23 || hour() < 5,
      emoji: '🌙',
      title: 'Midnight Scholar!',
      msg: 'It is the middle of the night and you just finished an English lesson. We are not going to question it. We are just going to say: respect.',
      color: '#1a2e5a', shadow: '#0d1a3a',
    },

    // ── DAY-BASED ─────────────────────────────────────────────
    {
      id: 'monday_crusher',
      test: () => dayOfWeek() === 1,
      emoji: '💪',
      title: 'Monday Crusher!',
      msg: 'Monday. The hardest day. You did a lesson anyway. The whole week is now yours.',
      color: '#1CB0F6', shadow: '#1899D6',
    },
    {
      id: 'friday_legend',
      test: () => dayOfWeek() === 5,
      emoji: '🎉',
      title: 'Friday Legend!',
      msg: 'It is Friday and instead of winding down you did an English lesson. That is royalty behaviour. Have an excellent weekend — you earned it.',
      color: '#CE82FF', shadow: '#A559D9',
    },
    {
      id: 'weekend_warrior',
      test: () => dayOfWeek() === 0 || dayOfWeek() === 6,
      emoji: '🎮',
      title: 'Weekend Warrior!',
      msg: 'The weekend. Most people are resting. You are learning. That gap between you and everyone else just got a little wider.',
      color: '#2BDECC', shadow: '#1FBFAF',
    },

    // ── PERFORMANCE-BASED ─────────────────────────────────────
    {
      id: 'perfectionist',
      test: (d) => d.perfectScore === true,
      emoji: '💯',
      title: 'Perfectionist!',
      msg: 'Every. Single. Answer. Correct. That is not luck — that is knowing your stuff. Genuinely impressive.',
      color: '#58CC02', shadow: '#58A700',
    },
    {
      id: 'hot_streak',
      test: (d) => d.bestCombo >= 10,
      emoji: '🔥',
      title: 'On Fire!',
      msg: `${10} correct in a row at some point in that lesson. Your brain was in a different gear today. Keep that up.`,
      // Note: msg will be personalised dynamically in fireReward()
      color: '#FF4B4B', shadow: '#EA2B2B',
    },
    {
      id: 'speed_learner',
      test: (d) => d.completionTime && d.completionTime < 300,
      emoji: '⚡',
      title: 'Speed Learner!',
      msg: 'That was fast. Like, genuinely fast. Either you knew everything already or you are just built different. Probably both.',
      color: '#FFC800', shadow: '#E5B400',
    },

    // ── FALLBACK — always fires if nothing else matched ────────
    {
      id: 'lesson_complete',
      test: () => true,
      emoji: '🌟',
      title: 'Lesson Complete!',
      msg: 'Another lesson done. That is not nothing — that is real progress. Every lesson is a tiny version of you becoming a better version of you.',
      color: '#58CC02', shadow: '#58A700',
    },
  ];

  /* ─── FIRE THE MOMENT REWARD ──────────────────────────────── */
  function fireReward (lessonData) {
    // Find first matching reward
    const reward = MOMENT_REWARDS.find(r => r.test(lessonData));
    if (!reward) return;

    // Personalise the hot streak message
    let msg = reward.msg;
    if (reward.id === 'hot_streak' && lessonData.bestCombo) {
      msg = `${lessonData.bestCombo} correct in a row at some point in that lesson. Your brain was in a different gear today. Keep that up.`;
    }

    // Delay slightly so lesson completion animation runs first
    setTimeout(() => {
      if (window.EFCD_FX && window.EFCD_FX.milestone) {
        window.EFCD_FX.milestone(reward.emoji, reward.title, msg, reward.color, reward.shadow);
        window.EFCD_FX.confetti();
      } else {
        // Fallback if EFCD_FX isn't loaded — plain overlay
        _fallbackOverlay(reward, msg);
      }
    }, 800);
  }

  /* ─── FALLBACK OVERLAY ────────────────────────────────────── */
  // Used on pages that don't have interactions.js loaded
  function _fallbackOverlay (reward, msg) {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,.75)',
      'z-index:9999', 'display:flex', 'align-items:center',
      'justify-content:center', 'padding:20px', 'font-family:Nunito,system-ui,sans-serif',
    ].join(';');

    overlay.innerHTML = `
      <div style="
        background:#fff; border-radius:24px; padding:36px 28px;
        max-width:380px; width:100%; text-align:center;
        border:3px solid ${reward.color}; border-bottom:8px solid ${reward.shadow};
        box-shadow:0 12px 48px rgba(0,0,0,.25);
        animation:_rcPop .4s cubic-bezier(.175,.885,.32,1.275) both;
      ">
        <div style="font-size:72px;line-height:1;margin-bottom:12px">${reward.emoji}</div>
        <div style="font-size:26px;font-weight:900;letter-spacing:-1px;color:${reward.shadow};margin-bottom:10px">${reward.title}</div>
        <div style="font-size:14px;font-weight:700;color:#4B4B4B;line-height:1.6;margin-bottom:24px">${msg}</div>
        <button style="
          width:100%;padding:14px;background:${reward.color};color:#fff;
          border:none;border-radius:16px;font-size:16px;font-weight:900;
          cursor:pointer;font-family:inherit;
        " onclick="this.closest('div[style]').parentElement.remove()">
          Keep going! 🚀
        </button>
      </div>
      <style>
        @keyframes _rcPop {
          0%{opacity:0;transform:scale(.4) rotate(-8deg)}
          60%{transform:scale(1.1) rotate(2deg)}
          100%{opacity:1;transform:scale(1) rotate(0)}
        }
      </style>`;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    setTimeout(() => overlay.remove(), 5000);
  }

  /* ─── CLASS BRIDGE ────────────────────────────────────────── */
  // Reads class session from localStorage (set by homepage/live join flow)
  // and submits a lesson-level score to Supabase efcd_scores.

  async function submitToClass (lessonData) {
    const classId  = localStorage.getItem('efcd_class_id');
    const presentRaw = localStorage.getItem('efcd_present_names');

    if (!classId) return; // no active class session — skip silently

    const sb = getSB();
    // If we don't have a global supabase client, build one from meta tags
    // (lessons embed their own supabase URL/key)
    const client = sb || _buildSBClient();
    if (!client) return;

    try {
      // Find the current open session
      const { data: sessions } = await client
        .from('efcd_sessions')
        .select('id')
        .eq('class_id', classId)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      const sessionId = sessions?.[0]?.id;
      if (!sessionId) return; // session not active

      // Get class info for the display name
      const { data: classes } = await client
        .from('efcd_classes')
        .select('id, name, team_name')
        .eq('id', classId)
        .limit(1);
      const cls = classes?.[0];
      if (!cls) return;

      const displayName = cls.team_name || cls.name;

      // Insert class-level score
      await client.from('efcd_scores').insert({
        student_id:   'class_' + classId,
        student_name: displayName,
        class_id:     classId,
        session_id:   sessionId,
        correct:      lessonData.correctAnswers || 0,
        answered:     lessonData.totalAnswers   || 0,
        date:         new Date().toISOString().split('T')[0],
      });

      // Award lesson completion badge to all present students
      const presentNames = JSON.parse(presentRaw || '[]');
      if (presentNames.length > 0 && presentNames[0] !== 'the class') {
        // Fetch student IDs for present members
        const { data: students } = await client
          .from('efcd_students')
          .select('id, name')
          .eq('class_id', classId);

        const present = (students || []).filter(s => presentNames.includes(s.name));
        if (present.length > 0) {
          const badges = present.map(s => ({
            student_id:   s.id,
            student_name: s.name,
            class_id:     classId,
            badge_key:    'lesson_' + (lessonData.lessonId || 'complete'),
            badge_emoji:  lessonData.badgeIcon || '🏅',
            badge_label:  lessonData.badgeName || 'Lesson Complete',
            is_manual:    false,
            session_id:   sessionId,
          }));
          await client.from('efcd_badges').insert(badges);
        }
      }

      console.log('✅ EFCD Class Bridge: lesson score submitted for', displayName);

    } catch (err) {
      console.warn('EFCD Class Bridge: silent error —', err.message);
    }
  }

  /* ─── BUILD SUPABASE CLIENT FROM LESSON META TAGS ────────── */
  // Some lesson pages initialise Supabase separately via init-auth.js.
  // This finds the already-initialised client or builds a minimal one.
  function _buildSBClient () {
    // Try window.efcdSupabaseClient first
    if (window.efcdSupabaseClient) return window.efcdSupabaseClient;
    // Try the supabase global with known credentials
    // Lessons that include init-auth.js will have it available as a global
    if (window.supabase && window._efcdSBUrl && window._efcdSBKey) {
      return window.supabase.createClient(window._efcdSBUrl, window._efcdSBKey);
    }
    return null;
  }

  /* ─── PUBLIC API ──────────────────────────────────────────── */
  // Main entry point — call this from every lesson's showCompletion()
  // It handles both the moment reward AND the class bridge in one call.
  async function onLessonComplete (lessonData) {
    // 1. Fire the contextual moment reward (always)
    fireReward(lessonData);

    // 2. Submit to class session if active (only if student joined a class)
    await submitToClass(lessonData);
  }

  window.EFCD_Rewards = {
    onLessonComplete,
    fireReward,       // call standalone if you just want the reward overlay
    submitToClass,    // call standalone if you just want the class submission
  };

  console.log('🎉 EFCD Rewards v1.0 — moment rewards + class bridge loaded');

})();
