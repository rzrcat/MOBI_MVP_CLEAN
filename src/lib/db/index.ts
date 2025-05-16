import { supabase } from '@/lib/supabase/supabaseClient';

// 가상 데이터베이스 인터페이스 정의
export const db = {
  // 룬 관련 쿼리
  runeComment: {
    findMany: async ({ where, orderBy }) => {
      const { data, error } = await supabase
        .from('rune_comments')
        .select('*')
        .eq('runeId', where.runeId)
        .order(orderBy.createdAt === 'desc' ? 'created_at' : 'created_at', {
          ascending: orderBy.createdAt !== 'desc',
        });

      if (error) throw error;
      return data || [];
    },
    findUnique: async ({ where }) => {
      const { data, error } = await supabase
        .from('rune_comments')
        .select('*')
        .eq('id', where.id)
        .single();

      if (error) return null;
      return data;
    },
    create: async ({ data }) => {
      const { data: result, error } = await supabase
        .from('rune_comments')
        .insert([
          {
            rune_id: data.runeId,
            user_id: data.userId,
            user_name: data.userName,
            content: data.content,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    update: async ({ where, data }) => {
      const { data: result, error } = await supabase
        .from('rune_comments')
        .update({
          content: data.content,
          updated_at: data.updatedAt.toISOString(),
        })
        .eq('id', where.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    delete: async ({ where }) => {
      const { error } = await supabase
        .from('rune_comments')
        .delete()
        .eq('id', where.id);

      if (error) throw error;
      return true;
    },
  },
};
