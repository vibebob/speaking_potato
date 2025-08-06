import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 클라이언트 사이드용 (익명 키 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 (서비스 롤 키 사용 - 관리자 권한)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// 데이터베이스 타입 정의
export interface CommunityPost {
  id: string;
  nickname: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface CommunityReply {
  id: string;
  post_id: string;
  nickname: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityLike {
  id: string;
  post_id: string;
  user_ip: string;
  created_at: string;
}