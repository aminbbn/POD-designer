import React from 'react';
import { Type as TypeIcon, Image as ImageIcon, Trash2, Lock, Eye, EyeOff, Layers } from 'lucide-react';

interface LayersPanelProps {
  layers: any[];
  onDeleteLayer: (index: number) => void;
  onToggleLock: (index: number) => void;
  onToggleVisibility: (index: number) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  onDeleteLayer,
  onToggleLock,
  onToggleVisibility
}) => {
  return (
    <div className="space-y-3 animate-fade-in">
       {layers.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-16 text-slate-600 border-2 border-dashed border-white/5 rounded-2xl">
           <Layers size={40} className="mb-3 opacity-20" />
           <p className="text-sm font-medium">هنوز لایه‌ای وجود ندارد</p>
         </div>
       ) : (
         layers.slice().reverse().map((layer, index) => {
           const actualIndex = layers.length - 1 - index;
           return (
            <div key={actualIndex} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl group hover:bg-white/[0.08] transition-all duration-200">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${layer.type === 'i-text' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {layer.type === 'i-text' ? <TypeIcon size={14} /> : <ImageIcon size={14} />}
                </div>
                <span className="text-xs font-medium text-slate-300 truncate max-w-[100px] text-right group-hover:text-white transition-colors" dir="auto">
                  {layer.text || (layer.type === 'image' ? 'تصویر' : 'لایه')}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onToggleVisibility(actualIndex)} className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                  {layer.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => onToggleLock(actualIndex)} className={`p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors ${layer.lockMovementX ? 'text-primary opacity-100' : ''}`}>
                  <Lock size={14} />
                </button>
                <button onClick={() => onDeleteLayer(actualIndex)} className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
           );
         })
       )}
    </div>
  );
};

export default LayersPanel;