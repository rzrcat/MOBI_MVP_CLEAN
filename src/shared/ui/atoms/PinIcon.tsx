import React from 'react';

const ACCENT_COLORS: Record<string, { bg: string; color: string }> = {
  blue: { bg: '#3B82F6', color: '#fff' },
  green: { bg: '#22C55E', color: '#fff' },
  pink: { bg: '#EC4899', color: '#fff' },
  orange: { bg: '#F59E42', color: '#fff' },
  purple: { bg: '#A78BFA', color: '#fff' },
  gray: { bg: '#6B7280', color: '#fff' },
  yellow: { bg: '#FACC15', color: '#fff' },
};

export function PinIcon({
  size = 32,
  accent = 'blue', // 테마 색상명
}: {
  size?: number;
  accent?: keyof typeof ACCENT_COLORS;
}) {
  const { bg, color } = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* 그림자 */}
      <ellipse cx="22" cy="34" rx="6" ry="2" fill="#000" fillOpacity="0.12" />
      {/* 핀 전체를 약간 기울임 */}
      <g transform="rotate(-18 20 20)">
        {/* 핀 머리 (더 동글게, 귀엽게) */}
        <ellipse
          cx="20"
          cy="13"
          rx="6"
          ry="5"
          fill={color}
          stroke={bg}
          strokeWidth="2"
        />
        {/* 핀 몸통 (짧고 두껍게) */}
        <rect x="18.5" y="13" width="3" height="10" rx="1.5" fill={bg} />
        {/* 핀 끝 (둥글게) */}
        <rect x="19.25" y="22" width="1.5" height="5" rx="0.75" fill={bg} />
        {/* 광택 효과 */}
        <ellipse
          cx="21"
          cy="12"
          rx="1.2"
          ry="0.7"
          fill="#fff"
          fillOpacity="0.5"
        />
      </g>
    </svg>
  );
}
