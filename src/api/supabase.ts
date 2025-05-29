import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdzdalgdzyyvzxgneujt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kemRhbGdkenl5dnp4Z25ldWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDExMDQsImV4cCI6MjA2MzQxNzEwNH0.LFupih38BoVFnj7ZwgfhgWJfcKQdj2Cc-Wjr-SE6SG8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;