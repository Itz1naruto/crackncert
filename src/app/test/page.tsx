"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { BookOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const CHAPTER_CACHE_VERSION = "v2";

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center animate-fadein">{[...Array(36)].map((_,i)=>(<motion.div key={i} className="absolute rounded-full" style={{background:i%3?"#8b5cf6":"#22d3ee",width:12+i%2*9,height:12+i%5*7,top:Math.random()*95+2+'%',left:Math.random()*97+1+'%',opacity:.75}} initial={{y:-80,scale:0.6+Math.random()*0.6}} animate={{y:[-80,360+Math.random()*120],opacity:[.9,0],x:[0,(Math.random()-.5)*90],rotate:0.4+Math.random()*260}} transition={{duration:1.55+Math.random(),delay:Math.random()/2}} />))}</div>;
}

function TestPageContent() {
  const { user, isGuest } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const classNum = params.get("class");
  const subject = params.get("subject");
  const difficulty = params.get("difficulty") || "Medium";
  const stream = params.get("stream") || null;
  const refresh = params.get("refresh");
  const refreshKey = refresh === '1' ? '1' : '0';

  const [chapters, setChapters] = useState<string[] | null>(null);
  const chapterParam = params.get("chapter");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(chapterParam || null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[] | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const variationSeed = useMemo(() => `${Date.now()}_${classNum}_${subject}_${selectedChapter || ''}`, [classNum, subject, selectedChapter]);

  useEffect(() => { if (!user && !isGuest) router.replace("/"); }, [user, isGuest, router]);
  useEffect(() => { if (score !== null && score > 90) setShowConfetti(true); else setShowConfetti(false); }, [score]);
  useEffect(() => {
    async function fetchChapters() {
      if (!classNum || !subject) return;
      setChapters(null);
      const baseKey = `chapters_${CHAPTER_CACHE_VERSION}_${classNum}_${subject}_${stream || 'none'}`;
      const cached = typeof window !== 'undefined' ? localStorage.getItem(baseKey) : null;
      const shouldBypassCache = refreshKey === '1';
      if (!shouldBypassCache && cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length >= 10) { setChapters(parsed); return; }
        } catch { }
      }
      try {
        const res = await fetch("/api/chapters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classNumber: classNum, subject, stream }) });
        const data = await res.json();
        const list = Array.isArray(data.chapters) ? data.chapters : [];
        setChapters(list);
        if (typeof window !== 'undefined') localStorage.setItem(baseKey, JSON.stringify(list));
      } catch {
        setChapters(["Chapter 1", "Chapter 2", "Chapter 3"]);
      }
    }
    fetchChapters();
  }, [classNum, subject, stream, refreshKey]);

  async function generateQuestions(useFreshSeed = false) {
    setLoading(true); setQuestions(null); setSubmitted(false); setScore(null); setError(null);
    try {
      const seed = useFreshSeed ? `${Date.now()}_${classNum}_${subject}_${selectedChapter || ''}_retry` : variationSeed;
      const payload = { classNumber: classNum, subject, chapter: selectedChapter, variation: seed, difficulty, stream } as any;
      const res = await fetch("/api/generate-mcqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate MCQs");
      setQuestions(data.mcqs); setAnswers(Array(data.mcqs.length).fill(""));
    } catch (e: any) { setError(e.message || "Unexpected error"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (selectedChapter && !questions && !loading && !submitted && !error) {
      generateQuestions();
    }
  }, [selectedChapter, questions, loading, submitted, error, variationSeed]);

  if (!classNum || !subject) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-white">Please select a class and subject first.</div>
      </main>
    );
  }

  // Set chapter from URL param if available
  useEffect(() => {
    if (chapterParam && chapterParam !== selectedChapter) {
      setSelectedChapter(chapterParam);
    }
  }, [chapterParam]);

  // Redirect to inspired page if no chapter is selected
  useEffect(() => {
    if (!selectedChapter && !chapterParam && classNum && subject) {
      router.replace('/inspired');
    }
  }, [selectedChapter, chapterParam, classNum, subject, router]);

  if (!selectedChapter) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-white">Redirecting to test selection...</div>
      </main>
    );
  }

  if (loading || !questions) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm w-full max-w-lg min-h-[7rem] flex flex-col items-center justify-center p-12 text-lg text-gray-900 dark:text-white">
          {error ? error : "Generating your test…"}
        </motion.div>
      </main>
    );
  }

  function handleAnswer(i: number, optIdx: number) { setAnswers(prev => prev.map((a, idx) => idx === i ? String(optIdx) : a)); }
  function handleSubmit(e: any) {
    e.preventDefault();
    let correct = 0; 
    if (questions) {
      questions.forEach((q, i) => { 
        const ans = answers[i];
        if (ans !== "" && !isNaN(parseInt(ans)) && parseInt(ans) === q.correct) {
          correct++; 
        }
      });
    }
    const percent = Math.round((correct / (questions?.length || 1)) * 100); 
    setScore(percent); 
    setSubmitted(true);
    const tests = JSON.parse(localStorage.getItem("ncert-tests") || "[]");
    tests.push({ classNum, subject, chapter: selectedChapter, score: percent, date: Date.now(), user: (typeof window!=='undefined' && localStorage.getItem('ncert-user'))?JSON.parse(localStorage.getItem('ncert-user') as string).name: "Guest" });
    localStorage.setItem("ncert-tests", JSON.stringify(tests));
    // Dispatch custom event to notify dashboard of new test
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('testSubmitted'));
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Confetti show={showConfetti} />
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/inspired')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <BookOpenIcon className="w-8 h-8 text-gray-900 dark:text-white" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NCERT MCQ</h1>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.form initial={{opacity:0, y:35}} animate={{opacity:1, y:0}} transition={{duration:.7}} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-7" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpenIcon className="w-8 h-8 text-gray-700 dark:text-gray-300"/>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {subject}, Class {classNum} {stream && `(${stream})`}
            </h2>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Chapter: <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium">{selectedChapter}</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              difficulty === 'Easy' ? 'bg-green-500 text-white' :
              difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {difficulty}
            </span>
          </div>
          {questions.map((q, i) => {
            const userAnswerRaw = answers[i];
            const userAnswer = userAnswerRaw !== "" && !isNaN(parseInt(userAnswerRaw)) ? parseInt(userAnswerRaw) : null;
            const isCorrect = userAnswer !== null && userAnswer === q.correct;
            const showResults = submitted;
            
            return (
              <div key={i} className={`mb-4 rounded-lg px-4 py-3 border-2 transition ${
                showResults 
                  ? isCorrect 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600" 
                    : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600"
                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              }`}>
                <div className="mb-3 font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-base sm:text-lg flex-1 text-gray-900 dark:text-white">Q{i+1}. {q.q}</span>
                  {showResults && (
                    <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      isCorrect 
                        ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200" 
                        : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                    }`}>
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  {q.options.map((opt: string, idx: number) => {
                    const isUserChoice = userAnswer !== null && userAnswer === idx;
                    const isCorrectAnswer = q.correct === idx;
                    let bgClass = "";
                    let borderClass = "";
                    let icon = "";
                    
                    if (showResults) {
                      if (isCorrectAnswer) {
                        bgClass = "bg-green-100 dark:bg-green-900/30";
                        borderClass = "border-green-500 dark:border-green-400";
                        icon = "✓";
                      } else if (isUserChoice && !isCorrect) {
                        bgClass = "bg-red-100 dark:bg-red-900/30";
                        borderClass = "border-red-500 dark:border-red-400";
                        icon = "✗";
                      }
                    } else if (isUserChoice) {
                      bgClass = "bg-gray-100 dark:bg-gray-600";
                      borderClass = "border-gray-900 dark:border-gray-300";
                    }
                    
                    return (
                      <label 
                        key={idx} 
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg transition border-2 ${bgClass} ${borderClass} ${
                          !submitted ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600" : "cursor-default"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q${i}`} 
                          value={idx} 
                          checked={answers[i] === String(idx)} 
                          onChange={()=>handleAnswer(i, idx)} 
                          disabled={submitted} 
                          className="accent-gray-900 dark:accent-gray-300 w-5 h-5 flex-shrink-0"
                        />
                        <span className="font-semibold text-gray-900 dark:text-white min-w-[24px] text-base">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="flex-1 text-base text-gray-900 dark:text-white break-words">{opt}</span>
                        {showResults && icon && (
                          <span className={`font-bold text-lg flex-shrink-0 ${
                            isCorrectAnswer ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                          }`}>
                            {icon}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {showResults && q.explanation && (
                  <div className={`mt-3 p-4 rounded-lg border-2 ${
                    isCorrect 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                      : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                  }`}>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className={isCorrect ? "text-green-800 dark:text-green-300" : "text-yellow-800 dark:text-yellow-300"}>
                        {isCorrect ? "✓ Explanation:" : "💡 Correct Answer Explanation:"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{q.explanation}</p>
                    {!isCorrect && (
                      <div className="mt-2 pt-2 border-t border-yellow-300 dark:border-yellow-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                          <span className="text-red-700 dark:text-red-300 font-semibold">You selected:</span> {userAnswer !== null && q.options[userAnswer] ? q.options[userAnswer] : "No answer selected"} • 
                          <span className="text-green-700 dark:text-green-300 font-semibold ml-1">Correct:</span> {q.options[q.correct]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {!submitted && (
            <motion.button 
              type="submit" 
              whileHover={{scale:1.02}} 
              whileTap={{scale:.98}} 
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg sm:text-xl mt-4 py-4 w-full rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md"
            >
              Submit Test
            </motion.button>
          )}
          {submitted && (
            <motion.div 
              initial={{scale:0.94, opacity:0}} 
              animate={{scale:1, opacity:1}} 
              className="mt-6 flex flex-col items-center gap-4"
            >
              <div className={`text-3xl sm:text-4xl font-extrabold countup flex items-center gap-2 text-center ${
                score !== null && score >= 90 ? "text-green-600 dark:text-green-400" : score !== null && score >= 70 ? "text-blue-600 dark:text-blue-400" : score !== null && score >= 50 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
              }`}>
                Your Score: <span className="ml-2">{score}%</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <motion.button
                  onClick={async () => {
                    setSubmitted(false);
                    setScore(null);
                    setAnswers([]);
                    setShowConfetti(false);
                    setQuestions(null);
                    setError(null);
                    await generateQuestions(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  whileHover={{scale:1.02}}
                  whileTap={{scale:.98}}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-base sm:text-lg px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md w-full sm:w-auto"
                >
                  🔄 Re-attempt Test (New Questions)
                </motion.button>
                <motion.button
                  onClick={() => router.push('/inspired')}
                  whileHover={{scale:1.02}}
                  whileTap={{scale:.98}}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 text-base sm:text-lg px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Back to Test Page
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.form>
      </div>
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </main>
    }>
      <TestPageContent />
    </Suspense>
  );
}