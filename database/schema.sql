-- 감자 대나무숲 데이터베이스 스키마

-- 1. community_posts 테이블 (게시글)
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anonymous_name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) DEFAULT 'general',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- 2. community_replies 테이블 (댓글 - 향후 확장용)
CREATE TABLE IF NOT EXISTS community_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    anonymous_name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- 3. community_likes 테이블 (좋아요 - IP 기반 중복 방지)
CREATE TABLE IF NOT EXISTS community_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, ip_address)
);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_active ON community_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON community_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON community_likes(post_id);

-- 5. 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 트리거 설정
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON community_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 좋아요 수 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 8. 좋아요 트리거 설정
CREATE TRIGGER update_likes_count AFTER INSERT OR DELETE ON community_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 9. 댓글 수 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 10. 댓글 트리거 설정
CREATE TRIGGER update_comments_count AFTER INSERT OR DELETE ON community_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- 11. 정리 작업 함수 (비활성 게시글 정리)
CREATE OR REPLACE FUNCTION cleanup_inactive_posts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM community_posts 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND likes_count = 0 
    AND comments_count = 0;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- 12. Row Level Security (RLS) 활성화
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- 13. RLS 정책 설정

-- community_posts 정책
CREATE POLICY "Anyone can read community posts" ON community_posts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert community posts" ON community_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update post likes" ON community_posts
    FOR UPDATE USING (true) WITH CHECK (true);

-- community_replies 정책
CREATE POLICY "Anyone can read community replies" ON community_replies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert community replies" ON community_replies
    FOR INSERT WITH CHECK (true);

-- community_likes 정책
CREATE POLICY "Anyone can read community likes" ON community_likes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert community likes" ON community_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete community likes" ON community_likes
    FOR DELETE USING (true);

-- 14. 샘플 데이터 삽입 (테스트용)
INSERT INTO community_posts (anonymous_name, content, category) VALUES
('말하는감자42', '오늘 발표에서 완전 감자였어요... 교수님이 뭔 말을 하는지 하나도 모르겠더라구요 😅', 'presentation'),
('굴러가는감자7', '과제 제출 5분전에 발견한 감자의 고민... 이번엔 정말 미안해요 😂', 'homework'),
('졸린감자15', '시험공부하다가 잠들어버린 감자의 변명... 알람이 울렸는데도 못들었어요 😴', 'exam')
ON CONFLICT DO NOTHING;