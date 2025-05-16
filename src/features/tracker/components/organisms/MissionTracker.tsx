'use client';
import React from 'react';
import { useMissionProgress } from '@/features/tracker/hooks/useMissionProgress';
import { MissionCard } from '@/features/tracker/components/molecules/MissionCard';
import { MultiProgressMissionCard } from '@/features/tracker/components/molecules/MultiProgressMissionCard';
import { DifficultyMissionCard } from '@/features/tracker/components/molecules/DifficultyMissionCard';
import { getThemeColorClasses } from '@/features/tracker/constants/styles';
import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import {
  isDailyResetDue,
  isWeeklyResetDue,
} from '@/features/tracker/utils/missionUtils';
import { useCharacterTaskStore } from '@/shared/store/useCharacterTaskStore';

// 난이도별 미션을 위한 타입 정의
interface MissionWithDifficulties extends MissionTask {
  difficulties: Array<{ key: string; label: string; missionId: string }>;
}

/**
 * 미션 트래커 컴포넌트
 * 캐릭터별 일일/주간 미션 진행 상태를 표시하는 상위 컴포넌트입니다.
 * 단일 미션, 다회차 미션, 난이도별 미션을 모두 관리합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.characterId - 캐릭터 ID
 * @param props.themeColor - 테마 색상 (기본값: 'blue')
 * @param props.showDaily - 일일 미션 표시 여부 (기본값: true)
 * @param props.showWeekly - 주간 미션 표시 여부 (기본값: true)
 */
export function MissionTracker({
  characterId,
  themeColor = 'blue',
  showDaily = true,
  showWeekly = true,
}: {
  characterId: string;
  themeColor?: string;
  showDaily?: boolean;
  showWeekly?: boolean;
}) {
  const {
    dailyMissions,
    weeklyMissions,
    dailyProgress,
    weeklyProgress,
    getMissionProgress,
    setMissionCount,
    setMultipleMissionCounts,
  } = useMissionProgress(characterId);

  const colorClasses = getThemeColorClasses(themeColor);

  const resetAllMissions = useCharacterTaskStore((s) => s.resetAllMissions);

  React.useEffect(() => {
    if (!characterId) return;
    // 캐릭터별로 lastDailyReset, lastWeeklyReset 관리
    const dailyKey = `lastDailyReset_${characterId}`;
    const weeklyKey = `lastWeeklyReset_${characterId}`;
    const lastDailyReset = localStorage.getItem(dailyKey);
    const lastWeeklyReset = localStorage.getItem(weeklyKey);
    let didReset = false;
    if (isDailyResetDue(lastDailyReset)) {
      resetAllMissions(characterId);
      localStorage.setItem(dailyKey, new Date().toISOString());
      didReset = true;
    }
    if (isWeeklyResetDue(lastWeeklyReset)) {
      resetAllMissions(characterId);
      localStorage.setItem(weeklyKey, new Date().toISOString());
      didReset = true;
    }
    // 최초 진입 시 last*Reset이 없으면 오늘 날짜로 저장
    if (!lastDailyReset && !didReset) {
      localStorage.setItem(dailyKey, new Date().toISOString());
    }
    if (!lastWeeklyReset && !didReset) {
      localStorage.setItem(weeklyKey, new Date().toISOString());
    }
  }, [characterId, resetAllMissions]);

  // 난이도별 미션인지 확인하는 함수
  const isDifficultyMission = (
    mission: MissionTask
  ): mission is MissionWithDifficulties => {
    return !!mission.difficulties && mission.difficulties.length > 0;
  };

  // 다회차 미션인지 확인하는 함수
  const isMultiProgressMission = (mission: MissionTask) => {
    return mission.maxCompletions > 1 && !isDifficultyMission(mission);
  };

  // 수동 초기화 핸들러
  const handleManualReset = (type: 'daily' | 'weekly') => {
    resetAllMissions(characterId);
    const now = new Date().toISOString();
    if (type === 'daily') {
      localStorage.setItem(`lastDailyReset_${characterId}`, now);
    } else {
      localStorage.setItem(`lastWeeklyReset_${characterId}`, now);
    }
  };

  return (
    <div className="space-y-6">
      {showDaily && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-lg font-bold ${colorClasses.textTitle}`}>
              일일 미션
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {dailyProgress.completed}/{dailyProgress.total} (
                {dailyProgress.percent}%)
              </span>
              <button
                className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                onClick={() => handleManualReset('daily')}
              >
                초기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyMissions.map((mission) => {
              if (isDifficultyMission(mission)) {
                return (
                  <DifficultyMissionCard
                    key={mission.id}
                    mission={mission}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    getMissionProgress={getMissionProgress}
                    setMissionCount={setMissionCount}
                    setMultipleMissionCounts={setMultipleMissionCounts}
                  />
                );
              } else if (isMultiProgressMission(mission)) {
                return (
                  <MultiProgressMissionCard
                    key={mission.id}
                    mission={mission}
                    progress={getMissionProgress(mission.id)}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    onSetMissionCount={setMissionCount}
                  />
                );
              } else {
                return (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    progress={getMissionProgress(mission.id)}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    onSetMissionCount={setMissionCount}
                  />
                );
              }
            })}
          </div>
        </section>
      )}

      {showWeekly && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-lg font-bold ${colorClasses.textTitle}`}>
              주간 미션
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {weeklyProgress.completed}/{weeklyProgress.total} (
                {weeklyProgress.percent}%)
              </span>
              <button
                className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                onClick={() => handleManualReset('weekly')}
              >
                초기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyMissions.map((mission) => {
              if (isDifficultyMission(mission)) {
                return (
                  <DifficultyMissionCard
                    key={mission.id}
                    mission={mission}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    getMissionProgress={getMissionProgress}
                    setMissionCount={setMissionCount}
                    setMultipleMissionCounts={setMultipleMissionCounts}
                  />
                );
              } else if (isMultiProgressMission(mission)) {
                return (
                  <MultiProgressMissionCard
                    key={mission.id}
                    mission={mission}
                    progress={getMissionProgress(mission.id)}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    onSetMissionCount={setMissionCount}
                  />
                );
              } else {
                return (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    progress={getMissionProgress(mission.id)}
                    themeColor={themeColor}
                    themeClasses={colorClasses}
                    onSetMissionCount={setMissionCount}
                  />
                );
              }
            })}
          </div>
        </section>
      )}
    </div>
  );
}
