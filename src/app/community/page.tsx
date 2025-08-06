'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import CreatePostModal from '@/components/CreatePostModal';
import { CommunityPost } from '@/lib/supabase';

export default function CommunityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 게시글 목록 로드
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community');
      if (!response.ok) throw new Error('게시글을 불러올 수 없습니다');
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 게시글 불러오기
  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (post: {
    nickname: string;
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '게시글 작성에 실패했습니다');
      }

      // 성공 후 게시글 목록 새로고침
      await loadPosts();
      
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '게시글 작성에 실패했습니다');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('좋아요 처리에 실패했습니다');

      // 게시글 목록 새로고침
      await loadPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다');
    }
  };

  // 시간 포맷팅
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return diffMinutes < 1 ? '방금 전' : `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return `${Math.floor(diffHours / 24)}일 전`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl px-6">
        {/* 네비게이션 탭 */}
        <div className="pb-6 flex justify-center">
          <div className="flex bg-white rounded-2xl shadow-lg p-2 border-2 border-amber-200 w-[600px]">
            <Link href="/" className="flex-1 text-center py-3 px-4 rounded-xl font-bold text-amber-700 hover:bg-amber-50 transition-all">
              <span className="text-lg mr-2">🥔</span>
              변명 생성기
            </Link>
            
            <button className="flex-1 text-center py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md relative">
              <span className="text-lg mr-2">💬</span>
              감자들의 대나무숲
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </button>
          </div>
        </div>

        {/* 커뮤니티 컨텐츠 */}
        <div className="flex justify-center py-4">
          <div className="main-container">
            {/* HEADER SECTION */}
            <div className="header-section">
              <div className="potato-character">🥔💬</div>
              <h1 className="main-title">감자들의 대나무숲</h1>
              <p className="subtitle">
                감자들의 솔직하고 재미있는 이야기들을 나누는 공간이에요!<br />
                익명으로 자유롭게 소통해보세요
              </p>
            </div>

            {/* 게시글 목록 섹션 */}
            {loading ? (
              <div className="text-center py-8">
                <div className="text-4xl animate-bounce mb-4">🥔</div>
                <p className="text-amber-700">감자들의 이야기를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>❌ {error}</p>
                <button 
                  onClick={loadPosts}
                  className="action-btn mt-4"
                >
                  다시 시도
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🥔💭</div>
                <p className="text-amber-700">아직 이야기가 없어요.<br />첫 번째 이야기를 남겨보세요!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="result-section">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-amber-700">🥔 {post.nickname}</span>
                      <span className="text-sm text-amber-600">{formatTimeAgo(post.timestamp)}</span>
                    </div>
                    
                    {/* 태그 표시 */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="result-bubble">
                      <h3 className="result-text font-bold mb-2">{post.title}</h3>
                      <p className="result-text">{post.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-amber-600 justify-center">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className="hover:text-amber-800 transition-colors"
                      >
                        🥔 {post.likes}
                      </button>
                      <span>💬 {post.replies}</span>
                      <button className="hover:text-amber-800 transition-colors">
                        📤 공유
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BUTTON SECTION */}
            <div className="button-section">
              <button 
                className="generate-btn"
                onClick={() => setIsModalOpen(true)}
              >
                ✍️ 새 이야기 작성하기
              </button>
            </div>

            {/* FOOTER SECTION */}
            <div className="footer-section">
              감자들의 익명 소통 공간 💬<br />
              <small className="footer-disclaimer">
                ※ 제작자 : Vivebob / bobstudybob@gmail.com 
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* 새 게시글 작성 모달 */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
} 