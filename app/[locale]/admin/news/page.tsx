'use client';

import { apiClient } from '@/lib/api-client';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'az', label: 'Azərbaycan' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

type Lang = 'az' | 'en' | 'ru';

type FormState = {
  [key in `title_${Lang}` | `description_${Lang}`]: string;
} & {
  image?: string;
};

type NewsItem = {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  image?: string;
};

export default function AddNewsPage() {
  const [form, setForm] = useState<FormState>({
    title_az: '',
    title_en: '',
    title_ru: '',
    description_az: '',
    description_en: '',
    description_ru: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const locale = useLocale();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>({
    title_az: '',
    title_en: '',
    title_ru: '',
    description_az: '',
    description_en: '',
    description_ru: '',
  });
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await apiClient.getNews()
      setNewsList(data);
    } catch {
      alert('Xəbərləri gətirərkən xəta baş verdi');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditFile(e.target.files[0]);
    }
  };

  const createFormData = (data: typeof form, file: File | null) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append('image', file);
    }
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = createFormData(form, file);

      await apiClient.addnews(formData)
      window.location.href = `/${locale}/admin/news`;
      setForm({
        title_az: '',
        title_en: '',
        title_ru: '',
        description_az: '',
        description_en: '',
        description_ru: '',
      });
      setFile(null);
      await fetchNews();
    } catch {
      alert('Xəbər əlavə edilərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xəbəri silmək istədiyinizə əminsiniz?')) return;
    try {
      await apiClient.deletenews(id)
      window.location.href = `/${locale}/admin/news`;
      setNewsList((prev) => prev.filter((news) => news.id !== id));
    } catch {
      alert('Xəbər silinərkən xəta baş verdi');
    }
  };

  const openEditModal = (news: NewsItem) => {
    setEditNewsId(news.id);
    setEditForm({
      title_az: news.title_az,
      title_en: news.title_en,
      title_ru: news.title_ru,
      description_az: news.description_az,
      description_en: news.description_en,
      description_ru: news.description_ru,
      image: news.image || '',
    });
    setEditFile(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNewsId) return;
    setEditLoading(true);
    try {
      const formData = createFormData(editForm, editFile);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${editNewsId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Xəbər yenilənə bilmədi');
      setEditModalOpen(false);
      await fetchNews();
    } catch {
      alert('Xəbər yenilənərkən xəta baş verdi');
    } finally {
      setEditLoading(false);
    }
  };

  const closeModal = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-6">
      <div className="w-full bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-12 text-center tracking-wide">
          Yeni Xəbər Əlavə Et
        </h1>
        <form onSubmit={handleSubmit} className="space-y-14">
          <section>
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6 border-b border-indigo-200 pb-3">
              Başlıqlar
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {languages.map(({ code, label }) => (
                <div key={code}>
                  <label
                    htmlFor={`title_${code}`}
                    className="block mb-2 text-lg font-semibold text-indigo-900"
                  >
                    {label}
                  </label>
                  <input
                    id={`title_${code}`}
                    name={`title_${code}`}
                    type="text"
                    value={form[`title_${code}`]}
                    onChange={handleChange}
                    placeholder={`${label} dilində başlıq`}
                    required
                    className="w-full rounded-xl border border-indigo-300 px-4 py-3 text-lg
                      placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400
                      focus:border-indigo-600 transition shadow-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6 border-b border-indigo-200 pb-3">
              Məzmunlar
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {languages.map(({ code, label }) => (
                <div key={code}>
                  <label
                    htmlFor={`description_${code}`}
                    className="block mb-2 text-lg font-semibold text-indigo-900"
                  >
                    {label}
                  </label>
                  <textarea
                    id={`description_${code}`}
                    name={`description_${code}`}
                    rows={6}
                    value={form[`description_${code}`]}
                    onChange={handleChange}
                    placeholder={`${label} dilində məzmun`}
                    required
                    className="w-full rounded-xl border border-indigo-300 px-4 py-3 text-lg
                      placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400
                      focus:border-indigo-600 transition shadow-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <label className="block mb-2 font-semibold text-indigo-900 text-lg" htmlFor="image">
              Şəkil əlavə et (istəyə bağlı)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-indigo-700"
            />
            {file && <p className="mt-2 text-indigo-600">Seçilmiş fayl: {file.name}</p>}
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white text-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Əlavə olunur...' : 'Xəbəri Əlavə Et'}
          </button>
        </form>

        <section className="mt-20">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-8 border-b border-indigo-200 pb-3 text-center">
            Əlavə edilmiş xəbərlər
          </h2>

          {newsList.length === 0 ? (
            <p className="text-center text-indigo-500">Heç bir xəbər əlavə edilməyib.</p>
          ) : (
            <ul className="space-y-6">
              {newsList.map((news) => (
                <li
                  key={news.id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-indigo-900">
                      AZ: {news.title_az || <span className="text-indigo-400 italic">Boşdur</span>}
                    </p>
                    <p className="font-semibold text-indigo-900">
                      EN: {news.title_en || <span className="text-indigo-400 italic">Boşdur</span>}
                    </p>
                    <p className="font-semibold text-indigo-900">
                      RU: {news.title_ru || <span className="text-indigo-400 italic">Boşdur</span>}
                    </p>
                    {news.image && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/news/${news.image}`}
                        alt="Xəbər şəkli"
                        className="mt-2 max-h-24 rounded-lg object-contain"
                      />
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 flex gap-4">
                    <button
                      onClick={() => openEditModal(news)}
                      className="px-5 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold transition shadow"
                      type="button"
                    >
                      Düzəliş et
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow"
                      type="button"
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-extrabold text-indigo-900 mb-8 text-center">
              Xəbəri Düzəliş Et
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-8">
              {languages.map(({ code, label }) => (
                <div key={code}>
                  <label
                    htmlFor={`edit_title_${code}`}
                    className="block mb-2 font-semibold text-indigo-900"
                  >
                    {label} Başlıq
                  </label>
                  <input
                    id={`edit_title_${code}`}
                    name={`title_${code}`}
                    type="text"
                    value={editForm[`title_${code}`]}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-indigo-300 px-4 py-3 text-lg
                      placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400
                      focus:border-indigo-600 transition shadow-sm"
                  />
                  <label
                    htmlFor={`edit_description_${code}`}
                    className="block mt-4 mb-2 font-semibold text-indigo-900"
                  >
                    {label} Məzmun
                  </label>
                  <textarea
                    id={`edit_description_${code}`}
                    name={`description_${code}`}
                    rows={5}
                    value={editForm[`description_${code}`]}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-indigo-300 px-4 py-3 text-lg
                      placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400
                      focus:border-indigo-600 transition shadow-sm resize-none"
                  />
                </div>
              ))}

              <section>
                <label
                  htmlFor="edit_image"
                  className="block mb-2 font-semibold text-indigo-900 text-lg"
                >
                  Şəkil dəyişdir (istəyə bağlı)
                </label>
                <input
                  type="file"
                  id="edit_image"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="block w-full text-indigo-700"
                />
                <p className="mt-2 text-indigo-600">
                  {editFile ? editFile.name : editForm.image || 'Seçilmiş fayl yoxdur'}
                </p>
              </section>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-3 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Yenilənir...' : 'Yenilə'}
                </button>
              </div>
            </form>

            <button
              onClick={closeModal}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-indigo-600 hover:text-indigo-900 text-3xl font-bold leading-none"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
