"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

const categories = [
  {
    id: "mathematics",
    name: "Riyaziyyat",
    nameEn: "Mathematics",
    nameRu: "Математика",
    description: "Riyazi elmlər və tətbiqi riyaziyyat",
    descriptionEn: "Mathematical sciences and applied mathematics",
    descriptionRu: "Математические науки и прикладная математика",
    articleCount: 245,
    color: "bg-blue-100 text-blue-800",
    series: [
      { id: "pure-math", name: "Saf Riyaziyyat", articles: 89 },
      { id: "applied-math", name: "Tətbiqi Riyaziyyat", articles: 76 },
      { id: "statistics", name: "Statistika", articles: 80 },
    ],
  },
  {
    id: "physics",
    name: "Fizika",
    nameEn: "Physics",
    nameRu: "Физика",
    description: "Nəzəri və eksperimental fizika",
    descriptionEn: "Theoretical and experimental physics",
    descriptionRu: "Теоретическая и экспериментальная физика",
    articleCount: 198,
    color: "bg-green-100 text-green-800",
    series: [
      { id: "quantum-physics", name: "Kvant Fizikası", articles: 67 },
      { id: "classical-physics", name: "Klassik Fizika", articles: 54 },
      { id: "astrophysics", name: "Astrofizika", articles: 77 },
    ],
  },
  {
    id: "chemistry",
    name: "Kimya",
    nameEn: "Chemistry",
    nameRu: "Химия",
    description: "Üzvi və qeyri-üzvi kimya",
    descriptionEn: "Organic and inorganic chemistry",
    descriptionRu: "Органическая и неорганическая химия",
    articleCount: 167,
    color: "bg-purple-100 text-purple-800",
    series: [
      { id: "organic-chemistry", name: "Üzvi Kimya", articles: 78 },
      { id: "inorganic-chemistry", name: "Qeyri-üzvi Kimya", articles: 45 },
      { id: "physical-chemistry", name: "Fiziki Kimya", articles: 44 },
    ],
  },
  {
    id: "biology",
    name: "Biologiya",
    nameEn: "Biology",
    nameRu: "Биология",
    description: "Həyat elmləri və biotexnologiya",
    descriptionEn: "Life sciences and biotechnology",
    descriptionRu: "Науки о жизни и биотехнология",
    articleCount: 289,
    color: "bg-emerald-100 text-emerald-800",
    series: [
      { id: "molecular-biology", name: "Molekulyar Biologiya", articles: 98 },
      { id: "genetics", name: "Genetika", articles: 87 },
      { id: "ecology", name: "Ekologiya", articles: 104 },
    ],
  },
  {
    id: "computer-science",
    name: "Kompüter Elmləri",
    nameEn: "Computer Science",
    nameRu: "Компьютерные науки",
    description: "Proqramlaşdırma və süni intellekt",
    descriptionEn: "Programming and artificial intelligence",
    descriptionRu: "Программирование и искусственный интеллект",
    articleCount: 334,
    color: "bg-orange-100 text-orange-800",
    series: [
      { id: "artificial-intelligence", name: "Süni İntellekt", articles: 145 },
      { id: "software-engineering", name: "Proqram Mühəndisliyi", articles: 98 },
      { id: "data-science", name: "Verilənlər Elmi", articles: 91 },
    ],
  },
  {
    id: "medicine",
    name: "Tibb",
    nameEn: "Medicine",
    nameRu: "Медицина",
    description: "Klinik və fundamental tibb elmləri",
    descriptionEn: "Clinical and fundamental medical sciences",
    descriptionRu: "Клинические и фундаментальные медицинские науки",
    articleCount: 412,
    color: "bg-red-100 text-red-800",
    series: [
      { id: "clinical-medicine", name: "Klinik Tibb", articles: 178 },
      { id: "pharmacology", name: "Farmakologiya", articles: 123 },
      { id: "public-health", name: "İctimai Səhiyyə", articles: 111 },
    ],
  },
]

export default function CategoriesPage() {
  const t = useTranslations("Categories")

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Badge className={category.color}>
                    {category.articleCount} {t("totalArticles")}
                  </Badge>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Seriyalar:</h4>
                  {category.series.map((series) => (
                    <div key={series.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{series.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {series.articles}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href={`/categories/${category.id}`} className="block mt-4">
                  <Button className="w-full">
                    {t("viewSeries")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
