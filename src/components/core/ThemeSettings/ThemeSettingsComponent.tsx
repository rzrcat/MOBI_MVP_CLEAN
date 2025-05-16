'use client';

import React, { useState } from 'react';
import { ThemePresetSelector } from './ThemePresetSelector';
import { ThemeStylesEditor } from './ThemeStylesEditor';

export const ThemeSettingsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className="theme-settings">
      {/* 탭 */}
      <div className="flex border-b mb-4">
        <button
          type="button"
          className={`px-4 py-2 ${
            activeTab === 'presets'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('presets')}
        >
          프리셋
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${
            activeTab === 'custom'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          커스텀
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="p-1">
        {activeTab === 'presets' ? (
          <ThemePresetSelector />
        ) : (
          <ThemeStylesEditor />
        )}
      </div>
    </div>
  );
};
