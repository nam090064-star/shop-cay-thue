import { createClient } from '@supabase/supabase-js'

// Lưu ý: Không có dấu / ở cuối URL
const supabaseUrl = 'https://rbccufsvvatyumynhdvd.supabase.co/rest/v1/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiY2N1ZnN2dmF0eXVteW5oZHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzA3MzAsImV4cCI6MjEwMTg0NjczMH0.FCU4Cqn-jLnQ5mQZy6xX-wBiWna5W_j9f--ZFfX6Ii4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)