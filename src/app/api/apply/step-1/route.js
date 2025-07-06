import { dbConnect } from '../../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      personalInfo, // expects an object with all form fields + photo base64 string
    } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
      });
    }

    await dbConnect();
    const db = mongoose.connection;
    const collection = db.collection('applications');

    const filter = { userId: new mongoose.Types.ObjectId(userId) };

    const updateDoc = {
      $set: {
        step1: personalInfo,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        userId: new mongoose.Types.ObjectId(userId),
      },
    };

    const result = await collection.updateOne(filter, updateDoc, { upsert: true });

    return new Response(
      JSON.stringify({ message: 'Step 1 data saved successfully', result }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in step-1 API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
