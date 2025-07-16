"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/api-client";

const API_BASE = "http://localhost:3001";

interface Category {
  id: number;
  title_en: string;
  image: string;
}

export default function JournalsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const locale = useLocale();

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

  const getText = (item: Category, key: string) => item[key as keyof Category] || "";

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">Journals (From Categories API)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/${locale}/journals/${cat.id}`}
            className="block p-6 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={`${API_BASE}/uploads/categories/${cat.image}`}
              alt={cat.title_en}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{getText(cat, "title_en")}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
