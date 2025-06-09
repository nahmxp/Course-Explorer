import { MongoClient } from "mongodb";

let client;

export async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
  }
  return client.db();
}
