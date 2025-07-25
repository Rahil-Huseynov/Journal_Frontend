"use client"

import type React from "react"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, User, BarChart3, Settings, LogOut, Menu, X, PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale();
  const t = useTranslations("Navigation_Client");

  const navigation = [
    { name: t("Dashboard"), href: `/${locale}/client/dashboard`, icon: BarChart3 },
    { name: t("MyArticles"), href: `/${locale}/client/myarticles`, icon: FileText },
    { name: t("NewArticle"), href: `/${locale}/client/addarticles/`, icon: PlusCircle },
    { name: t("Profile"), href: `/${locale}/client/profile`, icon: User },
    { name: t("Settings"), href: `/${locale}/client/settings`, icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/auth/login`);
  };


  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold">Tədqiqatçı Panel</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-green-100 text-green-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-4">
              <BookOpen className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold">Tədqiqatçı Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-green-100 text-green-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500">Xoş gəlmisiniz, </span>
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıxış
                </Button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
