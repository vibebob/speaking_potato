'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [adminKey, setAdminKey] = useState('');

  const testConnection = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/admin/cleanup');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ 연결 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runCleanup = async () => {
    if (!adminKey.trim()) {
      setResult('❌ 관리자 키를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ 정리 작업 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl px-6">
        <div className="flex justify-center py-4">
          <div className="main-container">
            {/* HEADER SECTION */}
            <div className="header-section">
              <div className="potato-character">🔧🥔</div>
              <h1 className="main-title">관리자 대시보드</h1>
              <p className="subtitle">
                감자 대나무숲 관리 도구<br />
                데이터베이스 상태 확인 및 정리 작업
              </p>
            </div>

            {/* 연결 테스트 섹션 */}
            <div className="input-section">
              <label className="tone-label">📡 데이터베이스 연결 상태</label>
              <div className="button-section">
                <button
                  onClick={testConnection}
                  disabled={isLoading}
                  className="action-btn"
                >
                  {isLoading ? '테스트 중...' : '연결 테스트'}
                </button>
              </div>
            </div>

            {/* 정리 작업 섹션 */}
            <div className="input-section">
              <label className="tone-label">🧹 비활성 게시글 정리</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="관리자 키를 입력하세요"
                className="situation-input"
              />
              <div className="text-xs text-text-secondary mt-2">
                7일 이상 댓글이 없는 게시글을 삭제합니다
              </div>
              <div className="button-section">
                <button
                  onClick={runCleanup}
                  disabled={isLoading || !adminKey.trim()}
                  className="generate-btn"
                  style={{ minWidth: 'auto', padding: '15px 30px' }}
                >
                  {isLoading ? '🧹 정리 중...' : '🧹 정리 실행'}
                </button>
              </div>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="result-section">
                <div className="result-bubble">
                  <p className="result-text">{result}</p>
                </div>
              </div>
            )}

            {/* 사용법 안내 */}
            <div className="input-section">
              <label className="tone-label">📖 사용 안내</label>
              <div className="result-bubble">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>연결 테스트:</strong> Supabase 데이터베이스 연결 상태를 확인합니다.</p>
                  <p><strong>정리 작업:</strong> 7일 이상 댓글이 없는 게시글을 자동으로 삭제합니다.</p>
                  <p><strong>관리자 키:</strong> 환경 변수 ADMIN_SECRET_KEY에 설정된 값입니다.</p>
                  <p className="text-amber-600"><strong>주의:</strong> 정리 작업은 되돌릴 수 없습니다!</p>
                </div>
              </div>
            </div>

            {/* FOOTER SECTION */}
            <div className="footer-section">
              감자 대나무숲 관리자 도구 🔧<br />
              <small className="footer-disclaimer">
                ※ 관리자만 접근 가능
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}