"use client"

export const countries = [
    { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
    { name: "Turkey", code: "+90", flag: "🇹🇷" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Russia", code: "+7", flag: "🇷🇺" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { name: "Iran", code: "+98", flag: "🇮🇷" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
    // ... daha çox ölkə əlavə oluna bilər
]

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface Props {
    value: string
    onChange: (value: string) => void
}

export default function CountrySelect({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Ölkə kodu seçin" />
            </SelectTrigger>
            <SelectContent>
                {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
