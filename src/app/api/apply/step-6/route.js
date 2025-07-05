import { clientPromise } from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const { userId, data } = await req.json();

    if (!userId || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or data in request body' }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection('applications');

    const filter = { userId };
    const updateDoc = {
      $set: {
        step6: data,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        userId,
      },
    };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, updateDoc, options);

    return new Response(
      JSON.stringify({ message: 'Step 6 data saved successfully', result }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in step-6 API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}