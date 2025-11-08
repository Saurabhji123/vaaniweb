import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { hashPassword, generateToken, sanitizeUser, getPlanLimits } from '@/app/lib/auth';
import { generateOTP, sendOTPEmail } from '@/app/lib/email';
import { isStrongPassword, validateEmailAddress, PASSWORD_REQUIREMENTS } from '@/app/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: PASSWORD_REQUIREMENTS },
        { status: 400 }
      );
    }

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.valid || !emailCheck.normalized) {
      return NextResponse.json(
        { error: emailCheck.message || 'Please use a verified email provider.' },
        { status: 400 }
      );
    }

    const normalizedEmail = emailCheck.normalized;

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create user
    const newUser = {
      email: normalizedEmail,
      password: hashedPassword,
      name,
      plan: 'free' as const,
      sitesCreated: 0,
      monthlyLimit: getPlanLimits('free'),
      authProvider: 'email' as const,
      isEmailVerified: false,
      emailVerificationOTP: otp,
      otpExpiry: otpExpiry,
      createdAt: new Date(),
      lastLogin: new Date(),
      lastResetDate: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    console.log('🔐 User registered:', email);
    console.log('🔢 OTP generated:', otp);
    console.log('⏰ OTP expiry:', otpExpiry);

    // Send OTP email (don't block registration if email fails)
    try {
      console.log('📧 Attempting to send OTP email...');
      const emailResult = await sendOTPEmail(normalizedEmail, otp, name);
      
      if (emailResult.success) {
        console.log('✅ OTP email sent successfully to:', normalizedEmail);
      } else {
        console.error('❌ Failed to send OTP email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Exception while sending OTP email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate token
    const token = generateToken(result.insertedId.toString());

    // Return user data (without password)
    const userResponse = sanitizeUser({
      _id: result.insertedId.toString(),
      ...newUser
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      requiresVerification: true,
      user: userResponse,
      token
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
