import { GoogleGenAI, Type } from "@google/genai";
import { DesignConcept } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDesignConcepts = async (prompt: string, productType: string): Promise<DesignConcept[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a smart creative director for a T-Shirt printing business. 
        Create 3 distinct, printable design concepts based on the user's theme: "${prompt}".
        Product Context: ${productType}.
        
        For each concept, provide:
        1. A catchy Title.
        2. A short Description.
        3. A list of Elements (Text and Images).

        CRITICAL IMAGE SEARCH RULES (The search engine is limited):
        - The 'query' field for images MUST be extremely simple.
        - Use ONLY 1 single noun if possible (e.g., "lion", "skull", "flower", "car").
        - Maximum 2 words (e.g., "palm tree", "geometric wolf").
        - NEVER use adjectives like "detailed", "realistic", "neon", "vintage" in the query.
        - NEVER use complex phrases like "cat driving a car". Just search for "cat".
        
        Text Rules:
        - If the prompt is in Persian/Arabic, use Persian text content.
        - Fonts: ['Vazirmatn', 'Montserrat', 'Oswald', 'Playfair Display', 'Dancing Script', 'Morabba', 'IranSansX'].
        
        Layout Rules:
        - yOffset: Distance from center (-150 to +150).
        - Use contrasting colors.
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['text', 'image'] },
                    // Text Properties
                    content: { type: Type.STRING },
                    fontFamily: { type: Type.STRING },
                    fontSize: { type: Type.NUMBER },
                    fontWeight: { type: Type.STRING },
                    // Image Properties
                    query: { type: Type.STRING },
                    // Common
                    fill: { type: Type.STRING },
                    yOffset: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DesignConcept[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const analyzeDesignComplexity = async (layerCount: number, colors: number): Promise<string> => {
     try {
    const fullPrompt = `
      Analyze the complexity of a print-on-demand design with ${layerCount} layers and approximately ${colors} distinct colors.
      Give a 1 sentence assessment of printability (Easy, Medium, Hard) and a tip. Respond in Persian (Farsi).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });
    
    return response.text || "تحلیل در دسترس نیست.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "امکان تحلیل طرح وجود ندارد.";
  }
}