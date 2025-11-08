import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/app/lib/mongodb';
import { hashPassword } from '@/app/lib/auth';
import { isStrongPassword, PASSWORD_REQUIREMENTS } from '@/app/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!token || !password) {
      return NextResponse.json({
        success: false,
        message: 'Token and new password are required'
      }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json({
        success: false,
        message: PASSWORD_REQUIREMENTS
      }, { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'This reset link is invalid or has expired. Please request a new one.'
      }, { status: 400 });
    }

    const newHashedPassword = await hashPassword(password);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: newHashedPassword,
          lastReset: new Date()
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpires: ''
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    }, { status: 500 });
  }
}
