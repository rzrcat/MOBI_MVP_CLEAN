'use client';

import React, { ReactNode } from 'react';
import { GridItem } from '@/store/useGridLayoutStore';
import { ThemeableWidget } from './ThemeableWidget';

// 위젯 컴포넌트의 props 정의
export interface WidgetProps {
  item: GridItem;
  isEditing: boolean;
}

// 위젯 레지스트리 타입 - 각 위젯 타입에 대한 컴포넌트 맵핑
export type WidgetRegistry = {
  [widgetType: string]: React.FC<WidgetProps>;
};

// 전역 위젯 레지스트리
const globalWidgetRegistry: WidgetRegistry = {};

// 위젯 등록 함수
export function registerWidget(
  type: string,
  component: React.FC<WidgetProps>
): void {
  globalWidgetRegistry[type] = component;
}

// 위젯 렌더러 컴포넌트 props
interface WidgetRendererProps {
  item: GridItem;
  isEditing: boolean;
  fallback?: ReactNode;
}

// 특정 위젯 타입에 맞는 컴포넌트를 렌더링
export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  item,
  isEditing,
  fallback = <div className="p-4 text-gray-400">위젯을 찾을 수 없습니다.</div>,
}) => {
  const WidgetComponent = globalWidgetRegistry[item.type];

  if (!WidgetComponent) {
    console.warn(`Widget type "${item.type}" is not registered.`);
    return <>{fallback}</>;
  }

  // 위젯 컴포넌트를 테마 적용 가능한 래퍼로 감싸기
  return (
    <ThemeableWidget item={item} isEditing={isEditing}>
      <WidgetComponent item={item} isEditing={isEditing} />
    </ThemeableWidget>
  );
};

// 예시 위젯: 캐릭터 위젯
export const CharacterWidget: React.FC<WidgetProps> = ({ isEditing }) => {
  return (
    <div className="h-full p-4">
      <h3 className="font-bold text-lg mb-2">캐릭터 정보</h3>
      <div className="bg-gray-50 p-3 rounded">
        {/* 캐릭터 정보 렌더링 */}
        <p>캐릭터 관리 위젯입니다.</p>
        {isEditing && (
          <p className="text-sm text-blue-500 mt-2">편집 모드 활성화됨</p>
        )}
      </div>
    </div>
  );
};

// 예시 위젯: 서버 상태 위젯
export const ServerStatusWidget: React.FC<WidgetProps> = ({ isEditing }) => {
  return (
    <div className="h-full p-4">
      <h3 className="font-bold text-lg mb-2">서버 상태</h3>
      <div className="bg-gray-50 p-3 rounded">
        {/* 서버 상태 정보 렌더링 */}
        <p>서버 상태 정보 위젯입니다.</p>
        {isEditing && (
          <p className="text-sm text-blue-500 mt-2">편집 모드 활성화됨</p>
        )}
      </div>
    </div>
  );
};

// 예시 위젯: 이벤트 위젯
export const EventsWidget: React.FC<WidgetProps> = ({ isEditing }) => {
  return (
    <div className="h-full p-4">
      <h3 className="font-bold text-lg mb-2">이벤트 정보</h3>
      <div className="bg-gray-50 p-3 rounded">
        {/* 이벤트 정보 렌더링 */}
        <p>이벤트 정보 위젯입니다.</p>
        {isEditing && (
          <p className="text-sm text-blue-500 mt-2">편집 모드 활성화됨</p>
        )}
      </div>
    </div>
  );
};

// 기본 위젯 등록
registerWidget('character', CharacterWidget);
registerWidget('serverStatus', ServerStatusWidget);
registerWidget('events', EventsWidget);
