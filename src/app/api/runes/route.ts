import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { runes } from '@/db/schema';

const sqlite = new Database('prisma/dev.db');
const db = drizzle(sqlite);

export async function GET() {
  const allRunes = await db.select().from(runes);
  return Response.json(allRunes);
}
