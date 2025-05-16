import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/auth/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);

        // 관리자 권한 체크 (실제로는 이메일이나 역할 등을 확인해야 함)
        if (currentUser?.email) {
          // 예시: 특정 이메일 도메인을 가진 사용자를 관리자로 설정
          setIsAdmin(currentUser.email.endsWith('@admin.com'));
        }
      } catch (error) {
        console.error('Auth error:', error);
        // 인증 오류가 발생해도 앱이 계속 작동하도록 설정
      } finally {
        // 로딩 상태 해제
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return { user, loading, isAdmin };
};
