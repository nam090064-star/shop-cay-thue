import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oixrycugagytnshogwrz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peHJ5Y3VnYWd5dG5zaG9nd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MTI0NjAsImV4cCI6MjAyNTM4ODQ2MH0.d9y5X0v1m-v1m'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)