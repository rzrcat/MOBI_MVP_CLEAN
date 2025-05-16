'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FontSection } from './FontSection';
import { PresetSection } from './PresetSection';

interface ThemeSettingsProps {
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onOpen?: () => void;
}

export function ThemeSettings({
  onClose,
  triggerRef,
  onOpen,
}: ThemeSettingsProps) {
  const [tab, setTab] = useState<'preset' | 'font'>('preset');

  // 모달 위치 상태
  const [modalPosition, setModalPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 옵션 버튼 아래에 위치
  useEffect(() => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // 스크롤 및 뷰포트 경계 고려
      let left = rect.left + window.scrollX;
      let top = rect.bottom + 8 + window.scrollY;
      // 오른쪽 경계 넘어가면 조정
      if (left + 212 > window.innerWidth) {
        left = window.innerWidth - 212 - 8;
      }
      // 하단 경계 넘어가면 위에 표시
      if (top + 300 > window.innerHeight + window.scrollY) {
        top = rect.top - 300 - 8 + window.scrollY;
      }
      setModalPosition({ left, top });
    } else {
      // fallback: 중앙
      setModalPosition({
        left: window.innerWidth / 2 - 106,
        top: window.innerHeight / 2 - 100,
      });
    }
    if (onOpen) onOpen();
  }, [triggerRef, onOpen]);

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const modalRect = modalRef.current?.getBoundingClientRect();
    if (modalRect) {
      dragOffset.current = {
        x: e.clientX - modalRect.left,
        y: e.clientY - modalRect.top,
      };
    }
    e.preventDefault();
  };
  // 드래그 중
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setModalPosition({
        left: Math.max(
          0,
          Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 212)
        ),
        top: Math.max(
          0,
          Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 300)
        ),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 탭 변경 핸들러
  const handleTabChange = (newTab: 'preset' | 'font') => {
    setTab(newTab);
  };

  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: 'none' }}>
      <div
        ref={modalRef}
        className="w-full max-w-[212px] mx-auto my-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden max-h-[70vh] overflow-y-auto p-4"
        style={{
          left: modalPosition.left,
          top: modalPosition.top,
          position: 'fixed',
          pointerEvents: 'auto',
        }}
      >
        {/* 드래그 핸들 */}
        <div
          className="w-full h-6 cursor-move flex items-center justify-center text-gray-400 text-xs select-none"
          onMouseDown={handleDragStart}
        >
          <div className="w-8 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-1 py-1 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-xs">테마 설정</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-0.5 px-1 text-center text-xs ${
              tab === 'preset'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => handleTabChange('preset')}
          >
            프리셋
          </button>
          <button
            className={`flex-1 py-0.5 px-1 text-center text-xs ${
              tab === 'font'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => handleTabChange('font')}
          >
            폰트
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto text-xs">
          {tab === 'preset' && <PresetSection />}
          {tab === 'font' && <FontSection />}
        </div>
      </div>
    </div>
  );
}

export * from './FontSettings';
export { default as FontSettings } from './FontSettings';
export * from './ThemeSettingsComponent';
export * from './ThemePresetSelector';
export * from './ThemeStylesEditor';

export type { ThemeSettingsProps };
