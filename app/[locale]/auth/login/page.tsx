"use client"

import React, { useState } from "react"
import "./page.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { tokenManager } from "@/lib/token-manager"
import { apiClient } from "@/lib/api-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const locale = useLocale()
  const t = useTranslations("Register")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.login(email, password)

      if (response.accessToken) {
        tokenManager.setAccessToken(response.accessToken)

        let role = ""

        let destination = ""

        if (response.user && response.user.role) {
          role = response.user.role 
        } else if (response.admin) {
          role = "admin"
        } else if (response.superadmin) {
          role = "superadmin"
        }

        switch (role) {
          case "superadmin":
            destination = `/${locale}/admin/dashboard`
            break
          case "admin":
            destination = `/${locale}/admin/dashboard`
            break
          case "client":
            destination = `/${locale}/client/dashboard`
            break
          default:
            setError("Giriş uğursuz oldu: Rol təyin olunmayıb")
            return
        }

        window.location.href = destination
      } else {
        setError("Giriş uğursuz oldu: Məlumat tapılmadı")
      }
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/">
            <div className="back_container">
              <img
                className="back_container_image"
                src="https://www.svgrepo.com/show/509905/dropdown-arrow.svg"
                alt="Back"
              />
              <span>{t("back")}</span>
            </div>
          </Link>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">ScientificWorks</span>
          </div>
          <CardTitle className="text-2xl">Giriş</CardTitle>
          <CardDescription>Hesabınıza daxil olmaq üçün məlumatlarınızı daxil edin</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrənizi daxil edin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href={`/${locale}/auth/forgot-password`} className="text-sm text-blue-600 hover:underline">
                Şifrəni unutmusunuz?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş edilir..." : "Giriş"}
            </Button>

            <div className="text-center text-sm">
              Hesabınız yoxdur?{" "}
              <Link href={`/${locale}/auth/register`} className="text-blue-600 hover:underline">
                Qeydiyyatdan keçin
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
