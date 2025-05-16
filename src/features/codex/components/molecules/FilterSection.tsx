'use client';

import React from 'react';
import { FilterDropdown } from '@/features/codex/components/atoms/FilterDropdown';
import { SearchInput } from '@/features/codex/components/atoms/SearchInput';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  name: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterSectionProps {
  filters: FilterProps[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function FilterSection({
  filters,
  searchQuery,
  onSearchChange,
  searchPlaceholder = '검색...',
}: FilterSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        {filters.map((filter, index) => (
          <FilterDropdown
            key={index}
            name={filter.name}
            options={filter.options}
            value={filter.value}
            onChange={filter.onChange}
          />
        ))}
      </div>
    </div>
  );
}
