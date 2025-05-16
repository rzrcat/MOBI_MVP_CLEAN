/**
 * 점검 공지 파싱 테스트 스크립트
 *
 * 이 스크립트는 다양한 형식의 점검 공지 제목에서
 * 시간 정보를 추출하는 로직을 테스트합니다.
 */
const testNotices = [
  '서버 점검 안내 (2025년 5월 11일 10시 00분 ~ 14시 00분)',
  '5월 정기 점검 안내 (5/15 02:00 ~ 06:00)',
  '긴급 서버 점검 안내 (14시 30분부터 17시 00분까지)',
  '업데이트 및 서버 점검 안내 (2025-05-20 09:00 ~ 13:00)',
  '5월 20일 마비노기 모바일 업데이트 안내',
  '[공지] 버그 수정을 위한 긴급 점검 안내 (10:00 ~ 12:30)',
];

/**
 * 점검 공지에서 점검 시간 추출 시도
 */
function parseMaintenanceTime(noticeTitle) {
  console.log(`\n테스트 제목: "${noticeTitle}"`);

  // 점검 시간 패턴 (다양한 형태를 지원)
  const maintenanceTimePatterns = [
    // "YYYY년 MM월 DD일 HH시 MM분 ~ HH시 MM분"
    /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2})시\s*(\d{1,2})분\s*(?:~|부터)\s*(\d{1,2})시\s*(\d{1,2})분/,
    // "YYYY-MM-DD HH:MM ~ HH:MM"
    /(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{1,2})\s*(?:~|부터)\s*(\d{1,2}):(\d{1,2})/,
    // "MM월 DD일 HH:MM ~ HH:MM", "MM/DD HH:MM ~ HH:MM"
    /(\d{1,2})[월\/]\s*(\d{1,2})[일]?\s*(\d{1,2}):(\d{1,2})\s*(?:~|부터)\s*(\d{1,2}):(\d{1,2})/,
    // "HH시 MM분 ~ HH시 MM분"
    /(\d{1,2})시\s*(\d{1,2})분\s*(?:~|부터|\~|까지)\s*(\d{1,2})시\s*(\d{1,2})분/,
    // "HH:MM ~ HH:MM"
    /(\d{1,2}):(\d{1,2})\s*(?:~|부터|\~)\s*(\d{1,2}):(\d{1,2})/,
  ];

  // 현재 시간 (테스트용)
  const now = new Date(2025, 4, 10, 9, 0, 0); // 2025년 5월 10일 9시
  console.log(`현재 시간: ${now.toLocaleString()}`);

  let startTime = null;
  let endTime = null;

  // 다양한 패턴으로 시간 추출 시도
  for (const pattern of maintenanceTimePatterns) {
    const match = noticeTitle.match(pattern);

    if (match) {
      console.log(`패턴 매치 성공: ${pattern}`);
      console.log('매치된 그룹:', match.slice(1));

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
        // HH시 MM분 ~ HH시 MM분 패턴 또는 HH:MM ~ HH:MM 패턴
        const startHour = parseInt(match[1]);
        const startMinute = parseInt(match[2]);
        const endHour = parseInt(match[3]);
        const endMinute = parseInt(match[4]);

        // 연/월/일은 현재 날짜 사용
        startTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          startHour,
          startMinute
        );

        endTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          endHour,
          endMinute
        );

        // 종료 시간이 시작 시간보다 이전이면 다음 날로 설정
        if (endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }
      }

      break;
    }
  }

  // 결과 출력
  if (startTime && endTime) {
    console.log('점검 시작 시간:', startTime.toLocaleString());
    console.log('점검 종료 시간:', endTime.toLocaleString());

    // 점검 상태 확인
    const isUnderMaintenance = now >= startTime && now <= endTime;
    console.log('현재 점검 중 여부:', isUnderMaintenance);

    // 점검 종료까지 남은 시간
    if (endTime > now) {
      const timeUntilEnd = endTime.getTime() - now.getTime();
      const hoursRemaining = Math.floor(timeUntilEnd / (1000 * 60 * 60));
      const minutesRemaining = Math.floor(
        (timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60)
      );

      console.log(
        `점검 종료까지 남은 시간: ${hoursRemaining}시간 ${minutesRemaining}분`
      );

      // 2시간 이내 여부
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      const isEndingSoon = isUnderMaintenance && timeUntilEnd <= twoHoursInMs;
      console.log('점검 종료 2시간 이내 여부:', isEndingSoon);
    }
  } else {
    console.log('점검 시간을 추출할 수 없습니다.');
  }
}

// 테스트 실행
console.log('========== 점검 공지 파싱 테스트 ==========');
testNotices.forEach((notice) => {
  parseMaintenanceTime(notice);
  console.log('----------------------------------------');
});
