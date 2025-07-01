"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const journals = [
  {
    id: "mathematics",
    name: "Riyaziyyat",
    description: "Riyazi elmlər və tətbiqi riyaziyyat",
    color: "bg-blue-100 text-blue-800",
    series: [
      { id: "pure-math", name: "Saf Riyaziyyat" },
      { id: "applied-math", name: "Tətbiqi Riyaziyyat" },
    ],
  },
  {
    id: "physics",
    name: "Fizika",
    description: "Nəzəri və eksperimental fizika",
    color: "bg-green-100 text-green-800",
    series: [
      { id: "quantum-physics", name: "Kvant Fizikası" },
      { id: "astrophysics", name: "Astrofizika" },
    ],
  },
]

export default function JournalsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">Jurnallar</h1>
        <div className="space-y-8">
          {journals.map((journal) => {
            const firstSeries = journal.series[0]
            return (
              <Card key={journal.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{journal.name}</CardTitle>
                    <Badge className={journal.color}>1 seriya</Badge>
                  </div>
                  <CardDescription>{journal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/${params.locale}/journals/${journal.id}/${firstSeries.id}`}
                    className="inline-flex items-center text-blue-700 font-medium"
                  >
                    {firstSeries.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
