import { ToneType } from '@/types';

// Claude API 관련 설정 (현재는 비활성화)
const CLAUDE_API_ENABLED = false; // 환경변수로 제어 가능
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export function getToneDescription(toneValue: number): string {
  if (toneValue <= 33) {
    return "순진하고 귀여운 톤으로, 약간 어리숙하지만 애교 있는 말투";
  } else if (toneValue <= 66) {
    return "적당히 당당하면서도 솔직한 톤으로, 현실적이고 공감 가는 말투";
  } else {
    return "자신감 넘치고 당당한 톤으로, 약간 건방지지만 매력적인 말투";
  }
}

export function buildClaudePrompt(situation: string, toneValue: number): string {
  const toneDescription = getToneDescription(toneValue);
  
  return `당신은 한국 대학생들 사이에서 유행하는 "말하는 감자"입니다.

상황: "${situation}"
톤: ${toneDescription}

조건:
1. 한국 대학생이 실제로 쓸 법한 자연스러운 표현
2. "감자"라는 단어를 자연스럽게 포함
3. 자조적이면서도 귀여운 느낌
4. 30-50자 내외
5. 적절한 이모지 1-2개 포함
6. 진짜 변명처럼 들리면서도 웃음을 유발

변명만 답해주세요:`;
}

// 나중에 Claude API 활성화할 때 사용할 함수
export async function generateExcuseWithClaude(
  situation: string, 
  toneValue: number
): Promise<string | null> {
  if (!CLAUDE_API_ENABLED || !ANTHROPIC_API_KEY) {
    return null;
  }

  try {
    // TODO: Anthropic SDK 설치 후 구현
    // const anthropic = new Anthropic({
    //   apiKey: ANTHROPIC_API_KEY,
    // });
    
    // const message = await anthropic.messages.create({
    //   model: "claude-3-sonnet-20240229",
    //   max_tokens: 150,
    //   messages: [{
    //     role: "user",
    //     content: buildClaudePrompt(situation, toneValue)
    //   }]
    // });
    
    // return message.content[0].text;
    return null;
  } catch (error) {
    console.error('Claude API error:', error);
    return null;
  }
}