import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const runeId = params.id;

  try {
    // 룬 한줄평 가져오기
    const { data: reviews, error } = await supabase
      .from('rune_reviews')
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
      .eq('rune_id', runeId)
      .eq('is_blinded', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rune reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 현재 로그인한 사용자의 좋아요/싫어요 상태 확인
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    let userReactions: { [key: string]: string } = {};
    if (userId) {
      const { data: reactions } = await supabase
        .from('rune_review_reactions')
        .select('review_id, reaction_type')
        .eq('user_id', userId)
        .in(
          'review_id',
          reviews.map((r) => r.id)
        );

      userReactions =
        reactions?.reduce((acc, reaction) => {
          acc[reaction.review_id] = reaction.reaction_type;
          return acc;
        }, {} as { [key: string]: string }) || {};
    }

    // 리뷰 데이터 포맷팅
    type User = { id: string; full_name?: string; avatar_url?: string };
    const formattedReviews = reviews.map((review) => {
      const users = review.users as User | User[] | undefined;
      return {
        id: review.id,
        content: review.content,
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
        createdAt: review.created_at,
        likes: review.likes || 0,
        dislikes: review.dislikes || 0,
        isLiked: userReactions[review.id] === 'like',
        isDisliked: userReactions[review.id] === 'dislike',
        isBlinded: review.is_blinded,
      };
    });

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Unexpected error in rune reviews GET:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const runeId = params.id;

  // 로그인한 사용자 확인
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '한줄평 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (content.length > 100) {
      return NextResponse.json(
        { error: '한줄평은 100자 이내여야 합니다.' },
        { status: 400 }
      );
    }

    const userId = session.session.user.id;

    // 이미 해당 룬에 대한 한줄평을 작성했는지 확인
    const { data: existingReviews } = await supabase
      .from('rune_reviews')
      .select('id')
      .eq('rune_id', runeId)
      .eq('user_id', userId);

    if (existingReviews && existingReviews.length > 0) {
      return NextResponse.json(
        { error: '이미 이 룬에 대한 한줄평을 작성하셨습니다.' },
        { status: 400 }
      );
    }

    // 새 한줄평 생성
    const { data: review, error } = await supabase
      .from('rune_reviews')
      .insert({
        rune_id: runeId,
        user_id: userId,
        content,
      })
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
      console.error('Error creating rune review:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // User 타입 재정의
    type User = { id: string; full_name?: string; avatar_url?: string };
    const users = review.users as User | User[] | undefined;
    return NextResponse.json({
      id: review.id,
      content: review.content,
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
      createdAt: review.created_at,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      isBlinded: false,
    });
  } catch (error) {
    console.error('Unexpected error in rune review POST:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
