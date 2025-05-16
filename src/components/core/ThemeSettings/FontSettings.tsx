'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 폰트 설정 타입 정의
interface FontSettings {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
}

// 폰트 상태 저장소 인터페이스
interface FontSettingsState extends FontSettings {
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setHeadingWeight: (weight: string) => void;
  setBodyWeight: (weight: string) => void;
  resetFonts: () => void;
}

// 기본 폰트 설정
const defaultFontSettings: FontSettings = {
  headingFont: 'NanumSquareNeoBold',
  bodyFont: 'NanumSquareNeo',
  headingWeight: 'bold',
  bodyWeight: 'normal',
};

// 사용 가능한 폰트 목록
const availableFonts = [
  { name: '나눔스퀘어 네오', value: 'NanumSquareNeo' },
  { name: '나눔스퀘어 네오 라이트', value: 'NanumSquareNeoLight' },
  { name: '나눔스퀘어 네오 볼드', value: 'NanumSquareNeoBold' },
  { name: '나눔스퀘어 네오 엑스트라볼드', value: 'NanumSquareNeoExtraBold' },
  { name: '나눔스퀘어 네오 헤비', value: 'NanumSquareNeoHeavy' },
  { name: '쿠키런', value: 'CookieRun-Regular' },
  { name: '강원교육 볼드', value: 'GangwonEdu_OTFBoldA' },
  { name: '오뮤 예쁨', value: 'omyu_pretty' },
  { name: '스위트', value: 'SUITE-Regular' },
  { name: '마비노기 클래식', value: 'MabinogiClassicR' },
  { name: '프리텐다드', value: 'Pretendard-Regular' },
  { name: '박다현체', value: 'Ownglyph_ParkDaHyun' },
];

// 폰트 굵기 옵션
const fontWeights = [
  { name: '보통', value: 'normal' },
  { name: '굵게', value: 'bold' },
  { name: '가늘게', value: 'lighter' },
];

// iOS 18 스타일 폰트 사이즈 옵션
const appleFontSizes = [
  { name: 'Large Title', value: 'var(--font-size-large-title)' },
  { name: 'Title 1', value: 'var(--font-size-title-1)' },
  { name: 'Title 2', value: 'var(--font-size-title-2)' },
  { name: 'Title 3', value: 'var(--font-size-title-3)' },
  { name: 'Headline', value: 'var(--font-size-headline)' },
  { name: 'Body', value: 'var(--font-size-body)' },
  { name: 'Callout', value: 'var(--font-size-callout)' },
  { name: 'Subhead', value: 'var(--font-size-subhead)' },
  { name: 'Footnote', value: 'var(--font-size-footnote)' },
  { name: 'Caption 1', value: 'var(--font-size-caption-1)' },
  { name: 'Caption 2', value: 'var(--font-size-caption-2)' },
];

// 폰트별 지원 굵기 매핑
const fontWeightMap: Record<string, { name: string; value: string }[]> = {
  NanumSquareNeo: [
    { name: '가늘게', value: '300' },
    { name: '보통', value: '400' },
    { name: '굵게', value: '700' },
  ],
  NanumSquareNeoLight: [{ name: '가늘게', value: '300' }],
  NanumSquareNeoBold: [{ name: '굵게', value: '700' }],
  NanumSquareNeoExtraBold: [{ name: '굵게', value: '800' }],
  NanumSquareNeoHeavy: [{ name: '굵게', value: '900' }],
  'CookieRun-Regular': [{ name: '보통', value: '400' }],
  GangwonEdu_OTFBoldA: [{ name: '굵게', value: '700' }],
  omyu_pretty: [{ name: '보통', value: '400' }],
  'SUITE-Regular': [{ name: '보통', value: '400' }],
  MabinogiClassicR: [{ name: '보통', value: '400' }],
  'Pretendard-Regular': [
    { name: '보통', value: '400' },
    { name: '굵게', value: '700' },
    { name: '가늘게', value: '300' },
  ],
  Ownglyph_ParkDaHyun: [{ name: '보통', value: '400' }],
};

// Zustand 스토어 생성
export const useFontSettingsStore = create<FontSettingsState>()(
  persist(
    (set) => ({
      ...defaultFontSettings,
      setHeadingFont: (font) => set({ headingFont: font }),
      setBodyFont: (font) => set({ bodyFont: font }),
      setHeadingWeight: (weight) => set({ headingWeight: weight }),
      setBodyWeight: (weight) => set({ bodyWeight: weight }),
      resetFonts: () => set({ ...defaultFontSettings }),
    }),
    {
      name: 'font-settings-storage',
    }
  )
);

// 폰트 설정 컴포넌트
const FontSettings: React.FC = () => {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    setHeadingFont,
    setBodyFont,
    setHeadingWeight,
    setBodyWeight,
    resetFonts,
  } = useFontSettingsStore();

  // 폰트 스타일을 문서에 적용
  useEffect(() => {
    document.documentElement.style.setProperty('--heading-font', headingFont);
    document.documentElement.style.setProperty('--body-font', bodyFont);
    document.documentElement.style.setProperty(
      '--heading-weight',
      headingWeight
    );
    document.documentElement.style.setProperty('--body-weight', bodyWeight);

    // 타이틀 폰트 적용
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    elements.forEach((el) => {
      (el as HTMLElement).style.fontFamily = `var(--heading-font), sans-serif`;
      (el as HTMLElement).style.fontWeight = `var(--heading-weight)`;
    });

    // 본문 폰트 적용
    document.body.style.fontFamily = `var(--body-font), sans-serif`;
    document.body.style.fontWeight = `var(--body-weight)`;
  }, [headingFont, bodyFont, headingWeight, bodyWeight]);

  return (
    <div className="font-settings p-2 bg-white rounded-md shadow-sm">
      <h3 className="text-base font-bold mb-2">폰트 설정</h3>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          제목 폰트
        </label>
        <select
          className="w-full p-1 border border-gray-300 rounded"
          value={headingFont}
          onChange={(e) => setHeadingFont(e.target.value)}
          style={{ fontFamily: headingFont }}
        >
          {availableFonts.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          제목 굵기
        </label>
        <select
          className="w-full p-1 border border-gray-300 rounded"
          value={headingWeight}
          onChange={(e) => setHeadingWeight(e.target.value)}
        >
          {(fontWeightMap[headingFont] || [{ name: '보통', value: '400' }]).map(
            (weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.name}
              </option>
            )
          )}
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          본문 폰트
        </label>
        <select
          className="w-full p-1 border border-gray-300 rounded"
          value={bodyFont}
          onChange={(e) => setBodyFont(e.target.value)}
          style={{ fontFamily: bodyFont }}
        >
          {availableFonts.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          본문 굵기
        </label>
        <select
          className="w-full p-1 border border-gray-300 rounded"
          value={bodyWeight}
          onChange={(e) => setBodyWeight(e.target.value)}
        >
          {(fontWeightMap[bodyFont] || [{ name: '보통', value: '400' }]).map(
            (weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.name}
              </option>
            )
          )}
        </select>
      </div>

      <button
        onClick={resetFonts}
        className="w-full p-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-xs"
      >
        기본값으로 되돌리기
      </button>

      <div className="mt-3 p-2 border rounded">
        <h4 className="text-sm font-bold mb-1">미리보기</h4>
        <div
          className="text-base mb-1"
          style={{ fontFamily: headingFont, fontWeight: headingWeight }}
        >
          제목 텍스트 샘플
        </div>
        <div
          className="text-base"
          style={{ fontFamily: bodyFont, fontWeight: bodyWeight }}
        >
          본문 텍스트 샘플입니다. 폰트와 굵기를 변경하면 이곳에서 미리 확인할 수
          있습니다.
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
