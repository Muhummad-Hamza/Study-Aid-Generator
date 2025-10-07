import { GoogleGenAI } from "@google/genai";
import { OutputType } from '../types';

// FIX: Aligned with @google/genai SDK guidelines. Removed the global `genai` variable,
// the custom `getApiKey` function, and `window.process` access which caused TypeScript errors.
// The SDK is now properly imported and the API key is correctly sourced from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyAid = async (text: string, type: OutputType, count: number): Promise<string> => {
    if (text.trim().length === 0) {
        throw new Error("Cannot generate content from empty text.");
    }

    const prompt = `
    Based on the following text, please generate exactly ${count} ${type}. 
    Ensure the output is well-formatted, clear, and directly related to the provided content.

    TEXT:
    ---
    ${text}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (!response || !response.text) {
             throw new Error("Received an empty or invalid response from the AI.");
        }
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content. Please check your API key and network connection.");
    }
};
