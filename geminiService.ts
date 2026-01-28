
import { GoogleGenAI, Type } from "@google/genai";

const getLocalFallbackInsights = (subscriptions: any[]): any[] => {
  const insights = [];
  const total = subscriptions.reduce((acc, s) => acc + s.amount, 0);
  
  if (total > 500) {
    insights.push({
      title: "Optimization Priority",
      description: "Your monthly burn is higher than average. Consider auditing entertainment bundles.",
      type: "leakage"
    });
  } else {
    insights.push({
      title: "Healthy Cash Flow",
      description: "Your subscription-to-income ratio looks optimal for this month.",
      type: "saving"
    });
  }
  
  insights.push({
    title: "Consolidation Tip",
    description: "Check for duplicate services in your Work and Utilities categories.",
    type: "tip"
  });

  return insights;
};

export const getAIInsights = async (subscriptions: any[], expenses: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze these user finances:
    Subscriptions: ${JSON.stringify(subscriptions)}
    Other Expenses: ${JSON.stringify(expenses)}
    
    Identify:
    1. Budget Leakage (excessive spending).
    2. Unused/Redundant subscriptions.
    3. Money-saving tips.
    
    Return exactly 3 insights as JSON.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["saving", "warning", "tip", "leakage"] }
            },
            required: ["title", "description", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error: any) {
    console.warn("Gemini API Error:", error.message);
    return getLocalFallbackInsights(subscriptions);
  }
};

export const getPlanOptimization = async (subscriptions: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on these subscriptions: ${JSON.stringify(subscriptions)}, suggest 2-3 plan alternatives (e.g., individual to family, or yearly vs monthly) to save money.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              serviceName: { type: Type.STRING },
              currentPlan: { type: Type.STRING },
              suggestedPlan: { type: Type.STRING },
              savings: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};

export const scanDocumentWithAI = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Corrected contents structure to wrap parts in a single object
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Extract document type, user name, and expiry date from this document image. Type should be one of: 'Driving License', 'Passport', 'Insurance', 'Vehicle Registration'."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          name: { type: Type.STRING },
          expiryDate: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// Added missing export analyzeDeviceApps to provide AI-driven subscription discovery from app lists
export const analyzeDeviceApps = async (apps: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on these installed apps: ${apps.join(', ')}, identify which ones are likely to have paid subscriptions. For each, provide the name, estimated monthly amount in USD, billing cycle (Monthly/Yearly), and category.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              cycle: { type: Type.STRING, enum: ["Monthly", "Yearly"] },
              category: { type: Type.STRING },
              nextBillingDate: { type: Type.STRING, description: "YYYY-MM-DD" }
            },
            required: ["name", "amount", "cycle", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Analyze Apps Error:", error);
    return [];
  }
};
