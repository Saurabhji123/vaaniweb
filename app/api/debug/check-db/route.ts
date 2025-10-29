import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

/**
 * DEBUG API: Check MongoDB data structure
 * Access: /api/debug/check-db
 */
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('vaaniweb');

    // Get sample pages
    const pages = await db.collection('pages')
      .find({})
      .limit(5)
      .project({ _id: 1, slug: 1, title: 1, userEmail: 1, createdAt: 1 })
      .toArray();

    // Get sample submissions
    const submissions = await db.collection('form_submissions')
      .find({})
      .limit(5)
      .sort({ submittedAt: -1 })
      .toArray();

    // Count totals
    const pagesCount = await db.collection('pages').countDocuments();
    const submissionsCount = await db.collection('form_submissions').countDocuments();

    // Check if pages have slug field
    const pagesWithoutSlug = await db.collection('pages')
      .countDocuments({ slug: { $exists: false } });

    return NextResponse.json({
      success: true,
      database: 'vaaniweb',
      collections: {
        pages: {
          total: pagesCount,
          withoutSlug: pagesWithoutSlug,
          samples: pages
        },
        submissions: {
          total: submissionsCount,
          samples: submissions
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Debug check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
