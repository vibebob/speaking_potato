'use client';

import { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost, getCommunityReplies, createCommunityReply, CommunityPost, CommunityReply } from '@/lib/supabase';
import Link from 'next/link';
import Head from 'next/head';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [replies, setReplies] = useState<{ [postId: string]: CommunityReply[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({
    anonymous_name: '',
    content: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<{ [postId: string]: boolean }>({});
  const [newReplies, setNewReplies] = useState<{ [postId: string]: { anonymous_name: string; content: string } }>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getCommunityPosts(20);
      setPosts(data);
      setError('');
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('게시글 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReplies = async (postId: string) => {
    try {
      const data = await getCommunityReplies(postId);
      setReplies(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error('댓글 로드 실패:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.anonymous_name.trim() || !newPost.content.trim()) {
      alert('이름과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityPost(newPost);
      setNewPost({ anonymous_name: '', content: '', category: 'general' });
      await loadPosts(); // 목록 새로고침
    } catch (err) {
      alert('게시글 작성에 실패했습니다.');
      console.error('게시글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 좋아요 기능 주석 처리
  /*
  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }

      const result = await response.json();
      
      // 게시글 목록 새로고침
      await loadPosts();
    } catch (err) {
      alert('좋아요 처리에 실패했습니다.');
      console.error('좋아요 실패:', err);
    }
  };
  */

  const toggleReplies = async (postId: string) => {
    const isExpanded = expandedReplies[postId];
    setExpandedReplies(prev => ({ ...prev, [postId]: !isExpanded }));
    
    if (!isExpanded && !replies[postId]) {
      await loadReplies(postId);
    }
  };

  const handleReplySubmit = async (postId: string) => {
    const reply = newReplies[postId];
    if (!reply?.anonymous_name.trim() || !reply?.content.trim()) {
      alert('이름과 내용을 모두 입력해주세요.');
      return;
    }

    if (reply.content.length > 50) {
      alert('댓글은 50자 이하로 작성해주세요.');
      return;
    }

    try {
      setIsSubmittingReply(prev => ({ ...prev, [postId]: true }));
      await createCommunityReply({
        post_id: postId,
        anonymous_name: reply.anonymous_name,
        content: reply.content
      });
      
      // 댓글 입력 초기화
      setNewReplies(prev => ({ ...prev, [postId]: { anonymous_name: '', content: '' } }));
      
      // 댓글 목록 새로고침
      await loadReplies(postId);
      
      // 게시글 목록도 새로고침 (댓글 수 업데이트)
      await loadPosts();
    } catch (err) {
      alert('댓글 작성에 실패했습니다.');
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmittingReply(prev => ({ ...prev, [postId]: false }));
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      presentation: '📊',
      homework: '📚',
      exam: '📝',
      general: '🥔'
    };
    return emojis[category] || '🥔';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <>
      <Head>
        <title>감자들의 대나무숲 💬 - 말하는 감자 변명 생성기</title>
        <meta name="description" content="말하는 감자 변명 생성기의 커뮤니티! 감자들의 솔직한 이야기를 나누는 공간입니다. 발표, 과제, 시험 등 다양한 상황에 대한 이야기를 들어보세요." />
        <meta name="keywords" content="말하는 감자, 감자 커뮤니티, 감자 대나무숲, 감자 변명, 감자 이야기, 감자 밈" />
        <meta property="og:title" content="감자들의 대나무숲 💬 - 말하는 감자 변명 생성기" />
        <meta property="og:description" content="말하는 감자 변명 생성기의 커뮤니티! 감자들의 솔직한 이야기를 나누는 공간입니다." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talking-potato.vercel.app/community" />
        <link rel="canonical" href="https://talking-potato.vercel.app/community" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-2xl px-8">
          {/* 네비게이션 탭 */}
          <div className="pb-6 flex justify-center">
            <div className="flex bg-white rounded-2xl shadow-lg p-1 border-2 border-amber-200 w-[600px]">
              <Link href="/" className="flex-1 text-center py-3 px-4 rounded-xl font-bold text-amber-700 hover:bg-amber-50 transition-all">
                <span className="text-lg mr-2">🥔</span>
                변명 생성기
              </Link>
              
              <button className="flex-1 text-center py-3 px-4 rounded-xl font-bold bg-amber-500 text-white shadow-md transition-all relative">
                <span className="text-lg mr-2">💬</span>
                감자들의 대나무숲
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  LIVE
                </span>
              </button>
            </div>
          </div>

          {/* 새 게시글 작성 */}
          <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 border-2 border-amber-200">
            <h2 className="text-xl font-bold text-amber-800 mb-6">새로운 이야기 작성하기</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  value={newPost.anonymous_name}
                  onChange={(e) => setNewPost({ ...newPost, anonymous_name: e.target.value })}
                  placeholder="익명 이름 (예: 말하는감자42)"
                  className="px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  maxLength={20}
                />
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="general">일반 🥔</option>
                  <option value="presentation">발표 📊</option>
                  <option value="homework">과제 📚</option>
                  <option value="exam">시험 📝</option>
                </select>
              </div>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="어떤 이야기를 나누고 싶으신가요? 솔직하게 적어주세요! 😊"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-24 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {newPost.content.length}/500자
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPost.anonymous_name.trim() || !newPost.content.trim()}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '작성 중...' : '게시하기'}
                </button>
              </div>
            </form>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-4">🥔</div>
                <p className="text-amber-600">게시글을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-4">😢</div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadPosts}
                  className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-4">🥔</div>
                <p className="text-amber-600">아직 게시글이 없습니다. 첫 번째 이야기를 작성해보세요!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg p-10 border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getCategoryEmoji(post.category)}</span>
                      <span className="font-bold text-amber-800">
                        🥔 {post.anonymous_name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* 좋아요 버튼 주석 처리 */}
                      {/*
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <span className="text-base">🥔</span>
                        <span className="text-sm">{post.likes_count}</span>
                      </button>
                      */}
                      <button
                        onClick={() => toggleReplies(post.id)}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hover:bg-amber-100"
                      >
                        <span className="text-base">🥔</span>
                        <span className="text-sm font-medium">감자들의 대화</span>
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                          {post.comments_count}
                        </span>
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {post.category !== 'general' && post.category}
                    </span>
                  </div>

                                        {/* 말하는 감자들의 대화 섹션 */}
                      {expandedReplies[post.id] && (
                        <div className="border-t border-amber-200 pt-4">
                          <div className="text-center mb-4">
                            <span className="text-sm text-amber-600 font-medium">🥔 말하는 감자들의 대화 💬</span>
                          </div>
                          
                          {/* 댓글 목록 */}
                          {replies[post.id] && replies[post.id].length > 0 && (
                            <div className="space-y-3 mb-4">
                              {replies[post.id].map((reply, index) => (
                                <div key={reply.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-400 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">🥔</span>
                                      <span className="font-medium text-amber-800 text-sm">
                                        말하는감자_{reply.anonymous_name}
                                      </span>
                                      {index === 0 && (
                                        <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full">
                                          첫 번째 감자
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                                    <div className="absolute -bottom-1 -right-1 text-xs text-amber-400">
                                      🥔
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 댓글 작성 폼 */}
                          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-amber-300">
                            <div className="text-center mb-3">
                              <span className="text-sm text-amber-700 font-medium">🥔 당신도 말하는 감자가 되어보세요!</span>
                            </div>
                            <div className="flex gap-3 mb-3">
                              <input
                                type="text"
                                value={newReplies[post.id]?.anonymous_name || ''}
                                onChange={(e) => setNewReplies(prev => ({
                                  ...prev,
                                  [post.id]: { ...prev[post.id], anonymous_name: e.target.value }
                                }))}
                                placeholder="감자 이름 (예: 감자킹, 감자공주)"
                                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                                maxLength={20}
                              />
                            </div>
                            <div className="flex gap-3">
                              <textarea
                                value={newReplies[post.id]?.content || ''}
                                onChange={(e) => setNewReplies(prev => ({
                                  ...prev,
                                  [post.id]: { ...prev[post.id], content: e.target.value }
                                }))}
                                placeholder="감자스럽게 댓글을 남겨주세요! 🥔 (50자 이하)"
                                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none bg-white"
                                rows={2}
                                maxLength={50}
                              />
                              <button
                                onClick={() => handleReplySubmit(post.id)}
                                disabled={isSubmittingReply[post.id] || !newReplies[post.id]?.anonymous_name?.trim() || !newReplies[post.id]?.content?.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 text-sm whitespace-nowrap font-medium shadow-md"
                              >
                                {isSubmittingReply[post.id] ? '🥔 작성 중...' : '🥔 감자 댓글'}
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs text-amber-600">
                                {(newReplies[post.id]?.content?.length || 0)}/50자
                              </span>
                              <span className="text-xs text-amber-500">
                                🥔 감자들의 대화 공간
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
} 