// 보안 유틸리티 함수들

// XSS 방지를 위한 HTML 이스케이프
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 입력 검증 함수
export function validateInput(input: string, maxLength: number = 500): string {
  // 공백 제거 및 길이 제한
  const trimmed = input.trim();
  if (trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }
  return trimmed;
}

// 사용자 이름 검증
export function validateUsername(username: string): string {
  // 특수문자 제거, 길이 제한
  const cleaned = username.replace(/[<>\"'&]/g, '').trim();
  return cleaned.substring(0, 20);
}

// Rate Limiting을 위한 간단한 클라이언트 사이드 체크
export function checkRateLimit(action: string): boolean {
  const now = Date.now();
  const lastAction = localStorage.getItem(`rate_limit_${action}`);
  
  if (lastAction) {
    const timeDiff = now - parseInt(lastAction);
    // 5초 간격 제한
    if (timeDiff < 5000) {
      return false;
    }
  }
  
  localStorage.setItem(`rate_limit_${action}`, now.toString());
  return true;
}

// 안전한 에러 메시지 생성
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // 클라이언트 사이드에서는 항상 안전한 메시지 반환
    return '요청 처리 중 오류가 발생했습니다.';
  }
  return '알 수 없는 오류가 발생했습니다.';
}

// CSRF 토큰 생성 (간단한 버전)
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// 민감한 정보 마스킹
export function maskSensitiveData(data: string): string {
  if (data.length <= 4) return '*'.repeat(data.length);
  return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2);
} 