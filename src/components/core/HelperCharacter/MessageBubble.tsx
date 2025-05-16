'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHelperStore } from '@/store/useHelperStore';
import { useNotifications } from '@/hooks/useNotifications';
import {
  shouldShowNotification,
  getNotificationPriority,
  shouldBufferNotification,
} from '@/utils/common/notificationTiming';

interface QueuedMessage {
  message: NonNullable<ReturnType<typeof useHelperStore>['messages'][0]>;
  priority: number;
  scheduledTime: Date;
}

export function MessageBubble() {
  const { messages, character, markMessageAsRead, gainExperience } =
    useHelperStore();
  const { updatePreference } = useNotifications();
  const [currentMessage, setCurrentMessage] = useState<QueuedMessage | null>(
    null
  );
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const lastNotificationTime = useRef<Date | null>(null);

  // Process new messages
  useEffect(() => {
    const unreadMessages = messages.filter((msg) => !msg.isRead);
    if (unreadMessages.length === 0) return;

    // Convert messages to queued messages with priority
    const newQueuedMessages = unreadMessages.map((message) => ({
      message,
      priority: getNotificationPriority(message.type),
      scheduledTime: new Date(message.timestamp),
    }));

    // Add to queue and sort by priority
    setMessageQueue((prevQueue) => {
      const updatedQueue = [...prevQueue, ...newQueuedMessages].sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Higher priority first
        }
        return a.scheduledTime.getTime() - b.scheduledTime.getTime(); // Earlier time first
      });

      // Limit queue size
      return updatedQueue.slice(0, 10);
    });
  }, [messages]);

  // Process message queue
  useEffect(() => {
    if (!messageQueue.length || currentMessage) return;

    const showNextMessage = () => {
      const nextMessage = messageQueue[0];

      if (
        !shouldShowNotification(character.settings) ||
        shouldBufferNotification(
          nextMessage.message.type,
          lastNotificationTime.current,
          character.settings
        )
      ) {
        return;
      }

      setCurrentMessage(nextMessage);
      setMessageQueue((prev) => prev.slice(1));
      lastNotificationTime.current = new Date();

      // Check if message should be interactive
      setIsInteractive(['quest', 'event'].includes(nextMessage.message.type));

      // Auto-dismiss after duration based on content length and type
      const baseDuration = 3000;
      const contentLength = nextMessage.message.content.length;
      const typeDuration = {
        system: 1.5,
        event: 1.3,
        quest: 1.2,
        normal: 1,
      };
      const multiplier =
        typeDuration[nextMessage.message.type as keyof typeof typeDuration] ||
        1;
      const duration = Math.min(
        baseDuration + contentLength * 50 * multiplier,
        8000
      );

      const timeoutId = setTimeout(() => {
        if (currentMessage) {
          markMessageAsRead(nextMessage.message.id);
          updatePreference(nextMessage.message.type, 'dismiss');
          setCurrentMessage(null);
          setIsInteractive(false);
        }
      }, duration);

      return () => clearTimeout(timeoutId);
    };

    const checkInterval = setInterval(showNextMessage, 1000);
    showNextMessage(); // Initial check

    return () => clearInterval(checkInterval);
  }, [
    messageQueue,
    currentMessage,
    character.settings,
    markMessageAsRead,
    updatePreference,
  ]);

  const handleInteraction = (action: 'positive' | 'negative') => {
    if (!currentMessage) return;

    markMessageAsRead(currentMessage.message.id);
    updatePreference(
      currentMessage.message.type,
      action === 'positive' ? 'click' : 'dismiss'
    );

    // Award experience for positive interactions
    if (action === 'positive') {
      gainExperience({ type: 'interaction', multiplier: 1.2 });
    }

    setCurrentMessage(null);
    setIsInteractive(false);
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'quest':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'event':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'system':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-white border-gray-200 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      {currentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className={`absolute bottom-full right-0 mb-2 w-full sm:w-64 max-w-[250px] p-2 sm:p-4 rounded-lg shadow-lg border ${getMessageStyle(
            currentMessage.message.type
          )}`}
        >
          <p className="text-xs sm:text-sm whitespace-pre-wrap">
            {currentMessage.message.content}
          </p>

          {isInteractive && (
            <div className="mt-2 sm:mt-3 flex justify-end gap-1 sm:gap-2">
              <button
                onClick={() => handleInteraction('negative')}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                나중에
              </button>
              <button
                onClick={() => handleInteraction('positive')}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
              >
                확인
              </button>
            </div>
          )}

          <div
            className="absolute -bottom-2 right-4 w-3 sm:w-4 h-3 sm:h-4 transform rotate-45"
            style={{
              backgroundColor: 'inherit',
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'inherit',
            }}
          />

          {messageQueue.length > 0 && (
            <div className="absolute top-1 right-1">
              <span className="inline-flex items-center justify-center h-3 w-3 sm:h-4 sm:w-4 bg-blue-500 text-white text-[10px] sm:text-xs rounded-full">
                {messageQueue.length}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
