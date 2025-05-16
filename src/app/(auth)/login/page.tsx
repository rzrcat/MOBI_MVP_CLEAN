'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/auth/authUtils';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: signInError } = await signInWithGoogle();
      if (signInError) {
        throw signInError;
      }
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('로그인 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            마비노기 모바일 헬퍼
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            SNS 계정으로 로그인하여 시작하세요
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="mt-8 space-y-6">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            {isLoading ? '로그인 중...' : 'Google로 로그인'}
          </Button>
        </div>
      </div>
    </div>
  );
}
