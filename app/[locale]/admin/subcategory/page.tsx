"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useLocale } from "next-intl";

type SubCategory = {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  categoryId: number;
  requireCount: number;
};

type Category = {
  id: number;
  title_az: string;
};

export default function SubCategoryCreatePage() {
  const locale = useLocale();

  const [form, setForm] = useState({
    title_az: "",
    title_en: "",
    title_ru: "",
    description_az: "",
    description_en: "",
    description_ru: "",
    categoryId: "",
    requireCount: "",
  });

  const [editForm, setEditForm] = useState({ ...form });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiClient.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Kateqoriyalar alınarkən xəta:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSubCategories() {
      try {
        const data = await apiClient.getSubCategories();
        setSubcategories(data);
      } catch (error) {
        console.error("Alt kateqoriyalar alınarkən xəta:", error);
      }
    }
    fetchSubCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") {
          formData.append(key, value);
        }
      });

      await apiClient.addSubCategories(formData);

      setMessage("✅ Alt kateqoriya uğurla əlavə olundu!");
      setForm({
        title_az: "",
        title_en: "",
        title_ru: "",
        description_az: "",
        description_en: "",
        description_ru: "",
        categoryId: "",
        requireCount: "",
      });

      const updated = await apiClient.getSubCategories();
      setSubcategories(updated);

      setTimeout(() => {
        window.location.href = `/${locale}/admin/subcategory`;
      }, 1000);
    } catch (err: any) {
      setMessage("❌ Xəta baş verdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (sub: SubCategory) => {
    setEditId(sub.id);
    setEditForm({
      title_az: sub.title_az,
      title_en: sub.title_en,
      title_ru: sub.title_ru,
      description_az: sub.description_az,
      description_en: sub.description_en,
      description_ru: sub.description_ru,
      categoryId: sub.categoryId.toString(),
      requireCount: sub.requireCount.toString(),
    });
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== "") {
          formData.append(key, value);
        }
      });

      await apiClient.updateSubCategories(formData, editId);
      setMessage("✅ Alt kateqoriya uğurla redaktə olundu!");
      setIsModalOpen(false);

      const updated = await apiClient.getSubCategories();
      setSubcategories(updated);

      setTimeout(() => {
        window.location.href = `/${locale}/admin/subcategory`;
      }, 1000);
    } catch (err: any) {
      setMessage("❌ Xəta baş verdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Alt kateqoriyanı silmək istədiyinizə əminsiniz?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await apiClient.deleteSubCategory(id);
      setMessage("✅ Alt kateqoriya uğurla silindi!");
      const updated = await apiClient.getSubCategories();
      setSubcategories(updated);
      setTimeout(() => {
        window.location.href = `/${locale}/admin/subcategory`;
      }, 1000);
    } catch (err: any) {
      setMessage("❌ Silmə zamanı xəta baş verdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-12">
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">📁 Alt Kateqoriya Əlavə Et</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["title_az", "Başlıq (AZ)"],
              ["title_en", "Başlıq (EN)"],
              ["title_ru", "Başlıq (RU)"],
              ["description_az", "Açıqlama (AZ)"],
              ["description_en", "Açıqlama (EN)"],
              ["description_ru", "Açıqlama (RU)"],
            ].map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} name={key} value={form[key as keyof typeof form]} onChange={handleChange} required />
              </div>
            ))}

            <div>
              <Label htmlFor="requireCount">Məqalə sayı</Label>
              <Input
                type="number"
                id="requireCount"
                name="requireCount"
                value={form.requireCount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId">Kateqoriya Seç</Label>
              <select
                name="categoryId"
                id="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md h-10 px-2"
              >
                <option value="">-- Seçin --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title_az}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                {loading ? "Göndərilir..." : "Əlavə Et"}
              </Button>
            </div>
          </form>
          {message && (
            <div className="mt-6 text-sm text-center font-medium text-green-600">{message}</div>
          )}
        </CardContent>
      </Card>

      {/* SubCategory listi və redaktə modalı */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Alt Kateqoriyalar</h2>
        {subcategories.length === 0 && <p>Alt kateqoriya yoxdur.</p>}
        {subcategories.map((sub) => {
          const category = categories.find((cat) => cat.id === sub.categoryId);
          return (
            <div
              key={sub.id}
              className="border rounded-md p-4 shadow-sm bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="font-medium text-indigo-700">{sub.title_az}</p>
                <p className="text-sm text-gray-600 mt-1">{sub.description_az}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📂 Kateqoriya: <span className="font-semibold">{category?.title_az || "Tapılmadı"}</span>
                </p>
              </div>
              <div className="grid gap-2">
                <Button variant="outline" onClick={() => openEditModal(sub)} className="mt-2 md:mt-0">
                  Redaktə Et
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(sub.id)}
                  className="mt-2 md:mt-0 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  disabled={loading}
                >
                  Sil
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">Alt Kateqoriyanı Redaktə Et</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["title_az", "Başlıq (AZ)"],
                ["title_en", "Başlıq (EN)"],
                ["title_ru", "Başlıq (RU)"],
                ["description_az", "Açıqlama (AZ)"],
                ["description_en", "Açıqlama (EN)"],
                ["description_ru", "Açıqlama (RU)"],
              ].map(([key, label]) => (
                <div key={"edit-" + key}>
                  <Label htmlFor={"edit-" + key}>{label}</Label>
                  <Input
                    id={"edit-" + key}
                    name={key}
                    value={editForm[key as keyof typeof editForm]}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              ))}

              <div>
                <Label htmlFor="edit-requireCount">Məqalə sayı</Label>
                <Input
                  type="number"
                  id="edit-requireCount"
                  name="requireCount"
                  value={editForm.requireCount}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryIdEdit">Kateqoriya Seç</Label>
                <select
                  name="categoryId"
                  id="categoryIdEdit"
                  value={editForm.categoryId}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-md h-10 px-2"
                >
                  <option value="">-- Seçin --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title_az}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-full flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Ləğv et
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Yüklənir..." : "Yadda saxla"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
