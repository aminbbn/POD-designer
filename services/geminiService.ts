import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDesignIdeas = async (prompt: string, productType: string): Promise<string[]> => {
  try {
    const fullPrompt = `
      You are a creative director for a streetwear fashion brand in Iran.
      The user wants design ideas for a ${productType}.
      Theme/Keywords: "${prompt}".
      
      Provide 3 short, catchy, and creative slogans or design concepts in Persian (Farsi).
      Keep them under 10 words each.
      Format: Just the slogans, one per line. No numbering.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });
    
    if (response.text) {
      return response.text.split('\n').filter(line => line.trim().length > 0);
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["خطا در تولید ایده. دوباره تلاش کنید."];
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