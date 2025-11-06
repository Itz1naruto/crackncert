"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScaleIcon, ShieldCheckIcon, LockClosedIcon, DocumentTextIcon, BookOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LegalPage() {
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
            <ScaleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">Legal & Privacy</h1>
            <p className="text-base sm:text-lg text-gray-600">Terms, Privacy Policy, and User Rights</p>
          </div>

          <div className="space-y-6 sm:space-y-8 mb-8">
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.1}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Terms of Service</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p><strong className="text-gray-900">Acceptance of Terms:</strong> By using Crack NCERT, you agree to be bound by these Terms of Service.</p>
                <p><strong className="text-gray-900">Service Description:</strong> Crack NCERT provides AI-generated MCQ tests for educational purposes based on NCERT curriculum.</p>
                <p><strong className="text-gray-900">User Responsibilities:</strong> Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
                <p><strong className="text-gray-900">Prohibited Uses:</strong> You may not use the service for any unlawful purpose or to violate any laws, or to infringe upon the rights of others.</p>
                <p><strong className="text-gray-900">Limitation of Liability:</strong> Crack NCERT is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.2}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <LockClosedIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Privacy Policy</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p><strong className="text-gray-900">Data Collection:</strong> We collect minimal data necessary to provide our services, including account information and test results stored locally in your browser.</p>
                <p><strong className="text-gray-900">Local Storage:</strong> Test results and progress are stored locally on your device using browser localStorage. This data is not transmitted to our servers.</p>
                <p><strong className="text-gray-900">Third-Party Services:</strong> We use AI services (Gemini API) to generate questions. These services may process prompts but do not store personal information.</p>
                <p><strong className="text-gray-900">Data Security:</strong> We implement reasonable security measures to protect your information, though no method of transmission over the internet is 100% secure.</p>
                <p><strong className="text-gray-900">Your Rights:</strong> You have the right to access, modify, or delete your account information at any time. Guest users' data is stored only locally.</p>
                <p><strong className="text-gray-900">Children's Privacy:</strong> Our service is designed for educational use. We do not knowingly collect personal information from children under 13 without parental consent.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.3}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Intellectual Property</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p><strong className="text-gray-900">Content Ownership:</strong> All content on Crack NCERT, including but not limited to text, graphics, logos, and software, is the property of Crack NCERT or its content suppliers.</p>
                <p><strong className="text-gray-900">NCERT Curriculum:</strong> We reference NCERT syllabus and curriculum content for educational purposes. NCERT is the official curriculum provider and retains all rights to their content.</p>
                <p><strong className="text-gray-900">AI-Generated Content:</strong> Questions generated by our AI system are provided for educational practice. Users may not redistribute or commercialize generated content without permission.</p>
                <p><strong className="text-gray-900">User-Generated Content:</strong> By using our service, you grant us a license to use, modify, and display test results and progress data for service improvement purposes.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.4}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Disclaimers</h2>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p><strong className="text-gray-900">Educational Use:</strong> Crack NCERT is provided for educational and practice purposes only. Results are not official exam scores or certifications.</p>
                <p><strong className="text-gray-900">Content Accuracy:</strong> While we strive for accuracy, AI-generated content may contain errors. We recommend cross-referencing with official NCERT materials.</p>
                <p><strong className="text-gray-900">Service Availability:</strong> We do not guarantee uninterrupted or error-free service. The service may be temporarily unavailable due to maintenance or technical issues.</p>
                <p><strong className="text-gray-900">Modifications:</strong> We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.5}}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Contact Information</h2>
              <p className="text-sm sm:text-base mb-4 text-gray-600">
                If you have any questions about these Terms, Privacy Policy, or our practices, please contact us through the platform.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
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