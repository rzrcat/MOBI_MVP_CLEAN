'use client';

import React, { ReactNode, CSSProperties } from 'react';
import { useComponentThemeStore } from '@/store/useComponentThemeStore';

interface ThemeableComponentProps {
  componentId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ThemeableComponent: React.FC<ThemeableComponentProps> = ({
  componentId,
  children,
  className = '',
  style = {},
}) => {
  // 컴포넌트의 테마 정보 가져오기
  const { getComponentTheme } = useComponentThemeStore();
  const theme = getComponentTheme(componentId);

  // 테마 설정이 없으면 기본 스타일로 렌더링
  if (!theme) {
    return (
      <div id={componentId} className={className} style={style}>
        {children}
      </div>
    );
  }

  // 테마 설정을 스타일 객체로 변환
  const themeStyles: CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    borderColor: theme.borderColor,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    padding: theme.padding,
    margin: theme.margin,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    ...style, // 사용자 지정 스타일 적용 (테마 오버라이드)
  };

  // 커스텀 속성이 있으면 CSS 변수로 적용
  const customStyles: Record<string, string> = {};
  if (theme.custom) {
    Object.entries(theme.custom).forEach(([key, value]) => {
      customStyles[`--${key}`] = value;
    });
  }

  return (
    <div
      id={componentId}
      className={`themeable-component ${className}`}
      style={{ ...themeStyles, ...customStyles }}
      data-component-id={componentId}
    >
      {children}
    </div>
  );
};

// 컴포넌트 테마 편집 버튼 컴포넌트
interface ThemeEditButtonProps {
  componentId: string;
  onEdit: (componentId: string) => void;
}

export const ThemeEditButton: React.FC<ThemeEditButtonProps> = ({
  componentId,
  onEdit,
}) => {
  return (
    <button
      className="theme-edit-button absolute top-0 right-0 bg-blue-500 text-white p-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={() => onEdit(componentId)}
    >
      편집
    </button>
  );
};

// 사용 예시: 컴포넌트를 테마 적용 가능하게 만들기
export const withTheming = <P extends object>(
  Component: React.ComponentType<P>,
  componentId: string
) => {
  const ThemedComponent = (props: P) => (
    <ThemeableComponent componentId={componentId}>
      <Component {...props} />
    </ThemeableComponent>
  );
  ThemedComponent.displayName = `Themed(${Component.displayName || Component.name || 'Component'})`;
  return ThemedComponent;
};
