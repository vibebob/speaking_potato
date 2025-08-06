import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "감자 변명 생성기 🥔 - 완벽한 변명을 만들어드려요!",
  description: "말하는 감자를 위한 귀여운 변명 생성기! 과제, 지각, 발표 등 모든 상황에 완벽한 감자 변명을 AI로 생성해드려요.",
  keywords: "감자, 변명, 생성기, 대학생, 밈, AI",
  authors: [{ name: "Potato Team" }],
  creator: "Potato Team",
  publisher: "Potato Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "감자 변명 생성기 🥔",
    description: "오늘도 감자같은 하루를 보내셨나요? 완벽한 변명을 만들어드릴게요!",
    type: "website",
    locale: "ko_KR",
    siteName: "감자 변명 생성기",
  },
  twitter: {
    card: "summary_large_image",
    title: "감자 변명 생성기 🥔",
    description: "오늘도 감자같은 하루를 보내셨나요? 완벽한 변명을 만들어드릴게요!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
