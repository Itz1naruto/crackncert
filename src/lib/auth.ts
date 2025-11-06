'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  User,
  reload
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign up a new user with email and password
 * Sends verification email after successful signup
 * Signs out immediately after signup so unverified users can't auto-login
 */
// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation function
function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  
  // Check for at least one non-alphanumeric character (special character)
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  if (!hasSpecialChar) {
    return { 
      valid: false, 
      error: 'Password must contain at least one special character (e.g., !@#$%^&*)' 
    };
  }
  
  return { valid: true };
}

/**
 * Send verification code to email (for signup)
 */
export async function sendSignupCode(email: string): Promise<{ success: boolean; code?: string }> {
  try {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      throw new Error('Email is required');
    }

    if (!isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    const response = await fetch('/api/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, type: 'signup' }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || 'Failed to send verification code';
      console.error('[Auth] Send code API error:', errorMessage, 'Status:', response.status);
      throw new Error(errorMessage);
    }

    return { success: true, code: data.code }; // code only in development
  } catch (error: any) {
    console.error('[Auth] Send code error:', error);
    throw error;
  }
}

/**
 * Verify signup code and create account
 */
export async function verifySignupCode(email: string, code: string, password: string): Promise<void> {
  try {
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedCode || !trimmedPassword) {
      throw new Error('Email, code, and password are required');
    }

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength
    const passwordValidation = isValidPassword(trimmedPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error || 'Password does not meet requirements');
    }

    // Verify code
    const verifyResponse = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, code: trimmedCode, type: 'signup' }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      throw new Error(verifyData.error || 'Invalid or expired verification code');
    }

    // Code verified - create account
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    console.log('[Auth] Code verified, creating account for:', trimmedEmail);
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;
    console.log('[Auth] ✅ Account created successfully:', user.uid);

    // Auto-verify email since code was verified
    // Note: In production, you might want to mark email as verified in Firestore
    // For now, we'll use Firebase's email verification
    try {
      await sendEmailVerification(user);
    } catch (verifyError) {
      console.warn('[Auth] Could not send verification email:', verifyError);
    }

    // Sign out immediately (user will need to log in)
    await signOut(auth);
    
    alert(`✅ Account created successfully!\n\nYou can now log in with your email and password.`);
  } catch (error: any) {
    console.error('[Auth] Verify code error:', error);
    throw error;
  }
}

/**
 * Send password reset code
 */
export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; code?: string }> {
  try {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      throw new Error('Email is required');
    }

    if (!isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    const response = await fetch('/api/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, type: 'reset' }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || 'Failed to send reset code';
      console.error('[Auth] Send reset code API error:', errorMessage, 'Status:', response.status);
      throw new Error(errorMessage);
    }

    return { success: true, code: data.code }; // code only in development
  } catch (error: any) {
    console.error('[Auth] Send reset code error:', error);
    throw error;
  }
}

/**
 * Verify reset code and reset password
 * Uses a server-side API to securely reset the password after code verification
 */
export async function verifyResetCodeAndSetPassword(email: string, code: string, newPassword: string): Promise<void> {
  try {
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedEmail || !trimmedCode || !trimmedPassword) {
      throw new Error('Email, code, and new password are required');
    }

    // Validate password strength
    const passwordValidation = isValidPassword(trimmedPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error || 'Password does not meet requirements');
    }

    // Call API to verify code and reset password
    const resetResponse = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: trimmedEmail, 
        code: trimmedCode, 
        newPassword: trimmedPassword 
      }),
    });

    const resetData = await resetResponse.json();

    if (!resetResponse.ok) {
      throw new Error(resetData.error || 'Failed to reset password');
    }

    // Password reset successful - user can now log in with new password
    alert(`✅ Password reset successful!\n\nYour password has been changed. You can now log in with your new password.`);
  } catch (error: any) {
    console.error('[Auth] Reset password error:', error);
    alert(`❌ ${error.message || 'Failed to reset password. Please try again.'}`);
    throw error;
  }
}

// Keep old signup for backward compatibility (will be replaced)
export async function signup(email: string, password: string): Promise<void> {
  try {
    // Check if Firebase is configured
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }

    // Trim and validate inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g., user@example.com)');
    }

    // Validate password strength
    const passwordValidation = isValidPassword(trimmedPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error || 'Password does not meet requirements');
    }

    console.log('[Auth] Starting signup for:', trimmedEmail);
    console.log('[Auth] Firebase Auth object:', auth ? 'Present' : 'Missing');
    
    // Attempt to create user - this will fail if Firebase is not configured
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;
    console.log('[Auth] ✅ User created successfully:', user.uid);

    // Send verification email
    console.log('[Auth] Sending verification email...');
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + '/testauth',
      });
      console.log('[Auth] ✅ Verification email sent successfully');
    } catch (verifyError: any) {
      console.error('[Auth] ⚠️ Failed to send verification email:', verifyError);
      // Don't fail signup if email sending fails, but warn user
      alert(`⚠️ Account created but verification email failed to send: ${verifyError.message}\n\nYou can request a new verification email later.`);
    }
    
    // Sign out immediately after signup (so unverified users can't auto-login)
    await signOut(auth);
    console.log('[Auth] ✅ User signed out after signup');
    
    alert(`✅ Account created successfully!\n\nPlease check your email (${trimmedEmail}) for the verification link.\n\nYou MUST verify your email before you can log in.`);
  } catch (error: any) {
    console.error('[Auth] ❌ Signup error:', error);
    console.error('[Auth] Error code:', error.code);
    console.error('[Auth] Error message:', error.message);
    
    let errorMessage = 'An unknown error occurred';
    
    // Handle specific Firebase errors
    if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please enter a valid email.';
    } else if (error.code === 'auth/weak-password' || error.code === 'auth/password-does-not-meet-requirements') {
      errorMessage = 'Password does not meet requirements. Password must be at least 6 characters and contain at least one special character (e.g., !@#$%^&*).';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password authentication is not enabled in Firebase. Please enable it in Firebase Console → Authentication → Sign-in method.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`❌ Signup failed: ${errorMessage}\n\nError code: ${error.code || 'N/A'}`);
    throw error;
  }
}

/**
 * Login with email and password
 * STRICTLY enforces email verification - blocks login if not verified
 * Returns the user object on successful login
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // Check if Firebase is configured
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }

    // Trim and validate inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g., user@example.com)');
    }

    console.log('[Auth] Attempting login for:', trimmedEmail);
    console.log('[Auth] Firebase Auth object:', auth ? 'Present' : 'Missing');
    
    // Attempt to sign in - this will fail if Firebase is not configured
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;
    console.log('[Auth] ✅ Credentials valid, checking email verification...');
    console.log('[Auth] Email verified status:', user.emailVerified);

    // Reload user to get latest verification status
    try {
      await reload(user);
    } catch (reloadError) {
      console.warn('[Auth] Could not reload user, using current status');
    }
    const reloadedUser = auth.currentUser;
    
    // STRICT CHECK: Block login if email is not verified
    if (!reloadedUser || !reloadedUser.emailVerified) {
      console.log('[Auth] ❌ Email not verified, signing out...');
      await signOut(auth);
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    console.log('[Auth] ✅ Email verified, login successful');
    alert(`✅ Login successful! Welcome, ${user.email}`);
    return reloadedUser;
  } catch (error: any) {
    console.error('[Auth] ❌ Login error:', error);
    console.error('[Auth] Error code:', error.code);
    console.error('[Auth] Error message:', error.message);
    
    // Handle email verification error specifically
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      alert('❌ EMAIL VERIFICATION REQUIRED\n\nYour email address has not been verified.\n\nPlease check your inbox and click the verification link before logging in.\n\nIf you didn\'t receive the email, use the "Resend Verification" button below.');
      throw error;
    }
    
    let errorMessage = 'An unknown error occurred';
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please enter a valid email.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`❌ Login failed: ${errorMessage}\n\nError code: ${error.code || 'N/A'}`);
    throw error;
  }
}

/**
 * Resend verification email to the current user
 */
export async function resendVerificationEmail(): Promise<void> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    if (user.emailVerified) {
      alert('✅ Your email is already verified!');
      return;
    }

    console.log('[Auth] Resending verification email to:', user.email);
    await sendEmailVerification(user, {
      url: window.location.origin + '/testauth',
    });
    
    alert(`✅ Verification email sent!\n\nPlease check your inbox (${user.email}) and click the verification link.`);
  } catch (error: any) {
    console.error('[Auth] Resend verification error:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    alert(`❌ Failed to resend verification email: ${errorMessage}`);
    throw error;
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
    console.log('[Auth] User logged out');
    alert("🚪 Logged out successfully!");
  } catch (error: any) {
    console.error('[Auth] Logout error:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    alert(`❌ Logout failed: ${errorMessage}`);
    throw error;
  }
}
