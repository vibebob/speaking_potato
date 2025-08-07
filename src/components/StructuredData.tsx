export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "말하는 감자 변명 생성기",
    "description": "말하는 감자 변명 생성기! 과제, 지각, 발표 등 모든 상황에 완벽한 감자 변명을 AI로 생성해드려요.",
    "url": "https://talking-potato.vercel.app",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web Browser",
    "author": {
      "@type": "Organization",
      "name": "말하는 감자 팀"
    },
    "creator": {
      "@type": "Organization",
      "name": "말하는 감자 팀"
    },
    "keywords": "말하는 감자, 감자 변명, 변명 생성기, 감자 밈, AI 변명, 대학생 변명",
    "inLanguage": "ko",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 