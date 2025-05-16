'use client';
// import Link from 'next/link';
// import Image from 'next/image';
import { useCharacterStore } from '@/store/useCharacterStore';
import { Character } from '@/types/character';
import React, { useState, Suspense } from 'react';
import { MissionTracker } from '@/features/tracker';
import { useServerList } from '@/hooks/useServerList';
import { ErrorBoundary } from '@/components/core/ErrorBoundary';
import PushNotification from '@/components/core/PushNotification';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { PinIcon } from '@/shared/ui/atoms/PinIcon';

// 서비스 워커 등록 스크립트 임포트
import '@/app/register-sw';

// 각 섹션을 위한 Fallback UI 컴포넌트
const CharacterSectionFallback = () => (
  <div className="bg-gray-50 rounded shadow p-3 sm:p-4 mb-6">
    <div className="flex items-center mb-2">
      <span className="font-bold mr-2">내 캐릭터</span>
    </div>
    <div className="text-gray-400 p-4">
      캐릭터 정보를 불러오는 데 문제가 발생했습니다.
      <br />
      페이지를 새로고침하거나 나중에 다시 시도해주세요.
    </div>
  </div>
);

const TrackerSectionFallback = () => (
  <div className="bg-blue-50 rounded shadow p-3 sm:p-4 mb-6">
    <div className="flex items-center mb-2">
      <span className="font-bold mr-2 text-blue-700">할 일 목록</span>
    </div>
    <div className="text-gray-400 p-4 text-center">
      할 일 정보를 불러오는 데 문제가 발생했습니다.
      <br />
      페이지를 새로고침하거나 나중에 다시 시도해주세요.
    </div>
  </div>
);

// 캐릭터 섹션 컴포넌트
const CharacterSection = () => {
  const {
    characters,
    selectedCharacterId,
    deleteCharacter,
    selectCharacter,
    addCharacter,
    updateCharacter,
  } = useCharacterStore();

  // 기본 서버 목록 (API 오류 시 폴백용)
  const defaultServers = [
    '데이안',
    '아이라',
    '던컨',
    '알리사',
    '메이븐',
    '라사',
    '칼릭스',
  ];
  const { servers } = useServerList({ initialServers: defaultServers });

  const [showAddField, setShowAddField] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterServer, setNewCharacterServer] = useState('');
  const [editCharacterId, setEditCharacterId] = useState<string | null>(null);
  const [editCharacterName, setEditCharacterName] = useState('');
  const [editCharacterServer, setEditCharacterServer] = useState('');
  const [newCharacterNameError, setNewCharacterNameError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Character | null>(null);

  // 캐릭터 추가 핸들러 구현
  const handleAddCharacter = () => {
    if (!newCharacterName.trim()) return;
    const id = Math.random().toString(36).slice(2, 10);
    addCharacter({
      id,
      type: 'custom',
      name: newCharacterName.trim(),
      server: newCharacterServer,
      level: 1,
      experience: 0,
      settings: {
        position: { x: 0, y: 0 },
        size: 'medium',
        opacity: 1,
        isHidden: false,
        useAnimation: false,
        recordHistory: false,
        theme: 'default',
        notifications: {
          dailyTasks: true,
          events: true,
          notices: true,
          bardBoard: true,
          fashionItems: true,
          guildNews: true,
          popularPosts: true,
        },
        quietHours: {
          enabled: false,
          start: 0,
          end: 0,
        },
      },
    });
    setShowAddField(false);
    setNewCharacterName('');
    setNewCharacterServer('');
    setNewCharacterNameError('');
  };

  // 캐릭터명 수정 저장 핸들러
  const handleEditCharacterSave = (id: string) => {
    if (!editCharacterName.trim()) return;
    // updateCharacter를 통해 캐릭터명과 서버 수정
    updateCharacter(id, {
      name: editCharacterName.trim(),
      server: editCharacterServer,
    });
    setEditCharacterId(null);
    setEditCharacterName('');
    setEditCharacterServer('');
  };

  // 캐릭터 편집 시작 핸들러
  const handleStartEdit = (character: Character) => {
    setEditCharacterId(character.id);
    setEditCharacterName(character.name);
    setEditCharacterServer(character.server);
  };

  // 캐릭터명 입력 핸들러 개선
  const handleNewCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewCharacterName(value);
    if (value.length > 20) {
      setNewCharacterNameError('캐릭터명은 20자 이내로 입력해주세요.');
    } else {
      setNewCharacterNameError('');
    }
  };

  return (
    <div className="bg-gray-50 rounded shadow p-3 sm:p-4 mb-6">
      <div className="flex items-center mb-2">
        <span className="font-bold mr-2">내 캐릭터</span>
        <button
          type="button"
          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm flex items-center gap-1 hover:bg-green-600 transition-colors"
          onClick={() => setShowAddField(true)}
          disabled={showAddField}
        >
          + 추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {characters.length === 0 && (
          <div className="w-full text-center py-3 bg-gray-50 rounded border border-gray-200">
            <span className="text-gray-500">
              아직 등록된 캐릭터가 없습니다. <b>+ 추가</b> 버튼을 눌러 캐릭터를
              등록해보세요!
            </span>
          </div>
        )}
        {characters.map((c: Character) => (
          <div
            key={c.id}
            className={`flex items-center px-3 py-2 rounded-ios-medium border transition-all ${
              selectedCharacterId === c.id
                ? 'bg-ios-blue/15 border-ios-blue/80 shadow-sm'
                : 'bg-white/90 border-gray-200 hover:border-gray-300'
            } ${editCharacterId === c.id ? 'w-full' : 'cursor-pointer'}`}
            onClick={() => editCharacterId !== c.id && selectCharacter(c.id)}
          >
            {editCharacterId === c.id ? (
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* 캐릭터 이름 입력 필드 */}
                  <div className="sm:col-span-1 md:col-span-2">
                    <input
                      type="text"
                      value={editCharacterName}
                      onChange={(e) => setEditCharacterName(e.target.value)}
                      className="border px-3 py-2 rounded-ios-full text-subhead w-full"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      placeholder="캐릭터 이름"
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditCharacterSave(c.id);
                        }
                      }}
                    />
                  </div>

                  {/* 서버 선택 드롭다운 */}
                  <div className="sm:col-span-1 md:col-span-1">
                    <select
                      value={editCharacterServer}
                      onChange={(e) => setEditCharacterServer(e.target.value)}
                      className="border px-3 py-2 rounded-ios-full text-subhead w-full bg-white appearance-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">서버(선택)</option>
                      {servers.map((server) => (
                        <option key={server} value={server}>
                          {server}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 버튼 그룹 */}
                  <div className="flex justify-end sm:col-span-2 md:col-span-1 gap-2">
                    <button
                      type="button"
                      className="bg-ios-blue hover:bg-ios-blue/90 active:scale-[0.98] text-white rounded-ios-full px-4 py-2 text-subhead transition-all shadow-sm flex-1 sm:flex-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCharacterSave(c.id);
                      }}
                      disabled={!editCharacterName.trim()}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 active:scale-[0.98] text-gray-700 rounded-ios-full px-4 py-2 text-subhead transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex-1 sm:flex-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditCharacterId(null);
                        setEditCharacterName('');
                        setEditCharacterServer('');
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.name}</span>
                {c.server && (
                  <span className="text-footnote text-gray-500 ml-1.5">
                    {c.server}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(c);
                  }}
                  className="p-1.5 text-gray-500 hover:text-ios-blue rounded-full hover:bg-gray-100/80 transition-colors dark:hover:bg-gray-700 dark:hover:text-ios-teal"
                  title="편집"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(c);
                  }}
                  className="p-1.5 text-gray-500 hover:text-ios-red rounded-full hover:bg-gray-100/80 transition-colors dark:hover:bg-gray-700"
                  title="삭제"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 인라인 추가 폼 */}
      {showAddField && (
        <div className="border p-3 rounded-ios-medium bg-white/90 backdrop-blur-ios shadow-ios-sm mt-2">
          {/* 안내 메시지 (입력 필드 위) */}
          {newCharacterNameError && (
            <div className="text-xs text-red-500 mb-1 text-left w-full">
              {newCharacterNameError}
            </div>
          )}
          <div className="flex flex-row items-center gap-2 w-full min-h-[44px]">
            {/* 서버 선택 드롭다운 */}
            <div
              className="relative"
              style={{ minWidth: '6.5rem', maxWidth: '12rem' }}
            >
              <select
                value={newCharacterServer}
                onChange={(e) => setNewCharacterServer(e.target.value)}
                className="block border px-2 py-1 pr-8 rounded-ios-full text-subhead bg-white"
                style={{
                  width: `${(newCharacterServer ? newCharacterServer.length : 5) + 5}ch`,
                  minWidth: '6.5rem',
                  maxWidth: '12rem',
                }}
              >
                <option value="">서버(선택)</option>
                {servers.map((server) => (
                  <option key={server} value={server}>
                    {server}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
                </svg>
              </span>
            </div>
            {/* 캐릭터 이름 입력 필드 */}
            <div className="flex flex-col">
              <input
                type="text"
                value={newCharacterName}
                onChange={handleNewCharacterNameChange}
                className={`border px-2 py-1 rounded-ios-full text-subhead ${newCharacterNameError ? 'border-red-400' : ''}`}
                placeholder="캐릭터명 입력(20자 제한)"
                style={{
                  minWidth: '12.5rem',
                  width: `${Math.max(12.5, newCharacterName.length * 1.1 + 8)}ch`,
                }}
                maxLength={20}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    newCharacterName.trim() &&
                    !newCharacterNameError
                  ) {
                    handleAddCharacter();
                  }
                }}
                autoFocus
              />
            </div>
            {/* 버튼 그룹 */}
            <div className="flex flex-row gap-1 min-w-[100px]">
              <button
                type="button"
                className={`w-12 px-0 py-1 rounded-ios-full text-subhead transition-all shadow-sm text-sm ${!newCharacterName.trim() || !!newCharacterNameError ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-ios-blue hover:bg-ios-blue/90 text-white active:scale-[0.98]'}`}
                onClick={handleAddCharacter}
                disabled={!newCharacterName.trim() || !!newCharacterNameError}
              >
                추가
              </button>
              <button
                type="button"
                className="w-12 px-0 py-1 bg-gray-200 hover:bg-gray-300 active:scale-[0.98] text-gray-700 rounded-ios-full text-subhead transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-sm"
                onClick={() => {
                  setShowAddField(false);
                  setNewCharacterName('');
                  setNewCharacterServer('');
                  setNewCharacterNameError('');
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!deleteTarget}
        title="캐릭터 삭제 확인"
        description={`정말로 "${deleteTarget?.name}" 캐릭터를 삭제하시겠습니까?\n이 작업은 복구가 불가능합니다.`}
        confirmText="영구 삭제"
        cancelText="취소"
        onConfirm={() => {
          if (deleteTarget) {
            deleteCharacter(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

// 할 일 목록 섹션 컴포넌트
const TrackerSection = ({ characterId }: { characterId: string }) => {
  const [trackerOpen, setTrackerOpen] = useState(true);

  return (
    <div className="bg-blue-50 rounded shadow p-3 sm:p-4 mb-6">
      <div
        className="flex items-center mb-2 cursor-pointer select-none"
        onClick={() => setTrackerOpen((v) => !v)}
      >
        <span className="font-bold mr-2 text-blue-700">할 일 목록</span>
        <span className="ml-1 text-xs text-gray-500">
          (일일/주간 미션 관리)
        </span>
        <span className="ml-auto">
          <PinIcon
            size={28}
            bg={trackerOpen ? '#7C5CFA' : '#2D2940'}
            color={trackerOpen ? 'white' : '#6B7280'}
          />
        </span>
      </div>
      {trackerOpen && (
        <ErrorBoundary>
          <MissionTracker characterId={characterId} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default function HomePage() {
  const { characters, selectedCharacterId } = useCharacterStore();

  return (
    <div className="w-[70vw] mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-4 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 drop-shadow mb-2">
        MMGG - 마비노기 모바일
      </h1>
      <p className="text-base sm:text-lg text-center text-gray-700 max-w-3xl px-2 mb-2">
        <span className="font-bold text-blue-600">마비노기 모바일</span>의 모든
        정보를 한 곳에서 쉽고 빠르게😎
        <br />룬 도감, 코디 도감, 가이드를 확인해요.
      </p>
      {/* 캐릭터 관리 UI */}
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
        <ErrorBoundary fallback={<CharacterSectionFallback />}>
          <Suspense fallback={<div>캐릭터 정보 로딩 중...</div>}>
            <CharacterSection />
          </Suspense>
        </ErrorBoundary>

        {/* 할 일 목록 섹션 */}
        {characters.length > 0 ? (
          <ErrorBoundary fallback={<TrackerSectionFallback />}>
            <Suspense fallback={<div>할 일 목록 정보 로딩 중...</div>}>
              <TrackerSection
                characterId={selectedCharacterId || characters[0].id}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <div className="bg-blue-50 rounded shadow p-3 sm:p-4 mb-6">
            <div className="flex items-center mb-2">
              <span className="font-bold mr-2 text-blue-700">할 일 목록</span>
              <span className="ml-1 text-xs text-gray-500">
                (일일/주간 미션 관리)
              </span>
              <span className="ml-auto text-blue-500 text-lg">▼</span>
            </div>
            <div className="text-gray-400 text-sm text-center py-4">
              캐릭터를 먼저 등록하면 할 일 목록을 사용할 수 있습니다.
            </div>
          </div>
        )}

        {/* 푸시 알림 섹션 */}
        <div className="bg-indigo-50 rounded shadow p-3 sm:p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2 text-indigo-700">푸시 알림</span>
            <span className="ml-1 text-xs text-gray-500">
              (보스/결계 알림 설정)
            </span>
          </div>
          <ErrorBoundary>
            <Suspense fallback={<div>알림 기능 로딩 중...</div>}>
              <PushNotification />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
