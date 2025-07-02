"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLocale, useTranslations } from "next-intl"
import "./page.css"
import CountrySelect from "@/components/CountryCodeSelect"
import { apiClient } from "@/lib/api-client"
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
    organization: "",
    position: "",
    phoneCode: "",
    phoneNumber: "",
    address: "",
    fin: "",
    idSerial: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const t = useTranslations('Register');
  const locale = useLocale();

  const router = useRouter()
  const { register } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Şifrələr uyğun gəlmir")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır")
      setIsLoading(false)
      return
    }

    try {
      const multipartData = new FormData()
      multipartData.append("firstName", formData.firstName)
      multipartData.append("lastName", formData.lastName)
      multipartData.append("fatherName", formData.fatherName)
      multipartData.append("email", formData.email)
      multipartData.append("password", formData.password)
      multipartData.append("role", formData.role)
      multipartData.append("organization", formData.organization)
      multipartData.append("position", formData.position)
      multipartData.append("phoneCode", formData.phoneCode)
      multipartData.append("phoneNumber", formData.phoneNumber)
      multipartData.append("address", formData.address)
      multipartData.append("fin", formData.fin)
      multipartData.append("idSerial", formData.idSerial)

      router.push(`/${locale}/auth/login?message=${encodeURIComponent("Qeydiyyat uğurlu oldu. Giriş edə bilərsiniz.")}`);
    
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
    
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href={'/'}>
            <div className="back_container">
              <img className="back_container_image" src="https://www.svgrepo.com/show/509905/dropdown-arrow.svg" alt="" />
              <span>{t("back")}</span>
            </div>
          </Link>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">ScientificWorks</span>
          </div>
          <CardTitle className="text-2xl">Qeydiyyat</CardTitle>
          <CardDescription>Yeni hesab yaratmaq üçün məlumatlarınızı daxil edin</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  placeholder="Adınızı daxil edin"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  placeholder="Soyadınızı daxil edin"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Ata adı</Label>
                <Input
                  id="fatherName"
                  placeholder="Ata adınızı daxil edin"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rolunuzu seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Tədqiqatçı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Təşkilat</Label>
                <Input
                  id="organization"
                  placeholder="Təşkilatınızın adı"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Vəzifə</Label>
                <Input
                  id="position"
                  placeholder="Vəzifəniz"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="phone">Mobil nömrə</Label>
                <div className="flex gap-2">
                  <CountrySelect
                    value={formData.phoneCode}
                    onChange={(val) => handleInputChange("phoneCode", val)}
                  />
                  <Input
                    id="phone"
                    placeholder="501234567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Ünvan</Label>
                <Input
                  id="address"
                  placeholder="Ünvanınızı qeyd edin"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fin">FİN nömrəsi</Label>
                <Input
                  id="fin"
                  placeholder="FİN nömrəsi"
                  value={formData.fin}
                  onChange={(e) => handleInputChange("fin", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Şəxsiyyət vəsiqəsinin seriya nömrəsi</Label>
                <Input
                  id="idSerial"
                  placeholder="Şəxsiyyət vəsiqəsinin seriya nömrəsi"
                  value={formData.idSerial}
                  onChange={(e) => handleInputChange("idSerial", e.target.value)}
                  required
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrənizi daxil edin"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifrəni təsdiq edin</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrənizi yenidən daxil edin"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Qeydiyyat edilir..." : "Qeydiyyat"}
            </Button>

            <div className="text-center text-sm">
              Artıq hesabınız var?{" "}
              <Link href={`/${locale}/auth/login`}
                className="text-blue-600 hover:underline">
                Giriş edin
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
