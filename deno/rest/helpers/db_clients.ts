import { MongoClient } from "npm:mongodb@5.6.0";

let db;
export async function connect() {
  const MONGODB_URI = `mongodb://todos:mypass@localhost:27017/todos?authSource=todos`;
  const DB_NAME = 'todos';
  const client = new MongoClient(MONGODB_URI);
  db = await client.connect();
}
export function getDb() {
  return db;
}
