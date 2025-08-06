import { NextRequest, NextResponse } from 'next/server';
import { cleanupInactivePosts, testDatabaseConnection } from '@/lib/community-service';

// 비활성 게시글 정리 (관리자용)
export async function POST(request: NextRequest) {
  try {
    // 간단한 보안 키 확인 (실제 운영에서는 더 강력한 인증 필요)
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: '권한이 없습니다' },
        { status: 401 }
      );
    }

    const deletedCount = await cleanupInactivePosts();

    return NextResponse.json({
      message: `${deletedCount}개의 비활성 게시글이 정리되었습니다`,
      deletedCount
    });

  } catch (error) {
    console.error('정리 작업 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '정리 작업에 실패했습니다';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// 데이터베이스 연결 테스트
export async function GET() {
  try {
    const isConnected = await testDatabaseConnection();

    if (isConnected) {
      return NextResponse.json({
        status: 'success',
        message: '데이터베이스 연결이 정상입니다'
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: '데이터베이스 연결에 실패했습니다'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('데이터베이스 테스트 실패:', error);
    return NextResponse.json({
      status: 'error',
      message: '데이터베이스 테스트에 실패했습니다'
    }, { status: 500 });
  }
}