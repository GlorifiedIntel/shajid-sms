import { clientPromise } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse multipart/form-data
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      maxFileSize: 5 * 1024 * 1024, // 5MB max
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);

    const {
      userId,
      fullName,
      gender,
      email,
      phone,
      address,
      dob,
      parentName,
      parentAddress,
    } = fields;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400 }
      );
    }

    // Handle photo
    let photoUrl = null;
    const photoFile = files?.photo;

    if (photoFile) {
      const fileExt = photoFile.originalFilename?.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const uploadDir = join(process.cwd(), '/public/uploads');
      const savePath = join(uploadDir, fileName);

      await writeFile(savePath, await photoFile.toBuffer());
      photoUrl = `/uploads/${fileName}`;
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('applications');

    const filter = { userId: new ObjectId(userId) };

    const personalInfo = {
      fullName,
      gender,
      email,
      phone,
      address,
      dob,
      parentName,
      parentAddress,
      photo: photoUrl,
    };

    const updateDoc = {
      $set: {
        step1: personalInfo,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        userId: new ObjectId(userId),
      },
    };

    const options = { upsert: true };

    const result = await collection.updateOne(filter, updateDoc, options);

    return new Response(
      JSON.stringify({ message: 'Step 1 data saved successfully', result }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in step-1 API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}