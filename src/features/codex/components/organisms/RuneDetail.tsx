'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rune } from '@/types/games/mabinogi_mobile/index';
import {
  RuneBadge,
  runeGlowColors,
} from '@/features/codex/components/atoms/RuneBadge';

interface RuneDetailProps {
  rune: Rune;
}

export function RuneDetail({ rune }: RuneDetailProps) {
  const glowColor = runeGlowColors[rune.grade] || 'shadow-gray-400/50';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/runes"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          모든 룬 보기
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="md:flex">
          <div className="md:w-1/3 p-8 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            {rune.imageUrl ? (
              <div
                className={`relative w-56 h-56 shadow-lg ${glowColor} rounded-full flex items-center justify-center`}
              >
                <Image
                  src={rune.imageUrl}
                  alt={rune.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
                <span className="text-gray-500 dark:text-gray-400">
                  이미지 없음
                </span>
              </div>
            )}
          </div>

          <div className="md:w-2/3 p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {rune.name}
              </h1>
              <RuneBadge variant="grade" gradeType={rune.grade}>
                {rune.grade}
              </RuneBadge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <RuneBadge variant="category">{rune.category}</RuneBadge>
              {rune.classes.map((cls, idx) => (
                <RuneBadge key={idx} variant="class">
                  {cls}
                </RuneBadge>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                설명
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {rune.description || rune.effect || '정보가 없습니다.'}
              </p>
            </div>

            {Array.isArray(rune.stats) && rune.stats.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  능력치
                </h2>
                <ul className="space-y-2">
                  {rune.stats.map((stat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {stat.name}
                      </span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">
                        +{stat.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                획득 방법
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {rune.obtainMethod.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            </div>

            {rune.recommendedCombinations &&
              rune.recommendedCombinations.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    추천 조합
                  </h2>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {rune.recommendedCombinations.map((combo, idx) => (
                      <li key={idx}>
                        {combo.name}: {combo.runes.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {rune.notes && rune.notes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  참고 사항
                </h2>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {rune.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
