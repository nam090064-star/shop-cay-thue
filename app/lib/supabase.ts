import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://oixrycugagytnshogwrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // <-- Dán mã anon key thật cực dài vào đây
)