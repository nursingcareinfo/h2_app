import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateUserAgreement(role: "nurse" | "patient") {
  if (!ai) return "AI service not available.";

  const prompt = `Draft a professional "User Agreement" for ${role}s on a home care staffing platform in Karachi, Pakistan. 
  The agreement should specifically cover:
  1. Mandatory verification (PNC license for nurses, CNIC for all).
  2. Economic agency (nurses set their own prices).
  3. Ranking and feedback system (how it impacts profile visibility and accountability).
  4. DICE Fellowship principles (Dual Success: Profit + Impact).
  5. Local context (Karachi, Pakistan laws and norms).
  
  Format the response in Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Failed to generate agreement.";
  } catch (error) {
    console.error("Error generating agreement:", error);
    return "Error generating agreement.";
  }
}
