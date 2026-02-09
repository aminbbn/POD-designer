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

  const handleAddText = (text: string, fontFamily: string, options: any = {}) => {
    if (!canvasRef.current || !window.fabric) return;
    
    const textBox = new window.fabric.IText(text, {
      left: 250, // Center roughly
      top: 300,
      fontFamily: fontFamily,
      fill: options.fill || '#ffffff',
      fontSize: options.fontSize || 40,
      fontWeight: options.fontWeight || 'normal',
      shadow: options.shadow || null,
      stroke: options.stroke || null,
      strokeWidth: options.strokeWidth || 0,
      originX: 'center',
      originY: 'center',
      cornerColor: '#3B82F6',
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 10,
      textAlign: 'right', // Default RTL alignment
      direction: 'rtl',
      // Critical for sharp text rendering & preventing shadow clipping
      objectCaching: false,
      strokeUniform: true,
      // Add padding to ensure selection box clears effects like wide strokes/shadows
      padding: 20,
      ...options
    });

    canvasRef.current.add(textBox);
    canvasRef.current.setActiveObject(textBox);
    setLayers(canvasRef.current.getObjects());
    setSelectedObject(textBox);
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
            padding: 10,
        });
        canvasRef.current.add(img);
        canvasRef.current.setActiveObject(img);
        setLayers(canvasRef.current.getObjects());
     }, { crossOrigin: 'anonymous' });
  };

  const handleUpdateObject = (key: string, value: any) => {
    if (!canvasRef.current || !selectedObject) return;
    
    // Special handling for shadow which might need object construction
    if (key === 'shadow') {
        if (value === null) {
            selectedObject.set('shadow', null);
        } else if (typeof value === 'object') {
            selectedObject.set('shadow', new window.fabric.Shadow(value));
        }
    } else {
        selectedObject.set(key, value);
    }
    
    // Ensure objectCaching stays false to prevent clipping artifacts on updates
    if (selectedObject.type === 'i-text') {
        selectedObject.set('objectCaching', false);
    }
    
    selectedObject.setCoords(); // Ensure coords update for things like positioning
    canvasRef.current.requestRenderAll();
    
    // Force update state to reflect changes in UI
    setSelectedObject(selectedObject); 
    setLayers([...canvasRef.current.getObjects()]);
  };

  const handleDeleteLayer = (index: number) => {
      if(!canvasRef.current) return;
      const objects = canvasRef.current.getObjects();
      if(objects[index]) {
          canvasRef.current.remove(objects[index]);
          canvasRef.current.discardActiveObject();
          canvasRef.current.requestRenderAll();
          setLayers(canvasRef.current.getObjects());
          setSelectedObject(null);
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

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Additional listener for scaling/moving to update UI in real-time
    const updateLayers = () => {
        setLayers(canvas.getObjects());
        // Also force update selected object state if it's the one being modified
        if (canvas.getActiveObject()) {
            setSelectedObject(canvas.getActiveObject());
        }
    }

    canvas.on('object:scaling', updateLayers);
    canvas.on('object:moving', updateLayers);
    canvas.on('object:rotating', updateLayers);

    return () => {
        canvas.off('object:scaling', updateLayers);
        canvas.off('object:moving', updateLayers);
        canvas.off('object:rotating', updateLayers);
    };
  }, []);

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
          selectedObject={selectedObject}
          onUpdateObject={handleUpdateObject}
        />
        
        <CanvasArea 
          canvasRef={canvasRef}
          currentView={currentProduct.views[0]}
          currentProductColor={currentProductColor.hex}
          onSelectionCleared={() => setSelectedObject(null)}
          onObjectSelected={setSelectedObject}
          setLayers={setLayers}
        />
      </div>
    </div>
  );
};

export default App;