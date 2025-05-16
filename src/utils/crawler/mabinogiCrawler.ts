import {
  fetchHTML,
  parseHTML,
  handleError,
  validateCrawledData,
  log,
  LogLevel,
} from './crawlerUtils';
import type { CheerioAPI, Cheerio, CheerioElement, Element } from 'cheerio';
import {
  GameServer,
  GameEvent,
  ServerStatus as ServerStatusType,
  EventCategory,
} from '@/types/games/mabinogi_mobile/index';

/**
 * 서버 상태 문자열을 ServerStatusType으로 변환
 */
export function mapServerStatus(statusText: string): ServerStatusType {
  statusText = statusText.toLowerCase().trim();

  if (statusText.includes('점검') || statusText.includes('maintenance')) {
    return 'maintenance';
  } else if (
    statusText.includes('혼잡') ||
    statusText.includes('crowded') ||
    statusText.includes('busy')
  ) {
    return 'crowded';
  } else if (statusText.includes('바쁨') || statusText.includes('busy')) {
    return 'busy';
  }

  return 'online';
}

/**
 * 공지사항에서 서버 점검 관련 정보를 확인하고 추출하는 함수
 * @param announcements - 공지사항 목록
 * @returns {{isUnderMaintenance: boolean, maintenanceInfo: {message: string, endTime: Date | null}}}
 */
function checkMaintenanceFromAnnouncements(announcements: Announcement[]): {
  isUnderMaintenance: boolean;
  maintenanceInfo: {
    message: string;
    endTime: Date | null;
    startTime: Date | null;
  };
} {
  const context = 'checkMaintenanceFromAnnouncements';

  // 기본 반환 값
  const defaultResult = {
    isUnderMaintenance: false,
    maintenanceInfo: {
      message: '',
      endTime: null,
      startTime: null,
    },
  };

  if (!announcements || announcements.length === 0) {
    log(LogLevel.DEBUG, `${context}: 공지사항이 없습니다.`);
    return defaultResult;
  }

  // 점검 관련 키워드 패턴
  const maintenanceKeywords =
    /점검|maintenance|서버|server|업데이트|update|패치|patch/i;

  // 최근 1주일 이내의 점검 공지만 고려
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // 점검 관련 공지 필터링
  const maintenanceNotices = announcements.filter((notice) => {
    // 제목에 점검 관련 키워드가 포함되어 있고
    const hasMaintKeyword = maintenanceKeywords.test(notice.title);
    // 날짜가 최근 1주일 이내인지 확인
    const isRecent = new Date(notice.date) > oneWeekAgo;

    return hasMaintKeyword && isRecent;
  });

  if (maintenanceNotices.length === 0) {
    log(LogLevel.DEBUG, `${context}: 점검 관련 공지사항이 없습니다.`);
    return defaultResult;
  }

  // 가장 최근 점검 공지를 기준으로 함
  const latestMaintNotice = maintenanceNotices.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  log(LogLevel.INFO, `${context}: 점검 관련 공지사항 발견`, {
    title: latestMaintNotice.title,
    date: latestMaintNotice.date,
  });

  // 점검 시간 패턴 (다양한 형태를 지원)
  const maintenanceTimePatterns = [
    // "YYYY년 MM월 DD일 HH시 MM분 ~ HH시 MM분"
    /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2})시\s*(\d{1,2})분\s*(?:~|부터)\s*(\d{1,2})시\s*(\d{1,2})분/,
    // "YYYY-MM-DD HH:MM ~ HH:MM"
    /(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{1,2})\s*(?:~|부터)\s*(\d{1,2}):(\d{1,2})/,
    // "MM월 DD일 HH:MM ~ HH:MM"
    /(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2}):(\d{1,2})\s*(?:~|부터)\s*(\d{1,2}):(\d{1,2})/,
    // "HH시 MM분 ~ HH시 MM분"
    /(\d{1,2})시\s*(\d{1,2})분\s*(?:~|부터)\s*(\d{1,2})시\s*(\d{1,2})분/,
  ];

  // 현재 시간
  const now = new Date();

  // 점검 종료 시간 추출 시도
  let endTime: Date | null = null;
  let startTime: Date | null = null;
  let maintenanceMessage = latestMaintNotice.title;
  let isUnderMaintenance = false;

  try {
    // 점검 공지 내용 가져오기 (여기서는 제목만 사용, 추후 내용도 크롤링 가능)
    const title = latestMaintNotice.title;

    // 다양한 패턴으로 시간 추출 시도
    for (const pattern of maintenanceTimePatterns) {
      const match = title.match(pattern);

      if (match) {
        // 패턴에 따라 다른 방식으로 시간 파싱
        if (match.length >= 8) {
          // YYYY년 MM월 DD일 HH시 MM분 ~ HH시 MM분 패턴
          const year = parseInt(match[1]);
          const month = parseInt(match[2]) - 1;
          const day = parseInt(match[3]);
          const startHour = parseInt(match[4]);
          const startMinute = parseInt(match[5]);
          const endHour = parseInt(match[6]);
          const endMinute = parseInt(match[7]);

          startTime = new Date(year, month, day, startHour, startMinute);
          endTime = new Date(year, month, day, endHour, endMinute);

          // 종료 시간이 시작 시간보다 이전이면 다음 날로 설정
          if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
          }
        } else if (match.length >= 7) {
          // YYYY-MM-DD HH:MM ~ HH:MM 패턴
          const year = parseInt(match[1]);
          const month = parseInt(match[2]) - 1;
          const day = parseInt(match[3]);
          const startHour = parseInt(match[4]);
          const startMinute = parseInt(match[5]);
          const endHour = parseInt(match[6]);
          const endMinute = parseInt(match[7]);

          startTime = new Date(year, month, day, startHour, startMinute);
          endTime = new Date(year, month, day, endHour, endMinute);

          // 종료 시간이 시작 시간보다 이전이면 다음 날로 설정
          if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
          }
        } else if (match.length >= 6) {
          // MM월 DD일 HH:MM ~ HH:MM 패턴
          const month = parseInt(match[1]) - 1;
          const day = parseInt(match[2]);
          const startHour = parseInt(match[3]);
          const startMinute = parseInt(match[4]);
          const endHour = parseInt(match[5]);
          const endMinute = parseInt(match[6]);

          // 연도는 현재 연도 사용
          const year = now.getFullYear();

          startTime = new Date(year, month, day, startHour, startMinute);
          endTime = new Date(year, month, day, endHour, endMinute);

          // 종료 시간이 시작 시간보다 이전이면 다음 날로 설정
          if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
          }
        } else if (match.length >= 4) {
          // HH시 MM분 ~ HH시 MM분 패턴
          const startHour = parseInt(match[1]);
          const startMinute = parseInt(match[2]);
          const endHour = parseInt(match[3]);
          const endMinute = parseInt(match[4]);

          // 연/월/일은 최신 공지 날짜 또는 현재 날짜 사용
          const noticeDate = new Date(latestMaintNotice.date);

          startTime = new Date(
            noticeDate.getFullYear(),
            noticeDate.getMonth(),
            noticeDate.getDate(),
            startHour,
            startMinute
          );

          endTime = new Date(
            noticeDate.getFullYear(),
            noticeDate.getMonth(),
            noticeDate.getDate(),
            endHour,
            endMinute
          );

          // 종료 시간이 시작 시간보다 이전이면 다음 날로 설정
          if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
          }
        }

        // 유효한 시간 추출됨
        log(LogLevel.INFO, `${context}: 점검 시간 추출 성공`, {
          startTime: startTime?.toISOString(),
          endTime: endTime?.toISOString(),
          now: now.toISOString(),
        });

        break;
      }
    }

    // 추출된 시간이 있고, 현재가 점검 시간 내라면 점검 중으로 판단
    if (startTime && endTime) {
      isUnderMaintenance = now >= startTime && now <= endTime;

      // 종료 시간이 과거인데 너무 오래되지 않았으면(1일 이내), 점검이 연장된 것으로 판단
      if (
        now > endTime &&
        now.getTime() - endTime.getTime() < 24 * 60 * 60 * 1000
      ) {
        isUnderMaintenance = true;
        maintenanceMessage = `${maintenanceMessage} (예상보다 연장됨)`;
      }

      // 시작 시간이 미래면 예정된 점검
      if (now < startTime) {
        isUnderMaintenance = false;
        maintenanceMessage = `예정된 점검: ${maintenanceMessage}`;
      }
    }
  } catch (error) {
    log(LogLevel.WARN, `${context}: 점검 시간 추출 실패`, { error });
  }

  return {
    isUnderMaintenance,
    maintenanceInfo: {
      message: maintenanceMessage,
      endTime,
      startTime,
    },
  };
}

/**
 * 마비노기 모바일 서버 상태를 조회하는 함수
 * @returns {Promise<GameServer[]>} - 서버 상태 목록
 */
export async function fetchServerStatuses(): Promise<GameServer[]> {
  const context = 'fetchServerStatuses';
  log(LogLevel.INFO, `${context}: 마비노기 모바일 서버 상태 조회 시작`);

  try {
    // 기본 서버 데이터 가져오기 (기본적으로는 온라인 상태로 가정)
    let servers = getMockServers();

    // 서버 데이터에서 점검 상태 제거 (모든 서버가 온라인 상태라고 가정)
    servers = servers.map((server) => ({
      ...server,
      status: 'online',
      population: server.status === 'maintenance' ? 30 : server.population,
      maintenanceMessage: undefined,
      maintenanceEndTime: undefined,
    }));

    // 공지사항을 확인하여 점검 정보 확인
    const announcements = await fetchAnnouncements();
    const { isUnderMaintenance, maintenanceInfo } =
      checkMaintenanceFromAnnouncements(announcements);

    // 점검 중이라면 모든 서버를 점검 상태로 변경
    if (isUnderMaintenance) {
      log(LogLevel.INFO, `${context}: 현재 서버 점검 중`, {
        message: maintenanceInfo.message,
        endTime: maintenanceInfo.endTime?.toISOString(),
      });

      servers = servers.map((server) => ({
        ...server,
        status: 'maintenance' as ServerStatusType,
        population: 0,
        maintenanceMessage: maintenanceInfo.message,
        maintenanceEndTime: maintenanceInfo.endTime?.toISOString(),
      }));

      // 점검 종료가 2시간 이내인 경우, 10분마다 확인하도록 스케줄링 플래그 설정
      if (maintenanceInfo.endTime) {
        const timeUntilEnd =
          maintenanceInfo.endTime.getTime() - new Date().getTime();
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        if (timeUntilEnd > 0 && timeUntilEnd <= twoHoursInMs) {
          // 전역 상태 또는 환경 변수에 저장하여 스케줄러에서 참고하도록 함
          log(
            LogLevel.INFO,
            `${context}: 점검 종료가 2시간 이내입니다. 모니터링 주기를 10분으로 설정합니다.`,
            { timeUntilEnd: timeUntilEnd / (60 * 1000) + '분' }
          );

          // 여기서는 로그만 남기고, 실제 스케줄링 로직은 crawlerCron.js에서 처리해야 함
          // 필요하다면 DB나 파일에 스케줄링 정보를 저장해서 crawlerCron.js에서 읽을 수 있게 함
        }
      }
    } else {
      log(LogLevel.INFO, `${context}: 서버는 정상 운영 중입니다.`);
    }

    return servers;
  } catch (error) {
    log(LogLevel.ERROR, `${context}: 서버 상태 조회 중 오류 발생`, { error });
    return getMockServers();
  }
}

/**
 * 마비노기 모바일 이벤트 정보를 크롤링하는 함수
 * @returns {Promise<GameEvent[]>} - 이벤트 목록
 */
export async function fetchGameEvents(): Promise<GameEvent[]> {
  const context = 'fetchGameEvents';
  log(LogLevel.INFO, `${context}: 마비노기 모바일 이벤트 크롤링 시작`);

  try {
    const url = 'https://mabinogimobile.nexon.com/News/Events';
    const html = await fetchHTML(url);

    if (!html || typeof html !== 'string') {
      throw new Error('Invalid HTML content received');
    }

    const $: CheerioAPI = parseHTML(html);

    const events: GameEvent[] = [];

    // 마비노기 모바일 이벤트 추출 - HTML 구조 분석 결과에 따른 최적화된 선택자 사용
    // 웹사이트 구조가 변경될 경우 이 부분을 업데이트해야 함
    const eventListContainer = $('.board-list ul.list, .event-list ul.list');

    if (eventListContainer.length === 0) {
      log(
        LogLevel.WARN,
        `${context}: 이벤트 목록 컨테이너를 찾을 수 없습니다.`
      );
      throw new Error('Event list container not found');
    }

    eventListContainer
      .find('li.item, li.post, li.board-item')
      .each((_: number, element: Element) => {
        try {
          const $element = $(element);

          // 필요한 정보 추출 (여러 가능한 선택자 시도)
          const title = $element
            .find('a.title, .title > a, .subject > a, .post-title')
            .text()
            .trim();
          const dateText = $element
            .find('.date, .period, .event-period, .datetime')
            .text()
            .trim();
          const link =
            $element
              .find('a.title, .title > a, .subject > a, .post-title')
              .attr('href') || '';
          // 이미지가 다양한 구조로 존재할 수 있음
          const imageUrl =
            $element
              .find('.thumbnail img, .image img, .thumb img, img.thumbnail')
              .attr('src') || '';

          // 제목이 비어있으면 유효하지 않은 항목으로 간주
          if (!title) {
            return;
          }

          // 상대 경로가 있을 경우 절대 경로로 변환
          const fullLink = link.startsWith('http')
            ? link
            : `https://mabinogimobile.nexon.com${link}`;

          // 날짜 파싱 - 다양한 형식 지원
          let startDate = new Date();
          let endDate = new Date();

          try {
            // 여러 가능한 날짜 형식 처리
            const dateRegexPatterns = [
              /(\d{4}\.\d{2}\.\d{2})\s*~\s*(\d{4}\.\d{2}\.\d{2})/, // YYYY.MM.DD ~ YYYY.MM.DD
              /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD ~ YYYY-MM-DD
              /(\d{4}\.\d{2}\.\d{2})/, // YYYY.MM.DD (단일 날짜)
            ];

            let matched = false;

            for (const pattern of dateRegexPatterns) {
              const match = dateText.match(pattern);
              if (match) {
                if (match.length >= 3) {
                  // 시작일과 종료일이 모두 있는 경우
                  startDate = new Date(match[1].replace(/\./g, '-'));
                  endDate = new Date(match[2].replace(/\./g, '-'));
                } else {
                  // 단일 날짜인 경우 시작일로 설정하고 종료일은 한 달 뒤로 설정
                  startDate = new Date(match[1].replace(/\./g, '-'));
                  endDate = new Date(startDate);
                  endDate.setMonth(endDate.getMonth() + 1);
                }
                matched = true;
                break;
              }
            }

            // 어떤 패턴도 매치되지 않으면 현재 날짜와 한 달 후를 사용
            if (!matched) {
              startDate = new Date();
              endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);
              log(
                LogLevel.WARN,
                `${context}: 날짜 형식을 인식할 수 없음. 기본값 사용`,
                { dateText }
              );
            }
          } catch (dateError) {
            log(LogLevel.WARN, `${context}: 날짜 파싱 실패`, {
              dateText,
              error: dateError,
            });
          }

          // 이벤트 설명
          const description =
            $element
              .find('.description, .event-description, .contents, .summary')
              .text()
              .trim() || `${title}에 참여하고 특별한 보상을 얻으세요!`;

          // 카테고리 추측 (제목과 설명 기반)
          let category: EventCategory = 'general';
          if (
            title.includes('업데이트') ||
            title.includes('패치') ||
            title.includes('변경') ||
            title.includes('신규')
          ) {
            category = 'update';
          } else if (
            title.includes('보너스') ||
            title.includes('혜택') ||
            title.includes('2배') ||
            title.includes('특별')
          ) {
            category = 'bonus';
          } else if (
            title.includes('커뮤니티') ||
            title.includes('대회') ||
            title.includes('이벤트')
          ) {
            category = 'community';
          }

          // 보상 정보 (없으면 빈 배열)
          let rewards: string[] = [];
          const rewardText = $(element).find('.event-rewards').text().trim();
          if (rewardText) {
            rewards = rewardText.split(',').map((item: string) => item.trim());
          }

          const event: GameEvent = {
            id: `mabi-event-${title.substring(0, 10)}-${Date.now()}`,
            title,
            description,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            url: fullLink,
            imageUrl: imageUrl.startsWith('http')
              ? imageUrl
              : `https://mabinogimobile.nexon.com${imageUrl}`,
            category,
            rewards,
            isSpecial: title.includes('특별') || title.includes('스페셜'),
          };

          events.push(event);
        } catch (elementError) {
          log(
            LogLevel.WARN,
            `${context}: 이벤트 요소 처리 중 오류 발생`,
            elementError
          );
        }
      });

    // 크롤링한 데이터 유효성 검사
    if (!validateCrawledData(events, 'array', context)) {
      log(
        LogLevel.WARN,
        `${context}: 유효한 이벤트 데이터를 찾지 못했습니다. 목업 데이터를 사용합니다.`
      );
      return getMockEvents();
    }

    log(
      LogLevel.INFO,
      `${context}: 성공적으로 ${events.length}개의 이벤트를 가져왔습니다.`
    );
    return events;
  } catch (error) {
    handleError(error, context, false);
    log(
      LogLevel.WARN,
      `${context}: 이벤트 크롤링 실패, 목업 데이터를 사용합니다.`,
      error
    );
    return getMockEvents();
  }
}

/**
 * 마비노기 모바일 공지사항을 크롤링하는 함수
 * @returns {Promise<Announcement[]>} - 공지사항 목록
 */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const context = 'fetchAnnouncements';
  log(LogLevel.INFO, `${context}: 마비노기 모바일 공지사항 크롤링 시작`);

  try {
    const url = 'https://mabinogimobile.nexon.com/News/Notice';
    const html = await fetchHTML(url);

    if (!html || typeof html !== 'string') {
      throw new Error('Invalid HTML content received');
    }

    const $: CheerioAPI = parseHTML(html);

    const announcements: Announcement[] = [];

    // 마비노기 모바일 공지사항 추출 - HTML 구조 분석 결과에 따른 최적화된 선택자 사용
    const noticeListContainer = $(
      '.board-list ul.list, .notice-list ul.list, .news-list ul.list'
    );

    if (noticeListContainer.length === 0) {
      log(
        LogLevel.WARN,
        `${context}: 공지사항 목록 컨테이너를 찾을 수 없습니다.`
      );
      // 빈 배열 반환 (에러처리 개선)
      return [];
    }

    noticeListContainer
      .find('li.item, li.post, li.board-item, li.notice-item')
      .each((_: number, element: Element) => {
        try {
          const $element = $(element);

          // 필요한 정보 추출 (여러 가능한 선택자 시도)
          const title = $element
            .find('a.title, .title > a, .subject > a, .post-title')
            .text()
            .trim();
          const dateText = $element
            .find('.date, .datetime, .post-date')
            .text()
            .trim();
          const link =
            $element
              .find('a.title, .title > a, .subject > a, .post-title')
              .attr('href') || '';

          // 제목이 비어있으면 유효하지 않은 항목으로 간주
          if (!title) {
            return;
          }

          // 상대 경로가 있을 경우 절대 경로로 변환
          const fullLink = link.startsWith('http')
            ? link
            : `https://mabinogimobile.nexon.com${link}`;

          // 날짜 파싱 - 다양한 형식 지원
          let date = new Date();
          try {
            // 여러 가능한 날짜 형식 처리
            const dateRegexPatterns = [
              /(\d{4}\.\d{2}\.\d{2})/, // YYYY.MM.DD
              /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
              /(\d{2}\.\d{2}\.\d{4})/, // DD.MM.YYYY
              /(\d{2}-\d{2}-\d{4})/, // DD-MM-YYYY
            ];

            let matched = false;

            for (const pattern of dateRegexPatterns) {
              const match = dateText.match(pattern);
              if (match) {
                const dateParts = match[1].split(/[-\.]/);

                // 날짜 형식에 따라 파싱 방법 조정
                if (dateParts[0].length === 4) {
                  // YYYY-MM-DD 또는 YYYY.MM.DD 형식
                  date = new Date(
                    `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
                  );
                } else {
                  // DD-MM-YYYY 또는 DD.MM.YYYY 형식
                  date = new Date(
                    `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
                  );
                }

                // 날짜가 유효한지 확인
                if (isNaN(date.getTime())) {
                  throw new Error('Invalid date');
                }

                matched = true;
                break;
              }
            }

            // 어떤 패턴도 매치되지 않으면 현재 날짜 사용
            if (!matched) {
              log(
                LogLevel.WARN,
                `${context}: 날짜 형식을 인식할 수 없음. 현재 날짜 사용`,
                { dateText }
              );
            }
          } catch (dateError) {
            log(LogLevel.WARN, `${context}: 날짜 파싱 실패`, {
              dateText,
              error: dateError,
            });
          }

          // 유효한 공지사항만 추가
          announcements.push({
            title,
            date: date.toISOString(),
            link: fullLink,
          });
        } catch (elementError) {
          log(
            LogLevel.WARN,
            `${context}: 공지사항 요소 처리 중 오류 발생`,
            elementError
          );
        }
      });

    log(
      LogLevel.INFO,
      `${context}: 성공적으로 ${announcements.length}개의 공지사항을 가져왔습니다.`
    );
    return announcements;
  } catch (error) {
    handleError(error, context, false);
    log(
      LogLevel.WARN,
      `${context}: 공지사항 크롤링 실패, 빈 배열을 반환합니다.`,
      error
    );
    return [];
  }
}

/**
 * 모의 서버 데이터 생성
 */
function getMockServers(): GameServer[] {
  log(LogLevel.DEBUG, 'Creating mock server data');

  return [
    {
      id: '1',
      name: '서버 1',
      status: 'online',
      population: 30,
      region: '아시아',
      lastChecked: new Date().toISOString(),
    },
    {
      id: '2',
      name: '서버 2',
      status: 'online',
      population: 65,
      region: '아시아',
      lastChecked: new Date().toISOString(),
    },
    {
      id: '3',
      name: '서버 3',
      status: 'busy',
      population: 75,
      region: '아시아',
      lastChecked: new Date().toISOString(),
    },
    {
      id: '4',
      name: '서버 4',
      status: 'crowded',
      population: 95,
      region: '아시아',
      lastChecked: new Date().toISOString(),
    },
    {
      id: '5',
      name: '서버 5',
      status: 'maintenance',
      population: 0,
      region: '아시아',
      maintenanceMessage: '서버 점검 중입니다. 곧 서비스가 재개됩니다.',
      maintenanceEndTime: new Date(
        new Date().getTime() + 2 * 60 * 60 * 1000
      ).toISOString(),
      lastChecked: new Date().toISOString(),
    },
  ];
}

/**
 * 모의 이벤트 데이터 생성
 */
function getMockEvents(): GameEvent[] {
  log(LogLevel.DEBUG, 'Creating mock event data');

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      title: '마비노기 모바일 런칭 기념 이벤트',
      description:
        '마비노기 모바일 런칭을 기념하여 특별한 아이템과 보상을 지급합니다. 접속만 해도 다양한 혜택을 받을 수 있습니다!',
      startDate: yesterday.toISOString(),
      endDate: nextWeek.toISOString(),
      imageUrl: 'https://via.placeholder.com/300x150?text=런칭+기념+이벤트',
      url: 'https://mabinogimobile.nexon.com/News/Events',
      rewards: [
        '런칭 기념 코스튬',
        '전설 등급 장비 선택권',
        '펫 알',
        '프리미엄 이용권 (14일)',
      ],
      isSpecial: true,
      category: 'update',
    },
    {
      id: '2',
      title: '시즌 1 신규 콘텐츠 오픈',
      description:
        '시즌 1 신규 콘텐츠가 오픈되었습니다. 신규 지역과 보스에 도전하고 다양한 보상을 획득하세요!',
      startDate: today.toISOString(),
      endDate: nextMonth.toISOString(),
      imageUrl: 'https://via.placeholder.com/300x150?text=시즌1+콘텐츠',
      rewards: ['시즌1 전용 무기', '한정판 탈것', '고급 장신구 세트'],
      category: 'general',
      isSpecial: false,
    },
    {
      id: '3',
      title: '주간 경험치 및 드롭률 2배',
      description:
        '주간 이벤트 기간 동안 모든 지역에서 경험치와 아이템 드롭률이 2배로 상승합니다.',
      startDate: yesterday.toISOString(),
      endDate: new Date(
        today.getTime() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      rewards: ['경험치 2배', '드롭률 2배', '골드 획득량 50% 증가'],
      category: 'bonus',
      isSpecial: false,
    },
  ];
}

// 공지사항 타입 정의
export interface Announcement {
  title: string;
  date: string;
  link: string;
}
