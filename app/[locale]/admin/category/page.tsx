"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/api-client";

export default function CreateCategoryPage() {
    const locale = useLocale();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formFields, setFormFields] = useState({
        title_az: "",
        title_en: "",
        title_ru: "",
        description_az: "",
        description_en: "",
        description_ru: "",
    });
    const [editCategory, setEditCategory] = useState<any | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const handleChange = (field: string, value: string, isEdit = false) => {
        if (isEdit && editCategory) {
            setEditCategory((prev: any) => ({ ...prev, [field]: value }));
        } else {
            setFormFields((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            Object.entries(formFields).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (imageFile) formData.append("image", imageFile);
            else throw new Error("Şəkil faylı mütləq seçilməlidir.");

            await apiClient.addcategory(formData);
            setMessage({ type: "success", text: "Kateqoriya uğurla əlavə edildi!" });
            setFormFields({
                title_az: "",
                title_en: "",
                title_ru: "",
                description_az: "",
                description_en: "",
                description_ru: "",
            });
            setImageFile(null);
            fetchCategories();
            setTimeout(() => {
                window.location.href = `/${locale}/admin/category`
            }, 1000)

        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Naməlum xəta baş verdi" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Kateqoriyanı silmək istədiyinizdən əminsiniz?")) return;

        try {
            await apiClient.deletecategory(id);
            setMessage({ type: "success", text: "Kateqoriya uğurla silindi!" });
            fetchCategories();
            setTimeout(() => {
                window.location.href = `/${locale}/admin/category`
            }, 1000)
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Naməlum xəta baş verdi" });
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiClient.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Kateqoriyalar alınarkən xəta:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCategory) return;
        setEditLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"].forEach((key) => {
                formData.append(key, editCategory[key] || "");
            });
            await apiClient.updatecategory(formData, editCategory.id);

            setMessage({ type: "success", text: "Kateqoriya uğurla redaktə edildi!" });
            setEditCategory(null);
            setEditImageFile(null);
            fetchCategories();
            setTimeout(() => {
                window.location.href = `/${locale}/admin/category`
            }, 1000)
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Naməlum xəta baş verdi" });
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10">
            <Card className="rounded-2xl shadow-xl border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-indigo-700">
                        📁 Yeni Kateqoriya Əlavə Et
                    </CardTitle>
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
                                <Input
                                    id={key}
                                    value={formFields[key as keyof typeof formFields]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    placeholder={label}
                                    required
                                />
                            </div>
                        ))}

                        <div>
                            <Label htmlFor="image">Şəkil Faylı</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>

                        <div className="col-span-full">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg"
                            >
                                {loading ? "Yüklənir..." : "Əlavə et"}
                            </Button>
                        </div>
                    </form>

                    {message && (
                        <div
                            className={`mt-6 p-4 rounded-xl font-medium ${message.type === "success"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">🗂 Mövcud Kateqoriyalar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const titleKey = `title_${locale}`;
                        const descriptionKey = `description_${locale}`;

                        return (
                            <Card
                                key={category.id}
                                className="p-5 border border-gray-200 rounded-2xl shadow-md bg-white"
                            >
                                <div className="flex items-center justify-between mb-3 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-indigo-600">
                                            {category[titleKey]}
                                        </h3>

                                        <p className="text-sm text-gray-700 max-w-[250px] h-[100px] break-all overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                                        {category[descriptionKey]}
                                        </p>

                                    </div>
                                    <div>
                                        {category.image && (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${category.image}`}
                                                alt="Şəkil"
                                                className="w-40 h-40 object-cover rounded-md border"
                                            />
                                        )}
                                    </div>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="mt-4 text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                                        >
                                            Ətraflı
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Alt kateqoriyalar – {category[titleKey]}</DialogTitle>
                                        </DialogHeader>
                                        {category.subCategories?.length > 0 ? (
                                            <div className="space-y-4 mt-4">
                                                {category.subCategories.map((sub: any) => (
                                                    <div
                                                        key={sub.id}
                                                        className="border border-gray-200 p-3 rounded-md shadow-sm"
                                                    >
                                                        <h4 className="font-semibold text-indigo-600">
                                                            {sub[`title_${locale}`]}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{sub[`description_${locale}`]}</p>
                                                        {sub.image && (
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${sub.image}`}
                                                                alt="Şəkil"
                                                                className="mt-2 w-24 h-24 object-cover rounded"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-4 text-sm text-gray-500">Alt kateqoriya yoxdur.</p>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={Boolean(editCategory && editCategory.id === category.id)} onOpenChange={(open) => {
                                    if (!open) {
                                        setEditCategory(null);
                                        setEditImageFile(null);
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="mt-4 ml-2 text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                                            onClick={() => setEditCategory(category)}
                                        >
                                            Redaktə et
                                        </Button>
                                    </DialogTrigger>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="mt-4 ml-2 bg-red-600 hover:bg-white hover:text-red-700 text-white"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Sil
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Kateqoriyanı redaktə et – {editCategory?.[titleKey]}</DialogTitle>
                                        </DialogHeader>

                                        {editCategory && (
                                            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                                                {[
                                                    ["title_az", "Başlıq (AZ)"],
                                                    ["title_en", "Başlıq (EN)"],
                                                    ["title_ru", "Başlıq (RU)"],
                                                    ["description_az", "Açıqlama (AZ)"],
                                                    ["description_en", "Açıqlama (EN)"],
                                                    ["description_ru", "Açıqlama (RU)"],
                                                ].map(([key, label]) => (
                                                    <div key={key}>
                                                        <Label htmlFor={"edit-" + key}>{label}</Label>
                                                        <Input
                                                            id={"edit-" + key}
                                                            value={editCategory[key] || ""}
                                                            onChange={(e) => handleChange(key, e.target.value, true)}
                                                            placeholder={label}
                                                            required
                                                        />
                                                    </div>
                                                ))}

                                                <div>
                                                    <Label htmlFor="edit-image">Şəkil Faylı (yenilə)</Label>
                                                    <p className="text-[12px]">{category.image}</p>
                                                    <Input
                                                        id="edit-image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-4 mt-4">
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="text-gray-700"
                                                            onClick={() => {
                                                                setEditCategory(null);
                                                                setEditImageFile(null);
                                                            }}
                                                        >
                                                            İmtina
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit" disabled={editLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                                        {editLoading ? "Yüklənir..." : "Yadda saxla"}
                                                    </Button>
                                                </div>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
