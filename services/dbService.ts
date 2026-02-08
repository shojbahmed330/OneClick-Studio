
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User } from '../types';

/**
 * ==============================================================================
 * SUPABASE SQL SETUP (Run this in your Supabase SQL Editor)
 * ==============================================================================
 * 
 * -- 1. Create the users table
 * create table if not exists public.users (
 *   id uuid references auth.users on delete cascade primary key,
 *   email text unique not null,
 *   name text,
 *   tokens integer default 10,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 2. Enable Row Level Security
 * alter table public.users enable row level security;
 * 
 * -- 3. Create RLS Policies (Safely)
 * drop policy if exists "Users can view own profile" on public.users;
 * create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
 * 
 * drop policy if exists "Users can update own profile" on public.users;
 * create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
 * 
 * -- 4. Create trigger function to auto-create profile on signup
 * create or replace function public.handle_new_user()
 * returns trigger language plpgsql security definer set search_path = public as $$
 * begin
 *   insert into public.users (id, email, name, tokens)
 *   values (
 *     new.id, 
 *     new.email, 
 *     coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
 *     10
 *   );
 *   return new;
 * end;
 * $$;
 * 
 * -- 5. Set up the trigger
 * drop trigger if exists on_auth_user_created on auth.users;
 * create trigger on_auth_user_created
 *   after insert on auth.users
 *   for each row execute procedure public.handle_new_user();
 * 
 * ==============================================================================
 */

const SUPABASE_URL = 'https://ajgrlnqzwwdliaelvgoq.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3JsbnF6d3dkbGlhZWx2Z29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzQ5NjAsImV4cCI6MjA4NjA1MDk2MH0.Y39Ly94CXedvrheLKYZB8DYKwZjr6rJlaDOq_8crVkU';

export class DatabaseService {
  private static instance: DatabaseService;
  public supabase: SupabaseClient;
  
  private constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getCurrentSession() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session;
    } catch (e) {
      return null;
    }
  }

  async signUp(email: string, password: string, name?: string) {
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      const response = await this.supabase.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: { 
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name || cleanEmail.split('@')[0]
          }
        }
      });
      return response;
    } catch (error: any) {
      console.error("SignUp Error:", error);
      if (error.message === 'Failed to fetch') {
        throw new Error("সুপাবেস কানেকশন এরর: আপনার ইন্টারনেট কানেকশন বা সুপাবেস সেটিংস চেক করুন।");
      }
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    
    // Master Admin Logic
    if (cleanEmail === 'rajshahi.shojib@gmail.com' && password === '786400') {
      localStorage.setItem('df_force_login', cleanEmail);
      return { 
        data: { 
          user: { email: cleanEmail, id: 'master-shojib' } as any, 
          session: { user: { email: cleanEmail, id: 'master-shojib' } } as any 
        }, 
        error: null 
      };
    }

    try {
      const response = await this.supabase.auth.signInWithPassword({ email: cleanEmail, password });
      return response;
    } catch (error: any) {
      console.error("SignIn Error:", error);
      if (error.message === 'Failed to fetch') {
        throw new Error("সুপাবেস কানেকশন এরর: সার্ভারের সাথে যোগাযোগ করা সম্ভব হচ্ছে না।");
      }
      throw error;
    }
  }

  async loginWithGoogle() {
    try {
      return await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin
        }
      });
    } catch (error: any) {
      throw new Error("গুগল লগইন এরর: " + error.message);
    }
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/update-password`,
    });
  }

  async updatePassword(newPassword: string) {
    return await this.supabase.auth.updateUser({ password: newPassword });
  }

  async getUser(email: string, id?: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail && !id) return null;
    
    try {
      // Admin Logic
      if (cleanEmail === 'rajshahi.shojib@gmail.com' || id === 'master-shojib') {
        return {
          id: id || 'master-shojib',
          email: cleanEmail || 'rajshahi.shojib@gmail.com',
          name: 'Shojib Master',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Shojib`,
          tokens: 999,
          isLoggedIn: true,
          joinedAt: Date.now(),
          isAdmin: true
        };
      }

      // Profile Fetch
      const { data: userRecord, error } = await this.supabase
        .from('users')
        .select('*')
        .eq(id ? 'id' : 'email', id || cleanEmail)
        .maybeSingle();

      if (error || !userRecord) return null;

      const adminEmails = ['rajshahi.jibon@gmail.com', 'rajshahi.shojib@gmail.com', 'rajshahi.sumi@gmail.com'];
      const isAdminEmail = adminEmails.includes(userRecord.email);

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name || userRecord.email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRecord.email}`,
        tokens: userRecord.tokens ?? 0,
        isLoggedIn: true,
        joinedAt: new Date(userRecord.created_at || Date.now()).getTime(),
        isAdmin: isAdminEmail
      };

    } catch (e) {
      console.error("GetUser Error:", e);
      return null;
    }
  }

  async signOut() {
    localStorage.removeItem('df_force_login');
    try { 
      await this.supabase.auth.signOut(); 
    } catch (e) {
      console.error("SignOut error", e);
    }
  }

  async useToken(userId: string, email: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rajshahi.shojib@gmail.com') return this.getUser(cleanEmail, userId);
    
    try {
      const { data: user } = await this.supabase.from('users').select('tokens').eq('id', userId).single();
      if (user && user.tokens > 0) {
        await this.supabase.from('users').update({ tokens: user.tokens - 1 }).eq('id', userId);
      }
    } catch (e) {
      console.error("UseToken Error:", e);
    }
    return this.getUser(cleanEmail, userId);
  }
}
