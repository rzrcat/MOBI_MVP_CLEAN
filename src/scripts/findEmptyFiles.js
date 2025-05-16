/**
 * 빈 파일 검사 스크립트
 *
 * 프로젝트 내의 빈 파일(크기가 0인 파일)을 찾습니다.
 */
import fs from 'fs';
import { globSync } from 'glob';

// 파일 검사 디렉토리
const SCAN_DIRS = ['src'];
// 무시할 디렉토리/파일 패턴
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/build/**',
  '**/dist/**',
];

// 빈 파일 검사
function findEmptyFiles() {
  const emptyFiles = [];

  SCAN_DIRS.forEach((dir) => {
    const files = globSync(`${dir}/**/*.{ts,tsx,js,jsx,css,scss,json,md}`, {
      ignore: IGNORE_PATTERNS,
    });

    files.forEach((file) => {
      try {
        const stats = fs.statSync(file);

        // 빈 파일(크기가 0인 파일) 확인
        if (stats.size === 0) {
          emptyFiles.push(file);
        }
      } catch (error) {
        console.error(`파일 읽기 오류 (${file}): ${error.message}`);
      }
    });
  });

  return emptyFiles;
}

// 메인 함수
function main() {
  console.log('빈 파일 검사 중...');

  const emptyFiles = findEmptyFiles();

  if (emptyFiles.length > 0) {
    console.log(`총 ${emptyFiles.length}개의 빈 파일이 발견되었습니다:`);
    emptyFiles.forEach((file) => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('빈 파일이 없습니다. 👍');
  }
}

main();
