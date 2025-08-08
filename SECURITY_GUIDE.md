# 🔒 말하는 감자 변명 생성기 - 보안 가이드

## 🛡️ 적용된 보안 조치들

### 1. 입력 검증 (Input Validation)
- ✅ **XSS 방지**: HTML 특수문자 이스케이프 처리
- ✅ **길이 제한**: 게시글 500자, 댓글 50자, 이름 20자
- ✅ **특수문자 필터링**: 사용자 이름에서 위험한 문자 제거
- ✅ **카테고리 검증**: 허용된 카테고리만 입력 가능

### 2. Rate Limiting
- ✅ **클라이언트 사이드**: 5초 간격 제한
- ✅ **서버 사이드**: IP 기반 요청 제한
- ✅ **관리자 API**: 1분에 5회 제한

### 3. 인증 및 권한 관리
- ✅ **관리자 인증**: 다중 토큰 시스템
- ✅ **IP 기반 추적**: 의심스러운 접근 로깅
- ✅ **Row Level Security**: 데이터베이스 레벨 보안

### 4. 에러 처리
- ✅ **안전한 에러 메시지**: 민감한 정보 노출 방지
- ✅ **환경별 처리**: 개발/프로덕션 환경 구분
- ✅ **로깅**: 보안 이벤트 기록

### 5. 데이터베이스 보안
- ✅ **SQL Injection 방지**: Supabase ORM 사용
- ✅ **UUID 검증**: 모든 ID 입력 검증
- ✅ **트랜잭션 처리**: 데이터 일관성 보장

## 🔧 환경 변수 설정

### 필수 환경 변수
```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 관리자 인증 (프로덕션에서 반드시 설정)
ADMIN_SECRET_KEY=your_secure_admin_key
ADMIN_TOKEN=your_secure_admin_token
```

### 보안 권장사항
```bash
# 강력한 키 생성
openssl rand -base64 32  # 관리자 키용
openssl rand -hex 32     # 토큰용
```

## 🚨 보안 체크리스트

### 배포 전 확인사항
- [ ] 환경 변수 설정 완료
- [ ] HTTPS 적용 확인
- [ ] 관리자 키 변경
- [ ] 데이터베이스 RLS 활성화
- [ ] 로그 모니터링 설정

### 정기 점검사항
- [ ] 접근 로그 확인
- [ ] 에러 로그 분석
- [ ] 데이터베이스 백업
- [ ] 보안 업데이트 적용

## 🛠️ 추가 보안 강화 방안

### 1. WAF (Web Application Firewall) 설정
```nginx
# Nginx 설정 예시
location / {
    # XSS 방지 헤더
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
    limit_req zone=api burst=20 nodelay;
}
```

### 2. 모니터링 설정
```javascript
// 보안 이벤트 로깅
function logSecurityEvent(event: string, details: any) {
  console.log(`[SECURITY] ${new Date().toISOString()}: ${event}`, details);
  
  // 외부 로깅 서비스로 전송
  if (process.env.SECURITY_WEBHOOK_URL) {
    fetch(process.env.SECURITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, details, timestamp: new Date().toISOString() })
    });
  }
}
```

### 3. 백업 전략
```sql
-- 자동 백업 스케줄 (PostgreSQL)
CREATE OR REPLACE FUNCTION backup_community_data()
RETURNS void AS $$
BEGIN
  -- 백업 로직
  COPY (SELECT * FROM community_posts WHERE is_active = true) 
  TO '/backup/community_posts_' || to_char(now(), 'YYYYMMDD_HH24MI') || '.csv';
END;
$$ LANGUAGE plpgsql;

-- 매일 자정 백업
SELECT cron.schedule('daily-backup', '0 0 * * *', 'SELECT backup_community_data();');
```

## 📊 보안 메트릭

### 모니터링 지표
- **요청 수**: 분당 API 호출 수
- **에러율**: 4xx, 5xx 에러 비율
- **응답 시간**: 평균 응답 시간
- **보안 이벤트**: 의심스러운 접근 시도

### 알림 설정
```javascript
// 보안 알림 조건
const securityAlerts = {
  highErrorRate: '5분간 에러율 10% 이상',
  suspiciousIP: '단일 IP에서 100회 이상 요청',
  adminAccess: '관리자 API 접근 시도',
  dataBreach: '대량 데이터 조회 시도'
};
```

## 🔍 보안 테스트

### 자동화된 테스트
```bash
# 보안 스캔 실행
npm run security:scan

# 취약점 테스트
npm run security:test

# 페너레이션 테스트
npm run security:penetration
```

### 수동 테스트 체크리스트
- [ ] XSS 공격 시도
- [ ] SQL Injection 시도
- [ ] CSRF 공격 시도
- [ ] Rate Limiting 테스트
- [ ] 인증 우회 시도

## 📞 보안 연락처

### 긴급 상황
- **보안 이슈 발견**: security@talking-potato.vercel.app
- **데이터 유출**: privacy@talking-potato.vercel.app
- **시스템 장애**: admin@talking-potato.vercel.app

### 정기 보고
- **월간 보안 보고서**: 매월 첫째 주
- **분기 보안 점검**: 분기별 진행
- **연간 보안 감사**: 연말 진행

---

**🔒 이 가이드를 따라 안전한 서비스를 운영하세요!** 