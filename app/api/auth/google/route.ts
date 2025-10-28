import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import { sendWelcomeEmail } from '@/app/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'Google credential is required' },
        { status: 400 }
      );
    }

    // Decode Google JWT token to get user info
    const decoded: any = jwt.decode(credential);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google credential' },
        { status: 400 }
      );
    }

    const { email, name, picture } = decoded;

    // Connect to MongoDB
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Check if user already exists
    let user = await usersCollection.findOne({ email });

    if (user) {
      // User exists - login
      // Update profile picture if changed
      if (picture && user.profilePicture !== picture) {
        await usersCollection.updateOne(
          { email },
          { 
            $set: { 
              profilePicture: picture,
              lastLogin: new Date()
            } 
          }
        );
        user.profilePicture = picture;
      } else {
        await usersCollection.updateOne(
          { email },
          { $set: { lastLogin: new Date() } }
        );
      }
    } else {
      // New user - register with Google
      const newUser = {
        email,
        name: name || email.split('@')[0],
        profilePicture: picture || null,
        password: null, // No password for Google OAuth users
        plan: 'free',
        monthlyLimit: 5,
        sitesCreated: 0,
        authProvider: 'google',
        isEmailVerified: true, // Auto-verify Google accounts
        verifiedAt: new Date(),
        createdAt: new Date(),
        lastLogin: new Date(),
        lastResetDate: new Date() // Track when monthly limit was last reset
      };

      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };

      console.log('🎉 New Google user registered:', email);

      // Send welcome email for new Google users (don't block registration)
      try {
        console.log('📧 Attempting to send welcome email...');
        const emailResult = await sendWelcomeEmail(email, name || email.split('@')[0]);
        
        if (emailResult.success) {
          console.log('✅ Welcome email sent to Google user:', email);
        } else {
          console.error('❌ Failed to send welcome email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Exception while sending welcome email:', emailError);
        // Continue even if email fails
      }
    }

    // Generate JWT token for our application
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data (exclude sensitive info)
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture || null,
      plan: user.plan,
      monthlyLimit: user.monthlyLimit,
      sitesCreated: user.sitesCreated,
      authProvider: user.authProvider || 'google'
    };

    return NextResponse.json({
      success: true,
      token,
      user: userData,
      message: user ? 'Login successful' : 'Account created successfully'
    });

  } catch (error: any) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed', error: error.message },
      { status: 500 }
    );
  }
}
