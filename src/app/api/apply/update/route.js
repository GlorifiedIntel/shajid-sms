import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Application from '@/models/Application';

export async function PATCH(req) {
  await dbConnect();

  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return NextResponse.json({ error: 'Missing userId or data' }, { status: 400 });
    }

    // Find existing application
    const existingApp = await Application.findOne({ userId });

    // If submitted, deny edits
    if (existingApp?.submitted) {
      return NextResponse.json(
        { error: 'Application has been submitted and cannot be edited.' },
        { status: 403 }
      );
    }

    // If no application exists, create a new one, else update
    const updatedApp = await Application.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedApp);
  } catch (err) {
    console.error('[PATCH Application Error]', err);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}