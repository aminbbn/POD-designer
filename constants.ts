import { Product } from './types';

// Raw SVG Paths for Inline Rendering
// This ensures the image always loads as it is part of the DOM
const TSHIRT_PATH = "M 160 80 Q 250 110 340 80 L 420 140 L 440 200 L 380 220 L 380 520 L 120 520 L 120 220 L 60 200 L 80 140 Z";
const TSHIRT_DETAILS = ["M 160 80 Q 250 110 340 80"]; // Collar

const HOODIE_PATH = "M 200 70 C 230 70 270 70 300 70 L 440 140 L 410 220 L 370 190 L 370 530 L 130 530 L 130 190 L 90 220 L 60 140 L 200 70 Z";
const HOODIE_DETAILS = [
  "M 200 70 C 200 30 300 30 300 70", // Hood
  "M 170 420 L 330 420 L 330 530 L 170 530 Z" // Pocket
];

export const PRODUCTS: Product[] = [
  {
    id: 'tshirt-classic',
    name: 'تی‌شرت نخی کلاسیک',
    price: 24.99,
    colors: [
      { id: 'black', name: 'مشکی', hex: '#18181b' }, // Zinc-900 (Matches surface)
      { id: 'white', name: 'سفید', hex: '#ffffff' },
      { id: 'navy', name: 'سرمه‌ای', hex: '#172554' },
      { id: 'heather', name: 'طوسی', hex: '#52525b' },
      { id: 'red', name: 'قرمز', hex: '#b91c1c' },
      { id: 'yellow', name: 'زرد', hex: '#a16207' },
    ],
    views: [
      {
        id: 'front',
        name: 'نمای جلو',
        path: TSHIRT_PATH,
        detailPaths: TSHIRT_DETAILS,
        viewBox: "0 0 500 600",
        printArea: { top: 150, left: 145, width: 210, height: 280 } 
      },
      {
        id: 'back',
        name: 'نمای پشت',
        path: TSHIRT_PATH,
        detailPaths: TSHIRT_DETAILS,
        viewBox: "0 0 500 600",
        printArea: { top: 150, left: 145, width: 210, height: 280 }
      }
    ]
  },
  {
    id: 'hoodie-premium',
    name: 'هودی ممتاز',
    price: 49.99,
    colors: [
      { id: 'black', name: 'مشکی', hex: '#18181b' },
      { id: 'maroon', name: 'زرشکی', hex: '#450a0a' },
      { id: 'forest', name: 'سبز جنگلی', hex: '#022c22' },
    ],
    views: [
      {
        id: 'front',
        name: 'نمای جلو',
        path: HOODIE_PATH,
        detailPaths: HOODIE_DETAILS,
        viewBox: "0 0 500 600",
        printArea: { top: 190, left: 150, width: 200, height: 220 }
      }
    ]
  }
];

export const FONTS = [
  'Vazirmatn',
  'Arial',
  'Times New Roman',
  'Courier New',
  'Tahoma',
  'Yekan',
  'Impact'
];