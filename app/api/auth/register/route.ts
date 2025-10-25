import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { hashPassword, generateToken, sanitizeUser, getPlanLimits } from '@/app/lib/auth';

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      plan: 'free' as const,
      sitesCreated: 0,
      monthlyLimit: getPlanLimits('free'),
      authProvider: 'email' as const,
      createdAt: new Date(),
      lastLogin: new Date(),
      lastResetDate: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate token
    const token = generateToken(result.insertedId.toString());

    // Return user data (without password)
    const userResponse = sanitizeUser({
      _id: result.insertedId.toString(),
      ...newUser
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
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
