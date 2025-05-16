import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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
    // 현재 리뷰 상태 확인
    const { data: review } = await supabase
      .from('rune_reviews')
      .select('likes, dislikes, is_blinded')
      .eq('id', reviewId)
      .single();

    if (!review) {
      return NextResponse.json(
        { error: '한줄평을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (review.is_blinded) {
      return NextResponse.json(
        { error: '숨김 처리된 한줄평에는 반응할 수 없습니다.' },
        { status: 403 }
      );
    }

    // 현재 사용자의 반응 확인
    const { data: userReaction } = await supabase
      .from('rune_review_reactions')
      .select('reaction_type')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .maybeSingle();

    let likes = review.likes || 0;
    let dislikes = review.dislikes || 0;
    let isLiked = false;
    const isDisliked = false;

    // 트랜잭션 시작
    // 1. 기존 반응이 있다면 업데이트, 없다면 새로 생성
    if (userReaction) {
      if (userReaction.reaction_type === 'like') {
        // 좋아요 취소
        await supabase
          .from('rune_review_reactions')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userId);
        likes--;
      } else {
        // 싫어요에서 좋아요로 변경
        await supabase
          .from('rune_review_reactions')
          .update({ reaction_type: 'like' })
          .eq('review_id', reviewId)
          .eq('user_id', userId);
        likes++;
        dislikes--;
        isLiked = true;
      }
    } else {
      // 새로 좋아요 추가
      await supabase.from('rune_review_reactions').insert({
        review_id: reviewId,
        user_id: userId,
        reaction_type: 'like',
      });
      likes++;
      isLiked = true;
    }

    // 2. 리뷰의 좋아요/싫어요 카운트 업데이트
    await supabase
      .from('rune_reviews')
      .update({ likes, dislikes })
      .eq('id', reviewId);

    return NextResponse.json({
      likes,
      dislikes,
      isLiked,
      isDisliked,
    });
  } catch (error) {
    console.error('Error in rune review like:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
