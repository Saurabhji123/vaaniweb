import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
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
    const deletedAccountsCollection = db.collection('deleted_accounts');
    const pagesCollection = db.collection('pages');

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

    // Find all user's pages
    const userPages = await pagesCollection.find({ 
      userId: decoded.userId 
    }).toArray();

    // Prepare deleted account data
    const deletedAccountData = {
      ...user,
      originalUserId: user._id,
      deletedAt: new Date(),
      deletionReason: 'User requested account deletion',
      userPages: userPages, // Store all user's pages
      pagesCount: userPages.length
    };

    // Start transaction-like operations
    // 1. Insert into deleted_accounts collection
    await deletedAccountsCollection.insertOne(deletedAccountData);

    // 2. Delete all user's pages from pages collection
    if (userPages.length > 0) {
      await pagesCollection.deleteMany({ 
        userId: decoded.userId 
      });
    }

    // 3. Delete user from users collection
    await usersCollection.deleteOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully. All your data has been removed.'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete account. Please try again later.'
    }, { status: 500 });
  }
}
