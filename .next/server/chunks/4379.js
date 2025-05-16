"use strict";
exports.id = 4379;
exports.ids = [4379];
exports.modules = {

/***/ 54379:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S3: () => (/* binding */ handleError),
/* harmony export */   WR: () => (/* binding */ validateCrawledData),
/* harmony export */   cM: () => (/* binding */ log),
/* harmony export */   "in": () => (/* binding */ LogLevel),
/* harmony export */   rg: () => (/* binding */ parseHTML)
/* harmony export */ });
/* unused harmony export getFormattedTime */
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78257);

var LogLevel;
(function(LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
// 환경변수 설정
// const CRAWLER_TIMEOUT_MS = Number(process.env.CRAWLER_TIMEOUT_MS || '30000');
// const CRAWLER_MAX_RETRIES = Number(process.env.CRAWLER_MAX_RETRIES || '3');
const CRAWLER_LOG_LEVEL = process.env.CRAWLER_LOG_LEVEL || "info";
// const CRAWLER_SLACK_WEBHOOK = process.env.CRAWLER_SLACK_WEBHOOK;
// 로그 레벨에 따라 로그를 출력하는 함수
function log(level, message, details) {
    // 현재 설정된 로그 레벨보다 낮은 레벨은 무시
    const logLevelPriority = {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 1,
        [LogLevel.WARN]: 2,
        [LogLevel.ERROR]: 3
    };
    if (logLevelPriority[level] < logLevelPriority[CRAWLER_LOG_LEVEL]) {
        return;
    }
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    switch(level){
        case LogLevel.DEBUG:
            ;
            break;
        case LogLevel.INFO:
            ;
            break;
        case LogLevel.WARN:
            ;
            break;
        case LogLevel.ERROR:
            ;
            break;
    }
}
/**
 * Slack으로 알림을 보내는 함수
 */ // async function sendSlackAlert(
//   message: string,
//   details?: unknown
// ): Promise<void> {
//   if (!CRAWLER_SLACK_WEBHOOK) return;
//
//   try {
//     await axiosInstance.post(CRAWLER_SLACK_WEBHOOK, {
//       text: `🚨 *크롤러 오류 알림*\n*메시지*: ${message}\n*상세*: ${JSON.stringify(
//         details
//       )}`,
//     });
//   } catch (error) {
//     console.error('Failed to send Slack alert:', error);
//   }
// }
/**
 * 재시도 메커니즘이 포함된 HTML 가져오기 함수
 * @param {string} url - 가져올 URL
 * @param {AxiosRequestConfig} [options] - axios 요청 옵션
 * @param {number} [retries=CRAWLER_MAX_RETRIES] - 최대 재시도 횟수
 * @returns {Promise<APIResponse<string>>} - HTML 콘텐츠
 */ // export async function fetchHTML(
//   url: string,
//   options?: AxiosRequestConfig,
//   retries = CRAWLER_MAX_RETRIES
// ): Promise<APIResponse<string>> {
//   try {
//     log(LogLevel.DEBUG, `Fetching HTML from ${url}`);
//
//     // 다양한 브라우저 User-Agent를 사용하여 크롤링 차단 방지
//     const userAgents = [
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
//       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
//     ];
//
//     // 랜덤하게 User-Agent 선택
//     const randomUserAgent =
//       userAgents[Math.floor(Math.random() * userAgents.length)];
//
//     const response = await axiosInstance.get<string>(url, {
//       timeout: CRAWLER_TIMEOUT_MS,
//       headers: {
//         'User-Agent': randomUserAgent,
//         Accept: 'text/html,application/xhtml+xml,application/xml',
//         'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
//         ...options?.headers,
//       },
//       ...options,
//     });
//
//     // 응답 코드가 200이 아닌 경우 처리
//     if (response.status !== 200) {
//       throw new Error(`Unexpected status code: ${response.status}`);
//     }
//
//     // 응답 데이터가 비어있거나 HTML이 아닌 경우 처리
//     if (
//       !response.data ||
//       (typeof response.data === 'string' && response.data.trim().length === 0)
//     ) {
//       throw new Error('Empty response data');
//     }
//
//     log(LogLevel.DEBUG, `Successfully fetched HTML from ${url}`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     const axiosError = error as AxiosError;
//
//     if (retries > 0) {
//       // 지수 백오프 + 약간의 무작위성 (jitter) 추가
//       const baseDelay = Math.pow(2, CRAWLER_MAX_RETRIES - retries) * 1000;
//       const jitter = Math.random() * 1000; // 0~1000ms 랜덤 지연 추가
//       const retryDelay = baseDelay + jitter;
//
//       log(
//         LogLevel.WARN,
//         `Error fetching ${url}, retrying in ${Math.round(
//           retryDelay
//         )}ms (${retries} retries left)`,
//         {
//           status: axiosError.response?.status,
//           message: axiosError.message,
//         }
//       );
//
//       await new Promise((resolve) => setTimeout(resolve, retryDelay));
//       return fetchHTML(url, options, retries - 1);
//     }
//
//     log(
//       LogLevel.ERROR,
//       `Failed to fetch ${url} after ${CRAWLER_MAX_RETRIES} retries`,
//       {
//         status: axiosError.response?.status,
//         message: axiosError.message,
//       }
//     );
//
//     return { success: false, data: '', error: axiosError.message };
//   }
// }
/**
 * Parses HTML content and returns a Cheerio instance.
 * @param {string} html - The HTML content to parse.
 * @returns {ReturnType<typeof cheerioLoad>} - The Cheerio instance.
 */ function parseHTML(html) {
    try {
        return (0,cheerio__WEBPACK_IMPORTED_MODULE_0__/* .load */ .zD)(html);
    } catch  {
        // 에러 로깅
        log(LogLevel.ERROR, "Error parsing HTML", {
            html
        });
        throw new Error("Error parsing HTML");
    }
}
/**
 * 에러 처리 및 로깅 함수
 * @param {unknown} error - 처리할 에러
 * @param {string} context - 에러가 발생한 컨텍스트
 * @param {boolean} [rethrow=true] - 에러를 다시 던질지 여부
 * @returns {Error} - 처리된 Error 객체
 */ function handleError(error, context, rethrow = true) {
    // 에러 객체 정규화
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    // 에러 세부 정보 수집
    const details = {
        context,
        timestamp: new Date().toISOString(),
        ...normalizedError.stack ? {
            stack: normalizedError.stack.split("\n").slice(0, 5)
        } : {},
        ...normalizedError.cause ? {
            cause: String(normalizedError.cause)
        } : {}
    };
    // 에러 로깅
    log(LogLevel.ERROR, `${context}: ${normalizedError.message}`, details);
    // 슬랙 웹훅이 설정되어 있을 경우 심각한 에러 알림 전송
    try {
        if (process.env.CRAWLER_SLACK_WEBHOOK && normalizedError.message.includes("critical")) {
        // sendSlackAlert(`Critical error in ${context}`, details).catch((err) =>
        //   console.error('Failed to send Slack alert:', err)
        // );
        }
    } catch  {
    // 슬랙 알림 실패 시에도 원래 에러 처리 흐름은 계속 진행
    // console.error('Failed to send alert:', slackError);
    }
    // 설정에 따라 에러를 다시 던짐
    if (rethrow) {
        throw normalizedError;
    }
    return normalizedError;
}
/**
 * 크롤링한 데이터의 유효성을 검사하는 함수
 * @param {unknown} data - 검사할 데이터
 * @param {string} expectedType - 기대하는 데이터 타입
 * @param {string} context - 컨텍스트 정보
 * @param {Object} [options] - 추가 검증 옵션
 * @param {number} [options.minArrayLength] - 배열의 최소 길이
 * @param {Function} [options.customValidator] - 사용자 정의 검증 함수
 * @returns {boolean} - 유효성 여부
 */ function validateCrawledData(data, expectedType, context, options = {}) {
    const { minArrayLength = 0, customValidator } = options;
    // 데이터가 비어있는지 확인
    if (data === null || data === undefined) {
        log(LogLevel.ERROR, `${context}: 데이터가 비어 있습니다.`, {
            data
        });
        return false;
    }
    // 배열 타입 검사
    if (Array.isArray(data) && expectedType === "array") {
        if (data.length === 0) {
            log(LogLevel.WARN, `${context}: 빈 배열이 반환됨`, {
                data
            });
            return false;
        }
        // 최소 배열 길이 검사
        if (minArrayLength > 0 && data.length < minArrayLength) {
            log(LogLevel.WARN, `${context}: 배열 길이가 너무 짧습니다. 필요: ${minArrayLength}, 실제: ${data.length}`, {
                data
            });
            return false;
        }
        // 사용자 정의 검증 함수 실행
        if (customValidator && !customValidator(data)) {
            log(LogLevel.ERROR, `${context}: 사용자 정의 유효성 검사 실패`, {
                data
            });
            return false;
        }
        return true;
    }
    // 타입 검사
    if (typeof data !== expectedType) {
        log(LogLevel.ERROR, `${context}: 유효하지 않은 데이터 타입, 필요: ${expectedType}, 실제: ${typeof data}`, {
            data
        });
        return false;
    }
    // 사용자 정의 검증 함수 실행
    if (customValidator && !customValidator(data)) {
        log(LogLevel.ERROR, `${context}: 사용자 정의 유효성 검사 실패`, {
            data
        });
        return false;
    }
    return true;
}
/**
 * 현재 시간을 로그 형식으로 반환하는 함수
 * @returns {string} - 형식화된 현재 시간
 */ function getFormattedTime() {
    return new Date().toISOString();
}


/***/ })

};
;