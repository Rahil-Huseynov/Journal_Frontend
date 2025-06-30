"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"

const languages = [
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

 const handleLanguageChange = (newLocale: string) => {
  // URL-dən cari locale hissəsini sil və yeni locale əlavə et
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  router.push(`/${newLocale}${pathWithoutLocale}`)
  router.refresh()  
}

  const currentLanguage = languages.find((lang) => lang.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.flag} {currentLanguage?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? "bg-gray-100" : ""}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
