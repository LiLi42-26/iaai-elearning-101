// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[IAAI] Variables Supabase manquantes.\n' +
    'Créez un fichier .env.local à la racine du projet avec :\n' +
    'VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=eyJh...'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)