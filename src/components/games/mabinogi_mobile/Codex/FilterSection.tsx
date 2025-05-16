import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  name: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterSectionProps {
  filters: Filter[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function FilterSection({
  filters,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{filter.name}</label>
          <select
            className="border rounded px-2 py-1"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <input
        type="text"
        className="border rounded px-2 py-1 flex-1"
        placeholder={searchPlaceholder || '검색...'}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
