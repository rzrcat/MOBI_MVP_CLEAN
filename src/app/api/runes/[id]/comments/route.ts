import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // 인증 라이브러리 (구현 필요)
import { db } from '@/lib/db'; // 데이터베이스 라이브러리 (구현 필요)

// 코멘트 목록 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await db.runeComment.findMany({
      where: {
        runeId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: '코멘트를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 코멘트 작성
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content || content.length > 300) {
      return NextResponse.json(
        { error: '올바른 코멘트 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const comment = await db.runeComment.create({
      data: {
        runeId: params.id,
        userId: session.user.id,
        userName: session.user.name,
        content,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: '코멘트 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 코멘트 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content || content.length > 300) {
      return NextResponse.json(
        { error: '올바른 코멘트 내용을 입력해주세요.' },
        { status: 400 }
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

    if (comment.userId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: '코멘트를 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    const updatedComment = await db.runeComment.update({
      where: { id: params.commentId },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: '코멘트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 코멘트 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
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

    if (comment.userId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: '코멘트를 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    await db.runeComment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: '코멘트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
