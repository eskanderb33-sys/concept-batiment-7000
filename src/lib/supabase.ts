import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kriuycxoapqaoduvktym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaXV5Y3hvYXBxYW9kdXZrdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDg2MjcsImV4cCI6MjA4NzgyNDYyN30.7_HROvDaIIGkwSJ1Ym5LMaWMdvXrgpupYgZWWErfnlo';

export const supabase = createClient(supabaseUrl, supabaseKey);
