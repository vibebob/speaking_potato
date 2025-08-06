'use client';

import { useState, useRef, useEffect } from 'react';
import { APIRequest, APIResponse } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import ToneSlider from './ToneSlider';

export default function ExcuseGenerator() {
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState(50);
  const [excuse, setExcuse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const generateExcuse = async () => {
    if (!situation.trim()) {
      setError('상황을 입력해주세요!');
      return;
    }

    if (situation.length > 100) {
      setError('상황은 100자 이내로 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setError('');
    setExcuse('');
    setShowResult(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          situation: situation.trim(),
          tone,
        } as APIRequest),
      });

      const data: APIResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '변명 생성에 실패했습니다');
      }

      setExcuse(data.excuse);
      setShowResult(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '변명 생성 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateExcuse();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(excuse);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err: unknown) {
      console.error('복사 실패:', err);
      // 폴백: 예전 방식으로 복사 시도
      const textArea = document.createElement('textarea');
      textArea.value = excuse;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr: unknown) {
        console.error('폴백 복사도 실패:', fallbackErr);
        alert('복사에 실패했어요. 수동으로 복사해주세요 😥');
      }
      document.body.removeChild(textArea);
    }
  };

  const shareExcuse = async () => {
    const shareText = `감자가 만든 변명: "${excuse}" 

🥔 더 많은 변명이 필요하다면: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '감자 변명 생성기',
          text: shareText,
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('공유 실패:', err);
          await copyToClipboard();
        }
      }
    } else {
      // 데스큭톱에서는 URL 복사 방식 사용
      try {
        await navigator.clipboard.writeText(shareText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        await copyToClipboard();
      }
    }
  };

  const regenerateExcuse = () => {
    generateExcuse();
  };

  // 결과 표시 후 자동 스크롤
  useEffect(() => {
    if (showResult && excuse && !isLoading && resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showResult, excuse, isLoading]);

  return (
    <div className="main-container">
      {/* HEADER SECTION */}
      <div className="header-section">
        <div className="potato-character">🥔</div>
        <h1 className="main-title">말하는 감자 변명 생성기</h1>
        <p className="subtitle">
          오늘도 감자같은 하루를 보내셨나요?<br />
      
        </p>
      </div>

      {/* INPUT SECTION */}
      <div className="input-section">
        <input
          type="text"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="어떤 상황인가요? (예: 과제를 늦게 냈어요)"
          maxLength={100}
          className="situation-input"
          aria-label="변명을 생성할 상황을 입력하세요"
        />
        <div className="text-right text-xs text-text-secondary mt-3">
          {situation.length}/100자
        </div>
        {situation.length > 80 && (
          <div className="text-right text-xs text-orange-600 mt-2">
            거의 다 채웠어요! 🥔
          </div>
        )}
      </div>

      {/* TONE SECTION */}
      <ToneSlider value={tone} onChange={setTone} />

      {/* BUTTON SECTION */}
      <div className="button-section">
        <button
          onClick={generateExcuse}
          disabled={isLoading || !situation.trim()}
          className="generate-btn"
          aria-label={isLoading ? "변명을 생성하고 있습니다" : "변명을 생성합니다"}
        >
          {isLoading ? '🤔 생각중...' : '🥔 변명 생성하기'}
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-center p-4 bg-red-100 border border-red-300 rounded-lg mb-6" role="alert">
          <p className="text-red-600 text-sm m-0">{error}</p>
        </div>
      )}

      {/* LOADING SECTION */}
      {isLoading && (
        <div className="loading-section" aria-live="polite">
          <LoadingSpinner />
        </div>
      )}

      {/* RESULT SECTION */}
      {excuse && !isLoading && showResult && (
        <div className="result-section" role="region" aria-label="생성된 변명" ref={resultRef}>
          <div className="result-header">
            <div className="result-potato">🥔💭</div>
          </div>
          
          <div className="result-bubble">
            <p className="result-text">{excuse}</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="action-buttons">
            <button
              onClick={regenerateExcuse}
              className="action-btn"
              aria-label="다른 변명을 생성합니다"
            >
              다른 변명 보기
            </button>
            <button
              onClick={copyToClipboard}
              className={`action-btn ${copySuccess ? 'success' : ''}`}
              aria-label="변명을 클립보드에 복사합니다"
              disabled={copySuccess}
            >
              {copySuccess ? '복사 완료! 👍' : '복사하기'}
            </button>
            <button
              onClick={shareExcuse}
              className="action-btn"
              aria-label="변명을 공유합니다"
            >
              공유하기
            </button>
          </div>
        </div>
      )}

      {/* FOOTER SECTION */}
      <div className="footer-section">
        말하는 감자들을 위한 변명 생성기 🥔<br />
        <small className="footer-disclaimer">
          ※ 제작자 : Vivebob / bobstudybob@gmail.com 
        </small>
      </div>
    </div>
  );
}