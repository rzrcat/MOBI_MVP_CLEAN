'use client';
import { useThemeStore, getCurrentTheme } from '@/store/useThemeStore';
import { useEffect } from 'react';
import { hexToRgb } from '@/utils/common/colorUtils';

export function ThemeClientEffect() {
  const {
    preset,
    custom,
    isDark,
    currentFont,
    customFonts,
    isGlassEffect,
    glassEffectIntensity,
    fontSettings,
  } = useThemeStore();
  const theme = getCurrentTheme({
    preset,
    custom,
    isDark,
    currentFont,
    customFonts,
    isGlassEffect,
    glassEffectIntensity,
    fontSettings,
    setCurrentFont: () => {},
    addCustomFont: () => {},
    removeCustomFont: () => {},
    setPreset: () => {},
    setCustom: () => {},
    setIsDark: () => {},
    setGlassEffect: () => {},
    setGlassEffectIntensity: () => {},
    setBodyFont: () => {},
    setTitleFont: () => {},
    setBodyFontWeight: () => {},
    setTitleFontWeight: () => {},
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        document.body.classList.remove('opacity-0');
        document.body.classList.add('opacity-100');
      }, 10); // Safari 렌더링 타이밍 대응
    }
    // iOS 18 스타일을 위한 루트 클래스 추가
    document.documentElement.classList.add('ios-theme');

    // 테마 색상 CSS 변수 설정
    document.documentElement.style.setProperty(
      '--theme-color',
      theme.themeColor
    );
    document.documentElement.style.setProperty(
      '--background-color',
      theme.backgroundColor
    );
    document.documentElement.style.setProperty(
      '--menu-font-color',
      theme.menuFontColor
    );

    // 메뉴 배경색 분리
    let menuBgColor = theme.menuBgColor;
    let menuBgOpacity = 100; // 기본 100% 불투명

    // 색상:투명도 형식 파싱
    if (menuBgColor && menuBgColor.includes(':')) {
      const [color, opacity] = menuBgColor.split(':');
      menuBgColor = color;
      menuBgOpacity = parseInt(opacity) || 100;
    }

    // RGB 변환 및 CSS 변수 설정
    const [r, g, b] = hexToRgb(menuBgColor);
    document.documentElement.style.setProperty('--menu-bg-color', menuBgColor);
    document.documentElement.style.setProperty(
      '--menu-bg-color-rgb',
      `${r}, ${g}, ${b}`
    );
    document.documentElement.style.setProperty(
      '--menu-bg-opacity',
      `${menuBgOpacity / 100}`
    );
    document.documentElement.style.setProperty(
      '--menu-border-color',
      theme.menuBorderColor
    );

    // 유리효과 설정
    document.documentElement.style.setProperty(
      '--glass-effect-enabled',
      isGlassEffect ? '1' : '0'
    );
    document.documentElement.style.setProperty(
      '--glass-effect-blur',
      `${glassEffectIntensity}px`
    );

    // 유리효과 CSS 클래스 설정
    if (isGlassEffect) {
      document.documentElement.classList.add('glass-effect');
      document.documentElement.classList.add('glass-effect-enabled');
    } else {
      document.documentElement.classList.remove('glass-effect');
      document.documentElement.classList.remove('glass-effect-enabled');
    }

    // 폰트 설정 적용
    document.documentElement.style.setProperty('--font-family', currentFont);
    document.documentElement.style.setProperty(
      '--title-font-family',
      fontSettings.titleFont
    );
    document.documentElement.style.setProperty(
      '--body-font-family',
      fontSettings.bodyFont
    );

    // 폰트 굵기 설정
    document.documentElement.style.setProperty(
      '--font-weight-regular',
      getFontWeightValue(fontSettings.bodyFontWeight).toString()
    );
    document.documentElement.style.setProperty(
      '--font-weight-bold',
      getFontWeightValue(fontSettings.titleFontWeight).toString()
    );
    document.documentElement.style.setProperty('--font-weight-medium', '500');
    document.documentElement.style.setProperty('--font-weight-semibold', '600');

    // 커스텀 폰트 동적 로드
    const loadCustomFonts = () => {
      // 기존 스타일 태그 제거
      const existingStyles = document.querySelectorAll(
        'style[data-custom-font]'
      );
      existingStyles.forEach((style) => style.remove());

      // 커스텀 폰트 스타일 추가
      customFonts.forEach((font) => {
        const style = document.createElement('style');
        style.setAttribute('data-custom-font', font.family);
        style.textContent = `
          @font-face {
            font-family: '${font.family}';
            src: url('${font.url}') format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `;
        document.head.appendChild(style);
      });
    };

    loadCustomFonts();
  }, [
    theme,
    isDark,
    currentFont,
    customFonts,
    isGlassEffect,
    glassEffectIntensity,
    fontSettings,
  ]);

  return null;
}

// 폰트 웨이트 값 변환 함수
function getFontWeightValue(weight: string): number {
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
