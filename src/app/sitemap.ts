import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://talking-potato.vercel.app'
  const currentDate = new Date()
  
  // 기본 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    },
  ]

  // 커뮤니티 포스트 동적 추가
  let communityPosts: MetadataRoute.Sitemap = []
  
  try {
    const postsPath = path.join(process.cwd(), 'data', 'community-posts.json')
    if (fs.existsSync(postsPath)) {
      const postsData = fs.readFileSync(postsPath, 'utf-8')
      const posts = JSON.parse(postsData)
      
      communityPosts = posts.map((post: any) => ({
        url: `${baseUrl}/community/${post.id}`,
        lastModified: new Date(post.timestamp),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('커뮤니티 포스트 로드 중 오류:', error)
  }

  return [...staticPages, ...communityPosts]
} 