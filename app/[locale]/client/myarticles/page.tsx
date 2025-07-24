"use client"

import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

type Journal = {
    id: number
    createdAt: string
    updatedAt: string
    title_az: string
    title_en: string
    title_ru: string
    description_az: string
    description_en: string
    description_ru: string
    keywords_az: string | null
    keywords_en: string | null
    keywords_ru: string | null

    file: string
    userId: string
    approved: string
    status: string
    categoryId?: number
    subCategoryId?: number
    message: string
    category: Category[]
    subCategories: SubCategory[]
    messages?: {
        id: number
        createdAt: string
        problems: string
        userJournalId: number
    }[]
}

type User = {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
    organization?: string
    position?: string
    userJournal?: Journal[]
}

type Category = {
    id: number
    title_az: string
    title_en: string
    title_ru: string
    subCategories: SubCategory[]
}

type SubCategory = {
    id: number
    title_az: string
    title_en: string
    title_ru: string
    categoryId: number
    status?: string
}

export default function ClientarticlesPage() {
    const { user } = useAuth() as unknown as { user: User }
    const locale = useLocale()
    const t = useTranslations("Client_MyArticle")  

    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null)
    const [journalToDelete, setJournalToDelete] = useState<Journal | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const [categories, setCategories] = useState<Category[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])
    const [messageModalJournal, setMessageModalJournal] = useState<Journal | null>(null)

    const [formData, setFormData] = useState<{
        title_az: string
        title_en: string
        title_ru: string
        description_az: string
        description_en: string
        description_ru: string
        keywords_az: string
        keywords_en: string
        keywords_ru: string
        file: File | string
        categoryId: number
        subCategoryId: number
    }>({
        title_az: "",
        title_en: "",
        title_ru: "",
        description_az: "",
        description_en: "",
        description_ru: "",
        keywords_az: "",
        keywords_en: "",
        keywords_ru: "",
        file: "",
        categoryId: 0,
        subCategoryId: 0,
    })

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await apiClient.getCategories()
                setCategories(data)
            } catch (error) {
                console.error(t("categories_load_error"), error)
            }
        }
        fetchCategories()
    }, [t])

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const updatedCategories = await apiClient.getCategories()
                setCategories(updatedCategories)

                const currentCategory = updatedCategories.find((c: any) => c.id === formData.categoryId)

                if (currentCategory) {
                    setSubCategories(currentCategory.subCategories || [])
                    const subCatStillValid = currentCategory.subCategories.some((sc: any) => sc.id === formData.subCategoryId)
                    if (!subCatStillValid) {
                        setFormData((prev) => ({ ...prev, subCategoryId: 0 }))
                    }
                }
            } catch (error) {
                console.error(t("subcategories_update_error"), error)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [formData.categoryId, formData.subCategoryId, t])

    useEffect(() => {
        if (!formData.categoryId) {
            setSubCategories([])
            setFormData((prev) => ({ ...prev, subCategoryId: 0 }))
            return
        }

        const cat = categories.find((c) => c.id === formData.categoryId)
        if (cat) {
            setSubCategories(cat.subCategories || [])
            const subCatStillValid = cat.subCategories.some((sc) => sc.id === formData.subCategoryId)
            if (!subCatStillValid) {
                setFormData((prev) => ({ ...prev, subCategoryId: 0 }))
            }
        } else {
            setSubCategories([])
            setFormData((prev) => ({ ...prev, subCategoryId: 0 }))
        }
    }, [formData.categoryId, categories])

    const getLocalizedField = (obj: any, base: string) => {
        const key = `${base}_${locale}`
        return obj[key] || obj[`${base}_az`] || ""
    }

    const openEditModal = (journal: Journal) => {
        setSelectedJournal(journal)
        const cat = categories.find((c) => c.id === journal.categoryId)
        setSubCategories(cat?.subCategories || [])
        setFormData({
            title_az: journal.title_az || "",
            title_en: journal.title_en || "",
            title_ru: journal.title_ru || "",
            description_az: journal.description_az || "",
            description_en: journal.description_en || "",
            description_ru: journal.description_ru || "",
            keywords_az: journal.keywords_az || "",
            keywords_en: journal.keywords_en || "",
            keywords_ru: journal.keywords_ru || "",
            file: journal.file || "",
            categoryId: journal.categoryId || 0,
            subCategoryId: journal.subCategoryId || 0,
        })
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "categoryId" || name === "subCategoryId" ? Number(value) : value,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }

    const handleSave = async () => {
        if (!selectedJournal) return
        if (!formData.categoryId || formData.categoryId === 0) {
            setAlertMessage(t("please_select_category"))
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
            return
        }

        if (!formData.subCategoryId || formData.subCategoryId === 0) {
            setAlertMessage(t("please_select_subcategory"))
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
            return
        }

        try {
            const data = new FormData()

            data.append("title_az", formData.title_az)
            data.append("title_en", formData.title_en)
            data.append("title_ru", formData.title_ru)
            data.append("description_az", formData.description_az)
            data.append("description_en", formData.description_en)
            data.append("description_ru", formData.description_ru)
            data.append("keywords_az", formData.keywords_az)
            data.append("keywords_en", formData.keywords_en)
            data.append("keywords_ru", formData.keywords_ru)
            data.append("categoryIds[]", String(formData.categoryId))
            data.append("subCategoryIds[]", String(formData.subCategoryId))

            data.append("status", t("edited_status"))
            data.append("message", "")
            data.append("file", formData.file)

            await apiClient.updateUserJournal(selectedJournal.id, data)
            setAlertMessage(t("journal_updated_successfully"))
            setShowAlert(true)
            setSelectedJournal(null)
            setTimeout(() => {
                setShowAlert(false)
                window.location.reload()
            }, 2000)
        } catch (error) {
            setAlertMessage(t("update_error"))
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        }
    }

    const confirmDelete = async () => {
        if (!journalToDelete) return

        try {
            await apiClient.deleteUserJournal(journalToDelete.id)
            setAlertMessage(t("journal_deleted_successfully"))
            setShowAlert(true)
            setSelectedJournal(null)
            setJournalToDelete(null)

            setTimeout(() => {
                setShowAlert(false)
                window.location.reload()
            }, 3000)
        } catch (error) {
            setAlertMessage(t("delete_error"))
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        }
    }

    const keywords = selectedJournal ? selectedJournal[`keywords_${locale}` as keyof Journal] : null

    const formatDate = (dateString: string) => {
        const d = new Date(dateString)
        const pad = (n: number) => n.toString().padStart(2, "0")

        const day = pad(d.getDate())
        const month = pad(d.getMonth() + 1)
        const year = d.getFullYear()

        const hours = pad(d.getHours())
        const minutes = pad(d.getMinutes())
        const seconds = pad(d.getSeconds())

        return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`
    }

    return (
        <div className="w-full mx-auto px-4 py-10">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg border border-purple-200">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        📰 {t("my_journals")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {user?.userJournal && user.userJournal.length > 0 ? (
                        <ul className="space-y-6">
                            {user.userJournal.map((journal) => (
                                <li
                                    key={journal.id}
                                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {getLocalizedField(journal, "title")}
                                    </h3>
                                    <p className="text-gray-700 mb-4 line-clamp-3">
                                        {getLocalizedField(journal, "description")}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                            {t("status")}: {journal.status.charAt(0).toUpperCase() + journal.status.slice(1)}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                            {t("created_at")}:{" "}
                                            {new Date(journal.createdAt).toLocaleString(locale, {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <p className="text-red-700 font-extrabold mb-5">{journal.message}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/journals/${journal.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                        >
                                            {t("open_file")}
                                        </a>

                                        <button
                                            onClick={() => setSelectedJournal(journal)}
                                            className="inline-block px-5 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                        >
                                            {t("view")}
                                        </button>

                                        {journal.status === "edit" && (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(journal)}
                                                    className="inline-block px-5 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                                >
                                                    {t("edit")}
                                                </button>
                                                <button
                                                    onClick={() => setMessageModalJournal(journal)}
                                                    className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                                >
                                                    {t("view_problems")}
                                                </button>
                                            </>
                                        )}

                                        {journal.status === "payment" && (
                                            <button
                                                className="inline-block px-5 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-800 transition"
                                            >
                                                {t("make_payment")}
                                            </button>
                                        )}

                                        {journal.status === "pending" && (
                                            <button
                                                onClick={() => setJournalToDelete(journal)}
                                                className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                            >
                                                {t("delete")}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic">{t("no_journals")}</p>
                    )}
                </CardContent>
            </Card>

            {selectedJournal && !formData.title_az && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
                    onClick={() => setSelectedJournal(null)}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedJournal(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">
                            {getLocalizedField(selectedJournal, "title")}
                        </h2>
                        <p className="text-gray-700 mb-4">
                            <strong>{t("description")}:</strong> {getLocalizedField(selectedJournal, "description")}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>{t("keywords")}:</strong> {(typeof keywords === "string" && keywords.trim() !== "") ? keywords : t("none")}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>{t("status")}:</strong> {selectedJournal.status}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>{t("created_at")}:</strong> {new Date(selectedJournal.createdAt).toLocaleString("az-AZ")}
                        </p>
                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}/uploads/journals/${selectedJournal.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            {t("open_file")}
                        </a>
                    </div>
                </div>
            )}

            {messageModalJournal && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
                    onClick={() => setMessageModalJournal(null)}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setMessageModalJournal(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-red-800">🛠 {t("problems")}</h2>

                        {messageModalJournal.messages && messageModalJournal.messages.length > 0 ? (
                            <ul className="space-y-4">
                                {messageModalJournal.messages
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((msg) => (
                                        <li key={msg.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded shadow">
                                            <p className="text-gray-800 whitespace-pre-line">{msg.problems}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                <p className="text-gray-500 text-xs mt-1">{formatDate(msg.createdAt)}</p>
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 italic">{t("no_problem_messages")}</p>
                        )}
                    </div>
                </div>
            )}

            {selectedJournal && formData.title_az && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
                    onClick={() => {
                        setSelectedJournal(null);
                        setFormData((prev) => ({ ...prev, title_az: "" }));
                    }}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setSelectedJournal(null);
                                setFormData((prev) => ({ ...prev, title_az: "" }));
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">{t("journal_edit")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div>
                                <label htmlFor="title_az" className="block font-semibold mb-1">
                                    {t("title_az")}
                                </label>
                                <input
                                    id="title_az"
                                    name="title_az"
                                    value={formData.title_az}
                                    onChange={handleInputChange}
                                    placeholder={t("title_az_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="title_en" className="block font-semibold mb-1">
                                    {t("title_en")}
                                </label>
                                <input
                                    id="title_en"
                                    name="title_en"
                                    value={formData.title_en}
                                    onChange={handleInputChange}
                                    placeholder={t("title_en_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="title_ru" className="block font-semibold mb-1">
                                    {t("title_ru")}
                                </label>
                                <input
                                    id="title_ru"
                                    name="title_ru"
                                    value={formData.title_ru}
                                    onChange={handleInputChange}
                                    placeholder={t("title_ru_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="description_az" className="block font-semibold mb-1">
                                    {t("description_az")}
                                </label>
                                <textarea
                                    id="description_az"
                                    name="description_az"
                                    value={formData.description_az}
                                    onChange={handleInputChange}
                                    placeholder={t("description_az_placeholder")}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="description_en" className="block font-semibold mb-1">
                                    {t("description_en")}
                                </label>
                                <textarea
                                    id="description_en"
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={handleInputChange}
                                    placeholder={t("description_en_placeholder")}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="description_ru" className="block font-semibold mb-1">
                                    {t("description_ru")}
                                </label>
                                <textarea
                                    id="description_ru"
                                    name="description_ru"
                                    value={formData.description_ru}
                                    onChange={handleInputChange}
                                    placeholder={t("description_ru_placeholder")}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="keywords_az" className="block font-semibold mb-1">
                                    {t("keywords_az")}
                                </label>
                                <input
                                    id="keywords_az"
                                    name="keywords_az"
                                    value={formData.keywords_az}
                                    onChange={handleInputChange}
                                    placeholder={t("keywords_az_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="keywords_en" className="block font-semibold mb-1">
                                    {t("keywords_en")}
                                </label>
                                <input
                                    id="keywords_en"
                                    name="keywords_en"
                                    value={formData.keywords_en}
                                    onChange={handleInputChange}
                                    placeholder={t("keywords_en_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="keywords_ru" className="block font-semibold mb-1">
                                    {t("keywords_ru")}
                                </label>
                                <input
                                    id="keywords_ru"
                                    name="keywords_ru"
                                    value={formData.keywords_ru}
                                    onChange={handleInputChange}
                                    placeholder={t("keywords_ru_placeholder")}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="file" className="block font-semibold mb-1">
                                    {t("upload_file")}
                                </label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                    className="w-full"
                                />
                                {typeof formData.file === "string" && formData.file && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}${formData.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline mt-2 block"
                                    >
                                        {t("open_existing_file")}
                                    </a>
                                )}
                            </div>
                            <div>
                                <label htmlFor="categoryId" className="block font-semibold mb-1">
                                    {t("category")}
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value={0} disabled={formData.categoryId !== 0}>
                                        {t("select")}
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {getLocalizedField(cat, "title")}
                                        </option>
                                    ))}
                                </select>

                                {selectedJournal?.category && selectedJournal.category.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <strong>{t("category")}:</strong> {getLocalizedField(selectedJournal.category[0], "title")}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="subCategoryId" className="block font-semibold mb-1">
                                    {t("sub_category")}
                                </label>
                                <select
                                    id="subCategoryId"
                                    name="subCategoryId"
                                    value={formData.subCategoryId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    disabled={subCategories.length === 0}
                                >
                                    <option value={0} disabled={formData.subCategoryId !== 0}>
                                        {t("select")}
                                    </option>
                                    {subCategories.map((sub) => (
                                        <option
                                            key={sub.id}
                                            value={sub.id}
                                            disabled={sub.status === "blocked"}
                                        >
                                            {getLocalizedField(sub, "title")}
                                            {sub.status === "blocked" ? ` (${t("blocked")})` : ""}
                                        </option>
                                    ))}
                                </select>

                                {selectedJournal?.subCategories && selectedJournal.subCategories.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <strong>{t("sub_category")}:</strong>{" "}
                                        {getLocalizedField(selectedJournal.subCategories[0], "title")}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setSelectedJournal(null);
                                    setFormData((prev) => ({ ...prev, title_az: "" }));
                                }}
                                className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                {t("save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {journalToDelete && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
                    onClick={() => setJournalToDelete(null)}
                >
                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t("confirm_delete_journal")}</h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setJournalToDelete(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                {t("yes_delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
                    {alertMessage}
                </div>
            )}
        </div>
    )
}
