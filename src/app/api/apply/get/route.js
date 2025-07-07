import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Application from '../../../../models/Application';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const application = await Application.findOne({ userId: email });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (err) {
    console.error('[GET Application Error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}