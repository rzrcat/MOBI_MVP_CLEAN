import { CharacterAnimation } from '@/types/character';
import { helpInteractionTracker } from './helpInteractionTracker';

const IDLE_MESSAGES = [
  '뭐든 물어보세요!',
  '룬 정보가 필요하신가요?',
  '오늘 일일 퀘스트는 완료하셨나요?',
  '궁금한 게 있으신가요?',
  '저는 모비에요! 도움이 필요하시다면 언제든 말씀해주세요.',
];

const ANIMATIONS: Record<string, CharacterAnimation> = {
  idle: {
    name: 'idle',
    frames: ['idle-1', 'idle-2'],
    duration: 1000,
  },
  happy: {
    name: 'happy',
    frames: ['happy-1', 'happy-2'],
    duration: 800,
  },
  wave: {
    name: 'wave',
    frames: ['wave-1', 'wave-2', 'wave-3'],
    duration: 1200,
  },
};

export const IDLE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface IdleMessage {
  content: string;
  type: 'normal' | 'quest' | 'event';
  animation?: 'wave' | 'happy' | 'interested' | 'excited';
}

const idleMessages: IdleMessage[] = [
  {
    content: '오늘도 재미있게 보내고 계신가요?',
    type: 'normal',
    animation: 'interested',
  },
  {
    content: '궁금한 점이 있으시다면 언제든 물어보세요!',
    type: 'normal',
    animation: 'happy',
  },
  {
    content: '새로운 아이템이나 이벤트를 찾아보시는 건 어떨까요?',
    type: 'quest',
    animation: 'wave',
  },
  {
    content: '오늘의 일일 퀘스트를 확인해보세요!',
    type: 'quest',
    animation: 'excited',
  },
];

const timeBasedMessages: Record<string, IdleMessage[]> = {
  morning: [
    {
      content: '좋은 아침이에요! 오늘도 힘차게 시작해볼까요?',
      type: 'normal',
      animation: 'wave',
    },
    {
      content: '아침에는 간단한 일일 퀘스트부터 시작하면 좋아요!',
      type: 'quest',
      animation: 'interested',
    },
  ],
  afternoon: [
    {
      content: '점심 시간에는 친구들과 함께하는 던전은 어떨까요?',
      type: 'quest',
      animation: 'excited',
    },
    {
      content: '새로운 이벤트 정보를 확인해보세요!',
      type: 'event',
      animation: 'happy',
    },
  ],
  evening: [
    {
      content: '오늘 하루도 수고하셨어요!',
      type: 'normal',
      animation: 'happy',
    },
    {
      content: '일일 퀘스트 마감 시간이 다가오고 있어요!',
      type: 'quest',
      animation: 'interested',
    },
  ],
};

export function getRandomIdleMessage(hour: number): IdleMessage {
  // Get time-based messages
  let timeMessages: IdleMessage[];
  if (hour >= 5 && hour < 12) {
    timeMessages = timeBasedMessages.morning;
  } else if (hour >= 12 && hour < 18) {
    timeMessages = timeBasedMessages.afternoon;
  } else {
    timeMessages = timeBasedMessages.evening;
  }

  // Get user preferences from interaction tracker
  const mostHelpful = helpInteractionTracker.getMostHelpfulTopics();
  const recentInteractions = helpInteractionTracker.getRecentInteractions();

  // Combine general messages with time-based ones
  const allMessages = [...idleMessages, ...timeMessages];

  // If user has preferences, prioritize related messages
  if (mostHelpful.length > 0) {
    const preferredType = mostHelpful[0].includes('quest')
      ? 'quest'
      : mostHelpful[0].includes('event')
        ? 'event'
        : 'normal';

    const relevantMessages = allMessages.filter(
      (m) => m.type === preferredType
    );
    if (relevantMessages.length > 0) {
      return relevantMessages[
        Math.floor(Math.random() * relevantMessages.length)
      ];
    }
  }

  // Default to random message
  return allMessages[Math.floor(Math.random() * allMessages.length)];
}

export function getRandomAnimation(): string {
  const animations = ['wave', 'happy', 'interested', 'excited'];
  return animations[Math.floor(Math.random() * animations.length)];
}

export function shouldShowIdleMessage(
  lastInteractionTime: Date | null,
  currentTime: Date = new Date()
): boolean {
  if (!lastInteractionTime) return true;

  const timeSinceLastInteraction =
    currentTime.getTime() - lastInteractionTime.getTime();

  // Base condition: show message after IDLE_CHECK_INTERVAL
  if (timeSinceLastInteraction < IDLE_CHECK_INTERVAL) {
    return false;
  }

  // Get current hour for time-based decisions
  const currentHour = currentTime.getHours();

  // More likely to show messages during peak hours
  const isPeakHour = currentHour >= 9 && currentHour <= 22;
  const randomFactor = Math.random();

  if (isPeakHour) {
    return randomFactor > 0.7; // 30% chance during peak hours
  } else {
    return randomFactor > 0.9; // 10% chance during off hours
  }
}

export type CharacterExpression =
  | 'normal'
  | 'happy'
  | 'interested'
  | 'excited'
  | 'wave';

export function getExpressionForEvent(eventType: string): CharacterExpression {
  switch (eventType) {
    case 'achievement':
      return 'excited';
    case 'quest':
      return 'interested';
    case 'daily':
      return 'happy';
    case 'event':
      return 'excited';
    default:
      return 'normal';
  }
}

export function getAnimationFrames(animationName: string): string[] {
  return ANIMATIONS[animationName]?.frames || ANIMATIONS.idle.frames;
}

export function getAnimationDuration(animationName: string): number {
  return ANIMATIONS[animationName]?.duration || ANIMATIONS.idle.duration;
}
