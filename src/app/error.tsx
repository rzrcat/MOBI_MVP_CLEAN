'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류 로깅
    console.error('전역 오류 발생:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          앗! 문제가 발생했습니다.
        </h2>
        <p className="text-gray-700 mb-6">
          애플리케이션에 오류가 발생했지만, 걱정하지 마세요. 이 문제를 해결하기
          위해 노력하고 있습니다.
        </p>
        <div className="bg-gray-100 p-4 rounded mb-6 text-sm overflow-auto max-h-36">
          <code className="text-red-500">
            {error.message || '알 수 없는 오류'}
          </code>
        </div>
        <button
          onClick={reset}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
