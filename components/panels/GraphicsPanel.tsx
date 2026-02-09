import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';

interface GraphicsPanelProps {
  onAddImage: (url: string) => void;
}

const GraphicsPanel: React.FC<GraphicsPanelProps> = ({ onAddImage }) => {
  // Mock image seeds for demonstration
  const imageSeeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative group">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="جستجوی گرافیک..." 
          className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder-slate-600"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
         {imageSeeds.map((i) => (
           <button 
            key={i}
            className="aspect-square bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 group relative overflow-hidden"
            onClick={() => onAddImage(`https://picsum.photos/seed/${i + 100}/200`)}
           >
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <ImageIcon size={22} className="text-slate-600 group-hover:text-slate-200 group-hover:scale-110 transition-all duration-300" />
           </button>
         ))}
      </div>
      
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-xs text-primary/60">کتابخانه برداری پرمیوم به‌زودی اضافه می‌شود</p>
      </div>
    </div>
  );
};

export default GraphicsPanel;