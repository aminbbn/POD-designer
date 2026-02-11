import React, { useState, useEffect } from 'react';
import { TabType, Product, ProductColor } from '../types';
import { FONTS } from '../constants';
import { generateDesignIdeas } from '../services/geminiService';

// Import New Sub-Panels
import ProductsPanel from './panels/ProductsPanel';
import TextPanel from './panels/TextPanel';
import GraphicsPanel from './panels/GraphicsPanel';
import UploadsPanel from './panels/UploadsPanel';
import AIStudioPanel from './panels/AIStudioPanel';
import LayersPanel from './panels/LayersPanel';
import SettingsPanel from './panels/SettingsPanel';

interface ToolsPanelProps {
  activeTab: TabType;
  products: Product[];
  currentProduct: Product;
  currentProductColor: ProductColor;
  onProductChange: (product: Product) => void;
  onColorChange: (color: ProductColor) => void;
  onAddText: (text: string, font: string, options?: any) => void;
  onAddImage: (url: string) => void;
  onAddGraphic: (pathData: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  layers: any[];
  onDeleteLayer: (index: number) => void;
  onToggleLock: (index: number) => void;
  onToggleVisibility: (index: number) => void;
  selectedObject: any;
  onUpdateObject: (key: string, value: any) => void;
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
  onAddGraphic,
  isGenerating,
  setIsGenerating,
  layers,
  onDeleteLayer,
  onToggleLock,
  onToggleVisibility,
  selectedObject,
  onUpdateObject
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animations when tab changes
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
    // Increased width to 420px (approx 26rem) to fit search + settings
    <div className="w-[420px] bg-surface/95 backdrop-blur-xl border-l border-white/5 h-full overflow-y-auto flex flex-col shadow-2xl relative z-10 text-right transition-[width] duration-300">
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
          {activeTab === TabType.UPLOADS && 'تصاویر خود را بارگذاری کنید'}
          {activeTab === TabType.LAYERS && 'مدیریت لایه‌ها و چیدمان'}
          {activeTab === TabType.SETTINGS && 'پیکربندی و تنظیمات سیستم'}
        </p>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {activeTab === TabType.PRODUCTS && (
          <ProductsPanel 
            products={products}
            currentProduct={currentProduct}
            currentProductColor={currentProductColor}
            onProductChange={onProductChange}
            onColorChange={onColorChange}
          />
        )}

        {activeTab === TabType.TEXT && (
          <TextPanel 
            onAddText={onAddText}
            activeFont={activeFont}
            setActiveFont={setActiveFont}
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
          />
        )}

        {activeTab === TabType.GRAPHICS && (
          <GraphicsPanel 
            onAddImage={onAddImage}
            onAddGraphic={onAddGraphic}
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
          />
        )}

        {activeTab === TabType.UPLOADS && (
          <UploadsPanel 
            onAddImage={onAddImage}
          />
        )}

        {activeTab === TabType.AI_STUDIO && (
          <AIStudioPanel 
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            aiSuggestions={aiSuggestions}
            onAddText={onAddText}
            activeFont={activeFont}
          />
        )}

        {activeTab === TabType.LAYERS && (
          <LayersPanel 
            layers={layers}
            onDeleteLayer={onDeleteLayer}
            onToggleLock={onToggleLock}
            onToggleVisibility={onToggleVisibility}
          />
        )}

        {activeTab === TabType.SETTINGS && (
          <SettingsPanel />
        )}

      </div>
    </div>
  );
};

export default ToolsPanel;