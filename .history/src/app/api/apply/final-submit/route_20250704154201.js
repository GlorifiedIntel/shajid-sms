import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return new Response(JSON.stringify({ error: 'Missing userId or data' }), { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Insert application data, add timestamp
    const result = await db.collection('applications').insertOne({
      userId: new ObjectId(userId),
      data,
      createdAt: new Date(),
      status: 'submitted',
    });

    return new Response(JSON.stringify({ insertedId: result.insertedId, createdAt: new Date() }), {
      status: 201,
    });
  } catch (error) {
    console.error('final-submit error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}