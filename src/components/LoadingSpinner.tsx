'use client';

import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  '감자가 열심히 변명을 생각하고 있어요...',
  '해복된 변명을 찾기 위해 감자 뇌를 가동 중...',
  '감자 데이터베이스에서 최고의 변명을 검색중...',
  '창의적인 변명을 위해 감자 상상력 가동...',
  '전 세계 감자들의 지혜를 모으는 중...',
  '감자 빅데이터 분석 중... 잠시만 기다려주세요!'
];

const POTATO_EMOJIS = ['🥔', '🍟', '🍳'];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [potatoIndex, setPotatoIndex] = useState(0);
  
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    const potatoTimer = setInterval(() => {
      setPotatoIndex((prev) => (prev + 1) % POTATO_EMOJIS.length);
    }, 1000);
    
    return () => {
      clearInterval(messageTimer);
      clearInterval(potatoTimer);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl animate-bounce">{POTATO_EMOJIS[potatoIndex]}</div>
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-amber-700 text-center text-sm">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}