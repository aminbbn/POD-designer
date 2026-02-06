import React, { useState, useRef, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ToolsPanel from './components/ToolsPanel';
import CanvasArea from './components/CanvasArea';
import { TabType, Product, ProductColor } from './types';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.PRODUCTS);
  const [currentProduct, setCurrentProduct] = useState<Product>(PRODUCTS[0]);
  const [currentProductColor, setCurrentProductColor] = useState<ProductColor>(PRODUCTS[0].colors[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  const canvasRef = useRef<any>(null); // Fabric canvas reference

  // --- Canvas Actions ---

  const handleAddText = (text: string, fontFamily: string) => {
    if (!canvasRef.current || !window.fabric) return;
    
    const textBox = new window.fabric.IText(text, {
      left: 250, // Center roughly
      top: 300,
      fontFamily: fontFamily,
      fill: '#ffffff',
      fontSize: 40,
      originX: 'center',
      originY: 'center',
      cornerColor: '#3B82F6',
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 10,
      textAlign: 'right', // Default RTL alignment
      direction: 'rtl'
    });

    canvasRef.current.add(textBox);
    canvasRef.current.setActiveObject(textBox);
    setLayers(canvasRef.current.getObjects());
  };

  const handleAddImage = (url: string) => {
     if (!canvasRef.current || !window.fabric) return;
     
     window.fabric.Image.fromURL(url, (img: any) => {
        img.set({
            left: 250,
            top: 300,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',
            originY: 'center',
            cornerColor: '#3B82F6',
            cornerStyle: 'circle',
            transparentCorners: false,
            cornerSize: 10,
        });
        canvasRef.current.add(img);
        canvasRef.current.setActiveObject(img);
        setLayers(canvasRef.current.getObjects());
     }, { crossOrigin: 'anonymous' });
  };

  const handleDeleteLayer = (index: number) => {
      if(!canvasRef.current) return;
      const objects = canvasRef.current.getObjects();
      if(objects[index]) {
          canvasRef.current.remove(objects[index]);
          canvasRef.current.discardActiveObject();
          canvasRef.current.requestRenderAll();
          setLayers(canvasRef.current.getObjects());
      }
  };

  const handleToggleLock = (index: number) => {
      if(!canvasRef.current) return;
      const objects = canvasRef.current.getObjects();
      const obj = objects[index];
      if(obj) {
          const isLocked = !obj.lockMovementX;
          obj.set({
              lockMovementX: isLocked,
              lockMovementY: isLocked,
              lockRotation: isLocked,
              lockScalingX: isLocked,
              lockScalingY: isLocked,
              selectable: !isLocked // If locked, can't select
          });
          canvasRef.current.requestRenderAll();
          setLayers([...objects]); // trigger update
      }
  }

  const handleToggleVisibility = (index: number) => {
      if(!canvasRef.current) return;
      const objects = canvasRef.current.getObjects();
      const obj = objects[index];
      if(obj) {
          obj.visible = !obj.visible;
          if(!obj.visible) canvasRef.current.discardActiveObject();
          canvasRef.current.requestRenderAll();
          setLayers([...objects]);
      }
  }

  const handleExport = () => {
    if(!canvasRef.current) return;
    // Deselect everything to hide handles
    canvasRef.current.discardActiveObject();
    canvasRef.current.requestRenderAll();
    
    const dataURL = canvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High res
    });
    
    const link = document.createElement('a');
    link.download = `smart-design-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans selection:bg-primary/30">
      <TopBar 
        onUndo={() => {}} 
        onRedo={() => {}} 
        onExport={handleExport}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Order of components in DOM matters for Tab traversal, but visual order handled by dir="rtl" */}
        {/* In RTL, first child is on the Right. */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <ToolsPanel 
          activeTab={activeTab}
          products={PRODUCTS}
          currentProduct={currentProduct}
          currentProductColor={currentProductColor}
          onProductChange={(p) => { setCurrentProduct(p); setCurrentProductColor(p.colors[0]); }}
          onColorChange={setCurrentProductColor}
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          layers={layers}
          onDeleteLayer={handleDeleteLayer}
          onToggleLock={handleToggleLock}
          onToggleVisibility={handleToggleVisibility}
        />
        
        <CanvasArea 
          canvasRef={canvasRef}
          currentView={currentProduct.views[0]}
          currentProductColor={currentProductColor.hex}
          onSelectionCleared={() => setSelectedObject(null)}
          onObjectSelected={setSelectedObject}
          setLayers={setLayers}
        />

        {/* Floating Context Property Panel (Left Side in RTL logic, which is the physical Left) */}
        {selectedObject && (
           <div className="absolute left-6 top-24 w-64 bg-surface/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4 animate-fade-in z-50 text-right">
               <div className="flex justify-between items-center mb-3">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ویژگی‌ها</h3>
                   <button onClick={() => canvasRef.current?.discardActiveObject().requestRenderAll()} className="text-slate-500 hover:text-white">&times;</button>
               </div>
               
               {selectedObject.type === 'i-text' && (
                   <div className="space-y-3">
                       <div>
                           <label className="text-xs text-slate-500 block mb-1">رنگ</label>
                           <input 
                            type="color" 
                            className="w-full h-8 rounded cursor-pointer"
                            value={selectedObject.fill as string}
                            onChange={(e) => {
                                selectedObject.set('fill', e.target.value);
                                canvasRef.current?.requestRenderAll();
                            }}
                           />
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                           <button 
                             onClick={() => {
                                 const isBold = selectedObject.fontWeight === 'bold';
                                 selectedObject.set('fontWeight', isBold ? 'normal' : 'bold');
                                 canvasRef.current?.requestRenderAll();
                             }}
                             className="py-1 bg-white/5 hover:bg-white/10 rounded text-xs border border-white/10"
                            >
                               ضخیم
                           </button>
                           <button 
                             onClick={() => {
                                 const isItalic = selectedObject.fontStyle === 'italic';
                                 selectedObject.set('fontStyle', isItalic ? 'normal' : 'italic');
                                 canvasRef.current?.requestRenderAll();
                             }}
                             className="py-1 bg-white/5 hover:bg-white/10 rounded text-xs border border-white/10"
                            >
                               مورب
                           </button>
                       </div>
                   </div>
               )}

               {/* Universal Controls */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between">
                         <label className="text-xs text-slate-500">شفافیت</label>
                         <span className="text-xs text-slate-300">{Math.round((selectedObject.opacity || 1) * 100)}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.1"
                        value={selectedObject.opacity || 1}
                        onChange={(e) => {
                            selectedObject.set('opacity', parseFloat(e.target.value));
                            canvasRef.current?.requestRenderAll();
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>
                
                 <button 
                  onClick={() => {
                      canvasRef.current?.remove(selectedObject);
                      canvasRef.current?.discardActiveObject();
                      setLayers(canvasRef.current?.getObjects() || []);
                  }}
                  className="w-full mt-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded transition-colors"
                 >
                     حذف لایه
                 </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;