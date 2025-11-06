"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BuildingOfficeIcon, HeartIcon, UsersIcon, SparklesIcon, AcademicCapIcon, BookOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CompanyPage() {
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
            <BuildingOfficeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">About Us</h1>
            <p className="text-base sm:text-lg text-gray-600">Empowering students through AI-driven learning</p>
          </div>

          <motion.div 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.1}}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 md:p-10 mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4 text-gray-600">
              Crack NCERT is dedicated to making quality education accessible to every student in India. 
              We leverage cutting-edge AI technology to provide personalized, chapter-wise MCQ tests aligned 
              with the NCERT curriculum, helping students practice, learn, and excel in their studies.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600">
              Our platform is designed to be intuitive, engaging, and effective—ensuring that learning is 
              not just productive but also enjoyable for students of all ages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.2}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Innovation</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We use advanced AI to generate unique, relevant questions that adapt to each student's learning journey, 
                making test preparation more effective and engaging.
              </p>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.3}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <HeartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Accessibility</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Education should be available to everyone. Our platform is free to use and accessible on any device, 
                ensuring no student is left behind.
              </p>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.4}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Student-Focused</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Every feature is designed with students in mind. From instant feedback to detailed explanations, 
                we ensure that learning is clear, comprehensive, and effective.
              </p>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.5}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <AcademicCapIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Quality Education</h3>
              <p className="text-sm sm:text-base text-gray-600">
                All content is aligned with NCERT standards, ensuring students get accurate, curriculum-relevant 
                practice questions that directly support their academic goals.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Join Our Community</h2>
            <p className="text-sm sm:text-base mb-4 text-gray-600">
              Thousands of students across India are already using Crack NCERT to improve their test scores 
              and deepen their understanding. Join us today and take your learning to the next level!
            </p>
            <Link href="/auth/signup" className="bg-gray-900 text-white inline-flex items-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-4">
              Get Started Free
            </Link>
          </motion.div>

          <motion.div 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.7}}
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