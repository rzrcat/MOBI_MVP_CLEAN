#!/usr/bin/env node

/**
 * 크롤러 테스트 스크립트
 *
 * 이 스크립트는 크롤러 기능을 독립적으로 테스트하기 위해 사용됩니다.
 * - 마비노기 서버 상태 및 이벤트 크롤링
 * - 결과를 콘솔에 출력
 *
 * 사용법: node test-crawler.js
 */

const axios = require('axios');
require('dotenv').config();

// 테스트 환경 설정
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const CRAWLER_SECRET_TOKEN = process.env.CRAWLER_SECRET_TOKEN || '';

// 색상 코드 (콘솔 출력용)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

/**
 * 콘솔 출력 유틸리티
 */
const log = {
  info: (message) =>
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message) =>
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  warn: (message) =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
  error: (message) =>
    console.log(`${colors.red}[ERROR]${colors.reset} ${message}`),
  json: (data) => console.log(JSON.stringify(data, null, 2)),
};

/**
 * API 호출 함수
 */
async function callAPI(endpoint, description) {
  log.info(`${description} 테스트 시작...`);
  const url = `${BASE_URL}${endpoint}`;
  const queryParams = CRAWLER_SECRET_TOKEN
    ? `?token=${CRAWLER_SECRET_TOKEN}`
    : '';
  const fullUrl = `${url}${queryParams}`;

  try {
    const startTime = Date.now();
    const response = await axios.get(fullUrl);
    const duration = Date.now() - startTime;

    log.success(`${description} 성공 (${duration}ms)`);
    console.log(`${colors.magenta}응답 데이터:${colors.reset}`);
    log.json(response.data);
    return response.data;
  } catch (error) {
    log.error(`${description} 실패: ${error.message}`);
    if (error.response) {
      console.log(
        `${colors.red}응답 상태:${colors.reset} ${error.response.status}`
      );
      console.log(`${colors.red}응답 데이터:${colors.reset}`);
      log.json(error.response.data);
    }
    return null;
  }
}

/**
 * 서버 상태 API 테스트
 */
async function testServerAPI() {
  return await callAPI('/api/games/mabinogi/servers', '서버 상태 API');
}

/**
 * 이벤트 API 테스트
 */
async function testEventAPI() {
  return await callAPI('/api/games/mabinogi/events', '이벤트 API');
}

/**
 * 크롤러 API 테스트
 */
async function testCrawlerAPI() {
  return await callAPI('/api/cron/crawler/mabinogi', '크롤러 API');
}

/**
 * 메인 테스트 함수
 */
async function runTests() {
  console.log(
    `${colors.blue}===== 마비노기 크롤러 시스템 테스트 =====\n${colors.reset}`
  );

  try {
    // 1. 현재 데이터 확인
    log.info('1. 현재 데이터 상태 확인\n');
    const currentServers = await testServerAPI();
    const currentEvents = await testEventAPI();
    console.log('\n');

    // 2. 크롤러 실행
    log.info('2. 크롤러 실행\n');
    const crawlerResult = await testCrawlerAPI();
    console.log('\n');

    // 3. 크롤링 후 데이터 확인
    log.info('3. 크롤링 후 데이터 상태 확인\n');
    const updatedServers = await testServerAPI();
    const updatedEvents = await testEventAPI();

    // 4. 결과 요약
    console.log(
      `\n${colors.blue}===== 테스트 결과 요약 =====\n${colors.reset}`
    );

    if (currentServers && updatedServers) {
      const serverCountBefore = Array.isArray(currentServers)
        ? currentServers.length
        : 0;
      const serverCountAfter = Array.isArray(updatedServers)
        ? updatedServers.length
        : 0;
      log.info(`서버 데이터: ${serverCountBefore} → ${serverCountAfter}`);
    }

    if (currentEvents && updatedEvents) {
      const eventCountBefore = Array.isArray(currentEvents)
        ? currentEvents.length
        : 0;
      const eventCountAfter = Array.isArray(updatedEvents)
        ? updatedEvents.length
        : 0;
      log.info(`이벤트 데이터: ${eventCountBefore} → ${eventCountAfter}`);
    }

    if (crawlerResult && crawlerResult.success) {
      log.success('크롤러 테스트 완료!');
    } else {
      log.warn('크롤러가 정상적으로 실행되지 않았을 수 있습니다.');
    }
  } catch (error) {
    log.error(`테스트 실행 중 오류 발생: ${error.message}`);
  }
}

// 스크립트 실행
runTests();
