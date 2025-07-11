"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { BookOpen, Users, FileText, BarChart3, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useLocale } from "next-intl"



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale();

  const navigation = [
    { name: "Dashboard", href: `/${locale}/admin/dashboard`, icon: BarChart3 },
    { name: "Jurnal əlavə et", href: `/${locale}/admin/category`, icon: Users },
    { name: "Jurnal Nömrələri əlavə et", href: `/${locale}/admin/subcategory`, icon: Users },
    { name: "Global SubCategory", href: `/${locale}/admin/globalsubcategory`, icon: FileText },
    { name: "Məqalələr", href: `/${locale}/admin/articles`, icon: FileText },
    { name: "İstifadəçilər", href: `/${locale}/admin/users`, icon: Users },
    ...(user?.role === "superadmin"
      ? [{ name: "Adminlər", href: `/${locale}/admin/admins`, icon: Users }]
      : []),
    { name: "Xəbərlər", href: `/${locale}/admin/news`, icon: FileText },
  ]

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/auth/login`);
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold">Admin Panel</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
            <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
