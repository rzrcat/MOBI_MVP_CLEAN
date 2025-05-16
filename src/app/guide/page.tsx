'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Guide 페이지
export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('guide'); // guide, server, community

  const tabs = [
    { id: 'guide', label: '가이드' },
    { id: 'server', label: '서버 정보' },
    { id: 'community', label: '커뮤니티' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          MMGG - 마비노기 모바일 가이드
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 가이드 콘텐츠 */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">게임 기초 가이드</h2>
              <p className="text-gray-700">
                마비노기 모바일에 처음 접하는 신규 모험가들을 위한 기초
                가이드입니다. 게임 시스템부터 초반 육성 방법까지 상세하게
                설명해드립니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">직업 시스템</h3>
                  <p className="text-gray-600 mb-3">
                    마비노기 모바일은 다양한 직업을 자유롭게 전직할 수 있는 것이
                    특징입니다.
                  </p>
                  <h4 className="font-medium text-gray-700 mb-2">직업 분류</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>전사: 근접 공격 특화, 높은 방어력</li>
                    <li>마법사: 원거리 마법 공격, 넓은 범위 공격</li>
                    <li>궁수: 빠른 공격 속도, 높은 명중률</li>
                    <li>성직자: 파티원 버프 및 회복 담당</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">스킬 시스템</h3>
                  <p className="text-gray-600 mb-3">
                    각 직업별로 다양한 스킬을 배울 수 있으며, 스킬 레벨을
                    올리면서 캐릭터를 성장시킬 수 있습니다.
                  </p>
                  <h4 className="font-medium text-gray-700 mb-2">
                    스킬 레벨업 방법
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>스킬 사용: 전투 중 해당 스킬 적극 사용</li>
                    <li>훈련: 훈련장에서 스킬 훈련으로 경험치 획득</li>
                    <li>스킬 스크롤: 특수 아이템을 통한 레벨업</li>
                    <li>퀘스트: 특정 퀘스트 보상으로 스킬 경험치 획득</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">장비 시스템</h3>
                  <p className="text-gray-600 mb-3">
                    다양한 장비를 수집하고 강화하여 캐릭터의 능력을
                    향상시키세요.
                  </p>
                  <h4 className="font-medium text-gray-700 mb-2">
                    장비 등급 및 강화
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>일반(흰색): 기본 성능의 장비</li>
                    <li>고급(초록색): 추가 옵션 1~2개 보유</li>
                    <li>희귀(파란색): 추가 옵션 3~4개 보유</li>
                    <li>전설(보라색): 특수 능력과 다수의 추가 옵션</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">던전 시스템</h3>
                  <p className="text-gray-600 mb-3">
                    다양한 난이도의 던전에 도전하여 희귀 아이템과 경험치를
                    획득할 수 있습니다.
                  </p>
                  <h4 className="font-medium text-gray-700 mb-2">
                    던전 난이도
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>일반: 초보자용, 40레벨 이상 권장</li>
                    <li>어려움: 중급자용, 80레벨 이상 권장</li>
                    <li>영웅: 숙련자용, 120레벨 이상 권장</li>
                    <li>전설: 고수용, 160레벨 이상 권장</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">도움말 &amp; 팁</h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  이 웹사이트에서 제공하는 다양한 도구와 계산기를 활용하면 게임
                  플레이에 큰 도움이 됩니다!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-lg text-green-700">
                      경험치 계산기
                    </h4>
                    <p className="text-gray-600 mt-2">
                      레벨업에 필요한 경험치와 효율적인 사냥터를 추천해드립니다.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-lg text-teal-700">
                      재화 최적화 가이드
                    </h4>
                    <p className="text-gray-600 mt-2">
                      제한된 자원으로 최대한의 효과를 얻는 방법을 알려드립니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center mt-6">
              <Link href="/">
                <Button>홈으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        )}

        {/* 서버 상태 */}
        {activeTab === 'server' && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">서버 상태 확인 시스템</h2>
              <p className="text-gray-700">
                마비노기 모바일의 서버 상태를 실시간으로 확인하고 점검 정보를
                제공하는 시스템입니다. 서버 점검 시간과 종료 예정 시간을
                확인하여 게임 플레이를 계획하는 데 도움이 됩니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">서버 상태 유형</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      <span className="text-green-500 font-medium">온라인</span>
                      : 정상적으로 접속 가능
                    </li>
                    <li>
                      <span className="text-yellow-500 font-medium">혼잡</span>:
                      접속은 가능하나 서버 부하가 높음
                    </li>
                    <li>
                      <span className="text-orange-500 font-medium">포화</span>:
                      접속이 지연될 수 있음
                    </li>
                    <li>
                      <span className="text-red-500 font-medium">점검 중</span>:
                      현재 서버 점검으로 접속 불가
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-medium mb-3">점검 정보 제공</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>공식 공지사항 기반 점검 정보 추출</li>
                    <li>예상 점검 종료 시간 표시</li>
                    <li>점검 종료까지 남은 시간 카운트다운</li>
                    <li>점검 연장 시 업데이트된 정보 제공</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">서버 상태 확인 팁</h3>
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.2 5.8L16 6.8L12 11.2L13.2 16L8 13.8L2.8 16L4 11.2L0 6.8L5.8 5.8L8 0Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                    <span>
                      정기 점검은 보통 업데이트와 함께 진행되며, 공지사항에서
                      미리 확인할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.2 5.8L16 6.8L12 11.2L13.2 16L8 13.8L2.8 16L4 11.2L0 6.8L5.8 5.8L8 0Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                    <span>
                      점검 종료 2시간 전부터 더 자주 서버 상태가 업데이트됩니다.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.2 5.8L16 6.8L12 11.2L13.2 16L8 13.8L2.8 16L4 11.2L0 6.8L5.8 5.8L8 0Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                    <span>
                      혼잡 시간대에는 서버 접속이 지연될 수 있으니, 여유로운
                      시간에 접속하는 것이 좋습니다.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.2 5.8L16 6.8L12 11.2L13.2 16L8 13.8L2.8 16L4 11.2L0 6.8L5.8 5.8L8 0Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                    <span>
                      긴급 점검은 예고 없이 진행될 수 있으며, 이럴 때는 공식
                      커뮤니티나 SNS를 확인하세요.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-medium mb-3">자동 알림 설정</h3>
              <p className="text-gray-600 mb-4">
                서버 점검 종료시 자동으로 알림을 받고 싶다면 아래 기능을
                활용하세요.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>마이페이지 {'>'} 알림 설정 메뉴로 이동</li>
                <li>&apos;서버 상태 알림&apos; 옵션 활성화</li>
                <li>알림을 받고 싶은 서버 선택</li>
                <li>저장 버튼 클릭</li>
              </ol>
              <p className="text-sm text-gray-500 mt-4">
                ※ 알림 기능은 로그인한 사용자만 이용할 수 있습니다.
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/games/mabinogi_mobile/tracker">
                <Button>서버 상태 확인하기</Button>
              </Link>
            </div>
          </div>
        )}

        {/* 커뮤니티 */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">커뮤니티 가이드</h2>
              <p className="text-gray-700">
                마비노기 모바일 커뮤니티에 참여하는 방법과 유용한 정보를
                공유하는 방법을 안내합니다.
              </p>

              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-medium mb-3">커뮤니티 기능</h3>
                <p className="text-gray-600 mb-4">
                  다양한 방법으로 다른 플레이어들과 소통하고 정보를 공유할 수
                  있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>룬 평가 및 후기 작성</li>
                  <li>아웃핏 코디 공유 및 평가</li>
                  <li>공략 가이드 작성</li>
                  <li>질문 및 답변</li>
                </ul>
              </div>
            </section>

            <div className="flex justify-center mt-6">
              <Link href="/">
                <Button>홈으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
