import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateSurveyQuestions() {
  if (!ai) return null;

  const prompt = `As an INTJ-A Analyst building a "Deterministic Execution Pipeline" for home nursing in Karachi, generate a set of 10-12 high-impact survey questions for nurses in Karachi hospitals. 
  The goal is to identify the "sludge costs", trust deficits, and economic barriers they face.
  
  MANDATORY: Include these specific questions or variations of them:
  1. "For a 12-hour shift, what is the total amount the patient pays the agency versus the exact amount that reaches your pocket?"
  2. "If our platform allowed you to set your own market rate based on your specialized skills (e.g., ICU or Geriatric), what would be your target price for a 24-hour shift in Karachi South?"
  3. "How often are your payments delayed by manual agency processing, and would a digital payment system change your loyalty to a platform?"
  4. "Do you feel that your Pakistan Nursing Council (PNC) license is respected as a badge of quality by current agencies?"
  5. "How many hours a week do you spend on WhatsApp coordinating schedules or sending manual patient updates to families?"
  6. "What specific safety tools (like a GPS clock-in or emergency 'SOS' button) would make you feel more secure working night shifts?"
  
  Categories to cover:
  1. Economic Agency (Salary, markups, payment speed).
  2. Trust & Verification (PNC license, credentialing).
  3. Safety & Logistics (Travel in Karachi, home care concerns).
  4. Digital Readiness (App usage, WhatsApp coordination).
  
  Return the response as a JSON array of objects with 'id', 'question', 'type' (text, scale, multiple-choice), and 'options' (if applicable).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating survey questions:", error);
    return null;
  }
}
