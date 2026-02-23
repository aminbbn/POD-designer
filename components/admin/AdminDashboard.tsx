import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Activity,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Download,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToEditor: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToEditor, products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'reports' | 'settings'>('dashboard');

  return (
    <div className="flex h-screen bg-background text-white font-sans overflow-hidden" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-l border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            پنل ادمین
          </h1>
          <p className="text-xs text-zinc-500 mt-1">مدیریت پلتفرم طراحی</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="داشبورد" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={ShoppingBag} label="محصولات پایه" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <NavItem icon={Users} label="کاربران" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={Activity} label="گزارش‌ها" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={Settings} label="تنظیمات" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={onBackToEditor}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ArrowRight size={20} />
            <span>بازگشت به ویرایشگر</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">خوش آمدید، ادمین 👋</h2>
            <p className="text-zinc-400">گزارش عملکرد امروز پلتفرم طراحی شما</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              A
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="طرح‌های ایجاد شده" 
                value="۱,۲۸۴" 
                trend="+۱۲٪" 
                icon={ImageIcon} 
                color="primary"
              />
              <StatCard 
                title="خروجی‌های گرفته شده" 
                value="۸۵۶" 
                trend="+۵٪" 
                icon={Download} 
                color="secondary"
              />
              <StatCard 
                title="کاربران فعال امروز" 
                value="۳۴۲" 
                trend="+۱۸٪" 
                icon={Users} 
                color="accent"
              />
              <StatCard 
                title="میانگین زمان استفاده" 
                value="۱۴ دقیقه" 
                trend="+۲٪" 
                icon={Clock} 
                color="primary"
              />
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-surface border border-white/5 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                فعالیت‌های اخیر کاربران
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-zinc-400">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <p className="text-white font-medium">طراحی جدید روی {products[0]?.name || 'محصول'}</p>
                        <p className="text-zinc-500 text-xs">توسط کاربر #{1020+i} • {i*2} دقیقه پیش</p>
                      </div>
                    </div>
                    <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-lg">خروجی گرفته شد</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">مدیریت محصولات پایه</h3>
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                <Plus size={18} />
                افزودن محصول جدید
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 bg-background rounded-xl flex items-center justify-center p-4 border border-white/5">
                    {product.views[0]?.path ? (
                      <svg viewBox={product.views[0].viewBox || "0 0 500 600"} className="w-full h-full text-zinc-700">
                        <path d={product.views[0].path} fill="currentColor" />
                      </svg>
                    ) : (
                      <ShoppingBag size={40} className="text-zinc-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-white">{product.name}</h4>
                        <p className="text-zinc-400 text-sm">نوع: {product.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-background p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">رنگ‌های موجود</p>
                        <div className="flex gap-1 flex-wrap">
                          {product.colors.map(c => (
                            <div key={c.id} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                        </div>
                      </div>
                      <div className="bg-background p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">سایزها</p>
                        <p className="text-sm text-white font-medium">{product.sizes?.join(', ') || 'نامشخص'}</p>
                      </div>
                      <div className="bg-background p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">تعداد نماها</p>
                        <p className="text-sm text-white font-medium">{product.views.length} نما</p>
                      </div>
                      <div className="bg-background p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1">ابعاد ناحیه چاپ (جلو)</p>
                        <p className="text-sm text-white font-medium" dir="ltr">
                          {product.views[0]?.printArea.width}x{product.views[0]?.printArea.height}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
      ${active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => {
  const colors: any = {
    primary: 'from-primary/20 to-primary/5 text-primary border-primary/20',
    secondary: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20',
    accent: 'from-accent/20 to-accent/5 text-accent border-accent/20',
  };

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-br ${colors[color]} border backdrop-blur-sm relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl bg-white/5 backdrop-blur-md`}>
            <Icon size={24} />
          </div>
          <span className="flex items-center gap-1 text-primary text-sm font-medium bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
            <TrendingUp size={14} />
            {trend}
          </span>
        </div>
        <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white font-mono">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
