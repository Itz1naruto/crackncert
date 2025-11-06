"use client";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircleIcon, BookOpenIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AIChatButton } from "@/components/ui/ai-chat-button";

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center animate-fadein">{[...Array(36)].map((_,i)=>(<motion.div key={i} className="absolute rounded-full" style={{background:i%3?"#8b5cf6":"#22d3ee",width:12+i%2*9,height:12+i%5*7,top:Math.random()*95+2+'%',left:Math.random()*97+1+'%',opacity:.75}} initial={{y:-80,scale:0.6+Math.random()*0.6}} animate={{y:[-80,360+Math.random()*120],opacity:[.9,0],x:[0,(Math.random()-.5)*90],rotate:0.4+Math.random()*260}} transition={{duration:1.55+Math.random(),delay:Math.random()/2}} />))}</div>;
}

export default function DashboardPage() {
  const { user, isGuest, signOut } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [showConfetti,setShowConfetti]=useState(false);
  const router = useRouter();

  const loadTests = () => {
    const vals = JSON.parse(localStorage.getItem("ncert-tests") || "[]");
    // Remove duplicates: keep the most recent entry for each class/subject/chapter combination
    const uniqueTests = new Map();
    vals.forEach((test: any) => {
      const key = `${test.classNum}-${test.subject}-${test.chapter}`;
      const existing = uniqueTests.get(key);
      // Keep the most recent one (higher date or later in array)
      if (!existing || (test.date && existing.date && test.date > existing.date) || (!existing.date && !test.date)) {
        uniqueTests.set(key, test);
      }
    });
    const uniqueArray = Array.from(uniqueTests.values()).reverse();
    setTests(uniqueArray);
    setShowConfetti(uniqueArray.some((t:any) => t.score===100));
  };

  useEffect(() => {
    loadTests();
    
    // Listen for storage changes (when new tests are added from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ncert-tests') {
        loadTests();
      }
    };
    
    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorage = () => {
      loadTests();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('testSubmitted', handleCustomStorage);
    
    // Also reload when the page becomes visible (in case user navigated back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTests();
      }
    };
    
    // Reload when window gains focus (user switches back to tab)
    const handleFocus = () => {
      loadTests();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('testSubmitted', handleCustomStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!user && !isGuest) {
      router.replace("/");
    }
  }, [user, isGuest, router]);

  function handleRetake(test: any) { 
    router.push(`/test?class=${test.classNum}&subject=${encodeURIComponent(test.subject)}${test.difficulty ? `&difficulty=${test.difficulty}` : '&difficulty=Medium'}`); 
  }
  
  if (!user && !isGuest) {
    return null;
  }

  const userName = user?.name || (isGuest ? 'Guest User' : 'User');
  const userLabel = isGuest ? '(Guest)' : '';

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <AnimatedButton
                onClick={() => router.push('/inspired')}
                animation="slideOut"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </AnimatedButton>
              <BookOpenIcon className="w-8 h-8 text-gray-900 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crack NCERT</h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <ThemeToggle />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {userName} {userLabel}
              </span>
              <AnimatedButton
                onClick={signOut}
                animation="blurSlideOut"
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Sign out
              </AnimatedButton>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Confetti show={showConfetti}/>
        <motion.div 
          initial={{opacity:0, y:30}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:.7}} 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8 md:p-10"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <UserCircleIcon className="w-10 h-11 text-gray-700 dark:text-gray-300 flex-shrink-0" />
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{user?.name || "Guest"}</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Dashboard · Test Results</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="overflow-x-auto w-full"
          >
            <table className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Class</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Subject</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Chapter</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Score (%)</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tests.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={5} className="text-gray-600 dark:text-gray-400 text-center py-12 text-base">
                        No tests attempted yet.
                      </td>
                    </motion.tr>
                  ) : tests.map((test, i) => (
                    <motion.tr 
                      key={`${test.classNum}-${test.subject}-${test.chapter}-${test.date || i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="py-3 px-4 font-medium text-sm text-gray-900 dark:text-white">{test.classNum}</td>
                      <td className="py-3 px-4 font-medium text-sm text-gray-900 dark:text-white break-words">{test.subject}</td>
                      <td className="py-3 px-4 font-medium text-sm text-gray-900 dark:text-white break-words">{test.chapter}</td>
                      <td className="py-3 px-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            test.score === 100 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                              : test.score >= 70 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                              : test.score >= 50 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {test.score}%
                        </motion.span>
                      </td>
                      <td className="py-3 px-4">
                        <AnimatedButton
                          onClick={() => handleRetake(test)}
                          animation="blurSlideIn"
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
                        >
                          Retake
                          <ArrowRightIcon className="w-4 h-4" />
                        </AnimatedButton>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating AI Chat Button */}
      <AIChatButton />
    </main>
  );
}