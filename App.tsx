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

  const getSafeZoneConfig = (objWidth: number, objHeight: number) => {
      const printArea = currentProduct.views[0].printArea;
      
      // Target size: 60% of the print area dimensions for a nice initial fit
      const targetWidth = printArea.width * 0.6;
      const targetHeight = printArea.height * 0.6;

      // Calculate scale to fit within target box
      const scaleX = targetWidth / objWidth;
      const scaleY = targetHeight / objHeight;
      const scale = Math.min(scaleX, scaleY);

      return {
          left: printArea.left + (printArea.width / 2),
          top: printArea.top + (printArea.height / 2),
          scale: scale
      };
  };

  const handleAddText = (text: string, fontFamily: string, options: any = {}) => {
    if (!canvasRef.current || !window.fabric) return;
    
    const printArea = currentProduct.views[0].printArea;
    const centerX = printArea.left + (printArea.width / 2);
    const centerY = printArea.top + (printArea.height / 2);
    
    const textBox = new window.fabric.IText(text, {
      left: centerX, 
      top: centerY,
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
      textAlign: 'right',
      direction: 'rtl',
      strokeUniform: true,
      padding: 20,
      objectCaching: false, // Important for immediate render
      ...options
    });

    canvasRef.current.add(textBox);
    canvasRef.current.setActiveObject(textBox);
  };

  const handleAddImage = (url: string) => {
     if (!canvasRef.current || !window.fabric) return;

     // Check if it's an SVG (either by extension or Data URL mimetype)
     const isSvg = url.endsWith('.svg') || url.includes('image/svg+xml');

     if (isSvg) {
        window.fabric.loadSVGFromURL(url, (objects: any[], options: any) => {
            if (!objects || objects.length === 0) return;
            
            // Group the SVG objects
            const svgGroup = window.fabric.util.groupSVGElements(objects, options);
            
            const { left, top, scale } = getSafeZoneConfig(svgGroup.width || 100, svgGroup.height || 100);

            svgGroup.set({
                left: left,
                top: top,
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                cornerColor: '#3B82F6',
                cornerStyle: 'circle',
                transparentCorners: false,
                cornerSize: 10,
                padding: 10,
                objectCaching: false,
                fill: objects[0].fill || '#000000' // Try to inherit fill or default
            });

            // Ensure all internal paths inherit properties if needed, or are adjustable
            // This enables "Fill" color to work on the whole group if we target it
            
            canvasRef.current.add(svgGroup);
            canvasRef.current.setActiveObject(svgGroup);
            canvasRef.current.requestRenderAll();
        });
     } else {
        // Handle Raster Images (PNG, JPG)
        window.fabric.Image.fromURL(url, (img: any) => {
            const { left, top, scale } = getSafeZoneConfig(img.width, img.height);

            img.set({
                left: left,
                top: top,
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                cornerColor: '#3B82F6',
                cornerStyle: 'circle',
                transparentCorners: false,
                cornerSize: 10,
                padding: 10,
                objectCaching: false 
            });
            canvasRef.current.add(img);
            canvasRef.current.setActiveObject(img);
            canvasRef.current.requestRenderAll();
        }, { crossOrigin: 'anonymous' });
     }
  };

  const handleAddGraphic = (pathData: string) => {
    if (!canvasRef.current || !window.fabric) return;

    const path = new window.fabric.Path(pathData, {
      fill: '#ffffff',
      originX: 'center',
      originY: 'center',
      cornerColor: '#3B82F6',
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 10,
      padding: 10,
      objectCaching: false
    });

    const { left, top, scale } = getSafeZoneConfig(path.width || 100, path.height || 100);

    path.set({
        left: left,
        top: top,
        scaleX: scale,
        scaleY: scale
    });

    canvasRef.current.add(path);
    canvasRef.current.setActiveObject(path);
  };

  const handleUpdateObject = (key: string, value: any) => {
    if (!canvasRef.current || !selectedObject) return;
    
    // Special handling for shadow
    if (key === 'shadow') {
        if (value === null) {
            selectedObject.set('shadow', null);
        } else if (typeof value === 'object') {
            selectedObject.set('shadow', new window.fabric.Shadow(value));
        }
    } else if (key === 'fill' && selectedObject.type === 'group') {
        // If it's an SVG group, we might need to update all child paths to change color effectively
        // or just set fill on the group if the paths use 'currentColor' or undefined.
        // But usually, iterating is safer for complex SVGs to force single color.
        selectedObject.set('fill', value);
        selectedObject._objects?.forEach((obj: any) => {
             obj.set('fill', value);
        });
    } else {
        selectedObject.set(key, value);
    }
    
    // CRITICAL: Disable caching and mark dirty to ensure visual updates (tint, stroke, fill) happen instantly
    selectedObject.set({
        objectCaching: false,
        dirty: true
    });

    selectedObject.setCoords(); 
    canvasRef.current.requestRenderAll();
    
    setLayers([...canvasRef.current.getObjects()]); 
    setSelectedObject(canvasRef.current.getActiveObject());
  };

  const handleDeleteLayer = (index: number) => {
      if(!canvasRef.current) return;
      const objects = canvasRef.current.getObjects();
      if(objects[index]) {
          canvasRef.current.remove(objects[index]);
          canvasRef.current.discardActiveObject();
          canvasRef.current.requestRenderAll();
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
              selectable: !isLocked 
          });
          canvasRef.current.requestRenderAll();
          setLayers([...objects]);
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
    canvasRef.current.discardActiveObject();
    canvasRef.current.requestRenderAll();
    
    const dataURL = canvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2
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
    
    const handleObjectAdded = (e: any) => {
        if (e.target) {
            e.target.set('objectCaching', false);
        }
        setLayers(canvas.getObjects());
    };

    const updateLayers = () => {
        setLayers(canvas.getObjects());
        if (canvas.getActiveObject()) {
            setSelectedObject(canvas.getActiveObject());
        }
    };

    const handleSelectionCleared = () => {
        setSelectedObject(null);
    }

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('object:scaling', updateLayers);
    canvas.on('object:moving', updateLayers);
    canvas.on('object:rotating', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:updated', updateLayers);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:removed', updateLayers);
        canvas.off('object:modified', updateLayers);
        canvas.off('object:scaling', updateLayers);
        canvas.off('object:moving', updateLayers);
        canvas.off('object:rotating', updateLayers);
        canvas.off('selection:created', updateLayers);
        canvas.off('selection:updated', updateLayers);
        canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!canvasRef.current) return;
        const activeObjects = canvasRef.current.getActiveObjects();
        if (activeObjects && activeObjects.length > 0) {
          canvasRef.current.discardActiveObject();
          activeObjects.forEach((obj: any) => {
            canvasRef.current.remove(obj);
          });
          canvasRef.current.requestRenderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans selection:bg-primary/30">
      <TopBar 
        onUndo={() => {}} 
        onRedo={() => {}} 
        onExport={handleExport}
      />
      
      <div className="flex flex-1 overflow-hidden">
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
          onAddGraphic={handleAddGraphic}
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