"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  workplace?: string;
  country?: string;
}

interface UserJournal {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  file: string;
}

interface GlobalSubCategory {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  categoryId: number;
  image: string | null;
  userJournals: UserJournal[];
  authors: Author[];
  file: string
}

interface Category {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  image: string;
  globalSubCategory: GlobalSubCategory[];
  authors: Author[];
}

export default function JournalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locale = useLocale();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const data = await apiClient.getCategoryById(Number(id));
        setCategory(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Məlumatları yükləmək mümkün olmadı.");
        setLoading(false);
      }
    }
    if (id) fetchCategory();
  }, [id]);

  const getText = (item: any, key: string) =>
    item[`${key}_${locale}`] || item[`${key}_az`] || "";

  if (loading) return <div className="p-8 text-center">Yüklənir...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!category) return <div className="p-8 text-center">Kateqoriya tapılmadı.</div>;

  return (
    <div className="w-full p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">{getText(category, "title")}</h1>

      {category.globalSubCategory.length === 0 ? (
        <p>Bu kateqoriyaya aid global alt kateqoriya tapılmadı.</p>
      ) : (
        <div className="min-custom-xl:grid min-custom-xl:items-center min-custom-xl:grid-cols-2 max-custom-xl:grid max-custom-xl:grid-cols-1 gap-6 space-y-6">
          <div className="grid gap-6">
            {category.globalSubCategory.map((sub) => (
              <div
                key={sub.id}
                className="w-full border rounded-xl p-6 shadow hover:shadow-md transition grid grid-cols-12 gap-6"
              >
                <div className="col-span-3">
                  {sub.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/subcategory/${sub.image}`}
                      alt={getText(sub, "title")}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                      Şəkil yoxdur
                    </div>
                  )}
                </div>

                <div className="flex justify-between flex-col col-span-6">
                  <div className=" col-span-6 w-full ">
                    <h3 className="text-2xl break-words font-semibold mb-2">{getText(sub, "title")}</h3>
                    <p className="text-gray-700 text-sm break-words">{getText(sub, "description")}</p>
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/uploads/globalsubcategory/${sub.file}`, "_blank")}
                      className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
                      Yüklə
                    </button>
                    <Link
                      className="px-5 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition duration-300"
                      href={`/${locale}/journals/${category.id}/${sub.id}`}>
                      Bax
                    </Link>

                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="border rounded-xl p-6 overflow-x-auto">
            <h4 className="text-lg text-center font-semibold mb-2">Redaksiya heyəti</h4>
            {category.authors.length === 0 ? (
              <p className="text-gray-500 text-sm">Müəllif tapılmadı.</p>
            ) : (
              <ul className="text-sm text-gray-700">
                <table className="w-full text-sm text-left border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border w-[160] break-words">Ad</th>
                      <th className="p-2 border w-[160] break-words">Soyad</th>
                      <th className="p-2 border w-[160] break-words">Elmi dərəcə/Elmi ad</th>
                      <th className="p-2 border w-[160] break-words">İş yeri</th>
                      <th className="p-2 border w-[160] break-words">Ölkə</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.authors.map((author) => (
                      <tr key={author.id}>
                        <td className="p-2 border w-[160] break-words align-top !text-left">{author.firstName}</td>
                        <td className="p-2 border w-[160] break-words align-top !text-left">{author.lastName}</td>
                        <td className="p-2 border w-[160] break-words align-top !text-left">elmi derece</td>
                        <td className="p-2 border w-[160] break-words align-top !text-left">{author.workplace}</td>
                        <td className="p-2 border w-[160] break-words align-top !text-left">{author.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
