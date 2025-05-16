import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 컴포넌트 테마 설정 타입 정의
export interface ComponentTheme {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  custom?: Record<string, string>;
}

// 컴포넌트 테마 설정 저장소 인터페이스
interface ComponentThemeState {
  // componentId를 키로 사용한 테마 설정 맵
  themes: Record<string, ComponentTheme>;

  // 컴포넌트 테마 설정 업데이트
  setComponentTheme: (
    componentId: string,
    theme: Partial<ComponentTheme>
  ) => void;

  // 컴포넌트 테마 설정 제거
  removeComponentTheme: (componentId: string) => void;

  // 컴포넌트 테마 설정 초기화 (기본값으로)
  resetComponentTheme: (componentId: string) => void;

  // 모든 컴포넌트 테마 설정 초기화
  resetAllThemes: () => void;

  // 컴포넌트 테마 설정 가져오기
  getComponentTheme: (componentId: string) => ComponentTheme | undefined;

  // 속성별 테마 설정 업데이트
  setComponentProperty: (
    componentId: string,
    property: keyof ComponentTheme,
    value: string
  ) => void;

  // 커스텀 속성 설정
  setCustomProperty: (
    componentId: string,
    property: string,
    value: string
  ) => void;
}

// 기본 컴포넌트 테마 설정
const defaultComponentTheme: ComponentTheme = {
  backgroundColor: 'transparent',
  textColor: 'inherit',
  borderColor: 'transparent',
  borderWidth: '0',
  borderRadius: '0',
  padding: '0',
  margin: '0',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  custom: {},
};

// Zustand 스토어 생성
export const useComponentThemeStore = create<ComponentThemeState>()(
  persist(
    (set, get) => ({
      // 컴포넌트 테마 설정 맵
      themes: {},

      // 컴포넌트 테마 설정 업데이트
      setComponentTheme: (componentId, theme) =>
        set((state) => ({
          themes: {
            ...state.themes,
            [componentId]: {
              ...(state.themes[componentId] || defaultComponentTheme),
              ...theme,
            },
          },
        })),

      // 컴포넌트 테마 설정 제거
      removeComponentTheme: (componentId) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [componentId]: removed, ...rest } = state.themes;
          return { themes: rest };
        }),

      // 컴포넌트 테마 설정 초기화
      resetComponentTheme: (componentId) =>
        set((state) => ({
          themes: {
            ...state.themes,
            [componentId]: { ...defaultComponentTheme },
          },
        })),

      // 모든 컴포넌트 테마 설정 초기화
      resetAllThemes: () => set({ themes: {} }),

      // 컴포넌트 테마 설정 가져오기
      getComponentTheme: (componentId) => {
        const { themes } = get();
        return themes[componentId];
      },

      // 속성별 테마 설정 업데이트
      setComponentProperty: (componentId, property, value) =>
        set((state) => ({
          themes: {
            ...state.themes,
            [componentId]: {
              ...(state.themes[componentId] || defaultComponentTheme),
              [property]: value,
            },
          },
        })),

      // 커스텀 속성 설정
      setCustomProperty: (componentId, property, value) =>
        set((state) => {
          const currentTheme =
            state.themes[componentId] || defaultComponentTheme;
          const currentCustom = currentTheme.custom || {};

          return {
            themes: {
              ...state.themes,
              [componentId]: {
                ...currentTheme,
                custom: {
                  ...currentCustom,
                  [property]: value,
                },
              },
            },
          };
        }),
    }),
    {
      name: 'component-theme-storage',
    }
  )
);
