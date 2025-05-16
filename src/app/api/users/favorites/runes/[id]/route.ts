import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 즐겨찾기 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const runeId = params.id;

  // 로그인한 사용자 확인
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return NextResponse.json({ isFavorite: false });
  }

  const userId = session.session.user.id;

  try {
    // 즐겨찾기 여부 확인
    const { data } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', runeId)
      .eq('item_type', 'rune')
      .maybeSingle();

    return NextResponse.json({ isFavorite: !!data });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// 즐겨찾기 추가
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

  const userId = session.session.user.id;

  try {
    // 이미 즐겨찾기에 있는지 확인
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', runeId)
      .eq('item_type', 'rune')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, isFavorite: true });
    }

    // 즐겨찾기에 추가
    const { error } = await supabase.from('user_favorites').insert({
      user_id: userId,
      item_id: runeId,
      item_type: 'rune',
    });

    if (error) {
      console.error('Error adding to favorites:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, isFavorite: true });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// 즐겨찾기 삭제
export async function DELETE(
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

  const userId = session.session.user.id;

  try {
    // 즐겨찾기에서 삭제
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', runeId)
      .eq('item_type', 'rune');

    if (error) {
      console.error('Error removing from favorites:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, isFavorite: false });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
