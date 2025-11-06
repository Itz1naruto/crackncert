import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const missingConfig = [];
if (!firebaseConfig.apiKey) missingConfig.push('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!firebaseConfig.authDomain) missingConfig.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
if (!firebaseConfig.projectId) missingConfig.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
if (!firebaseConfig.storageBucket) missingConfig.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
if (!firebaseConfig.messagingSenderId) missingConfig.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
if (!firebaseConfig.appId) missingConfig.push('NEXT_PUBLIC_FIREBASE_APP_ID');

if (missingConfig.length > 0) {
  const errorMsg = `❌ FIREBASE CONFIGURATION ERROR:\n\nMissing environment variables:\n${missingConfig.join('\n')}\n\nPlease add these to your .env.local file.\n\nGet your Firebase config from:\nFirebase Console → Project Settings → General → Your apps → Web app`;
  console.error(errorMsg);
  if (typeof window !== 'undefined') {
    alert(errorMsg);
  }
}

// Initialize Firebase
let app: FirebaseApp;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] ✅ Firebase initialized successfully');
  } else {
    app = getApps()[0];
    console.log('[Firebase] ✅ Using existing Firebase app');
  }
} catch (error: any) {
  console.error('[Firebase] ❌ Firebase initialization failed:', error);
  const errorMsg = `❌ FIREBASE INITIALIZATION FAILED:\n\n${error.message}\n\nPlease check your Firebase configuration in .env.local`;
  if (typeof window !== 'undefined') {
    alert(errorMsg);
  }
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

// Export config check function
export function checkFirebaseConfig(): { valid: boolean; missing: string[] } {
  return {
    valid: missingConfig.length === 0,
    missing: missingConfig
  };
}

