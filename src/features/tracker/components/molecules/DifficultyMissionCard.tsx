'use client';
import React from 'react';
import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import { SegmentedProgressBar } from '@/features/tracker/components/atoms/SegmentedProgressBar';
import { MissionTooltip } from '@/features/tracker/components/atoms/MissionTooltip';
import {
  TRACKER_STYLES,
  ThemeColor,
} from '@/features/tracker/constants/styles';

interface DifficultyMissionCardProps {
  mission: MissionTask & {
    difficulties: Array<{ key: string; label: string; missionId: string }>;
  };
  themeColor: string;
  themeClasses: {
    cardBorder: string;
  };
  getMissionProgress: (missionId: string) => { isComplete: boolean };
  setMissionCount: (missionId: string, count: number) => void;
  setMultipleMissionCounts: (
    updates: { missionId: string; count: number }[]
  ) => void;
}

/**
 * 난이도별 미션 카드 컴포넌트
 * 사냥터 보스와 같이 난이도별로 분리된 미션을 하나의 통합 카드로 표시합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보 (난이도 정보 포함)
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.getMissionProgress - 미션 진행 상태 조회 함수
 * @param props.setMissionCount - 미션 상태 변경 함수
 * @param props.setMultipleMissionCounts - 여러 미션 상태 일괄 변경 함수
 * @returns 난이도별 미션 카드 컴포넌트
 */
export function DifficultyMissionCard({
  mission,
  themeColor,
  themeClasses,
  getMissionProgress,
  setMissionCount,
  setMultipleMissionCounts,
}: DifficultyMissionCardProps) {
  // 난이도별 진행 상태 확인
  const progresses = mission.difficulties.map((d) =>
    getMissionProgress(d.missionId)
  );
  const completedCount = progresses.filter((p) => p.isComplete).length;
  const allComplete = completedCount === mission.difficulties.length;

  return (
    <div
      key={mission.id}
      className={[
        TRACKER_STYLES.cardBase,
        themeClasses.cardBorder,
        allComplete ? TRACKER_STYLES.cardDone : '',
        'justify-between min-h-[3.5rem]',
      ].join(' ')}
      style={themeColor === 'custom' ? { borderColor: themeColor } : {}}
      tabIndex={0}
      onClick={() => {
        setMultipleMissionCounts(
          mission.difficulties
            ? mission.difficulties.map((d) => ({
                missionId: d.missionId,
                count: allComplete ? 0 : 1,
              }))
            : []
        );
      }}
    >
      {/* 진행도 bar + 숫자 */}
      <div className="flex flex-col items-center min-w-[3.5rem]">
        <SegmentedProgressBar
          total={mission.difficulties.length}
          completed={completedCount}
          color={
            ['blue', 'green', 'purple', 'pink', 'orange', 'gray'].includes(
              themeColor
            )
              ? (themeColor as ThemeColor)
              : 'custom'
          }
          customColor={
            !['blue', 'green', 'purple', 'pink', 'orange', 'gray'].includes(
              themeColor
            )
              ? themeColor
              : undefined
          }
          onClick={(idx) => {
            if (mission.difficulties && idx < mission.difficulties.length) {
              // 일반 다회차 미션과 동일하게 idx까지 모두 체크/해제
              const checkedCount = progresses.filter(
                (p) => p.isComplete
              ).length;
              const newCount = checkedCount === idx + 1 ? idx : idx + 1;
              mission.difficulties.forEach((d, i) => {
                setMissionCount(d.missionId, i < newCount ? 1 : 0);
              });
            }
          }}
        />
        <span className="text-xs text-gray-400 mt-0.5">
          {completedCount}/{mission.difficulties.length}
        </span>
      </div>

      {/* 제목/설명/상태 */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={[
            TRACKER_STYLES.cardTitleText,
            allComplete ? 'line-through text-gray-400' : '',
          ].join(' ')}
        >
          {mission.title}
        </span>
        <span className={TRACKER_STYLES.cardDescText}>
          {mission.description}
          {mission.description ? (
            <MissionTooltip description={mission.description} />
          ) : null}
        </span>
      </div>
    </div>
  );
}
