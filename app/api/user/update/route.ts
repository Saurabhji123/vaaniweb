import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, profilePicture } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Name is required'
      }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Prepare update object
    const updateData: any = { name: name.trim() };
    
    // If profilePicture is provided in the request, update it
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    // Update user
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Return updated user data (without password)
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: result._id.toString(),
        email: result.email,
        name: result.name,
        plan: result.plan || 'free',
        sitesCreated: result.sitesCreated || 0,
        monthlyLimit: result.monthlyLimit || 5,
        profilePicture: result.profilePicture || null,
        authProvider: result.authProvider || 'email'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
