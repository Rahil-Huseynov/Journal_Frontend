import { notFound } from "next/navigation"

interface Article {
  id: string
  title: string
  author: string
  date: string
}

interface Series {
  id: string
  name: string
  description: string
  articles: Article[]
}

interface Journal {
  id: string
  name: string
  series: Series[]
}

interface PageProps {
  params: {
    locale: string
    journalId: string
    seriesId: string
  }
}

// Fake API çağırışı nümunəsi
async function fetchSeries(journalId: string, seriesId: string): Promise<Series | null> {
  // Burada sənin əsl API çağırışını et:
  // return fetch(`https://api.example.com/journals/${journalId}/series/${seriesId}`).then(res => {
  //   if (!res.ok) return null
  //   return res.json()
  // })

  // Fake data nümunəsi:
  const fakeData = {
    mathematics: {
      "pure-math": {
        id: "pure-math",
        name: "Saf Riyaziyyat",
        description: "Nəzəri riyaziyyat",
        articles: [
          {
            id: "1",
            title: "Qrup Nəzəriyyəsi",
            author: "Dr. Əli Məmmədov",
            date: "2024-01-10",
          },
        ],
      },
      "applied-math": {
        id: "applied-math",
        name: "Tətbiqi Riyaziyyat",
        description: "Tətbiqlərə yönəlik riyaziyyat",
        articles: [
          {
            id: "2",
            title: "Optimallaşdırma Metodları",
            author: "Dr. Rəşad Əliyev",
            date: "2024-02-10",
          },
        ],
      },
    },
    physics: {
      "quantum-physics": {
        id: "quantum-physics",
        name: "Kvant Fizikası",
        description: "Kvant nəzəriyyəsi",
        articles: [
          {
            id: "3",
            title: "Kvant Sahələr Nəzəriyyəsi",
            author: "Prof. Leyla Həsənova",
            date: "2024-03-01",
          },
        ],
      },
    },
  }

  const series = fakeData[journalId]?.[seriesId] ?? null
  return series
}

export default async function SeriesPage({ params }: PageProps) {
  const { journalId, seriesId } = params
  const series = await fetchSeries(journalId, seriesId)

  if (!series) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{series.name}</h1>
      <p className="text-gray-600 mb-6">{series.description}</p>

      {series.articles.map((article) => (
        <div key={article.id} className="border rounded p-4 mb-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
          <p className="text-gray-700 mb-1">Müəllif: {article.author}</p>
          <p className="text-gray-700">Tarix: {article.date}</p>
        </div>
      ))}
    </div>
  )
}
