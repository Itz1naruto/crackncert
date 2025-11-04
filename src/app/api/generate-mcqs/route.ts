import { NextRequest, NextResponse } from "next/server";

function buildPrompt(classNumber: string, subject: string, chapter: string, variation: string, difficulty: string = 'Medium', stream?: string, strict = false) {
  const difficultyGuidelines = {
    'Easy': 'Use simple, straightforward questions. Basic definitions, recall facts, single-step problems. Suitable for beginners. Keep language simple.',
    'Medium': 'Use moderate complexity. Require understanding of concepts, application of knowledge, 2-3 step problems. Balanced difficulty.',
    'Hard': 'Use challenging questions. Complex analysis, multi-step problems, application to new scenarios, critical thinking. Suitable for advanced students.'
  };
  
  const streamNote = stream ? `\n- Stream: ${stream} (focus on ${stream === 'PCB' ? 'Physics, Chemistry, Biology' : 'Physics, Chemistry, Mathematics'} content)` : '';
  
  const common = `You are generating an NCERT-aligned MCQ test.
Context:
- Board: NCERT (India)
- Class: ${classNumber}
- Subject: ${subject}${streamNote}
- Chapter/Unit: ${chapter}
- Difficulty Level: ${difficulty}
- Variation ID: ${variation} (use this as a seed to diversify outputs and avoid repetition across runs)
Requirements:
- Create exactly 10 multiple-choice questions focused ONLY on this chapter.
- Each question must reference chapter-specific concepts/terms/examples (no generic syllabus).
- Difficulty Guidelines: ${difficultyGuidelines[difficulty as keyof typeof difficultyGuidelines]}
- Vary question types: definition, application, short calculation (if Maths/Science), data/graph inference where applicable.
- Difficulty must be ${difficulty} - ${difficultyGuidelines[difficulty as keyof typeof difficultyGuidelines]}
- Include 4 options (A,B,C,D). Provide 'correct' as the index (0..3) and a short 'explanation'.
- Do not reuse the same wording between questions; aim for diverse coverage within the chapter.
${stream ? `- Focus questions on ${stream} stream content: ${stream === 'PCB' ? 'Biology and related concepts' : 'Mathematics and Physics/Chemistry concepts'}.` : ''}
Output strictly JSON array with 10 items: [{"q": string, "options": [A,B,C,D], "correct": number, "explanation": string}].`;
  return strict
    ? `${common}\nBefore output: verify every question is on '${chapter}' and matches ${difficulty} difficulty. If any is off-topic or wrong difficulty, replace it. Output ONLY JSON.`
    : `${common}\nOutput ONLY JSON.`;
}

function countChapterMatches(items: any[], chapter: string) {
  const keyTokens = chapter.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 3);
  if (keyTokens.length === 0) return items.length;
  const hasMatch = (text: string) => keyTokens.some(t => text.toLowerCase().includes(t));
  let score = 0;
  for (const it of items) {
    if (!it || !it.q) continue;
    if (hasMatch(it.q) || (Array.isArray(it.options) && it.options.some((o: string) => hasMatch(o)))) score++;
  }
  return score;
}

async function listAvailableModels(key: string): Promise<string[]> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name?.replace('models/', '')) || [];
      console.log("[Gemini] Available models:", models);
      return models.filter((m: string) => m && m.includes('gemini'));
    }
  } catch (e) {
    console.log("[Gemini] Could not list models:", e);
  }
  return [];
}

async function tryGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  
  // First, try to list available models
  const availableModels = await listAvailableModels(key);
  
  // List of model names to try (most common first)
  const modelNames = availableModels.length > 0 
    ? availableModels 
    : [
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest", 
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ];
  
  // Try REST API with different models
  for (const modelName of modelNames) {
    try {
      console.log(`[Gemini] Trying REST API with model: ${modelName}`);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      
      if (!response.ok) {
        const errText = await response.text();
        console.log(`[Gemini REST] Model ${modelName} failed: ${response.status}`);
        if (modelName === modelNames[modelNames.length - 1]) {
          console.error("[Gemini REST] All models failed. Error:", errText);
        }
        continue; // Try next model
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        console.log(`[Gemini REST] Model ${modelName} returned no text`);
        continue;
      }
      
      console.log(`[Gemini REST] Success with ${modelName}! Response length:`, text.length);
      const cleaned = text.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error("[Gemini REST] JSON parse error:", parseErr);
        console.error("[Gemini REST] First 200 chars:", text.substring(0, 200));
        continue;
      }
      
      if (Array.isArray(parsed) && parsed[0]?.q) {
        console.log("[Gemini REST] Success! Got", parsed.length, "questions");
        return parsed;
      }
      if (parsed?.mcqs && Array.isArray(parsed.mcqs)) {
        console.log("[Gemini REST] Success! Got", parsed.mcqs.length, "questions");
        return parsed.mcqs;
      }
      console.error("[Gemini REST] Invalid structure");
      continue;
    } catch (restErr: any) {
      console.log(`[Gemini REST] Model ${modelName} exception:`, restErr.message);
      if (modelName === modelNames[modelNames.length - 1]) {
        console.error("[Gemini] All REST API attempts failed");
      }
      continue;
    }
  }
  
  // If all REST attempts failed, try SDK with different models
  try {
    console.log("[Gemini] Trying SDK...");
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genai = new GoogleGenerativeAI(key);
    
    for (const modelName of modelNames) {
      try {
        console.log(`[Gemini SDK] Trying model: ${modelName}`);
        const model = genai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed[0]?.q) {
          console.log(`[Gemini SDK] Success with ${modelName}!`);
          return parsed;
        }
        if (parsed?.mcqs && Array.isArray(parsed.mcqs)) {
          console.log(`[Gemini SDK] Success with ${modelName}!`);
          return parsed.mcqs;
        }
      } catch (e: any) {
        console.log(`[Gemini SDK] Model ${modelName} failed:`, e.message);
        if (modelName !== modelNames[modelNames.length - 1]) continue;
      }
    }
  } catch (e: any) {
    console.error("[Gemini SDK] All attempts failed:", e.message);
  }
  
  return null;
}


export async function POST(req: NextRequest) {
  const { classNumber, subject, chapter, variation, difficulty = 'Medium', stream } = await req.json();
  if (!classNumber || !subject || !chapter) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  // Debug logging
  const hasGemini = !!process.env.GEMINI_API_KEY;
  console.log(`[MCQ API] GEMINI_API_KEY: ${hasGemini ? 'SET' : 'MISSING'}`);
  console.log(`[MCQ API] Difficulty: ${difficulty}, Stream: ${stream || 'None'}`);

  const varId = String(variation || Date.now());

  let prompt = buildPrompt(String(classNumber), String(subject), String(chapter), varId, difficulty, stream);
  console.log(`[MCQ API] Generating for Class ${classNumber}, ${subject}, Chapter: ${chapter}, Difficulty: ${difficulty}`);
  console.log(`[MCQ API] Prompt length: ${prompt.length} chars`);
  
  let mcqs = await tryGemini(prompt);

  if (!mcqs || countChapterMatches(mcqs, String(chapter)) < 6) {
    const strictPrompt = buildPrompt(String(classNumber), String(subject), String(chapter), varId, difficulty, stream, true);
    const retry = await tryGemini(strictPrompt);
    if (retry) mcqs = retry;
  }

  if (!mcqs) {
    return NextResponse.json({ 
      error: `Gemini API failed: All models returned 404. This usually means: 1) Your API key doesn't have Generative AI API enabled in Google Cloud Console, or 2) The API key format is incorrect. Check https://aistudio.google.com/apikey to verify your key and enable the Generative AI API.` 
    }, { status: 500 });
  }
  return NextResponse.json({ mcqs }, { status: 200 });
}
