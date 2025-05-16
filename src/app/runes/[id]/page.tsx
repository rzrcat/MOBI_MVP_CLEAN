import { Suspense } from 'react';
import { fetchRuneById } from '@/features/codex/api/runesApi';
import { RuneDetail } from '@/features/codex/components/organisms/RuneDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface RunePageParams {
  params: {
    id: string;
  };
}

export default async function RunePage({ params }: RunePageParams) {
  const rune = await fetchRuneById(params.id);

  if (!rune) {
    notFound();
  }

  return (
    <div className="py-8">
      <Suspense fallback={<div>로딩 중...</div>}>
        <RuneDetail rune={rune} />
      </Suspense>
    </div>
  );
}
