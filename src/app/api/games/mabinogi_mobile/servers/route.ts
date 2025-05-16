import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { gameServers } from '@/db/schema';
import { NextResponse } from 'next/server';
import { GameServer } from '@/types/games/mabinogi_mobile/crawler';

const sqlite = new Database('./dev.db');
const db = drizzle(sqlite);

export async function GET() {
  try {
    const servers = await db.select().from(gameServers);

    // 만약 데이터가 없으면 예시 데이터 반환 (개발용)
    if (!servers || (Array.isArray(servers) && servers.length === 0)) {
      const mockServers: GameServer[] = [
        {
          id: '1',
          name: '엘린',
          status: 'online',
          population: 30,
          region: '아시아',
          lastChecked: new Date().toISOString(),
        },
        {
          id: '2',
          name: '마리',
          status: 'online',
          population: 65,
          region: '아시아',
          lastChecked: new Date().toISOString(),
        },
        {
          id: '3',
          name: '루아',
          status: 'busy',
          population: 75,
          region: '아시아',
          lastChecked: new Date().toISOString(),
        },
        {
          id: '4',
          name: '티르코네일',
          status: 'crowded',
          population: 95,
          region: '아시아',
          lastChecked: new Date().toISOString(),
        },
        {
          id: '5',
          name: '타라',
          status: 'maintenance',
          population: 0,
          region: '아시아',
          maintenanceMessage: '서버 점검 중입니다.',
          maintenanceEndTime: new Date(
            new Date().getTime() + 3600000
          ).toISOString(),
          lastChecked: new Date().toISOString(),
        },
      ];

      return NextResponse.json({ servers: mockServers });
    }

    return NextResponse.json({ servers });
  } catch (error: unknown) {
    console.error('서버 상태 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 상태 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
