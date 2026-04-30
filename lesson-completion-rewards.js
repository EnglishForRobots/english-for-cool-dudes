/* ═══════════════════════════════════════════════════════════════
   lesson-completion-rewards.js  v1.1
   EFCD — drop this into every lesson page

   TWO systems in one file:

   1. MOMENT REWARDS — contextual celebration at lesson completion
      No accounts. No database. Pure immediate joy.
      Call: EFCD_Rewards.onLessonComplete(lessonData)

   2. CLASS BRIDGE — submits score to Supabase if a class session
      is currently active (student joined via /live/).
      Call: EFCD_Rewards.onLessonComplete(lessonData) — same call,
      bridge runs automatically if a session is detected.

   lessonData shape:
   {
     lessonId:    'wigtown-bookshop-intermediate',
     lessonTitle: 'The Town That Was Saved by Books',
     lessonLevel: 'Intermediate',
     badgeIcon:   '📚',
     badgeName:   'Honorary Bookseller',
     correctAnswers: 18,
     totalAnswers:   22,
     bestCombo:       5,
     perfectScore:  false,
     completionTime: 480,  // seconds (optional)
   }

   v1.1 fixes:
   - getSB() now waits up to 3s for init-auth.js to finish instead
     of returning null immediately (race condition fix)
   - submitToClass() reads efcd_session_id from localStorage to
     avoid an extra DB round-trip
   - validateClassSession() exported so lesson/index pages can
     auto-clear a dead session pill without any extra script
═══════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';

  /* ─── SUPABASE — waits for init-auth.js, never returns null early ── */
  async function getSB () {
    // Already available — fast path
    if (window.efcdSupabaseClient) return window.efcdSupabaseClient;

    // Wait up to 3 seconds for init-auth.js to finish (100ms × 30)
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (window.efcdSupabaseClient) return window.efcdSupabaseClient;
    }

    // Last resort: build our own client if the supabase global exists
    if (window.supabase) {
      window.efcdSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      return window.efcdSupabaseClient;
    }

    return null;
  }

  /* ─── TIME HELPERS ─────────────────────────────────────────── */
  function hour ()      { return new Date().getHours(); }
  function dayOfWeek () { return new Date().getDay(); } // 0=Sun … 6=Sat

  /* ─── MOMENT-REWARD CATALOGUE ─────────────────────────────── */
  const MOMENT_REWARDS = [

    // ── TIME-BASED ──────────────────────────────────────────
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

    // ── DAY-BASED ────────────────────────────────────────────
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

    // ── PERFORMANCE-BASED ────────────────────────────────────
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
      msg: '10 correct in a row at some point in that lesson. Your brain was in a different gear today. Keep that up.',
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

    // ── FALLBACK — always fires if nothing else matched ──────
    {
      id: 'lesson_complete',
      test: () => true,
      emoji: '🌟',
      title: 'Lesson Complete!',
      msg: 'Another lesson done. That is not nothing — that is real progress. Every lesson is a tiny version of you becoming a better version of you.',
      color: '#58CC02', shadow: '#58A700',
    },
  ];

  /* ─── FIRE THE MOMENT REWARD ────────────────────────────── */
  function fireReward (lessonData) {
    const reward = MOMENT_REWARDS.find(r => r.test(lessonData));
    if (!reward) return;

    let msg = reward.msg;
    if (reward.id === 'hot_streak' && lessonData.bestCombo) {
      msg = `${lessonData.bestCombo} correct in a row at some point in that lesson. Your brain was in a different gear today. Keep that up.`;
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

  /* ─── FALLBACK OVERLAY ──────────────────────────────────── */
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

  /* ─── CLASS BRIDGE ──────────────────────────────────────── */
  async function submitToClass (lessonData) {
    const classId    = localStorage.getItem('efcd_class_id');
    const presentRaw = localStorage.getItem('efcd_present_names');

    if (!classId) return; // not in a class session — skip silently

    // v1.1 FIX: await getSB() instead of calling it synchronously.
    // The old getSB() returned null if init-auth.js hadn't finished yet,
    // silently dropping every score. Now we wait up to 3s for the client.
    const client = await getSB();
    if (!client) return;

    try {
      // v1.1 FIX: read session_id from localStorage first — set by /live/
      // when the student joins. Avoids an extra DB round-trip and works
      // even if the session query would otherwise race with page load.
      let sessionId = localStorage.getItem('efcd_session_id');

      if (!sessionId) {
        // Fallback: query for the open session (original behaviour)
        const { data: sessions } = await client
          .from('efcd_sessions')
          .select('id')
          .eq('class_id', classId)
          .is('ended_at', null)
          .order('started_at', { ascending: false })
          .limit(1);
        sessionId = sessions?.[0]?.id;
      }

      if (!sessionId) return; // no active session found

      // Get class display name
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

      // Award lesson badge to all present students
      const presentNames = JSON.parse(presentRaw || '[]');
      if (presentNames.length > 0 && presentNames[0] !== 'the class') {
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

      console.log('✅ EFCD Class Bridge: lesson score submitted for', displayName);

    } catch (err) {
      console.warn('EFCD Class Bridge: silent error —', err.message);
    }
  }

  /* ─── SESSION VALIDATOR ─────────────────────────────────── */
  // Call this on any page that shows a "Back to class" pill.
  // It checks Supabase to confirm the stored session is still live.
  // If the teacher has ended the session, it clears localStorage and
  // hides the pill — so world users never see a stale "Back to class".
  //
  // Usage in DOMContentLoaded:
  //   if (localStorage.getItem('efcd_class_id')) {
  //     const pill = document.getElementById('hdr-class-pill');
  //     if (pill) pill.classList.add('show');
  //     EFCD_Rewards.validateClassSession('hdr-class-pill');
  //   }
  async function validateClassSession (pillElementId) {
    const classId = localStorage.getItem('efcd_class_id');
    if (!classId) return;

    try {
      const client = await getSB();
      if (!client) return;

      const { data } = await client
        .from('efcd_classes')
        .select('is_active')
        .eq('id', classId)
        .single();

      if (!data || !data.is_active) {
        // Session has ended — clear everything
        localStorage.removeItem('efcd_class_id');
        localStorage.removeItem('efcd_session_id');
        localStorage.removeItem('efcd_present_names');

        if (pillElementId) {
          const pill = document.getElementById(pillElementId);
          if (pill) pill.classList.remove('show');
        }

        console.log('ℹ️ EFCD: class session ended — localStorage cleared');
      }
    } catch (e) {
      // Network failure — leave pill as-is, don't punish the user
    }
  }

  /* ─── PUBLIC API ────────────────────────────────────────── */
  async function onLessonComplete (lessonData) {
    // 1. Fire the contextual moment reward (always — no account needed)
    fireReward(lessonData);

    // 2. Submit to class session if active
    await submitToClass(lessonData);
  }

  window.EFCD_Rewards = {
    onLessonComplete,
    fireReward,
    submitToClass,
    validateClassSession,   // v1.1 — exported for lesson + index pages
  };

  console.log('🎉 EFCD Rewards v1.1 — moment rewards + class bridge loaded');

})();
