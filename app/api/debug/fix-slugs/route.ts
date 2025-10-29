import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

/**
 * FIX API: Add slug field to pages without it
 * This migrates old pages to new schema
 * Access: POST /api/debug/fix-slugs
 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('vaaniweb');
    
    // Find pages without slug
    const pagesWithoutSlug = await db.collection('pages')
      .find({ slug: { $exists: false } })
      .toArray();

    console.log(`Found ${pagesWithoutSlug.length} pages without slug`);

    const updates = [];
    
    for (const page of pagesWithoutSlug) {
      // Generate slug from title
      let slug = page.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // If no title, use _id
      if (!slug) {
        slug = String(page._id);
      }

      // Check if slug already exists
      const existing = await db.collection('pages').findOne({ 
        slug, 
        _id: { $ne: page._id } 
      });
      
      if (existing) {
        // Add number suffix if duplicate
        slug = `${slug}-${String(page._id).slice(-4)}`;
      }

      // Update page with slug
      await db.collection('pages').updateOne(
        { _id: page._id },
        { $set: { slug } }
      );

      updates.push({
        _id: page._id,
        title: page.title,
        newSlug: slug
      });

      console.log(`✅ Updated page: ${page.title} → ${slug}`);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} pages`,
      updates
    });
  } catch (error: any) {
    console.error('❌ Fix slugs error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
