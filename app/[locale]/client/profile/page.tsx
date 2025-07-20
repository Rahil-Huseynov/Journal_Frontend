"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  fatherName?: string
  role: string
  organization?: string
  position?: string
  phoneCode?: string
  phoneNumber?: string
  address?: string
  fin?: string
  idSerial?: string
  passportId?: string
  isForeignCitizen: boolean
  createdAt: string
  citizenship: string
}

export default function ClientProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations("Client_Profile")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCurrentUser()
        setUser(response)
      } catch (err: any) {
        setError(err?.message || t("errorLoadingUser"))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [t])

  return (
    <div className="w-full px-4 py-6">
      <Card className="shadow-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700">
            👤 {t("profileInformation")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
              <ProfileItem label={t("firstName")} value={user.firstName} />
              <ProfileItem label={t("lastName")} value={user.lastName} />
              <ProfileItem label={t("fatherName")} value={user.fatherName} />
              <ProfileItem label={t("email")} value={user.email} />
              <ProfileItem label={t("organization")} value={user.organization} />
              <ProfileItem label={t("position")} value={user.position} />
              <ProfileItem label={t("phone")} value={`${user.phoneCode || ""} ${user.phoneNumber || ""}`} />
              <ProfileItem label={t("address")} value={user.address} />
              {user.fin && user.idSerial ? (
                <>
                  <ProfileItem label={t("fin")} value={user.fin} />
                  <ProfileItem label={t("idSerial")} value={user.idSerial} />
                </>
              ) : (
                <ProfileItem label={t("foreignPassport")} value={user.passportId} />
              )}
              <ProfileItem label={t("foreignPassport")} value={user.passportId} hidden={!user.isForeignCitizen} />
              <ProfileItem label={t("citizenship")} value={<Badge variant="outline">{user.citizenship}</Badge>} />
              <ProfileItem
                label={t("registrationDate")}
                value={new Date(user.createdAt).toLocaleString("az-AZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">{t("userNotFound")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const ProfileItem = ({
  label,
  value,
  hidden,
}: {
  label: string
  value?: React.ReactNode
  hidden?: boolean
}) => {
  if (hidden || value === null || value === undefined || value === "") return null
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
