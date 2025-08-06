import { NextRequest, NextResponse } from 'next/server';
import { APIRequest, APIResponse } from '@/types';
import { getToneType, getSmartFallbackExcuse } from '@/lib/fallback-excuses';
import { generateExcuseWithClaude } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const body: APIRequest = await request.json();
    const { situation, tone } = body;

    // 입력 검증
    if (!situation || situation.trim().length === 0) {
      return NextResponse.json(
        { error: '상황을 입력해주세요.' } as APIResponse,
        { status: 400 }
      );
    }

    if (situation.length > 100) {
      return NextResponse.json(
        { error: '상황은 100자 이내로 입력해주세요.' } as APIResponse,
        { status: 400 }
      );
    }

    if (typeof tone !== 'number' || tone < 0 || tone > 100) {
      return NextResponse.json(
        { error: '올바른 톤 값을 선택해주세요.' } as APIResponse,
        { status: 400 }
      );
    }

    let excuse: string;

    // Claude API 시도 (현재는 비활성화)
    const claudeExcuse = await generateExcuseWithClaude(situation, tone);
    
    if (claudeExcuse) {
      excuse = claudeExcuse;
    } else {
      // 폴백 시스템 사용 (스마트 변명 적용)
      const toneType = getToneType(tone);
      excuse = getSmartFallbackExcuse(situation, toneType);
    }

    return NextResponse.json({
      excuse
    } as APIResponse);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '변명 생성 중 오류가 발생했습니다.' } as APIResponse,
      { status: 500 }
    );
  }
}