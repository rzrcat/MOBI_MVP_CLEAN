import { supabase } from '@/lib/supabase/supabaseClient';

// 단순한 인증 미들웨어 역할을 하는 함수
export const auth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    // 사용자 정보 반환
    return {
      user: {
        id: data.session.user.id,
        name:
          data.session.user.user_metadata?.name ||
          data.session.user.email?.split('@')[0] ||
          '익명',
        email: data.session.user.email,
        isAdmin: data.session.user.email?.endsWith('@admin.com') || false, // 간단한 관리자 체크 로직
      },
    };
  } catch (e) {
    console.error('인증 처리 오류:', e);
    return null;
  }
};
