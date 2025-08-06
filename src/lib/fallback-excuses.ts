import { FallbackExcuse, ToneType } from '@/types';

export const FALLBACK_EXCUSES: FallbackExcuse = {
  innocent: [
    "저는 그냥 말하는 감자라서요... {situation}에 대해서는 정말 몰랐어요 🥔",
    "감자는 원래 땅속에서 자라는데, {situation}는 너무 복잡해 보였어요...",
    "감자답게 순수한 마음으로 살다보니 {situation}을 깜빡했어요 🥺",
    "하얀 감자 마음에는 {situation} 같은 걸 기억할 공간이 부족해요...",
    "감자도 나름 노력했는데 {situation}는 제 감자 뇌로는 이해가 안 되더라고요 🤔",
    "어린 감자라서 {situation}에 대한 경험이 부족했어요... 죄송해요 🌱",
    "감자는 물과 햇빛만 있으면 되는데 {situation}는 너무 어려워서 혼란스러웠어요 ☀️",
    "말하는 감자 1년차라 {situation} 같은 건 아직 모르겠어요... 🥺",
    "감자밭에서만 살던 제게는 {situation}가 너무 낯선 세상이었어요...",
    "순수한 감자 마음으로는 {situation}를 어떻게 처리해야 할지 몰랐어요 💭",
    "감자는 감자일 뿐인데 {situation}는 너무 복잡한 인간 세상 일이더라고요...",
    "아직 새싹 감자라서 {situation}에 대한 판단력이 부족했나 봐요 🌿"
  ],
  neutral: [
    "감자도 나름 노력했는데 {situation}는 제 한계를 넘어서더라고요 🤷‍♀️",
    "평범한 감자로서는 {situation}에 대해 별다른 핑계가 없네요... 죄송해요",
    "감자의 입장에서 보면 {situation}는 어쩔 수 없는 상황이었어요 😅",
    "말하는 감자지만 {situation}만큼은 어떻게 할 수 없더라고요...",
    "감자적 사고로는 {situation}가 최선의 선택이었어요 🥔",
    "감자도 사람(?)이라서 {situation}에 대해서는 실수가 있었네요 😔",
    "중간 크기 감자로서 {situation}는 적당히 처리하려고 했는데...",
    "감자 나름대로는 {situation}에 대해 충분히 고민했다고 생각해요 🤔",
    "보통 감자의 일반적인 반응으로는 {situation}가 예상 범위를 벗어났어요",
    "감자도 완벽하지 않으니까 {situation}에서 실수할 수 있죠... 😅",
    "감자 입장에서는 {situation}가 그럴 만한 이유가 있었다고 봐요",
    "평소 감자답게 살다 보니 {situation}에 대한 준비가 부족했네요 💭",
    "감자로서는 {situation}에 대해 나름의 합리적 이유가 있었어요"
  ],
  confident: [
    "당당한 감자로서 말씀드리는데, {situation}는 제가 선택하지 않은 길이에요 😎",
    "감자도 자신만의 철학이 있거든요. {situation}는 그냥 제 스타일이 아니었어요 ✨",
    "자신 있는 감자답게 말하자면, {situation}보다 더 중요한 일이 있었어요 💪",
    "멋진 감자는 {situation} 같은 걸로 시간 낭비하지 않아요 😏",
    "감자계의 알파로서 {situation}는 제 우선순위가 아니었습니다 🔥",
    "프리미엄 감자인 제게는 {situation} 같은 건 맞지 않는 일이었어요 ✨",
    "감자계의 리더로서 {situation}보다 더 비전 있는 일을 추진하고 있었거든요 🚀",
    "고급 감자답게 {situation}는 제 수준에 맞지 않는다고 판단했어요 💎",
    "감자 중의 감자인 저에게는 {situation}가 너무 평범한 일이었습니다 👑",
    "최고급 감자로서 {situation}에 시간을 쓰는 것보다 더 가치 있는 일이 있었어요 🏆",
    "감자계의 CEO로서 {situation}는 제 비즈니스 모델에 맞지 않았어요 💼",
    "엘리트 감자의 시간 관리법으로는 {situation}는 우선순위 밖이었습니다 ⏰",
    "프로 감자의 직업의식으로는 {situation}보다 더 중요한 미션이 있었어요 🎯",
    "감자계 인플루언서인 저에게는 {situation}가 브랜딩에 맞지 않았거든요 📸"
  ]
};

export function getToneType(toneValue: number): ToneType {
  if (toneValue <= 33) return 'innocent';
  if (toneValue <= 66) return 'neutral';
  return 'confident';
}

export function getRandomFallbackExcuse(situation: string, tone: ToneType): string {
  const excuses = FALLBACK_EXCUSES[tone];
  const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
  return randomExcuse.replace('{situation}', situation);
}

// 상황별 특별한 변명들
export const SITUATION_SPECIFIC_EXCUSES = {
  homework: [
    "과제는 감자가 할 일이 아니라고 생각했어요... 감자는 요리되는 게 전문이거든요 🍳",
    "숙제보다는 감자 성장에 더 집중하고 있었어요. 우선순위가 다르다고 보시면 될 것 같아요 🌱"
  ],
  late: [
    "감자는 원래 땅속에서 천천히 자라는 속도에 맞춰 사는 편이에요... ⏰",
    "감자 시계는 일반 시계보다 조금 느리게 가더라고요. 감자만의 타임존이 있는 것 같아요 🕐"
  ],
  work: [
    "일보다는 감자로서의 정체성을 찾는 데 시간을 투자하고 있었어요 💼",
    "워라밸을 중시하는 감자로서, 감자 라이프가 우선이었거든요 🌿"
  ]
};

// 키워드 감지 및 특별 변명 반환
export function getSmartFallbackExcuse(situation: string, tone: ToneType): string {
  const lowerSituation = situation.toLowerCase();
  
  // 과제/숙제 관련
  if (lowerSituation.includes('과제') || lowerSituation.includes('숙제') || lowerSituation.includes('homework')) {
    if (Math.random() < 0.3 && SITUATION_SPECIFIC_EXCUSES.homework.length > 0) {
      const excuse = SITUATION_SPECIFIC_EXCUSES.homework[Math.floor(Math.random() * SITUATION_SPECIFIC_EXCUSES.homework.length)];
      return excuse;
    }
  }
  
  // 지각 관련
  if (lowerSituation.includes('늦') || lowerSituation.includes('지각') || lowerSituation.includes('late')) {
    if (Math.random() < 0.3 && SITUATION_SPECIFIC_EXCUSES.late.length > 0) {
      const excuse = SITUATION_SPECIFIC_EXCUSES.late[Math.floor(Math.random() * SITUATION_SPECIFIC_EXCUSES.late.length)];
      return excuse;
    }
  }
  
  // 일/업무 관련
  if (lowerSituation.includes('일') || lowerSituation.includes('업무') || lowerSituation.includes('work')) {
    if (Math.random() < 0.3 && SITUATION_SPECIFIC_EXCUSES.work.length > 0) {
      const excuse = SITUATION_SPECIFIC_EXCUSES.work[Math.floor(Math.random() * SITUATION_SPECIFIC_EXCUSES.work.length)];
      return excuse;
    }
  }
  
  // 기본 변명 반환
  return getRandomFallbackExcuse(situation, tone);
}