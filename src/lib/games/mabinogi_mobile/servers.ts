import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { gameServers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('./dev.db');
const db = drizzle(sqlite);

export async function getGameServers(game: string = 'mabinogi_mobile') {
  try {
    const servers = await db
      .select()
      .from(gameServers)
      .where(eq(gameServers.game, game));

    return servers.map((server) => ({
      id: server.id,
      name: server.name,
      status: server.status,
      population: server.population,
      region: server.region,
      maintenanceMessage: server.maintenanceMessage,
      maintenanceEndTime: server.maintenanceEndTime,
      lastChecked: server.lastChecked,
    }));
  } catch (error) {
    console.error('서버 목록 조회 오류:', error);
    // 오류 발생 시 하드코딩된 기본 서버 목록 반환
    return [
      {
        id: '1',
        name: '데이안',
        status: 'online',
        population: 30,
        region: '아시아',
      },
      {
        id: '2',
        name: '아이라',
        status: 'online',
        population: 65,
        region: '아시아',
      },
      {
        id: '3',
        name: '던컨',
        status: 'busy',
        population: 75,
        region: '아시아',
      },
      {
        id: '4',
        name: '알리사',
        status: 'online',
        population: 35,
        region: '아시아',
      },
      {
        id: '5',
        name: '메이븐',
        status: 'online',
        population: 45,
        region: '아시아',
      },
      {
        id: '6',
        name: '라사',
        status: 'busy',
        population: 70,
        region: '아시아',
      },
      {
        id: '7',
        name: '칼릭스',
        status: 'online',
        population: 50,
        region: '아시아',
      },
    ];
  }
}

// 서버명만 반환하는 단순 함수
export async function getServerNameList(game: string = 'mabinogi_mobile') {
  const servers = await getGameServers(game);
  return servers.map((server) => server.name);
}
