import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { generateOTP, sendOTPEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json({
        success: false,
        message: 'Email is already verified'
      }, { status: 400 });
    }

    // Rate limiting: Check if last OTP was sent within 1 minute
    if (user.otpExpiry) {
      const lastOtpTime = new Date(user.otpExpiry).getTime() - (10 * 60 * 1000); // OTP sent time
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastOtpTime) / 1000; // seconds

      if (timeDiff < 60) {
        return NextResponse.json({
          success: false,
          message: `Please wait ${Math.ceil(60 - timeDiff)} seconds before requesting a new OTP`
        }, { status: 429 });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with new OTP
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          emailVerificationOTP: otp,
          otpExpiry: otpExpiry
        }
      }
    );

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully! Check your email.'
    }, { status: 200 });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    }, { status: 500 });
  }
}
