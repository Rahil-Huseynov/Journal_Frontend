"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import logo from '../../../../public/favicon.png'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("Auth");
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await apiClient.forgotPassword(email);
      setMessage(t("passwordResetLinkSent"));
    } catch (err: any) {
      setError(err.message || t("errorOccurredTryAgain"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div  className="flex justify-center items-center">
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
          <CardTitle className="pt-6 text-xl">{t("resetPassword")}</CardTitle>
          <CardDescription>{t("enterEmailToReset")}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                {t("email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("sending") : t("sendResetLink")}
            </Button>

            <Link
              href={`/${locale}/auth/login`}
              className="flex items-center justify-center text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToLogin")}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
