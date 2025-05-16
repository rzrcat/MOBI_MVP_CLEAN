'use client';

import React, { useState } from 'react';
import { useComponentThemeStore } from '@/store/useComponentThemeStore';
import { ColorPicker } from '@/components/ui/ColorPicker';

interface ComponentThemeEditorProps {
  componentId: string;
  onClose: () => void;
}

export const ComponentThemeEditor: React.FC<ComponentThemeEditorProps> = ({
  componentId,
  onClose,
}) => {
  const { getComponentTheme, setComponentTheme } = useComponentThemeStore();

  // 현재 컴포넌트의 테마 설정 가져오기
  const theme = getComponentTheme(componentId) || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#e5e7eb',
    borderWidth: '1px',
    borderRadius: '0.375rem',
    padding: '1rem',
    margin: '0',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
  };

  const [formValues, setFormValues] = useState(theme);

  // 테마 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 색상 선택기에서 색상 변경 처리
  const handleColorChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComponentTheme(componentId, formValues);
    onClose();
  };

  // 모달 외부 클릭 처리
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">컴포넌트 테마 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 배경 색상 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                배경 색상
              </label>
              <ColorPicker
                value={formValues.backgroundColor || ''}
                onChange={(color) =>
                  handleColorChange('backgroundColor', color)
                }
              />
            </div>

            {/* 텍스트 색상 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                텍스트 색상
              </label>
              <ColorPicker
                value={formValues.textColor || ''}
                onChange={(color) => handleColorChange('textColor', color)}
              />
            </div>

            {/* 테두리 색상 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                테두리 색상
              </label>
              <ColorPicker
                value={formValues.borderColor || ''}
                onChange={(color) => handleColorChange('borderColor', color)}
              />
            </div>

            {/* 테두리 두께 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                테두리 두께
              </label>
              <input
                type="text"
                name="borderWidth"
                value={formValues.borderWidth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="예: 1px, 0.25rem"
              />
            </div>

            {/* 모서리 반경 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                모서리 반경
              </label>
              <input
                type="text"
                name="borderRadius"
                value={formValues.borderRadius}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="예: 0.375rem, 6px"
              />
            </div>

            {/* 패딩 */}
            <div>
              <label className="block text-sm font-medium mb-1">패딩</label>
              <input
                type="text"
                name="padding"
                value={formValues.padding}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="예: 1rem, 16px"
              />
            </div>

            {/* 마진 */}
            <div>
              <label className="block text-sm font-medium mb-1">마진</label>
              <input
                type="text"
                name="margin"
                value={formValues.margin}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="예: 1rem, 16px"
              />
            </div>

            {/* 폰트 패밀리 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                폰트 패밀리
              </label>
              <select
                name="fontFamily"
                value={formValues.fontFamily}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="inherit">상속 (기본값)</option>
                <option value="'Nanum Square Neo', sans-serif">
                  나눔스퀘어 네오
                </option>
                <option value="'CookieRun', sans-serif">쿠키런</option>
                <option value="'Pretendard', sans-serif">프리텐다드</option>
                <option value="'SUIT', sans-serif">SUIT</option>
                <option value="system-ui, sans-serif">시스템 기본</option>
              </select>
            </div>

            {/* 폰트 사이즈 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                폰트 사이즈
              </label>
              <input
                type="text"
                name="fontSize"
                value={formValues.fontSize}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="예: 1rem, 16px, inherit"
              />
            </div>

            {/* 폰트 두께 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                폰트 두께
              </label>
              <select
                name="fontWeight"
                value={formValues.fontWeight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="inherit">상속 (기본값)</option>
                <option value="normal">보통</option>
                <option value="bold">굵게</option>
                <option value="300">얇게 (300)</option>
                <option value="400">일반 (400)</option>
                <option value="500">중간 (500)</option>
                <option value="600">약간 굵게 (600)</option>
                <option value="700">굵게 (700)</option>
                <option value="800">매우 굵게 (800)</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              적용
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
