import type { Metadata, Viewport } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import Script from "next/script";

export const metadata: Metadata = {
  title: "말하는 감자 변명 생성기 🥔 - AI 감자 변명 메이커",
  description: "말하는 감자 변명 생성기! 과제, 지각, 발표 등 모든 상황에 완벽한 감자 변명을 AI로 생성해드려요. 말하는 감자 밈과 함께 재미있는 변명을 만들어보세요.",
  keywords: "말하는 감자, 감자 변명, 변명 생성기, 감자 밈, AI 변명, 대학생 변명, 말하는 감자 변명, 감자 메이커, 감자 생성기",
  authors: [{ name: "말하는 감자 팀" }],
  creator: "말하는 감자 팀",
  publisher: "말하는 감자 팀",
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "말하는 감자 변명 생성기 🥔 - AI 감자 변명 메이커",
    description: "말하는 감자 변명 생성기! 오늘도 감자같은 하루를 보내셨나요? AI가 완벽한 감자 변명을 만들어드릴게요!",
    type: "website",
    locale: "ko_KR",
    siteName: "말하는 감자 변명 생성기",
    url: "https://talking-potato.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "말하는 감자 변명 생성기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "말하는 감자 변명 생성기 🥔 - AI 감자 변명 메이커",
    description: "말하는 감자 변명 생성기! AI가 완벽한 감자 변명을 만들어드릴게요!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "your-google-verification-code",
  },
  alternates: {
    canonical: "https://talking-potato.vercel.app",
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
      <head>
        <StructuredData />
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "your-google-verification-code"} />
      </head>
      <body className="antialiased">
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
