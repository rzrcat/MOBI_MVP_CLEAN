'use client';

import React, { useState, useEffect } from 'react';
import {
  useThemeStore,
  THEME_PRESETS,
  ThemePresetKey,
} from '@/store/useThemeStore';
import { ColorPicker } from '@/components/ui/ColorPicker';

export const PresetSection = () => {
  const { preset, setPreset, custom, setCustom, isDark } = useThemeStore();
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 컴포넌트 마운트 시 사용자 지정 프리셋인 경우 컬러피커 표시
  useEffect(() => {
    if (preset === 'custom') {
      setShowColorPicker(true);
    }
  }, [preset]);

  // 프리셋 선택 핸들러
  const handlePreset = (key: ThemePresetKey) => {
    setPreset(key);
    // 사용자 지정 프리셋을 선택한 경우 컬러피커 표시
    if (key === 'custom') {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
  };

  // 컬러피커에서 색상이 변경될 때 호출되는 함수
  const handleColorChange = (color: string) => {
    setCustom('themeColor', color);
  };
  // 다크모드용 컬러피커
  const handleDarkColorChange = (color: string) => {
    setCustom('darkThemeColor', color);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(THEME_PRESETS).map(([key, presetObj]) => (
          <button
            key={key}
            className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${
              preset === key
                ? 'border-blue-500 ring-2 ring-blue-500/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handlePreset(key as ThemePresetKey)}
          >
            <span
              className="w-6 h-6 rounded-full border border-gray-300 mb-1"
              style={{
                backgroundColor: isDark
                  ? presetObj.darkThemeColor || presetObj.themeColor
                  : presetObj.themeColor,
              }}
            />
            <span className="text-xs font-medium">
              {key === 'blue' && '블루'}
              {key === 'green' && '그린'}
              {key === 'gray' && '그레이'}
              {key === 'purple' && '퍼플'}
              {key === 'pink' && '핑크'}
              {key === 'orange' && '오렌지'}
              {key === 'custom' && '사용자 지정'}
            </span>
          </button>
        ))}
      </div>

      {/* 사용자 지정 색상 선택 컬러피커 */}
      {preset === 'custom' && showColorPicker && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-medium mb-1">라이트 테마 색상</div>
            <ColorPicker
              value={custom.themeColor}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <div className="text-xs font-medium mb-1">다크 테마 색상</div>
            <ColorPicker
              value={custom.darkThemeColor || custom.themeColor}
              onChange={handleDarkColorChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
