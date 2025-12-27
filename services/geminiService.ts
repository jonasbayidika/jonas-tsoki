
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the recommended direct environment variable access
// process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Tu es "Bomoko Bot", l'assistant virtuel intelligent de la plateforme BOMOKO JEUNESSE CONGO.
Ton rôle est d'aider les jeunes congolais dans leur recherche d'emploi, de formation et d'entrepreneuriat.
Tes réponses doivent être encourageantes, professionnelles et adaptées au contexte de la RDC (Kinshasa, etc.).

Missions principales :
1. Conseiller sur la rédaction de CV et lettre de motivation.
2. Suggérer des types de formations basées sur les intérêts de l'utilisateur.
3. Expliquer les démarches entrepreneuriales de base en RDC.
4. Répondre en français.

Si tu ne connais pas une information spécifique (ex: une offre précise en temps réel), conseille à l'utilisateur de consulter la section "Emplois" ou "Formations" du site.
`;

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    // Map internal history to the format expected by the API
    const formattedHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    // Use generateContent with both model and prompt as per updated SDK guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Directly access the text property from the response object
    return response.text || "Désolé, je n'ai pas pu traiter votre demande pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Une erreur est survenue lors de la communication avec l'assistant. Veuillez réessayer plus tard.";
  }
};
