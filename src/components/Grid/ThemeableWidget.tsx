'use client';

import React, { useState } from 'react';
import { ThemeableComponent } from '@/components/core/ThemeableComponent';
import { ComponentThemeEditor } from '@/components/core/ComponentThemeEditor';
import { GridItem } from '@/store/useGridLayoutStore';

interface ThemeableWidgetProps {
  item: GridItem;
  isEditing: boolean;
  children: React.ReactNode;
}

export const ThemeableWidget: React.FC<ThemeableWidgetProps> = ({
  item,
  isEditing,
  children,
}) => {
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const componentId = `widget-${item.id}`;

  // 컴포넌트 테마 편집기 열기
  const handleEditTheme = () => {
    setIsThemeEditorOpen(true);
  };

  // 컴포넌트 테마 편집기 닫기
  const handleCloseEditor = () => {
    setIsThemeEditorOpen(false);
  };

  return (
    <div className="themeable-widget-container relative group">
      {/* 편집 모드일 때만 테마 편집 버튼 표시 */}
      {isEditing && (
        <button
          onClick={handleEditTheme}
          className="theme-edit-button absolute top-1 right-1 bg-blue-500 text-white p-1 text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          테마
        </button>
      )}

      {/* 컴포넌트에 테마 적용 */}
      <ThemeableComponent componentId={componentId} className="h-full">
        {children}
      </ThemeableComponent>

      {/* 테마 편집기 모달 */}
      {isThemeEditorOpen && (
        <ComponentThemeEditor
          componentId={componentId}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};
