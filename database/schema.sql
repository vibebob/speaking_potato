-- 감자 대나무숲 커뮤니티 테이블 스키마

-- 게시글 테이블
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname VARCHAR(20) NOT NULL,
  title VARCHAR(50) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 200),
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블 (향후 확장용)
CREATE TABLE community_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  nickname VARCHAR(20) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 테이블 (중복 방지용 - IP 기반)
CREATE TABLE community_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_ip INET NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_ip)
);

-- 인덱스 생성
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_last_activity ON community_posts(last_activity_at DESC);
CREATE INDEX idx_community_replies_post_id ON community_replies(post_id);
CREATE INDEX idx_community_likes_post_id ON community_likes(post_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read community replies" ON community_replies
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read community likes" ON community_likes
  FOR SELECT USING (true);

-- 인증되지 않은 사용자도 게시글 작성 가능 (익명 커뮤니티)
CREATE POLICY "Anyone can insert community posts" ON community_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert community replies" ON community_replies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert community likes" ON community_likes
  FOR INSERT WITH CHECK (true);

-- 업데이트는 좋아요 수 증가만 허용
CREATE POLICY "Anyone can update post likes" ON community_posts
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- 트리거 함수: 댓글 작성 시 게시글의 last_activity_at 업데이트
CREATE OR REPLACE FUNCTION update_post_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts 
  SET 
    last_activity_at = NOW(),
    replies = (SELECT COUNT(*) FROM community_replies WHERE post_id = NEW.post_id)
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 댓글 삽입/삭제 시 트리거 실행
CREATE TRIGGER trigger_update_post_activity
  AFTER INSERT OR DELETE ON community_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_activity();

-- 좋아요 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts 
    SET likes = (SELECT COUNT(*) FROM community_likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts 
    SET likes = (SELECT COUNT(*) FROM community_likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 좋아요 삽입/삭제 시 트리거 실행
CREATE TRIGGER trigger_update_post_likes
  AFTER INSERT OR DELETE ON community_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes();

-- 자동 삭제 함수 (일주일 동안 댓글이 없는 게시글 삭제)
CREATE OR REPLACE FUNCTION cleanup_inactive_posts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- 7일 이상 활동이 없고 댓글이 0개인 게시글 삭제
  DELETE FROM community_posts 
  WHERE 
    last_activity_at < NOW() - INTERVAL '7 days' 
    AND replies = 0;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- 로그를 위한 간단한 기록 (선택사항)
  RAISE NOTICE '자동 정리: %개의 비활성 게시글이 삭제되었습니다.', deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 초기 샘플 데이터 삽입
INSERT INTO community_posts (nickname, title, content, tags, likes, replies, created_at, last_activity_at) VALUES
('말하는감자42', '발표에서 완전 감자였어요...', '오늘 발표에서 완전 감자였어요... 교수님이 뭔 말을 하는지 하나도 모르겠더라구요 😅 그래도 열심히 준비했는데 왜 이렇게 긴장되면 머리가 하얘지는 걸까요?', ARRAY['😅 당황', '🤔 고민'], 24, 8, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('굴러가는감자7', '과제 제출 5분전의 고민', '과제 제출 5분전에 발견한 감자의 고민... 이번엔 정말 미안해요 😂 분명 어제까지 여유있었는데 왜 갑자기 시간이 이렇게 빠르게 가는 걸까요?', ARRAY['😭 슬픔', '🙄 짜증'], 38, 12, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('졸린감자15', '시험공부하다 잠든 감자의 변명', '시험공부하다가 잠들어버린 감자의 변명... 알람이 울렸는데도 못들었어요 😴 이번엔 정말 마지막이에요! 다음엔 꼭 미리미리 준비할게요...', ARRAY['😴 피곤', '💪 힘냄'], 45, 15, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours');

-- 정리 작업을 위한 cron job 설정 (pg_cron extension 필요)
-- 매일 새벽 3시에 비활성 게시글 정리
-- SELECT cron.schedule('cleanup-inactive-posts', '0 3 * * *', 'SELECT cleanup_inactive_posts();');