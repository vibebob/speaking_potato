'use client';

import Link from 'next/link';
import ExcuseGenerator from '@/components/ExcuseGenerator';

export default function Home() {
  // 변명 생성 후 콜백 (향후 확장용)
  const handleExcuseGenerated = (situation: string) => {
    // 향후 기능 확장을 위한 콜백
    console.log('변명 생성 완료:', situation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl px-6">
        {/* 네비게이션 탭 */}
        <div className="pb-6 flex justify-center">
          <div className="flex bg-white rounded-2xl shadow-lg p-2 border-2 border-amber-200 w-[600px]">
            <button className="flex-1 text-center py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
              <span className="text-lg mr-2">🥔</span>
              변명 생성기
            </button>
            
            <Link href="/community" className="flex-1 text-center py-3 px-4 rounded-xl font-bold text-amber-700 hover:bg-amber-50 transition-all relative">
              <span className="text-lg mr-2">💬</span>
              감자들의 대나무숲
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </Link>
          </div>
        </div>

        {/* 변명 생성기 */}
        <div className="flex justify-center py-4">
          <ExcuseGenerator onExcuseGenerated={handleExcuseGenerated} />
        </div>
      </div>
    </div>
  );
}