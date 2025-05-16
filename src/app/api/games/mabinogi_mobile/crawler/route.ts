import { NextResponse } from 'next/server';
import {
  fetchServerStatuses,
  fetchGameEvents,
  fetchAnnouncements,
} from '@/utils/crawler/mabinogiCrawler';
import { log, LogLevel } from '@/utils/crawler/crawlerUtils';

/**
 * 마비노기 모바일 데이터를 크롤링하는 API 엔드포인트
 * 이 엔드포인트는 데이터를 반환하지만 DB에 저장하지는 않습니다.
 * 데이터 저장은 /api/cron/crawler/mabinogi 엔드포인트에서 처리합니다.
 */
export async function GET() {
  log(LogLevel.INFO, '마비노기 크롤러 API 직접 호출됨', {
    timestamp: new Date().toISOString(),
  });

  try {
    // 각 데이터 크롤링 병렬 실행
    const [servers, events, announcements] = await Promise.all([
      fetchServerStatuses(),
      fetchGameEvents(),
      fetchAnnouncements(),
    ]);

    // 응답
    return NextResponse.json({
      success: true,
      message: '크롤링이 완료되었습니다.',
      data: {
        timestamp: new Date().toISOString(),
        servers,
        events,
        announcements,
        stats: {
          serverCount: servers.length,
          eventCount: events.length,
          announcementCount: announcements.length,
        },
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(LogLevel.ERROR, '크롤링 중 오류 발생', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: '크롤링 중 오류가 발생했습니다.',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
