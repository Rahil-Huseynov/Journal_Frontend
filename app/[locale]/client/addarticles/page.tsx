"use client"

import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"

type Category = {
  id: number
  title_az: string
  subCategories: SubCategory[]
}

type SubCategory = {
  id: number
  title_az: string
  status: string
}

interface JournalForm {
  title_az: string
  title_en: string
  title_ru: string
  description_az: string
  description_en: string
  description_ru: string
  keywords_en: string
  keywords_az: string
  keywords_ru: string
  status: string
  file: string
  categoryId: string
  subCategoryId: string
  categoryIds: number[]
  subCategoryIds: number[]
}

export default function ClientaddarticlesPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const locale = useLocale()

  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiClient.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Kateqoriyalar alınarkən xəta:", error)
      }
    }
    fetchCategories()
  }, [])

  const [form, setForm] = useState<JournalForm>({
    title_az: "",
    title_en: "",
    title_ru: "",
    description_az: "",
    description_en: "",
    description_ru: "",
    keywords_en: "",
    keywords_az: "",
    keywords_ru: "",
    status: "pending",
    file: "",
    categoryId: "",
    subCategoryId: "",
    categoryIds: [],
    subCategoryIds: [],
  })

  const selectedCategory = categories.find((cat) => cat.id.toString() === form.categoryId)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "categoryId") {
      setForm((prev) => ({
        ...prev,
        categoryId: value,
        categoryIds: value ? [parseInt(value)] : [],
        subCategoryId: "",
        subCategoryIds: [],
      }))
    } else if (name === "subCategoryId") {
      setForm((prev) => ({
        ...prev,
        subCategoryId: value,
        subCategoryIds: value ? [parseInt(value)] : [],
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setAlertMessage("Zəhmət olmasa, daxil olun")
      return
    }
    if (!form.categoryId || !form.subCategoryId) {
      setAlertMessage("Kateqoriya və alt kateqoriya seçməlisiniz")
      return
    }

    const formData = new FormData()
    formData.append("title_az", form.title_az)
    formData.append("title_en", form.title_en)
    formData.append("title_ru", form.title_ru)
    formData.append("description_az", form.description_az)
    formData.append("description_en", form.description_en)
    formData.append("description_ru", form.description_ru)
    formData.append("keywords_az", form.keywords_az)
    formData.append("keywords_en", form.keywords_en)
    formData.append("keywords_ru", form.keywords_ru)
    formData.append("status", form.status)

    if (file) {
      formData.append("file", file)
    }

    formData.append("categoryIds", JSON.stringify(form.categoryIds))
    formData.append("subCategoryIds", JSON.stringify(form.subCategoryIds))

    try {
      setLoading(true)
      await apiClient.addjournalforUser(formData)
      setAlertMessage("Jurnal uğurla əlavə olundu!")

      setForm({
        title_az: "",
        title_en: "",
        title_ru: "",
        description_az: "",
        description_en: "",
        description_ru: "",
        keywords_en: "",
        keywords_az: "",
        keywords_ru: "",
        file: "",
        status: "pending",
        categoryId: "",
        subCategoryId: "",
        categoryIds: [],
        subCategoryIds: [],
      })
      setFile(null)
      setTimeout(() => {
        setAlertMessage(null)
        window.location.href = `/${locale}/client/myarticles`
      }, 3000)
    } catch (error) {
      setAlertMessage("Xəta baş verdi!")
      console.error(error)
      setTimeout(() => setAlertMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">📝 Yeni Jurnal Əlavə Et</h2>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {[
            { name: "title_az", label: "Başlıq (AZ)" },
            { name: "title_en", label: "Title (EN)" },
            { name: "title_ru", label: "Заголовок (RU)" },
          ].map((input) => (
            <div key={input.name}>
              <label className="block text-sm text-gray-600 mb-1">{input.label}</label>
              <input
                name={input.name}
                value={(form as any)[input.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}

          {[
            { name: "description_az", label: "Təsvir (AZ)" },
            { name: "description_en", label: "Description (EN)" },
            { name: "description_ru", label: "Описание (RU)" },
          ].map((area) => (
            <div key={area.name}>
              <label className="block text-sm text-gray-600 mb-1">{area.label}</label>
              <textarea
                name={area.name}
                value={(form as any)[area.name]}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}

          {[
            { name: "keywords_az", label: "Açar söz (AZ)" },
            { name: "keywords_en", label: "Keywords (EN)" },
            { name: "keywords_ru", label: "Ключевые слова (RU)" },
          ].map((area) => (
            <div key={area.name}>
              <label className="block text-sm text-gray-600 mb-1">{area.label}</label>
              <textarea
                name={area.name}
                value={(form as any)[area.name]}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kateqoriya</label>
            <select
              name="categoryId"
              value={form.categoryId ?? ""}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Seçin...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title_az}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Alt Kateqoriya</label>
            <select
              name="subCategoryId"
              value={form.subCategoryId ?? ""}
              onChange={handleChange}
              required
              disabled={!selectedCategory}
              className={`w-full p-3 border rounded-lg shadow-sm transition ${selectedCategory
                ? "focus:outline-none focus:ring-2 focus:ring-blue-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <option value="">Seçin...</option>
              {selectedCategory?.subCategories.map((sub) => (
                <option key={sub.id} value={sub.id} disabled={sub.status === "blocked"} >
                  {sub.title_az}
                  {sub.status === "blocked" ? " (Bloklanıb)" : ""}
                </option>
              ))}
          </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">PDF və ya şəkil faylı</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          required
          className="w-full p-3 border rounded-lg shadow-sm bg-white cursor-pointer file:text-blue-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
      >
        {loading ? "Yüklənir..." : "Jurnalı Yarat"}
      </button>
    </form>
      </div >

    { alertMessage && (
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-out transition-all duration-300 max-w-sm">
          <span className="flex-grow">{alertMessage}</span>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-white font-bold text-xl leading-none hover:text-gray-200"
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      </div>
    )
}
    </div >
  )
}
