'use client';

import { apiClient } from '@/lib/api-client';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'az', label: 'Azərbaycan' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

type Lang = 'az' | 'en' | 'ru';

type FormState = {
  [key in `title_${Lang}` | `description_${Lang}`]: string;
};

type NewsItem = {
  id: number;
  createdAt: string;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  images: { id: number; image: string }[];
};

export default function AddNewsPage() {
  const locale = useLocale();
  const t = useTranslations('Admin_News');

  const [form, setForm] = useState<FormState>({
    title_az: '',
    title_en: '',
    title_ru: '',
    description_az: '',
    description_en: '',
    description_ru: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>({ ...form });
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<{ id: number; image: string }[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    previews.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }, [files]);

  useEffect(() => {
    editPreviews.forEach((u) => URL.revokeObjectURL(u));
    const urls = editFiles.map((f) => URL.createObjectURL(f));
    setEditPreviews(urls);
  }, [editFiles]);

  async function fetchNews() {
    try {
      const data = await apiClient.getNews();
      setNewsList(data);
    } catch {
      alert(t('error_fetch_news'));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setEditFiles((prev) => [...prev, ...selected]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await apiClient.addnews(form);

      const newsId = created.id;
      for (const file of files) {
        const fm = new FormData();
        fm.append('newsId', String(newsId));
        fm.append('image', file);
        await apiClient.addnewsImage(fm);
      }

      await fetchNews();
      setForm({
        title_az: '',
        title_en: '',
        title_ru: '',
        description_az: '',
        description_en: '',
        description_ru: '',
      });
      setFiles([]);
      setPreviews([]);
    } catch {
      alert(t('error_add_news'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t('confirm_delete_news'))) return;
    try {
      await apiClient.deletenews(id);
      setNewsList((p) => p.filter((n) => n.id !== id));
    } catch {
      alert(t('error_delete_news'));
    }
  }

  function openEditModal(news: NewsItem) {
    setEditNewsId(news.id);
    setEditForm({
      title_az: news.title_az,
      title_en: news.title_en,
      title_ru: news.title_ru,
      description_az: news.description_az,
      description_en: news.description_en,
      description_ru: news.description_ru,
    });
    setEditFiles([]);
    setEditPreviews([]);
    setEditModalOpen(true);
    setExistingImages(news.images);
  }

  async function handleRemoveExisting(imgId: number) {
    if (!confirm(t('confirm_delete_image'))) return;
    try {
      await apiClient.deletenewsImage(imgId);
      setExistingImages((p) => p.filter((img) => img.id !== imgId));
    } catch {
      alert(t('error_delete_image'));
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editNewsId) return;
    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await apiClient.updatenews(editNewsId, formData);

      for (const file of editFiles) {
        const imageFd = new FormData();
        imageFd.append('newsId', String(editNewsId));
        imageFd.append('image', file);
        await apiClient.addnewsImage(imageFd);
      }

      await fetchNews();
      setEditModalOpen(false);
    } catch {
      alert(t('error_add_news'));
    } finally {
      setEditLoading(false);
    }
  }

  const getText = (item: NewsItem, key: 'id' | 'title' | 'description') =>
    item[`${key}_${locale}`] || item[`${key}_az`] || '';

  const truncate = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-6">
      <div className="bg-white p-12 rounded-3xl shadow-lg mb-12">
        <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-8">{t('add_news_title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{t('titles')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {languages.map(({ code, label }) => (
                <div key={code}>
                  <label htmlFor={`title_${code}`} className="block mb-2">
                    {label}
                  </label>
                  <input
                    id={`title_${code}`}
                    name={`title_${code}`}
                    type="text"
                    value={form[`title_${code}`]}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{t('contents')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {languages.map(({ code, label }) => (
                <div key={code}>
                  <label htmlFor={`description_${code}`} className="block mb-2">
                    {label}
                  </label>
                  <textarea
                    id={`description_${code}`}
                    name={`description_${code}`}
                    rows={4}
                    value={form[`description_${code}`]}
                    onChange={handleChange}
                    required
                    className="w-full h-[250px] resize-none border rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </section>
          <section>
            <label htmlFor="images" className="block mb-2 font-semibold">
              {t('images_label')}
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-indigo-700"
            />
          </section>
          {previews.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">{t('selected_images')}</h3>
              <div className="flex flex-wrap gap-4">
                {previews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-24 w-24 object-cover rounded border"
                  />
                ))}
              </div>
            </section>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? t('saving') : t('save')}
          </button>
        </form>
      </div>

      <section>
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">{t('existing_news')}</h2>

        {newsList.length === 0 ? (
          <p className="text-center text-gray-500">{t('no_news')}</p>
        ) : (
          <ul className="space-y-6">
            {newsList.map((n) => {
              const id = getText(n, 'title');
              const title = truncate(getText(n, 'title'));
              const description = truncate(getText(n, 'description'));
              return (
                <li
                  key={n.id}
                  className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow transition hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900">
                        {n.title_az || <em>{t('no_news')}</em>}
                      </h3>
                      <p className="text-sm text-indigo-600">
                        {new Date(n.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(n)}
                        className="px-4 py-2 rounded-full bg-yellow-400/90 hover:bg-yellow-400 text-indigo-900 font-semibold shadow"
                      >
                        {t('edit_news')}
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 space-y-3">
                    <div key={id}>
                      <p className="font-medium">
                        {title || <em className="text-gray-400">{t('no_news')}</em>}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {description || <em className="text-gray-400">{t('no_news')}</em>}
                      </p>
                    </div>
                  </div>

                  {n.images.length > 0 && (
                    <div className="flex mt-5">
                      {n.images.slice(0, 8).map((img) => (
                        <img
                          key={img.id}
                          src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/${img.image}`}
                          alt="news"
                          className="h-24 w-24 object-contain rounded-lg shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 relative animate-fadeIn">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
              aria-label={t('cancel')}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">{t('edit_news')}</h2>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {languages.map(({ code, label }) => (
                  <div key={code}>
                    <label
                      htmlFor={`edit_title_${code}`}
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      {t('edit_title', { lang: label })}
                    </label>
                    <input
                      id={`edit_title_${code}`}
                      name={`title_${code}`}
                      type="text"
                      value={editForm[`title_${code}`]}
                      onChange={handleEditChange}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`edit_description_${code}`}
                      className="block mt-3 mb-1 text-sm font-medium text-gray-700"
                    >
                      {t('edit_content', { lang: label })}
                    </label>
                    <textarea
                      id={`edit_description_${code}`}
                      name={`description_${code}`}
                      rows={4}
                      value={editForm[`description_${code}`]}
                      onChange={handleEditChange}
                      required
                      className="w-full h-[250px] border resize-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="edit_images" className="block mb-2 font-semibold text-gray-700">
                  {t('upload_new_images')}
                </label>
                <input
                  type="file"
                  id="edit_images"
                  multiple
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="block w-full text-indigo-700"
                />
                {editPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-3">
                    {editPreviews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`edit-preview-${idx}`}
                          className="h-24 w-24 object-cover rounded border shadow-sm transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = [...editFiles];
                            newFiles.splice(idx, 1);
                            setEditFiles(newFiles);
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-bl-md opacity-80 hover:opacity-100"
                          aria-label={t('delete')}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {editNewsId && newsList.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('previous_images')}</h4>
                  <div className="flex flex-wrap gap-4">
                    {newsList.find((n) => n.id === editNewsId)?.images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/${img.image}`}
                          alt="Old Image"
                          className="h-24 w-24 object-cover rounded-md border shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed = confirm(t('confirm_delete_image'));
                            if (!confirmed) return;
                            await apiClient.deletenewsImage(img.id);
                            await fetchNews();
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-bl-md opacity-80 hover:opacity-100"
                          aria-label={t('delete')}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 disabled:opacity-50 text-sm"
                >
                  {editLoading ? t('updating') : t('update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
