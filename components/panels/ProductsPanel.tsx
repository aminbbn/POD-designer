import React from 'react';
import { Product, ProductColor } from '../../types';
import { Check } from 'lucide-react';

interface ProductsPanelProps {
  products: Product[];
  currentProduct: Product;
  currentProductColor: ProductColor;
  onProductChange: (product: Product) => void;
  onColorChange: (color: ProductColor) => void;
}

const ProductsPanel: React.FC<ProductsPanelProps> = ({
  products,
  currentProduct,
  currentProductColor,
  onProductChange,
  onColorChange,
}) => {
  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Product Grid */}
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
              
              {/* Thumbnail Rendering */}
              {product.views[0].path ? (
                  <div className="w-full h-full relative z-0 transition-transform duration-700 ease-out group-hover:scale-110">
                      <svg viewBox={product.views[0].viewBox || "0 0 500 600"} className="w-full h-full drop-shadow-lg">
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
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${currentProductColor.id === color.id ? 'border-primary opacity-100 scale-125' : 'border-white/20 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-110'}`} />
              <div 
                className="w-full h-full rounded-full shadow-inner border border-white/10 ring-1 ring-black/20"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPanel;