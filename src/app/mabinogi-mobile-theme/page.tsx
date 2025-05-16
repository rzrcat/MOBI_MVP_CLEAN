'use client';

import React, { useEffect } from 'react';
import { ThemeSettingsComponent } from '@/components/core/ThemeSettings/ThemeSettingsComponent';
import { useThemePresetsStore } from '@/store/useThemePresetsStore';

// 테마 스타일 타입 정의
interface ThemeStyles {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cardBgColor: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: string;
}

// 샘플 UI 컴포넌트들
const SampleComponents = ({
  currentStyles,
}: {
  currentStyles: ThemeStyles;
}) => {
  return (
    <>
      {/* 샘플 UI 요소들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 캐릭터 카드 */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: currentStyles.cardBgColor,
            borderRadius: currentStyles.borderRadius,
            border: `1px solid ${currentStyles.borderColor}`,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: currentStyles.primaryColor }}
          >
            캐릭터 정보
          </h2>
          <div className="flex items-center mb-4">
            <div
              className="w-20 h-20 rounded-full mr-4 flex items-center justify-center"
              style={{ backgroundColor: currentStyles.secondaryColor }}
            >
              <span className="text-2xl">🧙</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">위도우메이커</h3>
              <p style={{ color: currentStyles.secondaryColor }}>레벨 43</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>힘</span>
              <span>350</span>
            </div>
            <div className="flex justify-between">
              <span>지능</span>
              <span>124</span>
            </div>
            <div className="flex justify-between">
              <span>민첩</span>
              <span>286</span>
            </div>
            <div className="flex justify-between">
              <span>의지</span>
              <span>178</span>
            </div>
          </div>
          <button
            className="w-full py-2 text-center font-bold"
            style={{
              backgroundColor: currentStyles.buttonBgColor,
              color: currentStyles.buttonTextColor,
              borderRadius: currentStyles.borderRadius,
            }}
            type="button"
          >
            상세 정보
          </button>
        </div>

        {/* 서버 상태 카드 */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: currentStyles.cardBgColor,
            borderRadius: currentStyles.borderRadius,
            border: `1px solid ${currentStyles.borderColor}`,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: currentStyles.primaryColor }}
          >
            서버 상태
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>울프</span>
              <span
                className="px-2 py-1 rounded text-sm"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: currentStyles.borderRadius,
                }}
              >
                원활
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>루어스</span>
              <span
                className="px-2 py-1 rounded text-sm"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  borderRadius: currentStyles.borderRadius,
                }}
              >
                혼잡
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>믹스</span>
              <span
                className="px-2 py-1 rounded text-sm"
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  borderRadius: currentStyles.borderRadius,
                }}
              >
                매우 혼잡
              </span>
            </div>
          </div>
          <div
            className="mt-4 p-3 rounded text-sm"
            style={{
              backgroundColor: currentStyles.backgroundColor,
              borderRadius: currentStyles.borderRadius,
            }}
          >
            <p>마지막 업데이트: 5분 전</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default function MabinogiMobileThemePage() {
  const { setActivePreset, getCurrentStyles } = useThemePresetsStore();
  const currentStyles = getCurrentStyles();

  // 페이지 로드 시 전체 페이지에 스타일 적용
  useEffect(() => {
    // 페이지 진입시 마비노기 모바일 스타일로 설정
    setActivePreset('mabinogi-mobile');

    // 컴포넌트 언마운트 시 기본 테마로 복원
    return () => {
      setActivePreset('default');
    };
  }, [setActivePreset]);

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: currentStyles.backgroundColor,
        color: currentStyles.textColor,
        fontFamily: currentStyles.fontFamily,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: currentStyles.primaryColor }}
        >
          마비노기 모바일 스타일 테스트
        </h1>

        <div
          className="p-6 rounded-lg mb-8"
          style={{
            backgroundColor: currentStyles.cardBgColor,
            borderRadius: currentStyles.borderRadius,
            border: `1px solid ${currentStyles.borderColor}`,
          }}
        >
          <ThemeSettingsComponent />
        </div>

        <SampleComponents currentStyles={currentStyles} />

        {/* 이벤트 정보 */}
        <div
          className="p-4 rounded-lg mb-8"
          style={{
            backgroundColor: currentStyles.cardBgColor,
            borderRadius: currentStyles.borderRadius,
            border: `1px solid ${currentStyles.borderColor}`,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: currentStyles.primaryColor }}
          >
            진행 중인 이벤트
          </h2>
          <div className="space-y-4">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: currentStyles.backgroundColor,
                borderRadius: currentStyles.borderRadius,
                border: `1px solid ${currentStyles.borderColor}`,
              }}
            >
              <h3 className="font-bold">불길한 소환의 결계 출현</h3>
              <p
                className="text-sm mb-2"
                style={{ color: currentStyles.secondaryColor }}
              >
                오늘 남은 전리품 횟수 2회
              </p>
              <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: '75%',
                    backgroundColor: currentStyles.accentColor,
                  }}
                ></div>
              </div>
              <p
                className="text-xs mt-1 text-right"
                style={{ color: currentStyles.accentColor }}
              >
                진행 중
              </p>
            </div>

            <div
              className="p-3 rounded"
              style={{
                backgroundColor: currentStyles.backgroundColor,
                borderRadius: currentStyles.borderRadius,
                border: `1px solid ${currentStyles.borderColor}`,
              }}
            >
              <h3 className="font-bold">검은 구멍 출현</h3>
              <p
                className="text-sm mb-2"
                style={{ color: currentStyles.secondaryColor }}
              >
                오늘 남은 가능 횟수 3회
              </p>
              <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: '40%',
                    backgroundColor: currentStyles.secondaryColor,
                  }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-right">13:45 시작</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
