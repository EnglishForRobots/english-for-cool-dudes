/**
 * session-mode.js
 * ───────────────────────────────────────────────────────────────
 * Drop this ONE script tag into every lesson page, index page,
 * and the beginner/intermediate/advanced/etc. track pages.
 *
 * <script src="/session-mode.js"></script>
 *
 * It must load BEFORE supabase-auth-gamified.js so it can block
 * personal auth from running when a class session is active.
 *
 * What it does:
 *   • Reads localStorage for an active class session
 *   • Exposes window.EFCD_Session  (the public API)
 *   • In CLASS MODE  → hides personal header panel, shows class pill,
 *                      patches EFCD_Auth so completeLesson() is a no-op,
 *                      routes all completion data to the class session only
 *   • In PERSONAL MODE → does nothing, everything runs as before
 *
 * Public API  (window.EFCD_Session)
 * ─────────────────────────────────
 *   .isClassMode()          → boolean
 *   .getClassId()           → string | null
 *   .getPresentNames()      → string[]   e.g. ['Maria', 'Pedro']
 *   .getDisplayLabel()      → string     e.g. 'Maria & Pedro 🚇'
 *   .applyHeader()          → call once DOM is ready; handles pill + user panel
 *   .applyHero(containerEl) → replaces hero card with class-mode version
 *   .onLessonComplete(data) → call from showCompletion(); routes to correct sink
 *   .clearSession()         → wipe localStorage (called from /live/ "leave" btn)
 * ───────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ── READ STATE ──────────────────────────────────────────────
  const _classId   = localStorage.getItem('efcd_class_id')   || null;
  const _sessionId = localStorage.getItem('efcd_session_id') || null;
  const _rawNames  = JSON.parse(localStorage.getItem('efcd_present_names') || '[]');
  const _names     = _rawNames.filter(n => n && n !== 'the class');
  const _classMode = !!_classId;

  // ── DISPLAY HELPERS ─────────────────────────────────────────
  function _label() {
    if (!_names.length) return 'Class session 🚇';
    if (_names.length === 1) return _names[0] + ' 🚇';
    if (_names.length === 2) return _names[0] + ' & ' + _names[1] + ' 🚇';
    return _names.slice(0, 2).join(', ') + ' +' + (_names.length - 2) + ' 🚇';
  }

  // ── HEADER ──────────────────────────────────────────────────
  function applyHeader() {
    // Always validate session is still live (teacher may have ended it)
    if (_classMode && window.EFCD_Rewards) {
      EFCD_Rewards.validateClassSession('hdr-class-pill');
    }

    const pill  = document.getElementById('hdr-class-pill');
    const panel = document.getElementById('hdr-user-panel');

    if (_classMode) {
      // Show class pill with student names
      if (pill) {
        const lbl = pill.querySelector('.hdr-class-name');
        if (lbl) lbl.textContent = _label();
        pill.classList.add('show');
      }
      // Hide Tony — completely
      if (panel) panel.style.display = 'none';

    } else {
      // Personal mode — hide class pill, personal panel controlled by auth
      if (pill) pill.classList.remove('show');
    }
  }

  // ── HERO REPLACEMENT ────────────────────────────────────────
  // Call this on track index pages (beginner/, intermediate/, etc.)
  // Pass the hero card element. Returns true if it replaced it.
  function applyHero(containerEl) {
    if (!_classMode || !containerEl) return false;

    const greeting = _getTimeGreeting();
    const subtitle = _names.length
      ? _names.join(', ') + ' — pick a lesson and go! 🚀'
      : 'Pick a lesson below and go! 🚀';

    containerEl.innerHTML = `
      <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);
        border:2px solid rgba(255,255,255,.25);border-radius:99px;padding:5px 14px;
        margin-bottom:14px;font-size:12px;font-weight:900;color:#fff;
        text-transform:uppercase;letter-spacing:1.5px">
        🚇 Class Session · Live Now
      </div>
      <div style="font-size:clamp(26px,6vw,42px);font-weight:900;color:#fff;
        line-height:1.1;letter-spacing:-1px;margin-bottom:10px;font-style:italic">
        ${greeting},<br>
        <span style="color:var(--yellow);text-shadow:0 3px 0 var(--yellow-shadow)">
          ${_names.length === 1 ? _names[0] + '!' : 'Everyone!'}
        </span>
      </div>
      <div style="font-size:15px;font-weight:700;color:rgba(255,255,255,.9);
        margin-bottom:20px;max-width:360px;line-height:1.65">
        ${subtitle}
      </div>
      <a href="/live/"
        style="display:inline-flex;align-items:center;gap:8px;padding:11px 20px;
          background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.25);
          border-radius:99px;color:#fff;font-size:13px;font-weight:900;
          text-decoration:none;transition:all .12s">
        ← Back to class
      </a>`;

    return true;
  }

  // ── LESSON COMPLETION ROUTER ────────────────────────────────
  // Call this INSTEAD of calling EFCD_Auth.completeLesson() and
  // EFCD_Rewards.onLessonComplete() yourself. It routes correctly.
  //
  // data = {
  //   lessonId, lessonTitle, lessonLevel,
  //   badgeIcon, badgeName,
  //   correctAnswers, totalAnswers, bestCombo,
  //   xp, perfectScore,
  //   vocabulary  (optional array, personal mode only)
  // }
  async function onLessonComplete(data) {
    if (_classMode) {
      // ── CLASS MODE: post to session leaderboard only ─────────
      try {
        if (typeof EFCD_Rewards !== 'undefined') {
         await EFCD_Rewards.onLessonComplete({
  lessonId:       data.lessonId,
  lessonTitle:    data.lessonTitle,
  lessonLevel:    data.lessonLevel,
  badgeIcon:      data.badgeIcon,
  badgeName:      data.badgeName,
  correctAnswers: data.correctAnswers,
  totalAnswers:   data.totalAnswers,
  bestCombo:      data.bestCombo,
  perfectScore:   data.perfectScore,
  xp:             data.xp,
  vocabulary:     data.vocabulary,
  grammarFocus:   data.grammarFocus,
});
        }
      } catch (e) {
        console.warn('[EFCD_Session] class completion post failed', e);
      }

      // Show the class badge row in completion screen
      _showClassCompletionBadge(data);

      // Do NOT touch personal account — return early
      return { mode: 'class' };
    }

    // ── PERSONAL MODE: existing behaviour ───────────────────
    try {
      if (window.EFCD_Auth?.getCurrentUser()) {
        await window.EFCD_Auth.completeLesson({
          lessonId:     data.lessonId,
          lessonTitle:  data.lessonTitle,
          lessonLevel:  data.lessonLevel,
          lessonLink:   data.lessonLink || ('/' + data.lessonId + '/'),
          badgeIcon:    data.badgeIcon,
          badgeName:    data.badgeName,
          vocabulary:   data.vocabulary || [],
          perfectScore: data.perfectScore,
        });
      }
    } catch (e) {
      console.warn('[EFCD_Session] personal completeLesson failed', e);
    }

    // Daily challenges (personal only)
    try {
      if (window.DailyChallenges) {
        const dcResult = await window.DailyChallenges.updateChallengeProgress({
          perfectScore: data.perfectScore,
        });
        if (dcResult?.justCompleted) {
          setTimeout(() =>
            window.DailyChallenges.showChallengeCompletionCelebration(dcResult.challenge),
          1800);
        }
        localStorage.setItem('dc_last_lesson_date', new Date().toDateString());
        localStorage.setItem('dc_last_lesson_section', data.lessonLevel?.toLowerCase() || '');
      }
    } catch (e) {}

    // EFCD_Rewards also runs in personal mode (handles its own guard)
    try {
      if (typeof EFCD_Rewards !== 'undefined') {
        await EFCD_Rewards.onLessonComplete(data);
      }
    } catch (e) {}

    return { mode: 'personal' };
  }

  // ── COMPLETION SCREEN CLASS BADGE ───────────────────────────
  function _showClassCompletionBadge(data) {
    const ccb = document.getElementById('cc-class-badge');
    if (!ccb) return;

    const mainText = ccb.querySelector('.cc-class-text-main');
    const subText  = ccb.querySelector('.cc-class-text-sub');

    if (mainText) {
      mainText.textContent = _names.length
        ? '🏆 ' + _names.join(', ') + ' earned the ' + data.badgeName + ' badge!'
        : '🏆 Your class earned the ' + data.badgeName + ' badge!';
    }
    if (subText) {
      subText.textContent = 'Score and badge added to the class leaderboard!';
    }
    ccb.style.display = 'flex';

    // Hide personal dashboard button — irrelevant in class mode
    const dbBtn = document.getElementById('cc-dashboard-btn');
    if (dbBtn) dbBtn.style.display = 'none';
  }

  // ── PATCH EFCD_AUTH IN CLASS MODE ───────────────────────────
  // This runs after DOM ready. If class mode is active, we wrap
  // EFCD_Auth.completeLesson() to be a no-op so even if lesson
  // pages call it directly, nothing writes to Tony's profile.
  function _patchAuth() {
    if (!_classMode) return;
    if (!window.EFCD_Auth) return;

    const _original = window.EFCD_Auth.completeLesson;
    window.EFCD_Auth.completeLesson = async function (...args) {
      console.log('[EFCD_Session] CLASS MODE — completeLesson() blocked (would have written to personal account)');
      return null; // silent no-op
    };
    window.EFCD_Auth._completeLessonOriginal = _original; // keep reference
  }

  // ── CLEAR SESSION ────────────────────────────────────────────
  function clearSession() {
    localStorage.removeItem('efcd_class_id');
    localStorage.removeItem('efcd_session_id');
    localStorage.removeItem('efcd_present_names');
  }

  // ── HELPERS ──────────────────────────────────────────────────
  function _getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // ── LIVE PILL ON HOMEPAGE / TRACK PAGES ─────────────────────
  // For pages that use the simpler .live-pill (homepage, index pages)
  function applyLivePill() {
    const pill = document.getElementById('live-pill');
    if (!pill) return;
    if (_classMode) {
      const txt = document.getElementById('live-pill-text');
      if (txt) txt.textContent = _label();
      pill.classList.add('show');
      if (window.EFCD_Rewards) EFCD_Rewards.validateClassSession('live-pill');
    } else {
      pill.classList.remove('show');
    }
  }

  // ── AUTO-PATCH after auth loads ──────────────────────────────
  // Wait for efcdReady then patch EFCD_Auth
  if (_classMode) {
    if (window.efcdReady && typeof window.efcdReady.then === 'function') {
      window.efcdReady.then(_patchAuth).catch(() => {});
    } else {
      // efcdReady not yet defined — watch for it
      let _watchCount = 0;
      const _watch = setInterval(() => {
        _watchCount++;
        if (window.EFCD_Auth) { _patchAuth(); clearInterval(_watch); }
        if (_watchCount > 40)  { clearInterval(_watch); } // give up after 4s
      }, 100);
    }
  }

  // ── PUBLIC API ───────────────────────────────────────────────
  window.EFCD_Session = {
    isClassMode:    () => _classMode,
    getClassId:     () => _classId,
    getSessionId:   () => _sessionId,
    getPresentNames:() => [..._names],
    getDisplayLabel:() => _label(),
    applyHeader,
    applyHero,
    applyLivePill,
    onLessonComplete,
    clearSession,
  };

  // Run pill immediately if DOM is already ready
  if (document.readyState !== 'loading') {
    applyLivePill();
  } else {
    document.addEventListener('DOMContentLoaded', applyLivePill);
  }

})();
