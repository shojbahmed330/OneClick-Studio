
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User, Package, Transaction } from '../types';

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
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
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
      throw error;
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
      return null;
    }
  }

  async getPackages(): Promise<Package[]> {
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) return [];
    return data as Package[];
  }

  async submitPaymentRequest(userId: string, pkgId: string, amount: number, method: string, trxId: string, screenshot?: string): Promise<boolean> {
    const { error } = await this.supabase.from('transactions').insert({
      user_id: userId,
      package_id: pkgId,
      amount: amount,
      status: 'pending',
      payment_method: method,
      trx_id: trxId,
      screenshot_url: screenshot
    });
    
    if (error) throw error;
    return true;
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*, users(email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data as any[]).map(t => ({
        ...t,
        user_email: t.users?.email
    }));
  }

  async approveTransaction(txId: string): Promise<boolean> {
    try {
      // 1. Get Transaction Details
      const { data: tx, error: txError } = await this.supabase
        .from('transactions')
        .select('*, packages(tokens)')
        .eq('id', txId)
        .single();
        
      if (txError || !tx) throw new Error("Transaction not found");
      if (tx.status !== 'pending') throw new Error("Already processed");

      const tokensToAdd = tx.packages?.tokens || 0;

      // 2. Add Tokens to User
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('tokens')
        .eq('id', tx.user_id)
        .single();
        
      if (userError) throw userError;

      const { error: updateError } = await this.supabase
        .from('users')
        .update({ tokens: (user.tokens || 0) + tokensToAdd })
        .eq('id', tx.user_id);

      if (updateError) throw updateError;

      // 3. Mark Transaction as Completed
      const { error: finalError } = await this.supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', txId);

      if (finalError) throw finalError;

      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async rejectTransaction(txId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('transactions')
      .update({ status: 'rejected' })
      .eq('id', txId);
    return !error;
  }

  async signOut() {
    localStorage.removeItem('df_force_login');
    try { 
      await this.supabase.auth.signOut(); 
    } catch (e) {}
  }

  async useToken(userId: string, email: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rajshahi.shojib@gmail.com') return this.getUser(cleanEmail, userId);
    
    try {
      const { data: user } = await this.supabase.from('users').select('tokens').eq('id', userId).single();
      if (user && user.tokens > 0) {
        await this.supabase.from('users').update({ tokens: user.tokens - 1 }).eq('id', userId);
      }
    } catch (e) {}
    return this.getUser(cleanEmail, userId);
  }
}
