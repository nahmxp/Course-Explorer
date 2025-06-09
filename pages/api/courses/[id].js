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
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const { client, db } = await connectToDatabase();

    switch (method) {
      case 'GET':
        const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });
        
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
        break;

      case 'DELETE':
        const deleteResult = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Course not found' });
        }

        res.status(204).end(); // No content to send back on successful deletion
        break;

      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 