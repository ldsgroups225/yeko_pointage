import type { Database } from './types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { EXPO_PUBLIC_SUPABASE_KEY, EXPO_PUBLIC_SUPABASE_URL } from './keys'
import 'react-native-url-polyfill/auto'

// Better put your these secret keys in .env file
export const supabase = createClient<Database>(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  },
)
