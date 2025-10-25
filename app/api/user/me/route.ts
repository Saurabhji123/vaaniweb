import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'No token provided'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        plan: user.plan || 'free',
        sitesCreated: user.sitesCreated || 0,
        monthlyLimit: user.monthlyLimit || 5,
        profilePicture: user.profilePicture || null,
        authProvider: user.authProvider || 'email',
        hasPassword: !!user.password, // Boolean flag to check if password exists
        createdAt: user.createdAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
