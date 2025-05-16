import { Rune } from '@/types/games/mabinogi_mobile/index';
import {
  getRunes as getRunesFromLib,
  getRune as getRuneFromLib,
} from '@/lib/games/mabinogi_mobile/runes';

export async function fetchRunes(): Promise<Rune[]> {
  try {
    const runes = await getRunesFromLib();
    return runes;
  } catch (error) {
    console.error('Error fetching runes:', error);
    throw error;
  }
}

export async function fetchRuneById(id: string): Promise<Rune | null> {
  try {
    const rune = await getRuneFromLib(id);
    return rune;
  } catch (error) {
    console.error(`Error fetching rune with id ${id}:`, error);
    throw error;
  }
}
