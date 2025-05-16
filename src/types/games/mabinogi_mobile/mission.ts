export interface MissionTask {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  scope: 'account' | 'character';
  maxCompletions: number;
  category?: string;
  difficulties?: Array<{
    key: string;
    label: string;
    missionId: string;
  }>;
}
