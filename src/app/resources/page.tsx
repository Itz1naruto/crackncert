"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenIcon, DocumentTextIcon, AcademicCapIcon, QuestionMarkCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <BookOpenIcon className="w-8 h-8 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900">Crack NCERT</h1>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
          <div className="text-center mb-8 sm:mb-12">
            <BookOpenIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">Product Resources</h1>
            <p className="text-base sm:text-lg text-gray-600">Everything you need to get started with Crack NCERT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.1}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Getting Started Guide</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Learn how to create your first test, track your progress, and maximize your learning with our step-by-step guide.</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li>• How to select class and subject</li>
                <li>• Understanding test results</li>
                <li>• Using the dashboard</li>
                <li>• Guest vs. registered accounts</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.2}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <AcademicCapIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">NCERT Syllabus</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Comprehensive coverage of NCERT curriculum for Classes 1-12 across all subjects.</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li>• All NCERT chapters included</li>
                <li>• Class-wise organization</li>
                <li>• Subject-wise breakdown</li>
                <li>• Regular syllabus updates</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.3}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <QuestionMarkCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">FAQs</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Find answers to commonly asked questions about Crack NCERT.</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li>• How are questions generated?</li>
                <li>• Can I retake tests?</li>
                <li>• Is my data saved?</li>
                <li>• Mobile app availability</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.4}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Study Tips</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Effective strategies to improve your test scores and understanding.</p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li>• Regular practice techniques</li>
                <li>• Understanding explanations</li>
                <li>• Time management tips</li>
                <li>• Revision strategies</li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.5}}
            className="text-center"
          >
            <Link href="/inspired" className="bg-gray-900 text-white inline-flex items-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}