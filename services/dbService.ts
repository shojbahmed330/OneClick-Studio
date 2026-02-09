
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
    
    // ডুপ্লিকেট প্যাকেজ রিমুভ করতে ফিল্টার (একই ID থাকলে একবারই নেবে)
    const uniquePackagesMap = new Map();
    data.forEach(pkg => {
      if (!uniquePackagesMap.has(pkg.id)) {
        uniquePackagesMap.set(pkg.id, pkg);
      }
    });
    
    return Array.from(uniquePackagesMap.values()) as Package[];
  }

  async submitPaymentRequest(userId: string, pkgId: string, amount: number, method: string, trxId: string, screenshot?: string, message?: string): Promise<boolean> {
    const { data, error } = await this.supabase.from('transactions').insert({
      user_id: userId,
      package_id: pkgId,
      amount: amount,
      status: 'pending',
      payment_method: method,
      trx_id: trxId,
      screenshot_url: screenshot || null,
      message: message || null
    }).select();
    
    if (error) throw error;
    return !!data;
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    try {
      const { data: txs, error: txError } = await this.supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (txError) throw txError;
      if (!txs || txs.length === 0) return [];

      const uniqueUserIds = [...new Set(txs.map(t => t.user_id))];
      const { data: users, error: userError } = await this.supabase
        .from('users')
        .select('id, email')
        .in('id', uniqueUserIds);

      const userLookup = new Map(users?.map(u => [u.id, u.email]) || []);

      return txs.map(t => ({
        ...t,
        user_email: userLookup.get(t.user_id) || 'Unknown User'
      }));
    } catch (e) {
      console.error("Critical Admin Dashboard Fetch Error:", e);
      return [];
    }
  }

  async approveTransaction(txId: string): Promise<boolean> {
    try {
      // ১. ট্রানজ্যাকশন ডাটা ফেচ করুন
      const { data: tx, error: txError } = await this.supabase
        .from('transactions')
        .select('*')
        .eq('id', txId)
        .single();
        
      if (txError || !tx) throw new Error("পেমেন্ট তথ্য পাওয়া যায়নি");

      // ২. প্যাকেজ থেকে টোকেন সংখ্যা জানুন
      const { data: pkg, error: pkgError } = await this.supabase
        .from('packages')
        .select('tokens')
        .eq('id', tx.package_id)
        .single();
      
      if (pkgError || !pkg) throw new Error("প্যাকেজ তথ্য পাওয়া যায়নি");
      const tokensToAdd = pkg.tokens || 0;

      // ৩. ইউজারের বর্তমান টোকেন সংখ্যা জানুন
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('tokens')
        .eq('id', tx.user_id)
        .single();
        
      if (userError || !user) throw new Error("ইউজার পাওয়া যায়নি");

      // ৪. ইউজারের অ্যাকাউন্টে টোকেন যোগ করুন (টোকেন আপডেট)
      const newTotalTokens = (user.tokens || 0) + tokensToAdd;
      const { error: updateError } = await this.supabase
        .from('users')
        .update({ tokens: newTotalTokens })
        .eq('id', tx.user_id);
      
      if (updateError) throw updateError;

      // ৫. ট্রানজ্যাকশন স্ট্যাটাস 'completed' করে দিন
      const { error: finalError } = await this.supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', txId);
      
      if (finalError) throw finalError;
      
      return true;
    } catch (e) {
      console.error("Approval Error:", e);
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
    try { await this.supabase.auth.signOut(); } catch (e) {}
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
