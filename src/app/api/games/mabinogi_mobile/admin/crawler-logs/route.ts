import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { log, LogLevel } from '@/utils/crawler/crawlerUtils';

/**
 * 크롤러 로그를 가져오는 API
 * 관리자 페이지에서 로그를 표시하는데 사용됨
 */
export async function GET() {
  log(LogLevel.INFO, '크롤러 로그 API 호출됨');

  try {
    const logFilePath = path.join(process.cwd(), 'logs', 'crawler.log');

    // 로그 파일이 존재하는지 확인
    if (!fs.existsSync(logFilePath)) {
      return NextResponse.json({
        success: false,
        message: '로그 파일이 존재하지 않습니다.',
        logs: [],
      });
    }

    // 로그 파일 읽기 (최대 100KB만 읽어 성능 이슈 방지)
    const maxSize = 100 * 1024; // 100KB
    const fileSize = fs.statSync(logFilePath).size;
    let logs: string;

    if (fileSize > maxSize) {
      // 파일이 너무 크면 마지막 부분만 읽음
      const buffer = Buffer.alloc(maxSize);
      const fileHandle = fs.openSync(logFilePath, 'r');
      fs.readSync(fileHandle, buffer, 0, maxSize, fileSize - maxSize);
      fs.closeSync(fileHandle);
      logs = buffer.toString('utf8');

      // 첫 번째 줄이 불완전할 수 있으므로 첫 줄바꿈 이후부터 사용
      const firstNewline = logs.indexOf('\n');
      if (firstNewline !== -1) {
        logs = logs.substring(firstNewline + 1);
      }
    } else {
      // 파일이 충분히 작으면 전체 읽기
      logs = fs.readFileSync(logFilePath, 'utf8');
    }

    // 로그 라인을 JSON으로 파싱
    const logLines = logs
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: '로그 파싱 오류',
            rawLog: line,
          };
        }
      })
      .reverse(); // 최신 로그가 위에 오도록 역순 정렬

    return NextResponse.json({
      success: true,
      message: '크롤러 로그를 성공적으로 가져왔습니다.',
      logs: logLines.slice(0, 100), // 최대 100개의 로그만 반환
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(LogLevel.ERROR, '크롤러 로그 조회 중 오류 발생', {
      error: errorMessage,
    });

    return NextResponse.json(
      {
        success: false,
        message: '로그를 가져오는 중 오류가 발생했습니다.',
        error: errorMessage,
        logs: [],
      },
      { status: 500 }
    );
  }
}
