"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { countries } from "./CountryCode";
import { useTranslations } from "next-intl";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelect({ value, onChange }: Props) {
  const uniqueCountries = countries.filter(
    (country, index, self) =>
      self.findIndex((c) => c.code === country.code) === index
  );
  const t = useTranslations("MIX")

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={t("Ölkəkoduseçin")} />
      </SelectTrigger>
      <SelectContent>
        {uniqueCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.flag} {country.name} ({country.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
