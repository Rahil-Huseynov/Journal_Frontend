"use client";

import { apiClient } from "@/lib/api-client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

type SubCategory = {
  id: number;
  title_az?: string;
  title_en?: string;
  title_ru?: string;
  description_az?: string;
  description_en?: string;
  description_ru?: string;
  image?: string;
  categoryId: number;
  count?: number;
};

type GlobalSubCategory = {
  id: number;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  description_en: string;
  description_ru: string;
  file: File | null | string;
  categoryId: number;
  subCategoryId: number;
  image: string;
};

type UserJournal = {
  id: number;
  title_az?: string;
  status?: string;
  count?: number;
  subCategoryId: number;
  order?: number;
};

type FileMap = Record<number, File | null>;

export default function GlobalSubCategoryPublisher() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [files, setFiles] = useState<FileMap>({});
  const [globalSubs, setGlobalSubs] = useState<GlobalSubCategory[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<GlobalSubCategory> & { file?: File | null }>({});
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState<number | null>(null);
  const [finishedJournals, setFinishedJournals] = useState<UserJournal[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [subCategoryMaxCount, setSubCategoryMaxCount] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const t = useTranslations("Admin_GlobalSubCategory");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const subs = await apiClient.getSubCategories();
      const globals = await apiClient.getGlobalSubCategories();
      setSubCategories(subs);
      setGlobalSubs(globals);
    } catch (error) {
      alert(t("error_occurred"));
      console.error(error);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>, subCategoryId: number) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles((prev) => ({ ...prev, [subCategoryId]: file }));
    }
  }

  async function handlePublish(subCategory: SubCategory) {
    const file = files[subCategory.id];
    if (!file) {
      alert(t("please_select_file"));
      return;
    }

    const formData = new FormData();
    formData.append("title_az", subCategory.title_az || "");
    formData.append("title_en", subCategory.title_en || "");
    formData.append("title_ru", subCategory.title_ru || "");
    formData.append("description_az", subCategory.description_az || "");
    formData.append("description_en", subCategory.description_en || "");
    formData.append("description_ru", subCategory.description_ru || "");
    formData.append("image", subCategory.image || "");
    formData.append("categoryId", subCategory.categoryId.toString());
    formData.append("subCategoryId", subCategory.id.toString());
    formData.append("file", file);
    if (imageFile) formData.append("image", imageFile);
    else {
      alert(t("image_file_required"));
      return;
    }

    try {
      await apiClient.createGlobalCategory(formData);
      await apiClient.deleteSubCategory(subCategory.id);
      setSubCategories((prev) => prev.filter((sc) => sc.id !== subCategory.id));
      setFiles((prev) => ({ ...prev, [subCategory.id]: null }));
      setImageFile(null);
      await fetchData();
      alert(t("published_and_deleted"));
    } catch (error) {
      alert(t("error") + ": " + (error as Error).message);
    }
  }

  function openEditModal(globalSub: GlobalSubCategory) {
    setEditData({
      ...globalSub,
      file: null,
    });
    setEditModalOpen(true);
  }
  function closeEditModal() {
    setEditModalOpen(false);
    setEditData({});
  }
  function handleEditChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }
  function handleEditFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setEditData((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  }

  function handleEditImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setEditImageFile(e.target.files[0]);
    }
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editData.id) return;

    const formData = new FormData();
    formData.append("title_az", editData.title_az || "");
    formData.append("title_en", editData.title_en || "");
    formData.append("title_ru", editData.title_ru || "");
    formData.append("description_az", editData.description_az || "");
    formData.append("description_en", editData.description_en || "");
    formData.append("description_ru", editData.description_ru || "");
    formData.append(
      "categoryId",
      editData.categoryId !== undefined && editData.categoryId !== null ? editData.categoryId.toString() : ""
    );
    if (editData.file) {
      formData.append("file", editData.file);
    }

    if (editImageFile) {
      formData.append("image", editImageFile);
    }
    try {
      await apiClient.updateGlobalCategory(editData.id, formData);
      await fetchData();
      closeEditModal();
      alert(t("successfully_updated"));
    } catch (error) {
      alert(t("error") + ": " + (error as Error).message);
    }
  }
  async function handleDelete(id: number) {
    if (!confirm(t("confirm_delete_global_subcategory"))) return;
    try {
      await apiClient.deleteGlobalCategory(id);
      setGlobalSubs((prev) => prev.filter((g) => g.id !== id));
      alert(t("successfully_deleted"));
    } catch (error) {
      alert(t("error") + ": " + (error as Error).message);
    }
  }

  async function openSortModal(subCategoryId: number) {
    setCurrentSubCategoryId(subCategoryId);
    setSortModalOpen(true);

    try {
      const journals: UserJournal[] = await apiClient.getUserFilterJournals({
        status: "finished",
        subCategoryId: subCategoryId,
      });
      setFinishedJournals(journals);

      const initialCounts: Record<number, number> = {};
      journals.forEach((j) => {
        initialCounts[j.id] = j.order ?? 0;
      });
      setCounts(initialCounts);
      const sub = subCategories.find((s) => s.id === subCategoryId);
      if (!sub) return;
      const maxCount = sub.count ?? 0;
      setSubCategoryMaxCount(maxCount);
    } catch (error) {
      alert(t("finished_journals_not_found"));
      setFinishedJournals([]);
      setCounts({});
    }
  }

  function closeSortModal() {
    setSortModalOpen(false);
    setCurrentSubCategoryId(null);
    setFinishedJournals([]);
    setCounts({});
  }

  function handleCountChange(e: ChangeEvent<HTMLInputElement>, journalId: number) {
    const value = Number(e.target.value);
    if (value > subCategoryMaxCount) {
      alert(t("order_value_max", { max: subCategoryMaxCount }));
      return;
    }
    setCounts((prev) => ({ ...prev, [journalId]: value }));
  }

  async function handleSaveCounts() {
    try {
      const usedOrders = new Set<number>();
      const duplicates: number[] = [];

      for (const id in counts) {
        const order = counts[Number(id)];
        if (usedOrders.has(order)) {
          duplicates.push(order);
        } else {
          usedOrders.add(order);
        }
      }

      if (duplicates.length > 0) {
        alert(t("duplicate_orders", { values: duplicates.join(", ") }));
        return;
      }

      for (const journalId in counts) {
        const orderValue = counts[Number(journalId)];
        await apiClient.updateJournalOrder(Number(journalId), orderValue);
      }

      alert(t("counts_saved_successfully"));
      closeSortModal();
    } catch (error) {
      alert(t("error_saving_counts"));
    }
  }

  return (
    <div className="w-full p-8 bg-white rounded-lg shadow-lg">
      <div>
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">{t("subcategories")}</h1>
        <div className="overflow-x-auto mb-16">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-sm border-separate text-[inherit]">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "title_az",
                  "title_en",
                  "title_ru",
                  "description_az",
                  "description_en",
                  "description_ru",
                  "add_file",
                  "add_image",
                  "publish",
                  "sort",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subCategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.title_az || "-"}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.title_en || "-"}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.title_ru || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{sub.description_az || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{sub.description_en || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{sub.description_ru || "-"}</td>
                  <td className="px-6 py-4">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, sub.id)}
                      className="w-[200px] mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </td>
                  <td>
                    <div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        required
                        className="w-[200px] mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePublish(sub)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {t("publish")}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openSortModal(sub.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {t("sort")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("published_global_subcategories")}</h2>
        {globalSubs.length === 0 ? (
          <p className="text-gray-500 italic">{t("no_published_subcategories")}</p>
        ) : (
          <div className="overflow-x-auto mb-16">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-300 shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("image")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("title_az")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("title_en")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("title_ru")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("description_az")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("description_en")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("description_ru")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("file")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("edit")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t("delete")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {globalSubs.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition">
                    <td>
                      <div className="w-[150px]">
                        <img
                          className="object-contain"
                          src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/globalsubcategory/${g.image}` || t("no_image")}
                          alt={g.title_az || t("no_image")}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{g.title_az}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{g.title_en}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{g.title_ru}</td>
                    <td className="px-6 py-4 text-gray-700">{g.description_az}</td>
                    <td className="px-6 py-4 text-gray-700">{g.description_en}</td>
                    <td className="px-6 py-4 text-gray-700">{g.description_ru}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/globalsubcategory/${typeof g.file === "string" ? g.file : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {t("view")}
                      </a>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => openEditModal(g)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      >
                        {t("edit")}
                      </button>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">{t("edit_global_subcategory")}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">{t("title_az")}</label>
                <input
                  name="title_az"
                  value={editData.title_az || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("title_en")}</label>
                <input
                  name="title_en"
                  value={editData.title_en || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("title_ru")}</label>
                <input
                  name="title_ru"
                  value={editData.title_ru || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("description_az")}</label>
                <textarea
                  name="description_az"
                  value={editData.description_az || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("description_en")}</label>
                <textarea
                  name="description_en"
                  value={editData.description_en || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("description_ru")}</label>
                <textarea
                  name="description_ru"
                  value={editData.description_ru || ""}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("file_optional")}</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleEditFileChange}
                  className="w-full text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">{t("image_optional")}</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full text-sm text-gray-500"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded border-gray-400 hover:bg-gray-100"
                >
                  {t("cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {sortModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {t("subcat_finished_journals", { id: currentSubCategoryId })}
            </h2>

            {finishedJournals.length === 0 && (
              <p className="italic text-gray-500">{t("no_finished_journals")}</p>
            )}

            {finishedJournals.map((journal) => (
              <div key={journal.id} className="flex items-center justify-between mb-3">
                <span>{journal.title_az || `${t("journal_id")} ${journal.id}`}</span>
                <input
                  type="number"
                  min={0}
                  max={subCategoryMaxCount}
                  value={counts[journal.id] ?? 0}
                  onChange={(e) => handleCountChange(e, journal.id)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            ))}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeSortModal}
                className="px-4 py-2 border rounded border-gray-400 hover:bg-gray-100"
              >
                {t("close")}
              </button>
              <button
                onClick={handleSaveCounts}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
