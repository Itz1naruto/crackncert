'use client';
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { TextEffect } from "@/components/ui/text-effect";
import { TestCard } from "@/components/ui/test-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AIChatButton } from "@/components/ui/ai-chat-button";
import { NCERT_CHAPTERS } from "@/data/ncertChapters";

const CLASSES = [6, 7, 8, 9, 10, 11, 12]; // Only classes 6-12
const SUBJECTS = ["Hindi", "Urdu", "Sanskrit", "English", "Science", "Social Studies (SST)", "Mathematics"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const STREAMS = ["PCB", "PCM"] as const;

// Science stream chapters mapping (for classes 11-12)
const SCIENCE_STREAM_CHAPTERS: Record<string, Record<string, string[]>> = {
  "11": {
    "PCB": [
      "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
      "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
      "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Transport in Plants",
      "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development",
      "Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation",
      "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination",
      "Chemical Coordination and Integration"
    ],
    "PCM": [
      "Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane",
      "Laws of Motion", "Work, Energy and Power", "System of Particles and Rigid Body", "Gravitation",
      "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
      "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves",
      "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure", "States of Matter", "Thermodynamics", "Equilibrium",
      "Redox Reactions", "Hydrogen", "s-Block Elements", "p-Block Elements",
      "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction",
      "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations",
      "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections"
    ]
  },
  "12": {
    "PCB": [
      "Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction",
      "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance",
      "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production",
      "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications",
      "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues"
    ],
    "PCM": [
      "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity",
      "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction",
      "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments",
      "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics",
      "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principles and Processes",
      "The p-Block Elements", "The d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules",
      "Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants",
      "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals",
      "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"
    ]
  }
};

// Generate a deterministic attempts number based on test properties
function getDeterministicAttempts(classNum: number, subject: string, chapter: string, difficulty: string): number {
  const str = `${classNum}-${subject}-${chapter}-${difficulty}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 50 + (Math.abs(hash) % 200);
}

// Type for test objects
type TestItem = {
  title: string;
  difficulty: typeof DIFFICULTIES[number];
  subject: string;
  classNum: number;
  questions: number;
  duration: number;
  attempts: number;
  chapter: string;
  stream: typeof STREAMS[number] | null;
};

// Generate featured tests based on selections
function generateFeaturedTests(
  selectedClass: number | null,
  selectedSubject: string | null,
  selectedChapter: string | null,
  selectedStream: typeof STREAMS[number] | null
): TestItem[] {
  const tests: any[] = [];
  
  if (selectedClass && selectedSubject) {
    let chapters: string[] = [];
    
    // Handle Science stream chapters for classes 11-12
    if (selectedSubject === 'Science' && selectedClass >= 11 && selectedStream) {
      chapters = SCIENCE_STREAM_CHAPTERS[String(selectedClass)]?.[selectedStream] || [];
    } else {
      chapters = NCERT_CHAPTERS[String(selectedClass)]?.[selectedSubject] || [];
    }
    
    const chaptersToUse = selectedChapter ? [selectedChapter] : chapters.slice(0, 6);
    // Always show all difficulty levels
    const difficultiesToUse = DIFFICULTIES;
    
    chaptersToUse.forEach((chapter, idx) => {
      difficultiesToUse.forEach((difficulty) => {
        tests.push({
          title: `${chapter} - ${difficulty} Test`,
          difficulty: difficulty,
          subject: selectedSubject,
          classNum: selectedClass,
          questions: difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 12 : 15,
          duration: difficulty === 'Easy' ? 15 : difficulty === 'Medium' ? 18 : 20,
          attempts: getDeterministicAttempts(selectedClass, selectedSubject, chapter, difficulty),
          chapter: chapter,
          stream: selectedStream,
        });
      });
    });
  } else {
    // Default featured tests - only classes 6-12
    const defaultTests = [
      { class: 6, subject: 'English', chapter: 'Who Did Patrick\'s Homework?', difficulty: 'Easy' as const },
      { class: 7, subject: 'Science', chapter: 'Nutrition in Plants', difficulty: 'Medium' as const },
      { class: 8, subject: 'Mathematics', chapter: 'Rational Numbers', difficulty: 'Easy' as const },
      { class: 9, subject: 'Science', chapter: 'Matter in Our Surroundings', difficulty: 'Medium' as const },
      { class: 10, subject: 'Science', chapter: 'Control and Coordination', difficulty: 'Hard' as const },
      { class: 10, subject: 'Mathematics', chapter: 'Real Numbers', difficulty: 'Easy' as const },
      { class: 11, subject: 'Science', chapter: 'The Living World', difficulty: 'Medium' as const, stream: 'PCB' as const },
      { class: 12, subject: 'Science', chapter: 'Reproduction in Organisms', difficulty: 'Hard' as const, stream: 'PCB' as const },
    ];

    defaultTests.forEach((test) => {
      tests.push({
        title: `${test.chapter} - ${test.difficulty} Test`,
        difficulty: test.difficulty,
        subject: test.subject,
        classNum: test.class,
        questions: test.difficulty === 'Easy' ? 10 : test.difficulty === 'Medium' ? 12 : 15,
        duration: test.difficulty === 'Easy' ? 15 : test.difficulty === 'Medium' ? 18 : 20,
        attempts: getDeterministicAttempts(test.class, test.subject, test.chapter, test.difficulty),
        chapter: test.chapter,
        stream: ('stream' in test && test.stream) ? test.stream : null,
      });
    });
  }
  
  return tests;
}

export default function InspiredLanding() {
  const router = useRouter();
  const { user, isGuest, signOut } = useAuth();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<typeof STREAMS[number] | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we're on client side before checking auth
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated (only after mount)
  useEffect(() => {
    if (isMounted && !user && !isGuest) {
      // Double-check localStorage in case context hasn't updated yet
      const savedUser = localStorage.getItem("ncert-user");
      const guest = localStorage.getItem("ncert-guest");
      if (!savedUser && !guest) {
        router.push("/");
      }
    }
  }, [user, isGuest, router, isMounted]);

  const availableChapters = useMemo(() => {
    if (!selectedClass || !selectedSubject) return [];
    
    // Handle Science stream chapters for classes 11-12
    if (selectedSubject === 'Science' && selectedClass >= 11 && selectedStream) {
      return SCIENCE_STREAM_CHAPTERS[String(selectedClass)]?.[selectedStream] || [];
    }
    
    return NCERT_CHAPTERS[String(selectedClass)]?.[selectedSubject] || [];
  }, [selectedClass, selectedSubject, selectedStream]);

  const featuredTests = useMemo(() => {
    return generateFeaturedTests(selectedClass, selectedSubject, selectedChapter, selectedStream);
  }, [selectedClass, selectedSubject, selectedChapter, selectedStream]);

  const userName = user?.name || (isGuest ? 'Guest User' : 'User');
  const userLabel = isGuest ? '(Guest)' : '';
  const isScienceClass11Plus = selectedSubject === 'Science' && selectedClass && selectedClass >= 11;

  function handleDashboard() {
    if (user || isGuest) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  // Show loading state while mounting/checking auth
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-lg text-gray-900 dark:text-white">Loading...</p>
        </div>
      </main>
    );
  }

  // If not authenticated after mount, show nothing (will redirect)
  if (!user && !isGuest) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-8 h-8 text-gray-900 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crack NCERT</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {userName} {userLabel}
              </span>
              <AnimatedButton
                onClick={handleDashboard}
                animation="slideIn"
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-semibold shadow-md"
              >
                Dashboard
                <ArrowRightIcon className="w-4 h-4" />
              </AnimatedButton>
              <AnimatedButton
                onClick={signOut}
                animation="blurSlideOut"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Sign Out
              </AnimatedButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="mb-4">
            <TextEffect per="word" as="h1" preset="slide" className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Master NCERT with Smart MCQ Tests
            </TextEffect>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Practice questions from Class 6 to 12, track your progress, and compete with students nationwide
          </p>
        </section>

        {/* Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 sm:mb-12 overflow-hidden"
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-4"
              >
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Select Your Test
                </motion.h2>
                <AnimatedButton
                  onClick={() => setShowFilters(false)}
                  animation="slideOut"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  Hide Filters
                </AnimatedButton>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">Class</label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={selectedClass || ''}
                      onChange={(e) => {
                        setSelectedClass(e.target.value ? Number(e.target.value) : null);
                        setSelectedSubject(null);
                        setSelectedChapter(null);
                        setSelectedStream(null);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select Class</option>
                      {CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          Class {cls}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">Subject</label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={selectedSubject || ''}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value || null);
                        setSelectedChapter(null);
                        setSelectedStream(null);
                      }}
                      disabled={!selectedClass}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      <option value="">Select Subject</option>
                      {SUBJECTS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>
                </div>
              
                {/* Stream selection for Science Class 11+ */}
                <AnimatePresence>
                  {isScienceClass11Plus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 overflow-hidden"
                    >
                      <motion.label 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2"
                      >
                        Stream
                      </motion.label>
                      <div className="flex gap-3">
                        {STREAMS.map((stream, idx) => (
                          <motion.div
                            key={stream}
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                          >
                            <AnimatedButton
                              onClick={() => {
                                setSelectedStream(selectedStream === stream ? null : stream);
                                setSelectedChapter(null);
                              }}
                              animation="bounce"
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedStream === stream
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-400'
                              }`}
                            >
                              {stream}
                            </AnimatedButton>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">Chapter</label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    value={selectedChapter || ''}
                    onChange={(e) => setSelectedChapter(e.target.value || null)}
                    disabled={!!(!selectedClass || !selectedSubject || availableChapters.length === 0 || (isScienceClass11Plus && selectedStream === null))}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    <option value="">Select Chapter</option>
                    {availableChapters.map((chapter, idx) => (
                      <option key={`${idx}-${chapter}`} value={chapter}>
                        Chapter {idx + 1}: {chapter}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <AnimatedButton
                onClick={() => setShowFilters(true)}
                animation="blurSlideIn"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Show Filters
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Tests Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {selectedClass && selectedSubject
              ? `Tests for Class ${selectedClass} - ${selectedSubject}${selectedStream ? ` (${selectedStream})` : ''}`
              : 'Featured Tests'}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredTests.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1, type: "spring", stiffness: 200 }}
              >
                <TestCard
                  title={test.title}
                  difficulty={test.difficulty}
                  subject={test.subject}
                  classNum={test.classNum}
                  questions={test.questions}
                  duration={test.duration}
                  attempts={test.attempts}
                  chapter={test.chapter}
                  stream={test.stream || undefined}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
      
      {/* Floating AI Chat Button - only show if user is signed in or guest */}
      {(user || isGuest) && <AIChatButton />}
    </main>
  );
}