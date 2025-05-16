import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 정보 수정 제안 목록 조회 (관리자용)
export async function GET(
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

  // 관리자 권한 확인
  const { data: adminRoles } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', userId);
  const isAdmin = adminRoles && adminRoles.length > 0;

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin permission required' },
      { status: 403 }
    );
  }

  try {
    // 제안 목록 가져오기
    const { data: proposals, error } = await supabase
      .from('info_proposals')
      .select(
        `
        id,
        content,
        status,
        created_at,
        updated_at,
        users:user_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('item_id', runeId)
      .eq('item_type', 'rune')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error in proposals GET:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// 정보 수정 제안 등록
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
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '제안 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: '제안 내용은 1000자 이내여야 합니다.' },
        { status: 400 }
      );
    }

    // 정보 수정 제안 등록
    const { data: proposal, error } = await supabase
      .from('info_proposals')
      .insert({
        user_id: userId,
        item_id: runeId,
        item_type: 'rune',
        content: content,
        status: 'pending', // 대기 상태로 시작
      })
      .select();

    if (error) {
      console.error('Error creating proposal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: proposal[0].id });
  } catch (error) {
    console.error('Error in proposal POST:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
