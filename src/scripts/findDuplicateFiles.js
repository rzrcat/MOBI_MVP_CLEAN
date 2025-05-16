/**
 * 중복 파일 검사 스크립트
 *
 * 다음 항목을 검사합니다:
 * 1. 대소문자만 다른 중복 파일
 * 2. 동일한 내용을 가진 중복 파일
 */
import fs from 'fs';
import { globSync } from 'glob';
import crypto from 'crypto';

// 대소문자를 무시한 파일 경로 매핑
const caseInsensitivePathMap = new Map();
// 파일 내용 해시 기반 매핑 (동일 내용 파일 찾기)
const contentHashMap = new Map();

// 파일 검사 디렉토리
const SCAN_DIRS = ['src'];
// 무시할 디렉토리/파일 패턴
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/build/**',
  '**/dist/**',
];

// 파일 내용의 해시 생성
function getFileHash(filePath) {
  try {
    const stats = fs.statSync(filePath);

    // 빈 파일(크기가 0인 파일)은 건너뜁니다
    if (stats.size === 0) {
      return null;
    }

    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    console.error(`파일 읽기 오류 (${filePath}): ${error.message}`);
    return null;
  }
}

// 대소문자 차이만 있는 중복 파일 검사
function checkCaseSensitiveDuplicates() {
  let issues = 0;

  SCAN_DIRS.forEach((dir) => {
    const files = globSync(`${dir}/**/*.{ts,tsx,js,jsx,css,scss,json,md}`, {
      ignore: IGNORE_PATTERNS,
    });

    files.forEach((file) => {
      const lowerCasePath = file.toLowerCase();

      if (caseInsensitivePathMap.has(lowerCasePath)) {
        const existingPath = caseInsensitivePathMap.get(lowerCasePath);

        if (existingPath !== file) {
          console.error(`[대소문자 중복] 다음 파일들은 대소문자만 다릅니다:`);
          console.error(`  - ${existingPath}`);
          console.error(`  - ${file}`);
          issues++;
        }
      } else {
        caseInsensitivePathMap.set(lowerCasePath, file);
      }
    });
  });

  return issues;
}

// 내용이 동일한 중복 파일 검사
function checkContentDuplicates() {
  let issues = 0;

  SCAN_DIRS.forEach((dir) => {
    const files = globSync(`${dir}/**/*.{ts,tsx,js,jsx,css,scss}`, {
      ignore: IGNORE_PATTERNS,
    });

    files.forEach((file) => {
      const hash = getFileHash(file);

      if (hash) {
        if (contentHashMap.has(hash)) {
          const existingFiles = contentHashMap.get(hash);

          // 같은 파일이 아니라면 추가
          if (!existingFiles.includes(file)) {
            existingFiles.push(file);
          }
        } else {
          contentHashMap.set(hash, [file]);
        }
      }
    });
  });

  // 내용이 동일한 파일들 출력
  for (const files of contentHashMap.values()) {
    if (files.length > 1) {
      console.error(`[내용 중복] 다음 파일들은 내용이 동일합니다:`);
      files.forEach((file) => {
        console.error(`  - ${file}`);
      });
      issues++;
    }
  }

  return issues;
}

// 메인 함수
function main() {
  console.log('중복 파일 검사 중...');

  const caseSensitiveIssues = checkCaseSensitiveDuplicates();
  const contentIssues = checkContentDuplicates();

  const totalIssues = caseSensitiveIssues + contentIssues;

  if (totalIssues > 0) {
    console.error(`총 ${totalIssues}개의 중복 파일 문제가 발견되었습니다.`);
    process.exit(1);
  } else {
    console.log('중복 파일이 없습니다. 👍');
  }
}

main();
