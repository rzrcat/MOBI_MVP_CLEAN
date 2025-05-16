'use client';

import React, { useState, useEffect, useRef } from 'react';
import { hexToRgb, rgbToHex, getContrastText } from '@/utils/common/colorUtils';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  className = '',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 유효한 HEX 색상 검증 및 보정
  const validateColor = (color: string): string => {
    try {
      if (!color || typeof color !== 'string') return '#000000';

      // # 기호 없으면 추가
      let hex = color.startsWith('#') ? color : `#${color}`;

      // 3자리 헥스코드를 6자리로 변환 (#RGB -> #RRGGBB)
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }

      // 유효한 6자리 헥스코드인지 확인
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return '#000000';
      }

      return hex;
    } catch (error) {
      console.error('Color validation error:', error);
      return '#000000';
    }
  };

  // value prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    // 유효한 색상으로 보정
    const validColor = validateColor(value);
    setInputValue(validColor);
  }, [value]);

  // 색상 입력 처리
  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 유효한 헥스 코드인지 검증
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  // 외부 클릭 감지 및 컬러피커 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 색상 선택 시 안전하게 처리
  const handleColorSelect = (color: string) => {
    try {
      const validColor = validateColor(color);
      setInputValue(validColor);
      onChange(validColor);
      setShowPicker(false);
    } catch (error) {
      console.error('Color selection error:', error);
    }
  };

  // HTML 기본 컬러피커 색상 변경 처리
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newColor = e.target.value;
      const validColor = validateColor(newColor);
      setInputValue(validColor);
      onChange(validColor);
    } catch (error) {
      console.error('Color picker error:', error);
    }
  };

  // 유효한 색상 값 가져오기
  const safeColorValue = validateColor(value);

  return (
    <div className={`relative inline-flex ${className}`} ref={pickerRef}>
      <div className="flex w-full">
        <div
          className="w-10 h-10 border rounded-l border-gray-300 flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: safeColorValue }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleColorInput}
          className="flex-1 p-2 border border-l-0 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showPicker && (
        <div className="absolute z-10 mt-1 top-full left-0 p-3 bg-white border border-gray-200 rounded shadow-lg">
          <input
            type="color"
            value={safeColorValue}
            onChange={handleColorPickerChange}
            className="w-full h-8 mb-2"
          />
          <div className="grid grid-cols-6 gap-2">
            {[
              '#FF5252',
              '#FF4081',
              '#E040FB',
              '#7C4DFF',
              '#536DFE',
              '#448AFF',
              '#40C4FF',
              '#18FFFF',
              '#64FFDA',
              '#69F0AE',
              '#B2FF59',
              '#EEFF41',
              '#FFFF00',
              '#FFD740',
              '#FFAB40',
              '#FF6E40',
              '#F44336',
              '#E91E63',
              '#9C27B0',
              '#673AB7',
              '#3F51B5',
              '#2196F3',
              '#03A9F4',
              '#00BCD4',
              '#009688',
              '#4CAF50',
              '#8BC34A',
              '#CDDC39',
              '#FFEB3B',
              '#FFC107',
              '#FF9800',
              '#FF5722',
              '#795548',
              '#9E9E9E',
              '#607D8B',
              '#000000',
            ].map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border ${
                  color === safeColorValue
                    ? 'ring-2 ring-blue-500'
                    : 'hover:ring-2 hover:ring-gray-400'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                type="button"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
