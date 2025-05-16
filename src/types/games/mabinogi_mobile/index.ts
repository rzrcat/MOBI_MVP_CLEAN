// Export all crawler-related types
export * from './crawler';

// RuneGrade 타입 정의
export type RuneGrade = '고급' | '레어' | '엘리트' | '에픽' | '전설';

// RuneCategory 타입 정의
export type RuneCategory = '무기' | '방어구' | '엠블럼' | '장신구';

// RuneClass 타입 정의
export type RuneClass =
  | '전사'
  | '대검전사'
  | '검술사'
  | '궁수'
  | '석궁사수'
  | '장궁병'
  | '마법사'
  | '화염술사'
  | '빙결술사'
  | '힐러'
  | '사제'
  | '수도사'
  | '음유시인'
  | '댄서'
  | '악사'
  | '도적'
  | '격투가'
  | '듀얼블레이드';

// RuneStat 타입 정의 (개별 스탯 아이템)
export interface RuneStat {
  name: string;
  value: string | number;
}

// RuneCombination 타입 정의
export type RuneCombination = string;

// RuneEpicAchievement 타입 정의
export interface RuneEpicAchievement {
  name: string;
  description: string;
}

// Rune 타입 정의
export interface Rune {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  category: RuneCategory;
  grade: RuneGrade;
  classes: RuneClass[];
  effect: string;
  duration?: number;
  cooldown?: number;
  obtainMethod: string[];
  imageUrl?: string;
  recommendedCombinations: RuneCombination[];
  stats?: RuneStat[]; // RuneStat 배열로 변경
  description?: string;
  usage?: string;
  notes: string[];
  tradeable: boolean;
  weight?: number;
  curseRate?: number;
  epicAchievement?: RuneEpicAchievement;
}

// Outfit 관련 타입 정의 (더미)
export interface Outfit {
  id: string;
  name: string;
  category: OutfitCategory;
  rarity: OutfitRarity;
  slot: OutfitSlot;
  imageUrl?: string;
  description?: string;
}

export type OutfitCategory =
  | '상의'
  | '하의'
  | '신발'
  | '모자'
  | '장갑'
  | '망토'
  | '기타';
export type OutfitRarity = '일반' | '고급' | '희귀' | '영웅' | '에픽' | '전설';
export type OutfitSlot = '머리' | '몸통' | '다리' | '발' | '손' | '등' | '기타';
