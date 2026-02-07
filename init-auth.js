// =========================================
// UNIVERSAL AUTH INITIALIZATION
// Load this script BEFORE everything else
// =========================================

(function() {
    'use strict';
    
    console.log('🎯 Initializing English For Cool Dudes...');
    
    // Step 1: Initialize Supabase (ONCE, globally)
    if (typeof window.efcdSupabaseClient === 'undefined') {
        const SUPABASE_URL = 'https://knwgmrgwbpchqyqxbxea.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud2dtcmd3YnBjaHF5cXhieGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDkyODgsImV4cCI6MjA3ODA4NTI4OH0.qnp2ScwSE77_idmPhpLE98sr46WvLpKtg6refFfC7s8';
        
        if (typeof window.supabase !== 'undefined') {
            window.efcdSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client created');
        } else {
            console.error('❌ Supabase library not loaded');
        }
    }
    
    // Step 2: Wait for DOM + Auth System
    window.efcdReady = new Promise((resolve) => {
        function checkReady() {
            if (document.readyState === 'complete' && typeof window.EFCD_Auth !== 'undefined') {
                console.log('✅ Auth system ready');
                resolve();
            } else {
                setTimeout(checkReady, 50);
            }
        }
        checkReady();
    });
    
})();
