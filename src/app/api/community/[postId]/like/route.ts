import { NextRequest, NextResponse } from 'next/server';
import { togglePostLike, getClientIP } from '@/lib/community-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { error: '게시글 ID가 필요합니다' },
        { status: 400 }
      );
    }

    // 사용자 IP 가져오기
    const userIP = getClientIP(request.headers);

    const result = await togglePostLike(postId, userIP);

    return NextResponse.json({
      message: result.liked ? '좋아요가 추가되었습니다' : '좋아요가 취소되었습니다',
      liked: result.liked,
      post: result.post
    });

  } catch (error) {
    console.error('좋아요 처리 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '좋아요 처리에 실패했습니다';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}