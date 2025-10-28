import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { generateHTML } from '@/app/lib/html-generator';
import { GeneratedPageData } from '@/app/types';
import { analyzeTranscriptWithAI } from '@/app/lib/groq-ai';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generate URL-friendly slug from business name
 * Example: "United University" -> "united-university"
 */
function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate unique slug by checking database and adding numbers if needed
 * Example: "united-university" -> "united-university-2" if exists
 */
async function generateUniqueSlug(db: any, businessName: string): Promise<string> {
  let slug = generateSlug(businessName);
  const baseSlug = slug;
  let counter = 1;
  
  // Check if slug already exists
  while (true) {
    const existing = await db.collection('pages').findOne({ slug });
    if (!existing) {
      return slug; // Unique slug found
    }
    
    // Try with counter
    counter++;
    slug = `${baseSlug}-${counter}`;
    
    // Safety limit
    if (counter > 100) {
      // Fallback to UUID-based slug
      return `${baseSlug}-${crypto.randomUUID().split('-')[0]}`;
    }
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Get user from token
    const authHeader = req.headers.get('authorization');
    let userId = null;
    let userEmail = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        userEmail = decoded.email;
      } catch (error) {
        console.warn('Invalid token, continuing as guest');
      }
    }

    // Check monthly limit for authenticated users
    if (userId) {
      const { db } = await connectDB();
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Check email verification for email-based accounts
      if (user.authProvider === 'email' && !user.isEmailVerified) {
        return NextResponse.json(
          { 
            error: 'Email not verified',
            message: 'Please verify your email before creating websites. Check your inbox for the verification code.',
            requiresVerification: true
          },
          { status: 403 }
        );
      }

      // Check if user has reached monthly limit
      if (user.monthlyLimit !== -1 && user.sitesCreated >= user.monthlyLimit) {
        return NextResponse.json(
          { 
            error: 'Monthly limit reached',
            message: `You have reached your monthly limit of ${user.monthlyLimit} websites. Upgrade your plan to create more!`,
            limitReached: true
          },
          { status: 403 }
        );
      }

      // Check if monthly reset is needed (30 days)
      const lastReset = user.lastResetDate ? new Date(user.lastResetDate) : new Date(user.createdAt);
      const daysSinceReset = Math.floor((Date.now() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceReset >= 30) {
        // Reset monthly counter
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              sitesCreated: 0,
              lastResetDate: new Date()
            } 
          }
        );
        console.log('✅ Monthly limit reset for user:', userEmail);
      }
    }

    const body = await req.json();
    const transcript = body.transcript || body.description; // Support both field names
    
    if (!transcript || !transcript.trim()) {
      console.error('❌ No transcript provided');
      return NextResponse.json({ 
        error: 'No transcript provided',
        message: 'Please provide a description for your website' 
      }, { status: 400 });
    }

    console.log('📝 Received transcript:', transcript);
    
    // 🤖 Use AI to analyze transcript and generate intelligent content
    console.log('🤖 Analyzing with Groq AI...');
    let aiContent;
    try {
      aiContent = await analyzeTranscriptWithAI(transcript);
      if (!aiContent || !aiContent.businessName) {
        throw new Error('AI failed to generate valid content');
      }
    } catch (aiError: any) {
      console.error('❌ AI Analysis failed:', aiError);
      return NextResponse.json({ 
        error: 'AI analysis failed',
        message: 'Failed to analyze your description. Please try again with more details.' 
      }, { status: 500 });
    }

    // Create page data from AI-generated content
    const pageData: GeneratedPageData = {
      title: aiContent.businessName,
      tagline: aiContent.tagline,
      description: aiContent.description,
      theme_color: aiContent.themeColor,
      pics: aiContent.realImages || [], // Use real Pexels/Unsplash URLs
      picDescriptions: aiContent.imageDescriptions || [], // Alt text for accessibility
      instagram: aiContent.instagram,
      contact_fields: aiContent.contactFields,
      businessType: aiContent.businessType,
      sections: aiContent.sections,
      seoKeywords: aiContent.seoKeywords
    };
    
    console.log('✅ AI-Generated page data:', pageData);

    // Generate HTML
    let html;
    try {
      html = generateHTML(pageData);
      if (!html || html.length < 100) {
        throw new Error('HTML generation produced invalid output');
      }
    } catch (htmlError: any) {
      console.error('❌ HTML Generation failed:', htmlError);
      return NextResponse.json({ 
        error: 'HTML generation failed',
        message: 'Failed to generate website template. Please try again.' 
      }, { status: 500 });
    }

    // Generate UUID for internal database ID
    const uuid = crypto.randomUUID();
    console.log('Generated UUID:', uuid);
    
    // Generate slug from business name (ALWAYS generate, never skip)
    let slug = generateSlug(pageData.title);
    console.log('✅ Generated base slug:', slug);

    // Try MongoDB insert (optional - will continue even if fails)
    try {
      const client = await clientPromise;
      const db = client.db('vaaniweb');
      
      // Generate UNIQUE slug with counter if needed
      slug = await generateUniqueSlug(db, pageData.title);
      console.log('✅ Generated unique slug:', slug);
      
      await db.collection('pages').insertOne({
        _id: uuid as any, // UUID for database primary key (internal only)
        slug, // Slug for public-facing URL
        html,
        json: pageData,
        createdAt: new Date(),
        userId: userId || null,
        userEmail: userEmail || null,
      });
      console.log('✅ Page saved to MongoDB with slug:', slug);

      // Increment sitesCreated for authenticated users
      if (userId) {
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { sitesCreated: 1 } }
        );
        console.log('✅ User sitesCreated incremented');
      }
    } catch (dbError: any) {
      console.warn('⚠️ MongoDB save failed (continuing anyway):', dbError.message);
      // Slug already generated above, so we can continue with it
      console.log('Using slug:', slug);
    }

    // ALWAYS use slug-based URL (never expose UUID to users)
    const url = `${process.env.NEXT_PUBLIC_ROOT_URL}/${slug}`;
    console.log('✅ Public URL (slug-based only):', url);
    
    return NextResponse.json({ 
      url, 
      html, 
      pageData,
      id: uuid, // Internal UUID (for database reference only, not shown to user)
      slug // Public slug for clean URLs
    });
  } catch (error: any) {
    console.error('❌ Generation error:', error);
    return NextResponse.json({ 
      error: error.message || String(error),
      message: 'Failed to generate website. Please try again.'
    }, { status: 500 });
  }
}
