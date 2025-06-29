import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const categories = {
  mathematics: {
    name: "Riyaziyyat",
    description: "Riyazi elmlər və tətbiqi riyaziyyat",
    series: [
      {
        id: "pure-math",
        name: "Saf Riyaziyyat",
        description: "Nəzəri riyaziyyat və abstrakt strukturlar",
        articles: [
          {
            id: "1",
            title: "Qrup Nəzəriyyəsində Yeni Yanaşmalar",
            author: "Dr. Əli Məmmədov",
            date: "2024-01-15",
            abstract: "Bu məqalədə qrup nəzəriyyəsinin müasir problemləri araşdırılır...",
          },
          {
            id: "2",
            title: "Topoloji Fəzalarda Konvergensiya",
            author: "Prof. Leyla Həsənova",
            date: "2024-01-10",
            abstract: "Topoloji fəzalarda konvergensiya anlayışının genişləndirilməsi...",
          },
        ],
      },
      {
        id: "applied-math",
        name: "Tətbiqi Riyaziyyat",
        description: "Praktik problemlərin riyazi həlli",
        articles: [
          {
            id: "3",
            title: "Optimallaşdırma Problemlərində Yeni Metodlar",
            author: "Dr. Rəşad Əliyev",
            date: "2024-01-12",
            abstract: "Çoxölçülü optimallaşdırma problemlərinin həlli üçün yeni yanaşma...",
          },
        ],
      },
    ],
  },
}

interface PageProps {
  params: {
    categoryId: string
    locale: string
  }
}

export default function CategoryDetailPage({ params }: PageProps) {
  const category = categories[params.categoryId as keyof typeof categories]

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kateqoriyalara qayıt
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-xl text-gray-600">{category.description}</p>
        </div>

        <div className="space-y-8">
          {category.series.map((series) => (
            <Card key={series.id}>
              <CardHeader>
                <CardTitle className="text-2xl">{series.name}</CardTitle>
                <CardDescription>{series.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {series.articles.map((article) => (
                    <Card key={article.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <Badge variant="secondary">Yeni</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {article.date}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 mb-4">{article.abstract}</p>
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Oxu
                          </Button>
                          <Button size="sm" variant="outline">
                            Yüklə
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
