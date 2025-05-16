import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  previewImage?: string;
  styles: {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    borderColor: string;
    borderRadius: string;
    cardBgColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    headerBgColor: string;
    footerBgColor: string;
    fontFamily: string;
    fontSize: string;
  };
}

interface ThemePresetsState {
  presets: ThemePreset[];
  activePresetId: string | null;
  currentStyles: ThemePreset['styles'] | null;

  // 액티브 프리셋 설정
  setActivePreset: (presetId: string) => void;

  // 현재 스타일 직접 설정
  setCurrentStyles: (styles: Partial<ThemePreset['styles']>) => void;

  // 프리셋 추가
  addPreset: (preset: Omit<ThemePreset, 'id'>) => string;

  // 프리셋 삭제
  removePreset: (presetId: string) => void;

  // 프리셋 업데이트
  updatePreset: (
    presetId: string,
    updates: Partial<Omit<ThemePreset, 'id'>>
  ) => void;

  // 프리셋 가져오기
  getPreset: (presetId: string) => ThemePreset | undefined;

  // 모든 프리셋 가져오기
  getAllPresets: () => ThemePreset[];

  // 액티브 프리셋 가져오기
  getActivePreset: () => ThemePreset | null;

  // 현재 스타일 가져오기
  getCurrentStyles: () => ThemePreset['styles'];

  // 백업 생성하기
  backupCurrentTheme: (name: string) => string;
}

// 기본 프리셋 정의
const defaultPresets: ThemePreset[] = [
  {
    id: 'default',
    name: '기본 테마',
    description: '기본 테마 설정',
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      accentColor: '#f97316',
      borderColor: '#e5e7eb',
      borderRadius: '0.375rem',
      cardBgColor: '#ffffff',
      buttonBgColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      headerBgColor: '#f9fafb',
      footerBgColor: '#f3f4f6',
      fontFamily: 'NanumSquareNeo, sans-serif',
      fontSize: '16px',
    },
  },
  {
    id: 'mabinogi-mobile',
    name: '마비노기 모바일',
    description: '마비노기 모바일 스타일 테마',
    styles: {
      backgroundColor: '#111827', // 어두운 배경
      textColor: '#ffffff', // 흰색 텍스트
      primaryColor: '#10b981', // 녹색 강조
      secondaryColor: '#4b5563', // 회색
      accentColor: '#f59e0b', // 노란색/금색 강조
      borderColor: '#374151', // 테두리
      borderRadius: '0.5rem', // 둥근 모서리
      cardBgColor: '#1f2937', // 카드 배경
      buttonBgColor: '#059669', // 녹색 버튼
      buttonTextColor: '#ffffff', // 버튼 텍스트
      headerBgColor: '#111827', // 헤더 배경
      footerBgColor: '#1f2937', // 푸터 배경
      fontFamily: 'NanumSquareNeoBold, sans-serif', // 나눔스퀘어 네오 볼드
      fontSize: '16px',
    },
  },
  {
    id: 'mabinogi-purple',
    name: '마비노기 퍼플',
    description: '마비노기 보라색 룬 스타일',
    styles: {
      backgroundColor: '#0f172a', // 어두운 네이비
      textColor: '#ffffff', // 흰색 텍스트
      primaryColor: '#8b5cf6', // 보라색 강조
      secondaryColor: '#4b5563', // 회색
      accentColor: '#c4b5fd', // 연한 보라색 강조
      borderColor: '#334155', // 테두리
      borderRadius: '0.5rem', // 둥근 모서리
      cardBgColor: '#1e293b', // 카드 배경
      buttonBgColor: '#7c3aed', // 보라색 버튼
      buttonTextColor: '#ffffff', // 버튼 텍스트
      headerBgColor: '#0f172a', // 헤더 배경
      footerBgColor: '#1e293b', // 푸터 배경
      fontFamily: 'NanumSquareNeo, sans-serif', // 나눔스퀘어 네오
      fontSize: '16px',
    },
  },
  {
    id: 'light-theme',
    name: '라이트 테마',
    description: '밝은 색상의 테마',
    styles: {
      backgroundColor: '#f8fafc',
      textColor: '#334155',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f97316',
      borderColor: '#e2e8f0',
      borderRadius: '0.375rem',
      cardBgColor: '#ffffff',
      buttonBgColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      headerBgColor: '#ffffff',
      footerBgColor: '#f1f5f9',
      fontFamily: 'NanumSquareNeoLight, sans-serif',
      fontSize: '16px',
    },
  },
];

// Zustand 스토어 생성
export const useThemePresetsStore = create<ThemePresetsState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      presets: [...defaultPresets],
      activePresetId: 'default',
      currentStyles: null,

      // 액티브 프리셋 설정
      setActivePreset: (presetId) => {
        const preset = get().presets.find((p) => p.id === presetId);
        if (preset) {
          set({
            activePresetId: presetId,
            currentStyles: null, // 커스텀 스타일 초기화
          });
        }
      },

      // 현재 스타일 직접 설정
      setCurrentStyles: (styles) => {
        const currentStyles = get().getCurrentStyles();
        set({
          currentStyles: { ...currentStyles, ...styles },
        });
      },

      // 프리셋 추가
      addPreset: (preset) => {
        const id = Date.now().toString(36);
        const newPreset: ThemePreset = {
          ...preset,
          id,
        };
        set((state) => ({
          presets: [...state.presets, newPreset],
        }));
        return id;
      },

      // 프리셋 삭제
      removePreset: (presetId) => {
        // 기본 프리셋은 삭제 불가
        if (
          [
            'default',
            'mabinogi-mobile',
            'mabinogi-purple',
            'light-theme',
          ].includes(presetId)
        ) {
          console.warn(`Cannot remove built-in preset: ${presetId}`);
          return;
        }

        set((state) => ({
          presets: state.presets.filter((p) => p.id !== presetId),
          // 현재 활성화된 프리셋이 삭제되면 기본 프리셋으로 변경
          activePresetId:
            state.activePresetId === presetId
              ? 'default'
              : state.activePresetId,
        }));
      },

      // 프리셋 업데이트
      updatePreset: (presetId, updates) => {
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === presetId ? { ...p, ...updates } : p
          ),
        }));
      },

      // 프리셋 가져오기
      getPreset: (presetId) => {
        return get().presets.find((p) => p.id === presetId);
      },

      // 모든 프리셋 가져오기
      getAllPresets: () => {
        return get().presets;
      },

      // 액티브 프리셋 가져오기
      getActivePreset: () => {
        const { activePresetId } = get();
        if (!activePresetId) return null;
        return get().presets.find((p) => p.id === activePresetId) || null;
      },

      // 현재 스타일 가져오기
      getCurrentStyles: () => {
        const { currentStyles } = get();
        if (currentStyles) return currentStyles;

        const activePreset = get().getActivePreset();
        return activePreset?.styles || defaultPresets[0].styles;
      },

      // 백업 생성하기
      backupCurrentTheme: (name) => {
        const currentStyles = get().getCurrentStyles();
        const id = Date.now().toString(36);
        const backupPreset: ThemePreset = {
          id,
          name: name || `백업 ${new Date().toLocaleDateString()}`,
          description: '현재 테마 백업',
          styles: { ...currentStyles, fontSize: '16px' },
        };
        set((state) => ({
          presets: [...state.presets, backupPreset],
        }));
        return id;
      },
    }),
    {
      name: 'theme-presets-storage', // 로컬 스토리지 키
    }
  )
);
