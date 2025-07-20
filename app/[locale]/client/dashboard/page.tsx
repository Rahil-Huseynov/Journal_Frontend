"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function ClientDashboardPage() {
  const { user } = useAuth()
  const t = useTranslations("Client_Dashboard")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {t("greeting")}, <strong>{user?.firstName} {user?.lastName}</strong>!
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {t("logged_in_with_email", { email: user?.email })}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {t("your_role")}: <strong>{user?.role}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
