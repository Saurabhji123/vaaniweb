import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { comparePassword, generateToken, sanitizeUser, type User } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    }) as unknown as User & { _id: { toString(): string } };

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    console.log('🔐 User login attempt:', email);
    console.log('👤 Auth Provider:', user.authProvider || 'email');
    console.log('✅ Email Verified:', user.isEmailVerified || false);

    // ALLOW LOGIN but pass verification status to frontend
    // Frontend will show verification banner and block website generation
    if (user.authProvider === 'email' && !user.isEmailVerified) {
      console.log('⚠️ Email not verified, allowing login with limited access');
    }

    console.log('✅ Login successful for:', email);

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data (without password)
    const userResponse = sanitizeUser({
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      plan: user.plan,
      sitesCreated: user.sitesCreated,
      monthlyLimit: user.monthlyLimit,
      profilePicture: user.profilePicture || null,
      authProvider: user.authProvider || 'email',
      isEmailVerified: user.isEmailVerified || false,
      createdAt: user.createdAt,
      lastReset: user.lastReset
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token,
      requiresVerification: user.authProvider === 'email' && !user.isEmailVerified
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
