'use client';

import { useState, useMemo } from 'react';
import {
  Rune,
  RuneGrade,
  RuneCategory,
  RuneClass,
} from '@/types/games/mabinogi_mobile/index';

const grades: Array<RuneGrade | '전체'> = [
  '전체',
  '고급',
  '레어',
  '엘리트',
  '에픽',
  '전설',
];
const categories: Array<RuneCategory | '전체'> = [
  '전체',
  '무기',
  '방어구',
  '엠블럼',
  '장신구',
];
const classes: Array<RuneClass | '전체'> = [
  '전체',
  '전사',
  '대검전사',
  '검술사',
  '궁수',
  '석궁사수',
  '장궁병',
  '마법사',
  '화염술사',
  '빙결술사',
  '힐러',
  '사제',
  '수도사',
  '음유시인',
  '댄서',
  '악사',
  '도적',
  '격투가',
  '듀얼블레이드',
];

export function useRunesFilter(initialRunes: Rune[] = []) {
  const [runes, setRunes] = useState<Rune[]>(initialRunes);
  const [selectedGrade, setSelectedGrade] = useState<RuneGrade | '전체'>(
    '전체'
  );
  const [selectedCategory, setSelectedCategory] = useState<
    RuneCategory | '전체'
  >('전체');
  const [selectedClass, setSelectedClass] = useState<RuneClass | '전체'>(
    '전체'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRunes = useMemo(() => {
    return runes.filter((rune) => {
      const matchesGrade =
        selectedGrade === '전체' || rune.grade === selectedGrade;
      const matchesCategory =
        selectedCategory === '전체' || rune.category === selectedCategory;
      const matchesClass =
        selectedClass === '전체' || rune.classes.includes(selectedClass);
      const matchesSearch = rune.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesGrade && matchesCategory && matchesClass && matchesSearch;
    });
  }, [runes, selectedGrade, selectedCategory, selectedClass, searchQuery]);

  const filters = [
    {
      name: '등급',
      options: grades.map((grade) => ({ value: grade, label: grade })),
      value: selectedGrade,
      onChange: (value: string) =>
        setSelectedGrade(value as RuneGrade | '전체'),
    },
    {
      name: '카테고리',
      options: categories.map((category) => ({
        value: category,
        label: category,
      })),
      value: selectedCategory,
      onChange: (value: string) =>
        setSelectedCategory(value as RuneCategory | '전체'),
    },
    {
      name: '직업',
      options: classes.map((cls) => ({ value: cls, label: cls })),
      value: selectedClass,
      onChange: (value: string) =>
        setSelectedClass(value as RuneClass | '전체'),
    },
  ];

  return {
    runes,
    setRunes,
    filteredRunes,
    selectedGrade,
    setSelectedGrade,
    selectedCategory,
    setSelectedCategory,
    selectedClass,
    setSelectedClass,
    searchQuery,
    setSearchQuery,
    filters,
  };
}
