import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rbccufsvvatyumynhdvd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // BẮT ĐẦU BẰNG eyJ... (KHÔNG CÓ DẤU : Ở ĐẦU)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)