/**
 * 빈 파일 삭제 스크립트
 *
 * 프로젝트 내의 빈 파일(크기가 0인 파일)을 찾아 삭제합니다.
 */
import fs from 'fs';
import { globSync } from 'glob';
import readline from 'readline';

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

// 사용자 입력 처리
async function getUserConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// 빈 파일 삭제
async function removeEmptyFiles(emptyFiles) {
  console.log(`다음 ${emptyFiles.length}개의 빈 파일을 삭제합니다:`);
  emptyFiles.forEach((file) => {
    console.log(`  - ${file}`);
  });

  const confirmed = await getUserConfirmation(
    '정말로 모든 빈 파일을 삭제하시겠습니까? (y/N): '
  );

  if (confirmed) {
    let deleted = 0;

    for (const file of emptyFiles) {
      try {
        fs.unlinkSync(file);
        console.log(`삭제 완료: ${file}`);
        deleted++;
      } catch (error) {
        console.error(`삭제 실패 (${file}): ${error.message}`);
      }
    }

    console.log(`총 ${deleted}개의 빈 파일이 삭제되었습니다.`);
  } else {
    console.log('빈 파일 삭제가 취소되었습니다.');
  }
}

// 메인 함수
async function main() {
  console.log('빈 파일 검사 중...');

  const emptyFiles = findEmptyFiles();

  if (emptyFiles.length > 0) {
    await removeEmptyFiles(emptyFiles);
  } else {
    console.log('빈 파일이 없습니다. 👍');
  }
}

main();
