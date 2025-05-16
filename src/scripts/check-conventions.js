/**
 * 코딩 컨벤션 검사 스크립트
 *
 * 다음 항목을 검사합니다:
 * 1. 컴포넌트 파일명 규칙 (PascalCase)
 * 2. 유틸리티/훅 파일명 규칙 (camelCase)
 * 3. 임포트 경로 일관성
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const COMPONENTS_DIRS = ['src/components', 'src/app/**/components'];

const UTILS_DIRS = ['src/utils', 'src/lib', 'src/hooks'];

// 파일 이름 규칙 검사
function checkNamingConventions() {
  let issues = 0;

  // 컴포넌트 파일 검사 (PascalCase)
  COMPONENTS_DIRS.forEach((dir) => {
    const files = glob.sync(`${dir}/**/*.{ts,tsx,js,jsx}`, {
      ignore: ['**/node_modules/**'],
    });

    files.forEach((file) => {
      const fileName = path.basename(file, path.extname(file));
      // index.tsx는 제외
      if (fileName === 'index') return;

      // 첫 글자가 대문자인지 확인
      if (fileName[0] !== fileName[0].toUpperCase()) {
        console.error(`[컴포넌트] 파일명이 PascalCase가 아닙니다: ${file}`);
        issues++;
      }
    });
  });

  // 유틸리티/훅 파일 검사 (camelCase)
  UTILS_DIRS.forEach((dir) => {
    const files = glob.sync(`${dir}/**/*.{ts,tsx,js,jsx}`, {
      ignore: ['**/node_modules/**'],
    });

    files.forEach((file) => {
      const fileName = path.basename(file, path.extname(file));
      if (fileName === 'index') return;

      // 첫 글자가 소문자인지 확인
      if (fileName[0] !== fileName[0].toLowerCase()) {
        console.error(`[유틸리티/훅] 파일명이 camelCase가 아닙니다: ${file}`);
        issues++;
      }
    });
  });

  return issues;
}

// 임포트 경로 일관성 검사
function checkImportPathConsistency() {
  let issues = 0;
  const allFiles = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['**/node_modules/**'],
  });

  // 컴포넌트 임포트 패턴 (대소문자 확인)
  const componentImportRegex = /@\/components\/ui\/([a-zA-Z]+)/g;

  allFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(componentImportRegex)];

    if (matches.length > 0) {
      const componentNames = new Set(matches.map((m) => m[1]));

      componentNames.forEach((name) => {
        // 같은 컴포넌트를 다른 대소문자로 임포트하는지 검사
        const upperCaseImport = new RegExp(
          `@/components/ui/${name[0].toUpperCase()}${name.slice(1)}`,
          'g'
        );
        const lowerCaseImport = new RegExp(
          `@/components/ui/${name[0].toLowerCase()}${name.slice(1)}`,
          'g'
        );

        const upperMatches = content.match(upperCaseImport);
        const lowerMatches = content.match(lowerCaseImport);

        if (upperMatches && lowerMatches) {
          console.error(
            `[임포트 경로] 파일 내에서 다른 대소문자로 임포트하고 있습니다: ${file}`
          );
          console.error(`  - ${upperMatches[0]}`);
          console.error(`  - ${lowerMatches[0]}`);
          issues++;
        }
      });
    }
  });

  return issues;
}

// 메인 함수
function main() {
  console.log('코딩 컨벤션 검사 중...');

  const namingIssues = checkNamingConventions();
  const importIssues = checkImportPathConsistency();

  const totalIssues = namingIssues + importIssues;

  if (totalIssues > 0) {
    console.error(`총 ${totalIssues}개의 컨벤션 문제가 발견되었습니다.`);
    process.exit(1);
  } else {
    console.log('모든 컨벤션 검사를 통과했습니다! 👍');
  }
}

main();
