"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { ChevronDown, ChevronRight, Eye, Pencil, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "next-intl";

interface Message {
    id: number;
    createdAt: string;
    problems: string;
    userJournalId: number;
}

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
    messages?: Message[];
    approvedFile: string;
    categoryIds?: number[];
    subCategoryIds?: number[];
    order?: number;

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
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewMessages, setViewMessages] = useState<Message[]>([]);
    const [editData, setEditData] = useState<Partial<Journal>>({});
    const [file, setFile] = useState<File | null>(null);

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
        setEditData(journal);
        setFile(null);
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

            if (selectedStatus === "payment" || selectedStatus === "finished") {
                const formData = new FormData();

                formData.append("title_az", editData.title_az || "");
                formData.append("title_en", editData.title_en || "");
                formData.append("title_ru", editData.title_ru || "");

                formData.append("description_az", editData.description_az || "");
                formData.append("description_en", editData.description_en || "");
                formData.append("description_ru", editData.description_ru || "");

                formData.append("keywords_az", currentJournal.keywords_az || "");
                formData.append("keywords_en", currentJournal.keywords_en || "");
                formData.append("keywords_ru", currentJournal.keywords_ru || "");
                if (file) {
                    formData.append("approvedFile", file);
                }
                await apiClient.updateUserJournalDemo(currentJournal.id, formData);
            }
            await apiClient.updateJournalStatus(currentJournal.id, selectedStatus);

            alert("Əməliyyat uğurla tamamlandı");
            setEditModalOpen(false);
            setCurrentJournal(null);
            await fetchCategories();
            window.location.reload();
        } catch (error) {
            console.error("Əməliyyat zamanı xəta baş verdi", error);
        }
    };


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
        setCurrentJournal(null);
    };
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, '0');

        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();

        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        const seconds = pad(d.getSeconds());

        return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
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
                            src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/categories/${category.image}`}
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
                                                                <th className="border p-2 breaks-word">Fayl (Təsdiqlənmiş)</th>
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
                                                                            href={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/journals/${j.file}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-blue-600 underline"
                                                                        >
                                                                            Aç
                                                                        </a>
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        <a
                                                                            href={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/journals/approved/${j.approvedFile}`}
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
                                                                                <Pencil size={20} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(j.id)}
                                                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                                                                title="Sil"
                                                                            >
                                                                                <Trash size={20} />
                                                                            </button>

                                                                            <button
                                                                                onClick={() => {
                                                                                    setCurrentJournal(j);
                                                                                    setViewMessages(j.messages || []);
                                                                                    setViewModalOpen(true);
                                                                                }}
                                                                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                                                                title="Bax"
                                                                            >
                                                                                <Eye size={20} />
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
                                <option value="registered">Qeydə alındı</option>
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
                            {selectedStatus === "finished" ? (
                                <div>
                                    <label className="block mb-1 font-medium">Başlıq (AZ)</label>
                                    <input
                                        name="title_az"
                                        value={editData.title_az || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                    <label className="block mb-1 font-medium">Başlıq (EN)</label>
                                    <input
                                        name="title_en"
                                        value={editData.title_en || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                    <label className="block mb-1 font-medium">Başlıq (RU)</label>
                                    <input
                                        name="title_ru"
                                        value={editData.title_ru || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                    <label className="block mb-1 font-medium">Açıqlama (AZ)</label>
                                    <textarea
                                        name="description_az"
                                        value={editData.description_az || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        rows={2}
                                    />
                                    <label className="block mb-1 font-medium">Açıqlama (EN)</label>
                                    <textarea
                                        name="description_en"
                                        value={editData.description_en || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        rows={2}
                                    />
                                    <label className="block mb-1 font-medium">Açıqlama (RU)</label>
                                    <textarea
                                        name="description_ru"
                                        value={editData.description_ru || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        rows={2}
                                    />
                                    <label className="block mb-1 font-medium">Faylı seçin</label>
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500"
                                    />
                                </div>
                            ) : null}

                            <Button className="w-full" onClick={handleSave}>
                                Yadda saxla
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={viewModalOpen} onOpenChange={() => setViewModalOpen(false)}>
                <DialogContent className="w-full max-w-4xl h-[85vh] p-6 overflow-hidden bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-blue-900">
                            Admin Mesaj Paneli
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col h-[70vh] overflow-y-auto mt-4 px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 shadow-inner space-y-5">
                        {viewMessages.length === 0 ? (
                            <p className="text-center text-lg text-gray-500">Heç bir mesaj yoxdur</p>
                        ) : (
                            viewMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((msg) => (
                                <div
                                    key={msg.id}
                                    className="self-end w-full bg-blue-200 text-gray-900 px-5 py-4 rounded-3xl shadow-md"
                                >
                                    <p className="text-base md:text-lg">{msg.problems}</p>
                                    <p className="text-gray-500 text-xs mt-1">{formatDate(msg.createdAt)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>



        </div>
    );
};

export default CategoryListPage;
