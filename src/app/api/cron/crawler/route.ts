import { NextResponse } from 'next/server';
import { log, LogLevel } from '@/utils/crawler/crawlerUtils';

/**
 * 모든 게임의 크롤러를 실행하는 통합 엔드포인트
 * 이 엔드포인트는 Cron 작업에 의해 주기적으로 호출됩니다.
 */
export async function GET(request: Request) {
  // 인증 토큰 확인 (선택적) - 보안 향상을 위해
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

  const startTime = Date.now();
  log(LogLevel.INFO, '통합 크롤러 API 시작', {
    timestamp: new Date().toISOString(),
  });

  try {
    // 각 게임별 크롤러 실행
    const results = await Promise.allSettled([
      // 마비노기 모바일 크롤러
      fetch(
        new URL('/api/cron/crawler/mabinogi_mobile', request.url).toString(),
        {
          method: 'GET',
          headers: secretToken
            ? { Authorization: `Bearer ${secretToken}` }
            : undefined,
        }
      ).then((res) => res.json()),

      // 향후 다른 게임 크롤러 추가 가능
      // fetch(new URL('/api/cron/crawler/game2', request.url).toString(), {
      //   method: 'GET',
      //   headers: secretToken ? { 'Authorization': `Bearer ${secretToken}` } : undefined
      // }).then(res => res.json()),
    ]);

    // 각 크롤러 결과 수집
    const successfulCrawlers = results.filter(
      (result) => result.status === 'fulfilled'
    ).length;

    const failedCrawlers = results
      .filter((result) => result.status === 'rejected')
      .map((result) => {
        if (result.status === 'rejected') {
          return result.reason;
        }
        return null;
      })
      .filter(Boolean);

    // 결과 로깅
    const duration = Date.now() - startTime;
    if (failedCrawlers.length > 0) {
      log(
        LogLevel.WARN,
        `통합 크롤러 완료: ${successfulCrawlers}/${results.length} 성공, ${duration}ms 소요`,
        {
          failures: failedCrawlers,
        }
      );
    } else {
      log(
        LogLevel.INFO,
        `통합 크롤러 완료: ${successfulCrawlers}/${results.length} 성공, ${duration}ms 소요`
      );
    }

    // 최종 결과 응답
    return NextResponse.json({
      success: true,
      message: '크롤링이 완료되었습니다.',
      data: {
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        results: {
          total: results.length,
          successful: successfulCrawlers,
          failed: failedCrawlers.length,
          errors: failedCrawlers,
        },
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    log(LogLevel.ERROR, '통합 크롤러 실행 중 오류 발생', {
      error: errorMessage,
    });

    return NextResponse.json(
      {
        success: false,
        error: '크롤러 실행 중 오류가 발생했습니다.',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
