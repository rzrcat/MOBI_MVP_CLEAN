'use client';

import React from 'react';
import { ThemeableComponent } from '@/components/core/ThemeableComponent';
import { ComponentThemeEditor } from '@/components/core/ComponentThemeEditor';

// 클라이언트 컴포넌트: 모든 이벤트 핸들러 로직을 포함
const ComponentThemeEditorContent = () => {
  const [editingComponent, setEditingComponent] = React.useState<string | null>(
    null
  );

  const handleEditTheme = (componentId: string) => {
    setEditingComponent(componentId);
  };

  const handleCloseEditor = () => {
    setEditingComponent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">컴포넌트별 테마 설정 에디터</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 테스트 컴포넌트 1 */}
        <div className="relative group border rounded p-2">
          <button
            type="button"
            onClick={() => handleEditTheme('test-component-1')}
            className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            테마 편집
          </button>
          <ThemeableComponent
            componentId="test-component-1"
            className="p-4 border rounded"
          >
            <h2 className="text-xl font-bold mb-2">테스트 컴포넌트 1</h2>
            <p>이 컴포넌트의 테마를 편집할 수 있습니다.</p>
            <button
              type="button"
              className="mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded"
            >
              버튼 예시
            </button>
          </ThemeableComponent>
        </div>

        {/* 테스트 컴포넌트 2 */}
        <div className="relative group border rounded p-2">
          <button
            type="button"
            onClick={() => handleEditTheme('test-component-2')}
            className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            테마 편집
          </button>
          <ThemeableComponent
            componentId="test-component-2"
            className="p-4 border rounded"
          >
            <h2 className="text-xl font-bold mb-2">테스트 컴포넌트 2</h2>
            <p>다른 테마로 이 컴포넌트를 스타일링해보세요.</p>
            <div className="mt-2 flex space-x-2">
              <span className="px-2 py-1 bg-gray-200 rounded">태그 1</span>
              <span className="px-2 py-1 bg-gray-200 rounded">태그 2</span>
            </div>
          </ThemeableComponent>
        </div>

        {/* 테스트 컴포넌트 3 - 헤더 스타일 */}
        <div className="relative group border rounded p-2">
          <button
            type="button"
            onClick={() => handleEditTheme('test-header')}
            className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            테마 편집
          </button>
          <ThemeableComponent
            componentId="test-header"
            className="p-4 border rounded"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">헤더 스타일 컴포넌트</h2>
              <div className="flex space-x-2">
                <button type="button" className="p-1 rounded bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button type="button" className="p-1 rounded bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </ThemeableComponent>
        </div>

        {/* 테스트 컴포넌트 4 - 카드 스타일 */}
        <div className="relative group border rounded p-2">
          <button
            type="button"
            onClick={() => handleEditTheme('test-card')}
            className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            테마 편집
          </button>
          <ThemeableComponent
            componentId="test-card"
            className="p-4 border rounded"
          >
            <div className="text-center">
              <div className="mb-4 w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <span className="text-3xl">🧙</span>
              </div>
              <h3 className="font-bold text-lg mb-2">캐릭터 카드</h3>
              <p className="text-sm text-gray-600">레벨 99 마법사</p>
              <button
                type="button"
                className="mt-3 bg-indigo-500 text-white px-4 py-2 rounded w-full"
              >
                상세 정보
              </button>
            </div>
          </ThemeableComponent>
        </div>
      </div>

      {/* 테마 편집기 모달 */}
      {editingComponent && (
        <ComponentThemeEditor
          componentId={editingComponent}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

// 서버 컴포넌트인 메인 페이지
export default function ComponentThemeEditorPage() {
  // 클라이언트 컴포넌트를 그대로 사용
  return <ComponentThemeEditorContent />;
}
