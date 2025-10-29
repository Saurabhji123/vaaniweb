import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch unread submissions count for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { db } = await connectDB();
    
    // Get the user's email
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Count unread submissions
    const unreadCount = await db
      .collection('form_submissions')
      .countDocuments({ 
        websiteOwnerEmail: user.email,
        read: false 
      });

    return NextResponse.json({ 
      success: true, 
      unreadCount 
    });
    
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { message: 'Failed to fetch unread count', unreadCount: 0 },
      { status: 500 }
    );
  }
}
