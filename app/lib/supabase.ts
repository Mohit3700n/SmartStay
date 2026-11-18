import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
};

// Supabase Auth Helpers
export interface AuthUserMetadata {
  name: string;
  role: 'guest' | 'host';
  phone?: string;
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  async signUpEmail(email: string, password: string, metadata: AuthUserMetadata) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('SUPABASE_NOT_CONFIGURED');
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  async signInEmail(email: string, password: string) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('SUPABASE_NOT_CONFIGURED');
    }
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async sendPhoneOtp(phone: string) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('SUPABASE_NOT_CONFIGURED');
    }
    const { data, error } = await client.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return data;
  },

  async verifyPhoneOtp(phone: string, token: string) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('SUPABASE_NOT_CONFIGURED');
    }
    const { data, error } = await client.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  },
};
