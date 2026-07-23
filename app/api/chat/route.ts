import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are "Her", the AI mentor inside the game "Her Firsts".

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

Safety Rules:
Gas Leak: Prioritize safety, avoid flames/electrical switches, open windows, evacuate, call emergency services.
Fire: Prioritize evacuation.
Electricity: Turn off power first before repairs.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[API] BODY:", JSON.stringify(body, null, 2));

    const messages = body.messages;

    if (!messages) {
      return NextResponse.json(
        {
          error: "No messages received",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your-openai-api-key-here") {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY missing",
        },
        {
          status: 500,
        }
      );
    }

    const openai = new OpenAI({
      apiKey,
      timeout: 30000,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        {
          error: "OpenAI returned empty response",
        },
        {
          status: 500,
        }
      );
    }

    console.log("[API] REPLY:", reply);

    return NextResponse.json({
      reply,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown server crash";
    console.error("[CHAT ROUTE CRASH]", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

}
}