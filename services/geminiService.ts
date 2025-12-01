import { GoogleGenAI, Type } from "@google/genai";
import { DEFAULT_MODEL } from "../constants";

interface PredictionResult {
  nextMultiplier: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export const getPrediction = async (
  history: number[],
  modelName: string = DEFAULT_MODEL
): Promise<PredictionResult> => {
  try {
    // Initialize AI client with the latest environment variable API Key
    // This supports dynamic key updates via window.aistudio.openSelectKey()
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // LATENCY OPTIMIZATION: 
    // 1. Minimized prompt size by moving context to systemInstruction.
    // 2. Disabled "Thinking" (thinkingBudget: 0) to prevent reasoning pauses.
    // 3. Capped maxOutputTokens to 150 to force concise generation.
    // 4. Requested extremely short reasoning in system instruction.
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `History: ${JSON.stringify(history)}`,
      config: {
        systemInstruction: "Analyze crash patterns. Predict next multiplier. Return JSON. Reasoning must be extremely brief (under 10 words).",
        responseMimeType: "application/json",
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 0 }, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextMultiplier: { type: Type.NUMBER },
            confidence: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["nextMultiplier", "confidence", "reasoning"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    return JSON.parse(jsonText) as PredictionResult;
  } catch (error) {
    console.error("Prediction Error:", error);
    return {
      nextMultiplier: 0,
      confidence: "Low",
      reasoning: "Prediction timeout or service error.",
    };
  }
};