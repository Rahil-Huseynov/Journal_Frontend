"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CountrySelect from "@/components/CountryCodeSelect";
import "./page.css";
import { apiClient } from "@/lib/api-client";
import SuccessModal from "@/components/SuccessModal";
import CitizenshipCountrySelect from "@/components/CitizenshipCountrySelect";

const validators = {
  firstName: /^[A-Za-zƏÖŞÇÜİĞəöşçüığ'-]{2,30}$/,
  lastName: /^[A-Za-zƏÖŞÇÜİĞəöşçüığ'-]{2,30}$/,
  fatherName: /^$|^[A-Za-zƏÖŞÇÜİĞəöşçüığ'-]{2,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phoneCode: /^\+?[0-9]{1,4}$/,
  phoneNumber: /^[0-9]{6,15}$/,
  organization: /^[\w\s.,'-]{2,100}$/,
  position: /^[\w\s.,'-]{2,100}$/,
  address: /^[\w\s.,'-]{2,100}$/,
  fin: /^[A-Z0-9]{7}$/,
  idSerial: /^[A-Z]{2}[0-9]{7}$/,
  passportId: /^[A-Z0-9]{5,20}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

const examples: { [key: string]: string } = {
  firstName: "Nümunə: Ayxan",
  lastName: "Nümunə: Məmmədov",
  fatherName: "Nümunə: Hüseyn",
  email: "Nümunə: example@email.com",
  phoneCode: "Nümunə: +994",
  phoneNumber: "Nümunə: 501234567",
  organization: "Nümunə: Bakı Dövlət Universiteti",
  position: "Nümunə: Tədqiqatçı",
  address: "Nümunə: Bakı, Nəsimi rayonu",
  fin: "Nümunə: AB123456",
  idSerial: "Nümunə: AA1234567",
  passportId: "Nümunə: AZ1234567",
  password: "Minimum 8 simvol, böyük, kiçik hərf, rəqəm və xüsusi simvol",
  confirmPassword: "Şifrəniz ilə eyni olmalıdır",
  citizenship: "Almanya"
};

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
    idSerial: "",
    passportId: "",
    citizenship: "Azerbaijan",
    isForeign: false,
  });

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const t = useTranslations("Register");
  const locale = useLocale();
  const router = useRouter();

  const validateField = (field: keyof typeof validators, value: string) => {
    const regex = validators[field];
    return regex.test(value);
  };

  const handleInputChange = (field: string, value: string) => {
    let errorMsg = "";

    if (field in validators) {
      if (!validateField(field as keyof typeof validators, value)) {
        errorMsg = `Bu sahə üçün düzgün məlumat daxil edin. ${examples[field] || ""
          }`;
      }
    }

    if (field === "confirmPassword" && value !== formData.password) {
      errorMsg = "Şifrələr uyğun deyil. " + examples.confirmPassword;
    }

    if (
      field === "password" &&
      formData.confirmPassword &&
      value !== formData.confirmPassword
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "Şifrələr uyğun deyil. " + examples.confirmPassword,
      }));
    } else if (
      field === "password" &&
      formData.confirmPassword &&
      value === formData.confirmPassword
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }

    setErrorMessages((prev) => ({ ...prev, [field]: errorMsg }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateAllFields = () => {
    const newErrors: { [key: string]: string } = {};

    for (const key in validators) {
      const field = key as keyof typeof validators;
      const value = formData[field];
      if (field === "fatherName" && !value.trim()) continue;
      if (field === "passportId" && !formData.isForeign) continue;

      if (field === "fin" && formData.isForeign) continue;
      if (field === "idSerial" && formData.isForeign) continue;

      if (!validateField(field, value)) {
        newErrors[field] = `Bu sahə üçün düzgün məlumat daxil edin. ${examples[field] || ""
          }`;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifrələr uyğun deyil. " + examples.confirmPassword;
    }

    if (!formData.isForeign) {
      if (!validateField("fin", formData.fin)) {
        newErrors.fin = `Düzgün FİN nömrəsi daxil edin. ${examples.fin}`;
      }
      if (!validateField("idSerial", formData.idSerial)) {
        newErrors.idSerial = `Düzgün seriya nömrəsi daxil edin. ${examples.idSerial}`;
      }
    } else {
      if (!validateField("passportId", formData.passportId)) {
        newErrors.passportId = "Düzgün passport nömrəsi daxil edin.";
      }
    }

    setErrorMessages(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const multipartData = new FormData();
      multipartData.append("firstName", formData.firstName);
      multipartData.append("lastName", formData.lastName);
      multipartData.append("fatherName", formData.fatherName);
      multipartData.append("email", formData.email);
      multipartData.append("password", formData.password);
      multipartData.append("role", formData.role);
      multipartData.append("organization", formData.organization);
      multipartData.append("position", formData.position);
      multipartData.append("phoneCode", formData.phoneCode);
      multipartData.append("phoneNumber", formData.phoneNumber);
      multipartData.append("address", formData.address);
      multipartData.append("isForeignCitizen", formData.isForeign ? "true" : "false");
      multipartData.append("citizenship", formData.citizenship);

      if (formData.isForeign) {
        multipartData.append("passportId", formData.passportId || "");
      } else {
        multipartData.append("fin", formData.fin || "");
        multipartData.append("idSerial", formData.idSerial || "");
      }


      const response = await apiClient.register(multipartData);
      setSuccessMessage("Qeydiyyat uğurla tamamlandı!");

      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field: string) =>
    errorMessages[field] ? "border-red-600 focus:ring-red-600" : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href={"/"}>
            <div className="back_container">
              <img
                className="back_container_image"
                src="https://www.svgrepo.com/show/509905/dropdown-arrow.svg"
                alt=""
              />
              <span>{t("back")}</span>
            </div>
          </Link>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              ScientificWorks
            </span>
          </div>
          <CardTitle className="text-2xl">Qeydiyyat</CardTitle>
          <CardDescription>
            Yeni hesab yaratmaq üçün məlumatlarınızı daxil edin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  placeholder="Adınızı daxil edin"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className={getInputClass("firstName")}
                />
                {errorMessages.firstName && (
                  <p className="text-red-600 text-sm">{errorMessages.firstName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  placeholder="Soyadınızı daxil edin"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className={getInputClass("lastName")}
                />
                {errorMessages.lastName && (
                  <p className="text-red-600 text-sm">{errorMessages.lastName}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="fatherName">Ata adı</Label>
                <Input
                  id="fatherName"
                  placeholder="Ata adınızı daxil edin"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  className={getInputClass("fatherName")}
                />
                {errorMessages.fatherName && (
                  <p className="text-red-600 text-sm">{errorMessages.fatherName}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className={getInputClass("email")}
              />
              {errorMessages.email && (
                <p className="text-red-600 text-sm">{errorMessages.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rolunuzu seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Tədqiqatçı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="organization">Təşkilat</Label>
                <Input
                  id="organization"
                  placeholder="Təşkilatınızın adı"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  required
                  className={getInputClass("organization")}
                />
                {errorMessages.organization && (
                  <p className="text-red-600 text-sm">{errorMessages.organization}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="position">Vəzifə</Label>
                <Input
                  id="position"
                  placeholder="Vəzifəniz"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  required
                  className={getInputClass("position")}
                />
                {errorMessages.position && (
                  <p className="text-red-600 text-sm">{errorMessages.position}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
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
                    className={`${getInputClass("phoneCode")} ${getInputClass(
                      "phoneNumber"
                    )}`}
                  />
                </div>
                {(errorMessages.phoneCode || errorMessages.phoneNumber) && (
                  <p className="text-red-600 text-sm">
                    {errorMessages.phoneCode || errorMessages.phoneNumber}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Ünvan</Label>
                <Input
                  id="address"
                  placeholder="Ünvanınızı qeyd edin"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className={getInputClass("address")}
                />
                {errorMessages.address && (
                  <p className="text-red-600 text-sm">{errorMessages.address}</p>
                )}
              </div>
            </div>

            {!formData.isForeign && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fin">FİN nömrəsi</Label>
                  <Input
                    id="fin"
                    placeholder="FİN nömrəsi"
                    value={formData.fin}
                    onChange={(e) => handleInputChange("fin", e.target.value)}
                    required={!formData.isForeign}
                    className={getInputClass("fin")}
                  />
                  {errorMessages.fin && (
                    <p className="text-red-600 text-sm">{errorMessages.fin}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="idSerial">Şəxsiyyət vəsiqəsinin seriya nömrəsi</Label>
                  <Input
                    id="idSerial"
                    placeholder="Şəxsiyyət vəsiqəsinin seriya nömrəsi"
                    value={formData.idSerial}
                    onChange={(e) => handleInputChange("idSerial", e.target.value)}
                    required={!formData.isForeign}
                    className={getInputClass("idSerial")}
                  />
                  {errorMessages.idSerial && (
                    <p className="text-red-600 text-sm">{errorMessages.idSerial}</p>
                  )}
                </div>
              </div>
            )}

            {formData.isForeign && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="passportId">Passport nömrəsi</Label>
                  <Input
                    id="passportId"
                    placeholder="Passport nömrənizi daxil edin"
                    value={formData.passportId}
                    onChange={(e) => handleInputChange("passportId", e.target.value)}
                    required={formData.isForeign}
                    className={getInputClass("passportId")}
                  />
                  {errorMessages.passportId && (
                    <p className="text-red-600 text-sm">{errorMessages.passportId}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="citizenship">Vətəndaşlıq</Label>
                  <CitizenshipCountrySelect
                    value={formData.citizenship}
                    onChange={(country, isForeign) =>
                      setFormData((prev) => ({
                        ...prev,
                        citizenship: country,
                        isForeign,
                        fin: isForeign ? "" : prev.fin,
                        idSerial: isForeign ? "" : prev.idSerial,
                        passportId: isForeign ? prev.passportId : "",
                      }))
                    }
                  />
                  {errorMessages.citizens && (
                    <p className="text-red-600 text-sm">{errorMessages.citizenship}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2 col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isForeign}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isForeign: e.target.checked,
                      fin: e.target.checked ? "" : prev.fin,
                      idSerial: e.target.checked ? "" : prev.idSerial,
                      passportId: e.target.checked ? prev.passportId : "",
                    }))
                  }
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                Azərbaycan vətəndaşı deyiləm
              </label>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="password">Şifrə</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrənizi daxil edin"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className={getInputClass("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errorMessages.password && (
                  <p className="text-red-600 text-sm">{errorMessages.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Şifrəni təsdiqlə</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrənizi yenidən daxil edin"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className={getInputClass("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errorMessages.confirmPassword && (
                  <p className="text-red-600 text-sm">{errorMessages.confirmPassword}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Göndərilir..." : "Qeydiyyat"}
            </Button>
          </CardFooter>
        </form>
      </Card >
      {successMessage && <SuccessModal message={successMessage} />
      }
    </div >
  );
}
