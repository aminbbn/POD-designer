import React from 'react';
import { Shirt, Type, Image as ImageIcon, Sparkles, Layers, Settings, Upload } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: TabType.PRODUCTS, icon: Shirt, label: 'محصولات' },
    { id: TabType.TEXT, icon: Type, label: 'متن' },
    { id: TabType.GRAPHICS, icon: ImageIcon, label: 'گرافیک' },
    { id: TabType.UPLOADS, icon: Upload, label: 'آپلود' },
    { id: TabType.AI_STUDIO, icon: Sparkles, label: 'هوش مصنوعی', special: true },
    { id: TabType.LAYERS, icon: Layers, label: 'لایه‌ها' },
    { id: TabType.SETTINGS, icon: Settings, label: 'تنظیمات' },
  ];

  return (
    <div className="w-20 bg-surface border-l border-white/5 flex flex-col items-center py-6 z-20 h-full shadow-2xl">
      <div className="mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xl">ط</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 w-full px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-b from-primary/20 to-primary/5 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon 
                size={24} 
                className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[9px] font-medium tracking-wide opacity-80">{tab.label}</span>
              
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;