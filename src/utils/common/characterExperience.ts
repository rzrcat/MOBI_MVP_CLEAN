interface ExperienceAction {
  type: string;
  multiplier?: number;
}

interface ExperienceGain {
  amount: number;
  source: string;
  bonuses: { reason: string; amount: number }[];
}

const BASE_EXPERIENCE_VALUES: Record<string, number> = {
  help_viewed: 10,
  interaction: 5,
  daily_completed: 20,
  quest_completed: 15,
  event_participated: 25,
  achievement_unlocked: 50,
};

const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  450, // Level 4
  700, // Level 5
  1000, // Level 6
  1400, // Level 7
  1900, // Level 8
  2500, // Level 9
  3200, // Level 10
];

export function calculateExperienceGain(
  action: ExperienceAction
): ExperienceGain {
  const baseAmount = BASE_EXPERIENCE_VALUES[action.type] || 0;
  const bonuses: { reason: string; amount: number }[] = [];

  // Apply action-specific multiplier
  if (action.multiplier && action.multiplier > 1) {
    const bonusAmount = Math.floor(baseAmount * (action.multiplier - 1));
    bonuses.push({
      reason: '상호작용 보너스',
      amount: bonusAmount,
    });
  }

  // Time-based bonuses
  const currentHour = new Date().getHours();
  if (currentHour >= 2 && currentHour <= 5) {
    // Night owl bonus
    const nightOwlBonus = Math.floor(baseAmount * 0.5);
    bonuses.push({
      reason: '심야 보너스',
      amount: nightOwlBonus,
    });
  }

  // Calculate total with bonuses
  const totalAmount =
    baseAmount + bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);

  return {
    amount: totalAmount,
    source: action.type,
    bonuses,
  };
}

export function calculateLevel(totalExperience: number): {
  level: number;
  currentExp: number;
  nextLevelExp: number;
  progress: number;
} {
  let level = 1;

  // Find current level
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalExperience >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  // Calculate experience values
  const currentLevelExp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelExp =
    LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const currentExp = totalExperience - currentLevelExp;
  const expNeededForNextLevel = nextLevelExp - currentLevelExp;
  const progress = (currentExp / expNeededForNextLevel) * 100;

  return {
    level,
    currentExp,
    nextLevelExp: expNeededForNextLevel,
    progress,
  };
}

export function getUnlockedFeatures(level: number): string[] {
  const features: Record<number, string[]> = {
    1: ['기본 대화'],
    2: ['감정표현', '일일 퀘스트 알림'],
    3: ['이벤트 알림', '커스텀 메시지'],
    4: ['고급 감정표현', '실시간 게임 정보'],
    5: ['위치 기억', '테마 변경'],
    6: ['특별 애니메이션', '우선순위 알림'],
    7: ['AI 대화 기능', '자동 일정 관리'],
    8: ['커스텀 애니메이션', '게임 통계'],
    9: ['다중 프로필', 'VIP 이벤트 알림'],
    10: ['특별한 효과', '모든 기능 해금'],
  };

  return features[level] || [];
}

export function getNextMilestone(level: number): {
  level: number;
  feature: string;
  expNeeded: number;
} {
  const nextLevel = level + 1;
  if (nextLevel > LEVEL_THRESHOLDS.length) {
    return {
      level: nextLevel,
      feature: '최고 레벨 달성!',
      expNeeded: 0,
    };
  }

  const features = getUnlockedFeatures(nextLevel);
  return {
    level: nextLevel,
    feature: features[0] || '새로운 기능',
    expNeeded: LEVEL_THRESHOLDS[nextLevel - 1] - LEVEL_THRESHOLDS[level - 1],
  };
}
