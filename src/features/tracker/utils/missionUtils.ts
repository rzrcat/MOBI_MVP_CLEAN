import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import { MISSION_TASKS } from '@/features/tracker/constants/missionTasks';

/**
 * 미션을 카테고리별로 그룹화하는 함수
 *
 * @param missions - 그룹화할 미션 태스크 배열
 * @returns {Record<string, MissionTask[]>} 카테고리별로 그룹화된 미션 객체
 */
export function groupMissionsByCategory(missions: MissionTask[]) {
  const grouped: Record<string, MissionTask[]> = {};
  missions.forEach((m) => {
    const cat = m.category || '기타';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(m);
  });
  return grouped;
}

/**
 * 미션 목록의 진행률을 계산하는 함수
 *
 * @param missions - 진행률을 계산할 미션 배열
 * @param getMissionProgress - 개별 미션의 완료 상태를 가져오는 함수
 * @returns {{total: number, completed: number, percent: number}} 진행률 정보
 */
export function calculateMissionProgress(
  missions: MissionTask[],
  getMissionProgress: (missionId: string) => { isComplete: boolean }
) {
  const total = missions.length;
  const completed = missions.filter(
    (m) => getMissionProgress(m.id).isComplete
  ).length;
  return {
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * ThemeColor 타입에 따른 테마 관련 클래스 생성
 *
 * @param themeColor - 테마 색상 문자열
 * @returns {{cardBorder: string, cardTitle: string, cardCategory: string, isDefaultColor: boolean}} 테마 클래스 객체
 */
export function getThemeClasses(themeColor: string) {
  const isDefaultColor = [
    'blue',
    'green',
    'purple',
    'pink',
    'orange',
    'gray',
  ].includes(themeColor);

  return {
    cardBorder: isDefaultColor ? `border-${themeColor}-200` : '',
    cardTitle: isDefaultColor ? `text-${themeColor}-700` : '',
    cardCategory: isDefaultColor
      ? `border-l-4 pl-2 border-${themeColor}-200 text-${themeColor}-700`
      : 'border-l-4 pl-2',
    isDefaultColor,
  };
}

/**
 * 일/주간 미션 구분 함수
 *
 * @returns {{dailyMissions: MissionTask[], weeklyMissions: MissionTask[], dailyByCategory: Record<string, MissionTask[]>, weeklyByCategory: Record<string, MissionTask[]>}} 구분된 미션 객체
 */
export function getMissionsByType() {
  const dailyMissions = MISSION_TASKS.filter((m) => m.type === 'daily');
  const weeklyMissions = MISSION_TASKS.filter((m) => m.type === 'weekly');

  return {
    dailyMissions,
    weeklyMissions,
    dailyByCategory: groupMissionsByCategory(dailyMissions),
    weeklyByCategory: groupMissionsByCategory(weeklyMissions),
  };
}

/**
 * 다음 일일 숙제 초기화 시각(매일 06:00)
 * @param 기준시각 (Date)
 * @returns Date 객체
 */
export function getNextDailyReset(base: Date = new Date()): Date {
  const reset = new Date(base);
  reset.setHours(6, 0, 0, 0);
  if (base >= reset) {
    // 이미 오늘 6시가 지났으면 내일 6시
    reset.setDate(reset.getDate() + 1);
  }
  return reset;
}

/**
 * 다음 주간 숙제 초기화 시각(매주 월요일 06:00)
 * @param 기준시각 (Date)
 * @returns Date 객체
 */
export function getNextWeeklyReset(base: Date = new Date()): Date {
  const reset = new Date(base);
  reset.setHours(6, 0, 0, 0);
  // 월요일(1)까지 며칠 남았는지 계산
  const day = reset.getDay(); // 0:일, 1:월, ...
  const daysUntilMonday = (8 - day) % 7 || 7;
  if (day > 1 || (day === 1 && base >= reset)) {
    // 이미 이번주 월요일 6시가 지났으면 다음주 월요일 6시
    reset.setDate(reset.getDate() + daysUntilMonday);
  } else if (day < 1 || (day === 1 && base < reset)) {
    // 이번주 월요일 6시가 아직 안 지났으면 이번주 월요일 6시
    reset.setDate(reset.getDate() + ((1 - day + 7) % 7));
  }
  return reset;
}

/**
 * 일일 숙제 초기화 필요 여부
 * @param lastReset (Date|string|null)
 * @returns boolean
 */
export function isDailyResetDue(lastReset: Date | string | null): boolean {
  if (!lastReset) return true;
  const last = typeof lastReset === 'string' ? new Date(lastReset) : lastReset;
  const now = new Date();
  const todayReset = new Date(now);
  todayReset.setHours(6, 0, 0, 0);
  return last < todayReset && now >= todayReset;
}

/**
 * 주간 숙제 초기화 필요 여부
 * @param lastReset (Date|string|null)
 * @returns boolean
 */
export function isWeeklyResetDue(lastReset: Date | string | null): boolean {
  if (!lastReset) return true;
  const last = typeof lastReset === 'string' ? new Date(lastReset) : lastReset;
  const now = new Date();
  // 이번주 월요일 6시
  const monday = new Date(now);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - ((day + 6) % 7));
  monday.setHours(6, 0, 0, 0);
  return last < monday && now >= monday;
}
