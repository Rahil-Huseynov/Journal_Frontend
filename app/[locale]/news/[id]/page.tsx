// app/news/[id]/page.tsx
import { apiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { az } from "date-fns/locale";

interface News {
  id: number;
  createdAt: string;
  title_az: string;
  description_az: string;
  image: string;
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  try {
    const news: News = await apiClient.getNewsById(Number(params.id));

    return (
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <article className="prose prose-lg prose-amber mx-auto dark:prose-invert">
          {/* Şəkil */}
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/news/${news.image}`}
            alt={news.title_az}
            className="w-full max-h-[400px] object-cover rounded-lg mb-8 shadow-md"
            loading="lazy"
          />

          {/* Başlıq */}
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
            {news.title_az}
          </h1>

          {/* Tarix */}
          <time
            dateTime={news.createdAt}
            className="block text-sm text-gray-500 mb-8 dark:text-gray-400"
          >
            {format(new Date(news.createdAt), "dd MMMM yyyy", { locale: az })}
          </time>

          {/* Mətni */}
          <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {news.description_az}
          </div>
        </article>
      </main>
    );
  } catch (error) {
    return notFound();
  }
}
