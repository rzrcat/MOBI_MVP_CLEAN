/**
 * 트래커 공통 스타일 상수 (Tailwind 클래스)
 * 트래커 컴포넌트에서 공통으로 사용되는 스타일 상수들을 관리합니다.
 */
export const TRACKER_STYLES = {
  // 카드 스타일
  cardBase:
    'flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg border shadow-sm cursor-pointer select-none transition-all duration-150 hover:shadow-md focus:ring-2 focus:ring-blue-200 active:bg-gray-50',
  cardTitleText: 'font-semibold text-base truncate',
  cardDescText: 'text-xs text-gray-500 truncate',
  cardDone: 'opacity-60',

  // 헤더 스타일
  sectionTitle: 'font-bold text-lg',
  categoryTitle: 'border-l-4 pl-2',

  // 버튼
  resetButton: 'ml-4 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded',
};

/**
 * 테마 색상 타입 정의
 * 기본 제공되는 색상 및 커스텀 색상을 지정할 수 있습니다.
 */
export type ThemeColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'gray'
  | 'custom';

const COLOR_MAP: Record<
  string,
  {
    cardBorder: string;
    cardTitle: string;
    cardCategory: string;
    textTitle: string;
  }
> = {
  blue: {
    cardBorder: 'border-blue-200',
    cardTitle: 'text-blue-700',
    cardCategory: 'border-l-4 pl-2 border-blue-200 text-blue-700',
    textTitle: 'text-blue-700',
  },
  green: {
    cardBorder: 'border-green-200',
    cardTitle: 'text-green-700',
    cardCategory: 'border-l-4 pl-2 border-green-200 text-green-700',
    textTitle: 'text-green-700',
  },
  purple: {
    cardBorder: 'border-purple-200',
    cardTitle: 'text-purple-700',
    cardCategory: 'border-l-4 pl-2 border-purple-200 text-purple-700',
    textTitle: 'text-purple-700',
  },
  pink: {
    cardBorder: 'border-pink-200',
    cardTitle: 'text-pink-700',
    cardCategory: 'border-l-4 pl-2 border-pink-200 text-pink-700',
    textTitle: 'text-pink-700',
  },
  orange: {
    cardBorder: 'border-orange-200',
    cardTitle: 'text-orange-700',
    cardCategory: 'border-l-4 pl-2 border-orange-200 text-orange-700',
    textTitle: 'text-orange-700',
  },
  gray: {
    cardBorder: 'border-gray-200',
    cardTitle: 'text-gray-700',
    cardCategory: 'border-l-4 pl-2 border-gray-200 text-gray-700',
    textTitle: 'text-gray-700',
  },
};

/**
 * 테마 색상에 따른 클래스 생성 헬퍼 함수
 *
 * @param themeColor - 색상 이름 또는 'custom'
 * @returns {{cardBorder: string, cardTitle: string, cardCategory: string, textTitle: string, isDefaultColor: boolean}} 테마 클래스 객체
 */
export function getThemeColorClasses(themeColor: string) {
  const isDefaultColor = Object.keys(COLOR_MAP).includes(themeColor);
  if (isDefaultColor) {
    return { ...COLOR_MAP[themeColor], isDefaultColor: true };
  }
  // 커스텀 색상 처리
  return {
    cardBorder: '',
    cardTitle: '',
    cardCategory: 'border-l-4 pl-2',
    textTitle: '',
    isDefaultColor: false,
  };
}
