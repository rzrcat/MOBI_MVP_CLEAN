import React from 'react';

interface Outfit {
  id: string;
  name: string;
  imageUrl?: string;
  rarity?: string;
  category?: string;
  slots?: string[];
  dyeable?: boolean;
  tradeable?: boolean;
}

interface OutfitCardProps {
  outfit: Outfit;
}

export function OutfitCard({ outfit }: OutfitCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      {outfit.imageUrl && (
        <img
          src={outfit.imageUrl}
          alt={outfit.name}
          className="w-32 h-32 object-cover mb-2 rounded"
        />
      )}
      <div className="font-bold text-lg mb-1">{outfit.name}</div>
      <div className="text-sm text-gray-500 mb-1">
        {outfit.category} / {outfit.rarity}
      </div>
      <div className="flex gap-2 text-xs text-gray-400">
        {outfit.dyeable && <span>염색 가능</span>}
        {outfit.tradeable && <span>거래 가능</span>}
      </div>
    </div>
  );
}
