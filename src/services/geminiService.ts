export const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";
export const MODEL_ID = import.meta.env.VITE_MODEL_ID || "gemini-2.0-flash";
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "https://generativelanguage.googleapis.com/v1beta/models";

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const sendMessageToGemini = async (userMessage: string, systemPrompt: string, previousMessages: any[] = []) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid user message');
    }

    if (!GEMINI_API_KEY) {
      console.warn("Gemini API Key is missing");
      throw new Error('API key not configured');
    }

    // Prepare conversation history - keep last 6 messages for context
    const conversationHistory = previousMessages
      .slice(Math.max(0, previousMessages.length - 6))
      .map(msg => {
        if (!msg || !msg.text) {
          return null;
        }
        return {
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: String(msg.text) }]
        };
      })
      .filter((msg): msg is ChatMessage => msg !== null);

    // Add current user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: String(userMessage) }]
    });

    const requestPayload = {
      systemInstruction: {
        parts: [
          {
            text: systemPrompt
          }
        ]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    };

    const url = `${API_ENDPOINT}/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]) {
      throw new Error('Invalid response format from API');
    }

    return data.candidates[0].content.parts[0].text;
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);

    // FALLBACK: Return offline responses if API fails (Quota/Network)
    console.log("Switching to offline fallback mode");
    const msg = userMessage.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! I am your Women Safety Assistant. Although my internet connection is weak right now, I can still guide you. Are you in an emergency?";
    }
    if (msg.includes("emergency") || msg.includes("danger") || msg.includes("help")) {
      return "🚨 **EMERGENCY ALERT**\n\nIf you are in immediate danger:\n1. **Call Police immediately**: 100 or 112\n2. **Scream/Make Noise** to attract attention.\n3. **Share your Live Location** with family.\n4. Go to the nearest crowded shop or building.";
    }
    if (msg.includes("safety") || msg.includes("tips")) {
      return "🛡️ **General Safety Tips**:\n- Trust your instincts.\n- Walk in well-lit areas.\n- Keep your phone charged.\n- Carry pepper spray or a safety whistle.\n- Use the 'Safety Zones' feature in this app.";
    }

    return "I am currently unable to reach the cloud server (Quota Limit), but I am here. \n\n**Quick Actions:**\n- 📞 Dial 112 for Police\n- 🏥 Go to nearest Hospital\n- 📢 Use the SOS Button on your dashboard.";
  }
};
