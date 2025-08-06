import { promises as fs } from 'fs';
import path from 'path';

export interface CommunityPost {
  id: string;
  nickname: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
  likes: number;
  replies: number;
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'community-posts.json');

// 디렉토리 생성 보장
async function ensureDataDirectory() {
  const dataDir = path.dirname(STORAGE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 모든 게시글 가져오기
export async function getAllPosts(): Promise<CommunityPost[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const posts = JSON.parse(data);
    // 최신순으로 정렬
    return posts.sort((a: CommunityPost, b: CommunityPost) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    // 파일이 없으면 초기 데이터 반환
    return getInitialPosts();
  }
}

// 새 게시글 추가
export async function createPost(postData: {
  nickname: string;
  title: string;
  content: string;
  tags: string[];
}): Promise<CommunityPost> {
  await ensureDataDirectory();
  
  const newPost: CommunityPost = {
    id: generateId(),
    nickname: postData.nickname,
    title: postData.title,
    content: postData.content,
    tags: postData.tags,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: 0
  };

  const posts = await getAllPosts();
  posts.unshift(newPost); // 최신 글을 맨 앞에 추가

  await fs.writeFile(STORAGE_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  return newPost;
}

// 게시글 좋아요 증가
export async function likePost(postId: string): Promise<CommunityPost | null> {
  const posts = await getAllPosts();
  const post = posts.find(p => p.id === postId);
  
  if (!post) return null;
  
  post.likes += 1;
  await fs.writeFile(STORAGE_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  return post;
}

// 유니크 ID 생성
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 초기 더미 데이터
function getInitialPosts(): CommunityPost[] {
  return [
    {
      id: 'init_1',
      nickname: '말하는감자42',
      title: '발표에서 완전 감자였어요...',
      content: '오늘 발표에서 완전 감자였어요... 교수님이 뭔 말을 하는지 하나도 모르겠더라구요 😅 그래도 열심히 준비했는데 왜 이렇게 긴장되면 머리가 하얘지는 걸까요?',
      tags: ['😅 당황', '🤔 고민'],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
      likes: 24,
      replies: 8
    },
    {
      id: 'init_2',
      nickname: '굴러가는감자7',
      title: '과제 제출 5분전의 고민',
      content: '과제 제출 5분전에 발견한 감자의 고민... 이번엔 정말 미안해요 😂 분명 어제까지 여유있었는데 왜 갑자기 시간이 이렇게 빠르게 가는 걸까요?',
      tags: ['😭 슬픔', '🙄 짜증'],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
      likes: 38,
      replies: 12
    },
    {
      id: 'init_3',
      nickname: '졸린감자15',
      title: '시험공부하다 잠든 감자의 변명',
      content: '시험공부하다가 잠들어버린 감자의 변명... 알람이 울렸는데도 못들었어요 😴 이번엔 정말 마지막이에요! 다음엔 꼭 미리미리 준비할게요...',
      tags: ['😴 피곤', '💪 힘냄'],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
      likes: 45,
      replies: 15
    }
  ];
}