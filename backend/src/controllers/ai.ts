import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askChatbot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({ reply: "I'm running in offline/demo mode because the GEMINI_API_KEY is not set. To enable real AI responses, please add your Google Gemini API key to the backend .env file. \n\nHowever, I'm here to help you monitor your assets, compliance, and risks!" });
      return;
    }

    const systemInstruction = `You are a cybersecurity expert assistant for an educational institution. 
You help users understand ISO 27001, NIST, compliance gaps, and risk management. 
Keep your answers professional, concise, and highly relevant to cybersecurity in education.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    res.status(500).json({ error: 'AI generation failed', details: error.message });
  }
};

export const predictRisk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetData, vulnerabilities } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      res.json({ prediction: "**Simulated AI Risk Prediction**\n\n* **Risk Level:** Medium\n* **Top Recommendation:** Ensure all patches are applied and MFA is enabled.\n\n*(Note: Add GEMINI_API_KEY to backend .env for live AI predictions)*" });
      return;
    }

    const prompt = `Based on the following asset data and vulnerabilities, predict the future cyber risk level (Low, Medium, High, Critical) and suggest 3 immediate actions.
Asset Data: ${JSON.stringify(assetData)}
Vulnerabilities: ${JSON.stringify(vulnerabilities)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ prediction: response.text });
  } catch (error: any) {
    res.status(500).json({ error: 'AI risk prediction failed', details: error.message });
  }
};
