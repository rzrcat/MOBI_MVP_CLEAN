'use client';
import React from 'react';
import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import { SegmentedProgressBar } from '@/features/tracker/components/atoms/SegmentedProgressBar';
import { MissionTooltip } from '@/features/tracker/components/atoms/MissionTooltip';
import { TRACKER_STYLES } from '@/features/tracker/constants/styles';
import { ThemeColor } from '@/features/tracker/constants/styles';

interface MultiProgressMissionCardProps {
  mission: MissionTask;
  progress: { completionCount: number; isComplete: boolean };
  themeColor: string;
  themeClasses: {
    cardBorder: string;
    cardTitle: string;
  };
  onSetMissionCount: (missionId: string, count: number) => void;
}

/**
 * 다회차 진행 미션 카드 컴포넌트
 * 1개 이상의 완료 횟수가 필요한 미션을 표시하며, 세그먼트 단위로 진행 상태를 시각화합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보
 * @param props.progress - 미션 진행 상태 (완료 횟수와 완료 여부)
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.onSetMissionCount - 미션 상태 변경 핸들러
 * @returns 다회차 진행 미션 카드 컴포넌트
 */
export function MultiProgressMissionCard({
  mission,
  progress,
  themeColor,
  themeClasses,
  onSetMissionCount,
}: MultiProgressMissionCardProps) {
  const { cardBorder } = themeClasses;

  return (
    <div
      key={mission.id}
      className={[
        TRACKER_STYLES.cardBase,
        cardBorder,
        progress.isComplete ? TRACKER_STYLES.cardDone : '',
        'justify-between min-h-[3.5rem]',
      ].join(' ')}
      style={themeColor === 'custom' ? { borderColor: themeColor } : {}}
      tabIndex={0}
      onClick={() => {
        const newCount = progress.isComplete ? 0 : mission.maxCompletions;
        onSetMissionCount(mission.id, newCount);
      }}
    >
      {/* 진행도 bar + 숫자 */}
      <div className="flex flex-col items-center min-w-[3.5rem]">
        <SegmentedProgressBar
          total={mission.maxCompletions}
          completed={progress.completionCount}
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
            // 인덱스까지 모두 체크하거나, 이미 해당 인덱스까지 체크되어 있으면 인덱스-1까지 체크
            const newCount =
              progress.completionCount === idx + 1 ? idx : idx + 1;
            onSetMissionCount(mission.id, newCount);
          }}
        />
        <span className="text-xs text-gray-400 mt-0.5">
          {progress.completionCount}/{mission.maxCompletions}
        </span>
      </div>

      {/* 제목/설명/상태 */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={[
            TRACKER_STYLES.cardTitleText,
            progress.isComplete ? 'line-through text-gray-400' : '',
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
