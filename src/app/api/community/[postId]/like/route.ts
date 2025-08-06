import { NextRequest, NextResponse } from 'next/server';
import { toggleLike } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    
    // 클라이언트 IP 주소 가져오기
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || request.ip || '127.0.0.1';

    // 좋아요 토글 실행
    const result = await toggleLike(postId, ip);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}