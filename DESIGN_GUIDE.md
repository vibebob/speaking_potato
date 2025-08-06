# 말하는 감자 디자인 가이드

## 🥔 전체 디자인 철학
- **감자 테마**: 따뜻하고 친근한 감자 캐릭터 중심
- **색상**: 따뜻한 amber/orange 계열
- **레이아웃**: 중앙 정렬, 600px 고정 폭
- **애니메이션**: 부드럽고 자연스러운 전환 효과
- **일관성**: 모든 페이지가 동일한 구조와 스타일 패턴 유지

## 🎨 색상 팔레트

### 주요 색상
```css
--potato-primary: #D4A574;    /* 감자 기본색 */
--potato-secondary: #B8860B;  /* 감자 진한색 */  
--potato-accent: #8B4513;     /* 감자 강조색 */
```

### 배경 색상
```css
--bg-gradient-start: #FFF8DC; /* 배경 그라디언트 시작 */
--bg-gradient-end: #F5DEB3;   /* 배경 그라디언트 끝 */
--container-bg: #FFFFFF;      /* 컨테이너 배경 */
```

### 텍스트 색상
```css
--text-primary: #5D4037;      /* 주요 텍스트 */
--text-secondary: #A0522D;    /* 보조 텍스트 */
```

## 📐 레이아웃 구조

### 페이지 전체 구조
```jsx
<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
  <div className="w-full max-w-2xl px-6">
    {/* 네비게이션 탭 */}
    <div className="pb-6 flex justify-center">
      <div className="w-[600px]">
        {/* 탭 내용 */}
      </div>
    </div>
    
    {/* 메인 콘텐츠 */}
    <div className="flex justify-center py-4">
      <div className="main-container">
        {/* 페이지별 콘텐츠 */}
      </div>
    </div>
  </div>
</div>
```

### 네비게이션 탭
- **고정 폭**: `w-[600px]`
- **배경**: 흰색 + 둥근 모서리
- **활성 탭**: amber 그라디언트 + 그림자
- **비활성 탭**: 투명 + hover 효과

### 메인 컨테이너 (.main-container)
- **최대 폭**: 600px
- **패딩**: 50px 35px
- **간격**: 30px gap
- **배경**: 흰색 + 그림자
- **구조**: Flexbox column

## 🏗️ 섹션별 구조

### 1. Header Section (.header-section)
```jsx
<div className="header-section">
  <div className="potato-character">{emoji}</div>
  <h1 className="main-title">{title}</h1>
  <p className="subtitle">{description}</p>
</div>
```
- **높이**: 140px
- **정렬**: 중앙 정렬
- **감자 이모지**: 55px 크기 + bounce 애니메이션

### 2. Content Sections
- **Input Section**: 입력 필드 + 카운터
- **Tone Section**: 슬라이더 + 라벨 (120px 높이)
- **Button Section**: 메인 액션 버튼 (80px 높이)
- **Result Section**: 결과 표시 + 말풍선 스타일

### 3. Footer Section (.footer-section)
```jsx
<div className="footer-section">
  {content}<br />
  <small className="footer-disclaimer">{disclaimer}</small>
</div>
```
- **높이**: 70px
- **정렬**: 중앙 정렬
- **색상**: 보조 텍스트 색상

## 🎭 컴포넌트 스타일

### 버튼 스타일
```css
.generate-btn {
  background: linear-gradient(45deg, var(--potato-primary), var(--potato-secondary));
  color: white;
  padding: 20px 45px;
  font-size: 1.2rem;
  border-radius: 15px;
  min-width: 220px;
  /* hover 효과: translateY(-2px) + 그림자 강화 */
}
```

### 결과 표시 (.result-section)
- **말풍선 스타일**: `.result-bubble` with ::before 삼각형
- **애니메이션**: fadeInUp 0.5s
- **hover 효과**: translateY(-2px) + 그림자 강화

### 입력 필드
- **테두리**: 3px solid potato-primary
- **포커스**: 확대 효과 + 그림자
- **패딩**: 18px 22px

## ✨ 애니메이션 패턴

### 주요 애니메이션
```css
@keyframes bounce {
  /* 감자 캐릭터 바운스 효과 */
}

@keyframes fadeInUp {
  /* 결과 표시 페이드인 효과 */
}

@keyframes successPulse {
  /* 성공 버튼 펄스 효과 */
}
```

### 전환 효과
- **빠름**: 0.2s ease
- **보통**: 0.3s ease  
- **느림**: 0.5s ease

## 📱 반응형 디자인

### 태블릿 (max-width: 768px)
- **컨테이너 패딩**: 30px
- **간격**: 20px
- **섹션 높이**: 축소

### 모바일 (max-width: 480px)  
- **컨테이너 패딩**: 20px
- **버튼**: 전체 폭
- **텍스트 크기**: 축소

## 🎯 사용 원칙

### 1. 일관성 유지
- 모든 페이지에서 동일한 레이아웃 구조 사용
- 네비게이션 탭과 메인 컨테이너 폭 일치 (600px)
- 색상 팔레트 준수

### 2. 사용자 경험
- 부드러운 애니메이션과 전환 효과
- 명확한 시각적 피드백 (hover, focus, success)
- 접근성 고려 (outline, aria-label)

### 3. 감자 테마 유지
- 감자 이모지 적극 활용
- 따뜻하고 친근한 톤앤매너
- 재미있고 유쾌한 메시지

---

> 이 가이드를 따라 모든 새로운 페이지와 컴포넌트를 제작하면 일관된 디자인 경험을 제공할 수 있습니다. 🥔