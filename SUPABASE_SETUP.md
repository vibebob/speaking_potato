# 🥔 감자 대나무숲 Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인
2. "New Project" 클릭
3. 프로젝트 이름: `talking-potato-community`
4. 데이터베이스 비밀번호 설정 (안전한 비밀번호 사용)
5. 지역 선택 (Asia Pacific - Seoul 권장)
6. "Create new project" 클릭

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 "SQL Editor" 메뉴로 이동
2. `database/schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. "RUN" 버튼 클릭하여 실행

### 생성되는 테이블들:
- **community_posts**: 게시글 저장
- **community_replies**: 댓글 저장 (향후 확장용)  
- **community_likes**: 좋아요 저장 (IP 기반 중복 방지)

## 3. 환경 변수 설정

1. `.env.local` 파일 생성 (`.env.example` 참고)
2. Supabase 대시보드에서 필요한 정보 확인:

### API 키 찾는 방법:
1. **Project URL & API Keys**: Settings > API
2. **Project URL**: `https://your-project-id.supabase.co`
3. **anon/public key**: `eyJ...` (공개적으로 사용 가능)
4. **service_role key**: `eyJ...` (서버에서만 사용, 절대 공개 금지!)

```env
# .env.local 파일 예시
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_SECRET_KEY=your-super-secret-admin-key-123
ANTHROPIC_API_KEY=your-existing-anthropic-key
```

## 4. Row Level Security (RLS) 확인

스키마 실행 후 다음 정책들이 활성화되어 있는지 확인:

### community_posts 테이블:
- ✅ "Anyone can read community posts" (읽기 허용)
- ✅ "Anyone can insert community posts" (작성 허용)  
- ✅ "Anyone can update post likes" (좋아요 수 업데이트 허용)

### 확인 방법:
1. Authentication > Policies 메뉴
2. `community_posts` 테이블 정책 확인

## 5. 데이터베이스 연결 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:3000/admin` 접속
3. "연결 테스트" 버튼 클릭
4. ✅ "데이터베이스 연결이 정상입니다" 메시지 확인

## 6. 자동 정리 작업 설정 (선택사항)

### Supabase Edge Functions 사용 (권장):

1. Supabase CLI 설치:
```bash
npm install -g supabase
```

2. Edge Function 생성:
```bash
supabase functions new cleanup-posts
```

3. Function 코드 작성 (`supabase/functions/cleanup-posts/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase
      .rpc('cleanup_inactive_posts')

    if (error) throw error

    return new Response(
      JSON.stringify({ message: `${data}개 게시글 정리 완료` }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

4. Cron Job 설정 (Supabase 대시보드):
```sql
-- 매일 새벽 3시에 정리 작업 실행
SELECT cron.schedule(
  'cleanup-inactive-posts',
  '0 3 * * *',
  'SELECT net.http_post(
    url := ''https://your-project-id.supabase.co/functions/v1/cleanup-posts'',
    headers := jsonb_build_object(''Authorization'', ''Bearer '' || ''YOUR_ANON_KEY'')
  );'
);
```

### 대안: 수동 정리 작업

1. `http://localhost:3000/admin` 접속
2. 관리자 키 입력
3. "정리 실행" 버튼으로 수동 정리

## 7. 보안 설정 확인

### 중요한 보안 체크리스트:
- [ ] Service Role Key는 서버에서만 사용
- [ ] ADMIN_SECRET_KEY는 충분히 복잡한 키 사용
- [ ] RLS 정책이 올바르게 설정됨
- [ ] 민감한 정보는 환경 변수로 관리

### IP 기반 좋아요 제한:
- 동일 IP에서는 게시글당 1번만 좋아요 가능
- 좋아요 취소 기능 지원

## 8. 모니터링 및 관리

### Supabase 대시보드에서 확인 가능:
- **Database**: 테이블 데이터 실시간 확인
- **Logs**: API 호출 및 에러 로그
- **Usage**: 데이터베이스 사용량 모니터링

### 정기 관리 작업:
1. 주간 데이터 사용량 확인
2. 비정상적인 트래픽 패턴 모니터링  
3. 필요시 수동 정리 작업 실행

## 9. 문제 해결

### 자주 발생하는 문제들:

**1. "relation does not exist" 에러**
- 해결: 스키마 SQL을 다시 실행하세요

**2. "JWT expired" 에러**  
- 해결: API 키가 정확한지 확인하세요

**3. "Permission denied" 에러**
- 해결: RLS 정책 설정을 확인하세요

**4. 연결 테스트 실패**
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

## 10. 프로덕션 배포 시 주의사항

1. **환경 변수**: 배포 환경에 모든 환경 변수 설정
2. **도메인 설정**: Supabase에서 허용된 도메인 추가
3. **백업**: 정기적인 데이터베이스 백업 설정
4. **모니터링**: 에러 추적 및 성능 모니터링 도구 연동

---

✅ 모든 설정이 완료되면 감자 대나무숲이 실제 데이터베이스와 연동되어 작동합니다! 🥔