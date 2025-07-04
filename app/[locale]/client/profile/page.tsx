"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

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
}

export default function ClientProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCurrentUser()
        setUser(response)
      } catch (err: any) {
        setError(err?.message || "İstifadəçi məlumatı yüklənmədi.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="w-full px-4 py-6">
      <Card className="shadow-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700">👤 Profil Məlumatları</CardTitle>
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
              <ProfileItem label="Ad" value={user.firstName} />
              <ProfileItem label="Soyad" value={user.lastName} />
              <ProfileItem label="Ata adı" value={user.fatherName} />
              <ProfileItem label="E-poçt" value={user.email} />
              <ProfileItem label="Təşkilat" value={user.organization} />
              <ProfileItem label="Vəzifə" value={user.position} />
              <ProfileItem label="Telefon" value={`${user.phoneCode} ${user.phoneNumber}`} />
              <ProfileItem label="Ünvan" value={user.address} />
              {user.fin && user.idSerial ? (
                <>
                  <ProfileItem label="FİN" value={user.fin} />
                  <ProfileItem label="Seriya nömrəsi" value={user.idSerial} />
                </>
              ) : (
                <ProfileItem label="Xarici Pasport" value={user.passportId} />
              )}
              <ProfileItem label="Xarici Pasport" value={user.passportId} hidden={!user.isForeignCitizen} />
              <ProfileItem
                label="Vətəndaşlıq"
                value={
                  user.isForeignCitizen ? (
                    <Badge variant="destructive">Xarici vətəndaş</Badge>
                  ) : (
                    <Badge variant="default">Azərbaycan vətəndaşı</Badge>
                  )
                }
              />
              <ProfileItem
                label="Qeydiyyat tarixi"
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
            <p className="text-gray-500 text-center">İstifadəçi məlumatı tapılmadı.</p>
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
