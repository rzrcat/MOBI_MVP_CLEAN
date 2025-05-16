'use client';

import React from 'react';
import { ThemeSettings as NewThemeSettings } from './ThemeSettings/index';

// 호환성을 위한 래퍼 컴포넌트
interface ThemeSettingsProps {
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onOpen?: () => void;
}

export const ThemeSettings = ({
  onClose,
  triggerRef,
  onOpen,
}: ThemeSettingsProps) => {
  return (
    <NewThemeSettings
      onClose={onClose}
      triggerRef={triggerRef}
      onOpen={onOpen}
    />
  );
};

export default ThemeSettings;
