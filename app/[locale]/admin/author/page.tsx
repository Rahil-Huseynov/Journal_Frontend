'use client'

import CitizenshipCountrySelect from '@/components/CitizenshipCountrySelect';
import { apiClient } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface CitizenshipCountrySelectProps {
    value: string;
    onChange: (value: string) => void;
}

interface Author {
    id: number;
    firstName: string | null;
    lastName: string | null;
    workplace?: string | null;
    academicdegree?: string | null;
    country?: string | null;
}

interface Category {
    id: number;
    title_az: string | null;
    description_az: string | null;
    image: string;
    authors: Author[];
    subCategories: any[];
}

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const t = useTranslations("Admin_Author");

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        workplace: '',
        academicdegree: '',
        country: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const categories = await apiClient.getCategories();
            setCategories(categories);
        };
        fetchData();
    }, []);

    const handleOpenModal = (id: number) => {
        setSelectedCategoryId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ firstName: '', lastName: '', workplace: '', country: '', academicdegree: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedCategoryId) return alert(t("SelectCategoryWarning"));

        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('workplace', formData.workplace);
        data.append('academicdegree', formData.academicdegree)
        data.append('country', formData.country)
        data.append('categoryIds', JSON.stringify([selectedCategoryId]));

        try {
            await apiClient.addAuthor(data);
            alert(t("AuthorAdded"));
            handleCloseModal();
            const categories = await apiClient.getCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Author əlavə olunarkən xəta:', error);
            alert(t("ServerError"));
        }
    };

    const handleDeleteAuthor = async (authorId: number) => {
        const confirmDelete = window.confirm(t("ConfirmDeleteAuthor"));
        if (!confirmDelete) return;

        try {
            await apiClient.deleteAuthor(authorId)
            alert(t("AuthorDeleted"));
            const categories = await apiClient.getCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Silinmə xətası:', error);
            alert(t("AuthorDeleteError"));
        }
    };

    const handleEditAuthor = (author: Author) => {
        setEditingAuthor(author);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setEditModal(false);
        setEditingAuthor(null);
    };

    const handleUpdateAuthor = async () => {
        if (!editingAuthor) return;

        const formData = new FormData();
        formData.append('firstName', editingAuthor.firstName || '');
        formData.append('lastName', editingAuthor.lastName || '');
        formData.append('workplace', editingAuthor.workplace || '');
        formData.append('academicdegree', editingAuthor.academicdegree || '')
        formData.append('country', editingAuthor.country || '');

        try {
            await apiClient.updateAuthor(editingAuthor.id, formData)
            alert(t("AuthorUpdated"));
            closeEditModal();
            const categories = await apiClient.getCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Error:', error);
            alert(t("ServerError"));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{t("Categories")}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="border rounded p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOpenModal(cat.id)}
                    >
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/categories/${cat.image}`}
                            alt="Şəkil"
                            className="w-100 h-100 object-cover rounded-md border"
                        />
                        <p className='text-center text-lg'>{cat.title_az}</p>
                        <p className='text-center text-lg'>{cat.description_az}</p>
                        <p className='text-center'>{t("Authors")}</p>
                        {cat.authors && cat.authors.length > 0 ? (
                            <div className='text-center'>
                                {cat.authors.slice(0, 5).map((author, idx) => (
                                    <span key={author.id}>
                                        <span className='text-center'>
                                            {author.firstName} {author.lastName}
                                            {idx < Math.min(5, cat.authors.length) - 1 ? ', ' : ''}
                                        </span>
                                    </span>
                                ))}
                                {cat.authors.length > 5 && <span>...</span>}
                            </div>
                        ) : (
                            <span>{t("NoAuthors")}</span>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">{t("AddAuthor")}</h2>
                        <div className="space-y-3">
                            <input type="text" name="firstName" placeholder={t("FirstName")} value={formData.firstName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                            <input type="text" name="lastName" placeholder={t("LastName")} value={formData.lastName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                            <input type="text" name="academicdegree" placeholder={t("AcademicDegree")} value={formData.academicdegree} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                            <textarea name="workplace" placeholder={t("Workplace")} value={formData.workplace} onChange={handleChange} className="w-full border px-3 py-2 rounded resize-none" />
                            <CitizenshipCountrySelect
                                value={formData.country}
                                onChange={(value: string) => setFormData(prev => ({ ...prev, country: value }))}
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={handleCloseModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">{t("Close")}</button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t("Save")}</button>
                        </div>

                        {selectedCategoryId && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2 text-center">{t("ExistingAuthors")}</h3>
                                <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {categories.find(cat => cat.id === selectedCategoryId)?.authors.map(author => (
                                        <li key={author.id} className="flex justify-between items-center border p-3 rounded-md shadow-sm hover:shadow-md">
                                            <div>
                                                <p className="font-medium">{author.firstName} {author.lastName}</p>
                                                {author.workplace && <p className="text-sm text-gray-600">{author.workplace}</p>}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEditAuthor(author)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm">{t("Edit")}</button>
                                                <button onClick={() => handleDeleteAuthor(author.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">{t("Delete")}</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {editModal && editingAuthor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">{t("EditAuthorTitle")}</h2>
                        <div className="space-y-3">
                            <input type="text" name="firstName" value={editingAuthor.firstName || ''} onChange={e => setEditingAuthor(prev => prev && { ...prev, firstName: e.target.value })} placeholder={t("FirstName")} className="w-full border px-3 py-2 rounded" />
                            <input type="text" name="lastName" value={editingAuthor.lastName || ''} onChange={e => setEditingAuthor(prev => prev && { ...prev, lastName: e.target.value })} placeholder={t("LastName")} className="w-full border px-3 py-2 rounded" />
                            <input type="text" name="academicdegree" value={editingAuthor.academicdegree || ''} onChange={e => setEditingAuthor(prev => prev && { ...prev, academicdegree: e.target.value })} placeholder={t("AcademicDegree")} className="w-full border px-3 py-2 rounded" />
                            <textarea name="workplace" value={editingAuthor.workplace || ''} onChange={e => setEditingAuthor(prev => prev && { ...prev, workplace: e.target.value })} placeholder={t("Workplace")} className="w-full border px-3 py-2 rounded resize-none" />
                            <CitizenshipCountrySelect
                                value={editingAuthor?.country || ''}
                                onChange={(value: string) =>
                                    setEditingAuthor((prev) =>
                                        prev ? { ...prev, country: value } : prev
                                    )
                                }
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={closeEditModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">{t("Close")}</button>
                            <button onClick={handleUpdateAuthor} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t("Update")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
