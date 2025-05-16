/**
 * MMGG 웹사이트의 HTML 구조를 검사하는 스크립트
 *
 * 이 스크립트는 MMGG 웹사이트의 HTML을 가져와서 구조를 분석하고
 * 크롤링에 필요한 CSS 선택자를 찾는데 도움을 줍니다.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 검사할 URL 목록
const urls = [
  { name: 'main', url: 'https://mabinogimobile.nexon.com/Main' },
  { name: 'notice', url: 'https://mabinogimobile.nexon.com/News/Notice' },
  { name: 'events', url: 'https://mabinogimobile.nexon.com/News/Events' },
  { name: 'updates', url: 'https://mabinogimobile.nexon.com/News/Update' },
];

// HTML을 가져오는 함수
async function fetchHTML(url) {
  console.log(`Fetching ${url}...`);
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 30000, // 30초 타임아웃
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return null;
  }
}

// HTML 구조를 분석하는 함수
function analyzeHTMLStructure(html, page) {
  if (!html) return null;

  const $ = cheerio.load(html);

  // HTML 구조 저장 경로
  const saveDir = path.resolve(__dirname, '../../web_crawler/data');
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  // 전체 HTML 저장
  fs.writeFileSync(path.join(saveDir, `${page}_full.html`), html);

  // 주요 컨테이너 요소 찾기
  const containers = [];

  // 공통적으로 많이 사용되는 컨테이너 선택자
  const containerSelectors = [
    'div.container',
    'div.content',
    'div.main',
    'div.wrapper',
    'section',
    'article',
    'main',
    'div.board-list',
    'div.list',
    'ul.list',
    'div.news-list',
    'div.notice-list',
    'div.event-list',
    'div#content',
    'div.contents',
    'div.board',
  ];

  containerSelectors.forEach((selector) => {
    $(selector).each((i, el) => {
      const container = {
        selector,
        index: i,
        childCount: $(el).children().length,
        text:
          $(el).text().substring(0, 100).replace(/\\s+/g, ' ').trim() + '...',
        html: $(el).html().substring(0, 500) + '...',
      };
      containers.push(container);
    });
  });

  // 서버 정보 관련 요소 분석
  const serverInfo = {};
  if (page === 'main') {
    [
      'div.server-list',
      'div.server-status',
      'ul.server-list',
      'div.server-info',
      '.server-container',
    ].forEach((selector) => {
      if ($(selector).length) {
        serverInfo.selector = selector;
        serverInfo.count = $(selector).length;
        serverInfo.html = $(selector).html()?.substring(0, 500);
        serverInfo.items = [];

        $(selector)
          .find('li, .server-item, .server')
          .each((i, el) => {
            serverInfo.items.push({
              index: i,
              html: $(el).html()?.substring(0, 200),
              text: $(el).text().replace(/\\s+/g, ' ').trim(),
            });
          });
      }
    });
  }

  // 게시물 목록 분석
  const listItems = [];
  if (['notice', 'events', 'updates'].includes(page)) {
    [
      'li',
      '.item',
      '.post',
      '.article',
      '.board-item',
      '.news-item',
      '.event-item',
      '.notice-item',
      '.update-item',
    ].forEach((selector) => {
      if ($(selector).length > 5) {
        // 5개 이상 항목이 있어야 의미 있는 목록
        const samples = [];
        $(selector)
          .slice(0, 3)
          .each((i, el) => {
            samples.push({
              index: i,
              html: $(el).html()?.substring(0, 300),
              text: $(el).text().replace(/\\s+/g, ' ').trim(),
            });
          });

        listItems.push({
          selector,
          count: $(selector).length,
          samples,
        });
      }
    });
  }

  // 결과 저장
  const analysisResult = {
    url: urls.find((u) => u.name === page).url,
    timestamp: new Date().toISOString(),
    title: $('title').text(),
    containers,
    serverInfo: page === 'main' ? serverInfo : undefined,
    listItems: ['notice', 'events', 'updates'].includes(page)
      ? listItems
      : undefined,
  };

  fs.writeFileSync(
    path.join(saveDir, `${page}_structure.json`),
    JSON.stringify(analysisResult, null, 2)
  );

  return analysisResult;
}

// 메인 함수
async function main() {
  console.log('MMGG 웹사이트 HTML 구조 분석 시작...');

  for (const { name, url } of urls) {
    const html = await fetchHTML(url);
    if (html) {
      const analysis = analyzeHTMLStructure(html, name);
      if (analysis) {
        console.log(
          `✅ ${name} 페이지 분석 완료: ${path.resolve(__dirname, '../../web_crawler/data', `${name}_structure.json`)}`
        );
      } else {
        console.error(`❌ ${name} 페이지 분석 실패`);
      }
    }
  }

  console.log('모든 페이지 분석 완료!');
}

main().catch((err) => console.error('오류 발생:', err));
