import { ChatMessage } from '../types';

const API_KEY = import.meta.env.VITE_AGRO_API;
// const API_KEY = "AIzaSyA36Etn8PPdKcXQqR4AX6Ej_btNXnSaI10";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const systemPrompt = `
You are AgroGuardian, a multilingual expert assistant in agriculture.
You help farmers with crop diseases, pest control, fertilizers, soil health, and sustainable farming practices.
Do not answer questions outside of agriculture. If a question is unrelated, reply with:
"⚠️ Sorry, I can only answer agriculture-related questions. Please ask about crops, diseases, soil, etc."
Always reply in the user's language: English, Hindi, Tamil, or Bengali.
`;

export async function chatWithLLM({
  message,
  language,
  context,
  chatHistory
}: {
  message: string;
  language: string;
  context?: any;
  chatHistory?: ChatMessage[];
}): Promise<{ response: string }> {
  const userHistory = (chatHistory || []).slice(-5).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const promptMessages = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    ...userHistory,
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  const payload = {
    contents: promptMessages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024
    }
  };

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error('Gemini Error Response:', await res.text());
      throw new Error('Gemini API request failed');
    }

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      response: responseText || '⚠️ Sorry, no response generated.'
    };
  } catch (err) {
    console.error('Gemini fetch error:', err);
    throw err;
  }
}
