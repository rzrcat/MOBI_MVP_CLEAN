'use client';
import React, { useState } from 'react';

interface MissionTooltipProps {
  description: string;
}

/**
 * 미션 정보 툴팁 컴포넌트
 * 미션에 대한 추가 설명을 툴팁으로 표시합니다.
 *
 * @param props - 컴포넌트 속성
 * @param props.description - 툴팁에 표시할 설명 텍스트
 * @returns 툴팁 컴포넌트
 */
export function MissionTooltip({ description }: MissionTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block align-middle">
      <span
        className="ml-1 text-blue-400 cursor-pointer select-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v: boolean) => !v)}
      >
        ?
      </span>
      {show && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-pre-line">
          {description}
        </div>
      )}
    </span>
  );
}
