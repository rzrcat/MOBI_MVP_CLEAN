import { CharacterSettings } from '@/types/character';

export function shouldShowNotification(settings: CharacterSettings): boolean {
  if (!settings.quietHours.enabled) return true;

  const now = new Date();
  const currentHour = now.getHours();
  const { start, end } = settings.quietHours;

  // Handle cases where quiet hours span across midnight
  if (start > end) {
    return currentHour < end || currentHour >= start;
  }

  return currentHour < start || currentHour >= end;
}

export function getNextActiveTime(settings: CharacterSettings): Date {
  const now = new Date();
  const nextTime = new Date(now);

  if (!settings.quietHours.enabled) return now;

  const currentHour = now.getHours();
  const { end } = settings.quietHours;

  if (currentHour < end) {
    nextTime.setHours(end, 0, 0, 0);
  } else {
    nextTime.setDate(nextTime.getDate() + 1);
    nextTime.setHours(end, 0, 0, 0);
  }

  return nextTime;
}

export function getNotificationPriority(type: string): number {
  const priorities = {
    system: 10,
    event: 8,
    quest: 6,
    normal: 4,
    interaction: 2,
  };

  return priorities[type as keyof typeof priorities] || 1;
}

export function shouldBufferNotification(
  type: string,
  lastNotification: Date | null,
  settings: CharacterSettings
): boolean {
  if (!lastNotification) return false;

  const now = new Date();
  const timeSinceLastNotification = now.getTime() - lastNotification.getTime();

  // Minimum time between notifications based on type
  const minBuffer = {
    system: 0, // Show immediately
    event: 30000, // 30 seconds
    quest: 60000, // 1 minute
    normal: 300000, // 5 minutes
    interaction: 120000, // 2 minutes
  };

  return (
    timeSinceLastNotification <
    (minBuffer[type as keyof typeof minBuffer] || 300000)
  );
}

export function calculateOptimalNotificationTime(
  priority: number,
  currentHour: number,
  settings: CharacterSettings
): Date {
  const now = new Date();
  const result = new Date(now);

  // If it's during quiet hours, schedule for the end of quiet hours
  if (settings.quietHours.enabled) {
    const { start, end } = settings.quietHours;
    if (currentHour >= start || currentHour < end) {
      result.setHours(end, 0, 0, 0);
      if (currentHour >= start) {
        result.setDate(result.getDate() + 1);
      }
      return result;
    }
  }

  // For low priority notifications during peak hours (9-17),
  // try to batch them together at suitable times
  if (priority <= 5 && currentHour >= 9 && currentHour <= 17) {
    const nextSlot = Math.ceil(currentHour / 2) * 2; // Round up to next even hour
    if (nextSlot !== currentHour) {
      result.setHours(nextSlot, 0, 0, 0);
      return result;
    }
  }

  // For medium priority, ensure at least 30 minutes between notifications
  if (priority <= 7) {
    const minutes = result.getMinutes();
    if (minutes < 30) {
      result.setMinutes(30, 0, 0);
    } else {
      result.setHours(result.getHours() + 1, 0, 0, 0);
    }
    return result;
  }

  // High priority notifications can be shown immediately
  return result;
}

interface NotificationWindow {
  startHour: number;
  endHour: number;
  priority: number;
}

interface UserActivityPattern {
  activePeriods: NotificationWindow[];
  preferredNotificationTimes: number[];
  quietHours: {
    start: number;
    end: number;
  };
}

const DEFAULT_ACTIVITY_PATTERN: UserActivityPattern = {
  activePeriods: [
    { startHour: 9, endHour: 12, priority: 2 },
    { startHour: 14, endHour: 18, priority: 3 },
    { startHour: 20, endHour: 23, priority: 1 },
  ],
  preferredNotificationTimes: [10, 15, 20],
  quietHours: {
    start: 0,
    end: 8,
  },
};

export function calculateNextNotificationTime(
  lastNotificationTime: Date | null,
  userPattern: Partial<UserActivityPattern> = {}
): Date {
  const pattern = { ...DEFAULT_ACTIVITY_PATTERN, ...userPattern };
  const now = new Date();
  const currentHour = now.getHours();

  // Respect quiet hours
  if (
    currentHour >= pattern.quietHours.start ||
    currentHour < pattern.quietHours.end
  ) {
    const tomorrow = new Date(now);
    tomorrow.setHours(pattern.quietHours.end, 0, 0, 0);
    if (currentHour >= pattern.quietHours.start) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow;
  }

  // Find current activity window
  const currentWindow = pattern.activePeriods.find(
    (window) => currentHour >= window.startHour && currentHour < window.endHour
  );

  if (currentWindow) {
    // We're in an active period
    const minDelay = 15; // minutes
    const maxDelay = 45; // minutes
    const delay = Math.floor(
      Math.random() * (maxDelay - minDelay + 1) + minDelay
    );

    const nextTime = new Date(now);
    nextTime.setMinutes(nextTime.getMinutes() + delay);

    // Don't schedule past the current window
    const windowEnd = new Date(now);
    windowEnd.setHours(currentWindow.endHour, 0, 0, 0);

    return nextTime < windowEnd ? nextTime : windowEnd;
  } else {
    // Find next activity window
    const nextWindow =
      pattern.activePeriods.find((window) => window.startHour > currentHour) ||
      pattern.activePeriods[0]; // Wrap to first window tomorrow

    const nextTime = new Date(now);
    nextTime.setHours(nextWindow.startHour, 0, 0, 0);

    if (nextWindow.startHour <= currentHour) {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    return nextTime;
  }
}

export function shouldShowNotification(
  notificationType: string,
  lastNotificationTime: Date | null,
  userPattern: Partial<UserActivityPattern> = {}
): boolean {
  const pattern = { ...DEFAULT_ACTIVITY_PATTERN, ...userPattern };
  const now = new Date();
  const currentHour = now.getHours();

  // Don't show during quiet hours
  if (
    currentHour >= pattern.quietHours.start ||
    currentHour < pattern.quietHours.end
  ) {
    return false;
  }

  // Check if we're in an active period
  const currentWindow = pattern.activePeriods.find(
    (window) => currentHour >= window.startHour && currentHour < window.endHour
  );

  if (!currentWindow) {
    return false;
  }

  // Enforce minimum time between notifications
  if (lastNotificationTime) {
    const timeSinceLastNotification =
      now.getTime() - lastNotificationTime.getTime();
    const minInterval = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (timeSinceLastNotification < minInterval) {
      return false;
    }
  }

  // Higher chance of showing notification during preferred times
  if (pattern.preferredNotificationTimes.includes(currentHour)) {
    return Math.random() > 0.3; // 70% chance
  }

  // Base chance based on window priority
  const baseProbability = 0.2 + currentWindow.priority * 0.1;
  return Math.random() > 1 - baseProbability;
}

export function adjustNotificationTiming(
  userPattern: UserActivityPattern,
  interactionResults: { timestamp: number; wasHelpful: boolean }[]
): UserActivityPattern {
  const pattern = { ...userPattern };

  // Analyze interaction results to find optimal times
  const successfulInteractions = interactionResults.filter((r) => r.wasHelpful);
  if (successfulInteractions.length === 0) return pattern;

  // Find hours with successful interactions
  const successHours = successfulInteractions.map((i) =>
    new Date(i.timestamp).getHours()
  );

  // Update preferred notification times
  const hourCounts = new Map<number, number>();
  successHours.forEach((hour) => {
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  // Sort by frequency and take top 3
  pattern.preferredNotificationTimes = Array.from(hourCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => hour);

  // Adjust active periods based on successful interactions
  pattern.activePeriods = pattern.activePeriods.map((window) => ({
    ...window,
    priority:
      successHours.filter((h) => h >= window.startHour && h < window.endHour)
        .length + 1,
  }));

  return pattern;
}

interface NotificationSettings {
  quietHours?: {
    start: number;
    end: number;
  };
}

export function shouldShowNotification(
  type: string,
  lastNotificationTime: Date | null,
  settings: NotificationSettings
): boolean {
  const now = new Date();
  const currentHour = now.getHours();

  // Check quiet hours
  if (settings.quietHours) {
    const { start, end } = settings.quietHours;
    if (start < end) {
      if (currentHour >= start && currentHour < end) return false;
    } else {
      // Handles cases where quiet hours span midnight
      if (currentHour >= start || currentHour < end) return false;
    }
  }

  // If no previous notification, allow it
  if (!lastNotificationTime) return true;

  // Different cooldown periods for different notification types
  const cooldowns: Record<string, number> = {
    daily: 24 * 60 * 60 * 1000, // 24 hours
    task: 30 * 60 * 1000, // 30 minutes
    tip: 2 * 60 * 60 * 1000, // 2 hours
    event: 15 * 60 * 1000, // 15 minutes
    default: 60 * 60 * 1000, // 1 hour
  };

  const cooldown = cooldowns[type] || cooldowns.default;
  const timeSinceLastNotification =
    now.getTime() - lastNotificationTime.getTime();

  return timeSinceLastNotification >= cooldown;
}

export function calculateNextNotificationTime(
  lastNotificationTime: Date | null,
  settings: NotificationSettings
): Date {
  const now = new Date();
  const baseDelay = 60 * 60 * 1000; // 1 hour base delay

  // If we're in quiet hours, schedule for the end of quiet hours
  if (settings.quietHours) {
    const currentHour = now.getHours();
    const { start, end } = settings.quietHours;

    if (start < end) {
      if (currentHour >= start && currentHour < end) {
        now.setHours(end, 0, 0, 0);
        return now;
      }
    } else {
      if (currentHour >= start || currentHour < end) {
        now.setHours(end, 0, 0, 0);
        if (currentHour >= start) {
          now.setDate(now.getDate() + 1);
        }
        return now;
      }
    }
  }

  // If no previous notification, schedule for next appropriate time
  if (!lastNotificationTime) {
    return new Date(now.getTime() + baseDelay);
  }

  // Calculate next time based on last notification and current time
  const nextTime = new Date(
    Math.max(
      lastNotificationTime.getTime() + baseDelay,
      now.getTime() + 30 * 60 * 1000 // At least 30 minutes from now
    )
  );

  return nextTime;
}

export function getOptimalNotificationTime(): Date {
  const now = new Date();
  const hour = now.getHours();

  // Define peak activity periods
  const peakPeriods = [
    { start: 9, end: 11 }, // Morning
    { start: 14, end: 16 }, // Afternoon
    { start: 19, end: 21 }, // Evening
  ];

  // Find the next peak period
  for (const period of peakPeriods) {
    if (hour < period.start) {
      now.setHours(period.start, 0, 0, 0);
      return now;
    }
  }

  // If we're past all peak periods, schedule for tomorrow's first peak
  now.setDate(now.getDate() + 1);
  now.setHours(peakPeriods[0].start, 0, 0, 0);
  return now;
}
