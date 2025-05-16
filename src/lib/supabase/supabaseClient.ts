import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'temp-key';

// 개발 환경에서 환경 변수가 없을 때 경고 표시만 하고 진행합니다
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn('Missing Supabase environment variables. Using dummy client.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
