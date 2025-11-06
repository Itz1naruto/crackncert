import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.error('[Verify Email API] Firebase Admin Auth not initialized');
      return NextResponse.json(
        { error: 'Server configuration error. Firebase Admin SDK not initialized.' },
        { status: 500 }
      );
    }

    // Auto-verify email using Firebase Admin SDK
    await adminAuth.updateUser(uid, {
      emailVerified: true,
    });

    console.log(`[Verify Email API] ✅ User ${uid} email verified successfully via API`);

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('[Verify Email API] Error:', error);
    return NextResponse.json(
      { error: `Failed to verify email: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

