import { NextResponse } from 'next/server';
import {
  fetchServerStatuses,
  fetchGameEvents,
} from '@/utils/crawler/mabinogiCrawler';
import { log, LogLevel } from '@/utils/crawler/crawlerUtils';

/**
 * 마비노기 관련 데이터를 크롤링하는 API 엔드포인트
 * 이 엔드포인트는 크론 작업이나 수동 트리거로 호출됩니다.
 */
export async function GET(request: Request) {
  // 요청 인증 (선택적)
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const secretToken = process.env.CRAWLER_SECRET_TOKEN;

  // 토큰이 설정되었고 제공된 토큰이 일치하지 않으면 인증 실패
  if (secretToken && token !== secretToken) {
    log(LogLevel.ERROR, '크롤러 API 인증 실패', {
      ip: request.headers.get('x-forwarded-for'),
    });
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  log(LogLevel.INFO, '마비노기 크롤러 API 호출됨', {
    timestamp: new Date().toISOString(),
  });

  try {
    // 1. 서버 상태 크롤링
    log(LogLevel.INFO, '서버 상태 크롤링 시작');
    const startTime = Date.now();
    const servers = await fetchServerStatuses();
    log(
      LogLevel.INFO,
      `서버 상태 크롤링 완료: ${servers.length}개 서버, ${Date.now() - startTime}ms 소요`
    );

    // 2. 이벤트 크롤링
    log(LogLevel.INFO, '이벤트 크롤링 시작');
    const eventStartTime = Date.now();
    const events = await fetchGameEvents();
    log(
      LogLevel.INFO,
      `이벤트 크롤링 완료: ${events.length}개 이벤트, ${Date.now() - eventStartTime}ms 소요`
    );

    // DB 저장 없이 크롤링 결과만 반환
    return NextResponse.json({
      success: true,
      message: '크롤링이 완료되었습니다.',
      data: {
        timestamp: new Date().toISOString(),
        servers,
        events,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
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
