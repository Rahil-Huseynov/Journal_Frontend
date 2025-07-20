"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/lib/api-client";

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

export default function JournalsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const locale = useLocale();
  const t = useTranslations("Journals")

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiClient.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  const getText = (item: Category, key: "title" | "description") =>
    item[`${key}_${locale}`] ||
    item[`${key}_az`] ||
    "";

  const truncate = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">{t("Journals")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const title = truncate(getText(cat, "title"));
          const description = truncate(getText(cat, "description"));

          return (
            <div
              key={cat.id}
              className="flex flex-col justify-between p-6 border rounded-xl shadow-sm h-[600px] hover:shadow-md transition"
            >
              <div className="flex justify-center">
                <div className="h-[350px] w-[300px]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/categories/${cat.image}`}
                    alt={title}
                    className="w-full h-full object-contain rounded-md mb-4"
                  />
                </div>
              </div>

              <div className="mt-5">
                <h2 className="text-xl font-semibold mb-2 break-words">
                  {title}
                </h2>
                <p className="text-sm text-gray-700 break-words">
                  {description}
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <Link
                  href={`/${locale}/journals/${cat.id}`}
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
          );
        })}
      </div>
    </div>
  );
}
