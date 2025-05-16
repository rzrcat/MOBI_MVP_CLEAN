'use client';

import React, { useState, useEffect } from 'react';
import { WidthProvider, Responsive, Layout, Layouts } from 'react-grid-layout';
import { useGridLayoutStore, GridItem } from '@/store/useGridLayoutStore';
import { WidgetRenderer } from './WidgetRegistry';
import { ThemeableWidget } from './ThemeableWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 반응형 그리드 레이아웃 컴포넌트 생성
const ResponsiveGridLayout = WidthProvider(Responsive);

// 기본 레이아웃 설정
const DEFAULT_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const DEFAULT_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

type GridLayoutProps = object;

export const GridLayout: React.FC<GridLayoutProps> = () => {
  // 그리드 레이아웃 상태 관리
  const { layouts, setLayouts, toggleEditMode, isEditMode, getVisibleItems } =
    useGridLayoutStore();

  const [mounted, setMounted] = useState(false);
  const items = getVisibleItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 레이아웃 변경 핸들러
  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="grid-layout-container">
      <div className="flex justify-end p-2">
        <button
          className={`px-3 py-1 rounded text-white ${
            isEditMode ? 'bg-red-500' : 'bg-blue-500'
          }`}
          onClick={toggleEditMode}
        >
          {isEditMode ? '편집 완료' : '편집 모드'}
        </button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        breakpoints={DEFAULT_BREAKPOINTS}
        cols={DEFAULT_COLS}
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        rowHeight={80}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        draggableHandle=".drag-handle"
      >
        {items.map((item: GridItem) => (
          <div
            key={item.id}
            className={`grid-item ${isEditMode ? 'editing' : ''}`}
          >
            {isEditMode && (
              <div className="drag-handle">
                <span>{item.title || '위젯'}</span>
                <span className="handle-icon">::</span>
              </div>
            )}
            <div className="widget-content">
              <ThemeableWidget item={item} isEditing={isEditMode}>
                <WidgetRenderer item={item} isEditing={isEditMode} />
              </ThemeableWidget>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>

      <style jsx>{`
        .grid-layout-container {
          width: 100%;
          overflow: hidden;
        }

        .grid-item {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: box-shadow 0.3s;
        }

        .grid-item.editing {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: 2px dashed #ccc;
        }

        .drag-handle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f0f0f0;
          padding: 4px 8px;
          cursor: move;
          user-select: none;
          font-size: 12px;
        }

        .handle-icon {
          font-weight: bold;
        }

        .widget-content {
          height: calc(100% - 26px);
          overflow: auto;
        }
      `}</style>
    </div>
  );
};
