import { NextRequest, NextResponse } from "next/server";

async function getAvailableModels(key: string): Promise<string[]> {
  try {
    // Try v1beta first (more models available)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: any) => {
        const name = m.name?.replace('models/', '');
        // Check if model supports generateContent
        const supportedMethods = m.supportedGenerationMethods || [];
        if (name && name.includes('gemini') && (supportedMethods.includes('generateContent') || supportedMethods.length === 0)) {
          return name;
        }
        return null;
      }).filter(Boolean) || [];
      if (models.length > 0) {
        console.log(`[Chat] Found ${models.length} available models:`, models.slice(0, 5));
        return models;
      }
    }
  } catch (e) {
    console.log("[Chat] Could not list models from v1beta:", e);
  }
  
  // Fallback to v1
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: any) => {
        const name = m.name?.replace('models/', '');
        const supportedMethods = m.supportedGenerationMethods || [];
        if (name && name.includes('gemini') && (supportedMethods.includes('generateContent') || supportedMethods.length === 0)) {
          return name;
        }
        return null;
      }).filter(Boolean) || [];
      if (models.length > 0) {
        console.log(`[Chat] Found ${models.length} available models from v1:`, models.slice(0, 5));
        return models;
      }
    }
  } catch (e) {
    console.log("[Chat] Could not list models from v1:", e);
  }
  
  // Default fallback models (if listing fails)
  return ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
}

async function tryGemini(message: string, conversationHistory: any[]) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("[Chat] ❌ No GEMINI_API_KEY found");
    return null;
  }

  // Build conversation context for Gemini
  let prompt = `You are NCERT Cool Tutor, a super fun and interactive AI study buddy! 🚀✨ 

Your personality:
- Extremely friendly, energetic, and encouraging (like a cool teacher who makes learning awesome!)
- Use fun analogies, examples, and real-world connections
- Keep it conversational and engaging - like talking to a friend who's really good at explaining things
- Use emojis sparingly (1-2 max) but make them count! 😎💡
- Break down complex topics into simple, digestible chunks
- Be accurate and educational, but make it enjoyable!
- Use exclamations and enthusiasm to keep students motivated!
- If asked about NCERT topics, relate them to classes 6-12
- For academic questions, provide clear explanations with examples
- Keep responses 3-5 sentences for regular questions, longer if explaining complex concepts
- Always end on an encouraging note!

Answer style: Mix humor with education, use simple language, give practical examples, and make students feel confident! 💪

`;

  // Add recent conversation context (last 3 messages for speed)
  const recentHistory = conversationHistory.slice(-3);
  if (recentHistory.length > 0) {
    prompt += "Previous conversation:\n";
    recentHistory.forEach((msg: any) => {
      prompt += `${msg.role === "user" ? "Student" : "You"}: ${msg.content}\n`;
    });
    prompt += "\n";
  }

  // Current question
  prompt += `Student's current question: "${message}"

Answer directly as NCERT Cool Tutor:`;

  // Get available models first (same approach as MCQ route)
  const availableModels = await getAvailableModels(key);
  
  // Prioritize Flash models for speed, then Pro
  const modelNames = availableModels.sort((a, b) => {
    if (a.includes('flash') && !b.includes('flash')) return -1;
    if (!a.includes('flash') && b.includes('flash')) return 1;
    return 0;
  });

  // Try REST API v1beta first (where most models are available)
  for (const modelName of modelNames) {
    try {
      console.log(`[Chat] 🔄 Trying model: ${modelName} (v1beta)`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 400,  // Reduced from 512 for faster responses
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error");
        console.error(`[Chat] ❌ Model ${modelName} failed: Status ${response.status}`);
        console.error(`[Chat] Error details: ${errorText.substring(0, 300)}`);
        continue; // Try next model
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (text && text.trim().length > 10) {
        console.log(`[Chat] ✅ Success with ${modelName}!`);
        return text.trim();
      } else {
        console.warn(`[Chat] ⚠️ Model ${modelName} returned empty or too short text`);
      }
    } catch (modelError: any) {
      console.error(`[Chat] ❌ Exception with model ${modelName}:`, modelError.message);
      continue;
    }
  }
  
  console.error("[Chat] ❌ All models failed");
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("[Chat API] ========== NEW CHAT REQUEST ==========");
    console.log("[Chat API] 📨 Received message:", message);
    console.log("[Chat API] 🔑 Has GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY);
    console.log("[Chat API] 📚 Conversation history:", conversationHistory.length, "messages");

    const response = await tryGemini(message, conversationHistory);

    if (!response) {
      console.error("[Chat API] ❌ Gemini failed - no response");
      console.error("[Chat API] 🔍 Check server logs above for details");
      // Fallback - but make it clear something is wrong
      return NextResponse.json({
        response: "Hey! 😅 Looks like I'm having trouble connecting to my brain right now! The API might not be responding. Check if GEMINI_API_KEY is set correctly in .env.local and restart your server. But I'm still here - try asking me something! 💪✨"
      }, { status: 200 });
    }

    console.log("[Chat API] ✅ Success! Returning response of length:", response.length);
    console.log("[Chat API] ======================================");
    return NextResponse.json({ response }, { status: 200 });
  } catch (error: any) {
    console.error("[Chat API] Error:", error);
    return NextResponse.json({
      error: "Something went wrong. Please try again!"
    }, { status: 500 });
  }
}

