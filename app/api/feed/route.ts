import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { FeedItem } from '@/app/types';
import { verifyToken } from '@/app/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required. Please login to view your pages.'
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

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    
    // Only fetch pages created by the logged-in user
    const items = await db
      .collection('pages')
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .project({ _id: 1, slug: 1, json: 1, createdAt: 1 }) // Include slug field
      .toArray();

    return NextResponse.json({ items: items as unknown as FeedItem[] });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
