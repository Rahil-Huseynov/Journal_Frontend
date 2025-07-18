"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/api-client";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  workplace?: string | null;
  country?: string | null;
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
}

interface Category {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  globalSubCategory: GlobalSubCategory[];
  authors: Author[];
}

export default function JournalsInGlobalSubCategories() {
  const { id, userJournalId } = useParams<{
    id: string;
    userJournalId: string;
  }>();
  const locale = useLocale();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getText = (item: any, key: string) =>
    item?.[`${key}_${locale}`] ?? item?.[`${key}_az`] ?? "";

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await apiClient.getCategoryById(Number(id));
        setCategory(data);
      } catch {
        setError("Məlumatları yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Yüklənir...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!category)
    return (
      <div className="p-6 text-center text-red-600">Kateqoriya tapılmadı.</div>
    );

  const selectedSubCategory = category.globalSubCategory.find(
    (sub) => sub.id.toString() === userJournalId
  );

  if (!selectedSubCategory)
    return (
      <div className="p-6 text-center text-red-600">
        Alt kateqoriya tapılmadı.
      </div>
    );


  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl break-words font-bold text-center">
        {getText(selectedSubCategory, "title")}
      </h1>
      <div className="flex flex-col xl:flex-row xl:space-x-8 space-y-8 xl:space-y-0">
        <div className="w-full xl:w-1/4">
          {selectedSubCategory.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/globalsubcategory/${selectedSubCategory.image}`}
              alt={getText(selectedSubCategory, "title")}
              className="w-full h-48 xl:h-64 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-48 xl:h-64 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
              Şəkil yoxdur
            </div>
          )}
        </div>

        <div className="w-full xl:w-2/4 overflow-auto">
          {selectedSubCategory.userJournals.length === 0  ? (
            <p className="italic text-gray-600">Bu alt kateqoriyada jurnal tapılmadı.</p>
          ) : (
            <ul className="space-y-6">
              {selectedSubCategory.userJournals.map((journal) => (
                <li
                  key={journal.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-xl transition"
                >
                  <h2 className="font-semibold text-xl mb-2">
                    {getText(journal, "title")}
                  </h2>
                  <p className="text-gray-700 mb-3">
                    {getText(journal, "description")}
                  </p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/journals/${journal.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Jurnalı yüklə
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full xl:w-1/2 border h-full rounded-lg p-4 overflow-auto">
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
    </div>
  );
}
