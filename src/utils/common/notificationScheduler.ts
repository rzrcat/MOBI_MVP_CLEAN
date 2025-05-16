import { CharacterSettings } from '@/types/character';
import {
  calculateOptimalNotificationTime,
  shouldShowNotification,
} from './notificationTiming';

interface ScheduledNotification {
  id: string;
  content: string;
  type: string;
  priority: number;
  scheduledTime: Date;
  callback: () => void;
}

class NotificationScheduler {
  private notifications: ScheduledNotification[] = [];
  private settings: CharacterSettings | null = null;

  setSettings(settings: CharacterSettings) {
    this.settings = settings;
  }

  scheduleNotification(
    content: string,
    type: string,
    priority: number,
    callback: () => void
  ): string {
    if (!this.settings) {
      throw new Error('Character settings not initialized');
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const scheduledTime = calculateOptimalNotificationTime(
      priority,
      now.getHours(),
      this.settings
    );

    this.notifications.push({
      id,
      content,
      type,
      priority,
      scheduledTime,
      callback,
    });

    // Sort notifications by scheduled time and priority
    this.notifications.sort((a, b) => {
      if (a.scheduledTime.getTime() === b.scheduledTime.getTime()) {
        return b.priority - a.priority;
      }
      return a.scheduledTime.getTime() - b.scheduledTime.getTime();
    });

    return id;
  }

  cancelNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  processNotifications() {
    if (!this.settings || !shouldShowNotification(this.settings)) {
      return;
    }

    const now = new Date();
    const dueNotifications = this.notifications.filter(
      (n) => n.scheduledTime <= now
    );

    // Process due notifications
    dueNotifications.forEach((notification) => {
      notification.callback();
      this.cancelNotification(notification.id);
    });
  }

  getNextNotification(): ScheduledNotification | null {
    return this.notifications[0] || null;
  }

  clearAll() {
    this.notifications = [];
  }
}

// Create singleton instance
export const notificationScheduler = new NotificationScheduler();

// Start processing notifications
setInterval(() => {
  notificationScheduler.processNotifications();
}, 1000); // Check every second
