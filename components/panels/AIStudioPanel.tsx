import React from 'react';
import { Sparkles, Loader2, Wand2, Plus } from 'lucide-react';

interface AIStudioPanelProps {
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
  aiSuggestions: string[];
  onAddText: (text: string, font: string) => void;
  activeFont: string;
}

const AIStudioPanel: React.FC<AIStudioPanelProps> = ({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  handleGenerate,
  aiSuggestions,
  onAddText,
  activeFont
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="bg-black/40 backdrop-blur-sm p-5 rounded-xl relative z-10">
          <h3 className="flex items-center justify-end gap-2 text-primary font-bold mb-3 text-lg">
            ایده‌پرداز هوشمند
            <Sparkles size={18} className="text-primary animate-pulse" />
          </h3>
          <p className="text-xs text-slate-300 mb-5 leading-relaxed opacity-80">
            حس و حال طرح مورد نظر خود را توصیف کنید تا هوش مصنوعی ما شعارها و مفاهیم جذابی برای شما بسازد.
          </p>
          
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="مثال: طرح نستعلیق مدرن، مینیمال، طبیعت، شعر حافظ..."
            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none h-28 mb-4 transition-all"
          />
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !aiPrompt}
            className="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <span>تولید ایده</span>
                <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {aiSuggestions.length > 0 && (
        <div className="space-y-3 animate-slide-up">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">پیشنهادات هوشمند</label>
          {aiSuggestions.map((text, idx) => (
            <div 
              key={idx}
              className="p-4 bg-white/5 border border-white/5 hover:border-primary/40 rounded-xl cursor-pointer transition-all duration-300 group hover:bg-white/10 hover:shadow-xl hover:-translate-x-1"
              onClick={() => onAddText(text, activeFont)}
            >
               <div className="flex items-center justify-between">
                 <Plus size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                 <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{text}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIStudioPanel;