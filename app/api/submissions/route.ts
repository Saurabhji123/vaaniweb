import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch all form submissions for the logged-in user
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
    
    // First, get the user's email from users collection
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Fetch all submissions where websiteOwnerEmail matches the user's email
    const submissions = await db
      .collection('form_submissions')
      .find({ websiteOwnerEmail: user.email })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      submissions 
    });
    
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// PATCH - Update read status of a submission
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, read } = body;

    if (!submissionId || typeof read !== 'boolean') {
      return NextResponse.json(
        { message: 'Missing submissionId or read status' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    
    // First, get the user's email
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Update the submission's read status (only if it belongs to the user)
    const result = await db.collection('form_submissions').updateOne(
      { 
        _id: new ObjectId(submissionId),
        websiteOwnerEmail: user.email
      },
      { 
        $set: { read, readAt: read ? new Date() : null }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Submission not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Read status updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { message: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
