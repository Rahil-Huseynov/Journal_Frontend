"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useLocale, useTranslations } from "next-intl";

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
  image: string;
};

type Category = {
  id: number;
  title_az: string;
};

export default function SubCategoryCreatePage() {
  const locale = useLocale();
  const t = useTranslations("Admin_SubCategory");

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
        console.error(t("ErrorFetchingCategories") + ": ", error);
      }
    }
    fetchCategories();
  }, [t]);

  useEffect(() => {
    async function fetchSubCategories() {
      try {
        const data = await apiClient.getSubCategories();
        setSubcategories(data);
      } catch (error) {
        console.error(t("ErrorFetchingSubCategories") + ": ", error);
      }
    }
    fetchSubCategories();
  }, [t]);

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
        if (key === "categoryId" || key === "requireCount") {
          const numberValue = Number(value);
          if (!Number.isNaN(numberValue)) {
            formData.append(key, numberValue.toString());
          }
        } else if (value !== "") {
          formData.append(key, value);
        }
      });

      await apiClient.addSubCategories(formData);

      setMessage("✅ " + t("SubCategoryAddedSuccessfully"));
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
      setMessage("❌ " + t("ErrorOccurred") + ": " + err.message);
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
          formData.append(key, value.toString());
        }
      });

      await apiClient.updateSubCategories(formData, editId);
      setMessage("✅ " + t("SubCategoryUpdatedSuccessfully"));
      setIsModalOpen(false);
      const updated = await apiClient.getSubCategories();
      setSubcategories(updated);

      setTimeout(() => {
        window.location.href = `/${locale}/admin/subcategory`;
      }, 1000);
    } catch (err: any) {
      setMessage("❌ " + t("ErrorOccurred") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("ConfirmDeleteSubCategory"))) return;

    setLoading(true);
    setMessage(null);

    try {
      await apiClient.deleteSubCategory(id);
      setMessage("✅ " + t("SubCategoryDeletedSuccessfully"));
      const updated = await apiClient.getSubCategories();
      setSubcategories(updated);
      setTimeout(() => {
        window.location.href = `/${locale}/admin/subcategory`;
      }, 1000);
    } catch (err: any) {
      setMessage(t("ErrorDeletingSubCategory") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-12">
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">
            📁 {t("AddSubCategory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["title_az", t("TitleAZ")],
              ["title_en", t("TitleEN")],
              ["title_ru", t("TitleRU")],
              ["description_az", t("DescriptionAZ")],
              ["description_en", t("DescriptionEN")],
              ["description_ru", t("DescriptionRU")],
            ].map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} name={key} value={form[key as keyof typeof form]} onChange={handleChange} required />
              </div>
            ))}

            <div>
              <Label htmlFor="requireCount">{t("ArticleCount")}</Label>
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
              <Label htmlFor="categoryId">{t("SelectCategory")}</Label>
              <select
                name="categoryId"
                id="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md h-10 px-2"
              >
                <option value="">{t("SelectPlaceholder")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title_az}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                {loading ? t("Submitting") : t("Add")}
              </Button>
            </div>
          </form>
          {message && (
            <div className={`mt-6 text-sm text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{t("SubCategories")}</h2>
        {subcategories.length === 0 && <p>{t("NoSubCategories")}</p>}
        {subcategories.map((sub) => {
          const category = categories.find((cat) => cat.id === sub.categoryId);
          return (
            <div
              key={sub.id}
              className="border rounded-md p-4 shadow-sm bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-medium text-indigo-700">{sub.title_az}</p>
                  <p className="text-sm text-gray-600 mt-1">{sub.description_az}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    📂 {t("Category")}: <span className="font-semibold">{category?.title_az || t("NotFound")}</span>
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Button variant="outline" onClick={() => openEditModal(sub)} className="mt-2 md:mt-0">
                  {t("Edit")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(sub.id)}
                  className="mt-2 md:mt-0 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  disabled={loading}
                >
                  {t("Delete")}
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
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">{t("EditSubCategory")}</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["title_az", t("TitleAZ")],
                ["title_en", t("TitleEN")],
                ["title_ru", t("TitleRU")],
                ["description_az", t("DescriptionAZ")],
                ["description_en", t("DescriptionEN")],
                ["description_ru", t("DescriptionRU")],
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
                <Label htmlFor="edit-requireCount">{t("ArticleCount")}</Label>
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
                <Label htmlFor="categoryIdEdit">{t("SelectCategory")}</Label>
                <select
                  name="categoryId"
                  id="categoryIdEdit"
                  value={editForm.categoryId}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-md h-10 px-2"
                >
                  <option value="">{t("SelectPlaceholder")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title_az}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-full flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  {t("Cancel")}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? t("Loading") : t("Save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
