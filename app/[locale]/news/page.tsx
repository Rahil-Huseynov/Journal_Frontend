// app/news/page.tsx
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { az } from "date-fns/locale"

interface News {
  id: number
  createdAt: string
  title_az: string
  description_az: string
  image: string
}

export default async function NewsPage() {
  const news: News[] = await apiClient.getNews()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Xəbərlər</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link href={`/news/${item.id}`} key={item.id}>
            <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/news/${item.image}`}
                alt={item.title_az}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title_az}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{item.description_az}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {format(new Date(item.createdAt), "dd MMMM yyyy", { locale: az })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
