import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, CharacterSettings } from '@/types/character';
import {
  calculateExperience,
  calculateLevel,
  getRewardForLevel,
} from '@/utils/common/characterExperience';

interface Message {
  id: string;
  content: string;
  type: 'normal' | 'quest' | 'event' | 'system';
  timestamp: number;
  isRead: boolean;
}

interface ExperienceAction {
  type:
    | 'quest_complete'
    | 'daily_complete'
    | 'weekly_complete'
    | 'interaction'
    | 'help_viewed';
  multiplier?: number;
}

interface HelperStore {
  character: Character;
  messages: Message[];
  isSettingsOpen: boolean;
  currentAnimation: string | null;
  currentExpression: string | null;
  lastInteractionTime: number;

  // Actions
  updateCharacter: (settings: Partial<CharacterSettings>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (messageId: string) => void;
  clearMessages: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
  setAnimation: (animation: string | null) => void;
  setExpression: (expression: string | null) => void;
  updateLastInteraction: () => void;
  gainExperience: (action: ExperienceAction) => void;
}

const defaultCharacter: Character = {
  id: 'default',
  type: 'default',
  name: '모비',
  server: '',
  level: 1,
  experience: 0,
  settings: {
    position: { x: 20, y: 20 },
    size: 'medium',
    opacity: 1,
    isHidden: false,
    useAnimation: true,
    recordHistory: true,
    theme: 'default',
    notifications: {
      dailyTasks: true,
      events: true,
      notices: true,
      bardBoard: true,
      fashionItems: true,
      guildNews: true,
      popularPosts: true,
    },
    quietHours: {
      enabled: false,
      start: 22,
      end: 8,
    },
  },
};

export const useHelperStore = create<HelperStore>()(
  persist(
    (set, get) => ({
      character: defaultCharacter,
      messages: [],
      isSettingsOpen: false,
      currentAnimation: null,
      currentExpression: null,
      lastInteractionTime: Date.now(),

      updateCharacter: (settings) =>
        set((state) => ({
          character: {
            ...state.character,
            settings: { ...state.character.settings, ...settings },
          },
        })),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              isRead: false,
            },
            ...state.messages.slice(0, 99), // Keep last 100 messages
          ],
        })),

      markMessageAsRead: (messageId) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          ),
        })),

      clearMessages: () => set({ messages: [] }),

      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

      setAnimation: (animation) => set({ currentAnimation: animation }),

      setExpression: (expression) => set({ currentExpression: expression }),

      updateLastInteraction: () => set({ lastInteractionTime: Date.now() }),

      gainExperience: (action) => {
        const state = get();
        const expGained = calculateExperience(action);
        const newTotalExp = state.character.experience + expGained;
        const levelInfo = calculateLevel(newTotalExp);

        // Check for level up
        if (levelInfo.level > state.character.level) {
          const reward = getRewardForLevel(levelInfo.level);
          if (reward.description) {
            state.addMessage({
              content: `레벨 ${levelInfo.level} 달성! ${reward.description}`,
              type: 'system',
            });
            state.setAnimation('happy');
            setTimeout(() => state.setAnimation(null), 1000);
          }
        }

        set((state) => ({
          character: {
            ...state.character,
            level: levelInfo.level,
            experience: newTotalExp,
          },
        }));

        // Show experience gain message
        state.addMessage({
          content: `경험치를 획득했어요! (+${expGained})`,
          type: 'normal',
        });
      },
    }),
    {
      name: 'helper-storage',
    }
  )
);
