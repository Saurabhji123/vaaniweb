import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('vaaniweb');
    const doc = await db.collection('pages').findOne({ _id: id as any });

    if (!doc) {
      return new NextResponse('Page not found', { status: 404 });
    }

    return new NextResponse(doc.html as string, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new NextResponse('Error loading page', { status: 500 });
  }
}
