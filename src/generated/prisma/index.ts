// 데이터베이스 모델 타입 정의

export interface ServerStatus {
  id: string;
  serverId: string;
  serverName: string;
  status: 'online' | 'maintenance' | 'busy' | 'full';
  playerCount?: number;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  gameId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Drizzle 기반 데이터 접근 기능으로 대체
// 실제 구현은 db 폴더의 관련 파일에서 관리

// 유형 정의를 위한 빈 객체 내보내기 (기존 import 구문 오류 방지)
export const prisma = {
  serverStatus: {
    findMany: async () => [] as ServerStatus[],
    create: async () => ({}) as ServerStatus,
    update: async () => ({}) as ServerStatus,
  },
  event: {
    findMany: async () => [] as Event[],
    create: async () => ({}) as Event,
    update: async () => ({}) as Event,
  },
};

// Prisma 관련 클래스 대체
export class PrismaClient {
  serverStatus = {
    findMany: async () => [] as ServerStatus[],
    create: async () => ({}) as ServerStatus,
    update: async () => ({}) as ServerStatus,
  };

  event = {
    findMany: async () => [] as Event[],
    create: async () => ({}) as Event,
    update: async () => ({}) as Event,
  };
}
