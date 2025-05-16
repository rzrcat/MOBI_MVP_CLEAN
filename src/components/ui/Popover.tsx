import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  width?: number | string;
  closeOnOutsideClick?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  showArrow?: boolean;
  className?: string;
}

// 위치 정보를 위한 타입
type PositionType = {
  top: number;
  left: number;
};

// 화살표 위치 정보를 위한 타입
type ArrowPositionType = {
  top: number | string;
  left: number | string;
};

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  width = 'auto',
  closeOnOutsideClick = true,
  isOpen: controlledIsOpen,
  onOpenChange,
  showArrow = true,
  className = '',
}) => {
  // 내부적으로 제어되는 상태 혹은 외부에서 제어되는 상태 사용
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position1, setPosition1] = useState<PositionType>({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<ArrowPositionType>({
    top: 0,
    left: 0,
  });

  // 위치 계산 함수
  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 기본 위치 계산
    let top = 0;
    let left = 0;

    // position에 따른 위치 계산
    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - 8; // 위쪽으로 8px 간격
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8; // 아래쪽으로 8px 간격
        break;
      case 'left':
        left = triggerRect.left + scrollX - 8; // 왼쪽으로 8px 간격
        break;
      case 'right':
        left = triggerRect.right + scrollX + 8; // 오른쪽으로 8px 간격
        break;
    }

    // align에 따른 위치 조정
    if (position === 'top' || position === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left + scrollX;
          break;
        case 'center':
          left = triggerRect.left + scrollX + triggerRect.width / 2;
          break;
        case 'end':
          left = triggerRect.right + scrollX;
          break;
      }
    } else if (position === 'left' || position === 'right') {
      switch (align) {
        case 'start':
          top = triggerRect.top + scrollY;
          break;
        case 'center':
          top = triggerRect.top + scrollY + triggerRect.height / 2;
          break;
        case 'end':
          top = triggerRect.bottom + scrollY;
          break;
      }
    }

    // 화살표 위치 계산
    let arrowTop: string | number = 0;
    let arrowLeft: string | number = 0;

    if (position === 'top') {
      arrowTop = '100%';
      arrowLeft =
        align === 'start'
          ? '10px'
          : align === 'end'
            ? 'calc(100% - 15px)'
            : '50%';
    } else if (position === 'bottom') {
      arrowTop = '-6px';
      arrowLeft =
        align === 'start'
          ? '10px'
          : align === 'end'
            ? 'calc(100% - 15px)'
            : '50%';
    } else if (position === 'left') {
      arrowTop =
        align === 'start'
          ? '10px'
          : align === 'end'
            ? 'calc(100% - 15px)'
            : '50%';
      arrowLeft = '100%';
    } else if (position === 'right') {
      arrowTop =
        align === 'start'
          ? '10px'
          : align === 'end'
            ? 'calc(100% - 15px)'
            : '50%';
      arrowLeft = '-6px';
    }

    setPosition1({ top, left });
    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  // 열고 닫기 토글
  const handleToggle = () => {
    const newState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newState);
    }
    if (onOpenChange) {
      onOpenChange(newState);
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (!isControlled) {
          setInternalIsOpen(false);
        }
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnOutsideClick, isControlled, onOpenChange]);

  // 팝오버 열릴 때 위치 계산
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      // 리사이즈시 위치 재계산
      window.addEventListener('resize', calculatePosition);
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen]);

  // 스타일 계산
  const getContentStyles = (): React.CSSProperties => {
    let transform = '';
    let transformOrigin = '';

    if (position === 'top' || position === 'bottom') {
      transform =
        align === 'start'
          ? 'translateY(0)'
          : align === 'end'
            ? 'translateX(-100%)'
            : 'translateX(-50%)';

      transformOrigin =
        align === 'start'
          ? 'bottom left'
          : align === 'end'
            ? 'bottom right'
            : 'bottom center';
    } else {
      transform =
        align === 'start'
          ? 'translateY(0)'
          : align === 'end'
            ? 'translateY(-100%)'
            : 'translateY(-50%)';

      transformOrigin = position === 'left' ? 'right center' : 'left center';
    }

    if (position === 'top') {
      transform += ' translateY(-100%)';
    }

    if (position === 'left') {
      transform += ' translateX(-100%)';
    }

    return {
      position: 'absolute' as const,
      top: `${position1.top}px`,
      left: `${position1.left}px`,
      transform,
      transformOrigin,
      width: typeof width === 'number' ? `${width}px` : width,
    };
  };

  // 화살표 스타일 계산
  const getArrowStyles = (): React.CSSProperties => {
    return {
      position: 'absolute' as const,
      width: '12px',
      height: '12px',
      backgroundColor: 'white',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
      transform: 'rotate(45deg)',
      top: arrowPosition.top,
      left: arrowPosition.left,
      marginLeft:
        position === 'top' || position === 'bottom' ? '-6px' : undefined,
      marginTop:
        position === 'left' || position === 'right' ? '-6px' : undefined,
      zIndex: 0,
    };
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="inline-block cursor-pointer"
        style={{ position: 'relative' }}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            className={`z-50 overflow-hidden ${className}`}
            style={getContentStyles()}
          >
            {showArrow && <div style={getArrowStyles()} />}
            <div className="relative z-10 rounded-xl bg-white shadow-lg border border-gray-200 animate-fadeIn glass-effect">
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// Toggle 컴포넌트
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  // 크기별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          track: 'w-8 h-4',
          knob: 'w-3 h-3',
          transform: checked ? 'translate-x-4' : 'translate-x-1',
        };
      case 'lg':
        return {
          track: 'w-14 h-8',
          knob: 'w-6 h-6',
          transform: checked ? 'translate-x-7' : 'translate-x-1',
        };
      default: // md
        return {
          track: 'w-11 h-6',
          knob: 'w-5 h-5',
          transform: checked ? 'translate-x-5' : 'translate-x-1',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <label
      className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {label && <span className="mr-2 text-sm">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => !disabled && onChange(!checked)}
          disabled={disabled}
        />
        <div
          className={`${sizeStyles.track} rounded-full transition-colors duration-200 ${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        ></div>
        <div
          className={`${sizeStyles.knob} absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out`}
          style={{ transform: sizeStyles.transform }}
        ></div>
      </div>
    </label>
  );
};
