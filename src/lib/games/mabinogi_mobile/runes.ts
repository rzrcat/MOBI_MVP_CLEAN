import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { runes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  Rune,
  RuneCategory,
  RuneGrade,
  RuneClass,
  RuneCombination,
  RuneStat,
  RuneEpicAchievement,
} from '@/types/games/mabinogi_mobile/index';

const sqlite = new Database('./dev.db');
const db = drizzle(sqlite);

export async function getRunes(): Promise<Rune[]> {
  const result = await db.select().from(runes);
  // comments는 별도 쿼리로 가져오거나, join으로 확장 가능
  return result.map((rune) => {
    const runeObj: Rune = {
      id: rune.id,
      createdAt: new Date(rune.createdAt),
      updatedAt: new Date(rune.updatedAt),
      name: rune.name,
      category: rune.category as RuneCategory,
      grade: rune.grade as RuneGrade,
      classes: JSON.parse(rune.classes) as RuneClass[],
      effect: rune.effect,
      obtainMethod: JSON.parse(rune.obtainMethod) as string[],
      recommendedCombinations: JSON.parse(
        rune.recommendedCombinations
      ) as RuneCombination[],
      notes: JSON.parse(rune.notes) as string[],
      tradeable: Boolean(rune.tradeable),
    };

    // 옵셔널 필드 처리
    if (rune.duration) runeObj.duration = rune.duration;
    if (rune.cooldown) runeObj.cooldown = rune.cooldown;
    if (rune.imageUrl) runeObj.imageUrl = rune.imageUrl;
    if (rune.stats) runeObj.stats = JSON.parse(rune.stats) as RuneStat[];
    if (rune.description) runeObj.description = rune.description;
    if (rune.usage) runeObj.usage = rune.usage;
    if (rune.weight) runeObj.weight = rune.weight;
    if (rune.curseRate) runeObj.curseRate = rune.curseRate;
    if (rune.epicAchievement) {
      runeObj.epicAchievement = JSON.parse(
        rune.epicAchievement
      ) as RuneEpicAchievement;
    }

    return runeObj;
  });
}

export async function getRune(id: string): Promise<Rune | null> {
  const rune = await db.select().from(runes).where(eq(runes.id, id));
  if (!rune[0]) return null;
  const r = rune[0];

  const runeObj: Rune = {
    id: r.id,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
    name: r.name,
    category: r.category as RuneCategory,
    grade: r.grade as RuneGrade,
    classes: JSON.parse(r.classes) as RuneClass[],
    effect: r.effect,
    obtainMethod: JSON.parse(r.obtainMethod) as string[],
    recommendedCombinations: JSON.parse(
      r.recommendedCombinations
    ) as RuneCombination[],
    notes: JSON.parse(r.notes) as string[],
    tradeable: Boolean(r.tradeable),
  };

  // 옵셔널 필드 처리
  if (r.duration) runeObj.duration = r.duration;
  if (r.cooldown) runeObj.cooldown = r.cooldown;
  if (r.imageUrl) runeObj.imageUrl = r.imageUrl;
  if (r.stats) runeObj.stats = JSON.parse(r.stats) as RuneStat[];
  if (r.description) runeObj.description = r.description;
  if (r.usage) runeObj.usage = r.usage;
  if (r.weight) runeObj.weight = r.weight;
  if (r.curseRate) runeObj.curseRate = r.curseRate;
  if (r.epicAchievement) {
    runeObj.epicAchievement = JSON.parse(
      r.epicAchievement
    ) as RuneEpicAchievement;
  }

  return runeObj;
}
