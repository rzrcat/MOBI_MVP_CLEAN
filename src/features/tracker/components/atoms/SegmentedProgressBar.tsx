'use client';
import React from 'react';

type ThemeColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'gray'
  | 'custom';

interface SegmentedProgressBarProps {
  total: number;
  completed: number;
  color?: ThemeColor;
  customColor?: string;
  onClick?: (idx: number) => void;
}

/**
 * 분할형 진행도 바 컴포넌트
 * 다회차 미션의 진행 상태를 표시하는데 사용됩니다.
 * 진행도별 색상이 진해지고, 테두리는 연한 색상으로 표시됩니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.total - 전체 세그먼트 수
 * @param props.completed - 완료된 세그먼트 수
 * @param props.color - 프리셋 색상 (기본값: 'blue')
 * @param props.customColor - 커스텀 색상 (HEX/RGB 값, color가 'custom'일 때 사용)
 * @param props.onClick - 세그먼트 클릭 핸들러 (선택사항)
 * @returns 분할형 진행도 바 컴포넌트
 */
export function SegmentedProgressBar({
  total,
  completed,
  color = 'blue',
  customColor,
  onClick,
}: SegmentedProgressBarProps) {
  const colorSteps: Record<Exclude<ThemeColor, 'custom'>, string[]> = {
    blue: [
      'bg-blue-200',
      'bg-blue-300',
      'bg-blue-400',
      'bg-blue-500',
      'bg-blue-600',
      'bg-blue-700',
    ],
    green: [
      'bg-green-200',
      'bg-green-300',
      'bg-green-400',
      'bg-green-500',
      'bg-green-600',
      'bg-green-700',
    ],
    purple: [
      'bg-purple-200',
      'bg-purple-300',
      'bg-purple-400',
      'bg-purple-500',
      'bg-purple-600',
      'bg-purple-700',
    ],
    pink: [
      'bg-pink-200',
      'bg-pink-300',
      'bg-pink-400',
      'bg-pink-500',
      'bg-pink-600',
      'bg-pink-700',
    ],
    orange: [
      'bg-orange-200',
      'bg-orange-300',
      'bg-orange-400',
      'bg-orange-500',
      'bg-orange-600',
      'bg-orange-700',
    ],
    gray: [
      'bg-gray-200',
      'bg-gray-300',
      'bg-gray-400',
      'bg-gray-500',
      'bg-gray-600',
      'bg-gray-700',
    ],
  };
  const borderSteps: Record<Exclude<ThemeColor, 'custom'>, string> = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    pink: 'border-pink-200',
    orange: 'border-orange-200',
    gray: 'border-gray-200',
  };
  if (color === 'custom' && customColor) {
    return (
      <div className="battery-bar flex gap-1 w-full max-w-[10rem] h-7 select-none">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}회차 ${i < completed ? '완료' : '미완료'}`}
            className={`flex-1 h-full min-w-[2.2rem] rounded border transition-colors duration-100 ${i < completed ? '' : 'bg-gray-100 border-gray-300'} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-400' : ''}`}
            style={
              i < completed
                ? { background: customColor, borderColor: customColor }
                : {}
            }
            onClick={onClick ? () => onClick(i) : undefined}
            tabIndex={0}
          />
        ))}
      </div>
    );
  }
  const stepColors =
    colorSteps[color as Exclude<ThemeColor, 'custom'>] || colorSteps.blue;
  const borderColor =
    borderSteps[color as Exclude<ThemeColor, 'custom'>] || 'border-blue-200';
  return (
    <div className="battery-bar flex gap-1 w-full max-w-[10rem] h-7 select-none">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}회차 ${i < completed ? '완료' : '미완료'}`}
          className={`flex-1 h-full min-w-[2.2rem] rounded border ${borderColor} transition-colors duration-100 ${i < completed ? stepColors[Math.min(i, stepColors.length - 1)] : 'bg-gray-100'} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-400' : ''}`}
          style={{ minWidth: 0 }}
          onClick={onClick ? () => onClick(i) : undefined}
          tabIndex={0}
        />
      ))}
    </div>
  );
}
