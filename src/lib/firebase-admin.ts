import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;

// Initialize Firebase Admin
try {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    // Try to use service account credentials if available
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Parse service account key from environment variable (JSON string)
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
        }, 'admin');
        console.log('[Firebase Admin] ✅ Initialized with service account');
      } catch (parseError) {
        console.error('[Firebase Admin] Failed to parse service account key:', parseError);
      }
    }
    
    // Fallback: Initialize with project ID only (limited functionality)
    if (!adminApp && projectId) {
      adminApp = initializeApp({
        projectId: projectId,
      }, 'admin');
      console.log('[Firebase Admin] ⚠️ Initialized with project ID only (password reset may not work)');
      console.log('[Firebase Admin] 💡 For full functionality, add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local');
    }
    
    if (!adminApp) {
      console.warn('[Firebase Admin] ❌ Could not initialize. Admin features will not work.');
    }
  } else {
    adminApp = getApps()[0];
  }
} catch (error: any) {
  console.error('[Firebase Admin] ❌ Initialization failed:', error.message);
  adminApp = null;
}

export const adminAuth = adminApp ? getAuth(adminApp) : null;

