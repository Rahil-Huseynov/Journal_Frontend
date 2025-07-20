"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import AnimatedText from "@/components/AnimatedText"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { NewsCard } from "@/components/news-card"
import { News } from "@/lib/types"



interface Category {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  image: string;
}


export default function LandingPage() {
  const locale = useLocale();
  const t = useTranslations("Hero")

  const animatedTexts = [
    {
      before: t("text.before"),
      highlight: t("text.highlight"),
      after: t("text.after")
    }
  ];

  const [news, setNews] = useState<News[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient.getCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await apiClient.getNews();
        setNews(categories);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, []);
  function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              {t("badge")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <AnimatedText texts={animatedTexts} />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/auth/register`}>
                <Button size="lg" className="w-full sm:w-auto">
                  {t("startNow")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                {t("learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {t("all_journal")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {t("Discoverallthescientific")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div className="flex justify-center">
                  <div className="h-[350px] w-[300px]">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/categories/${category.image}`}
                      alt={category[`title_${locale}`]}
                      className="w-full h-full object-contain rounded-md mb-4"
                    />
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between h-56">
                  <div className="mt-5">
                    <h2 className="text-xl font-semibold mb-2 break-words">
                      {truncate(category[`title_${locale}`] || "", 100)}

                    </h2>
                    <p className="text-sm text-gray-700 break-words">
                      {truncate(category[`description_${locale}`] || "", 100)}
                    </p>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Link
                      href={`/${locale}/journals/${category.id}`}
                      className="
                    inline-flex items-center justify-center
                    px-5 py-2
                    bg-white text-blue-600
                    border border-blue-600
                    font-medium
                    rounded-md
                    shadow-sm
                    hover:bg-blue-50
                    active:scale-95
                    transition
                    duration-150
                  "
                    >
                      {t("Readmore")}
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="news" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {t("LatestNews")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {news.slice(0, 4).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              href={`${locale}/news`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-700 transition duration-300"
            >
              {t("Allnews")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Scientific Journals</span>
              </div>
              <p className="text-gray-400">Elmi tədqiqatçılar üçün yaradılmış peşəkar platform</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Xidmətlər</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Məqalə Dərc Etmə</li>
                <li>Tədqiqat Layihələri</li>
                <li>Akademik Şəbəkə</li>
                <li>Sertifikatlaşdırma</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Dəstək</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Yardım Mərkəzi</li>
                <li>Əlaqə</li>
                <li>FAQ</li>
                <li>Texniki Dəstək</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Əlaqə</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@scientificjournals.az</li>
                <li>+994 12 345 67 89</li>
                <li>Bakı, Azərbaycan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Scientific Journals. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
