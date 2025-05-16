'use client';

import { useState, useEffect } from 'react';
import {
  Outfit,
  OutfitCategory,
  OutfitRarity,
  OutfitSlot,
} from '@/types/games/mabinogi_mobile/index';
import { CardList } from '@/components/games/mabinogi_mobile/Codex/CardList';
import { FilterSection } from '@/components/games/mabinogi_mobile/Codex/FilterSection';
import { OutfitCard } from '@/components/games/mabinogi_mobile/Codex/OutfitCard';

const rarities: Array<OutfitRarity | '전체'> = [
  '전체',
  '전설',
  '영웅',
  '희귀',
  '고급',
  '일반',
];
const categories: Array<OutfitCategory | '전체'> = [
  '전체',
  '일상복',
  '전투복',
  '로브',
  '드레스',
  '정장',
  '캐주얼',
  '코스튬',
  '특수복',
];
const slots: Array<OutfitSlot | '전체'> = [
  '전체',
  '머리',
  '얼굴',
  '상의',
  '하의',
  '망토',
  '신발',
  '장갑',
  '액세서리',
];

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<OutfitRarity | '전체'>(
    '전체'
  );
  const [selectedCategory, setSelectedCategory] = useState<
    OutfitCategory | '전체'
  >('전체');
  const [selectedSlot, setSelectedSlot] = useState<OutfitSlot | '전체'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDyeableOnly, setShowDyeableOnly] = useState(false);
  const [showTradeableOnly, setShowTradeableOnly] = useState(false);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await fetch('/api/outfits');
        const data = await response.json();
        setOutfits(data);
      } catch (error) {
        console.error('Error fetching outfits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutfits();
  }, []);

  const filteredOutfits = outfits.filter((outfit) => {
    const matchesRarity =
      selectedRarity === '전체' || outfit.rarity === selectedRarity;
    const matchesCategory =
      selectedCategory === '전체' || outfit.category === selectedCategory;
    const matchesSlot =
      selectedSlot === '전체' || outfit.slots.includes(selectedSlot);
    const matchesSearch = outfit.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDyeable = !showDyeableOnly || outfit.dyeable;
    const matchesTradeable = !showTradeableOnly || outfit.tradeable;

    return (
      matchesRarity &&
      matchesCategory &&
      matchesSlot &&
      matchesSearch &&
      matchesDyeable &&
      matchesTradeable
    );
  });

  const filters = [
    {
      name: '레어도',
      options: rarities.map((rarity) => ({ value: rarity, label: rarity })),
      value: selectedRarity,
      onChange: (value: string) =>
        setSelectedRarity(value as OutfitRarity | '전체'),
    },
    {
      name: '카테고리',
      options: categories.map((category) => ({
        value: category,
        label: category,
      })),
      value: selectedCategory,
      onChange: (value: string) =>
        setSelectedCategory(value as OutfitCategory | '전체'),
    },
    {
      name: '슬롯',
      options: slots.map((slot) => ({ value: slot, label: slot })),
      value: selectedSlot,
      onChange: (value: string) =>
        setSelectedSlot(value as OutfitSlot | '전체'),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">코디 도감</h1>
        <p className="text-gray-600">
          마비노기 모바일의 모든 의상 정보를 확인하세요. 나만의 개성 있는 코디를
          완성하는데 도움이 될 거예요.
        </p>
      </div>

      <FilterSection
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="의상 이름 검색..."
      />

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDyeableOnly}
            onChange={(e) => setShowDyeableOnly(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-sm">염색 가능 의상만 보기</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showTradeableOnly}
            onChange={(e) => setShowTradeableOnly(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-sm">거래 가능 의상만 보기</span>
        </label>
      </div>

      <CardList
        items={filteredOutfits}
        renderCard={(outfit) => <OutfitCard outfit={outfit} />}
        baseUrl="/outfits"
        isLoading={isLoading}
        emptyMessage="검색 결과가 없습니다."
      />
    </div>
  );
}
