"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { ChevronDown, ChevronRight, Pencil, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "next-intl";

interface Journal {
    id: number;
    title_az: string;
    title_en: string;
    title_ru: string;
    description_az: string;
    description_en: string;
    description_ru: string;
    keywords_az: string;
    keywords_en: string;
    keywords_ru: string;
    status: string;
    file: string;
    createdAt: string;
    updatedAt: string;
}

interface SubCategory {
    id: number;
    title_az: string;
    description_az: string;
    status: string;
    count: number;
    requireCount: number;
    journals: Journal[];
}

interface Category {
    id: number;
    title_az: string;
    description_az: string;
    image: string;
    subCategories?: SubCategory[];
}

const CategoryListPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<number[]>([]);
    const [expandedSubCategoryIds, setExpandedSubCategoryIds] = useState<number[]>(
        []
    );
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentJournal, setCurrentJournal] = useState<Journal | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const locale = useLocale();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await apiClient.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Kateqoriyalar alınmadı", error);
        }
    };

    const fetchSubCategories = async (categoryId: number) => {
        try {
            const allSubs = await apiClient.getSubCategories();
            const filteredSubs = allSubs.filter((sc: any) => sc.categoryId === categoryId);
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === categoryId ? { ...cat, subCategories: filteredSubs } : cat
                )
            );
        } catch (error) {
            console.error("Subkategoriyalar alınmadı", error);
        }
    };

    const toggleCategory = (categoryId: number) => {
        const alreadyExpanded = expandedCategoryIds.includes(categoryId);
        if (alreadyExpanded) {
            setExpandedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
        } else {
            fetchSubCategories(categoryId);
            setExpandedCategoryIds((prev) => [...prev, categoryId]);
        }
    };

    const toggleSubCategory = (subCategoryId: number) => {
        const alreadyExpanded = expandedSubCategoryIds.includes(subCategoryId);
        if (alreadyExpanded) {
            setExpandedSubCategoryIds((prev) => prev.filter((id) => id !== subCategoryId));
        } else {
            setExpandedSubCategoryIds((prev) => [...prev, subCategoryId]);
        }
    };

    const handleEdit = (journal: Journal) => {
        setCurrentJournal(journal);
        setSelectedStatus(journal.status);
        setMessage("");
        setEditModalOpen(true);
    };



    const handleDelete = async (journalId: number) => {
        if (!confirm("Bu jurnalı silmək istədiyinizdən əminsiniz?")) return;

        try {
            await apiClient.deleteUserJournal(journalId);
            window.location.href = `/${locale}/admin/articles`
            await fetchCategories();
        } catch (error) {
            console.error("Silinmə zamanı xəta baş verdi", error);
        }
    };

    const handleSave = async () => {
        if (!currentJournal) return;

        try {
            if (message) {
                await apiClient.createMessage({
                    problems: message,
                    userJournalId: currentJournal.id,
                });
            }
            alert("Mesaj və status uğurla göndərildi");
            await apiClient.updateJournalStatus(currentJournal.id, selectedStatus);
            window.location.href = `/${locale}/admin/articles`;
            setEditModalOpen(false);
            setCurrentJournal(null);
            await fetchCategories();
        } catch (error) {
            console.error("Əməliyyat zamanı xəta baş verdi", error);
        }
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
        setCurrentJournal(null);
    };

    return (
        <div className="p-6 w-full space-y-6">
            <h1 className="text-3xl font-bold text-center mb-6">Məqalələr</h1>

            {categories.map((category) => (
                <div
                    key={category.id}
                    className="rounded-2xl overflow-hidden shadow-lg border border-gray-200"
                >
                    <div
                        onClick={() => toggleCategory(category.id)}
                        className="cursor-pointer flex items-center gap-4 bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 transition p-4"
                    >
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${category.image}`}
                            alt={category.title_az}
                            className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-blue-900">{category.title_az}</h2>
                            <p className="text-sm text-gray-600">{category.description_az}</p>
                        </div>
                        {expandedCategoryIds.includes(category.id) ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {expandedCategoryIds.includes(category.id) && category.subCategories && (
                        <div className="bg-white px-6 pb-4">
                            {category.subCategories.map((sub) => (
                                <div key={sub.id} className="mt-4">
                                    <div
                                        onClick={() => toggleSubCategory(sub.id)}
                                        className="cursor-pointer flex justify-between items-center border-b pb-2"
                                    >
                                        <div>
                                            <h3 className="text-lg font-medium text-blue-800">{sub.title_az}</h3>
                                        </div>
                                        {expandedSubCategoryIds.includes(sub.id) ? <ChevronDown /> : <ChevronRight />}
                                    </div>

                                    {expandedSubCategoryIds.includes(sub.id) && (
                                        <div className="mt-4 overflow-auto">
                                            {(!sub.journals || sub.journals.length === 0) ? (
                                                <p className="text-sm text-gray-500">Jurnal yoxdur</p>
                                            ) : (
                                                <div className="overflow-x-auto mb-16">
                                                    <p><span>{sub.count}/{sub.requireCount}</span></p>
                                                    <table className="min-w-full text-sm border border-gray-200">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="border p-2">Başlıq (AZ)</th>
                                                                <th className="border p-2">Başlıq (EN)</th>
                                                                <th className="border p-2">Başlıq (RU)</th>
                                                                <th className="border p-2">Açıqlama (AZ)</th>
                                                                <th className="border p-2">Açıqlama (EN)</th>
                                                                <th className="border p-2">Açıqlama (RU)</th>
                                                                <th className="border p-2">Açar sözlər (AZ)</th>
                                                                <th className="border p-2">Açar sözlər (EN)</th>
                                                                <th className="border p-2">Açar sözlər (RU)</th>
                                                                <th className="border p-2">Status</th>
                                                                <th className="border p-2">Yaradılma</th>
                                                                <th className="border p-2">Yenilənmə</th>
                                                                <th className="border p-2">Fayl</th>
                                                                <th className="border p-2">Əməliyyat</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sub.journals.map((j) => (
                                                                <tr key={j.id} className="even:bg-gray-50">
                                                                    <td className="border p-2 text-xs">{j.title_az}</td>
                                                                    <td className="border p-2 text-xs">{j.title_en}</td>
                                                                    <td className="border p-2 text-xs">{j.title_ru}</td>
                                                                    <td className="border p-2">{j.description_az}</td>
                                                                    <td className="border p-2">{j.description_en}</td>
                                                                    <td className="border p-2">{j.description_ru}</td>
                                                                    <td className="border p-2 text-xs">{j.keywords_az}</td>
                                                                    <td className="border p-2 text-xs">{j.keywords_en}</td>
                                                                    <td className="border p-2 text-xs">{j.keywords_ru}</td>
                                                                    <td className="border p-2 text-center">{j.status}</td>
                                                                    <td className="border p-2 text-center">
                                                                        {new Date(j.createdAt).toLocaleString()}
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        {new Date(j.updatedAt).toLocaleString()}
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        <a
                                                                            href={`${process.env.NEXT_PUBLIC_API_URL}${j.file}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-blue-600 underline"
                                                                        >
                                                                            Aç
                                                                        </a>
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        <div className="flex justify-center gap-2">
                                                                            <button
                                                                                onClick={() => handleEdit(j)}
                                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                                                                                title="Redaktə et"
                                                                            >
                                                                                <Pencil size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(j.id)}
                                                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                                                                title="Sil"
                                                                            >
                                                                                <Trash size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <Dialog open={editModalOpen} onOpenChange={handleModalClose}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Statusu Redaktə Et</DialogTitle>
                    </DialogHeader>
                    {currentJournal && (
                        <div className="grid gap-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="border rounded p-2"
                            >
                                <option value="pending">Gözləmədə</option>
                                <option value="beingwatched">Baxılır</option>
                                <option value="edit">Redakte et</option>
                                <option value="payment">Ödəniş et</option>
                                <option value="finished">Təsdiqlənmiş</option>
                                <option value="rejected">Rədd edilmiş</option>
                            </select>
                            {selectedStatus === "rejected" || selectedStatus === "edit" && (
                                <Textarea
                                    placeholder="Səbəbini yazın..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            )}
                            <Button className="w-full" onClick={handleSave}>
                                Yadda saxla
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategoryListPage;
