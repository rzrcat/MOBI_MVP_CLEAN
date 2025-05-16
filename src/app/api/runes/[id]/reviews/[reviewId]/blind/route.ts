import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { reviewId } = params;

  // 로그인한 사용자 확인
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const userId = session.session.user.id;

  try {
    // 관리자 권한 확인
    const { data: adminRoles } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', userId);

    if (!adminRoles || adminRoles.length === 0) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 현재 한줄평 상태 확인
    const { data: currentReview } = await supabase
      .from('rune_reviews')
      .select('is_blinded')
      .eq('id', reviewId)
      .single();

    if (!currentReview) {
      return NextResponse.json(
        { error: '한줄평을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const newBlindedState = !currentReview.is_blinded;

    // 한줄평 숨김 상태 토글
    const { data: updatedReview, error } = await supabase
      .from('rune_reviews')
      .update({ is_blinded: newBlindedState })
      .eq('id', reviewId)
      .select(
        `
        id, 
        content, 
        created_at,
        likes,
        dislikes,
        is_blinded,
        users:user_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      console.error('Error toggling rune review blind status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // users 타입 단언
    type User = { id: string; full_name?: string; avatar_url?: string };
    const users = updatedReview.users as User | User[] | undefined;

    return NextResponse.json({
      id: updatedReview.id,
      content: updatedReview.content,
      author: Array.isArray(users)
        ? {
            id: users[0]?.id,
            name: users[0]?.full_name || '익명 사용자',
            avatar: users[0]?.avatar_url,
          }
        : {
            id: users?.id,
            name: users?.full_name || '익명 사용자',
            avatar: users?.avatar_url,
          },
      createdAt: updatedReview.created_at,
      likes: updatedReview.likes || 0,
      dislikes: updatedReview.dislikes || 0,
      isBlinded: updatedReview.is_blinded,
    });
  } catch (error) {
    console.error('Unexpected error in rune review blind toggle:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
