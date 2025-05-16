import { useState, useEffect } from 'react';

interface UseServerListOptions {
  game?: string;
  initialServers?: string[];
  retryCount?: number; // 재시도 횟수
  retryDelay?: number; // 재시도 지연 시간(ms)
}

/**
 * 게임 서버 목록을 가져오는 훅
 * @param options 옵션 (게임 ID, 초기 서버 목록, 재시도 옵션)
 * @returns 서버 목록 상태와 로딩/에러 상태
 */
export function useServerList({
  game = 'mabinogi_mobile',
  initialServers = [],
  retryCount = 3,
  retryDelay = 1000,
}: UseServerListOptions = {}) {
  const [servers, setServers] = useState<string[]>(initialServers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // 재귀적으로 API 호출 재시도하는 함수
    const fetchWithRetry = async (attemptCount: number) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/characters?servers=list`);

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        if (data.servers && data.servers.length > 0) {
          setServers(data.servers);
          setRetries(0); // 성공 시 재시도 카운터 리셋
        } else {
          console.warn(
            '서버 API 응답에 유효한 서버 목록이 없습니다. 기본값 사용.'
          );
        }
        setError(null);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        console.error('서버 목록 가져오기 오류:', errorObj);
        setError(errorObj);

        // 최대 재시도 횟수에 도달하지 않은 경우 재시도
        if (attemptCount < retryCount) {
          console.log(
            `${retryDelay}ms 후 재시도 (${attemptCount + 1}/${retryCount})...`
          );
          setTimeout(() => {
            setRetries(attemptCount + 1);
            fetchWithRetry(attemptCount + 1);
          }, retryDelay);
        } else {
          console.log(
            '최대 재시도 횟수에 도달했습니다. 기본 서버 목록을 사용합니다.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    // 첫 번째 시도 시작
    fetchWithRetry(retries);

    // 컴포넌트 언마운트 시 정리
    return () => {
      // 필요시 정리 작업 수행 (타이머 클리어 등)
    };
  }, [game, retryDelay, retryCount, retries]);

  // 데이터가 없을 경우 항상 기본값을 반환하도록 보장
  const safeServers = servers.length > 0 ? servers : initialServers;

  return {
    servers: safeServers,
    isLoading,
    error,
    retryFetch: () => setRetries(0), // 수동 재시도 기능 제공
  };
}
