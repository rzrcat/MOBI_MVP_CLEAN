'use client';

import { useState } from 'react';
import { Character } from '@/types/character';

interface SettingsPanelProps {
  character: Character;
  onSettingsChange: (settings: Character['settings']) => void;
  onClose: () => void;
}

export function SettingsPanel({
  character,
  onSettingsChange,
  onClose,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<
    'general' | 'notifications' | 'customize'
  >('general');

  const handleSettingChange = <K extends keyof Character['settings']>(
    key: K,
    value: Character['settings'][K]
  ) => {
    onSettingsChange({
      ...character.settings,
      [key]: value,
    });
  };

  const handleNotificationChange = (
    key: keyof Character['settings']['notifications'],
    value: boolean
  ) => {
    onSettingsChange({
      ...character.settings,
      notifications: {
        ...character.settings.notifications,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">도우미 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            기본 설정
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            알림 설정
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'customize'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            꾸미기
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* 크기 설정 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  크기
                </label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('size', size)}
                      className={`px-3 py-1 rounded ${
                        character.settings.size === size
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size === 'small'
                        ? '작게'
                        : size === 'medium'
                          ? '보통'
                          : '크게'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 투명도 설정 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  투명도 ({Math.round(character.settings.opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={character.settings.opacity}
                  onChange={(e) =>
                    handleSettingChange('opacity', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* 기타 토글 설정 */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!character.settings.isHidden}
                    onChange={(e) =>
                      handleSettingChange('isHidden', !e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    캐릭터 표시
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={character.settings.useAnimation}
                    onChange={(e) =>
                      handleSettingChange('useAnimation', e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    애니메이션 효과 사용
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={character.settings.recordHistory}
                    onChange={(e) =>
                      handleSettingChange('recordHistory', e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    활동 기록 저장
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3">
              {Object.entries(character.settings.notifications).map(
                ([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleNotificationChange(
                          key as keyof Character['settings']['notifications'],
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {key === 'dailyTasks'
                        ? '일일 할 일'
                        : key === 'events'
                          ? '이벤트'
                          : key === 'notices'
                            ? '공지사항'
                            : key === 'bardBoard'
                              ? '음유시인 게시판'
                              : key === 'fashionItems'
                                ? '패션 아이템'
                                : key === 'guildNews'
                                  ? '길드 소식'
                                  : '커뮤니티 인기글'}
                    </span>
                  </label>
                )
              )}

              {/* 방해금지 시간 설정 */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    방해금지 시간
                  </span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={character.settings.quietHours.enabled}
                      onChange={(e) =>
                        onSettingsChange({
                          ...character.settings,
                          quietHours: {
                            ...character.settings.quietHours,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">사용</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={`${character.settings.quietHours.start.toString().padStart(2, '0')}:00`}
                    onChange={(e) => {
                      const hour = parseInt(e.target.value.split(':')[0]);
                      onSettingsChange({
                        ...character.settings,
                        quietHours: {
                          ...character.settings.quietHours,
                          start: hour,
                        },
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                    disabled={!character.settings.quietHours.enabled}
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="time"
                    value={`${character.settings.quietHours.end.toString().padStart(2, '0')}:00`}
                    onChange={(e) => {
                      const hour = parseInt(e.target.value.split(':')[0]);
                      onSettingsChange({
                        ...character.settings,
                        quietHours: {
                          ...character.settings.quietHours,
                          end: hour,
                        },
                      });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                    disabled={!character.settings.quietHours.enabled}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="space-y-4">
              {/* 테마 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테마
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['default', 'dark', 'cute', 'fantasy'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('theme', theme)}
                      className={`px-3 py-2 rounded ${
                        character.settings.theme === theme
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme === 'default'
                        ? '기본'
                        : theme === 'dark'
                          ? '다크'
                          : theme === 'cute'
                            ? '귀여움'
                            : '판타지'}
                    </button>
                  ))}
                </div>
              </div>

              {character.type === 'custom' && character.customization && (
                <>
                  {/* 파츠 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      파츠 선택
                    </label>
                    <div className="space-y-2">
                      {Object.entries(character.customization.parts).map(
                        ([part, value]) => (
                          <div
                            key={part}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-600">
                              {part === 'head'
                                ? '머리'
                                : part === 'ears'
                                  ? '귀'
                                  : part === 'eyes'
                                    ? '눈'
                                    : part === 'nose'
                                      ? '코'
                                      : part === 'mouth'
                                        ? '입'
                                        : part === 'body'
                                          ? '몸통'
                                          : part === 'arms'
                                            ? '팔'
                                            : '다리'}
                            </span>
                            <select
                              value={value}
                              onChange={(e) => {
                                const newParts = {
                                  ...character.customization!.parts,
                                  [part]: e.target.value,
                                };
                                onSettingsChange({
                                  ...character.settings,
                                  customization: {
                                    ...character.customization!,
                                    parts: newParts,
                                  },
                                });
                              }}
                              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                            >
                              <option value="">선택</option>
                              {/* 실제 구현시 파츠 옵션 추가 필요 */}
                              <option value="1">스타일 1</option>
                              <option value="2">스타일 2</option>
                              <option value="3">스타일 3</option>
                            </select>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 악세서리 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      악세서리
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {character.customization.accessories.map((acc, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                        >
                          {acc}
                          <button
                            onClick={() => {
                              const newAcc = [
                                ...character.customization!.accessories,
                              ];
                              newAcc.splice(index, 1);
                              onSettingsChange({
                                ...character.settings,
                                customization: {
                                  ...character.customization!,
                                  accessories: newAcc,
                                },
                              });
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={() => {
              // 기본값으로 초기화
              onSettingsChange({
                ...character.settings,
                position: { x: 20, y: 20 },
                size: 'medium',
                opacity: 1,
                isHidden: false,
                useAnimation: true,
                theme: 'default',
              });
            }}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            초기화
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
