import { supabase } from './supabase';

// 비활성 게시글 정리 함수
export async function cleanupInactivePosts(): Promise<number> {
  try {
    // 30일 이상 된 비활성 게시글 삭제
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .eq('is_active', false);

    if (error) {
      console.error('비활성 게시글 정리 실패:', error);
      throw error;
    }

    // 삭제된 행 수를 정확히 알기 어려우므로 0 반환
    return 0;
  } catch (error) {
    console.error('정리 작업 실패:', error);
    throw error;
  }
}

// 데이터베이스 연결 테스트 함수
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('community_posts')
      .select('count')
      .limit(1);

    if (error) {
      console.error('데이터베이스 연결 테스트 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('데이터베이스 연결 테스트 실패:', error);
    return false;
  }
} 