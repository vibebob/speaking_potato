'use client';

import { useState } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    nickname: string;
    title: string;
    content: string;
    tags: string[];
  }) => void;
}

const POTATO_NAMES = [
  '말하는감자', '굴러가는감자', '졸린감자', '배고픈감자', '바쁜감자',
  '행복한감자', '슬픈감자', '화난감자', '신난감자', '피곤한감자',
  '멋진감자', '귀여운감자', '똑똑한감자', '재미있는감자', '활발한감자'
];

const EMOTION_TAGS = [
  '😅 당황', '😭 슬픔', '😤 화남', '😊 기쁨', '😴 피곤',
  '🤔 고민', '💪 힘냄', '🙄 짜증', '😱 놀람', '🤗 감동'
];

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateRandomNickname = () => {
    const randomName = POTATO_NAMES[Math.floor(Math.random() * POTATO_NAMES.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return `${randomName}${randomNumber}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        nickname: nickname.trim() || generateRandomNickname(),
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags
      });
      
      // 초기화
      setNickname('');
      setTitle('');
      setContent('');
      setSelectedTags([]);
      onClose();
    } catch (error) {
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="main-container max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="header-section">
          <div className="potato-character">✍️🥔</div>
          <h1 className="main-title">새 이야기 작성</h1>
          <p className="subtitle">
            감자만의 특별한 이야기를 들려주세요!<br />
            익명으로 자유롭게 소통해보세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 입력 */}
          <div className="input-section">
            <label className="tone-label">🥔 감자 이름 (선택사항)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={`예: ${generateRandomNickname()}`}
              maxLength={20}
              className="situation-input"
            />
            <div className="text-right text-xs text-text-secondary mt-2">
              {nickname.length}/20자 {!nickname.trim() && '(빈 칸이면 랜덤 이름 생성)'}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="input-section">
            <label className="tone-label">📝 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="어떤 이야기인가요?"
              maxLength={50}
              className="situation-input"
              required
            />
            <div className="text-right text-xs text-text-secondary mt-2">
              {title.length}/50자
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="input-section">
            <label className="tone-label">💭 이야기 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="감자의 솔직한 이야기를 들려주세요..."
              maxLength={200}
              rows={4}
              className="situation-input resize-none"
              style={{ minHeight: '100px' }}
              required
            />
            <div className="text-right text-xs text-text-secondary mt-2">
              {content.length}/200자
            </div>
          </div>

          {/* 감정 태그 선택 */}
          <div className="input-section">
            <label className="tone-label">🏷️ 감정 태그 (선택사항)</label>
            <div className="flex flex-wrap gap-2 mt-3">
              {EMOTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-amber-200 text-amber-800 border-2 border-amber-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-amber-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="text-xs text-text-secondary mt-2">
              선택된 태그: {selectedTags.length}개
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div className="action-buttons">
            <button
              type="button"
              onClick={onClose}
              className="action-btn"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="generate-btn"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              style={{ minWidth: 'auto', padding: '15px 30px' }}
            >
              {isSubmitting ? '🥔 작성중...' : '✍️ 이야기 올리기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}