# Google Search Console 설정 가이드

## 1. Google Search Console 등록

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. "속성 추가" 클릭
3. 도메인 또는 URL 접두어 선택
   - URL 접두어: `https://talking-potato.vercel.app`
4. 소유권 확인 방법 선택:
   - HTML 태그 방식 권장
   - 제공된 메타 태그를 `<head>` 섹션에 추가

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# Google Analytics (선택사항)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 3. 사이트맵 제출

1. Google Search Console에서 "색인 생성" > "사이트맵" 메뉴로 이동
2. 사이트맵 URL 입력: `https://talking-potato.vercel.app/sitemap.xml`
3. "제출" 버튼 클릭

## 4. robots.txt 확인

현재 robots.txt 파일이 올바르게 설정되어 있습니다:
- 사이트맵 위치: `https://talking-potato.vercel.app/sitemap.xml`
- 관리자 페이지 차단: `/admin/`
- 크롤링 지연: 1초

## 5. 구조화된 데이터 확인

다음 구조화된 데이터가 포함되어 있습니다:
- 메인 페이지: WebApplication 스키마
- 커뮤니티 페이지: DiscussionForumPosting 스키마

## 6. 추가 SEO 최적화

### 메타데이터
- 모든 페이지에 적절한 title, description, keywords 설정
- Open Graph 태그로 소셜 미디어 공유 최적화
- Twitter Card 설정

### 성능 최적화
- 이미지 최적화 (WebP 형식 사용)
- 코드 분할 및 지연 로딩
- Core Web Vitals 최적화

## 7. 모니터링

Google Search Console에서 다음 항목들을 정기적으로 확인하세요:
- 색인 생성 상태
- 검색 성능
- 모바일 사용성
- Core Web Vitals
- 보안 및 수동 조치

## 8. 사이트맵 자동 업데이트

현재 사이트맵은 다음을 포함합니다:
- 메인 페이지 (`/`)
- 커뮤니티 페이지 (`/community`)
- 관리자 페이지 (`/admin`)
- 동적 커뮤니티 포스트 (`/community/[postId]`)

새로운 커뮤니티 포스트가 추가되면 사이트맵이 자동으로 업데이트됩니다.

## 9. 문제 해결

### 사이트맵 오류
- 사이트맵 URL이 올바른지 확인
- robots.txt에서 사이트맵 경로가 허용되는지 확인
- HTTP 상태 코드가 200인지 확인

### 색인 생성 문제
- 페이지가 robots.txt에서 차단되지 않았는지 확인
- 메타 robots 태그가 올바르게 설정되었는지 확인
- 페이지 로딩 속도가 적절한지 확인

## 10. 추가 권장사항

1. **정기적인 콘텐츠 업데이트**: 새로운 커뮤니티 포스트 추가
2. **내부 링크 최적화**: 관련 페이지 간 링크 구조 개선
3. **사용자 경험 개선**: 페이지 로딩 속도 및 사용성 향상
4. **모바일 최적화**: 반응형 디자인 및 모바일 친화적 인터페이스
