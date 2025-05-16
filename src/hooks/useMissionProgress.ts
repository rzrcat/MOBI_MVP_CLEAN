'use client';

import { useCharacterTaskStore } from '@/store/useCharacterTaskStore';
import { MISSION_TASKS } from '@/utils/common/dailyTasks';
import {
  calculateMissionProgress,
  getMissionsByType,
} from '@/utils/common/missionUtils';

/**
 * 캐릭터별 미션 진행 상태 관리를 위한 커스텀 훅
 * 미션 상태 관리와 계산 로직을 재사용할 수 있게 합니다.
 */
export function useMissionProgress(characterId: string) {
  const {
    getMissionProgress,
    resetAllMissions,
    setMissionCount,
    setMultipleMissionCounts,
  } = useCharacterTaskStore();

  // 미션 타입별 분류
  const { dailyMissions, weeklyMissions, dailyByCategory, weeklyByCategory } =
    getMissionsByType();

  // 미션 진행률 계산 함수
  const getProgress = (missions: typeof MISSION_TASKS) => {
    return calculateMissionProgress(missions, (missionId) =>
      getMissionProgress(characterId, missionId)
    );
  };

  // 일일/주간 미션 진행률
  const dailyProgress = getProgress(dailyMissions);
  const weeklyProgress = getProgress(weeklyMissions);

  return {
    // 미션 데이터
    dailyMissions,
    weeklyMissions,
    dailyByCategory,
    weeklyByCategory,

    // 진행률
    dailyProgress,
    weeklyProgress,

    // 상태 조회 및 업데이트 함수
    getMissionProgress: (missionId: string) =>
      getMissionProgress(characterId, missionId),
    resetAllMissions: () => resetAllMissions(characterId),
    setMissionCount: (missionId: string, count: number) =>
      setMissionCount(characterId, missionId, count),
    setMultipleMissionCounts: (
      updates: { missionId: string; count: number }[]
    ) => setMultipleMissionCounts(characterId, updates),
  };
}
