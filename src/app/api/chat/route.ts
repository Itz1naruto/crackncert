import { NextRequest, NextResponse } from "next/server";

async function listAvailableModels(key: string): Promise<string[]> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name?.replace('models/', '')) || [];
      console.log("[Chat] Available models:", models);
      return models.filter((m: string) => m && m.includes('gemini'));
    }
  } catch (e) {
    console.log("[Chat] Could not list models:", e);
  }
  return [];
}

async function tryGemini(message: string, conversationHistory: any[]) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("[Chat] ❌ No GEMINI_API_KEY found");
    return null;
  }

  console.log("[Chat] ✅ GEMINI_API_KEY is set");
  console.log("[Chat] 📝 User question:", message);
  console.log("[Chat] 💬 History messages:", conversationHistory.length);

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

  // Add recent conversation context (last 4 messages)
  const recentHistory = conversationHistory.slice(-4);
  if (recentHistory.length > 0) {
    prompt += "Previous conversation:\n";
    recentHistory.forEach((msg: any) => {
      prompt += `${msg.role === "user" ? "Student" : "You"}: ${msg.content}\n`;
    });
    prompt += "\n";
  }

  // Current question - make it VERY clear
  prompt += `Student's current question: "${message}"

IMPORTANT: Answer THIS specific question directly. Do NOT give a generic greeting or introduction. Respond as NCERT Cool Tutor:`;

  console.log("[Chat] 📤 Full prompt length:", prompt.length);
  console.log("[Chat] 📤 Prompt preview:", prompt.substring(0, 200) + "...");

  // First, try to list available models (like MCQ route does)
  const availableModels = await listAvailableModels(key);
  
  // Use available models if found, otherwise use fallback list (prioritize 2.5 models since we know they work)
  const modelNames = availableModels.length > 0 
    ? availableModels 
    : [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest", 
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ];
  
  console.log("[Chat] 🔄 Will try these models:", modelNames);

  // FIRST: Try REST API with v1
  for (const modelName of modelNames) {
    try {
      console.log(`[Chat REST v1] 🔄 Trying model: ${modelName}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.log(`[Chat REST v1] ❌ Model ${modelName} failed:`, response.status);
        if (modelName === modelNames[modelNames.length - 1]) {
          console.log("[Chat REST v1] All v1 models failed, trying v1beta...");
        }
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (text && text.trim().length > 10) {
        console.log(`[Chat REST v1] ✅ Success with ${modelName}!`);
        console.log(`[Chat REST v1] ✅ Response:`, text.substring(0, 100) + "...");
        return text.trim();
      }
    } catch (modelError: any) {
      console.log(`[Chat REST v1] ❌ Model ${modelName} exception:`, modelError.message);
      continue;
    }
  }

  // SECOND: Try REST API with v1beta (sometimes works when v1 doesn't)
  for (const modelName of modelNames) {
    try {
      console.log(`[Chat REST v1beta] 🔄 Trying model: ${modelName}`);
      
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
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(`[Chat REST v1beta] ❌ Model ${modelName} failed:`, response.status);
        if (modelName === modelNames[modelNames.length - 1]) {
          console.log("[Chat REST v1beta] All REST models failed, trying SDK...");
        }
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (text && text.trim().length > 10) {
        console.log(`[Chat REST v1beta] ✅ Success with ${modelName}!`);
        console.log(`[Chat REST v1beta] ✅ Response:`, text.substring(0, 100) + "...");
        return text.trim();
      }
    } catch (modelError: any) {
      console.log(`[Chat REST v1beta] ❌ Model ${modelName} exception:`, modelError.message);
      continue;
    }
  }

  // THIRD: Try SDK as fallback (like MCQ route does)
  try {
    console.log("[Chat SDK] 🔄 Trying SDK...");
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genai = new GoogleGenerativeAI(key);
    
    for (const modelName of modelNames) {
      try {
        console.log(`[Chat SDK] 🔄 Trying model: ${modelName}`);
        const model = genai.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        if (text && text.trim().length > 10) {
          console.log(`[Chat SDK] ✅ Success with ${modelName}!`);
          console.log(`[Chat SDK] ✅ Response:`, text.substring(0, 100) + "...");
          return text.trim();
        }
      } catch (e: any) {
        console.log(`[Chat SDK] ❌ Model ${modelName} failed:`, e.message);
        if (modelName !== modelNames[modelNames.length - 1]) continue;
      }
    }
  } catch (sdkError: any) {
    console.error("[Chat SDK] ❌ SDK import or initialization failed:", sdkError.message);
  }
  
  console.error("[Chat] ❌ All Gemini models failed (both REST and SDK)");
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

