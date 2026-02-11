
const PIXABAY_API_KEY = '4170726-8027fcb24a3f4a2292e6578f1';
const API_URL = 'https://pixabay.com/api/';

export interface PixabayImage {
  id: number;
  previewURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

export const searchPixabayImages = async (query: string): Promise<PixabayImage[]> => {
  try {
    // Default to vector/illustration for better print results
    const q = query.trim() ? encodeURIComponent(query) : 'vector';
    const url = `${API_URL}?key=${PIXABAY_API_KEY}&q=${q}&image_type=vector&safesearch=true&per_page=20`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Pixabay API Error');
    
    const data = await response.json();
    return data.hits || [];
  } catch (err) {
    console.error("Pixabay Search Error:", err);
    return [];
  }
};
