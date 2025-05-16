// Types for Mabinogi game crawler data

// 서버 상태 유형 정의
export type ServerStatus = 'online' | 'busy' | 'crowded' | 'maintenance';

/**
 * 게임 서버 정보
 */
export interface GameServer {
  id: string;
  name: string;
  status: ServerStatus;
  population: number; // 0-100 범위의 서버 혼잡도
  region: string;
  lastChecked: string; // ISO 8601 형식의 날짜 문자열
  maintenanceMessage?: string; // 점검 중일 때만 있음
  maintenanceEndTime?: string; // 점검 종료 예정 시간 (ISO 8601)
}

/**
 * 게임 이벤트 카테고리
 */
export type EventCategory = 'general' | 'update' | 'bonus' | 'community';

/**
 * 게임 이벤트 정보
 */
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO 8601 형식의 날짜 문자열
  endDate: string; // ISO 8601 형식의 날짜 문자열
  imageUrl?: string;
  url?: string;
  rewards?: string[]; // 이벤트 보상 목록
  isSpecial: boolean;
  category: EventCategory;
}

/**
 * 공지사항 정보
 */
export interface Announcement {
  title: string;
  date: string; // ISO 8601 형식의 날짜 문자열
  link: string;
}

/**
 * 크롤러 실행 결과
 */
export interface CrawlerResult {
  success: boolean;
  message: string;
  data?: {
    timestamp: string;
    serverCount?: number;
    eventCount?: number;
  };
  error?: string;
}
