import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { sendWelcomeEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validation
    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        message: 'Email and OTP are required'
      }, { status: 400 });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP format'
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

    // Check if OTP exists
    if (!user.emailVerificationOTP) {
      return NextResponse.json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      }, { status: 400 });
    }

    // Check if OTP is expired (10 minutes)
    const otpExpiry = new Date(user.otpExpiry);
    if (otpExpiry < new Date()) {
      return NextResponse.json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      }, { status: 400 });
    }

    // Verify OTP
    if (user.emailVerificationOTP !== otp) {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP'
      }, { status: 401 });
    }

    // Update user - mark as verified and remove OTP
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          isEmailVerified: true,
          verifiedAt: new Date()
        },
        $unset: {
          emailVerificationOTP: "",
          otpExpiry: ""
        }
      }
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(email, user.name);
      console.log('✅ Welcome email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail the verification if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Welcome to VaaniWeb 🎉'
    }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Verification failed. Please try again.'
    }, { status: 500 });
  }
}
