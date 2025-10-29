import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteSlug, formData } = body;

    if (!websiteSlug || !formData) {
      return NextResponse.json(
        { error: 'Website slug and form data are required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!formData.Name || !formData.Email) {
      return NextResponse.json(
        { error: 'Name and Email are required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vaaniweb');

    // Find the website owner by slug
    const pagesCollection = db.collection('pages');
    const website = await pagesCollection.findOne({ slug: websiteSlug });

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    const websiteOwnerEmail = website.userEmail;

    // Insert form submission
    const submissionsCollection = db.collection('form_submissions');
    const submission = {
      websiteSlug,
      websiteId: website._id,
      websiteName: website.title || 'Unknown Website',
      websiteOwnerEmail,
      formData,
      submittedAt: new Date(),
      read: false,
    };

    const result = await submissionsCollection.insertOne(submission);

    console.log('📝 Form submission saved:', {
      submissionId: result.insertedId,
      websiteSlug,
      websiteOwner: websiteOwnerEmail,
      submitter: formData.Email,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your submission has been received. We will get back to you soon.',
      submissionId: result.insertedId,
    });
  } catch (error: any) {
    console.error('❌ Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form', details: error.message },
      { status: 500 }
    );
  }
}
