
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout
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
    setTimeout(() => {
      onFinish();
    }, 2000);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#0f172a] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-6 md:mb-12 space-y-1 md:space-y-2 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] px-4">
            Welcome to OneClick Studio
          </h1>
          <p className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500 opacity-60">
            Uplink initiated • AI Developer Interface
          </p>
        </div>

        <div 
          onClick={!isScanning ? handleStartAuth : undefined}
          className={`relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-6 md:mb-12`}
        >
          <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint 
            size={isScanning ? 80 : 70} 
            className={`
              ${isScanning ? 'text-cyan-400 scale-110' : 'text-blue-600'} 
              transition-all duration-500 relative z-10 
              drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]
              ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}
            `} 
          />
          {isScanning && (
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_25px_#22d3ee] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>
          )}
        </div>
        <h2 className={`text-xs md:text-xl font-bold tracking-widest uppercase transition-colors duration-500 ${isScanning ? 'text-cyan-400' : 'text-slate-400'}`}>
          {isScanning ? 'Identity Scanning...' : 'Touch sensor to access system'}
        </h2>
      </div>
      <style>{`
        @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
      `}</style>
    </div>
  );
};

const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void, initialUpdateMode?: boolean }> = ({ onLoginSuccess, initialUpdateMode = false }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(initialUpdateMode);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  useEffect(() => {
    const checkRecovery = async () => {
      if (window.location.hash.includes('type=recovery') || window.location.pathname.includes('/update-password')) {
        setIsUpdatingPassword(true);
      }
    };
    checkRecovery();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = isRegister 
        ? await db.signUp(formData.email, formData.password, formData.name)
        : await db.signIn(formData.email, formData.password);
      
      if (res.error) throw res.error;

      if (isRegister) {
        alert("রেজিস্ট্রেশন সফল হয়েছে! অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং অ্যাকাউন্ট কনফার্ম করুন।");
        setIsRegister(false);
        setFormData({ ...formData, password: '' });
        return;
      }

      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData) {
        onLoginSuccess(userData);
      } else {
        throw new Error("ইউজার ডাটা ডাটাবেসে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (error: any) {
      alert(error.message || "Authentication Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return alert("Please enter your email.");
    setIsLoading(true);
    try {
      const { error } = await db.resetPassword(formData.email);
      if (error) throw error;
      alert("A password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.");
      setIsResetting(false);
    } catch (error: any) {
      alert(error.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) return alert("Please enter a new password.");
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    
    setIsLoading(true);
    try {
      const { error } = await db.updatePassword(formData.password);
      if (error) throw error;
      
      await db.signOut();
      alert("Password successfully changed.");
      setIsUpdatingPassword(false);
      window.location.hash = ''; 
      window.location.href = window.location.origin + '/login';
    } catch (error: any) {
      alert(error.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 bg-[#0f172a] text-white relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="relative w-full max-w-[400px] h-[520px] md:h-[580px] [perspective:1200px] animate-in fade-in zoom-in-95 duration-500 mt-2 md:mt-0">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-90deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:translateZ(150px)] md:[transform:translateZ(200px)]">
            {isUpdatingPassword ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">Set New <span className="text-cyan-400">Token</span></h2>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Update your system access credentials</p>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">New Access Token</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Confirm New Token</label>
                    <div className="relative">
                      <Check size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                  <button disabled={isLoading} className="w-full py-4 bg-cyan-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Save New Token'}
                  </button>
                  <button type="button" onClick={() => { setIsUpdatingPassword(false); window.location.hash = ''; }} className="w-full text-xs text-slate-400 font-bold hover:text-white">Cancel Recovery</button>
                </form>
              </div>
            ) : isResetting ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">Recovery <span className="text-cyan-400">Mode</span></h2>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Send reset link to your email</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Account Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="dev@oneclick.studio" />
                    </div>
                  </div>
                  <button disabled={isLoading} className="w-full py-4 bg-cyan-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Send Recovery Link'}
                  </button>
                  <button type="button" onClick={() => setIsResetting(false)} className="w-full text-xs text-slate-400 font-bold hover:text-white flex items-center justify-center gap-2"><ArrowLeft size={14}/> Back to System Login</button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">System <span className="text-cyan-400">Login</span></h2>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Access Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="dev@oneclick.studio" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Token</label>
                      <button type="button" onClick={() => setIsResetting(true)} className="text-[9px] font-bold text-cyan-400 hover:text-white uppercase tracking-wider transition-colors">Forgot Token?</button>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                  <button disabled={isLoading} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Execute Login'}
                  </button>
                </form>
                <button onClick={() => setIsRegister(true)} className="mt-4 text-xs text-cyan-400 font-bold hover:underline">No account? Create system entry</button>
              </div>
            )}
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-center shadow-2xl [transform:rotateY(90deg)_translateZ(150px)] md:[transform:rotateY(90deg)_translateZ(200px)]">
            <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight text-cyan-400">New <span className="text-white">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="Enter full name" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="dev@oneclick.studio" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Create Password</label><input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="••••••••" /></div>
              <button disabled={isLoading} className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Register Now'}
              </button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-slate-400 font-bold hover:text-white">Already registered? Login instead</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [mobileSubMode, setMobileSubMode] = useState<'chat' | 'preview'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<h1 style="color:cyan; text-align:center; padding:50px; font-family:sans-serif;">OneClick Studio Ready</h1>',
    'main.js': '// Logic goes here'
  });
  const [github, setGithub] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [logoClicks, setLogoClicks] = useState(0);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'pushing' | 'building' | 'done'>('idle');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [apkUrl, setApkUrl] = useState<{downloadUrl: string, webUrl: string} | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<Package | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'form' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);

  const gemini = useRef(new GeminiService());
  const githubService = useRef(new GithubService());
  const db = DatabaseService.getInstance();

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => { if (mounted && authLoading) setAuthLoading(false); }, 5000);
    const checkSession = async () => {
      try {
        const session = await db.getCurrentSession();
        if (session?.user) {
          const userData = await db.getUser(session.user.email || '', session.user.id);
          if (userData && mounted) { setUser(userData); if (path === '/login' || path === '/') navigate('/dashboard'); }
        }
      } catch (e) { console.error(e); } finally { if (mounted) { setAuthLoading(false); clearTimeout(safetyTimeout); } }
    };
    checkSession();
    const { data: { subscription } } = db.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const userData = await db.getUser(session.user.email || '', session.user.id);
          if (userData && mounted) setUser(userData);
        } else { setUser(null); }
      } catch (e) { console.error(e); }
    });
    return () => { mounted = false; subscription.unsubscribe(); clearTimeout(safetyTimeout); };
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) { setMode(AppMode.SETTINGS); setLogoClicks(0); }
  }, [logoClicks]);

  useEffect(() => {
    if (user?.isAdmin && path === '/admin') {
      setMode(AppMode.ADMIN);
    }
  }, [user, path]);

  useEffect(() => {
    if (mode === AppMode.SHOP) db.getPackages().then(pkgs => setPackages(pkgs)).catch(() => {});
    if (mode === AppMode.ADMIN && user?.isAdmin) db.getPendingTransactions().then(txs => setPendingTransactions(txs)).catch(() => {});
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

  const handleSend = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() || isGenerating) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsGenerating(true);
    try {
      const res = await gemini.current.generateWebsite(text, projectFiles, messages);
      if (res.files) setProjectFiles(prev => ({ ...prev, ...res.files }));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) {
        const updatedUser = await db.useToken(user.id, user.email);
        if (updatedUser) setUser(updatedUser);
      }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBuildAPK = async () => {
    if (!github.token || !github.owner || !github.repo) return alert("GitHub সেটিংস ঠিক করুন। লোগোতে ৩ বার ক্লিক করুন।");
    setBuildStatus('pushing');
    setBuildLogs(["Initializing deployment..."]);
    try {
      await githubService.current.pushToGithub(github, projectFiles);
      setBuildStatus('building');
      const poll = async () => {
        const details = await githubService.current.getRunDetails(github);
        if (details) {
          const { run } = details;
          if (run.status === 'completed') {
            if (run.conclusion === 'success') {
              const result = await githubService.current.getLatestApk(github);
              if (result) { setApkUrl(result); setBuildStatus('done'); }
            } else setBuildStatus('idle');
            return;
          }
        }
        setTimeout(poll, 10000);
      };
      poll();
    } catch (e: any) { alert(e.message); setBuildStatus('idle'); }
  };

  const handleApprove = async (txId: string) => {
    if (!confirm("Approve?")) return;
    try {
      await db.approveTransaction(txId);
      setPendingTransactions(prev => prev.filter(t => t.id !== txId));
      const userData = await db.getUser(user?.email || '');
      if (userData) setUser(userData);
    } catch (e: any) { alert(e.message); }
  };

  const handleReject = async (txId: string) => {
    if (!confirm("Reject?")) return;
    try {
      await db.rejectTransaction(txId);
      setPendingTransactions(prev => prev.filter(t => t.id !== txId));
    } catch (e: any) { alert(e.message); }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPurchasing || !user || !trxId) return;
    setPaymentStep('processing');
    try {
      await db.submitPaymentRequest(user.id, isPurchasing.id, isPurchasing.price, selectedMethod, trxId, screenshot || undefined);
      setPaymentStep('success');
      setTimeout(() => { setIsPurchasing(null); setPaymentStep('method'); setTrxId(''); setScreenshot(null); }, 3000);
    } catch (e: any) { alert(e.message); setPaymentStep('form'); }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-cyan-500"><Cpu size={40} className="animate-pulse" /></div>;
  if (!user) {
    if (path === '/admin') return <AdminLoginPage onLoginSuccess={setUser} />;
    return path === '/login' ? <AuthPage onLoginSuccess={setUser} /> : <ScanPage onFinish={() => navigate('/login')} />;
  }

  return (
    <div className="h-[100dvh] flex flex-col font-['Hind_Siliguri'] text-slate-100 bg-[#020617] overflow-hidden">
      <header className="h-20 border-b border-white/5 glass-card flex items-center justify-between px-8 z-50">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform"><Cpu size={20} className="text-black"/></div>
          <span className="font-black text-sm uppercase tracking-tighter">OneClick <span className="text-cyan-400">Studio</span></span>
        </div>
        <nav className="flex bg-slate-900/50 rounded-2xl p-1 border border-white/5">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE, ...(user.isAdmin ? [AppMode.ADMIN] : [])].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2 text-[11px] font-black uppercase rounded-xl transition-all ${mode === m ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={handleBuildAPK} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-xs font-black uppercase shadow-lg flex items-center gap-2">
            {buildStatus === 'idle' ? <Rocket size={16}/> : <RefreshCw size={16} className="animate-spin"/>} {buildStatus === 'idle' ? 'Build APK' : 'BUILDING...'}
          </button>
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400">{user.tokens} Tokens</div>
          <button onClick={handleLogout} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {mode === AppMode.SHOP ? (
          <div className="flex-1 p-20 overflow-y-auto animate-in slide-in-from-top-4 relative">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16"><h1 className="text-6xl font-black mb-4 tracking-tighter">Token <span className="text-cyan-400">Vault</span></h1><p className="text-slate-400 text-lg">প্যাকেজ কিনুন এবং এআই ক্ষমতা বাড়িয়ে নিন</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className={`glass-card p-12 rounded-[4rem] border-white/10 relative transition-all hover:scale-[1.03] group ${pkg.is_popular ? 'border-cyan-500/40 bg-cyan-500/5' : ''}`}>
                      {pkg.is_popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-cyan-500 text-black text-[9px] font-black uppercase rounded-full shadow-2xl">Most Popular</div>}
                      <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:text-cyan-400 transition-colors">
                        {pkg.icon === 'Rocket' ? <Rocket/> : pkg.icon === 'Cpu' ? <Cpu/> : <PackageIcon/>}
                      </div>
                      <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                      <div className="text-6xl font-black text-white mb-6 mt-8 tracking-tighter">{pkg.tokens} <span className="text-lg opacity-20 ml-1">UNIT</span></div>
                      <button onClick={() => setIsPurchasing(pkg)} className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl font-black text-lg hover:bg-cyan-500 hover:text-black transition-all active:scale-95">৳ {pkg.price}</button>
                    </div>
                  ))}
                </div>
             </div>
             {isPurchasing && (
               <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                 <div className="max-w-md w-full glass-card p-10 rounded-[3rem] border-white/10 animate-in zoom-in-95 shadow-2xl overflow-y-auto max-h-[90vh]">
                    {paymentStep === 'method' ? (
                      <div className="space-y-8">
                        <div className="text-center"><h2 className="text-3xl font-black mb-2 tracking-tight">Checkout</h2><p className="text-slate-500 text-sm font-bold uppercase tracking-widest">পেমেন্ট মেথড সিলেক্ট করুন</p></div>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => {setSelectedMethod('bkash'); setPaymentStep('form');}} className="h-24 bg-[#E2136E] rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-white font-black uppercase tracking-widest text-sm">bKash</button>
                          <button onClick={() => {setSelectedMethod('nagad'); setPaymentStep('form');}} className="h-24 bg-[#F7941D] rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-white font-black uppercase tracking-widest text-sm">Nagad</button>
                        </div>
                        <button onClick={() => setIsPurchasing(null)} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Cancel Order</button>
                      </div>
                    ) : paymentStep === 'form' ? (
                      <form onSubmit={handleSubmitPayment} className="space-y-6">
                        <div className="text-center space-y-2"><h2 className="text-2xl font-black text-white">Verification</h2><p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">টাকা পাঠিয়ে TrxID দিন</p></div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Send Money to (Personal)</p>
                           <p className="text-2xl font-black text-white tracking-widest">017XXXXXXXX</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Transaction ID</label>
                          <input type="text" required value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm font-mono" placeholder="ABC123XYZ" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Upload Screenshot (Optional)</label>
                          <div className="relative group border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/30 transition-all">
                             <input type="file" accept="image/*" onChange={handleScreenshotChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                             {screenshot ? <img src={screenshot} className="w-full aspect-video object-cover rounded-lg" alt="Preview"/> : <><Upload className="text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors" size={24}/><p className="text-[9px] text-slate-500 font-bold uppercase">Click to upload image</p></>}
                          </div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-cyan-600 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-cyan-500 transition-all active:scale-95">Submit Request</button>
                        <button type="button" onClick={() => setPaymentStep('method')} className="w-full text-slate-500 text-[9px] font-bold uppercase tracking-widest hover:text-white">Back to Methods</button>
                      </form>
                    ) : paymentStep === 'processing' ? (
                      <div className="text-center py-20 space-y-8"><div className="relative w-20 h-20 mx-auto"><div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div><Activity className="absolute inset-0 m-auto text-cyan-500" size={30}/></div><div className="space-y-2"><h2 className="text-2xl font-black animate-pulse text-white">Submitting...</h2></div></div>
                    ) : (
                      <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500"><div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce"><Check size={50}/></div><div className="space-y-2"><h2 className="text-3xl font-black text-white">Request Sent!</h2></div></div>
                    )}
                 </div>
               </div>
             )}
          </div>
        ) : mode === AppMode.ADMIN && user?.isAdmin ? (
          <div className="flex-1 p-20 overflow-y-auto">
             <div className="max-w-6xl mx-auto">
                <div className="mb-12 flex items-center justify-between"><h1 className="text-4xl font-black tracking-tighter flex items-center gap-4"><ShieldCheck className="text-cyan-400" size={32}/> Admin <span className="text-cyan-400">Panel</span></h1><div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold text-slate-400">{pendingTransactions.length} Pending</div></div>
                <div className="grid gap-6">
                   {pendingTransactions.map((tx) => (
                     <div key={tx.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-cyan-500/20 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white ${tx.payment_method === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'}`}>{tx.payment_method[0].toUpperCase()}</div>
                           <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.payment_method} • {new Date(tx.created_at).toLocaleString()}</p><h3 className="text-xl font-black text-white">{tx.user_email}</h3><p className="text-sm font-mono text-cyan-400/70">TrxID: <span className="text-white">{tx.trx_id}</span></p></div>
                        </div>
                        <div className="text-center md:text-right"><p className="text-2xl font-black text-white">৳{tx.amount}</p>{tx.screenshot_url && <button onClick={() => window.open(tx.screenshot_url)} className="mt-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:underline">View Screenshot</button>}</div>
                        <div className="flex gap-3"><button onClick={() => handleReject(tx.id)} className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-black uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all">Reject</button><button onClick={() => handleApprove(tx.id)} className="px-6 py-3 bg-green-500 rounded-xl text-black font-black uppercase text-[10px] shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all">Approve</button></div>
                     </div>
                   ))}
                </div>
             </div>
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
        ) : mode === AppMode.SETTINGS ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="max-w-md w-full glass-card p-12 rounded-[4rem] border-white/10 shadow-2xl animate-in zoom-in-95">
              <div className="text-center mb-10"><h2 className="text-3xl font-black mb-2">GitHub <span className="text-cyan-400">Config</span></h2><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Deployment Pipeline Settings</p></div>
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Personal Token</label><input type="password" value={github.token} onChange={e => setGithub({...github, token: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="ghp_xxxx" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Username</label><input type="text" value={github.owner} onChange={e => setGithub({...github, owner: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="username" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Repository Name</label><input type="text" value={github.repo} onChange={e => setGithub({...github, repo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500/50 transition-all text-sm" placeholder="oneclick-studio-app" /></div>
                <button onClick={() => setMode(AppMode.PREVIEW)} className="w-full py-4 bg-cyan-600 rounded-xl font-black uppercase text-sm mt-4 hover:bg-cyan-500 transition-all">Save & Exit</button>
              </div>
            </div>
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="max-w-md w-full glass-card p-16 rounded-[5.5rem] text-center border-white/10 shadow-2xl"><div className="w-36 h-36 rounded-[3.5rem] border-4 border-cyan-500 mx-auto mb-10 p-1.5 bg-[#0f172a] overflow-hidden"><img src={user.avatar_url} className="w-full h-full object-cover" alt="Profile"/></div><h2 className="text-4xl font-black mb-3">{user.name}</h2><p className="text-cyan-400/50 text-sm font-bold mb-12">{user.email}</p><div className="bg-slate-900/80 p-12 rounded-[4rem] border border-white/5"><p className="text-[9px] uppercase font-black opacity-20 mb-2">Neural Tokens</p><p className="text-7xl font-black text-white">{user.tokens}</p></div></div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
