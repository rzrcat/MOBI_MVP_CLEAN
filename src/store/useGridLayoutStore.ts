import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layouts } from 'react-grid-layout';

// 위젯 커스텀 데이터 타입 정의
export interface WidgetCustomData {
  [key: string]: string | number | boolean | object | undefined;
}

// 그리드 아이템의 타입 정의
export interface GridItem {
  id: string;
  i: string; // react-grid-layout 호환을 위한 필수 속성
  x: number; // 그리드에서의 X 좌표
  y: number; // 그리드에서의 Y 좌표
  w: number; // 너비 (그리드 단위)
  h: number; // 높이 (그리드 단위)
  type: string; // 위젯 타입 (예: 'character', 'serverStatus', 'calendar' 등)
  visible: boolean; // 표시 여부
  customData?: WidgetCustomData; // 위젯별 추가 데이터
  title?: string; // 위젯 타이틀(선택)
}

// 그리드 레이아웃 설정
export interface GridConfig {
  cols: number; // 그리드 열 수
  rowHeight: number; // 행 높이 (px)
  gap: number; // 그리드 아이템 간격 (px)
  isEditing: boolean; // 편집 모드 여부
}

// 그리드 레이아웃 상태 인터페이스
export interface GridLayoutState {
  layouts: Record<string, GridItem[]>; // 페이지별 레이아웃 ('home', 'dashboard' 등)
  config: GridConfig;
  isEditMode: boolean; // 편집 모드 여부
  currentPageId: string; // 현재 페이지 ID

  // 아이템 추가
  addItem: (pageId: string, item: Omit<GridItem, 'id'>) => string;

  // 아이템 제거
  removeItem: (pageId: string, itemId: string) => void;

  // 아이템 위치/크기 변경
  updateItemPosition: (
    pageId: string,
    itemId: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => void;

  // 아이템 표시 여부 설정
  setItemVisibility: (pageId: string, itemId: string, visible: boolean) => void;

  // 아이템 커스텀 데이터 업데이트
  updateItemData: (
    pageId: string,
    itemId: string,
    data: Partial<WidgetCustomData>
  ) => void;

  // 그리드 설정 변경
  updateGridConfig: (config: Partial<GridConfig>) => void;

  // 편집 모드 토글
  toggleEditMode: () => void;

  // 레이아웃 초기화
  resetLayout: (pageId: string) => void;

  // 페이지 레이아웃 가져오기
  getPageLayout: (pageId: string) => GridItem[];

  // 레이아웃 설정하기 (react-grid-layout 호환)
  setLayouts: (layouts: Layouts) => void;

  // 현재 표시 중인 아이템 가져오기
  getVisibleItems: () => GridItem[];

  // 현재 활성화된 페이지 ID 가져오기
  getCurrentPageId: () => string;

  // 현재 활성화된 페이지 설정
  setCurrentPageId: (pageId: string) => void;
}

// 기본 위젯 설정
const defaultWidgets: GridItem[] = [
  {
    id: 'character-widget',
    i: 'character-widget',
    x: 0,
    y: 0,
    w: 6,
    h: 4,
    type: 'character',
    visible: true,
  },
  {
    id: 'server-status',
    i: 'server-status',
    x: 6,
    y: 0,
    w: 6,
    h: 2,
    type: 'serverStatus',
    visible: true,
  },
  {
    id: 'events',
    i: 'events',
    x: 6,
    y: 2,
    w: 6,
    h: 3,
    type: 'events',
    visible: true,
  },
];

// UUID 생성 함수
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Zustand 스토어 생성
export const useGridLayoutStore = create<GridLayoutState>()(
  persist(
    (set, get) => ({
      // 초기 레이아웃: 홈 페이지에 기본 위젯 설정
      layouts: {
        home: [...defaultWidgets],
      },

      // 현재 페이지 ID
      currentPageId: 'home',

      // 기본 그리드 설정
      config: {
        cols: 12, // 12열 그리드
        rowHeight: 80, // 80px 행 높이
        gap: 10, // 10px 간격
        isEditing: false, // 기본적으로 편집 모드 꺼짐
      },

      // 편집 모드 상태
      isEditMode: false,

      // 아이템 추가
      addItem: (pageId, itemData) => {
        const id = generateId();
        const newItem: GridItem = {
          ...itemData,
          id,
          i: id,
        };

        set((state) => {
          const pageLayout = state.layouts[pageId] || [];
          return {
            layouts: {
              ...state.layouts,
              [pageId]: [...pageLayout, newItem],
            },
          };
        });

        return id;
      },

      // 아이템 제거
      removeItem: (pageId, itemId) => {
        set((state) => {
          const pageLayout = state.layouts[pageId] || [];
          return {
            layouts: {
              ...state.layouts,
              [pageId]: pageLayout
                .filter((item) => item.id !== itemId)
                .map((item) => ({ ...item, i: item.id })),
            },
          };
        });
      },

      // 아이템 위치/크기 변경
      updateItemPosition: (pageId, itemId, x, y, w, h) => {
        set((state) => {
          const pageLayout = state.layouts[pageId] || [];
          return {
            layouts: {
              ...state.layouts,
              [pageId]: pageLayout.map((item) =>
                item.id === itemId ? { ...item, x, y, w, h, i: item.id } : item
              ),
            },
          };
        });
      },

      // 아이템 표시 여부 설정
      setItemVisibility: (pageId, itemId, visible) => {
        set((state) => {
          const pageLayout = state.layouts[pageId] || [];
          return {
            layouts: {
              ...state.layouts,
              [pageId]: pageLayout.map((item) =>
                item.id === itemId ? { ...item, visible, i: item.id } : item
              ),
            },
          };
        });
      },

      // 아이템 커스텀 데이터 업데이트
      updateItemData: (pageId, itemId, data) => {
        set((state) => {
          const pageLayout = state.layouts[pageId] || [];
          return {
            layouts: {
              ...state.layouts,
              [pageId]: pageLayout.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      customData: { ...item.customData, ...data },
                      i: item.id,
                    }
                  : item
              ),
            },
          };
        });
      },

      // 그리드 설정 변경
      updateGridConfig: (config) => {
        set((state) => ({
          config: { ...state.config, ...config },
        }));
      },

      // 레이아웃 초기화
      resetLayout: (pageId) => {
        if (pageId === 'home') {
          set((state) => ({
            layouts: {
              ...state.layouts,
              [pageId]: [...defaultWidgets].map((item) => ({
                ...item,
                i: item.id,
              })),
            },
          }));
        } else {
          set((state) => ({
            layouts: {
              ...state.layouts,
              [pageId]: [],
            },
          }));
        }
      },

      // 페이지 레이아웃 가져오기
      getPageLayout: (pageId) => {
        return get().layouts[pageId] || [];
      },

      // React Grid Layout 형식 레이아웃 설정
      setLayouts: (layouts: Layouts) => {
        // 현재 구현에서는 지원하지 않음, 필요에 따라 확장
        console.log('setLayouts called with:', layouts);
      },

      // 현재 표시 중인 아이템 가져오기
      getVisibleItems: () => {
        const currentPageId = get().currentPageId;
        return (
          get().layouts[currentPageId]?.filter((item) => item.visible) || []
        );
      },

      // 현재 활성화된 페이지 ID 가져오기
      getCurrentPageId: () => {
        return get().currentPageId;
      },

      // 현재 활성화된 페이지 설정
      setCurrentPageId: (pageId) => {
        set({ currentPageId: pageId });
      },

      // 편집 모드 토글
      toggleEditMode: () => {
        set((state) => ({ isEditMode: !state.isEditMode }));
      },
    }),
    {
      name: 'grid-layout-storage', // 로컬 스토리지 키
    }
  )
);
