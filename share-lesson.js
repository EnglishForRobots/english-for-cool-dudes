/**
 * share-lesson.js
 * English For Cool Dudes — v1.1 — May 2026
 *
 * Shared module for lesson sharing and worksheet access.
 * Exposes window.EFCD_Share.
 *
 * Zero dependencies. No Supabase. No auth. Works for guests and logged-in users.
 *
 * SCRIPT LOAD ORDER — add after daily-challenges-system.js, before interactions.js:
 *   <script src="/share-lesson.js"></script>
 *
 * LESSON PAGE REQUIREMENTS:
 *   window.LESSON_TITLE  — must be set before EFCD_Share.open() is called
 *   LESSON_LINK          — const in lesson script (e.g. '/peptides/')
 *
 * USAGE on lesson completion screen:
 *   EFCD_Share.open(LESSON_LINK, window.LESSON_TITLE);
 *
 * USAGE on worksheet page (pass isWorksheet:true to hide the redundant "open worksheet" row):
 *   EFCD_Share.open(LESSON_LINK, LESSON_TITLE, { isWorksheet: true });
 *
 * USAGE for the print button:
 *   EFCD_Share.openWorksheet(LESSON_LINK);
 */

(function () {
  'use strict';

  /* ─── CSS ──────────────────────────────────────────────────────── */
  const CSS = `
    #efcd-share-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      z-index: 10200;
      align-items: flex-end;
      justify-content: center;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    #efcd-share-backdrop.open {
      display: flex;
      animation: efcdShareBackdropIn .2s ease both;
    }
    @keyframes efcdShareBackdropIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    #efcd-share-sheet {
      background: #fff;
      border-radius: 24px 24px 0 0;
      padding: 10px 20px 40px;
      max-width: 480px;
      width: 100%;
      font-family: 'Nunito', system-ui, sans-serif;
      animation: efcdShareSheetIn .28s cubic-bezier(.4,0,.2,1) both;
      position: relative;
    }
    @keyframes efcdShareSheetIn {
      from { transform: translateY(100%); opacity: .4; }
      to   { transform: translateY(0);    opacity: 1;  }
    }

    #efcd-share-sheet .efcd-sh-handle {
      width: 40px;
      height: 4px;
      background: #E5E5E5;
      border-radius: 99px;
      margin: 8px auto 18px;
    }
    #efcd-share-sheet .efcd-sh-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    #efcd-share-sheet .efcd-sh-title {
      font-size: 16px;
      font-weight: 900;
      color: #111827;
      letter-spacing: -.3px;
    }
    #efcd-share-sheet .efcd-sh-lesson-name {
      font-size: 12px;
      font-weight: 700;
      color: #AFAFAF;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 260px;
    }
    #efcd-share-sheet .efcd-sh-close {
      width: 32px;
      height: 32px;
      background: #F4F6F8;
      border: 2px solid #E5E5E5;
      border-radius: 8px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      flex-shrink: 0;
      transition: background .12s;
    }
    #efcd-share-sheet .efcd-sh-close:hover { background: #E5E5E5; }

    #efcd-share-sheet .efcd-sh-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #efcd-share-sheet .efcd-sh-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px 15px;
      background: #F7F9FA;
      border: 2px solid #E5E5E5;
      border-bottom: 4px solid #CECECE;
      border-radius: 14px;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
      text-decoration: none;
      color: #111827;
      transition: border-color .12s, background .12s;
      width: 100%;
      -webkit-tap-highlight-color: transparent;
    }
    #efcd-share-sheet .efcd-sh-row:hover {
      border-color: #1CB0F6;
      background: #EEF8FE;
    }
    #efcd-share-sheet .efcd-sh-row:active {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }
    #efcd-share-sheet .efcd-sh-row-icon {
      font-size: 26px;
      flex-shrink: 0;
      width: 36px;
      text-align: center;
    }
    #efcd-share-sheet .efcd-sh-row-label {
      font-size: 14px;
      font-weight: 900;
      color: #111827;
      line-height: 1.2;
    }
    #efcd-share-sheet .efcd-sh-row-sub {
      font-size: 11px;
      font-weight: 700;
      color: #AFAFAF;
      margin-top: 2px;
      font-family: inherit;
    }

    /* worksheet row gets a teal accent */
    #efcd-share-sheet .efcd-sh-row.worksheet {
      border-color: rgba(0,212,170,.3);
      background: rgba(0,212,170,.05);
    }
    #efcd-share-sheet .efcd-sh-row.worksheet:hover {
      border-color: #00D4AA;
      background: rgba(0,212,170,.1);
    }

    /* success state on copy rows */
    #efcd-share-sheet .efcd-sh-row.copied .efcd-sh-row-label { color: #58A700; }
    #efcd-share-sheet .efcd-sh-row.copied {
      border-color: rgba(88,167,0,.35) !important;
      background: rgba(88,204,2,.07) !important;
    }
  `;

  /* ─── INJECT CSS ─────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('efcd-share-css')) return;
    const el = document.createElement('style');
    el.id = 'efcd-share-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  /* ─── BUILD DOM ──────────────────────────────────────────────── */
  function buildDOM() {
    if (document.getElementById('efcd-share-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'efcd-share-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Share lesson');

    backdrop.innerHTML = `
      <div id="efcd-share-sheet">
        <div class="efcd-sh-handle"></div>
        <div class="efcd-sh-head">
          <div>
            <div class="efcd-sh-title">Share this lesson</div>
            <div class="efcd-sh-lesson-name" id="efcd-sh-lesson-name"></div>
          </div>
          <button class="efcd-sh-close" id="efcd-sh-close" aria-label="Close">×</button>
        </div>
        <div class="efcd-sh-rows" id="efcd-sh-rows">
          <!-- rows injected by open() -->
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    /* close on backdrop click */
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) _close();
    });
    /* close on × */
    document.getElementById('efcd-sh-close').addEventListener('click', _close);
    /* close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') _close();
    });
  }

  /* ─── HELPERS ────────────────────────────────────────────────── */
  function _close() {
    const bd = document.getElementById('efcd-share-backdrop');
    if (bd) {
      bd.classList.remove('open');
      // reset any "Copied!" states after close animation
      setTimeout(function () {
        document.querySelectorAll('#efcd-share-sheet .efcd-sh-row.copied')
          .forEach(function (r) { r.classList.remove('copied'); });
      }, 300);
    }
  }

  function _copyText(text, rowEl, originalLabel) {
    function markCopied() {
      const lbl = rowEl.querySelector('.efcd-sh-row-label');
      if (lbl) {
        lbl.textContent = '✅ Copied!';
        rowEl.classList.add('copied');
        setTimeout(function () {
          lbl.textContent = originalLabel;
          rowEl.classList.remove('copied');
        }, 2200);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(function () {
        _fallbackCopy(text, markCopied);
      });
    } else {
      _fallbackCopy(text, markCopied);
    }
  }

  function _fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function _row(icon, label, sub, classes, handler) {
    var row = document.createElement('button');
    row.className = 'efcd-sh-row' + (classes ? ' ' + classes : '');
    row.innerHTML =
      '<span class="efcd-sh-row-icon">' + icon + '</span>' +
      '<div>' +
        '<div class="efcd-sh-row-label">' + label + '</div>' +
        '<div class="efcd-sh-row-sub">' + sub + '</div>' +
      '</div>';
    row.addEventListener('click', function () { handler(row); });
    return row;
  }

  function _linkRow(icon, label, sub, classes, href) {
    var row = document.createElement('a');
    row.className = 'efcd-sh-row' + (classes ? ' ' + classes : '');
    row.href = href;
    row.target = '_blank';
    row.rel = 'noopener noreferrer';
    row.innerHTML =
      '<span class="efcd-sh-row-icon">' + icon + '</span>' +
      '<div>' +
        '<div class="efcd-sh-row-label">' + label + '</div>' +
        '<div class="efcd-sh-row-sub">' + sub + '</div>' +
      '</div>';
    return row;
  }

  /* ─── PUBLIC API ─────────────────────────────────────────────── */

  /**
   * EFCD_Share.open(lessonLink, lessonTitle, options)
   * Opens the share sheet.
   *
   * @param {string} lessonLink    - e.g. '/peptides/'  (with trailing slash)
   * @param {string} lessonTitle   - e.g. 'Why Is Everyone Injecting Peptides?'
   * @param {object} [options]
   * @param {boolean} [options.isWorksheet] - true when called from a worksheet page.
   *   Suppresses the "Open printable worksheet" row since the user is already there.
   */
  function open(lessonLink, lessonTitle, options) {
    injectCSS();
    buildDOM();

    var opts          = options || {};
    var isWorksheet   = !!opts.isWorksheet;
    var origin        = location.origin;
    var lessonURL     = origin + lessonLink;
    var worksheetURL  = origin + lessonLink + 'print/';
    var title         = lessonTitle || 'English For Cool Dudes lesson';

    /* lesson name in header */
    var nameEl = document.getElementById('efcd-sh-lesson-name');
    if (nameEl) nameEl.textContent = title;

    /* build rows fresh each open (title/URL may differ) */
    var rowsEl = document.getElementById('efcd-sh-rows');
    rowsEl.innerHTML = '';

    /* ── Native share (mobile only) ── */
    if (navigator.share) {
      rowsEl.appendChild(_row(
        '📤',
        'Share via…',
        'Opens your device share menu',
        '',
        function () {
          navigator.share({
            title: title,
            text:  'Check out this free English lesson: ' + title,
            url:   lessonURL,
          }).catch(function () {});
        }
      ));
    }

    /* ── Copy lesson link ── */
    rowsEl.appendChild(_row(
      '🔗',
      'Copy lesson link',
      lessonURL,
      '',
      function (row) {
        _copyText(lessonURL, row, 'Copy lesson link');
      }
    ));

    /* ── Copy worksheet link ── */
    rowsEl.appendChild(_row(
      '🖨️',
      'Copy worksheet link',
      worksheetURL,
      'worksheet',
      function (row) {
        _copyText(worksheetURL, row, 'Copy worksheet link');
      }
    ));

    /* ── Open worksheet — hidden when already on the worksheet page ── */
    if (!isWorksheet) {
      rowsEl.appendChild(_linkRow(
        '📄',
        'Open printable worksheet',
        'Vocabulary · Grammar · Answers — A4 PDF',
        'worksheet',
        worksheetURL
      ));
    }

    /* ── Email ── */
    rowsEl.appendChild(_row(
      '✉️',
      'Send by email',
      'Opens your email app',
      '',
      function () {
        var subject = encodeURIComponent('Free English lesson: ' + title);
        var body    = encodeURIComponent(
          'Hi!\n\n' +
          'I thought you\'d enjoy this free English lesson:\n\n' +
          title + '\n' +
          lessonURL + '\n\n' +
          'There\'s also a printable worksheet (vocabulary + grammar exercises + answers):\n' +
          worksheetURL + '\n\n' +
          'No account needed — completely free to try!\n\n' +
          'Enjoy!'
        );
        window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
      }
    ));

    /* ── WhatsApp ── */
    rowsEl.appendChild(_row(
      '💬',
      'Share on WhatsApp',
      'Send to a contact or group',
      '',
      function () {
        var msg = encodeURIComponent(
          '🎓 Free English lesson: *' + title + '*\n' +
          lessonURL + '\n\n' +
          'Printable worksheet: ' + worksheetURL
        );
        window.open('https://wa.me/?text=' + msg, '_blank', 'noopener');
      }
    ));

    /* ── Open ── */
    document.getElementById('efcd-share-backdrop').classList.add('open');
  }

  /**
   * EFCD_Share.openWorksheet(lessonLink)
   * Directly opens the worksheet in a new tab.
   * Used by the "🖨️ Print / save worksheet" button.
   *
   * @param {string} lessonLink  - e.g. '/peptides/'
   */
  function openWorksheet(lessonLink) {
    window.open(lessonLink + 'print/', '_blank', 'noopener');
  }

  /* ─── EXPORT ─────────────────────────────────────────────────── */
  window.EFCD_Share = {
    open:          open,
    openWorksheet: openWorksheet,
  };

})();
