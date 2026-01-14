
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SurveyInput } from "../types";

export const analyzeSurveyCorrelation = async (input: SurveyInput): Promise<AnalysisResult> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scaleTranslations: Record<string, string> = {
    'likert': 'Ликерт шкаласы (1-5 немесе 1-7, келісу деңгейі)',
    'dichotomous': 'Дихотомиялық (Иә/Жоқ, Бар/Жоқ)',
    'nominal': 'Атаулы (Номиналды санаттар, жіктеу)',
    'ordinal': 'Реттік (Рангілеу, деңгейлер)',
    'ratio': 'Сандық (Нақты өлшемдер, балдар)'
  };

  const prompt = `
    Зерттеу тақырыбы: "${input.topic}"
    Өлшем шкаласы: ${scaleTranslations[input.scaleType]}
    
    Сұрақтар:
    ${input.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

    Осы мәліметтер негізінде SPSS бағдарламасында жасауға болатын статистикалық талдау жоспарын жасаңыз. 
    Талдау түрлеріне келесілерді міндетті түрде қосыңыз (егер деректерге сәйкес келсе):
    - Корреляциялық талдау (Пирсон немесе Спирмен).
    - Дисперсиялық талдау (ANOVA) немесе Стьюдент t-критерийі (топтарды салыстыру үшін).
    - Регрессиялық талдау (болжам жасау және әсерді анықтау үшін).
    - Факторлық талдау (құрылымды анықтау үшін).
    - Шкала сенімділігі (Cronbach's Alpha).

    Жауапты қазақ тілінде келесі JSON форматында беріңіз.
  `;

  try {
    // Using ai.models.generateContent to query GenAI with both the model name and prompt
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: {
              type: Type.NUMBER,
              description: "Жалпы статистикалық нәтиже шығу ықтималдығы (0-100)",
            },
            reasoning: {
              type: Type.STRING,
              description: "Талдау негіздемесі",
            },
            potentialCorrelations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Күтілетін негізгі байланыстар",
            },
            suggestedMethods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Әдіс атауы (мысалы: Пирсон корреляциясы)" },
                  description: { type: Type.STRING, description: "Бұл әдіс не үшін керек?" },
                  spssInstruction: { type: Type.STRING, description: "SPSS-те қай мәзір арқылы табылады" }
                },
                required: ["name", "description", "spssInstruction"]
              },
              description: "SPSS-те жасауға болатын анализ түрлері (соның ішінде Корреляция)"
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Зерттеуді жақсарту кеңестері",
            },
            significanceLevel: {
              type: Type.STRING,
              description: "Маңыздылық деңгейі",
            }
          },
          required: ["probability", "reasoning", "potentialCorrelations", "suggestedMethods", "recommendations", "significanceLevel"]
        },
      },
    });

    // Accessing .text property directly to get the generated text content
    const text = response.text;
    if (!text) {
      throw new Error("Бос жауап алынды.");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini талдау қатесі:", error);
    throw new Error("Статистикалық талдау барысында қате орын алды.");
  }
};
