import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'course-explorer';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { client, db } = await connectToDatabase();

    switch (method) {
      case 'GET':
        const courses = await db.collection('courses').find({}).toArray();
        res.status(200).json(courses);
        break;

      case 'POST':
        const { driveLink, name, description, imageLink } = req.body;
        
        if (!driveLink || !name) {
          return res.status(400).json({ error: 'Drive link and Course Name are required' });
        }

        const newCourse = {
          driveLink,
          name,
          description: description || '',
          imageLink: imageLink || '',
          createdAt: new Date(),
        };

        const result = await db.collection('courses').insertOne(newCourse);
        res.status(201).json({ ...newCourse, _id: result.insertedId });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 