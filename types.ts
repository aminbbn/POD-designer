export enum TabType {
  PRODUCTS = 'PRODUCTS',
  TEXT = 'TEXT',
  GRAPHICS = 'GRAPHICS',
  UPLOADS = 'UPLOADS',
  AI_STUDIO = 'AI_STUDIO',
  LAYERS = 'LAYERS',
  SETTINGS = 'SETTINGS'
}

export interface Product {
  id: string;
  name: string;
  colors: ProductColor[];
  views: ProductView[];
  price: number;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductView {
  id: string;
  name: string;
  imageUrl?: string; // Optional fallback
  path?: string; // Main SVG path d-attribute
  detailPaths?: string[]; // Decorative paths (collars, pockets, etc.)
  viewBox?: string; // SVG viewBox
  printArea: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface DesignLayer {
  id: string;
  type: 'text' | 'image' | 'path' | 'group';
  name: string;
  visible: boolean;
  locked: boolean;
  fabricObject?: any;
}

declare global {
  interface Window {
    fabric: any;
  }
}