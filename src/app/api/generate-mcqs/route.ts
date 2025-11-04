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
        console.log(`[MCQ] Found ${models.length} available models:`, models.slice(0, 5));
        return models;
      }
    }
  } catch (e) {
    console.log("[MCQ] Could not list models from v1beta:", e);
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
        console.log(`[MCQ] Found ${models.length} available models from v1:`, models.slice(0, 5));
        return models;
      }
    }
  } catch (e) {
    console.log("[MCQ] Could not list models from v1:", e);
  }
  
  // Default fallback models (if listing fails)
  return ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
}

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

async function tryGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  
  // Get available models first (fast - single API call)
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,  // Enough for 10 MCQs
          },
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.log(`[MCQ] Model ${modelName} failed: ${response.status} - ${errorText.substring(0, 150)}`);
        continue; // Try next model
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        console.log(`[MCQ] Model ${modelName} returned empty text`);
        continue;
      }
      
      console.log(`[MCQ] ✅ Success with ${modelName}!`);
      const cleaned = text.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.log(`[MCQ] Model ${modelName} returned invalid JSON`);
        continue;
      }
      
      if (Array.isArray(parsed) && parsed[0]?.q) {
        return parsed;
      }
      if (parsed?.mcqs && Array.isArray(parsed.mcqs)) {
        return parsed.mcqs;
      }
    } catch (restErr: any) {
      console.log(`[MCQ] Model ${modelName} exception:`, restErr.message?.substring(0, 100));
      continue;
    }
  }
  
  // Fallback: Try SDK if REST fails
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genai = new GoogleGenerativeAI(key);
    
    for (const modelName of modelNames.slice(0, 3)) { // Try first 3 models
      try {
        const model = genai.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          }
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        if (!text) continue;
        
        const cleaned = text.replace(/```json|```/g, "").trim();
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (parseErr) {
          continue;
        }
        
        if (Array.isArray(parsed) && parsed[0]?.q) {
          console.log(`[MCQ SDK] ✅ Success with ${modelName}!`);
          return parsed;
        }
        if (parsed?.mcqs && Array.isArray(parsed.mcqs)) {
          console.log(`[MCQ SDK] ✅ Success with ${modelName}!`);
          return parsed.mcqs;
        }
      } catch (e: any) {
        console.log(`[MCQ SDK] Model ${modelName} failed:`, e.message?.substring(0, 100));
        continue;
      }
    }
  } catch (sdkError: any) {
    console.error("[MCQ SDK] SDK import failed:", sdkError.message?.substring(0, 100));
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
  
  let mcqs = await tryGemini(prompt);

  // Only retry if completely failed, skip quality check to save time
  if (!mcqs) {
    const strictPrompt = buildPrompt(String(classNumber), String(subject), String(chapter), varId, difficulty, stream, true);
    mcqs = await tryGemini(strictPrompt);
  }

  if (!mcqs) {
    return NextResponse.json({ 
      error: `Gemini API failed: All models returned 404. This usually means: 1) Your API key doesn't have Generative AI API enabled in Google Cloud Console, or 2) The API key format is incorrect. Check https://aistudio.google.com/apikey to verify your key and enable the Generative AI API.` 
    }, { status: 500 });
  }
  return NextResponse.json({ mcqs }, { status: 200 });
}
