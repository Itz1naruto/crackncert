import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();

    console.log('[Verification Code API] Request received:', { email, type });

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!type || (type !== 'signup' && type !== 'reset')) {
      return NextResponse.json({ error: 'Invalid type. Must be "signup" or "reset"' }, { status: 400 });
    }

    // Check if Firestore is initialized
    if (!db) {
      console.error('[Verification Code API] Firestore not initialized');
      return NextResponse.json(
        { error: 'Database not configured. Please ensure Firestore is enabled in Firebase Console.' },
        { status: 500 }
      );
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    console.log('[Verification Code API] Attempting to store code in Firestore...');

    // Store code in Firestore
    try {
      const codeDoc = doc(collection(db, 'verificationCodes'), email.toLowerCase());
      await setDoc(codeDoc, {
        code,
        email: email.toLowerCase(),
        type,
        expiresAt,
        createdAt: Date.now(),
        attempts: 0,
      });
      console.log(`[Verification Code API] ✅ Code stored successfully for ${email}: ${code}`);
    } catch (firestoreError: any) {
      console.error('[Verification Code API] Firestore error:', firestoreError);
      console.error('[Verification Code API] Error code:', firestoreError.code);
      console.error('[Verification Code API] Error message:', firestoreError.message);
      
      // Provide helpful error messages
      if (firestoreError.code === 'permission-denied') {
        return NextResponse.json(
          { error: 'Database permission denied. Please enable Firestore and set up proper security rules.' },
          { status: 403 }
        );
      } else if (firestoreError.code === 'unavailable') {
        return NextResponse.json(
          { error: 'Database unavailable. Please ensure Firestore Database is created in Firebase Console.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: `Database error: ${firestoreError.message || 'Failed to store verification code'}` },
        { status: 500 }
      );
    }

    // TODO: Integrate with email service (Resend, SendGrid, AWS SES, etc.) to send code
    // For now, in development mode, we return the code in the response
    // In production, you should:
    // 1. Install an email service (e.g., npm install resend)
    // 2. Send the code via email
    // 3. Remove the code from the response

    // Example email sending (uncomment and configure when ready):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'noreply@crackncert.in',
      to: email,
      subject: type === 'signup' ? 'Verify your Crack NCERT account' : 'Reset your password',
      html: `
        <h2>Your verification code</h2>
        <p>Your ${type === 'signup' ? 'signup' : 'password reset'} verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; text-align: center;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      // Remove this in production - only for testing!
      code: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error: any) {
    console.error('[Verification Code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}

