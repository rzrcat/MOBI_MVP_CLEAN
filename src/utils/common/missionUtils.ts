import { MissionTask } from '@/types/games/mabinogi_mobile/mission';
import { MISSION_TASKS } from './dailyTasks';

/**
 * 미션을 카테고리별로 그룹화하는 함수
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
