import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { runes } from '@/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('prisma/dev.db');
const db = drizzle(sqlite);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const rune = await db.select().from(runes).where(eq(runes.id, params.id));
  if (!rune[0]) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(rune[0]);
}
