'use client';

import React from 'react';
import { RuneGrade } from '@/types/games/mabinogi_mobile/index';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'grade' | 'category' | 'class';
  gradeType?: RuneGrade;
}

export const gradeColors = {
  고급: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400',
  레어: 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400',
  엘리트: 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400',
  에픽: 'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-400',
  전설: 'bg-gradient-to-r from-red-500 to-red-600 border-red-400',
};

export const runeGlowColors = {
  고급: 'shadow-blue-400/50',
  레어: 'shadow-purple-400/50',
  엘리트: 'shadow-yellow-400/50',
  에픽: 'shadow-pink-400/50',
  전설: 'shadow-red-400/50',
};

export function RuneBadge({
  children,
  variant = 'class',
  gradeType,
}: BadgeProps) {
  if (variant === 'grade' && gradeType) {
    const gradeColor =
      gradeColors[gradeType] ||
      'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400';

    return (
      <div
        className={`text-xs px-2 py-1 rounded-full text-white ${gradeColor}`}
      >
        {children}
      </div>
    );
  }

  return (
    <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
      {children}
    </span>
  );
}
