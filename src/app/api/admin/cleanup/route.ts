import { NextRequest, NextResponse } from 'next/server';
import { cleanupInactivePosts } from '@/lib/supabase';

// Rate Limiting을 위한 Map
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate Limiting 체크 함수
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now > userRequests.resetTime) {
    // 새로운 윈도우 시작
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1분
    return true;
  }
  
  if (userRequests.count >= 5) { // 1분에 5회 제한
    return false;
  }
  
  userRequests.count++;
  return true;
}

// 클라이언트 IP 추출 함수
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

// 관리자 인증 체크 함수
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = request.headers.get('x-admin-key');
  
  // 환경 변수에서 관리자 키 가져오기
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'default-admin-key';
  const adminToken = process.env.ADMIN_TOKEN || 'default-admin-token';
  
  // Bearer 토큰 체크
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === adminSecretKey || token === adminToken) {
      return true;
    }
  }
  
  // 커스텀 헤더 체크
  if (adminKey && (adminKey === adminSecretKey || adminKey === adminToken)) {
    return true;
  }
  
  return false;
}

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Rate Limiting 체크
  if (!checkRateLimit(clientIP)) {
    console.log(`[RATE_LIMIT] IP ${clientIP} exceeded limit`);
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }
  
  // 관리자 인증 체크
  if (!checkAdminAuth(request)) {
    console.log(`[UNAUTHORIZED] IP ${clientIP} attempted admin access`);
    return NextResponse.json(
      { error: '관리자 인증이 필요합니다.' },
      { status: 401 }
    );
  }
  
  try {
    // 연결 테스트
    const { data, error } = await cleanupInactivePosts();
    
    if (error) {
      throw error;
    }
    
    console.log(`[SUCCESS] Admin connection test from IP ${clientIP}`);
    
    return NextResponse.json({
      message: '데이터베이스 연결이 정상입니다.',
      data: data
    });
  } catch (error) {
    console.error(`[ERROR] Admin connection test failed from IP ${clientIP}:`, error);
    
    return NextResponse.json(
      { error: '데이터베이스 연결에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Rate Limiting 체크
  if (!checkRateLimit(clientIP)) {
    console.log(`[RATE_LIMIT] IP ${clientIP} exceeded limit`);
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }
  
  // 관리자 인증 체크
  if (!checkAdminAuth(request)) {
    console.log(`[UNAUTHORIZED] IP ${clientIP} attempted admin access`);
    return NextResponse.json(
      { error: '관리자 인증이 필요합니다.' },
      { status: 401 }
    );
  }
  
  // Content-Type 체크
  const contentType = request.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    return NextResponse.json(
      { error: '잘못된 Content-Type입니다.' },
      { status: 400 }
    );
  }
  
  try {
    // 정리 작업 실행
    const result = await cleanupInactivePosts();
    
    console.log(`[SUCCESS] Cleanup completed from IP ${clientIP}:`, result);
    
    return NextResponse.json({
      message: '비활성 게시글 정리가 완료되었습니다.',
      result: result
    });
  } catch (error) {
    console.error(`[ERROR] Cleanup failed from IP ${clientIP}:`, error);
    
    return NextResponse.json(
      { error: '정리 작업에 실패했습니다.' },
      { status: 500 }
    );
  }
}