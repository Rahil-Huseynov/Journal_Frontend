'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Category {
  id: number
  title_az: string
  title_en: string
  title_ru: string
  description_az: string
  description_en: string
  description_ru: string
  image: string
}

export default function JournalsPage({ params }: { params: { locale: string } }) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories()
        setCategories(response)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const getLocaleText = (category: Category) => {
    switch (params.locale) {
      case 'en':
        return {
          title: category.title_en,
          description: category.description_en,
        }
      case 'ru':
        return {
          title: category.title_ru,
          description: category.description_ru,
        }
      default:
        return {
          title: category.title_az,
          description: category.description_az,
        }
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">Jurnallar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const { title, description } = getLocaleText(category)

            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow rounded-2xl overflow-hidden border border-gray-200">
                {category.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${category.image}`}
                    alt={title}
                    className="h-50 w-full object-contain p-1"
                  />
                )}
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                  </div>
                  <CardDescription className="mt-2 text-gray-600 text-sm line-clamp-3">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Link
                    href={`/${params.locale}/journals/${category.id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Daha ətraflı
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
