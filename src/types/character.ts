export type CharacterSize = 'small' | 'medium' | 'large';
export type CharacterTheme = 'default' | 'dark' | 'cute' | 'fantasy';
export type CharacterType = 'default' | 'custom';

export type ExperienceActionType =
  | 'quest_complete'
  | 'daily_complete'
  | 'weekly_complete'
  | 'interaction'
  | 'help_viewed';

export interface ExperienceAction {
  type: ExperienceActionType;
  multiplier?: number;
}

export interface CharacterPosition {
  x: number;
  y: number;
}

export interface CharacterAnimation {
  name: string;
  frames: string[];
  duration: number;
}

export interface CharacterCustomization {
  parts: {
    head: string;
    ears: string;
    eyes: string;
    nose: string;
    mouth: string;
    body: string;
    arms: string;
    legs: string;
  };
  accessories: string[];
}

export interface CharacterSettings {
  position: CharacterPosition;
  size: CharacterSize;
  opacity: number;
  isHidden: boolean;
  useAnimation: boolean;
  recordHistory: boolean;
  theme: CharacterTheme;
  notifications: {
    dailyTasks: boolean;
    events: boolean;
    notices: boolean;
    bardBoard: boolean;
    fashionItems: boolean;
    guildNews: boolean;
    popularPosts: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: number; // 0-23
    end: number; // 0-23
  };
}

export interface Character {
  id: string;
  type: CharacterType;
  name: string;
  server: string;
  level: number;
  experience: number;
  settings: CharacterSettings;
  customization?: CharacterCustomization;
}
