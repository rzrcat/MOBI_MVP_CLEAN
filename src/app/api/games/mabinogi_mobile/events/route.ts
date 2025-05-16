import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 만약 데이터가 없으면 예시 데이터 반환 (개발용)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const mockEvents = [
      {
        id: '1',
        title: '월간 대규모 업데이트',
        description:
          '새로운 던전과 스토리, 캐릭터가 추가됩니다. 이번 달은 바다 속 던전인 심해의 전당이 등장합니다.',
        startDate: yesterday.toISOString(),
        endDate: nextWeek.toISOString(),
        imageUrl: 'https://via.placeholder.com/300x150?text=월간+업데이트',
        url: 'https://example.com/monthly-update',
        rewards: [
          '월간 업데이트 기념 상자',
          '신규 장비 선택권',
          '펫 알',
          '프리미엄 이용권 (7일)',
        ],
        isSpecial: true,
        category: 'update',
      },
      {
        id: '2',
        title: '여름 해변 이벤트',
        description:
          '여름 맞이 특별 이벤트! 해변에서 몬스터를 처치하고 특별한 보상을 얻으세요.',
        startDate: today.toISOString(),
        endDate: nextMonth.toISOString(),
        imageUrl: 'https://via.placeholder.com/300x150?text=여름+해변+이벤트',
        rewards: ['수영복 세트', '인어 변신 물약', '해변 배경 인테리어'],
        category: 'general',
      },
      {
        id: '3',
        title: '주간 던전 보상 2배',
        description: '모든 주간 던전의 보상이 2배로 적용됩니다.',
        startDate: yesterday.toISOString(),
        endDate: new Date(
          today.getTime() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        rewards: ['추가 경험치', '추가 아이템 드롭'],
        category: 'bonus',
      },
      {
        id: '4',
        title: '신규 캐릭터 사전 예약',
        description:
          '곧 출시될 신규 캐릭터 사전 예약 이벤트입니다. 지금 참여하고 특별 보상을 받으세요.',
        startDate: today.toISOString(),
        endDate: new Date(
          today.getTime() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        url: 'https://example.com/pre-register',
        rewards: [
          '신규 캐릭터 의상 세트',
          '전용 무기 상자',
          '성장 지원 패키지',
        ],
        category: 'community',
      },
      {
        id: '5',
        title: '길드 대전 시즌 3',
        description:
          '서버 내 모든 길드가 참여하는 대규모 PVP 이벤트입니다. 상위 길드에게는 특별한 보상이 제공됩니다.',
        startDate: new Date(
          today.getTime() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date(
          today.getTime() + 12 * 24 * 60 * 60 * 1000
        ).toISOString(),
        imageUrl: 'https://via.placeholder.com/300x150?text=길드+대전',
        rewards: ['길드 전용 깃발', '길드 포인트', '전설급 장비 상자'],
        category: 'general',
      },
    ];

    return NextResponse.json(mockEvents);
  } catch (error) {
    console.error('Unexpected error in game events:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
