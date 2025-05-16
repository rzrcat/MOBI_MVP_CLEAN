const cron = require('node-cron');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// 환경 변수 로드
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// 설정 값
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const CRAWLER_SECRET_TOKEN = process.env.CRAWLER_SECRET_TOKEN || '';

// CRON 스케줄 설정 (기본값 설정)
const CRAWLER_SCHEDULE = process.env.CRAWLER_SCHEDULE || '1 * * * *'; // 기본: 매시간 1분에 실행
const CRAWLER_SCHEDULE_SERVERS =
  process.env.CRAWLER_SCHEDULE_SERVERS || '*/15 * * * *'; // 기본: 15분마다
const CRAWLER_SCHEDULE_EVENTS =
  process.env.CRAWLER_SCHEDULE_EVENTS || '30 0,12 * * *'; // 기본: 매일 00:30, 12:30
const CRAWLER_SCHEDULE_ANNOUNCEMENTS =
  process.env.CRAWLER_SCHEDULE_ANNOUNCEMENTS || '10 * * * *'; // 기본: 매시간 10분

// 기타 설정
const CRAWLER_TIMEOUT_MS = Number(process.env.CRAWLER_TIMEOUT_MS || 30000);
const CRAWLER_MAX_RETRIES = Number(process.env.CRAWLER_MAX_RETRIES || 3);
const LOG_FILE_PATH = path.resolve(process.cwd(), 'logs', 'crawler.log');

// 로그 디렉토리 생성
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 로깅 함수
 * @param {string} level - 로그 레벨 (info, warn, error)
 * @param {string} message - 로그 메시지
 * @param {object} [details] - 추가 정보
 */
function log(level, message, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...details,
  };

  // 콘솔에 출력
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, details);

  // 파일에 저장
  try {
    fs.appendFileSync(LOG_FILE_PATH, `${JSON.stringify(logEntry)}\n`, 'utf8');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

/**
 * API 요청 함수 (재시도 로직 포함)
 * @param {string} url - 요청할 URL
 * @param {number} [retries=CRAWLER_MAX_RETRIES] - 남은 재시도 횟수
 * @returns {Promise<object>} - API 응답
 */
async function fetchWithRetry(url, retries = CRAWLER_MAX_RETRIES) {
  try {
    const response = await axios.get(url, {
      timeout: CRAWLER_TIMEOUT_MS,
      headers: CRAWLER_SECRET_TOKEN
        ? { Authorization: `Bearer ${CRAWLER_SECRET_TOKEN}` }
        : undefined,
    });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      const delay = Math.pow(2, CRAWLER_MAX_RETRIES - retries) * 1000; // 지수 백오프
      log(
        'warn',
        `Error fetching ${url}, retrying in ${delay}ms (${retries} retries left)`,
        {
          error: error.message,
          status: error.response?.status,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1);
    }

    throw error;
  }
}

/**
 * 크롤링 작업을 실행하는 함수
 */
async function runCrawlers() {
  const startTime = Date.now();
  log('info', `크롤링 작업 시작...`);

  try {
    // 메인 크롤러 엔드포인트 호출
    const url = `${BASE_URL}/api/cron/crawler`;
    const queryParams = CRAWLER_SECRET_TOKEN
      ? `?token=${CRAWLER_SECRET_TOKEN}`
      : '';
    const fullUrl = `${url}${queryParams}`;

    const response = await fetchWithRetry(fullUrl);

    if (response.success) {
      const duration = Date.now() - startTime;
      log('info', `크롤링 성공 (${duration}ms)`, {
        totalCrawlers: response.data?.results?.total || 0,
        successful: response.data?.results?.successful || 0,
        failed: response.data?.results?.failed || 0,
      });
    } else {
      log('error', `크롤링 실패`, {
        error: response.error,
        details: response.details,
      });
    }
  } catch (error) {
    log('error', `크롤링 오류 발생`, {
      error: error.message,
      stack: error.stack,
    });
  }
}

// 크론 작업 스케줄 정의
const schedules = {
  // 기본 스케줄 (환경변수에서 가져옴)
  default: CRAWLER_SCHEDULE,

  // 서버 상태: 매 15분마다 체크 (서버 상태는 자주 변할 수 있음)
  serverStatus: process.env.CRAWLER_SCHEDULE_SERVERS || '*/15 * * * *',

  // 이벤트 데이터: 매일 00:30, 12:30에 체크 (이벤트는 하루에 한번 정도만 확인해도 충분)
  events: process.env.CRAWLER_SCHEDULE_EVENTS || '30 0,12 * * *',

  // 공지사항: 매 시간 10분에 체크 (새로운 공지사항은 적당한 빈도로 확인)
  announcements: process.env.CRAWLER_SCHEDULE_ANNOUNCEMENTS || '10 * * * *',
};

// 메인 크론 작업 등록
cron.schedule(schedules.default, async () => {
  log(
    'info',
    `[메인 크롤러] 크론 작업 스케줄에 따라 크롤링 시작 (${schedules.default})`,
    {
      nextRun: getNextRunTime(schedules.default),
    }
  );
  await runCrawlers();
});

// 서버 상태를 더 자주 체크하기 위한 설정
const serverCheckSettings = {
  // 일반 서버 상태 체크 스케줄 (15분마다)
  normalSchedule: schedules.serverStatus || '*/15 * * * *',

  // 점검 종료 임박 시 서버 상태 체크 스케줄 (10분마다)
  urgentSchedule: process.env.CRAWLER_SCHEDULE_SERVERS_URGENT || '*/10 * * * *',

  // 현재 활성화된 스케줄 작업
  activeServerCheckJob: null,

  // 현재 스케줄 모드 (normal 또는 urgent)
  currentMode: 'normal',
};

// 서버 상태 체크 스케줄 설정 함수
function setupServerStatusCheck(mode = 'normal') {
  const schedule =
    mode === 'urgent'
      ? serverCheckSettings.urgentSchedule
      : serverCheckSettings.normalSchedule;

  // 이미 실행 중인 작업이 있으면 중지
  if (serverCheckSettings.activeServerCheckJob) {
    serverCheckSettings.activeServerCheckJob.stop();
    log(
      'info',
      `기존 서버 상태 체크 작업 중지 (${serverCheckSettings.currentMode} 모드)`
    );
  }

  // 새 작업 시작
  serverCheckSettings.currentMode = mode;
  serverCheckSettings.activeServerCheckJob = cron.schedule(
    schedule,
    async () => {
      log('info', `[서버 상태 크롤러] 실행 (${schedule}) - ${mode} 모드`, {
        nextRun: getNextRunTime(schedule),
      });

      try {
        const url = `${BASE_URL}/api/cron/crawler/mabinogi/servers`;
        const queryParams = new URLSearchParams();

        // 토큰이 있으면 추가
        if (CRAWLER_SECRET_TOKEN) {
          queryParams.append('token', CRAWLER_SECRET_TOKEN);
        }

        // 점검 모니터링 모드 파라미터 추가
        queryParams.append('mode', mode);

        const fullUrl = `${url}?${queryParams.toString()}`;
        const response = await fetchWithRetry(fullUrl);

        log('info', `서버 상태 크롤링 완료`, {
          success: response.success,
          serverCount: response.data?.serverCount || 0,
          maintenanceStatus: response.data?.maintenanceStatus || 'none',
        });

        // 응답에 따라 스케줄 모드 조정
        if (
          response.data?.maintenanceStatus === 'ending-soon' &&
          mode !== 'urgent'
        ) {
          // 점검이 곧 끝나는 경우 urgent 모드로 변경
          log('info', `점검이 곧 종료됩니다. 체크 주기를 10분으로 변경합니다.`);
          setupServerStatusCheck('urgent');
        } else if (
          response.data?.maintenanceStatus === 'none' &&
          mode === 'urgent'
        ) {
          // 점검이 끝난 경우 normal 모드로 복귀
          log(
            'info',
            `점검이 종료되었습니다. 체크 주기를 정상으로 복귀합니다.`
          );
          setupServerStatusCheck('normal');
        }
      } catch (error) {
        log('error', `서버 상태 크롤링 오류`, { error: error.message });
      }
    }
  );

  log(
    'info',
    `서버 상태 체크 작업 설정 완료 (${mode} 모드, 스케줄: ${schedule})`
  );
}

// 서버 상태 체크 작업 시작 (기본 모드로 시작)
if (schedules.serverStatus !== schedules.default) {
  setupServerStatusCheck('normal');
}

/**
 * 다음 크론 실행 시간 계산
 * @param {string} cronExpression - 크론 표현식
 * @returns {string} - 다음 실행 시간 (ISO 문자열)
 */
function getNextRunTime(cronExpression) {
  try {
    const task = cron.schedule(cronExpression, () => {});
    const nextDate = task.nextDate();
    task.stop();
    return nextDate.toISOString();
  } catch (error) {
    return 'Unable to calculate next run time';
  }
}

// 서버 시작 시 로그 출력 및 첫 실행
log('info', `크롤러 스케줄러 시작됨`, {
  schedule: CRAWLER_SCHEDULE,
  baseUrl: BASE_URL,
  timeout: CRAWLER_TIMEOUT_MS,
  maxRetries: CRAWLER_MAX_RETRIES,
  nextRun: getNextRunTime(CRAWLER_SCHEDULE),
});

// 서버 시작 시 즉시 한 번 실행 (선택적)
// runCrawlers();
