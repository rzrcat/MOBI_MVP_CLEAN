'use client';

import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  name: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({
  name,
  options,
  value,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
