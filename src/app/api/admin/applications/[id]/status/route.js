import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Application from '@/models/Application';
import { getToken } from 'next-auth/jwt';

export async function PATCH(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { status } = await req.json();

  if (!['approved', 'rejected', 'in progress'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await dbConnect();

  const application = await Application.findById(id);
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  application.status = status;
  await application.save();

  return NextResponse.json({ status: application.status });
}