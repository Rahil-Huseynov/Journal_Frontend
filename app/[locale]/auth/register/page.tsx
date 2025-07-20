"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import logo from '../../../../public/favicon.png'

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
  citizenship: "Almanya",
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
    usertype: "Tədqiqatçı",
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
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();

  const userTypeOptions = [
    { value: "client", label: t("researcher") },
  ];

  const validateField = (field: keyof typeof validators, value: string) => {
    const regex = validators[field];
    return regex.test(value);
  };

  const handleInputChange = (field: string, value: string) => {
    let errorMsg = "";

    if (field in validators) {
      if (!validateField(field as keyof typeof validators, value)) {
        errorMsg = `${t("invalidField")} ${examples[field] || ""}`;
      }
    }

    if (field === "confirmPassword" && value !== formData.password) {
      errorMsg = `${t("passwordsMismatch")} ${examples.confirmPassword}`;
    }

    if (
      field === "password" &&
      formData.confirmPassword &&
      value !== formData.confirmPassword
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: `${t("passwordsMismatch")} ${examples.confirmPassword}`,
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

    if (field === "role") {
      const selected = userTypeOptions.find((item) => item.value === value);
      setFormData((prev) => ({
        ...prev,
        role: value,
        usertype: selected?.label || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
        newErrors[field] = `${t("invalidField")} ${examples[field] || ""}`;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = `${t("passwordsMismatch")} ${examples.confirmPassword}`;
    }

    if (!formData.isForeign) {
      if (!validateField("fin", formData.fin)) {
        newErrors.fin = `${t("invalidFin")} ${examples.fin}`;
      }
      if (!validateField("idSerial", formData.idSerial)) {
        newErrors.idSerial = `${t("invalidIdSerial")} ${examples.idSerial}`;
      }
    } else {
      if (!validateField("passportId", formData.passportId)) {
        newErrors.passportId = t("invalidPassportId");
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
      multipartData.append("usertype", formData.usertype);
      multipartData.append("organization", formData.organization);
      multipartData.append("position", formData.position);
      multipartData.append("phoneCode", formData.phoneCode);
      multipartData.append("phoneNumber", formData.phoneNumber);
      multipartData.append("address", formData.address);
      multipartData.append(
        "isForeignCitizen",
        formData.isForeign ? "true" : "false"
      );
      multipartData.append("citizenship", formData.citizenship);

      if (formData.isForeign) {
        multipartData.append("passportId", formData.passportId || "");
      } else {
        multipartData.append("fin", formData.fin || "");
        multipartData.append("idSerial", formData.idSerial || "");
      }

      const response = await apiClient.register(multipartData);
      setSuccessMessage(t("registerSuccess"));

      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || t("registerError"));
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field: string) =>
    errorMessages[field] ? "border-red-600 focus:ring-red-600" : "";

  useEffect(() => {
    console.log("🔍 Current formData:", formData);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href={"/"}>
            <div className="back_container">
              <img
                className="back_container_image"
                src="https://www.svgrepo.com/show/509905/dropdown-arrow.svg"
                alt={t("back")}
              />
              <span>{t("back")}</span>
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center">
              <div>
                <Image
                  src={logo}
                  alt="Scientific Journals logo"
                  width={70}
                  height={50}
                  priority
                />
              </div>
              <div className="text-left">
                <p className="ml-2 text-xl font-bold  font-delius">{t("logo_title")}</p>
                <p className="ml-2 text-l text-gray-900">{t("logo_description")}</p>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">{t("register")}</CardTitle>
          <CardDescription>{t("registerDescription")}</CardDescription>
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
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  placeholder={t("firstNamePlaceholder")}
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
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  placeholder={t("lastNamePlaceholder")}
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
                <Label htmlFor="fatherName">{t("fatherName")}</Label>
                <Input
                  id="fatherName"
                  placeholder={t("fatherNamePlaceholder")}
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
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
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
              <Label htmlFor="role">{t("userType")}</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => handleInputChange("role", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {userTypeOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="organization">{t("organization")}</Label>
                <Input
                  id="organization"
                  placeholder={t("organizationPlaceholder")}
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
                <Label htmlFor="position">{t("position")}</Label>
                <Input
                  id="position"
                  placeholder={t("positionPlaceholder")}
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
                <Label htmlFor="phone">{t("phone")}</Label>
                <div className="flex gap-2">
                  <CountrySelect
                    value={formData.phoneCode}
                    onChange={(val) => handleInputChange("phoneCode", val)}
                  />
                  <Input
                    id="phone"
                    placeholder={t("phonePlaceholder")}
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
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  placeholder={t("addressPlaceholder")}
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
                  <Label htmlFor="fin">{t("fin")}</Label>
                  <Input
                    id="fin"
                    placeholder={t("finPlaceholder")}
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
                  <Label htmlFor="idSerial">{t("idSerial")}</Label>
                  <Input
                    id="idSerial"
                    placeholder={t("idSerialPlaceholder")}
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
                  <Label htmlFor="passportId">{t("passportId")}</Label>
                  <Input
                    id="passportId"
                    placeholder={t("passportIdPlaceholder")}
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
                  <Label htmlFor="citizenship">{t("citizenship")}</Label>
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
                  {errorMessages.citizenship && (
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
                {t("notCitizen")}
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
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
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
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
              {isLoading ? t("submitting") : t("register")}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {successMessage && <SuccessModal message={successMessage} />}
    </div>
  );
}
