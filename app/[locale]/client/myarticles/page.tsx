"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "next-intl"

type Journal = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title_az: string;
    title_en: string;
    title_ru: string;
    description_az: string;
    description_en: string;
    description_ru: string;
    keywords_en: string;
    keywords_az: string;
    keywords_ru: string;
    file: string;
    userId: string;
    user: string;
    approved: string;
    status: string;
};

type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organization?: string;
    position?: string;
    userJournal?: Journal[];
};

export default function ClientarticlesPage() {
    const { user } = useAuth() as unknown as { user: User };
    const locale = useLocale();

    const getLocalizedField = (obj: any, base: string) => {
        const key = `${base}_${locale}`;
        return obj[key] || obj[`${base}_az`] || "";
    };

    return (
        <div className="w-full mx-auto px-4 py-10">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg border border-purple-200">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                        📰 Mənim Jurnallarım
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
                                            Status: {journal.status.charAt(0).toUpperCase() + journal.status.slice(1)}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                            Yaradılıb: {new Date(journal.createdAt).toLocaleString('az-AZ', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}
                                        </span>
                                    </div>

                                    <a
                                        href={`http://localhost:3001${journal.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Faylı Aç
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic">Sizin heç bir jurnalınız yoxdur.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
