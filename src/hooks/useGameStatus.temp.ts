'use client';

import { useState, useEffect } from 'react';
import { useHelperStore } from '@/store/useHelperStore';
import {
  GameServer,
  ServerStatus,
} from '@/types/games/mabinogi_mobile/crawler';

export function useGameStatus() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<GameServer[]>([]);

  const addMessage = useHelperStore((state) => state.addMessage);
  const setAnimation = useHelperStore((state) => state.setAnimation);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/games/mabinogi_mobile/servers');

        if (!response.ok) {
          throw new Error('서버 상태를 가져오는데 실패했습니다.');
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
          // Check if there's a change in server status
          if (serverStatus.length > 0) {
            const prevAllMaintenance = serverStatus.every(
              (s) => s.status === 'maintenance'
            );
            const newAllMaintenance = data.every(
              (s) => s.status === 'maintenance'
            );

            if (prevAllMaintenance && !newAllMaintenance) {
              addMessage({
                content: '서버가 정상 작동 중입니다!',
                type: 'system',
              });
              setAnimation('happy');
              setTimeout(() => setAnimation(null), 3000);
            } else if (!prevAllMaintenance && newAllMaintenance) {
              addMessage({
                content: '현재 모든 서버가 점검 중입니다.',
                type: 'system',
              });
              setAnimation('sad');
              setTimeout(() => setAnimation(null), 3000);
            }
          }

          setServerStatus(data);
        } else {
          throw new Error('올바른 형식의 서버 데이터를 받지 못했습니다.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
        console.error('서버 상태 확인 중 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    // 초기 로드
    fetchServerStatus();

    // 5분마다 자동 갱신
    const interval = setInterval(
      () => {
        fetchServerStatus();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [addMessage, setAnimation, serverStatus]);

  const getCrowdedLevel = (
    status: ServerStatus,
    population: number
  ): string => {
    if (status === 'maintenance') return '점검중';
    if (status === 'crowded') return '혼잡';
    if (status === 'busy') return '바쁨';
    if (population > 70) return '많음';
    if (population > 40) return '보통';
    return '적음';
  };

  const getServersByRegion = (region: string): GameServer[] => {
    return serverStatus.filter((server) => server.region === region);
  };

  return {
    loading,
    error,
    serverStatus,
    getServersByRegion,
    getCrowdedLevel,
    regions: [...new Set(serverStatus.map((server) => server.region))],
  };
}
