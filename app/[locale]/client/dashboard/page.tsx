"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClientDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Salam, <strong>{user?.firstName} {user?.lastName}</strong>!
          </p>
          <p className="mt-2 text-sm text-gray-600">Siz {user?.email} emaili ilə sistemə daxil olmusunuz.</p>
          <p className="mt-1 text-sm text-gray-600">Rolunuz: <strong>{user?.role}</strong></p>
        </CardContent>
      </Card>
    </div>
  )
}
