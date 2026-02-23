import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLoginSuccess();
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-surface/50 hover:bg-surface px-4 py-2 rounded-xl border border-white/5"
      >
        <ArrowRight size={18} />
        <span className="text-sm font-medium">بازگشت</span>
      </button>

      <div className="w-full max-w-md p-8 rounded-3xl bg-surface border border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5 shadow-inner group">
            <ShieldCheck size={40} className="text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display">پنل مدیریت</h2>
          <p className="text-zinc-400 text-sm">لطفاً برای دسترسی به پنل وارد شوید</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6 relative z-10" dir="rtl">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 mr-1">نام کاربری</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <User size={18} className="text-zinc-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 mr-1">رمز عبور</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-zinc-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-medium py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>ورود به پنل</span>
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
