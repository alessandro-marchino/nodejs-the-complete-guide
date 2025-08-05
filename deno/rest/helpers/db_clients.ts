import { MongoClient, Db } from "npm:mongodb@5.6.0";

let db: Db;
export async function connect() {
  const MONGODB_URI = `mongodb://todos:mypass@localhost:27017/todos?authSource=todos`;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db('todos');
}
export function getDb(): Db {
  return db;
}
