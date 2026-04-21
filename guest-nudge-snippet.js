/* ══════════════════════════════════════════════════════
   EFCD GUEST SIGNUP NUDGE
   Drop this block into any lesson page, just before </script>
   Works with both #completion-screen (Artemis-style) and
   #end-screen (Estate-style) lessons.
   ══════════════════════════════════════════════════════ */

function efcdGuestNudge(xpEarned, wordCount) {
    /* If user is logged in, do nothing */
    if (window.EFCD_Auth && window.EFCD_Auth.getCurrentUser()) return;

    /* Find whichever completion card this lesson uses */
    var card = document.querySelector('.completion-card, .end-card');
    if (!card) return;

    /* Don't inject twice */
    if (document.getElementById('efcd-guest-nudge')) return;

    var nudge = document.createElement('div');
    nudge.id = 'efcd-guest-nudge';
    nudge.style.cssText = [
        'background:linear-gradient(135deg,#0f1923,#162032)',
        'border:3px solid var(--yellow)',
        'border-bottom:6px solid var(--yellow-shadow)',
        'border-radius:20px',
        'padding:24px 20px 20px',
        'margin-bottom:20px',
        'text-align:center',
        'position:relative',
        'overflow:hidden'
    ].join(';');

    var words = wordCount || 0;
    var xp    = xpEarned  || 0;

    nudge.innerHTML =
        '<div style="font-size:11px;font-weight:900;color:rgba(255,200,0,.7);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">⚠️ Not saved yet</div>' +
        '<div style="font-size:clamp(20px,5vw,28px);font-weight:900;color:#fff;letter-spacing:-1px;line-height:1.2;margin-bottom:6px">' +
            'You just earned <span style="color:var(--yellow)">+' + xp + ' XP</span>' +
            (words > 0 ? '<br>and learned <span style="color:var(--teal)">' + words + ' new words</span>' : '') +
        '</div>' +
        '<div style="font-size:13px;font-weight:700;color:rgba(255,255,255,.65);margin-bottom:20px;line-height:1.6">' +
            'Sign up free and it\'s saved forever.<br>Streaks, badges, vocab — all of it.' +
        '</div>' +
        '<a href="/signup/" style="' +
            'display:flex;align-items:center;justify-content:center;gap:8px;' +
            'width:100%;padding:15px;margin-bottom:10px;' +
            'background:var(--yellow);color:var(--ink-bold);' +
            'font-size:16px;font-weight:900;' +
            'border:2px solid var(--yellow-shadow);border-bottom:5px solid var(--yellow-shadow);' +
            'border-radius:14px;text-decoration:none;' +
            'font-family:inherit;box-sizing:border-box' +
        '">💾 Save my progress — it\'s free</a>' +
        '<button onclick="document.getElementById(\'efcd-guest-nudge\').style.display=\'none\'" style="' +
            'background:none;border:none;color:rgba(255,255,255,.4);' +
            'font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;' +
            'padding:4px 8px' +
        '">continue without saving →</button>';

    /* Prepend so nudge appears at the top of the card */
    card.insertBefore(nudge, card.firstChild);
}

/* Expose globally so lesson scripts can call it */
window.efcdGuestNudge = efcdGuestNudge;
