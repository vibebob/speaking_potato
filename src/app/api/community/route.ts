import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllPosts, 
  createPost, 
  generateRandomNickname,
  getClientIP 
} from '@/lib/community-service';

// GET: 모든 게시글 가져오기
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return NextResponse.json(
      { error: '게시글을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// POST: 새 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, title, content, tags } = body;

    // 게시글 생성 (유효성 검사는 서비스 레이어에서 처리)
    const newPost = await createPost({
      nickname: nickname?.trim() || generateRandomNickname(),
      title: title?.trim() || '',
      content: content?.trim() || '',
      tags: Array.isArray(tags) ? tags : []
    });

    return NextResponse.json({ 
      message: '게시글이 성공적으로 작성되었습니다',
      post: newPost 
    }, { status: 201 });

  } catch (error) {
    console.error('게시글 작성 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '게시글 작성에 실패했습니다';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}