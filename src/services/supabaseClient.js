// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[IAAI] Variables Supabase manquantes.\n' +
    'Créez un fichier .env.local à la racine du projet avec :\n' +
    'VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=eyJh...'
  )
}

// Si les variables sont absentes, on crée quand même un client (les requêtes
// échoueront proprement et chaque page affichera son propre état d'erreur).
export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)