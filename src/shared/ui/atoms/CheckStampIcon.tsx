import React from 'react';

export function CheckStampIcon({
  size = 32,
  color = '#FFD600', // 기본 골드
  bg = 'rgba(0,0,0,0.2)',
}: {
  size?: number;
  color?: string;
  bg?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill={bg} />
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M16 25L22 31L33 18"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
