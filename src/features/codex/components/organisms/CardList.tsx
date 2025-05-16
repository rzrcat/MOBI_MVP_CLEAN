'use client';

import React from 'react';
import Link from 'next/link';

interface CardListProps<T> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  baseUrl: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function CardList<T extends { id: string }>({
  items,
  renderCard,
  baseUrl,
  isLoading = false,
  emptyMessage = '항목이 없습니다.',
}: CardListProps<T>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-700 animate-pulse h-48 rounded-lg shadow"
          ></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="h-full">
          <Link
            href={`${baseUrl}/${item.id}`}
            className="block h-full cursor-pointer"
          >
            {renderCard(item)}
          </Link>
        </div>
      ))}
    </div>
  );
}
