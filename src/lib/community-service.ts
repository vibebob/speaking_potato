import { supabase, supabaseAdmin, CommunityPost } from './supabase';

// 클라이언트 IP 가져오기 (서버 사이드에서 사용)
function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const real = headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real.trim();
  }
  return '127.0.0.1';
}

// 모든 게시글 가져오기
export async function getAllPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('게시글 조회 오류:', error);
    throw new Error('게시글을 불러올 수 없습니다');
  }

  return data || [];
}

// 새 게시글 작성
export async function createPost(postData: {
  nickname: string;
  title: string;
  content: string;
  tags: string[];
}): Promise<CommunityPost> {
  // 입력 유효성 검사
  if (!postData.title.trim() || !postData.content.trim()) {
    throw new Error('제목과 내용은 필수입니다');
  }

  if (postData.title.length > 50) {
    throw new Error('제목은 50자를 초과할 수 없습니다');
  }

  if (postData.content.length > 200) {
    throw new Error('내용은 200자를 초과할 수 없습니다');
  }

  if (postData.nickname.length > 20) {
    throw new Error('닉네임은 20자를 초과할 수 없습니다');
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      nickname: postData.nickname.trim(),
      title: postData.title.trim(),
      content: postData.content.trim(),
      tags: postData.tags
    }])
    .select()
    .single();

  if (error) {
    console.error('게시글 작성 오류:', error);
    throw new Error('게시글 작성에 실패했습니다');
  }

  return data;
}

// 좋아요 토글 (IP 기반 중복 방지)
export async function togglePostLike(postId: string, userIP: string): Promise<{
  liked: boolean;
  post: CommunityPost;
}> {
  // 이미 좋아요를 눌렀는지 확인
  const { data: existingLike } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_ip', userIP)
    .single();

  if (existingLike) {
    // 좋아요 취소
    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_ip', userIP);

    if (error) {
      console.error('좋아요 취소 오류:', error);
      throw new Error('좋아요 취소에 실패했습니다');
    }
  } else {
    // 좋아요 추가
    const { error } = await supabase
      .from('community_likes')
      .insert([{
        post_id: postId,
        user_ip: userIP
      }]);

    if (error) {
      console.error('좋아요 추가 오류:', error);
      throw new Error('좋아요 추가에 실패했습니다');
    }
  }

  // 업데이트된 게시글 정보 가져오기
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError || !post) {
    console.error('게시글 조회 오류:', postError);
    throw new Error('게시글을 찾을 수 없습니다');
  }

  return {
    liked: !existingLike,
    post
  };
}

// 특정 게시글의 좋아요 상태 확인 (IP 기반)
export async function checkUserLiked(postId: string, userIP: string): Promise<boolean> {
  const { data } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_ip', userIP)
    .single();

  return !!data;
}

// 비활성 게시글 정리 (관리자 권한 필요)
export async function cleanupInactivePosts(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .rpc('cleanup_inactive_posts');

  if (error) {
    console.error('정리 작업 오류:', error);
    throw new Error('정리 작업에 실패했습니다');
  }

  return data || 0;
}

// 데이터베이스 연결 테스트
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('count')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('데이터베이스 연결 테스트 실패:', error);
    return false;
  }
}

// 랜덤 닉네임 생성
export function generateRandomNickname(): string {
  const POTATO_NAMES = [
    '말하는감자', '굴러가는감자', '졸린감자', '배고픈감자', '바쁜감자',
    '행복한감자', '슬픈감자', '화난감자', '신난감자', '피곤한감자',
    '멋진감자', '귀여운감자', '똑똑한감자', '재미있는감자', '활발한감자'
  ];
  
  const randomName = POTATO_NAMES[Math.floor(Math.random() * POTATO_NAMES.length)];
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  return `${randomName}${randomNumber}`;
}

export { getClientIP };