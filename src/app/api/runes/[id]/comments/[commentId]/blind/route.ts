import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const comment = await db.runeComment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '코멘트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedComment = await db.runeComment.update({
      where: { id: params.commentId },
      data: {
        isBlinded: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error blinding comment:', error);
    return NextResponse.json(
      { error: '코멘트 블라인드 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
