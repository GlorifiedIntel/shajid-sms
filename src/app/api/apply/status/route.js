import { connectToDB } from '@/lib/db';
import Applicant from '@/models/Applicant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

  await connectToDB();

  const application = await Applicant.findOne({ userId });

  if (!application) {
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json(application, { status: 200 });
}