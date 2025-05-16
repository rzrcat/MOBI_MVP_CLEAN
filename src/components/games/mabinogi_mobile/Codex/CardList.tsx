import React from 'react';

interface CardListProps<T> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  baseUrl?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function CardList<T>({
  items,
  renderCard,
  isLoading,
  emptyMessage,
}: CardListProps<T>) {
  if (isLoading) return <div>로딩 중...</div>;
  if (!items || items.length === 0)
    return <div>{emptyMessage || '데이터가 없습니다.'}</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>{renderCard(item)}</React.Fragment>
      ))}
    </div>
  );
}
