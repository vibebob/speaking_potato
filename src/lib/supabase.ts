import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 연결 테스트 함수
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('count')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return { success: true, message: '데이터베이스 연결이 정상입니다' }
  } catch (error) {
    return { 
      success: false, 
      message: `데이터베이스 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
    }
  }
}

// 게시글 타입 정의
export interface CommunityPost {
  id: string
  anonymous_name: string
  content: string
  category: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  is_active: boolean
}

// 댓글 타입 정의
export interface CommunityReply {
  id: string
  post_id: string
  anonymous_name: string
  content: string
  created_at: string
  updated_at: string
  is_active: boolean
}

// 게시글 목록 조회
export async function getCommunityPosts(limit: number = 10) {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw error
  }
  
  return data as CommunityPost[]
}

// 게시글 작성
export async function createCommunityPost(post: {
  anonymous_name: string
  content: string
  category?: string
}) {
  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      anonymous_name: post.anonymous_name,
      content: post.content,
      category: post.category || 'general'
    }])
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data as CommunityPost
}

// 댓글 목록 조회
export async function getCommunityReplies(postId: string) {
  const { data, error } = await supabase
    .from('community_replies')
    .select('*')
    .eq('post_id', postId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    throw error
  }
  
  return data as CommunityReply[]
}

// 댓글 작성
export async function createCommunityReply(reply: {
  post_id: string
  anonymous_name: string
  content: string
}) {
  const { data, error } = await supabase
    .from('community_replies')
    .insert([{
      post_id: reply.post_id,
      anonymous_name: reply.anonymous_name,
      content: reply.content
    }])
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data as CommunityReply
}

// 좋아요 토글
export async function toggleLike(postId: string, ipAddress: string) {
  // 기존 좋아요 확인
  const { data: existingLike } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('ip_address', ipAddress)
    .single()
  
  if (existingLike) {
    // 좋아요 삭제
    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('ip_address', ipAddress)
    
    if (error) throw error
    return { liked: false }
  } else {
    // 좋아요 추가
    const { error } = await supabase
      .from('community_likes')
      .insert([{
        post_id: postId,
        ip_address: ipAddress
      }])
    
    if (error) throw error
    return { liked: true }
  }
}

// 정리 작업 실행
export async function cleanupInactivePosts() {
  const { data, error } = await supabase
    .rpc('cleanup_inactive_posts')
  
  if (error) {
    throw error
  }
  
  return data
}