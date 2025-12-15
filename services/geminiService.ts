import { GoogleGenAI, Chat } from "@google/genai";
import { ScenarioConfig } from "../types";
import { SYSTEM_INSTRUCTION, getPrompt } from "../constants";

export const generateScenario = async (config: ScenarioConfig): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const userPrompt = getPrompt(config);
    
    // Using gemini-2.5-flash which is generally covered by the free tier
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance creativity with professional structure
        topK: 40,
        topP: 0.95,
      }
    });

    if (response.text) {
      return response.text;
    }
    
    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
};

export const createManagerChat = (config: ScenarioConfig, scenarioText: string): Chat => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  const managerPersona = `
    You are a Senior Product Leader (Head of Product or VP of Design). 
    You have just assigned a candidate (the user) the following take-home assignment:
    
    "${scenarioText}"

    The candidate is now asking you clarifying questions about this assignment.
    
    **YOUR GUIDELINES:**
    1. **Adopt a persona based on the candidate's seniority level (${config.seniority}):**
       - If they are Junior/Intern: Be helpful, encourage questions, and give specific guidance.
       - If they are Mid-level: Give context, but expect them to make decisions.
       - If they are Senior/Staff: Be high-level, strategic, and "busy." Push back if they ask for things they should define themselves. Say things like "I'm looking to you to define that strategy."
    
    2. **Stay "In Character":** Do not break the fourth wall. Do not say "I am an AI." Act as if you are their manager at the company specified in the brief.
    
    3. **Invent details if necessary, but keep them consistent:** If they ask about a constraint not explicitly in the text, invent a realistic answer that fits the brief's context (e.g., "Engineering is tight this quarter, so keep scope small").
    
    4. **Keep answers concise:** You are a busy manager communicating via Slack/Teams.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: managerPersona,
    },
  });
};