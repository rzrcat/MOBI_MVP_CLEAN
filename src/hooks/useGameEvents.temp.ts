'use client';

import { useState, useEffect } from 'react';
import { useHelperStore } from '@/store/useHelperStore';
import { GameEvent } from '@/types/games/mabinogi_mobile/crawler';
import { useNotifications } from './useNotifications';

export function useGameEvents() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);

  const addMessage = useHelperStore((state) => state.addMessage);
  const setAnimation = useHelperStore((state) => state.setAnimation);
  const { scheduleNotification } = useNotifications();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/games/mabinogi_mobile/events');

        if (!response.ok) {
          throw new Error('이벤트 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
          setEvents(data);

          // 새로운 이벤트 알림
          const now = new Date().getTime();
          const recentEvents = data.filter((event) => {
            const startDate = new Date(event.startDate).getTime();
            // 지난 24시간 이내에 시작된 이벤트
            return now - startDate < 24 * 60 * 60 * 1000 && startDate <= now;
          });

          if (recentEvents.length > 0 && !loading) {
            addMessage({
              content: `${recentEvents.length}개의 새로운 이벤트가 시작되었습니다!`,
              type: 'event',
            });
            setAnimation('excited');
            setTimeout(() => setAnimation(null), 3000);

            // 이벤트 알림 스케줄링
            recentEvents.forEach((event) => {
              scheduleNotification({
                title: '새 이벤트 알림',
                body: `${event.title} 이벤트가 시작되었습니다!`,
                data: { eventId: event.id },
                delay: 0, // 즉시 알림
              });
            });
          }

          // 곧 종료되는 이벤트 알림 스케줄링
          const endingSoonEvents = data.filter((event) => {
            const endDate = new Date(event.endDate).getTime();
            // 24시간 이내에 종료되는 이벤트
            return endDate - now < 24 * 60 * 60 * 1000 && endDate > now;
          });

          endingSoonEvents.forEach((event) => {
            scheduleNotification({
              title: '이벤트 종료 알림',
              body: `${event.title} 이벤트가 곧 종료됩니다!`,
              data: { eventId: event.id },
              delay:
                new Date(event.endDate).getTime() - now - 12 * 60 * 60 * 1000, // 종료 12시간 전
            });
          });
        } else {
          throw new Error('올바른 형식의 이벤트 데이터를 받지 못했습니다.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
        console.error('이벤트 정보 확인 중 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    // 초기 로드
    fetchEvents();

    // 1시간마다 자동 갱신
    const interval = setInterval(
      () => {
        fetchEvents();
      },
      60 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [addMessage, setAnimation, scheduleNotification, loading]);

  const getEventsByCategory = (category: string): GameEvent[] => {
    return events.filter((event) => event.category === category);
  };

  const getSpecialEvents = (): GameEvent[] => {
    return events.filter((event) => event.isSpecial);
  };

  return {
    loading,
    error,
    events,
    getEventsByCategory,
    getSpecialEvents,
    categories: [...new Set(events.map((event) => event.category))],
  };
}
