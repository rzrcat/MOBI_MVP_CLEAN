import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSION_TASKS } from '@/utils/common/dailyTasks';

interface MissionProgress {
  completionCount: number;
  isComplete: boolean;
}

interface CharacterMissionTaskStore {
  characterMissionProgress: Record<string, Record<string, MissionProgress>>; // characterId -> missionId -> progress
  getMissionProgress: (
    characterId: string,
    missionId: string
  ) => MissionProgress;
  checkMission: (characterId: string, missionId: string) => void;
  resetAllMissions: (characterId: string) => void;
  setMissionCount: (
    characterId: string,
    missionId: string,
    count: number
  ) => void;
  setMultipleMissionCounts: (
    characterId: string,
    updates: { missionId: string; count: number }[]
  ) => void;
}

export const useCharacterTaskStore = create<CharacterMissionTaskStore>()(
  persist(
    (set, get) => ({
      characterMissionProgress: {},
      getMissionProgress: (characterId, missionId) => {
        const charData = get().characterMissionProgress[characterId] || {};
        if (charData[missionId]) return charData[missionId];
        return {
          completionCount: 0,
          isComplete: false,
        };
      },
      checkMission: (characterId, missionId) => {
        set((state) => {
          const charData = state.characterMissionProgress[characterId] || {};
          const mission = MISSION_TASKS.find((m) => m.id === missionId);
          if (!mission) return {};
          const prev = charData[missionId] || {
            completionCount: 0,
            isComplete: false,
          };
          const newCount = Math.min(
            prev.completionCount + 1,
            mission.maxCompletions
          );
          return {
            characterMissionProgress: {
              ...state.characterMissionProgress,
              [characterId]: {
                ...charData,
                [missionId]: {
                  completionCount: newCount,
                  isComplete: newCount >= mission.maxCompletions,
                },
              },
            },
          };
        });
      },
      resetAllMissions: (characterId) => {
        set((state) => {
          const resetData: Record<string, MissionProgress> = {};
          MISSION_TASKS.forEach((m) => {
            resetData[m.id] = { completionCount: 0, isComplete: false };
            if (m.difficulties) {
              m.difficulties.forEach((d) => {
                resetData[d.missionId] = {
                  completionCount: 0,
                  isComplete: false,
                };
              });
            }
          });
          return {
            characterMissionProgress: {
              ...state.characterMissionProgress,
              [characterId]: resetData,
            },
          };
        });
      },
      setMissionCount: (characterId, missionId, count) => {
        set((state) => {
          const charData = state.characterMissionProgress[characterId] || {};
          let mission = MISSION_TASKS.find((m) => m.id === missionId);
          let maxCompletions = mission?.maxCompletions ?? 1;
          if (!mission) {
            mission = MISSION_TASKS.find((m) =>
              m.difficulties?.some((d) => d.missionId === missionId)
            );
            maxCompletions = 1;
          }
          if (!mission) return {};
          const newCount = Math.max(0, Math.min(count, maxCompletions));
          return {
            characterMissionProgress: {
              ...state.characterMissionProgress,
              [characterId]: {
                ...charData,
                [missionId]: {
                  completionCount: newCount,
                  isComplete: newCount >= maxCompletions,
                },
              },
            },
          };
        });
      },
      setMultipleMissionCounts: (characterId, updates) => {
        set((state) => {
          const charData = state.characterMissionProgress[characterId] || {};
          const newCharData = { ...charData };
          updates.forEach(({ missionId, count }) => {
            let mission = MISSION_TASKS.find((m) => m.id === missionId);
            let maxCompletions = mission?.maxCompletions ?? 1;
            if (!mission) {
              mission = MISSION_TASKS.find((m) =>
                m.difficulties?.some((d) => d.missionId === missionId)
              );
              maxCompletions = 1;
            }
            if (!mission) return;
            const newCount = Math.max(0, Math.min(count, maxCompletions));
            newCharData[missionId] = {
              completionCount: newCount,
              isComplete: newCount >= maxCompletions,
            };
          });
          return {
            characterMissionProgress: {
              ...state.characterMissionProgress,
              [characterId]: newCharData,
            },
          };
        });
      },
    }),
    { name: 'character-mission-progress' }
  )
);
