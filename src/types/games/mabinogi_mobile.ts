export type RuneGrade = '고급' | '레어' | '엘리트' | '에픽' | '전설';

export type RuneCategory = '무기' | '방어구' | '엠블럼' | '장신구';

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

export interface RuneStats {
  attack?: number;
  defense?: number;
  magicAttack?: number;
  magicDefense?: number;
  critical?: number;
  balance?: number;
  maxHp?: number;
  maxMp?: number;
  maxStamina?: number;
}

export interface RuneEpicAchievement {
  allSkills?: number; // 모든 스킬 n챕터
  specificSkills?: {
    count: number; // 임의 n개 스킬
    chapter: number; // m챕터
  };
}

export interface RuneCombinationRune {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface RuneCombination {
  name: string;
  description: string;
  runes: RuneCombinationRune[];
}

export interface Rune {
  id: string;
  name: string;
  category: RuneCategory;
  grade: RuneGrade;
  classes: RuneClass[];
  effect: string;
  duration?: number; // 효과 지속 시간 (초)
  cooldown?: number; // 쿨다운 시간 (초)
  obtainMethod: string[];
  imageUrl: string;
  stats?: RuneStats;
  description?: string;
  usage?: string;
  notes?: string[];
  tradeable?: boolean; // 판매 가능 여부
  weight?: number; // 무게
  curseRate?: number; // 저주 확률 (%)
  epicAchievement?: RuneEpicAchievement;
  recommendedClasses?: RuneClass[]; // 추천 직업
  recommendedCombinations?: RuneCombination[]; // 추천 룬 조합
}

export interface RuneComment {
  id: string;
  runeId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isBlinded?: boolean;
  likes: number;
  isAdmin?: boolean;
}

export interface RuneReview {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isBlinded?: boolean;
}

export interface RuneObtainMethod {
  method: string;
  difficulty: '쉬움' | '보통' | '어려움';
  description: string;
}

export interface RunePartyRecommendation {
  minLevel: number;
  maxPlayers: number;
  recommendedClasses: RuneClass[];
}

export interface RuneGuide {
  id: string;
  runeId: string;
  title: string;
  content: string;
  obtainMethods: RuneObtainMethod[];
  recommendedParty?: RunePartyRecommendation;
  tips: string[];
  updatedAt: Date;
}

export type OutfitCategory =
  | '일상복'
  | '전투복'
  | '로브'
  | '드레스'
  | '정장'
  | '캐주얼'
  | '코스튬'
  | '특수복';

export type OutfitRarity = '일반' | '고급' | '희귀' | '영웅' | '전설';

export type OutfitSlot =
  | '머리'
  | '얼굴'
  | '상의'
  | '하의'
  | '망토'
  | '신발'
  | '장갑'
  | '액세서리';

export interface OutfitStats {
  defense?: number;
  magicDefense?: number;
  protection?: number;
  durability?: number;
  weight?: number;
}

export interface Outfit {
  id: string;
  name: string;
  category: OutfitCategory;
  rarity: OutfitRarity;
  slots: OutfitSlot[];
  stats?: OutfitStats;
  description?: string;
  obtainMethod: string[];
  imageUrl: string;
  requiredLevel?: number;
  price?: number;
  tradeable: boolean;
  dyeable: boolean;
  setInfo?: {
    setName: string;
    setPieces: string[];
    setEffect: string;
  };
}

export interface OutfitComment {
  id: string;
  outfitId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isBlinded?: boolean;
  likes: number;
  isAdmin?: boolean;
}

export interface OutfitCoordination {
  id: string;
  title: string;
  description?: string;
  outfits: {
    outfitId: string;
    dye?: {
      primary: string;
      secondary?: string;
      accent?: string;
    };
  }[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  views: number;
  tags: string[];
  imageUrl: string;
}

export type ServerStatus = 'online' | 'maintenance' | 'busy' | 'crowded';

export interface GameServer {
  id: string;
  name: string;
  status: ServerStatus;
  population: number; // 서버 인구 수 (0-100 사이의 수치)
  region: string;
  maintenanceMessage?: string;
  maintenanceEndTime?: string;
  lastChecked: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  url?: string;
  rewards?: string[];
  isSpecial?: boolean;
  category: 'general' | 'update' | 'bonus' | 'community';
}
