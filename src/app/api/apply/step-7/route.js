import { dbConnect } from '../../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or data in request body' }),
        { status: 400 }
      );
    }

    await dbConnect();
    const db = mongoose.connection;
    const collection = db.collection('applications');

    const filter = { userId: new mongoose.Types.ObjectId(userId) };
    const now = new Date();

    const updateDoc = {
      $set: {
        finalSubmission: true,
        submittedData: data,
        submittedAt: now,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
        userId: new mongoose.Types.ObjectId(userId),
      },
    };

    const options = { upsert: true };

    const result = await collection.updateOne(filter, updateDoc, options);

    return new Response(
      JSON.stringify({ message: 'Application submitted successfully', createdAt: now }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in step-7 API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}