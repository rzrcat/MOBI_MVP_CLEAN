'use client';
import React from 'react';
import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import { MissionTooltip } from '@/features/tracker/components/atoms/MissionTooltip';
import { TRACKER_STYLES } from '@/features/tracker/constants/styles';
import { CheckStampIcon } from '@/shared/ui/atoms/CheckStampIcon';

interface MissionCardProps {
  mission: MissionTask;
  progress: { isComplete: boolean };
  themeColor: string;
  themeClasses: {
    cardBorder: string;
  };
  onSetMissionCount: (missionId: string, count: number) => void;
}

/**
 * 미션 카드 컴포넌트
 * 1회 완료형 미션을 표시하는 카드 컴포넌트입니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.mission - 미션 정보
 * @param props.progress - 미션 진행 상태
 * @param props.themeColor - 테마 색상
 * @param props.themeClasses - 테마 클래스 객체
 * @param props.onSetMissionCount - 미션 상태 변경 핸들러
 * @returns 미션 카드 컴포넌트
 */
export function MissionCard({
  mission,
  progress,
  themeColor,
  themeClasses,
  onSetMissionCount,
}: MissionCardProps) {
  return (
    <div
      key={mission.id}
      className={[
        TRACKER_STYLES.cardBase,
        themeClasses.cardBorder,
        progress.isComplete ? TRACKER_STYLES.cardDone : '',
      ].join(' ')}
      style={themeColor === 'custom' ? { borderColor: themeColor } : {}}
      tabIndex={0}
      onClick={() => {
        const newCount = progress.isComplete ? 0 : 1;
        onSetMissionCount(mission.id, newCount);
      }}
    >
      {/* 체크박스 */}
      <div className="flex items-center justify-center w-8 h-8">
        {progress.isComplete ? (
          <CheckStampIcon size={32} />
        ) : (
          <span
            className={`w-6 h-6 flex-none rounded-full border-2 border-gray-300 flex items-center justify-center`}
          />
        )}
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
