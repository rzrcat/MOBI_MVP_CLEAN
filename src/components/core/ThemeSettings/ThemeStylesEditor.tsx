'use client';

import React, { useState, useEffect } from 'react';
import { useThemePresetsStore } from '@/store/useThemePresetsStore';
import { ColorPicker } from '@/components/ui/ColorPicker';

export const ThemeStylesEditor: React.FC = () => {
  const { getCurrentStyles, setCurrentStyles } = useThemePresetsStore();
  const currentStyles = getCurrentStyles();

  const [formValues, setFormValues] = useState(currentStyles);

  // 현재 스타일이 변경되면 폼 값 업데이트
  useEffect(() => {
    setFormValues(getCurrentStyles());
  }, [getCurrentStyles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 색상 선택기에서 색상 변경 처리
  const handleColorChange = (name: string, value: string) => {
    try {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    } catch (error) {
      console.error(`Color change error for ${name}:`, error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStyles(formValues);
  };

  const handleResetField = (fieldName: string) => {
    const originalValue =
      getCurrentStyles()[fieldName as keyof typeof currentStyles];
    setFormValues((prev) => ({ ...prev, [fieldName]: originalValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 색상 설정 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">색상 설정</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                배경 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.backgroundColor || '#ffffff'}
                  onChange={(color) =>
                    handleColorChange('backgroundColor', color)
                  }
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('backgroundColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                텍스트 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.textColor || '#000000'}
                  onChange={(color) => handleColorChange('textColor', color)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('textColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                주요 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.primaryColor || '#3b82f6'}
                  onChange={(color) => handleColorChange('primaryColor', color)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('primaryColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                보조 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.secondaryColor || '#64748b'}
                  onChange={(color) =>
                    handleColorChange('secondaryColor', color)
                  }
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('secondaryColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                강조 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.accentColor || '#f59e0b'}
                  onChange={(color) => handleColorChange('accentColor', color)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('accentColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 카드 및 버튼 설정 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">컴포넌트 설정</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                카드 배경 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.cardBgColor || '#ffffff'}
                  onChange={(color) => handleColorChange('cardBgColor', color)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('cardBgColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                카드 테두리 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.borderColor || '#e5e7eb'}
                  onChange={(color) => handleColorChange('borderColor', color)}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('borderColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                버튼 배경 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.buttonBgColor || '#3b82f6'}
                  onChange={(color) =>
                    handleColorChange('buttonBgColor', color)
                  }
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('buttonBgColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                버튼 텍스트 색상
              </label>
              <div className="flex">
                <ColorPicker
                  value={formValues.buttonTextColor || '#ffffff'}
                  onChange={(color) =>
                    handleColorChange('buttonTextColor', color)
                  }
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('buttonTextColor')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                모서리 반경
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="borderRadius"
                  value={formValues.borderRadius || ''}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded"
                  placeholder="예: 0.5rem, 8px"
                />
                <button
                  type="button"
                  onClick={() => handleResetField('borderRadius')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 폰트 설정 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">폰트 설정</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              폰트 패밀리
            </label>
            <div className="flex">
              <select
                name="fontFamily"
                value={formValues.fontFamily || ''}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
              >
                <option value="'Nanum Square Neo', sans-serif">
                  나눔스퀘어 네오
                </option>
                <option value="'CookieRun', sans-serif">쿠키런</option>
                <option value="'Pretendard', sans-serif">프리텐다드</option>
                <option value="'SUIT', sans-serif">SUIT</option>
                <option value="system-ui, sans-serif">시스템 기본</option>
              </select>
              <button
                type="button"
                onClick={() => handleResetField('fontFamily')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                초기화
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              기본 폰트 크기
            </label>
            <div className="flex">
              <input
                type="text"
                name="fontSize"
                value={formValues.fontSize || ''}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
                placeholder="예: 1rem, 16px"
              />
              <button
                type="button"
                onClick={() => handleResetField('fontSize')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          스타일 적용
        </button>
      </div>
    </form>
  );
};
