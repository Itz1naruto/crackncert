import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Email, code, and new password are required' }, { status: 400 });
    }

    // Validate password (server-side check)
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const hasSpecialChar = /[^a-zA-Z0-9]/.test(newPassword);
    if (!hasSpecialChar) {
      return NextResponse.json({ error: 'Password must contain at least one special character' }, { status: 400 });
    }

    // Verify code
    const codeDoc = doc(collection(db, 'verificationCodes'), email.toLowerCase());
    const codeSnapshot = await getDoc(codeDoc);

    if (!codeSnapshot.exists()) {
      return NextResponse.json({ error: 'Verification code not found or expired' }, { status: 404 });
    }

    const codeData = codeSnapshot.data();

    if (codeData.expiresAt < Date.now()) {
      await deleteDoc(codeDoc);
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    if (codeData.type !== 'reset') {
      return NextResponse.json({ error: 'Invalid code type' }, { status: 400 });
    }

    if (codeData.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Code is valid - delete it
    await deleteDoc(codeDoc);

    // Reset password using Firebase Admin SDK
    if (!adminAuth) {
      console.error('[Reset Password API] Admin Auth not initialized');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    try {
      // Get user by email
      const userRecord = await adminAuth.getUserByEmail(email.toLowerCase());
      
      // Update password
      await adminAuth.updateUser(userRecord.uid, {
        password: newPassword,
      });

      console.log(`[Reset Password API] ✅ Password reset successful for: ${email}`);

      return NextResponse.json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (adminError: any) {
      console.error('[Reset Password API] Admin error:', adminError);
      
      if (adminError.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 });
      }
      
      return NextResponse.json(
        { error: 'Failed to reset password. Please try again or contact support.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Reset Password API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset. Please try again.' },
      { status: 500 }
    );
  }
}

