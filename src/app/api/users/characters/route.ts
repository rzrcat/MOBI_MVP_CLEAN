import { NextRequest, NextResponse } from 'next/server';
import { getServerNameList } from '@/lib/games/mabinogi_mobile/servers';

// 임시 메모리 저장소 (userId별 캐릭터 배열)
const userCharacters: Record<
  string,
  { id: string; name: string; server: string }[]
> = {};

// 인증 유저 ID 추출 (실제 서비스에서는 JWT/세션 등 사용)
function getUserId(req: NextRequest): string | null {
  // 예시: 헤더에서 user-id 추출 (실제 구현에서는 인증 미들웨어 사용)
  return req.headers.get('x-user-id');
}

// 서버 목록을 가져오는 함수
async function getServerList(): Promise<string[]> {
  try {
    return await getServerNameList();
  } catch (error) {
    console.error('서버 목록 가져오기 실패:', error);
    // 오류 발생 시 기본 서버 목록 반환
    return ['데이안', '아이라', '던컨', '알리사', '메이븐', '라사', '칼릭스'];
  }
}

export async function GET(req: NextRequest) {
  const serverParam = req.nextUrl.searchParams.get('servers');

  // 서버 목록 요청 시 인증 우회
  if (serverParam === 'list') {
    const serverList = await getServerList();
    return NextResponse.json({ servers: serverList });
  }

  // 서버 목록 외 요청은 인증 필요
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(userCharacters[userId] || []);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, server } = await req.json();
  if (!name || !server) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 서버 유효성 검사
  const serverList = await getServerList();
  if (!serverList.includes(server)) {
    return NextResponse.json({ error: 'Invalid server' }, { status: 400 });
  }

  userCharacters[userId] = userCharacters[userId] || [];
  // 중복 방지
  if (
    userCharacters[userId].some((c) => c.name === name && c.server === server)
  ) {
    return NextResponse.json({ error: 'Duplicate character' }, { status: 409 });
  }
  const id = Math.random().toString(36).slice(2, 10);
  const newChar = { id, name, server };
  userCharacters[userId].push(newChar);
  return NextResponse.json(newChar);
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, name, server } = await req.json();
  if (!id || !name || !server) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 서버 유효성 검사
  const serverList = await getServerList();
  if (!serverList.includes(server)) {
    return NextResponse.json({ error: 'Invalid server' }, { status: 400 });
  }

  const chars = userCharacters[userId] || [];
  const idx = chars.findIndex((c) => c.id === id);
  if (idx === -1)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // 중복 방지(본인 제외)
  if (
    chars.some((c) => c.id !== id && c.name === name && c.server === server)
  ) {
    return NextResponse.json({ error: 'Duplicate character' }, { status: 409 });
  }
  chars[idx] = { id, name, server };
  return NextResponse.json(chars[idx]);
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  userCharacters[userId] = (userCharacters[userId] || []).filter(
    (c) => c.id !== id
  );
  return NextResponse.json({ success: true });
}
