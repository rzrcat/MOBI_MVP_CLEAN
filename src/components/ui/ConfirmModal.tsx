import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const { glassEffectIntensity } = useThemeStore();

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onCancel]);

  // 포커스 트랩 (최초 취소 버튼)
  useEffect(() => {
    if (open && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div
        ref={modalRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xs w-full px-4 py-4 animate-fadeIn glass-effect"
        style={
          {
            '--glass-effect-blur': `${glassEffectIntensity}px`,
          } as React.CSSProperties
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2
          id="modal-title"
          className="text-lg font-bold mb-2 text-gray-900 dark:text-white"
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-line min-h-[2.5rem]">
            {description}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            ref={cancelBtnRef}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
