import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or data' }),
        { status: 400 }
      );
    }

    await dbConnect();

    const db = mongoose.connection;

    // Convert userId to ObjectId if it looks like one, else store as string
    let filter;
    try {
      filter = { userId: new mongoose.Types.ObjectId(userId) };
    } catch {
      filter = { userId }; // fallback if userId is not a valid ObjectId
    }

    const now = new Date();

    const updateDoc = {
      $set: {
        finalSubmission: data,
        updatedAt: now,
        status: 'submitted',
      },
      $setOnInsert: {
        createdAt: now,
        userId: filter.userId,
      },
    };

    const result = await db.collection('applications').updateOne(filter, updateDoc, { upsert: true });

    return new Response(
      JSON.stringify({
        message: 'Application submitted',
        upsertedId: result.upsertedId || null,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        createdAt: now.toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('final-submit error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}