'use client';

import { BookOpenIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from './animated-button';

interface TestCardProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  classNum: number;
  questions: number;
  duration: number; // in minutes
  attempts: number;
  chapter?: string;
  stream?: string;
}

export function TestCard({
  title,
  difficulty,
  subject,
  classNum,
  questions,
  duration,
  attempts,
  chapter,
  stream,
}: TestCardProps) {
  const router = useRouter();

  const difficultyColors = {
    Easy: 'bg-green-500 dark:bg-green-600 text-white',
    Medium: 'bg-yellow-500 dark:bg-yellow-600 text-white',
    Hard: 'bg-red-500 dark:bg-red-600 text-white',
  };

  const handleStartTest = () => {
    const params = new URLSearchParams({
      class: classNum.toString(),
      subject: subject,
      ...(chapter && { chapter: chapter }),
      ...(difficulty && { difficulty: difficulty }),
      ...(stream && { stream: stream }),
    });
    router.push(`/test?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-1">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {subject} • Class {classNum} {stream && `(${stream})`}
      </p>

      <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{questions} Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{duration} Minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{attempts} Attempts</span>
        </div>
      </div>

      <AnimatedButton
        onClick={handleStartTest}
        animation="blurSlideIn"
        className="mt-auto w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        Start Test <ArrowRightIcon className="w-4 h-4" />
      </AnimatedButton>
    </motion.div>
  );
}