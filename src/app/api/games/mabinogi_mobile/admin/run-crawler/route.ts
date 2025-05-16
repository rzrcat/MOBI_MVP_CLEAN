import { NextResponse } from 'next/server';
import { log, LogLevel } from '@/utils/crawler/crawlerUtils';

/**
 * 관리자 페이지에서 크롤러를 수동으로 실행하는 API
 * 실제 실행은 기존 크롤러 API를 호출함
 */
export async function GET(request: Request) {
  log(LogLevel.INFO, '관리자 크롤러 수동 실행 API 호출됨', {
    timestamp: new Date().toISOString(),
  });

  // 관리자 권한 확인 (실제 인증 로직은 필요에 따라 추가해야 함)

  try {
    // 기존 크롤러 API 호출
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.url.substring(0, request.url.indexOf('/api'));

    const url = `${baseUrl}/api/cron/crawler/mabinogi_mobile`;

    log(LogLevel.INFO, `크롤러 API 호출: ${url}`);

    const response = await fetch(url, {
      headers: {
        // 관리자 API 호출임을 나타내는 헤더 추가
        'X-Admin-Request': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(
        `크롤러 API 응답 오류: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    log(LogLevel.INFO, '관리자 크롤러 수동 실행 완료', {
      success: data.success,
    });

    return NextResponse.json({
      success: true,
      message: '크롤러 수동 실행이 완료되었습니다.',
      data,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(LogLevel.ERROR, '관리자 크롤러 수동 실행 중 오류 발생', {
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
