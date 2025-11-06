'use client';

import { useState, useEffect } from 'react';
import { 
  login, 
  sendSignupCode, 
  verifySignupCode, 
  sendPasswordResetCode, 
  verifyResetCodeAndSetPassword,
  logout 
} from '@/lib/auth';
import { auth, checkFirebaseConfig } from '@/lib/firebase';
import { onAuthStateChanged, User, reload } from 'firebase/auth';

type View = 'login' | 'signup-email' | 'signup-code' | 'signup-password' | 'reset-email' | 'reset-code' | 'reset-password';

export default function TestAuthPage() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseConfigValid, setFirebaseConfigValid] = useState<boolean | null>(null);
  const [missingConfig, setMissingConfig] = useState<string[]>([]);
  const [sentCode, setSentCode] = useState<string | null>(null); // For dev mode

  // Check Firebase configuration on mount
  useEffect(() => {
    const configCheck = checkFirebaseConfig();
    setFirebaseConfigValid(configCheck.valid);
    setMissingConfig(configCheck.missing);
  }, []);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await reload(user);
          setCurrentUser(auth.currentUser);
        } catch (error) {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Password validation
  const isValidPassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters long' };
    }
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    if (!hasSpecialChar) {
      return { valid: false, error: 'Password must contain at least one special character (e.g., !@#$%^&*)' };
    }
    return { valid: true };
  };

  // Handle signup - step 1: Send code
  const handleSendSignupCode = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      alert('❌ Please enter your email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert('❌ Please enter a valid email address\n\nExample: user@example.com');
      return;
    }

    setLoading(true);
    try {
      const result = await sendSignupCode(trimmedEmail);
      setSentCode(result.code || null); // Store code for dev mode
      alert(`✅ Verification code sent to ${trimmedEmail}${result.code ? `\n\n(Dev mode - Code: ${result.code})` : ''}`);
      setView('signup-code');
    } catch (error: any) {
      alert(`❌ ${error.message || 'Failed to send verification code'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup - step 2: Verify code and set password
  const handleVerifySignupCode = async () => {
    const trimmedCode = code.trim();
    const trimmedPassword = password.trim();

    if (!trimmedCode) {
      alert('❌ Please enter the verification code');
      return;
    }

    if (trimmedCode.length !== 6) {
      alert('❌ Verification code must be 6 digits');
      return;
    }

    if (!trimmedPassword) {
      alert('❌ Please enter a password');
      return;
    }

    const passwordValidation = isValidPassword(trimmedPassword);
    if (!passwordValidation.valid) {
      alert(`❌ ${passwordValidation.error}`);
      return;
    }

    setLoading(true);
    try {
      await verifySignupCode(email.trim(), trimmedCode, trimmedPassword);
      // User is already logged in after signup (verifySignupCode keeps them signed in)
      // Redirect to main page
      setTimeout(() => {
        window.location.href = '/inspired';
      }, 1000);
    } catch (error: any) {
      alert(`❌ ${error.message || 'Failed to verify code'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset - step 1: Send code
  const handleSendResetCode = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      alert('❌ Please enter your email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert('❌ Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await sendPasswordResetCode(trimmedEmail);
      setSentCode(result.code || null);
      alert(`✅ Password reset code sent to ${trimmedEmail}${result.code ? `\n\n(Dev mode - Code: ${result.code})` : ''}`);
      setView('reset-code');
    } catch (error: any) {
      alert(`❌ ${error.message || 'Failed to send reset code'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset - step 2: Verify code and set new password
  const handleVerifyResetCode = async () => {
    const trimmedCode = code.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedCode) {
      alert('❌ Please enter the verification code');
      return;
    }

    if (trimmedCode.length !== 6) {
      alert('❌ Verification code must be 6 digits');
      return;
    }

    if (!trimmedNewPassword) {
      alert('❌ Please enter a new password');
      return;
    }

    const passwordValidation = isValidPassword(trimmedNewPassword);
    if (!passwordValidation.valid) {
      alert(`❌ ${passwordValidation.error}`);
      return;
    }

    setLoading(true);
    try {
      await verifyResetCodeAndSetPassword(email.trim(), trimmedCode, trimmedNewPassword);
      alert('✅ Password reset successful! You can now log in with your new password.');
      setView('login');
      setEmail('');
      setCode('');
      setNewPassword('');
    } catch (error: any) {
      alert(`❌ ${error.message || 'Failed to reset password'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert('❌ Please enter both email and password');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert('❌ Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, trimmedPassword);
      setEmail('');
      setPassword('');
      // Redirect to main page after successful login
      // AuthContext will update automatically via onAuthStateChanged
      setTimeout(() => {
        window.location.href = '/inspired';
      }, 500);
    } catch (error: any) {
      if (error.message !== 'EMAIL_NOT_VERIFIED') {
        // Error already handled in login function
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setCurrentUser(null);
    } catch (error) {
      // Error already handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Crack NCERT Authentication
        </h1>

        {firebaseConfigValid === false && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg">
            <p className="text-sm font-bold text-red-800 dark:text-red-200 mb-2">
              ❌ FIREBASE NOT CONFIGURED
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Missing: {missingConfig.join(', ')}
            </p>
          </div>
        )}

        {currentUser && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Logged In: {currentUser.email}
            </p>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 text-sm mt-2"
            >
              Logout
            </button>
          </div>
        )}

        {!currentUser && (
          <>
            {/* LOGIN VIEW */}
            {view === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setView('signup-email')}
                    className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('reset-email')}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP - STEP 1: Enter Email */}
            {view === 'signup-email' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Step 1 of 3: Enter your email</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>
                <button
                  onClick={handleSendSignupCode}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
                <button
                  onClick={() => { setView('login'); setEmail(''); }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Login
                </button>
              </div>
            )}

            {/* SIGNUP - STEP 2: Enter Code and Password */}
            {view === 'signup-code' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Step 2 of 2: Enter verification code and password</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check your email: {email}</p>
                  {sentCode && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-mono bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                      🧪 Dev Mode - Code: {sentCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 6 characters and include a special character (!@#$%^&*)
                  </p>
                </div>
                <button
                  onClick={handleVerifySignupCode}
                  disabled={loading || code.length !== 6 || !password}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Verify Code & Create Account'}
                </button>
                <button
                  onClick={() => { setView('signup-email'); setCode(''); setPassword(''); }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Resend Code
                </button>
              </div>
            )}

            {/* RESET PASSWORD - STEP 1: Enter Email */}
            {view === 'reset-email' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter your email to reset password</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>
                <button
                  onClick={handleSendResetCode}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
                <button
                  onClick={() => { setView('login'); setEmail(''); }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Login
                </button>
              </div>
            )}

            {/* RESET PASSWORD - STEP 2: Enter Code */}
            {view === 'reset-code' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter verification code and new password</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check your email: {email}</p>
                  {sentCode && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-mono">
                      Dev Mode Code: {sentCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 6 characters and include a special character (!@#$%^&*)
                  </p>
                </div>
                <button
                  onClick={handleVerifyResetCode}
                  disabled={loading || code.length !== 6}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  onClick={() => { setView('reset-email'); setCode(''); setNewPassword(''); }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Resend Code
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
