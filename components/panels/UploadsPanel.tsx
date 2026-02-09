import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface UploadsPanelProps {
  onAddImage: (url: string) => void;
}

const UploadsPanel: React.FC<UploadsPanelProps> = ({ onAddImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        if (f.target?.result) {
          onAddImage(f.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05] group"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
           <UploadCloud size={32} className="text-slate-500 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">آپلود تصویر</h3>
        <p className="text-xs text-slate-400">فرمت‌های JPG, PNG, SVG پشتیبانی می‌شوند</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">آپلودهای اخیر</label>
        <div className="grid grid-cols-2 gap-3">
             {/* Placeholders for recent uploads */}
             <div className="aspect-square bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 text-xs">
                خالی
             </div>
             <div className="aspect-square bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 text-xs">
                خالی
             </div>
        </div>
      </div>
    </div>
  );
};

export default UploadsPanel;