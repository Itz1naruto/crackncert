'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpenIcon, ArrowRightIcon, SparklesIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { user, isGuest, continueAsGuest, signIn, signUp } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const cardY = useTransform(scrollYProgress, [0, 0.6], [100, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.9, 1, 1]);

  // Don't auto-redirect - allow users to visit landing page even if authenticated
  // Users can manually navigate to /inspired if they want to start testing

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;
    signIn(signInEmail, signInPassword);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) return;
    signUp(signUpName, signUpEmail, signUpPassword);
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Navigation Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <BookOpenIcon className="w-8 h-8 text-gray-900 dark:text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NCERT MCQ</h1>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <ThemeToggle />
              {user || isGuest ? (
                <AnimatedButton
                  onClick={() => router.push('/inspired')}
                  animation="bounce"
                  className="px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Start Testing
                </AnimatedButton>
              ) : (
                <>
                  <AnimatedButton
                    onClick={() => {
                      setShowSignIn(true);
                      setShowSignUp(false);
                      const card = document.getElementById('auth-card');
                      if (card) {
                        setTimeout(() => {
                          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }
                    }}
                    animation="blurSlideIn"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => {
                      setShowSignUp(true);
                      setShowSignIn(false);
                      const card = document.getElementById('auth-card');
                      if (card) {
                        setTimeout(() => {
                          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }
                    }}
                    animation="bounce"
                    className="px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </AnimatedButton>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white text-center">
              Master
            </div>
            <div className="h-24 sm:h-32 md:h-40 lg:h-48 flex items-center justify-center">
              <GooeyText
                texts={["NCERT", "Science", "Mathematics", "English", "History", "NCERT"]}
                morphTime={1.5}
                cooldownTime={0.25}
                className="inline-block"
                textClassName="font-bold"
              />
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white text-center">
              with Smart MCQ Tests
            </div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Practice questions from Class 6 to 12, track your progress, and compete with students nationwide
        </motion.p>
      </motion.section>

      {/* Central Call-to-Action Card */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <motion.div
          id="auth-card"
          style={{ y: cardY, opacity: cardOpacity, scale: cardScale }}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, type: 'spring' }}
          className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 sm:p-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
              <BookOpenIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </motion.div>

          {/* Sign In Form */}
          {showSignIn && !showSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="flex justify-center mb-4">
                <UserIcon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Sign In
              </h2>
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-base"
                />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-base"
                />
                <AnimatedButton
                  type="submit"
                  animation="blurSlideIn"
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Sign In
                  <LockClosedIcon className="w-5 h-5" />
                </AnimatedButton>
              </form>
              <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                New user?{' '}
                <button
                  onClick={() => {
                    setShowSignUp(true);
                    setShowSignIn(false);
                  }}
                  className="text-gray-900 dark:text-gray-100 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )}

          {/* Sign Up Form */}
          {showSignUp && !showSignIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4"
              >
                Sign Up to Start Testing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-8"
              >
                Create an account to access thousands of NCERT MCQ tests and track your progress.
              </motion.p>
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  placeholder="Name"
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-base"
                />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-base"
                />
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-gray-400 focus:outline-none text-base"
                />
                <AnimatedButton
                  type="submit"
                  animation="blurSlideIn"
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRightIcon className="w-5 h-5" />
                </AnimatedButton>
              </form>
              <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignIn(true);
                    setShowSignUp(false);
                  }}
                  className="text-gray-900 dark:text-gray-100 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}

          {/* Default View - When no form is selected */}
          {!showSignIn && !showSignUp && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4"
              >
                Sign Up to Start Testing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-8"
              >
                Create an account to access thousands of NCERT MCQ tests and track your progress.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <AnimatedButton
                  onClick={() => {
                    setShowSignIn(true);
                    setShowSignUp(false);
                  }}
                  animation="slideIn"
                  className="flex-1 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  Sign In
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => {
                    setShowSignUp(true);
                    setShowSignIn(false);
                  }}
                  animation="blurSlideIn"
                  className="flex-1 px-6 py-3 text-base font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Sign Up Now
                  <ArrowRightIcon className="w-5 h-5" />
                </AnimatedButton>
              </motion.div>
            </>
          )}

          {/* Guest Option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>
            <AnimatedButton
              onClick={continueAsGuest}
              animation="bounce"
              className="w-full mt-6 px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Continue as Guest
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}