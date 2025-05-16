import { Suspense } from 'react';
import { RunesList } from '@/features/codex/components/organisms/RunesList';
import { fetchRunes } from '@/features/codex/api/runesApi';

export const dynamic = 'force-dynamic';

export default async function RunesPage() {
  const runes = await fetchRunes();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">룬 도감</h1>
        <p className="text-gray-600 dark:text-gray-400">
          마비노기 모바일의 모든 룬 정보를 확인하세요. 룬은 장비에 장착하여
          다양한 효과를 얻을 수 있는 아이템입니다.
        </p>
      </div>

      <Suspense fallback={<RunesList isLoading={true} />}>
        <RunesList initialRunes={runes} />
      </Suspense>
    </div>
  );
}
