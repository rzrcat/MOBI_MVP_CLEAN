import { supabase } from '@/lib/supabase/supabaseClient';

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  } catch (e) {
    console.error('Error signing in with Google:', e);
    return { data: null, error: e };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (e) {
    console.error('Error signing out:', e);
    return { error: e };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (e) {
    console.error('Error getting current user:', e);
    // 오류가 발생하면 사용자가 없는 것으로 처리
    return { user: null, error: e };
  }
};
