'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('암호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`,
          'X-Admin-Key': password
        }
      });

      if (response.ok) {
        // 성공하면 세션에 관리자 인증 정보 저장
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_token', password);
        router.push('/admin/dashboard');
      } else {
        setError('잘못된 암호입니다.');
      }
    } catch (err) {
      console.error('관리자 인증 실패:', err);
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md px-6">
        {/* 네비게이션 탭 */}
        <div className="pb-6 flex justify-center">
          <div className="flex bg-white rounded-2xl shadow-lg p-1 border-2 border-amber-200 w-[400px]">
            <button className="flex-1 text-center py-3 px-4 rounded-xl font-bold bg-amber-500 text-white shadow-md transition-all">
              <span className="text-lg mr-2">🔐</span>
              관리자 로그인
            </button>
          </div>
        </div>

        {/* 관리자 로그인 폼 */}
        <div className="bg-white rounded-3xl shadow-xl p-12 border-2 border-amber-200">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🥔</div>
            <h1 className="text-2xl font-bold text-amber-800 mb-2">관리자 로그인</h1>
            <p className="text-gray-600">말하는 감자 변명 생성기 관리자 페이지</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                관리자 암호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 암호를 입력하세요"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {error && (
              <div className="text-center p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 font-bold text-lg shadow-md"
            >
              {isLoading ? '🔐 인증 중...' : '🔐 로그인'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              관리자 권한이 필요합니다.
            </p>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-6 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">🔒 보안 안내</h3>
            <p className="text-xs text-amber-700">
              • 관리자 암호는 안전하게 보관하세요<br/>
              • 공용 컴퓨터에서는 로그아웃을 잊지 마세요<br/>
              • 의심스러운 접근 시 즉시 암호를 변경하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}