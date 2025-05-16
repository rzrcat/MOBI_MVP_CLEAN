import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/utils/common/classNames';

// 텍스트 대비 색상 계산 함수
function getContrastText(hexColor: string): string {
  // HEX 색상을 RGB로 변환
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // 상대적 휘도 계산 (WCAG 2.0)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 휘도가 0.5보다 크면 어두운 색상, 아니면 밝은 색상 반환
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

interface ColorPickerProps {
  value: string; // HEX 색상값
  onChange: (hex: string) => void; // 색상 변경 핸들러
  label?: string; // 선택적 라벨
  onClose?: () => void; // 선택적 닫기 핸들러
  id?: string; // 선택적 ID
}

// 기본 팔레트 색상
const PALETTE_COLORS = [
  '#000000', // 검정
  '#FFFFFF', // 흰색
  '#FF0000', // 빨강
  '#00FF00', // 초록
  '#0000FF', // 파랑
  '#FFFF00', // 노랑
  '#FF00FF', // 마젠타
  '#00FFFF', // 시안
  '#FFA500', // 주황
  '#800080', // 보라
  '#008000', // 초록
  '#800000', // 와인
  '#808080', // 회색
  '#A52A2A', // 갈색
  '#FFC0CB', // 분홍
  '#FFD700', // 금색
  '#C0C0C0', // 은색
  '#4B0082', // 인디고
  '#FF4500', // 주황빨강
  '#32CD32', // 라임
  '#BA55D3', // 중간보라
  '#20B2AA', // 라이트시안
  '#FF69B4', // 핫핑크
  '#CD853F', // 페루
  '#4682B4', // 스틸블루
  '#DDA0DD', // 자주
  '#F0E68C', // 카키
  '#E6E6FA', // 라벤더
  '#98FB98', // 연한초록
  '#87CEEB', // 하늘색
  '#D8BFD8', // 썸위드
  '#FF6347', // 토마토
  '#40E0D0', // 터콰이즈
  '#EE82EE', // 바이올렛
  '#F5DEB3', // 위트
  '#6495ED', // 콘플라워블루
];

function hexToRgb(hex: string): [number, number, number] {
  try {
    // 유효한 hex인지 확인
    if (!hex || typeof hex !== 'string') return [0, 0, 0];

    let c = hex.replace('#', '');

    // 3자리 또는 6자리 hex가 아니면 기본값 반환
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    } else if (c.length !== 6) {
      return [0, 0, 0];
    }

    // 유효한 16진수 문자인지 확인
    if (!/^[0-9A-Fa-f]{6}$/.test(c)) return [0, 0, 0];

    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    // NaN 확인 및 범위 제한
    return [
      isNaN(r) ? 0 : Math.max(0, Math.min(255, r)),
      isNaN(g) ? 0 : Math.max(0, Math.min(255, g)),
      isNaN(b) ? 0 : Math.max(0, Math.min(255, b)),
    ];
  } catch {
    return [0, 0, 0]; // 오류 발생 시 검은색 반환
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  try {
    // NaN이나 undefined 값을 0으로 대체
    const rVal = isNaN(r) ? 0 : Math.max(0, Math.min(255, Math.round(r)));
    const gVal = isNaN(g) ? 0 : Math.max(0, Math.min(255, Math.round(g)));
    const bVal = isNaN(b) ? 0 : Math.max(0, Math.min(255, Math.round(b)));

    return (
      '#' +
      [rVal, gVal, bVal]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  } catch {
    return '#000000'; // 오류 발생 시 검은색 반환
  }
}

// Spectrum(스펙트럼) 컴포넌트: 첨부 이미지 스타일로 리팩토링
function Spectrum({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  // HSV 상태 관리
  const [hue, setHue] = useState(270); // 0~360
  const [s, setS] = useState(0.7); // 0~1
  const [v, setV] = useState(0.8); // 0~1
  const spectrumRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevValueRef = useRef(value || '#000000');

  // HSV → RGB 변환
  function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const f = (n: number, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [
      Math.round(f(5) * 255),
      Math.round(f(3) * 255),
      Math.round(f(1) * 255),
    ];
  }
  // RGB → HEX
  function rgbToHex2([r, g, b]: [number, number, number]) {
    try {
      // NaN이나 undefined 값을 0으로 대체
      const rVal = isNaN(r) ? 0 : Math.max(0, Math.min(255, Math.round(r)));
      const gVal = isNaN(g) ? 0 : Math.max(0, Math.min(255, Math.round(g)));
      const bVal = isNaN(b) ? 0 : Math.max(0, Math.min(255, Math.round(b)));

      return (
        '#' +
        [rVal, gVal, bVal]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
      );
    } catch {
      return '#000000'; // 오류 발생 시 검은색 반환
    }
  }
  // HEX → HSV 변환
  function hexToHsv(hex: string): [number, number, number] {
    try {
      // 유효한 hex인지 확인
      if (!hex || typeof hex !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return [0, 0, 0];
      }

      const [r, g, b] = hexToRgb(hex);
      if (r === 0 && g === 0 && b === 0) return [0, 0, 0];

      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);

      let h = 0;
      let v = max;
      const d = max - min;
      let s = max === 0 ? 0 : d / max;

      if (max === min) {
        h = 0; // 무채색
      } else {
        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / d + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / d + 4;
            break;
        }
        h = Math.round(h * 60);
      }

      // 값 범위 제한
      h = isNaN(h) ? 0 : Math.max(0, Math.min(360, h));
      s = isNaN(s) ? 0 : Math.max(0, Math.min(1, s));
      v = isNaN(v) ? 0 : Math.max(0, Math.min(1, v));

      return [h, s, v];
    } catch {
      // 오류 발생 시 기본값 반환
      return [0, 0, 0];
    }
  }

  // value(hex) → HSV/alpha 동기화 (외부에서 value가 변경될 때만)
  useEffect(() => {
    // 값 유효성 검사 추가
    const safeValue =
      value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';

    // 이전 값과 다르고, 드래그 중이 아닐 때만 동기화
    if (prevValueRef.current !== safeValue && !isDraggingRef.current) {
      const [h, s_, v_] = hexToHsv(safeValue);
      setHue(h);
      setS(s_);
      setV(v_);
      prevValueRef.current = safeValue;
    }
  }, [value]);

  // 색상 값이 변경될 때마다 부모에게 알림 (디바운스)
  const updateColorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDraggingRef.current) {
      // 드래그 중에만 색상 업데이트
      if (updateColorRef.current) {
        clearTimeout(updateColorRef.current);
      }

      updateColorRef.current = setTimeout(() => {
        const rgb = hsvToRgb(hue, s, v);
        const hex = rgbToHex2(rgb);
        if (hex !== prevValueRef.current) {
          prevValueRef.current = hex;
          onChange(hex);
        }
      }, 20); // 20ms 디바운스
    }

    return () => {
      if (updateColorRef.current) {
        clearTimeout(updateColorRef.current);
      }
    };
  }, [hue, s, v, onChange]);

  // 스펙트럼(색상 선택) 클릭/드래그
  function handleSpectrumSelect(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault(); // 기본 동작 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    isDraggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setS(x / rect.width);
    setV(1 - y / rect.height);
  }

  // Hue 슬라이더 클릭/드래그
  function handleHueSelect(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault(); // 기본 동작 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    isDraggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHue((x / rect.width) * 360);
  }

  // 마우스 업 이벤트 처리
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // 마우스를 놓았을 때 최종 색상 적용
        const rgb = hsvToRgb(hue, s, v);
        const hex = rgbToHex2(rgb);
        if (hex !== prevValueRef.current) {
          prevValueRef.current = hex;
          onChange(hex);
        }
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hue, s, v, onChange]);

  // 현재 색상
  const rgb = hsvToRgb(hue, s, v);

  return (
    <div
      className="w-full max-w-[220px] mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 스펙트럼(색상 선택) 영역 */}
      <div
        ref={spectrumRef}
        className="relative w-full aspect-square rounded-lg overflow-hidden cursor-crosshair"
        style={{
          backgroundImage: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)), linear-gradient(to top, #000, transparent)`,
          height: '160px', // 크기 축소
        }}
        onClick={handleSpectrumSelect}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSpectrumSelect(e);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            e.preventDefault();
            e.stopPropagation();
            handleSpectrumSelect(e);
          }
        }}
      >
        {/* 선택 포인터 */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow"
          style={{
            left: `${s * 100}%`,
            top: `${(1 - v) * 100}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            boxShadow: '0 0 0 1px #007AFF',
          }}
        />
      </div>
      {/* Hue 슬라이더 */}
      <div
        ref={hueRef}
        className="relative w-full h-4 mt-2 rounded-full overflow-hidden cursor-pointer"
        style={{
          background:
            'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)',
        }}
        onClick={handleHueSelect}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleHueSelect(e);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            e.preventDefault();
            e.stopPropagation();
            handleHueSelect(e);
          }
        }}
      >
        {/* 포인터 */}
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            boxShadow: '0 0 0 1px #007AFF',
          }}
        />
      </div>
    </div>
  );
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onClose,
  label,
  id, // ID 속성 추가
}) => {
  const [hex, setHex] = useState(value?.split(':')[0] || '#000000');
  const [rgb, setRgb] = useState<[number, number, number]>(
    hexToRgb(value?.split(':')[0] || '#000000')
  );
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState<
    Record<string, number | string>
  >({
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 컴포넌트가 마운트될 때 피커 표시하지 않도록 변경
  useEffect(() => {
    // 아무 작업도 하지 않음 - 사용자가 직접 클릭해야 표시되도록 함
  }, []);

  // 드래그 시작 핸들러
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.picker-header')) {
      setIsDragging(true);
      const rect = pickerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  // 터치 드래그 시작 핸들러 추가
  const handleTouchDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.picker-header')) {
      setIsDragging(true);
      const rect = pickerRef.current?.getBoundingClientRect();
      if (rect && e.touches[0]) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    }
  };

  // 드래그 중 핸들러
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && pickerRef.current) {
        e.preventDefault();
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // 화면 밖으로 나가지 않도록 제한
        const rect = pickerRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        const posX = Math.max(0, Math.min(x, maxX));
        const posY = Math.max(0, Math.min(y, maxY));

        setPickerPosition({
          left: posX + 'px',
          top: posY + 'px',
          transform: 'none',
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // 외부 클릭 시 피커 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        // 피커 요소나 트리거 외부를 클릭했을 때만 닫기
        setShowPicker(false);
        if (onClose) {
          onClose();
        }
      }
    }

    if (showPicker) {
      // 즉시 이벤트 리스너 추가
      document.addEventListener('mouseup', handleClickOutside);
      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('mouseup', handleClickOutside);
        document.removeEventListener('click', handleClickOutside);
      };
    }
    return () => {};
  }, [showPicker, onClose]);

  useEffect(() => {
    // 값 유효성 검사 추가
    const safeValue =
      value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';
    setHex(safeValue);
    setRgb(hexToRgb(safeValue));
  }, [value]);

  // 열릴 때 초기 위치 설정
  useEffect(() => {
    if (showPicker && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      // 화면 경계 내에 위치하도록 조정
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const pickerWidth = 280; // ColorPicker의 대략적인 너비
      const pickerHeight = 480; // ColorPicker의 대략적인 높이

      let leftPos = rect.left + rect.width / 2;
      let topPos = rect.bottom + 10;

      // 오른쪽 경계 확인
      if (leftPos + pickerWidth / 2 > screenWidth) {
        leftPos = screenWidth - pickerWidth - 10;
      }

      // 왼쪽 경계 확인
      if (leftPos - pickerWidth / 2 < 0) {
        leftPos = pickerWidth / 2 + 10;
      }

      // 하단 경계 확인
      if (topPos + pickerHeight > screenHeight) {
        topPos = rect.top - pickerHeight - 10; // 위쪽에 표시
      }

      setPickerPosition({
        left: leftPos + 'px',
        top: topPos + 'px',
        transform: 'translateX(-50%)',
      });
    }
  }, [showPicker]);

  // 색상 변경 핸들러 업데이트
  const handleColorChange = (newHex: string) => {
    if (!newHex || newHex === hex) return; // 동일한 색상이면 아무 작업도 하지 않음

    setHex(newHex);
    setRgb(hexToRgb(newHex));

    try {
      onChange(newHex);
    } catch (error) {
      console.error('색상 변경 중 오류 발생:', error);
    }
  };

  // HEX 입력 핸들러
  const handleHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setRgb(hexToRgb(val));
      handleColorChange(val);
    }
  };
  // RGB 입력 핸들러
  const handleRgb = (idx: number, v: string) => {
    const n = Math.max(0, Math.min(255, Number(v.replace(/\D/g, ''))));
    const next = [...rgb] as [number, number, number];
    next[idx] = n;
    setRgb(next);
    const newHex = rgbToHex(next[0], next[1], next[2]);
    setHex(newHex);
    handleColorChange(newHex);
  };
  // 스포이드
  const handleEyedropper = async () => {
    // @ts-expect-error: EyeDropper는 최신 브라우저에서만 지원되는 비표준 API입니다.
    if (window.EyeDropper) {
      // @ts-expect-error: EyeDropper는 최신 브라우저에서만 지원되는 비표준 API입니다.
      const eye = new window.EyeDropper();
      try {
        const result = await eye.open();
        setHex(result.sRGBHex);
        setRgb(hexToRgb(result.sRGBHex));
        handleColorChange(result.sRGBHex);
      } catch {}
    }
  };
  // 팔레트에 색상 추가
  const handleAddToPalette = () => {
    if (PALETTE_COLORS.includes(hex.toUpperCase())) return;
    setRgb(hexToRgb(hex));
    handleColorChange(hex);
  };

  // 렌더링 부분 수정
  return (
    <div className="relative inline-block" id={id}>
      {/* 색상 선택 트리거 버튼 */}
      <div
        ref={triggerRef}
        className={classNames(
          'flex items-center gap-2 cursor-pointer py-1 px-2 border hover:bg-gray-50 rounded text-sm transition-all',
          { 'border-blue-500': showPicker }
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPicker((prev) => !prev);
        }}
      >
        <div
          className="w-5 h-5 rounded-full shadow-sm"
          style={{
            backgroundColor: hex || '#000000',
            borderColor: hex ? 'transparent' : '#ccc',
          }}
        />
        {label && (
          <span className="whitespace-nowrap truncate max-w-[120px] xs:max-w-none text-xs xs:text-sm">
            {label}
          </span>
        )}
      </div>

      {/* 색상 선택 패널 - Portal로 렌더링 */}
      {showPicker &&
        createPortal(
          <div
            ref={pickerRef}
            className={classNames(
              'fixed z-[9999] shadow-xl rounded-lg border border-gray-200 p-2 sm:p-3 bg-white w-[260px] sm:w-[280px]',
              {
                'translate-x-0 translate-y-0': true,
              }
            )}
            style={{
              left: pickerPosition.left,
              top: pickerPosition.top,
              transform: pickerPosition.transform as string,
              position: 'fixed', // fixed 위치 강제 지정
              pointerEvents: 'auto', // 포인터 이벤트 활성화
            }}
            onMouseDown={(e) => {
              // 클릭 이벤트가 상위로 전파되지 않도록 막음
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div
              className="absolute top-1 right-1 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowPicker(false);
                if (onClose) {
                  onClose();
                }
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>

            {/* 드래그 핸들 */}
            <div
              className="picker-header absolute top-0 left-0 right-0 h-8 cursor-move flex items-center justify-center text-gray-400 text-xs"
              onMouseDown={handleDragStart}
              onTouchStart={handleTouchDragStart}
            >
              <div className="w-8 h-1 bg-gray-200 rounded-full mt-1" />
            </div>

            {/* 색상 선택 영역 */}
            <div
              className="mt-3 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 프리뷰 */}
              <div className="flex gap-2 mb-3 items-center justify-between">
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{
                    backgroundColor: hex || '#000000',
                  }}
                />
                <div className="flex flex-1 gap-1 text-xs">
                  <input
                    type="text"
                    className="w-full rounded border px-1 py-1 text-center font-mono focus:border-blue-500 focus:outline-none uppercase"
                    value={hex}
                    onChange={handleHex}
                    maxLength={7}
                  />
                  <button
                    onClick={handleEyedropper}
                    className="border text-gray-700 hover:bg-gray-100 p-1 rounded"
                    title="색상 추출 도구"
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* RGB 입력 */}
              <div className="flex gap-1.5 mb-2">
                {['R', 'G', 'B'].map((label, idx) => (
                  <div key={label} className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <input
                      className="w-full border rounded p-1 text-center text-xs"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb[idx]}
                      onChange={(e) => handleRgb(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* 스펙트럼 */}
              <div className={classNames('flex flex-col gap-1')}>
                <Spectrum
                  value={hex}
                  onChange={(selectedHex) => handleColorChange(selectedHex)}
                />
              </div>

              {/* 색상 팔레트 */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>색상 팔레트</span>
                  <button
                    onClick={handleAddToPalette}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    저장
                  </button>
                </div>
                <div className="grid grid-cols-9 gap-1">
                  {PALETTE_COLORS.slice(0, 36).map((color) => (
                    <div
                      key={color}
                      className="aspect-square rounded-sm cursor-pointer border hover:scale-110 transition-all"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
