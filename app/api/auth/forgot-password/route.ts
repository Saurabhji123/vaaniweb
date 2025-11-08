import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/app/lib/mongodb';
import { sendPasswordResetEmail } from '@/app/lib/email';
import { validateEmailAddress } from '@/app/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function resolveAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_ROOT_URL || process.env.APP_URL;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const protocol = vercelUrl.startsWith('http') ? '' : 'https://';
    return `${protocol}${vercelUrl}`.replace(/\/$/, '');
  }

  return 'https://vaaniweb.com';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    const validation = validateEmailAddress(email);
    if (!validation.valid || !validation.normalized) {
      return NextResponse.json({
        success: false,
        message: validation.message || 'Enter a valid email address'
      }, { status: 400 });
    }

    const normalizedEmail = validation.normalized;

    const { db } = await connectDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, password reset instructions have been emailed.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: expiresAt
        }
      }
    );

    const baseUrl = resolveAppUrl();
    const resetLink = `${baseUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(normalizedEmail, user.name || 'there', resetLink, expiresAt);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists, password reset instructions have been emailed.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    }, { status: 500 });
  }
}
