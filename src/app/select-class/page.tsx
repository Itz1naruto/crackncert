"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AcademicCapIcon, BookOpenIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AIChatButton } from "@/components/ui/ai-chat-button";

const CLASSES = [6, 7, 8, 9, 10, 11, 12]; // Only classes 6-12
const SUBJECTS = ["Hindi","Urdu","Sanskrit","English","Science","Social Studies (SST)","Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const STREAMS = ["PCB", "PCM"] as const;

export default function SelectClassPage() {
  const { user, isGuest } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<0|1|2>(0);
  const [selectedClass, setSelectedClass] = useState<number|null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string|null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<typeof DIFFICULTIES[number] | null>(null);
  const [selectedStream, setSelectedStream] = useState<typeof STREAMS[number] | null>(null);

  // Redirect to new UI page
  useEffect(() => {
    router.replace("/inspired");
  }, [router]);

  useEffect(() => { if (!user && !isGuest) router.replace("/"); }, [user, isGuest, router]);

  function handleClass(cls: number) { 
    setSelectedClass(cls); 
    setStep(1); // Go to subject + difficulty selection
    setSelectedSubject(null);
    setSelectedDifficulty(null);
    setSelectedStream(null);
  }
  
  function handleSubject(subj: string) { 
    setSelectedSubject(subj); 
    // If Science and class 11+, need to select stream first, otherwise go to final step
    if (subj === 'Science' && selectedClass && selectedClass >= 11) {
      setStep(2);
    } else {
      // Can proceed if difficulty is selected
      if (selectedDifficulty) {
        handleStart();
      }
    }
  }
  
  function handleDifficulty(diff: typeof DIFFICULTIES[number]) {
    setSelectedDifficulty(diff);
    // If subject is already selected and not Science 11+, can proceed
    if (selectedSubject && !(selectedSubject === 'Science' && selectedClass && selectedClass >= 11)) {
      handleStart();
    }
  }
  
  function handleStream(stream: typeof STREAMS[number]) {
    setSelectedStream(stream);
    // If difficulty is already selected, can proceed
    if (selectedDifficulty) {
      handleStart();
    }
  }
  
  function handleStart() { 
    if (selectedClass && selectedSubject && selectedDifficulty) {
      const params = new URLSearchParams({
        class: selectedClass.toString(),
        subject: selectedSubject,
        difficulty: selectedDifficulty,
        ...(selectedStream && { stream: selectedStream }),
      });
      router.push(`/test?${params.toString()}`);
    }
  }

  const userName = user?.name || (isGuest ? 'Guest User' : 'User');
  const userLabel = isGuest ? '(Guest)' : '';
  const showStreamSelection = selectedSubject === 'Science' && selectedClass && selectedClass >= 11;
  const canProceed = selectedSubject && selectedDifficulty && (!showStreamSelection || selectedStream);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NCERT MCQ</h1>
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
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.section 
          initial={{opacity:0, y:50}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:.8}} 
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 md:gap-10 items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2 mb-2 w-full text-center"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <AcademicCapIcon className="w-12 h-12 text-gray-700 dark:text-gray-300 mb-2" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Select Test Options
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
            >
              Pick your options to start a test
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-semibold text-lg sm:text-xl text-center text-gray-900 dark:text-white mb-6"
                >
                  Choose your class
                </motion.div>
                <div className="w-full flex flex-wrap gap-3 justify-center">
                  {CLASSES.map((cls, idx) => (
                    <motion.div
                      key={cls}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, type: "spring", stiffness: 200 }}
                    >
                      <AnimatedButton
                        onClick={()=>handleClass(cls)}
                        animation="bounce"
                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                          selectedClass===cls
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        Class {cls}
                      </AnimatedButton>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && selectedClass && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <AnimatedButton
                  onClick={()=>setStep(0)}
                  animation="blurSlideOut"
                  className="mb-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base font-semibold hover:text-gray-900 dark:hover:text-white hover:underline flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to class
                </AnimatedButton>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Class {selectedClass} Selected
                  </div>
                  
                  {/* Subject Selection */}
                  <div className="mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="font-semibold text-lg sm:text-xl text-center text-gray-900 dark:text-white mb-4"
                    >
                      Choose Subject:
                    </motion.div>
                    <div className="w-full flex flex-wrap gap-3 justify-center">
                      {SUBJECTS.map((subj, idx) => (
                        <motion.div
                          key={subj}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.15 + idx * 0.05, type: "spring", stiffness: 200 }}
                        >
                          <AnimatedButton
                            onClick={()=>handleSubject(subj)}
                            animation="slideIn"
                            className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                              selectedSubject===subj
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {subj}
                          </AnimatedButton>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-semibold text-lg sm:text-xl text-center text-gray-900 dark:text-white mb-4"
                    >
                      Choose Difficulty:
                    </motion.div>
                    <div className="w-full flex flex-wrap gap-3 justify-center">
                      {DIFFICULTIES.map((diff, idx) => (
                        <motion.div
                          key={diff}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.35 + idx * 0.05, type: "spring", stiffness: 200 }}
                        >
                          <AnimatedButton
                            onClick={()=>handleDifficulty(diff)}
                            animation="blurSlideIn"
                            className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                              selectedDifficulty===diff
                                ? diff === 'Easy' ? 'bg-green-600 text-white shadow-md'
                                : diff === 'Medium' ? 'bg-yellow-600 text-white shadow-md'
                                : 'bg-red-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {diff}
                          </AnimatedButton>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stream Selection for Science Class 11+ */}
                  {showStreamSelection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.5 }}
                      className="mt-8"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="font-semibold text-lg sm:text-xl text-center text-gray-900 dark:text-white mb-4"
                      >
                        Choose Stream:
                      </motion.div>
                      <div className="w-full flex flex-wrap gap-3 justify-center">
                        {STREAMS.map((stream, idx) => (
                          <motion.div
                            key={stream}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.65 + idx * 0.05, type: "spring", stiffness: 200 }}
                          >
                            <AnimatedButton
                              onClick={()=>handleStream(stream)}
                              animation="bounce"
                              className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                                selectedStream===stream
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                              }`}
                            >
                              {stream}
                            </AnimatedButton>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Start Button - appears when all required selections are made */}
                  {canProceed && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="mt-8 w-full flex flex-col gap-4 items-center"
                    >
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                        className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2"
                      >
                        Class {selectedClass} · {selectedSubject} {selectedStream && `(${selectedStream})`} · {selectedDifficulty}
                      </motion.div>
                      <AnimatedButton
                        onClick={handleStart}
                        animation="blurSlideIn"
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-full max-w-md text-lg sm:text-xl py-4 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        Start Your Test
                        <ArrowRightIcon className="w-5 h-5" />
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={()=>setStep(0)}
                        animation="slideOut"
                        className="mt-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-base flex items-center gap-2"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Start Over
                      </AnimatedButton>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {step === 2 && showStreamSelection && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <AnimatedButton
                  onClick={()=>setStep(1)}
                  animation="blurSlideOut"
                  className="-mb-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base font-semibold hover:text-gray-900 dark:hover:text-white hover:underline flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
                </AnimatedButton>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-semibold text-lg sm:text-xl text-center text-gray-900 dark:text-white mb-6"
                >
                  Choose your stream:
                </motion.div>
                <div className="w-full flex flex-wrap gap-3 justify-center">
                  {STREAMS.map((stream, idx) => (
                    <motion.div
                      key={stream}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <AnimatedButton
                        onClick={()=>handleStream(stream)}
                        animation="blurSlideIn"
                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all ${
                          selectedStream===stream
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {stream}
                      </AnimatedButton>
                    </motion.div>
                  ))}
                </div>
                {selectedStream && selectedDifficulty && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <AnimatedButton
                      onClick={handleStart}
                      animation="blurSlideIn"
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-full text-lg sm:text-xl py-4 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md"
                    >
                      Start Your Test
                    </AnimatedButton>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
      
      {/* Floating AI Chat Button */}
      <AIChatButton />
    </main>
  );
}