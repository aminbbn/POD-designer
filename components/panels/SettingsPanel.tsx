import React from 'react';
import { Moon, Sun, Grid, Monitor } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       
       <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">ظاهر</label>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
             <div className="flex items-center gap-3">
                 <Moon size={18} className="text-slate-400" />
                 <span className="text-sm text-slate-200">حالت تاریک</span>
             </div>
             <div className="w-10 h-5 bg-primary rounded-full relative">
                 <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
             </div>
          </div>
          
           <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
             <div className="flex items-center gap-3">
                 <Sun size={18} className="text-slate-400" />
                 <span className="text-sm text-slate-200">حالت روشن</span>
             </div>
             <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-400">بزودی</span>
          </div>
       </div>

       <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">فضای کار</label>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
             <div className="flex items-center gap-3">
                 <Grid size={18} className="text-slate-400" />
                 <span className="text-sm text-slate-200">نمایش گرید</span>
             </div>
             <div className="w-10 h-5 bg-primary rounded-full relative">
                 <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
             </div>
          </div>
       </div>

       <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-8">
           <div className="flex items-start gap-3">
               <Monitor className="text-blue-400 shrink-0 mt-0.5" size={18} />
               <div>
                   <h4 className="text-xs font-bold text-blue-300 mb-1">نسخه آزمایشی v0.9.2</h4>
                   <p className="text-[10px] text-blue-200/60 leading-relaxed">
                       شما در حال استفاده از آخرین نسخه آزمایشی هستید. بازخورد شما برای ما ارزشمند است.
                   </p>
               </div>
           </div>
       </div>

    </div>
  );
};

export default SettingsPanel;