import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET - Fetch all websites created by the logged-in user
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

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    
    // Get user's email first
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    
    if (!user || !user.email) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Fetch all websites created by this user
    const websites = await db
      .collection('pages')
      .find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .project({ slug: 1, title: 1, createdAt: 1 })
      .toArray();

    console.log(`📊 Fetched ${websites.length} websites for user: ${user.email}`);

    return NextResponse.json({ 
      success: true, 
      websites: websites.map(w => ({
        slug: w.slug,
        title: w.title || w.slug,
        createdAt: w.createdAt
      }))
    });
    
  } catch (error) {
    console.error('❌ Error fetching user websites:', error);
    return NextResponse.json(
      { message: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}
