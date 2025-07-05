"use client"

import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "next-intl"
import { useState } from "react"

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
    keywords_en: string | null;
    keywords_az: string | null;
    keywords_ru: string | null;
    file: string;
    userId: string;
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

    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
    const [journalToDelete, setJournalToDelete] = useState<Journal | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const getLocalizedField = (obj: any, base: string) => {
        const key = `${base}_${locale}`;
        return obj[key] || obj[`${base}_az`] || "";
    };

    const confirmDelete = async () => {
        if (!journalToDelete) return;

        try {
            await apiClient.deleteUserJournal(journalToDelete.id);
            setAlertMessage("Jurnal uğurla silindi");
            setShowAlert(true);
            setSelectedJournal(null);
            setJournalToDelete(null);

            setTimeout(() => {
                setShowAlert(false);
                window.location.reload();
            }, 3000);
        } catch (error) {
            setAlertMessage("Silinmə zamanı xəta baş verdi");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
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
                                            Yaradılıb: {new Date(journal.createdAt).toLocaleString("az-AZ", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <a
                                            href={`http://localhost:3001${journal.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                        >
                                            Faylı Aç
                                        </a>

                                        <button
                                            onClick={() => setSelectedJournal(journal)}
                                            className="inline-block px-5 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                        >
                                            Bax
                                        </button>

                                        {journal.status === "pending" && (
                                            <button
                                                onClick={() => setJournalToDelete(journal)}
                                                className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                                            >
                                                Sil
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic">Sizin heç bir jurnalınız yoxdur.</p>
                    )}
                </CardContent>
            </Card>

            {selectedJournal && (
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
                            <strong>Təsvir:</strong> {getLocalizedField(selectedJournal, "description")}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Açar sözlər:</strong>{" "}
                            {selectedJournal[`keywords_${locale}` as keyof Journal] || "Yoxdur"}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>Status:</strong> {selectedJournal.status}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>Yaradılma vaxtı:</strong>{" "}
                            {new Date(selectedJournal.createdAt).toLocaleString("az-AZ")}
                        </p>
                        <a
                            href={`http://localhost:3001${selectedJournal.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Faylı Aç
                        </a>
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
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                            Jurnalı silmək istədiyinizə əminsiniz?
                        </h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setJournalToDelete(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                Ləğv et
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Bəli, sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
