
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout, Users, BarChart3, Clock, Wallet, CheckCircle2, XCircle, Search, Trash
} from 'lucide-react';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

const AdminLoginPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData && userData.isAdmin) {
        onLoginSuccess(userData);
      } else {
        throw new Error("Access Denied: Not an admin account.");
      }
    } catch (error: any) {
      alert(error.message || "Admin access failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#020617] text-white p-4">
      <div className="glass-card p-10 rounded-[3rem] w-full max-w-md border-cyan-500/20 shadow-2xl animate-in zoom-in-95">
        <div className="text-center mb-10">
          <ShieldAlert size={48} className="mx-auto text-cyan-500 mb-4" />
          <h2 className="text-3xl font-black tracking-tight">Admin <span className="text-cyan-400">Terminal</span></h2>
          <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Master Control Access Only</p>
        </div>
        <form onSubmit={handleAdminAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Admin ID</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="admin@oneclick.studio" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Master Token</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
          </div>
          <button disabled={isLoading} className="w-full py-4 bg-cyan-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Authorize Terminal'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0f172a] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-400 to-blue-600">OneClick Studio</h1>
        <div onClick={!isScanning ? handleStartAuth : undefined} className="relative w-40 h-40 flex items-center justify-center cursor-pointer mb-8">
          <Fingerprint size={80} className={`text-blue-600 transition-all duration-500 relative z-10 ${isScanning ? 'text-cyan-400 scale-110 animate-pulse' : 'animate-bounce'}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] rounded-full animate-[scanning_1.5s_infinite]"></div>}
        </div>
        <h2 className="text-xl font-bold tracking-widest uppercase text-slate-400">{isScanning ? 'Authenticating...' : 'Access Interface'}</h2>
      </div>
      <style>{`@keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
    </div>
  );
};

const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData) onLoginSuccess(userData);
    } catch (e: any) { alert(e.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0f172a] p-4">
      <div className="glass-card p-10 rounded-[3rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <h2 className="text-3xl font-black mb-8">{isRegister ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" required />}
          <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white" required />
          <button disabled={isLoading} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase text-sm hover:bg-blue-500 transition-all">
            {isLoading ? <Loader2 className="animate-spin mx-auto"/> : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="mt-6 text-sm text-cyan-400 font-bold hover:underline">{isRegister ? 'Already have an account? Login' : 'No account? Register'}</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<h1 style="color:cyan; text-align:center; padding:50px;">OneClick Studio Ready</h1>'
  });
  const [github, setGithub] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [logoClicks, setLogoClicks] = useState(0);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'pushing' | 'building' | 'done'>('idle');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<Package | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'form' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [adminActiveTab, setAdminActiveTab] = useState<'transactions' | 'users' | 'tickets'>('transactions');
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  const gemini = useRef(new GeminiService());
  const githubService = useRef(new GithubService());
  const db = DatabaseService.getInstance();

  useEffect(() => {
    db.getCurrentSession().then(async session => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        if (userData) { setUser(userData); if (path === '/') navigate('/dashboard'); }
      }
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  useEffect(() => {
    if (user?.isAdmin && path === '/admin') setMode(AppMode.ADMIN);
  }, [user, path]);

  useEffect(() => {
    if (mode === AppMode.SHOP) db.getPackages().then(setPackages);
    if (mode === AppMode.ADMIN && user?.isAdmin) db.getPendingTransactions().then(setPendingTransactions);
  }, [mode, user]);

  const navigate = (to: string) => {
    try { window.history.pushState({}, '', to); } catch (e) {}
    setPath(to);
  };

  const handleLogout = async () => {
    await db.signOut();
    setUser(null);
    navigate('/login');
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsGenerating(true);
    try {
      const res = await gemini.current.generateWebsite(text, projectFiles, messages);
      if (res.files) setProjectFiles(prev => ({ ...prev, ...res.files }));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) { const updated = await db.useToken(user.id, user.email); if (updated) setUser(updated); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleApprove = async (txId: string) => {
    if (!confirm("Approve this payment?")) return;
    try {
      await db.approveTransaction(txId);
      setPendingTransactions(prev => prev.filter(t => t.id !== txId));
      alert("Tokens credited successfully!");
    } catch (e: any) { alert(e.message); }
  };

  const handleReject = async (txId: string) => {
    if (!confirm("Reject this payment?")) return;
    try {
      await db.rejectTransaction(txId);
      setPendingTransactions(prev => prev.filter(t => t.id !== txId));
      alert("Payment Rejected.");
    } catch (e: any) { alert(e.message); }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPurchasing || !user || !trxId) return;
    setPaymentStep('processing');
    try {
      await db.submitPaymentRequest(user.id, isPurchasing.id, isPurchasing.price, selectedMethod, trxId, screenshot || undefined);
      setPaymentStep('success');
      setTimeout(() => { setIsPurchasing(null); setPaymentStep('method'); setTrxId(''); setScreenshot(null); }, 3000);
    } catch (e: any) { alert("Failed: " + e.message); setPaymentStep('form'); }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-cyan-500"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) return path === '/admin' ? <AdminLoginPage onLoginSuccess={setUser} /> : (path === '/login' ? <AuthPage onLoginSuccess={setUser} /> : <ScanPage onFinish={() => navigate('/login')} />);

  return (
    <div className="h-[100dvh] flex flex-col font-['Hind_Siliguri'] text-slate-100 bg-[#020617] overflow-hidden">
      <header className="h-20 border-b border-white/5 glass-card flex items-center justify-between px-8 z-50">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg"><Cpu size={20} className="text-black"/></div>
          <span className="font-black text-sm uppercase tracking-tighter">OneClick <span className="text-cyan-400">Studio</span></span>
        </div>
        <nav className="flex bg-slate-900/50 rounded-2xl p-1 border border-white/5">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE, ...(user.isAdmin ? [AppMode.ADMIN] : [])].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2 text-[11px] font-black uppercase rounded-xl transition-all ${mode === m ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {mode !== AppMode.ADMIN && (
            <>
              <button onClick={() => github.token ? setBuildStatus('pushing') : alert("Configure GitHub first (3 clicks on logo)")} className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-black uppercase shadow-lg flex items-center gap-2 hover:bg-blue-500 transition-all">
                <Rocket size={16}/> Build APK
              </button>
              <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400">{user.tokens} Tokens</div>
            </>
          )}
          <button onClick={handleLogout} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {mode === AppMode.ADMIN ? (
          <div className="flex-1 flex flex-col bg-[#020617] p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4"><ShieldCheck className="text-cyan-400" size={36}/> Admin <span className="text-cyan-400">Command Center</span></h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">OneClick Studio Management v2.0</p>
               </div>
               <div className="flex gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                  <button onClick={() => setAdminActiveTab('transactions')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminActiveTab === 'transactions' ? 'bg-cyan-500 text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>Payments</button>
                  <button onClick={() => setAdminActiveTab('users')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminActiveTab === 'users' ? 'bg-cyan-500 text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>User Base</button>
                  <button onClick={() => setAdminActiveTab('tickets')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminActiveTab === 'tickets' ? 'bg-cyan-500 text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>Support</button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
               {adminActiveTab === 'transactions' ? (
                 <div className="grid gap-4 pb-20">
                   {pendingTransactions.length === 0 ? (
                      <div className="h-60 flex flex-col items-center justify-center glass-card rounded-[3rem] border-dashed border-white/5 opacity-50"><CheckCircle2 size={40} className="mb-4"/><p className="text-xs font-black uppercase tracking-widest">No pending tasks</p></div>
                   ) : (
                     pendingTransactions.map((tx) => (
                       <div key={tx.id} className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-cyan-500/20 transition-all animate-in fade-in slide-in-from-left-4">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shrink-0 ${tx.payment_method === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'}`}>{tx.payment_method[0].toUpperCase()}</div>
                             <div className="truncate">
                                <h3 className="text-lg font-black text-white truncate">{tx.user_email}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
                                <p className="text-xs font-mono text-cyan-400 mt-1">TrxID: <span className="text-white select-all">{tx.trx_id}</span></p>
                             </div>
                          </div>
                          
                          <div className="text-center md:text-right px-6 border-x border-white/5 min-w-[120px]">
                             <p className="text-2xl font-black text-white">৳{tx.amount}</p>
                             <p className="text-[9px] font-bold text-slate-500 uppercase">Package Amt</p>
                          </div>

                          <div className="relative group/shot shrink-0">
                             {tx.screenshot_url ? (
                                <img 
                                   src={tx.screenshot_url} 
                                   onClick={() => setViewingScreenshot(tx.screenshot_url || null)}
                                   className="w-16 h-20 object-cover rounded-xl border border-white/10 cursor-zoom-in transition-transform group-hover/shot:scale-110 active:scale-95" 
                                   alt="Proof"
                                />
                             ) : (
                                <div className="w-16 h-20 bg-white/5 rounded-xl flex items-center justify-center text-slate-700"><AlertCircle size={20}/></div>
                             )}
                          </div>

                          <div className="flex gap-2">
                             <button onClick={() => handleReject(tx.id)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"><XCircle size={20}/></button>
                             <button onClick={() => handleApprove(tx.id)} className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all active:scale-90"><CheckCircle2 size={20}/></button>
                          </div>
                       </div>
                     ))
                   )}
                 </div>
               ) : adminActiveTab === 'users' ? (
                 <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden animate-in fade-in">
                    <table className="w-full text-left">
                       <thead className="bg-white/5 border-b border-white/5"><tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest"><th className="px-8 py-5">User Account</th><th className="px-8 py-5">Wallet</th><th className="px-8 py-5">Status</th><th className="px-8 py-5">Action</th></tr></thead>
                       <tbody className="divide-y divide-white/5">
                          <tr className="hover:bg-white/5 transition-colors">
                             <td className="px-8 py-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold">U</div><div><p className="font-black text-white">All System Users</p><p className="text-[9px] text-slate-500">Total Clients: 99+</p></div></div></td>
                             <td className="px-8 py-6 text-cyan-400 font-bold">-- Tokens</td>
                             <td className="px-8 py-6"><span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase">Active Access</span></td>
                             <td className="px-8 py-6"><button className="p-2 text-slate-500 hover:text-white"><Settings size={16}/></button></td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full opacity-20"><MessageSquare size={60} className="mb-4"/><p className="text-sm font-black uppercase tracking-widest">No active tickets</p></div>
               )}
            </div>

            {viewingScreenshot && (
              <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                 <button onClick={() => setViewingScreenshot(null)} className="absolute top-10 right-10 p-4 bg-white/10 rounded-full text-white"><X size={32}/></button>
                 <img src={viewingScreenshot} className="max-h-[85vh] w-auto rounded-[2rem] shadow-2xl border border-white/10" alt="Full Proof" />
              </div>
            )}
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-20 overflow-y-auto relative animate-in slide-in-from-top-4">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16"><h1 className="text-6xl font-black mb-4 tracking-tighter">Token <span className="text-cyan-400">Vault</span></h1><p className="text-slate-400 text-lg">প্যাকেজ কিনুন এবং এআই ক্ষমতা বাড়িয়ে নিন</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className={`glass-card p-12 rounded-[4rem] border-white/10 relative transition-all hover:scale-[1.03] group ${pkg.is_popular ? 'border-cyan-500/40 bg-cyan-500/5' : ''}`}>
                      <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:text-cyan-400 transition-colors">{pkg.icon === 'Rocket' ? <Rocket/> : <Cpu/>}</div>
                      <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                      <div className="text-6xl font-black text-white mb-6 mt-8 tracking-tighter">{pkg.tokens} <span className="text-lg opacity-20 ml-1">UNIT</span></div>
                      <button onClick={() => setIsPurchasing(pkg)} className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl font-black text-lg hover:bg-cyan-500 hover:text-black transition-all">৳ {pkg.price}</button>
                    </div>
                  ))}
                </div>
             </div>
             {isPurchasing && (
               <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                 <div className="max-w-md w-full glass-card p-10 rounded-[3rem] border-white/10 animate-in zoom-in-95 shadow-2xl overflow-y-auto max-h-[90vh]">
                    {paymentStep === 'method' ? (
                      <div className="space-y-8">
                        <div className="text-center mb-4"><h2 className="text-3xl font-black">Checkout</h2><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">পেমেন্ট মেথড সিলেক্ট করুন</p></div>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => {setSelectedMethod('bkash'); setPaymentStep('form');}} className="h-24 bg-[#E2136E] rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-105 transition-all text-white font-black uppercase text-xs">bKash</button>
                          <button onClick={() => {setSelectedMethod('nagad'); setPaymentStep('form');}} className="h-24 bg-[#F7941D] rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-105 transition-all text-white font-black uppercase text-xs">Nagad</button>
                        </div>
                        <button onClick={() => setIsPurchasing(null)} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white">Cancel</button>
                      </div>
                    ) : paymentStep === 'form' ? (
                      <form onSubmit={handleSubmitPayment} className="space-y-6">
                        <div className="text-center space-y-2"><h2 className="text-2xl font-black">Verification</h2><p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">টাকা পাঠিয়ে TrxID দিন</p></div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Send Money to (Personal)</p>
                           <p className="text-2xl font-black text-white tracking-widest">017XXXXXXXX</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Transaction ID</label>
                          <input type="text" required value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm font-mono" placeholder="ABC123XYZ" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Upload Screenshot</label>
                          <div className="relative group border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/30 transition-all overflow-hidden">
                             <input type="file" accept="image/*" onChange={e => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setScreenshot(reader.result as string);
                                  reader.readAsDataURL(file);
                               }
                             }} className="absolute inset-0 opacity-0 cursor-pointer" />
                             {screenshot ? <img src={screenshot} className="w-full aspect-video object-cover rounded-lg" alt="Preview"/> : <><Upload className="text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors" size={24}/><p className="text-[9px] text-slate-500 font-bold uppercase">Click to upload image</p></>}
                          </div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-cyan-600 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all">Submit Request</button>
                        <button type="button" onClick={() => setPaymentStep('method')} className="w-full text-slate-500 text-[9px] font-bold uppercase tracking-widest hover:text-white">Back</button>
                      </form>
                    ) : paymentStep === 'processing' ? (
                      <div className="text-center py-20 space-y-8"><Loader2 className="animate-spin mx-auto text-cyan-500" size={40}/><h2 className="text-2xl font-black animate-pulse text-white">Submitting...</h2></div>
                    ) : (
                      <div className="text-center py-20 space-y-8"><div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce"><Check size={50}/></div><h2 className="text-3xl font-black text-white">Request Sent!</h2></div>
                    )}
                 </div>
               </div>
             )}
          </div>
        ) : mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <section className="w-full lg:w-[450px] border-r border-white/5 flex flex-col bg-[#01040f] relative h-full">
              <div className="flex-1 p-8 overflow-y-auto code-scroll space-y-6 pb-40">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[92%] p-5 rounded-3xl shadow-xl ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-900/80 border border-white/5 text-slate-100 rounded-tl-none'}`}><p className="text-[14px] leading-relaxed whitespace-pre-wrap">{m.content}</p></div>
                  </div>
                ))}
              </div>
              <div className="p-8 absolute bottom-0 w-full bg-gradient-to-t from-[#01040f] to-transparent z-10">
                <div className="relative group"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="আপনার প্রজেক্টের পরিবর্তন লিখুন..." className="w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 pr-20 text-sm h-32 outline-none text-white focus:border-cyan-500/50 transition-all resize-none shadow-2xl placeholder:opacity-30" /><button onClick={() => handleSend()} disabled={isGenerating} className="absolute bottom-6 right-6 p-4 bg-cyan-600 rounded-3xl text-white shadow-2xl hover:bg-cyan-500 transition-all active:scale-90 disabled:opacity-50">{isGenerating ? <Loader2 className="animate-spin"/> : <Send size={20}/>}</button></div>
              </div>
            </section>
            <section className="flex-1 flex flex-col bg-[#020617] h-full items-center justify-center p-10 relative">
              <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
              <div className="bg-slate-900 rounded-[4.5rem] h-[780px] w-full max-w-[380px] border-[14px] border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden group"><iframe key={projectFiles['index.html']} srcDoc={projectFiles['index.html'] || ''} title="preview" className="w-full h-full border-none bg-white" /></div>
            </section>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex bg-[#01040f] p-10 overflow-hidden">
            <div className="w-full max-w-5xl mx-auto flex flex-col h-full glass-card rounded-[3rem] border-white/5 overflow-hidden">
              <div className="h-16 border-b border-white/5 flex items-center px-8 gap-4 bg-white/5"><FileJson size={18} className="text-cyan-400"/><span className="text-xs font-black uppercase tracking-widest">Source Explorer</span></div>
              <div className="flex-1 flex overflow-hidden">
                <div className="w-64 border-r border-white/5 p-6 bg-black/20 space-y-2">
                  {Object.keys(projectFiles).map(filename => <button key={filename} className="w-full text-left p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-2 truncate"><FileCode size={14}/> {filename}</button>)}
                </div>
                <div className="flex-1 p-8 overflow-y-auto code-scroll font-mono text-sm text-cyan-100/60 leading-relaxed bg-black/40"><pre className="whitespace-pre-wrap">{Object.values(projectFiles).join('\n\n')}</pre></div>
              </div>
            </div>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="max-w-md w-full glass-card p-16 rounded-[5.5rem] text-center border-white/10 shadow-2xl animate-in fade-in zoom-in-95"><div className="w-36 h-36 rounded-[3.5rem] border-4 border-cyan-500 mx-auto mb-10 p-1.5 bg-[#0f172a] overflow-hidden"><img src={user.avatar_url} className="w-full h-full object-cover" alt="Profile"/></div><h2 className="text-4xl font-black mb-3">{user.name}</h2><p className="text-cyan-400/50 text-sm font-bold mb-12">{user.email}</p><div className="bg-slate-900/80 p-12 rounded-[4rem] border border-white/5"><p className="text-[9px] uppercase font-black opacity-20 mb-2">Neural Tokens</p><p className="text-7xl font-black text-white">{user.tokens}</p></div></div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
