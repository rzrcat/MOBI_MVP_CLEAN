'use client';

import { useEffect, useCallback } from 'react';
import { useHelperStore } from '@/store/useHelperStore';
import { notificationScheduler } from '@/utils/common/notificationScheduler';
import { getNotificationPriority } from '@/utils/common/notificationTiming';
import {
  updateUserPatterns,
  shouldAdaptMessageTiming,
  getMessageStyle,
  getOptimalMessageTiming,
} from '@/utils/common/adaptiveBehavior';

interface NotificationPreference {
  type: string;
  frequency: 'low' | 'medium' | 'high';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  lastInteraction: Date | null;
  dismissCount: number;
  clickCount: number;
}

const getInitialPreferences = () => {
  const stored = localStorage.getItem('notification-preferences');
  return stored ? JSON.parse(stored) : {};
};

export function useNotifications() {
  const { character, addMessage, messages, setAnimation } = useHelperStore();

  // Initialize notification scheduler with character settings
  useEffect(() => {
    notificationScheduler.setSettings(character.settings);
  }, [character.settings]);

  // Update notification preferences and user patterns based on interactions
  const updatePreference = useCallback(
    (type: string, action: 'click' | 'dismiss') => {
      const preferences = getInitialPreferences();
      const pref = preferences[type] || {
        type,
        frequency: 'medium',
        timeOfDay: 'anytime',
        lastInteraction: null,
        dismissCount: 0,
        clickCount: 0,
      };

      if (action === 'click') {
        pref.clickCount++;
        updateUserPatterns(type, 'clicked');
        if (pref.clickCount > 5) {
          pref.frequency = 'high';
        }
      } else {
        pref.dismissCount++;
        if (pref.dismissCount > 5) {
          pref.frequency = 'low';
        }
      }

      pref.lastInteraction = new Date().toISOString();
      preferences[type] = pref;
      localStorage.setItem(
        'notification-preferences',
        JSON.stringify(preferences)
      );
    },
    []
  );

  // Schedule a notification with adaptive timing
  const scheduleNotification = useCallback(
    (content: string, type: string, baseDelay: number = 0) => {
      const now = new Date();
      const currentHour = now.getHours();
      const messageStyle = getMessageStyle(type);

      // Update shown pattern
      updateUserPatterns(type, 'shown');

      // Check if we should adapt timing
      if (shouldAdaptMessageTiming(type, currentHour)) {
        const optimalHours = getOptimalMessageTiming();
        const nextOptimalHour =
          optimalHours.find((h) => h > currentHour) || optimalHours[0];

        // Calculate delay until next optimal hour
        const delayHours =
          nextOptimalHour > currentHour
            ? nextOptimalHour - currentHour
            : 24 - currentHour + nextOptimalHour;

        baseDelay += delayHours * 60 * 60 * 1000;
      }

      const preferences = getInitialPreferences();
      const pref = preferences[type];
      let priority = messageStyle.priority;

      // Adjust priority based on user preferences
      if (pref) {
        if (pref.frequency === 'high') priority += 2;
        if (pref.frequency === 'low') priority -= 2;
      }

      const notificationId = notificationScheduler.scheduleNotification(
        content,
        type,
        priority,
        () => {
          addMessage({ content, type });

          // Show animation based on message type and user engagement
          if (messageStyle.shouldInteract) {
            setAnimation(type === 'quest' ? 'wave' : 'happy');
            setTimeout(() => setAnimation(null), 1000);
          }
        }
      );

      // Update active hours pattern
      updateUserPatterns('any', 'active');

      return notificationId;
    },
    [addMessage, setAnimation]
  );

  // Track user activity patterns
  useEffect(() => {
    let activityTimeout: NodeJS.Timeout;

    const trackActivity = () => {
      updateUserPatterns('any', 'active');
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(
        () => {
          // Consider user inactive after 5 minutes
        },
        5 * 60 * 1000
      );
    };

    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('click', trackActivity);

    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('click', trackActivity);
      clearTimeout(activityTimeout);
    };
  }, []);

  return {
    scheduleNotification,
    updatePreference,
  };
}
