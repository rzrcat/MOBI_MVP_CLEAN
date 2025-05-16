'use client';

import React from 'react';
import { Rune } from '@/types/games/mabinogi_mobile/index';
import { CardList } from './CardList';
import { RuneCard } from '@/features/codex/components/molecules/RuneCard';
import { FilterSection } from '@/features/codex/components/molecules/FilterSection';
import { useRunesFilter } from '@/features/codex/hooks/useRunesFilter';

interface RunesListProps {
  initialRunes?: Rune[];
  isLoading?: boolean;
}

export function RunesList({ initialRunes, isLoading = false }: RunesListProps) {
  const { filteredRunes, filters, searchQuery, setSearchQuery } =
    useRunesFilter(initialRunes || []);

  return (
    <div className="space-y-6">
      <FilterSection
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="룬 이름 검색..."
      />

      <CardList
        items={filteredRunes}
        renderCard={(rune) => <RuneCard rune={rune} />}
        baseUrl="/runes"
        isLoading={isLoading}
        emptyMessage="검색 결과가 없습니다."
      />
    </div>
  );
}
