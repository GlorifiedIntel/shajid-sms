import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or data' }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const filter = { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : userId };
    const now = new Date();

    const updateDoc = {
      $set: {
        data,
        updatedAt: now,
        status: 'submitted',
      },
      $setOnInsert: {
        createdAt: now,
      },
    };

    const result = await db.collection('applications').updateOne(filter, updateDoc, {
      upsert: true,
    });

    return new Response(
      JSON.stringify({
        message: 'Application submitted',
        upsertedId: result.upsertedId || null,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
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