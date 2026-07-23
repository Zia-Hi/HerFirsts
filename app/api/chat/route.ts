import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ===============================
// Her AI Personality - System Prompt
// ===============================
const SYSTEM_PROMPT = `You are "Her", the AI mentor inside the game "Her Firsts".

You are not a scripted chatbot - you are an intelligent AI assistant.

Your priority:
1. Understand the user's question completely.
2. Answer the question directly and immediately.
3. Provide practical, step-by-step guidance.
4. Be warm and supportive.

Conversation Rules:
- Never give generic greetings.
- Never say "Ask me anything".
- Never ignore the user's question.
- Always solve the problem first, then encourage.
- Use previous conversation context when responding.
- Keep responses concise - usually under 200 words.

Personality:
- Warm and gentle, like an experienced older sister.
- Patient and calm.
- Encouraging and supportive.
- Never judgmental or sarcastic.

Life Assistance Areas:
- Living alone
- Home repair
- Safety (gas leaks, electricity, fire)
- Travel
- Workplace situations
- Personal growth

Safety Rules - EMERGENCIES:

Gas Leak:
- Tell the user to prioritize immediate safety.
- Do NOT light matches, candles, or use lighters.
- Do NOT turn on/off electrical switches or appliances.
- Open windows and doors slowly for ventilation.
- Leave the dangerous area immediately.
- Recommend contacting emergency services (119/110).

Fire:
- Prioritize evacuation above all else.

Electricity:
- Never recommend unsafe electrical operations.
- Always advise turning off power first.

Home Repair:
- Give clear step-by-step instructions.
- Do NOT recommend dangerous actions.
- Suggest professional help when needed.`;

// ===============================
// Fallback Responses (for when OpenAI is unavailable)
// ===============================
const FALLBACK_RESPONSES: Record<string, string[]> = {
  gas: [
    "Safety first! If you smell gas, do NOT light any flames or turn on electrical switches. Open all windows and doors slowly, then leave the area immediately. Contact emergency services (119/110) once you're safe.",
    "Gas leaks are dangerous - don't take risks. Avoid matches, lighters, or any electrical devices. Open windows for ventilation and get out right away. Call for help from outside.",
  ],
  water: [
    "For plumbing issues, first turn off the water supply valve. If it's a leaky faucet, you can try tightening the packing nut. For shower leaks, check the gasket or O-ring.",
    "Shower leaking? Turn off the water at the main valve first. Then check if the shower head needs cleaning or if the washer needs replacement.",
  ],
  light: [
    "Light not working? First check the bulb - it might be burnt out. If it's still not working, check the circuit breaker. Always turn off power before touching electrical parts.",
    "To change a light bulb, first turn off the power at the circuit breaker. Let the bulb cool down if it was on. Then twist it counterclockwise to remove.",
  ],
  repair: [
    "For home repairs, safety always comes first. If you're unsure about electrical or plumbing work, it's better to call a professional.",
    "When doing repairs, make sure you have the right tools and follow instructions carefully. Don't hesitate to ask for help if something feels unsafe.",
  ],
  safety: [
    "Safety is always the top priority. Trust your instincts - if something feels dangerous, stop and get help.",
    "For emergency situations, always call the appropriate emergency services first. Your safety is more important than fixing anything yourself.",
  ],
  alone: [
    "Living alone for the first time can feel overwhelming, but you're doing great! Start small - learn basic safety and home maintenance skills.",
    "You're stronger than you think! Take things one step at a time. I'm here to help with whatever you need.",
  ],
  work: [
    "Workplace challenges are normal. Remember to communicate clearly and set boundaries. You deserve to be treated with respect.",
    "Trust your abilities - you got this job for a reason. Take breaks when you need to, and don't be afraid to ask questions.",
  ],
  travel: [
    "When traveling alone, always share your location with someone you trust. Keep emergency contacts handy and stay in well-lit areas at night.",
    "Travel safety tips: carry copies of important documents, keep your valuables secure, and trust your gut feeling.",
  ],
};

// ===============================
// Types
// ===============================
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ===============================
// Helper Functions
// ===============================
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check keywords for specific categories
  if (lowerMessage.includes("gas") || lowerMessage.includes("煤气") || lowerMessage.includes("燃气")) {
    return FALLBACK_RESPONSES.gas[Math.floor(Math.random() * FALLBACK_RESPONSES.gas.length)];
  }
  
  if (lowerMessage.includes("water") || lowerMessage.includes("水") || lowerMessage.includes("漏") || lowerMessage.includes("花洒")) {
    return FALLBACK_RESPONSES.water[Math.floor(Math.random() * FALLBACK_RESPONSES.water.length)];
  }
  
  if (lowerMessage.includes("light") || lowerMessage.includes("灯") || lowerMessage.includes("电") || lowerMessage.includes("bulb")) {
    return FALLBACK_RESPONSES.light[Math.floor(Math.random() * FALLBACK_RESPONSES.light.length)];
  }
  
  if (lowerMessage.includes("repair") || lowerMessage.includes("修") || lowerMessage.includes("fix")) {
    return FALLBACK_RESPONSES.repair[Math.floor(Math.random() * FALLBACK_RESPONSES.repair.length)];
  }
  
  if (lowerMessage.includes("safe") || lowerMessage.includes("安全") || lowerMessage.includes("emergency")) {
    return FALLBACK_RESPONSES.safety[Math.floor(Math.random() * FALLBACK_RESPONSES.safety.length)];
  }
  
  if (lowerMessage.includes("alone") || lowerMessage.includes("独自") || lowerMessage.includes("一个人")) {
    return FALLBACK_RESPONSES.alone[Math.floor(Math.random() * FALLBACK_RESPONSES.alone.length)];
  }
  
  if (lowerMessage.includes("work") || lowerMessage.includes("工作") || lowerMessage.includes("职场")) {
    return FALLBACK_RESPONSES.work[Math.floor(Math.random() * FALLBACK_RESPONSES.work.length)];
  }
  
  if (lowerMessage.includes("travel") || lowerMessage.includes("旅行") || lowerMessage.includes("trip")) {
    return FALLBACK_RESPONSES.travel[Math.floor(Math.random() * FALLBACK_RESPONSES.travel.length)];
  }
  
  // Default responses
  const defaults = [
    "I'm here to help! Tell me what you need assistance with - whether it's home repairs, safety tips, or living alone advice.",
    "How can I support you today? I'm happy to help with home maintenance, safety, or any first-time experiences.",
    "Hi there! What's on your mind? I'm here to offer practical advice and encouragement.",
    "You're doing great! What do you need help with right now?",
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ===============================
// API Route
// ===============================
export async function POST(request: NextRequest) {
  console.log("[CHAT API] Received request");

  try {
    // Parse request body
    const body = await request.json();
    console.log("[CHAT API] Request body:", JSON.stringify(body, null, 2));

    const messages = body.messages as ChatMessage[];

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("[CHAT API] Invalid input: messages are required");
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      console.error("[CHAT API] Last message must be from user");
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      );
    }

    // Check API Key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your-openai-api-key-here") {
      console.warn("[CHAT API] No OPENAI_API_KEY configured, using fallback");
      const reply = getFallbackResponse(lastMessage.content);
      return NextResponse.json({ reply });
    }

    try {
      // Create OpenAI client with timeout
      const openai = new OpenAI({ 
        apiKey,
        timeout: 30000, // 30 second timeout
      });
      console.log("[CHAT API] OpenAI client created");

      // Build messages array for OpenAI
      const openaiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      console.log("[CHAT API] Sending to OpenAI:", openaiMessages.length, "messages");

      // Call OpenAI API with timeout
      const completion = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: openaiMessages,
          temperature: 0.5,
          max_tokens: 500,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout")), 30000)
        ),
      ]);

      console.log("[CHAT API] OpenAI response received");

      // Extract reply
      const reply = completion.choices[0]?.message?.content;

      if (!reply) {
        throw new Error("No response content from OpenAI");
      }

      console.log("[CHAT API] Reply:", reply.substring(0, 100), "...");

      return NextResponse.json({ reply });

    } catch (openaiError) {
      console.error("[CHAT API] OpenAI call failed:", openaiError);
      console.warn("[CHAT API] Falling back to local responses");
      
      // Return fallback response when OpenAI is unavailable
      const reply = getFallbackResponse(lastMessage.content);
      return NextResponse.json({ reply });
    }

  } catch (error) {
    console.error("[CHAT API] ERROR:", error);

    // Return fallback response on any other error
    const body = await request.json().catch(() => ({ messages: [] }));
    const messages = body.messages as ChatMessage[] || [];
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : { content: "" };
    
    const reply = getFallbackResponse(lastMessage.content || "");
    return NextResponse.json({ reply });
  }
}