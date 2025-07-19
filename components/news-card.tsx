import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageCarousel } from "./image-carousel"
import { News } from "@/lib/types"
import { useLocale } from "next-intl"

interface NewsCardProps {
  news: News
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + "..."
}

export function NewsCard({ news }: NewsCardProps) {
  const displayTitle = truncateText(news.title_en, 50)
  const displayDescription = truncateText(news.description_en, 100)
  const locale = useLocale();

  return (
    <div>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <ImageCarousel images={news.images} altPrefix={news.title_en} />
        </CardContent>
        <CardHeader className="flex-grow">
          <CardTitle className="text-lg font-semibold leading-tight">{displayTitle}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-2">{displayDescription}</CardDescription>
        </CardHeader>
        <Link
          href={`/${locale}/news/${news.id}`}
          className="inline-block m-4 p-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-center hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Daha ətraflı bax
        </Link>
      </Card>
    </div>
  )
}
