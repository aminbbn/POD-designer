import React, { useEffect, useRef, useState } from 'react';
import { ProductView } from '../types';
import { Maximize } from 'lucide-react';

// --- Sub-Component: Product Backdrop (The T-Shirt/Hoodie) ---
const ProductBackdrop: React.FC<{ view: ProductView; color: string }> = ({ view, color }) => {
  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none transition-all duration-500"
    >
      {view.path ? (
        <svg 
            viewBox={view.viewBox || "0 0 500 600"} 
            width="100%" 
            height="100%" 
            className="overflow-visible"
        >
            {/* 1. Base Shape: Filled with color, but with a CLEAR stroke */}
            <path 
                d={view.path} 
                fill={color}
                stroke="#52525b" // Zinc-600: subtle grey outline
                strokeWidth="1.5"
                strokeLinejoin="round" 
                vectorEffect="non-scaling-stroke"
                className="transition-colors duration-300"
            />

            {/* 2. Details (Collars, Folds): Clear technical lines */}
            {view.detailPaths?.map((d, i) => (
                <path 
                    key={i} 
                    d={d} 
                    fill="none" 
                    stroke="#52525b" // Same technical grey
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ))}
        </svg>
      ) : (
        <img 
            src={view.imageUrl} 
            alt="Product" 
            className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

// --- Sub-Component: Fabric Layer (The Interactive Canvas) ---
interface FabricLayerProps {
  canvasRef: React.MutableRefObject<any>;
  onObjectSelected: (obj: any) => void;
  onSelectionCleared: () => void;
  setLayers: (layers: any[]) => void;
}

const FabricLayer: React.FC<FabricLayerProps> = ({ 
  canvasRef, 
  onObjectSelected, 
  onSelectionCleared, 
  setLayers 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!window.fabric || !containerRef.current || initialized.current) return;
    
    // Create canvas
    const canvas = new window.fabric.Canvas('c', {
      width: 500,
      height: 600,
      backgroundColor: null, // Transparent
      preserveObjectStacking: true,
      selection: true,
    });

    canvasRef.current = canvas;
    initialized.current = true;

    // Event Listeners
    canvas.on('selection:created', (e: any) => {
      if(e.selected && e.selected.length > 0) onObjectSelected(e.selected[0]);
    });
    canvas.on('selection:updated', (e: any) => {
       if(e.selected && e.selected.length > 0) onObjectSelected(e.selected[0]);
    });
    canvas.on('selection:cleared', () => {
      onSelectionCleared();
    });
    
    // Update layers state on modifications
    const updateLayers = () => {
        setLayers(canvas.getObjects());
    }
    
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center" ref={containerRef}>
      <canvas id="c" />
    </div>
  );
};

// --- Main Component: Canvas Area ---
interface CanvasAreaProps {
  canvasRef: React.MutableRefObject<any>; // fabric.Canvas
  currentView: ProductView;
  currentProductColor: string;
  onSelectionCleared: () => void;
  onObjectSelected: (obj: any) => void;
  setLayers: (layers: any[]) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ 
  canvasRef, 
  currentView, 
  currentProductColor,
  onSelectionCleared,
  onObjectSelected,
  setLayers
}) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 4.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.4));
  };

  const handleFit = () => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Product container size is fixed at 500x600
        const contentWidth = 500;
        const contentHeight = 600;
        
        // Calculate scale to fit exactly
        const scaleX = width / contentWidth;
        const scaleY = height / contentHeight;

        // Use 95% of the available space (very tight fit)
        // This ensures maximum visibility while keeping just a tiny margin
        const fitRatio = 0.95; 

        const optimalZoom = Math.min(scaleX, scaleY) * fitRatio;
        
        // Allow zooming up to 4.0x if screen allows, min 0.4x
        setZoom(Math.min(Math.max(optimalZoom, 0.4), 4.0));
    }
  };

  return (
    <div ref={containerRef} className="flex-1 bg-background relative flex items-center justify-center overflow-hidden workspace-grid">
       {/* Product Display Container */}
       <div 
         className="relative transition-all duration-300 animate-fade-in z-10"
         style={{
             width: '500px',
             height: '600px',
             transform: `scale(${zoom})`,
             transformOrigin: 'center center'
         }}
       >
         {/* Layer 1: The Product SVG (Technical Outline) */}
         <ProductBackdrop view={currentView} color={currentProductColor} />
         
         {/* Layer 2: Printable Area Guides (Always Visible Now) */}
         <div 
            className="absolute z-10 pointer-events-none transition-all duration-300"
            style={{
                top: currentView.printArea.top,
                left: currentView.printArea.left,
                width: currentView.printArea.width,
                height: currentView.printArea.height,
            }}
         >
             {/* Dashed Border */}
             <div className="w-full h-full border border-dashed border-white/30 rounded-sm"></div>
             
             {/* Tech Corners (Viewfinder style) */}
             <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-primary/60"></div>
             <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-primary/60"></div>
             <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-primary/60"></div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-primary/60"></div>

             {/* Label */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/50 backdrop-blur rounded border border-white/10">
                 <span className="text-[9px] font-mono text-white/60 tracking-widest uppercase">محدوده چاپ</span>
             </div>
         </div>

         {/* Layer 3: Fabric Canvas (Interactive) */}
         <FabricLayer 
            canvasRef={canvasRef} 
            onObjectSelected={onObjectSelected}
            onSelectionCleared={onSelectionCleared}
            setLayers={setLayers}
         />
       </div>

       {/* Floating Zoom Controls */}
       <div className="absolute bottom-8 left-8 flex flex-col gap-3 z-40">
          <button 
            onClick={handleFit}
            className="w-10 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-all shadow-lg hover:shadow-xl active:scale-95 group relative"
            title="Fit to screen"
          >
             <Maximize size={18} />
             {/* Tooltip */}
             <span className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                جاگیری در صفحه
             </span>
          </button>
          <div className="w-full h-px bg-white/10 my-1"></div>
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
             <span className="text-xl font-light pb-1">+</span>
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
             <span className="text-xl font-light pb-1">-</span>
          </button>
       </div>
    </div>
  );
};

export default CanvasArea;