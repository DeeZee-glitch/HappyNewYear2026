// Supabase Configuration
// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

const SUPABASE_CONFIG = {
    url: 'https://ulauoumieaftcbkzetel.supabase.co',  // Replace with your Supabase project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYXVvdW1pZWFmdGNia3pldGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODU0MDQsImV4cCI6MjA4MjY2MTQwNH0.Am9iFiWxLkqX67IoxECOCIubPba4o2bAJV98u9bu_WU'  // Replace with your Supabase anon/public key
};

// Initialize Supabase client
let supabaseClient = null;

// Check if Supabase is configured (both URL and key are provided and not placeholder values)
if (SUPABASE_CONFIG.url && 
    SUPABASE_CONFIG.anonKey && 
    SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && 
    SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    SUPABASE_CONFIG.url.includes('supabase.co')) {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('Supabase client initialized successfully!');
} else {
    console.warn('Supabase not configured. Please update config.js with your Supabase credentials.');
}

