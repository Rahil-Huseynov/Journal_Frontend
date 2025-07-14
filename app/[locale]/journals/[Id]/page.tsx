'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Author {
    id: number
    firstName: string
    lastName: string
    workplace: string | null
    country: string | null
}

interface GlobalSubCategory {
    id: number
    title_az: string
    title_en: string
    title_ru: string
    description_az: string
    description_en: string
    description_ru: string
    file: string
    authors: Author[]
}

interface Category {
    globalSubCategory: GlobalSubCategory[]
    authors: Author[]
}

export default function GlobalSubCategoryList({ params }: { params: { locale: string } }) {
    const [subcategories, setSubcategories] = useState<GlobalSubCategory[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Category[] = await apiClient.getCategories()

                // Hər alt kateqoriyaya o kateqoriyanın müəlliflərini əlavə edirik
                const allSubs = response.flatMap((cat) =>
                    (cat.globalSubCategory || []).map((sub) => ({
                        ...sub,
                        authors: cat.authors || [],
                    }))
                )

                setSubcategories(allSubs)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const getLocaleText = (item: GlobalSubCategory) => {
        switch (params.locale) {
            case 'en':
                return { title: item.title_en, description: item.description_en }
            case 'ru':
                return { title: item.title_ru, description: item.description_ru }
            default:
                return { title: item.title_az, description: item.description_az }
        }
    }

    return (
        <div className="w-full mx-auto py-12 px-6">
            <div className="space-y-14">
                {subcategories.map((sub) => {
                    const { title, description } = getLocaleText(sub)

                    return (
                        <Card
                            key={sub.id}
                            className="rounded-3xl shadow-lg border border-gray-200 bg-white"
                        >
                            <CardHeader className="pb-1 px-8 pt-8">
                                <CardTitle className="text-3xl break-words font-extrabold text-gray-900">{title}</CardTitle>
                                <p className="mt-3 text-gray-600 break-words leading-relaxed text-lg max-w-4xl">{description}</p>
                            </CardHeader>
                            <CardContent className="px-8 pt-6 pb-10">
                                <div className="grid grid-cols-4 gap-8 custom900:grid-cols-1">
                                    <div className="col-span-3 custom900:col-span-4 h-full">
                                        {sub.file ? (
                                            <iframe
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/globalsubcategory/${sub.file}#toolbar=1`}
                                                title="PDF Viewer"
                                                className="w-full h-full rounded-xl shadow-md"
                                                style={{ border: 'none' }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 italic text-lg bg-gray-50 rounded-xl">
                                                PDF faylı mövcud deyil
                                            </div>
                                        )}
                                    </div>

                                    <aside className="col-span-1 h-[650px] bg-gray-50 p-6 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-3">
                                            Redaksiya heyəti
                                        </h3>
                                        {sub.authors && sub.authors.length > 0 ? (
                                            <ul className="space-y-5 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                {sub.authors.map((author) => (
                                                    <li key={author.id} className="text-gray-700">
                                                        <p className="font-semibold text-lg">
                                                            {author.firstName} {author.lastName}
                                                        </p>
                                                        {author.country && <p className="text-gray-500">Ölkə: {author.country}</p>}
                                                        {author.workplace && <p className="text-gray-500">İş yeri: {author.workplace}</p>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic text-center mt-20">Müəllif yoxdur</p>
                                        )}
                                    </aside>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
