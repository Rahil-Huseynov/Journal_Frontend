"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/lib/api-client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Auth");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    if (!token) {
      router.replace(`/${locale}/auth/login`);
      return;
    }

    async function checkToken() {
      try {
        const res = await apiClient.checkTokenForgotPassword(token);

        if (!res.valid) {
          router.replace(`/${locale}/auth/login`);
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        router.replace(`/${locale}/auth/login`);
      }
    }

    if (token) {
      checkToken();
    }
  }, [token, router, locale]);

  if (tokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center text-lg text-gray-600">Yoxlanılır...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!passwordRegex.test(newPassword)) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setLoading(true);

    try {
      const data = await apiClient.resetPassword(token, newPassword);

      setMessage(data.message || "Şifrə uğurla dəyişdirildi.");
      setNewPassword("");
      setTimeout(() => {
        window.location.href = `/${locale}/auth/login`;
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-lg shadow-lg border border-gray-300 bg-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
            <span className="ml-3 text-3xl font-bold text-gray-900">
              ScientificWorks
            </span>
          </div>
          <CardTitle className="text-3xl font-semibold mb-2">
            Yeni şifrə təyin edin
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Ən az 8 simvol, böyük, kiçik hərf, rəqəm və xüsusi simvol daxil olun
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="rounded-md bg-green-100 text-green-800">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Yeni şifrə
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Yeni şifrə"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setIsValid(passwordRegex.test(e.target.value));
                  }}
                  required
                  className={`${!isValid ? "border-red-500 focus:ring-red-500" : ""} pr-10`} // sağ tərəfə boşluq əlavə edirik
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isValid && (
                <p className="text-red-600 text-xs mt-1">
                  Şifrə ən az 8 simvol olmalı, böyük hərf, kiçik hərf, rəqəm və
                  xüsusi simvol içerməlidir.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 px-6 pb-6">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Yüklənir..." : "Şifrəni dəyişdir"}
            </Button>

            <Link
              href={`/${locale}/auth/login`}
              className="text-center text-sm text-blue-600 hover:underline"
            >
              Girişə qayıt
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
