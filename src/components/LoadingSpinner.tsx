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
    <div className="loading-spinner">
      <div className="loading-potato">{POTATO_EMOJIS[potatoIndex]}</div>
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      <p className="loading-text">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}