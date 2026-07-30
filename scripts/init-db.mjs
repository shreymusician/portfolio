// One-time setup script: creates the MongoDB indexes described in Design.md
// Section 5. Run with `npm run db:init` after MONGODB_URI is configured.
import pkg from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  console.error('Missing MONGODB_URI. Set it in .env.local before running this script.');
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);

  console.log(`Creating indexes on database "${dbName}"...`);

  await db
    .collection("projects")
    .createIndex({ published: 1, featured: -1, order: 1 });
  console.log("  projects: { published: 1, featured: -1, order: 1 }");

  await db.collection("projects").createIndex({ slug: 1 }, { unique: true });
  console.log("  projects: { slug: 1 } (unique)");

  console.log("Done.");
} finally {
  await client.close();
}
