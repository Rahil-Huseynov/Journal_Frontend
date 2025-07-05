"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { countries } from "./CountryCode";

interface Props {
  value: string;
  onChange: (countryName: string, isForeign: boolean) => void;
}

export default function CitizenshipCountrySelect({ value, onChange }: Props) {
  const uniqueCountries = countries.filter(
    (country, index, self) =>
      self.findIndex((c) => c.name === country.name) === index
  );

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        const isForeign = val !== "Azerbaijan";
        onChange(val, isForeign);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Vətəndaşlıq ölkənizi seçin" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {uniqueCountries.map((country) => (
          <SelectItem key={country.name} value={country.name}>
            {country.flag} {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
