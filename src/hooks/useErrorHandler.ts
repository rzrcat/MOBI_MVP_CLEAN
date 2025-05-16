import { useState, useCallback } from 'react';

interface ErrorHandlerResult<T, Args extends unknown[]> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * 비동기 작업 수행 시 에러를 처리하는 훅
 *
 * @param asyncFunction 실행할 비동기 함수
 * @returns 데이터, 에러, 로딩 상태 및 함수 실행/리셋 함수
 */
export function useErrorHandler<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
): ErrorHandlerResult<T, Args> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        console.error('작업 수행 중 오류 발생:', errorObj);
        setError(errorObj);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
}

/**
 * 함수 호출 시 에러를 처리하는 래퍼 함수
 *
 * @param fn 래핑할 원본 함수
 * @param fallback 에러 발생 시 반환할 기본값
 * @param errorHandler 에러 핸들러 함수
 * @returns 래핑된 안전한 함수
 */
export function withErrorHandling<T, Args extends unknown[]>(
  fn: (...args: Args) => T,
  fallback: T,
  errorHandler?: (error: Error) => void
): (...args: Args) => T {
  return (...args: Args): T => {
    try {
      return fn(...args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('함수 실행 중 오류 발생:', error);

      if (errorHandler) {
        errorHandler(error);
      }

      return fallback;
    }
  };
}
