import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_API_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helper functions
export const handleLogin = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password })
}



