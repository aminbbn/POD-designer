import React, { useState, useEffect } from 'react';
import { TabType, Product, ProductColor } from '../types';
import { FONTS } from '../constants';
import { Search, Loader2, Wand2, Plus, Type as TypeIcon, Image as ImageIcon, Trash2, Lock, Eye, EyeOff, Sparkles, Layers, Check } from 'lucide-react';
import { generateDesignIdeas } from '../services/geminiService';

interface ToolsPanelProps {
  activeTab: TabType;
  products: Product[];
  currentProduct: Product;
  currentProductColor: ProductColor;
  onProductChange: (product: Product) => void;
  onColorChange: (color: ProductColor) => void;
  onAddText: (text: string, font: string) => void;
  onAddImage: (url: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  layers: any[]; // Simulating fabric objects for now
  onDeleteLayer: (index: number) => void;
  onToggleLock: (index: number) => void;
  onToggleVisibility: (index: number) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  activeTab,
  products,
  currentProduct,
  currentProductColor,
  onProductChange,
  onColorChange,
  onAddText,
  onAddImage,
  isGenerating,
  setIsGenerating,
  layers,
  onDeleteLayer,
  onToggleLock,
  onToggleVisibility
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [isVisible, setIsVisible] = useState(false);

  // Simple effect to trigger entrance animations when tab changes
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const suggestions = await generateDesignIdeas(aiPrompt, currentProduct.name);
      setAiSuggestions(suggestions);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-surface/95 backdrop-blur-xl border-l border-white/5 h-full overflow-y-auto flex flex-col shadow-2xl relative z-10 text-right">
      {/* Header Section */}
      <div className="p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <h2 className="text-xl font-display font-black text-white tracking-tight flex items-center justify-end gap-2">
          {activeTab === TabType.PRODUCTS && 'انتخاب محصول'}
          {activeTab === TabType.TEXT && 'افزودن متن'}
          {activeTab === TabType.GRAPHICS && 'کتابخانه گرافیک'}
          {activeTab === TabType.UPLOADS && 'آپلود فایل'}
          {activeTab === TabType.AI_STUDIO && 'استودیو هوش مصنوعی'}
          {activeTab === TabType.LAYERS && 'لایه‌ها'}
          {activeTab === TabType.SETTINGS && 'تنظیمات'}
        </h2>
        <p className="text-[11px] font-medium text-slate-400 mt-1 opacity-80 leading-relaxed">
          {activeTab === TabType.PRODUCTS && 'از کاتالوگ ممتاز ما انتخاب کنید'}
          {activeTab === TabType.TEXT && 'تایپوگرافی و شعارهای خلاقانه'}
          {activeTab === TabType.AI_STUDIO && 'طراحی هوشمند با Gemini 2.0'}
          {activeTab === TabType.GRAPHICS && 'مجموعه اشکال و آیکون‌های برداری'}
          {activeTab === TabType.LAYERS && 'مدیریت لایه‌ها و چیدمان'}
          {activeTab === TabType.SETTINGS && 'پیکربندی و تنظیمات سیستم'}
        </p>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 space-y-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* PRODUCTS TAB */}
        {activeTab === TabType.PRODUCTS && (
          <div className="space-y-8 pb-10">
            <div className="grid grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  onClick={() => onProductChange(product)}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`
                    group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ease-out
                    ${currentProduct.id === product.id 
                      ? 'ring-2 ring-primary shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] scale-[1.02] z-10' 
                      : 'border border-white/5 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 bg-white/[0.02]'
                    }
                  `}
                >
                  {/* Selected Badge */}
                  <div className={`
                    absolute top-3 right-3 z-30 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-500
                    ${currentProduct.id === product.id ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-90'}
                  `}>
                    <Check size={14} strokeWidth={3} />
                  </div>

                  {/* Image Container */}
                  <div className={`
                    aspect-[3/4] relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-500
                    ${currentProduct.id === product.id ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' : 'bg-[#121212]'}
                  `}>
                    
                    {/* Thumbnail Rendering - Technical Flat */}
                    {product.views[0].path ? (
                        <div className="w-full h-full relative z-0 transition-transform duration-700 ease-out group-hover:scale-110">
                            <svg viewBox={product.views[0].viewBox || "0 0 500 600"} className="w-full h-full drop-shadow-lg">
                                {/* Base Shape */}
                                <path 
                                    d={product.views[0].path} 
                                    fill={currentProduct.id === product.id ? currentProduct.colors[0].hex : '#18181b'} 
                                    stroke="#52525b"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    ) : (
                        <img 
                          src={product.views[0].imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    )}
                    
                    {/* Floating Price Tag */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg z-20">
                      <p className="text-[10px] font-bold text-white font-mono tracking-tight" dir="ltr">${product.price}</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`
                    p-3 border-t relative transition-colors duration-300
                    ${currentProduct.id === product.id ? 'bg-surface border-primary/20' : 'bg-surface border-white/5 group-hover:bg-[#1f1f22]'}
                  `}>
                    <h3 className={`text-xs font-bold truncate mb-1 transition-colors ${currentProduct.id === product.id ? 'text-primary' : 'text-slate-200 group-hover:text-white'}`}>
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-2">
                       {/* Color Dots Preview */}
                       <div className="flex -space-x-1 space-x-reverse">
                          {product.colors.slice(0, 3).map(c => (
                            <div key={c.id} className="w-2 h-2 rounded-full border border-black/50" style={{ backgroundColor: c.hex }} />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Colors Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{currentProductColor.name}</span>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">پالت رنگ</label>
              </div>
              
              <div className="flex flex-wrap justify-end gap-3">
                {currentProduct.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => onColorChange(color)}
                    className={`
                      group relative w-9 h-9 rounded-full transition-all duration-300 ease-out flex items-center justify-center
                      ${currentProductColor.id === color.id ? 'scale-110 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                    `}
                  >
                    {/* Active Indicator Ring */}
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${currentProductColor.id === color.id ? 'border-primary opacity-100 scale-125' : 'border-white/20 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-110'}`} />
                    
                    {/* The Color */}
                    <div 
                      className="w-full h-full rounded-full shadow-inner border border-white/10 ring-1 ring-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === TabType.TEXT && (
          <div className="space-y-8">
            <div className="space-y-3">
               <button 
                onClick={() => onAddText('عنوان اصلی', activeFont)}
                className="group w-full h-14 bg-gradient-to-r from-white/5 to-transparent hover:from-primary/20 hover:to-primary/5 border border-white/10 hover:border-primary/30 rounded-xl flex items-center justify-between px-4 transition-all duration-300"
              >
                <Plus size={18} className="text-slate-500 group-hover:text-primary transition-colors" />
                <span className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">افزودن عنوان</span>
              </button>
              
              <button 
                onClick={() => onAddText('زیرعنوان', activeFont)}
                className="group w-full h-12 bg-white/[0.02] hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between px-4 transition-all duration-300"
              >
                <Plus size={16} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                <span className="font-medium text-sm text-slate-400 group-hover:text-slate-200 transition-colors">افزودن زیرعنوان</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">فونت‌ها</label>
              <div className="grid grid-cols-1 gap-2">
                {FONTS.map(font => (
                  <button
                    key={font}
                    onClick={() => setActiveFont(font)}
                    className={`
                      relative px-4 py-3 text-right rounded-xl text-sm transition-all duration-300 flex items-center justify-between group overflow-hidden
                      ${activeFont === font 
                        ? 'shadow-lg shadow-primary/20 ring-1 ring-primary/50' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                      }
                    `}
                  >
                    {/* Active Gradient Background */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-l from-primary to-blue-600 transition-opacity duration-300
                      ${activeFont === font ? 'opacity-100' : 'opacity-0'}
                    `}/>

                    <span style={{ fontFamily: font }} className={`
                      relative z-10 text-base transition-colors duration-300
                      ${activeFont === font ? 'text-white font-bold' : ''}
                    `}>
                      {font}
                    </span>

                    {/* Active Checkmark */}
                    <div className={`relative z-10 transition-all duration-300 ${activeFont === font ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                      <Check size={16} className="text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI STUDIO TAB */}
        {activeTab === TabType.AI_STUDIO && (
          <div className="space-y-6">
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
              <div className="space-y-3 animate-fade-in">
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
        )}

        {/* GRAPHICS TAB */}
        {activeTab === TabType.GRAPHICS && (
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="جستجوی گرافیک..." 
                className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder-slate-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
               {[1,2,3,4,5,6,7,8,9].map((i) => (
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
              <p className="text-xs text-primary/60">قابلیت کشیدن و رها کردن به‌زودی اضافه می‌شود</p>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === TabType.LAYERS && (
          <div className="space-y-3">
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
        )}

      </div>
    </div>
  );
};

export default ToolsPanel;