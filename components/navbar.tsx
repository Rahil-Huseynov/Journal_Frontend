"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Navigation")
  const { user, logout } = useAuth()

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("features"), href: "/#features" },
    { name: t("services"), href: "/#services" },
    { name: t("categories"), href: "/categories" },
    { name: t("about"), href: "/#about" },
    { name: t("contact"), href: "/#contact" },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">ScientificWorks</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href={`/${user.role}/dashboard`}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">{t("login")}</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>{t("register")}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <LanguageSwitcher />
                {user ? (
                  <div className="space-y-2">
                    <Link href={`/${user.role}/dashboard`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)}>
                        {t("login")}
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="w-full" onClick={() => setIsOpen(false)}>
                        {t("register")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
