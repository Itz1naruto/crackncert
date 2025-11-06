import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { email, code, type } = await req.json();

    if (!email || !code || !type) {
      return NextResponse.json({ error: 'Email, code, and type are required' }, { status: 400 });
    }

    // Get code from Firestore
    const codeDoc = doc(collection(db, 'verificationCodes'), email.toLowerCase());
    const codeSnapshot = await getDoc(codeDoc);

    if (!codeSnapshot.exists()) {
      return NextResponse.json({ error: 'Verification code not found or expired' }, { status: 404 });
    }

    const codeData = codeSnapshot.data();

    // Check if code has expired
    if (codeData.expiresAt < Date.now()) {
      await deleteDoc(codeDoc);
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // Check if type matches
    if (codeData.type !== type) {
      return NextResponse.json({ error: 'Invalid verification code type' }, { status: 400 });
    }

    // Check attempts (max 5 attempts)
    if (codeData.attempts >= 5) {
      await deleteDoc(codeDoc);
      return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 400 });
    }

    // Verify code
    if (codeData.code !== code) {
      await updateDoc(codeDoc, {
        attempts: (codeData.attempts || 0) + 1,
      });
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Code is valid - delete it (one-time use)
    await deleteDoc(codeDoc);

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully',
    });
  } catch (error: any) {
    console.error('[Verify Code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}

