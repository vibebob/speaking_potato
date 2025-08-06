import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 최적화
  output: 'standalone',
  
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // 이미지 최적화 설정
  images: {
    unoptimized: true,
  },
  
  // 타입스크립트 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
