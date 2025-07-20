import { ImageCarousel } from "@/components/image-carousel"
import { apiClient } from "@/lib/api-client"
import { News } from "@/lib/types"
import { notFound } from "next/navigation"

interface NewsDetailPageProps {
  params: {
    id: string
    locale: string
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsId = Number.parseInt(params.id)
  if (isNaN(newsId)) notFound()

  const newsItem = await apiClient.getNewsById(newsId)
  if (!newsItem) notFound()
  const locale = params.locale.toLowerCase()
  const title =
    locale === "en" ? newsItem.title_en :
    locale === "ru" ? newsItem.title_ru :
    newsItem.title_az

  const description =
    locale === "en" ? newsItem.description_en :
    locale === "ru" ? newsItem.description_ru :
    newsItem.description_az

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
        <div className="flex mt-6 justify-center items-center">
          <div className="min-w-[700px] max-w-[700px] border-b border-gray-200 dark:border-gray-700">
            <ImageCarousel images={newsItem.images} altPrefix={title} />
          </div>
        </div>
        <article className="px-6 md:px-10 py-8">
          <header className="mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
              {title}
            </h1>
          </header>

          <section className="prose dark:prose-invert prose-lg max-w-none leading-relaxed">
            <p>{description}</p>
          </section>
          <section>
            <p className="text-sm text-muted-foreground text-end mt-2">
               {new Date(newsItem.createdAt).toLocaleDateString()}
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
