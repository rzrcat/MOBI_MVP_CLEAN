import { CharacterSettings } from '@/types/character';
import { calculateExperienceGain } from './characterExperience';
import {
  shouldShowNotification,
  calculateNextNotificationTime,
} from './notificationTiming';

export interface UserPattern {
  activeHours: { [hour: number]: number };
  preferredTypes: { [type: string]: number };
  responseRates: { [type: string]: { shown: number; clicked: number } };
  lastUpdate: string;
}

const PATTERN_STORAGE_KEY = 'helper-user-patterns';
const DECAY_FACTOR = 0.95; // Decay factor for older interactions

export function getUserPatterns(): UserPattern {
  const stored = localStorage.getItem(PATTERN_STORAGE_KEY);
  if (!stored) {
    return {
      activeHours: {},
      preferredTypes: {},
      responseRates: {},
      lastUpdate: new Date().toISOString(),
    };
  }
  return JSON.parse(stored);
}

export function updateUserPatterns(
  type: string,
  action: 'shown' | 'clicked' | 'active',
  timestamp = new Date()
) {
  const patterns = getUserPatterns();
  const hour = timestamp.getHours();

  // Update active hours
  if (action === 'active') {
    patterns.activeHours[hour] = (patterns.activeHours[hour] || 0) + 1;
  }

  // Update type preferences and response rates
  if (action === 'shown' || action === 'clicked') {
    if (!patterns.responseRates[type]) {
      patterns.responseRates[type] = { shown: 0, clicked: 0 };
    }

    if (action === 'shown') {
      patterns.responseRates[type].shown++;
    } else {
      patterns.responseRates[type].clicked++;
      patterns.preferredTypes[type] = (patterns.preferredTypes[type] || 0) + 1;
    }
  }

  // Apply decay to older data
  const lastUpdate = new Date(patterns.lastUpdate);
  const daysSinceUpdate = Math.floor(
    (timestamp.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate > 0) {
    Object.keys(patterns.activeHours).forEach((hour) => {
      patterns.activeHours[hour] *= Math.pow(DECAY_FACTOR, daysSinceUpdate);
    });

    Object.keys(patterns.preferredTypes).forEach((type) => {
      patterns.preferredTypes[type] *= Math.pow(DECAY_FACTOR, daysSinceUpdate);
    });

    patterns.lastUpdate = timestamp.toISOString();
  }

  localStorage.setItem(PATTERN_STORAGE_KEY, JSON.stringify(patterns));
  return patterns;
}

export function getOptimalMessageTiming(): number[] {
  const patterns = getUserPatterns();
  const activeHours = Object.entries(patterns.activeHours)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  return activeHours.length > 0 ? activeHours : [9, 13, 17]; // Default hours if no pattern
}

export function getPreferredMessageTypes(): string[] {
  const patterns = getUserPatterns();
  return Object.entries(patterns.preferredTypes)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type);
}

export function getEngagementRate(type: string): number {
  const patterns = getUserPatterns();
  const rates = patterns.responseRates[type];

  if (!rates || rates.shown === 0) return 0.5; // Default engagement rate

  return rates.clicked / rates.shown;
}

export function shouldAdaptMessageTiming(
  type: string,
  currentHour: number
): boolean {
  const patterns = getUserPatterns();
  const optimalHours = getOptimalMessageTiming();

  // If it's a high-priority message type, don't delay
  if (['system', 'event'].includes(type)) return false;

  // If current hour is not optimal and we have enough data
  if (
    !optimalHours.includes(currentHour) &&
    Object.keys(patterns.activeHours).length > 5
  ) {
    const nextOptimalHour =
      optimalHours.find((h) => h > currentHour) || optimalHours[0];
    return true;
  }

  return false;
}

export function getMessageStyle(type: string): {
  duration: number;
  priority: number;
  shouldInteract: boolean;
} {
  const engagementRate = getEngagementRate(type);
  const baseStyle = {
    duration: 5000,
    priority: 5,
    shouldInteract: false,
  };

  // Adjust based on engagement rate
  if (engagementRate > 0.7) {
    return {
      ...baseStyle,
      duration: 8000,
      priority: 7,
      shouldInteract: true,
    };
  } else if (engagementRate < 0.3) {
    return {
      ...baseStyle,
      duration: 3000,
      priority: 3,
      shouldInteract: false,
    };
  }

  return baseStyle;
}

interface AdaptiveBehaviorState {
  lastInteractionTime: Date | null;
  consecutiveIgnores: number;
  dailyInteractions: number;
  successfulInteractions: number;
  mood: 'happy' | 'neutral' | 'sad';
  energyLevel: number;
}

const DEFAULT_STATE: AdaptiveBehaviorState = {
  lastInteractionTime: null,
  consecutiveIgnores: 0,
  dailyInteractions: 0,
  successfulInteractions: 0,
  mood: 'neutral',
  energyLevel: 100,
};

export class AdaptiveBehaviorSystem {
  private state: AdaptiveBehaviorState;
  private settings: CharacterSettings;
  private lastReset: Date;

  constructor(settings: CharacterSettings) {
    this.state = { ...DEFAULT_STATE };
    this.settings = settings;
    this.lastReset = new Date();
    this.checkDailyReset();
  }

  private checkDailyReset() {
    const now = new Date();
    if (now.getDate() !== this.lastReset.getDate()) {
      this.state.dailyInteractions = 0;
      this.state.successfulInteractions = 0;
      this.state.energyLevel = 100;
      this.lastReset = now;
    }
  }

  handleInteraction(wasSuccessful: boolean) {
    this.checkDailyReset();

    this.state.lastInteractionTime = new Date();
    this.state.dailyInteractions++;

    if (wasSuccessful) {
      this.state.successfulInteractions++;
      this.state.consecutiveIgnores = 0;
      this.updateMood(1);

      // Grant experience for successful interaction
      return calculateExperienceGain({
        type: 'interaction',
        multiplier: this.calculateInteractionMultiplier(),
      });
    } else {
      this.state.consecutiveIgnores++;
      this.updateMood(-1);
      return null;
    }
  }

  private updateMood(change: number) {
    const moodLevels: ('sad' | 'neutral' | 'happy')[] = [
      'sad',
      'neutral',
      'happy',
    ];
    const currentIndex = moodLevels.indexOf(this.state.mood);
    const newIndex = Math.max(0, Math.min(2, currentIndex + change));
    this.state.mood = moodLevels[newIndex];
  }

  private calculateInteractionMultiplier(): number {
    // Base multiplier
    let multiplier = 1.0;

    // Bonus for consistent engagement
    const successRate =
      this.state.successfulInteractions /
      Math.max(1, this.state.dailyInteractions);
    if (successRate > 0.7) multiplier += 0.2;

    // Time-of-day bonus
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 4) multiplier += 0.3; // Night owl bonus

    // Energy level impact
    multiplier *= this.state.energyLevel / 100;

    return multiplier;
  }

  shouldInitiateInteraction(type: string): boolean {
    this.checkDailyReset();

    // Don't interact if energy is too low
    if (this.state.energyLevel < 20) return false;

    // Respect notification settings
    if (
      !shouldShowNotification(
        type,
        this.state.lastInteractionTime,
        this.settings
      )
    ) {
      return false;
    }

    // Reduce frequency if being ignored
    if (this.state.consecutiveIgnores > 3) {
      const random = Math.random();
      if (random < this.state.consecutiveIgnores * 0.1) return false;
    }

    // Consume energy for interaction
    this.state.energyLevel = Math.max(0, this.state.energyLevel - 5);

    return true;
  }

  getNextInteractionTime(): Date {
    return calculateNextNotificationTime(this.state.lastInteractionTime, {
      quietHours: this.settings.quietHours,
    });
  }

  getCurrentState(): AdaptiveBehaviorState {
    this.checkDailyReset();
    return { ...this.state };
  }

  getMoodBasedMessage(): string {
    const moodMessages = {
      happy: [
        '오늘도 즐거운 하루에요!',
        '무엇을 도와드릴까요?',
        '아주 좋은 날이네요!',
      ],
      neutral: [
        '무엇을 도와드릴까요?',
        '필요하신 게 있으신가요?',
        '궁금하신 점이 있나요?',
      ],
      sad: [
        '도움이 필요하시다면 언제든 말씀해 주세요...',
        '혹시 제가 도움이 될 수 있을까요?',
        '더 열심히 하도록 하겠습니다.',
      ],
    };

    const messages = moodMessages[this.state.mood];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getEnergyBasedAnimation(): string {
    if (this.state.energyLevel > 80) return 'energetic';
    if (this.state.energyLevel > 50) return 'normal';
    if (this.state.energyLevel > 20) return 'tired';
    return 'sleeping';
  }
}
