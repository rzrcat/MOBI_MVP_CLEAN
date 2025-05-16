import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePresetKey =
  | 'blue'
  | 'green'
  | 'gray'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'custom';

export interface ThemePreset {
  name: string;
  themeColor: string;
  backgroundColor: string;
  menuFontColor: string;
  menuBgColor: string;
  menuBorderColor: string;
  darkThemeColor?: string;
  darkBackgroundColor?: string;
  darkMenuFontColor?: string;
  darkMenuBgColor?: string;
  darkMenuBorderColor?: string;
}

const PRESETS: Record<Exclude<ThemePresetKey, 'custom'>, ThemePreset> = {
  blue: {
    name: 'Apple Blue',
    themeColor: '#007AFF',
    backgroundColor: '#F6F8FA',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#0A84FF',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
  green: {
    name: 'Apple Green',
    themeColor: '#34C759',
    backgroundColor: '#F6FAF6',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#30D158',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
  gray: {
    name: 'Apple Gray',
    themeColor: '#8E8E93',
    backgroundColor: '#F7F7F7',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#8E8E93',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
  purple: {
    name: 'Apple Purple',
    themeColor: '#AF52DE',
    backgroundColor: '#F8F6FA',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#BF5AF2',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
  pink: {
    name: 'Apple Pink',
    themeColor: '#FF2D55',
    backgroundColor: '#FAF6F8',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#FF375F',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
  orange: {
    name: 'Apple Orange',
    themeColor: '#FF9500',
    backgroundColor: '#FFF8F2',
    menuFontColor: '#222',
    menuBgColor: '#fff',
    menuBorderColor: '#E5E7EB',
    darkThemeColor: '#FF9F0A',
    darkBackgroundColor: '#181A1B',
    darkMenuFontColor: '#fff',
    darkMenuBgColor: '#222',
    darkMenuBorderColor: '#333',
  },
};

// 사용자 지정 테마의 기본값 추가
const defaultCustom: ThemePreset = {
  name: '사용자 지정',
  themeColor: '#007AFF',
  backgroundColor: '#F2F2F7',
  menuFontColor: '#222',
  menuBgColor: '#fff',
  menuBorderColor: '#E5E7EB',
  darkThemeColor: '#0A84FF',
  darkBackgroundColor: '#181A1B',
  darkMenuFontColor: '#fff',
  darkMenuBgColor: '#222',
  darkMenuBorderColor: '#333',
};

// PRESETS와 defaultCustom을 포함하는 전체 테마 프리셋
export const THEME_PRESETS = {
  ...PRESETS,
  custom: defaultCustom,
};

export interface ThemeConfig {
  themeColor: string;
  backgroundColor: string;
  menuFontColor: string;
  menuBgColor: string;
  menuBorderColor: string;
  name: string;
  darkThemeColor?: string;
  darkBackgroundColor?: string;
  darkMenuFontColor?: string;
  darkMenuBgColor?: string;
  darkMenuBorderColor?: string;
}

// 폰트 정보 타입 추가
export interface CustomFont {
  name: string;
  family: string;
  url: string;
}

// 폰트 굵기 설정
export type FontWeight = 'normal' | 'medium' | 'bold';

export interface FontSettings {
  bodyFont: string;
  titleFont: string;
  bodyFontWeight: FontWeight;
  titleFontWeight: FontWeight;
}

export interface ThemeState {
  preset: ThemePresetKey;
  custom: ThemeConfig;
  isDark: boolean;

  // 유리효과 관련 상태 추가
  isGlassEffect: boolean;
  glassEffectIntensity: number;

  // 폰트 관련 상태 추가
  currentFont: string;
  customFonts: CustomFont[];
  fontSettings: FontSettings;

  // 폰트 설정 메서드
  setCurrentFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setTitleFont: (font: string) => void;
  setBodyFontWeight: (weight: FontWeight) => void;
  setTitleFontWeight: (weight: FontWeight) => void;

  // 폰트 관리 메서드
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (fontFamily: string) => void;

  // 유리효과 관련 메서드
  setGlassEffect: (isEnabled: boolean) => void;
  setGlassEffectIntensity: (intensity: number) => void;

  // 테마 관련 메서드
  setPreset: (preset: ThemePresetKey) => void;
  setCustom: <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K]
  ) => void;
  setIsDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preset: 'blue' as ThemePresetKey,
      custom: {
        ...THEME_PRESETS.custom,
      },
      isDark: false,

      // 유리효과 기본값
      isGlassEffect: true,
      glassEffectIntensity: 10,

      // 폰트 관련 기본값 추가
      currentFont: 'Pretendard-Regular',
      customFonts: [],

      // 폰트 설정 기본값
      fontSettings: {
        bodyFont: 'Pretendard-Regular',
        titleFont: 'Pretendard-Regular',
        bodyFontWeight: 'normal',
        titleFontWeight: 'normal',
      },

      // 유리효과 설정 메서드
      setGlassEffect: (isEnabled) => set({ isGlassEffect: isEnabled }),
      setGlassEffectIntensity: (intensity) =>
        set({ glassEffectIntensity: Math.max(0, Math.min(20, intensity)) }),

      // 폰트 설정 메서드
      setCurrentFont: (font) => set({ currentFont: font }),
      setBodyFont: (font) =>
        set((state) => ({
          fontSettings: { ...state.fontSettings, bodyFont: font },
        })),
      setTitleFont: (font) =>
        set((state) => ({
          fontSettings: { ...state.fontSettings, titleFont: font },
        })),
      setBodyFontWeight: (weight) =>
        set((state) => ({
          fontSettings: { ...state.fontSettings, bodyFontWeight: weight },
        })),
      setTitleFontWeight: (weight) =>
        set((state) => ({
          fontSettings: { ...state.fontSettings, titleFontWeight: weight },
        })),

      // 폰트 관리 메서드
      addCustomFont: (font) =>
        set((state) => {
          // 이미 존재하는 폰트인지 확인
          const existingIndex = state.customFonts.findIndex(
            (f) => f.family === font.family
          );

          if (existingIndex >= 0) {
            // 있으면 업데이트
            const updatedFonts = [...state.customFonts];
            updatedFonts[existingIndex] = font;
            return { customFonts: updatedFonts };
          } else {
            // 없으면 추가
            return { customFonts: [...state.customFonts, font] };
          }
        }),
      removeCustomFont: (fontFamily) =>
        set((state) => {
          // 현재 사용 중인 폰트인지 체크해서 기본값으로 변경
          const updatedSettings = { ...state.fontSettings };
          if (updatedSettings.bodyFont === fontFamily) {
            updatedSettings.bodyFont = 'Pretendard-Regular';
          }
          if (updatedSettings.titleFont === fontFamily) {
            updatedSettings.titleFont = 'Pretendard-Regular';
          }

          return {
            customFonts: state.customFonts.filter(
              (f) => f.family !== fontFamily
            ),
            currentFont:
              state.currentFont === fontFamily
                ? 'Pretendard-Regular'
                : state.currentFont,
            fontSettings: updatedSettings,
          };
        }),
      setPreset: (preset) => set({ preset }),
      setCustom: (key, value) =>
        set((state) => ({ custom: { ...state.custom, [key]: value } })),
      setIsDark: (isDark) => {
        set({ isDark });
        if (typeof window !== 'undefined') {
          localStorage.setItem('mmgg-dark', isDark ? '1' : '0');
        }
      },
    }),
    {
      name: 'theme-storage',
      // 추가: localStorage에서 isDark 초기화
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const dark = localStorage.getItem('mmgg-dark');
          if (dark !== null) {
            state.isDark = dark === '1';
          }
        }
      },
    }
  )
);

export function getCurrentTheme(state: ThemeState): ThemePreset {
  const base =
    state.preset === 'custom'
      ? state.custom
      : PRESETS[state.preset] || PRESETS.blue;

  if (state.isDark) {
    return {
      ...base,
      themeColor: base.darkThemeColor || base.themeColor,
      backgroundColor: base.darkBackgroundColor || '#181A1B',
      menuFontColor: base.darkMenuFontColor || '#fff',
      menuBgColor: base.darkMenuBgColor || '#222',
      menuBorderColor: base.darkMenuBorderColor || '#333',
      name: base.name,
    };
  }
  return base;
}

// 폰트 웨이트 값 변환 함수
export function getFontWeightValue(weight: FontWeight): number {
  switch (weight) {
    case 'normal':
      return 400;
    case 'medium':
      return 500;
    case 'bold':
      return 700;
    default:
      return 400;
  }
}
