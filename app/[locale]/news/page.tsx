"use client"

import { useEffect, useState } from "react"
import { NewsCard } from "@/components/news-card"
import { apiClient } from "@/lib/api-client"
import { News } from "@/lib/types"

export default function NewsListPage() {
  const [newsItems, setNewsItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiClient.getNews()
        setNewsItems(data)
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, []) 

  if (loading) {
    return <div className="text-center mt-10">Yüklənir...</div>
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest News</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {newsItems.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </main>
  )
}
