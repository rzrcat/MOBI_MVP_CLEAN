'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error('세션을 찾을 수 없습니다.');
        }

        // 사용자 정보를 Supabase에 저장
        const { error: userError } = await supabase.from('users').upsert({
          id: session.user.id,
          sns_id: session.user.id,
          nickname:
            session.user.user_metadata.name ||
            session.user.email?.split('@')[0] ||
            '익명',
          avatar_url: session.user.user_metadata.avatar_url,
        });

        if (userError) {
          throw userError;
        }

        router.push('/');
      } catch (err) {
        console.error('인증 처리 오류:', err);
        setError('인증 처리 중 문제가 발생했습니다.');
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">{error}</div>
          <p className="text-gray-600">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
