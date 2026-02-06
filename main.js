// =========================================
// SIMPLIFIED MAIN.JS - NO AUTHENTICATION
// Just handles the office activity ticker
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 English For Cool Dudes - Simplified version loaded!');
    
    // Initialize the office activity ticker
    initializeTicker();
});

// =========================================
// OFFICE ACTIVITY TICKER
// =========================================

function initializeTicker() {
    const tickerEl = document.getElementById('pulse-ticker-text');
    if (!tickerEl) return;

    // Check if tickerItems is defined (from tickerData.js)
    if (typeof tickerItems === 'undefined' || !Array.isArray(tickerItems) || tickerItems.length === 0) {
        console.warn('⚠️ Ticker data not found or empty');
        tickerEl.textContent = 'Welcome to English For Cool Dudes! 😎';
        return;
    }

    let currentIndex = 0;

    function updateTicker() {
        // Fade out
        tickerEl.style.opacity = '0';
        
        setTimeout(() => {
            // Update text
            tickerEl.textContent = tickerItems[currentIndex];
            
            // Fade in
            tickerEl.style.opacity = '1';
            
            // Move to next item
            currentIndex = (currentIndex + 1) % tickerItems.length;
        }, 500);
    }

    // Initial display
    tickerEl.textContent = tickerItems[0];
    tickerEl.style.opacity = '1';
    
    // Start rotation (every 8 seconds)
    setInterval(updateTicker, 8000);
    
    console.log('✅ Office activity ticker initialized');
}
