import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken, comparePassword, hashPassword } from '@/app/lib/auth';
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
    const { currentPassword, newPassword } = body;

    // Basic validation for new password
    if (!newPassword) {
      return NextResponse.json({
        success: false,
        message: 'New password is required'
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'New password must be at least 6 characters'
      }, { status: 400 });
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

    // Check if user is Google OAuth user (setting password for first time)
    if (user.authProvider === 'google' && !user.password) {
      // For Google users, allow setting password without current password
      const hashedNewPassword = await hashPassword(newPassword);
      
      await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { 
          $set: { 
            password: hashedNewPassword
            // Keep authProvider as 'google' - they can use both methods
          } 
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Password set successfully! You can now login with email and password.'
      }, { status: 200 });
    }

    // For email users or Google users changing existing password, require current password
    if (!currentPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password is required'
      }, { status: 400 });
    }

    // For users with existing passwords, verify current password
    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: 'Unable to change password. Please contact support.'
      }, { status: 400 });
    }

    // Verify current password (for users who already have password)
    const isValidPassword = await comparePassword(currentPassword, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect'
      }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedNewPassword } }
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
