'use client';

import React from 'react';
import Image from 'next/image';
import { Rune } from '@/types/games/mabinogi_mobile/index';
import {
  RuneBadge,
  gradeColors,
  runeGlowColors,
} from '@/features/codex/components/atoms/RuneBadge';

interface RuneCardProps {
  rune: Rune;
}

export function RuneCard({ rune }: RuneCardProps) {
  const gradeColor =
    gradeColors[rune.grade] ||
    'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400';
  const glowColor = runeGlowColors[rune.grade] || 'shadow-gray-400/50';

  return (
    <div
      className={`relative h-full rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] group border-2 dark:border-opacity-50 ${gradeColor}`}
    >
      <div className="aspect-square bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
        {rune.imageUrl ? (
          <div
            className={`relative w-5/6 h-5/6 shadow-lg ${glowColor} rounded-full flex items-center justify-center`}
          >
            <Image
              src={rune.imageUrl}
              alt={rune.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-5/6 h-5/6 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
            <span className="text-gray-500 dark:text-gray-400">
              이미지 없음
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg truncate">{rune.name}</h3>
          <RuneBadge variant="grade" gradeType={rune.grade}>
            {rune.grade}
          </RuneBadge>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <RuneBadge variant="category">{rune.category}</RuneBadge>
          {rune.classes.slice(0, 3).map((cls, idx) => (
            <RuneBadge key={idx} variant="class">
              {cls}
            </RuneBadge>
          ))}
          {rune.classes.length > 3 && (
            <RuneBadge variant="class">+{rune.classes.length - 3}</RuneBadge>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10 overflow-hidden">
          {rune.description || rune.effect || '정보가 없습니다.'}
        </p>

        {Array.isArray(rune.stats) && rune.stats.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-rose-600 dark:text-rose-400">
              주요 능력치: +{rune.stats[0]?.value || ''}
              {rune.stats.length > 1 && ` 외 ${rune.stats.length - 1}개`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
