import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function logEnquiry(enquiryData) {
  if (!supabase) {
    console.warn('Supabase not configured — enquiry not logged')
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('enquiries')
    .insert([enquiryData])
    .select()

  if (error) {
    console.error('Supabase insert error:', error)
  }

  return { data, error }
}
