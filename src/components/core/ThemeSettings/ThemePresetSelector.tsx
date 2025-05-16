'use client';

import React, { useState, useEffect } from 'react';
import { useThemePresetsStore } from '@/store/useThemePresetsStore';

export const ThemePresetSelector: React.FC = () => {
  const {
    presets,
    activePresetId,
    setActivePreset,
    backupCurrentStyles,
    restoreStyles,
  } = useThemePresetsStore();

  const [backupName, setBackupName] = useState('내 테마');
  const [showBackupField, setShowBackupField] = useState(false);

  const handleBackup = () => {
    backupCurrentStyles(backupName);
    setShowBackupField(false);
    setBackupName('내 테마');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              activePresetId === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setActivePreset(preset.id)}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{preset.name}</h3>
              {activePresetId === preset.id && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  적용 중
                </span>
              )}
            </div>

            {/* 색상 미리보기 */}
            <div className="flex space-x-2 mb-3">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: preset.styles.primaryColor }}
                title="주요 색상"
              ></div>
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: preset.styles.secondaryColor }}
                title="보조 색상"
              ></div>
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: preset.styles.accentColor }}
                title="강조 색상"
              ></div>
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: preset.styles.backgroundColor }}
                title="배경 색상"
              ></div>
            </div>

            <p className="text-sm text-gray-500">{preset.description}</p>
          </div>
        ))}
      </div>

      {/* 백업 및 복원 기능 */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">테마 백업 및 복원</h3>
        <div className="space-y-3">
          {showBackupField ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="백업 이름 입력"
              />
              <button
                type="button"
                onClick={handleBackup}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={!backupName.trim()}
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setShowBackupField(false)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowBackupField(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                현재 테마 백업
              </button>
              <button
                type="button"
                onClick={restoreStyles}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                백업에서 복원
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
