"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LogsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin_Logs");

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      router.push(`/${locale}/admin/dashboard`);
    }
  }, [user, router, locale]);

  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, error, isLoading } = useSWR(["logs", page, limit], () =>
    apiClient.getlogs(page, limit)
  );

  if (error) return <p className="text-red-600">{t("Error")}</p>;
  if (isLoading || !data) return <p>{t("Loading")}</p>;

  const totalPages = Math.ceil(data.total / limit);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t("Title")}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="px-4 py-2">№</th>
              <th className="px-4 py-2">{t("Date")}</th>
              <th className="px-4 py-2">{t("Method")}</th>
              <th className="px-4 py-2">{t("UserId")}</th>
              <th className="px-4 py-2">{t("User")}</th>
              <th className="px-4 py-2">{t("UserRole")}</th>
              <th className="px-4 py-2">{t("URL")}</th>
              <th className="px-4 py-2">{t("Status")}</th>
              <th className="px-4 py-2">{t("Duration")}</th>
              <th className="px-4 py-2">{t("IP")}</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((log: any) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-2">#{log.id}</td>
                <td className="px-4 py-2">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{log.method}</td>
                <td className="px-4 py-2">{log.userId ?? "-"}</td>
                <td className="px-4 py-2">{log.userName ?? "-"}</td>
                <td className="px-4 py-2">{log.userRole ?? "-"}</td>
                <td className="px-4 py-2 break-all">{log.url}</td>
                <td className="px-4 py-2">{log.status}</td>
                <td className="px-4 py-2">{log.duration}</td>
                <td className="px-4 py-2">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⟨ {t("Previous")}
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * limit >= data.total}
        >
          {t("Next")} ⟩
        </button>
      </div>
    </section>
  );
}
