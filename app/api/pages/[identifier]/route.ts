import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import { generateHTML } from '@/app/lib/html-generator';
import { GeneratedPageData } from '@/app/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageRecord = {
  _id: string | ObjectId;
  slug?: string;
  userId?: string | null;
  userEmail?: string | null;
  html: string;
  json: GeneratedPageData;
  title?: string;
};

async function getDb() {
  const client = await clientPromise;
  return client.db('vaaniweb');
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((entry) => entry.length > 0);
}

function sanitizeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return fallback;
}

function ensureContactFields(fields: string[]): string[] {
  const normalized = fields.length > 0 ? fields : [];

  if (normalized.length === 0) {
    return ['Name', 'Email', 'Phone', 'Message'];
  }

  const hasName = normalized.some((label) => label.toLowerCase().includes('name'));
  const hasEmail = normalized.some((label) => label.toLowerCase().includes('mail'));

  const fallbacks = [...normalized];

  if (!hasName) {
    fallbacks.unshift('Name');
  }

  if (!hasEmail) {
    fallbacks.splice(hasName ? 1 : 2, 0, 'Email');
  }

  return fallbacks.slice(0, 8);
}

async function findPage(db: any, identifier: string): Promise<PageRecord | null> {
  const pages = db.collection('pages');

  const bySlug = await pages.findOne({ slug: identifier });
  if (bySlug) {
    return bySlug as PageRecord;
  }

  const byStringId = await pages.findOne({ _id: identifier });
  if (byStringId) {
    return byStringId as PageRecord;
  }

  if (ObjectId.isValid(identifier)) {
    const byObjectId = await pages.findOne({ _id: new ObjectId(identifier) });
    if (byObjectId) {
      return byObjectId as PageRecord;
    }
  }

  return null;
}

async function ensureOwnership(db: any, page: PageRecord, decodedUserId: string): Promise<boolean> {
  if (page.userId && page.userId.toString() === decodedUserId) {
    return true;
  }

  if (!page.userEmail) {
    return false;
  }

  if (!ObjectId.isValid(decodedUserId)) {
    return false;
  }

  const user = await db.collection('users').findOne({ _id: new ObjectId(decodedUserId) });
  if (!user) {
    return false;
  }

  return user.email === page.userEmail;
}

export async function GET(req: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const db = await getDb();
    const page = await findPage(db, params.identifier);

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    const ownsPage = await ensureOwnership(db, page, decoded.userId);
    if (!ownsPage) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      page: {
        _id: typeof page._id === 'string' ? page._id : page._id.toString(),
        slug: page.slug,
        json: page.json,
        title: page.title,
      },
    });
  } catch (error: any) {
    console.error('Error fetching page for edit:', error);
    return NextResponse.json({ message: 'Failed to load page' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const updatedJson = body?.json as GeneratedPageData | undefined;

    if (!updatedJson || typeof updatedJson !== 'object') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    if (!updatedJson.title || !updatedJson.tagline) {
      return NextResponse.json({ message: 'Title and tagline are required' }, { status: 400 });
    }

    const db = await getDb();
    const page = await findPage(db, params.identifier);

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    const ownsPage = await ensureOwnership(db, page, decoded.userId);
    if (!ownsPage) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const pics = normalizeStringArray(updatedJson.pics);
    const picDescriptions = normalizeStringArray(updatedJson.picDescriptions);
    const contactFields = ensureContactFields(normalizeStringArray(updatedJson.contact_fields));
    const seoKeywords = normalizeStringArray(updatedJson.seoKeywords);

    const existingSections = page.json?.sections;

    const features = normalizeStringArray(updatedJson.sections?.features);
    const faqItems = updatedJson.sections?.faq?.map((item) => ({
      question: sanitizeText(item?.question),
      answer: sanitizeText(item?.answer),
    })).filter((item) => item.question.length > 0 && item.answer.length > 0);

    const serviceItems = updatedJson.sections?.services?.map((service) => ({
      title: sanitizeText(service?.title),
      description: sanitizeText(service?.description),
      icon: service?.icon ? sanitizeText(service.icon) : undefined,
    })).filter((service) => service.title.length > 0 && service.description.length > 0);

    const testimonialItems = updatedJson.sections?.testimonials?.map((testimonial) => ({
      name: sanitizeText(testimonial?.name),
      role: sanitizeText(testimonial?.role),
      quote: sanitizeText(testimonial?.quote),
      rating: typeof testimonial?.rating === 'number' ? testimonial.rating : 5,
    })).filter((testimonial) => testimonial.name.length > 0 && testimonial.quote.length > 0);

    const rawSkillGroups = Array.isArray(updatedJson.sections?.skills)
      ? updatedJson.sections?.skills
      : [];

    const skillItems = rawSkillGroups
      .map((group: any) => {
          const items = Array.isArray(group?.items)
            ? group.items.map((item: unknown) => sanitizeText(item, '')).filter((item: string) => item.length > 0)
            : [];
          const categoryFallback = items.length > 0 ? 'General' : '';
          const category = sanitizeText(group?.category, categoryFallback);

          if (category.length === 0 && items.length === 0) {
            return null;
          }

          return {
            category,
            items,
          };
        })
      .filter((group) => group !== null) as Array<{ category: string; items: string[] }>;

    const visibility = {
      features: typeof updatedJson.sections?.visibility?.features === 'boolean'
        ? updatedJson.sections.visibility.features
        : existingSections?.visibility?.features ?? true,
      services: typeof updatedJson.sections?.visibility?.services === 'boolean'
        ? updatedJson.sections.visibility.services
        : existingSections?.visibility?.services ?? true,
      testimonials: typeof updatedJson.sections?.visibility?.testimonials === 'boolean'
        ? updatedJson.sections.visibility.testimonials
        : existingSections?.visibility?.testimonials ?? true,
      faq: typeof updatedJson.sections?.visibility?.faq === 'boolean'
        ? updatedJson.sections.visibility.faq
        : existingSections?.visibility?.faq ?? true,
    };

    const sanitizedAbout = sanitizeText(
      updatedJson.sections?.about,
      sanitizeText(existingSections?.about)
    );
    const sanitizedCta = sanitizeText(
      updatedJson.sections?.callToAction,
      sanitizeText(existingSections?.callToAction)
    );

    const sanitized: GeneratedPageData = {
      ...updatedJson,
      slug: page.slug || updatedJson.slug,
      pics,
      picDescriptions,
      contact_fields: contactFields,
      seoKeywords,
      description: sanitizeText(updatedJson.description, sanitizeText(page.json?.description)),
      sections: {
        ...(existingSections || {}),
        ...updatedJson.sections,
        about: sanitizedAbout,
        callToAction: sanitizedCta,
        features,
        faq: faqItems,
        services: serviceItems,
        testimonials: testimonialItems,
        skills: skillItems,
        location: sanitizeText(updatedJson.sections?.location, sanitizeText(existingSections?.location)),
        phone: sanitizeText(updatedJson.sections?.phone, sanitizeText(existingSections?.phone)),
        date: sanitizeText(updatedJson.sections?.date, sanitizeText(existingSections?.date)),
        deadline: sanitizeText(updatedJson.sections?.deadline, sanitizeText(existingSections?.deadline)),
        cta: sanitizeText(updatedJson.sections?.cta, sanitizeText(existingSections?.cta)),
        focus: sanitizeText(updatedJson.sections?.focus, sanitizeText(existingSections?.focus)),
        roles: sanitizeText(updatedJson.sections?.roles, sanitizeText(existingSections?.roles)),
        availability: sanitizeText(updatedJson.sections?.availability, sanitizeText(existingSections?.availability)),
        gpa: sanitizeText(updatedJson.sections?.gpa, sanitizeText(existingSections?.gpa)),
        visibility,
      },
    };

    const html = generateHTML(sanitized);

    await db.collection('pages').updateOne(
      { _id: page._id as any },
      {
        $set: {
          json: sanitized,
          html,
          title: sanitized.title,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating page:', error);
    return NextResponse.json({ message: 'Failed to update page' }, { status: 500 });
  }
}