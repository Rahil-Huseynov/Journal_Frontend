"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import CountrySelect from "@/components/CountryCodeSelect";

export default function SettingsPage() {
    const { user } = useAuth() as { user: any };

    if (!user) {
        return <p>Yüklənir...</p>;
    }
    const [formData, setFormData] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fatherName: user.fatherName || "",
        email: user.email || "",
        phoneCode: user.phoneCode || "",
        phoneNumber: user.phoneNumber || "",
        organization: user.organization || "",
        position: user.position || "",
        address: user.address || "",
        idSerial: user.idSerial || "",
        passportId: user.passportId || "",
        isForeignCitizen: user.isForeignCitizen || false,
    });

    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const finEmpty = !user.fin;
    const idSerialEmpty = !user.idSerial;
    const hasPassport = !!user.passportId;

    const showForeignCitizenSelect = finEmpty && idSerialEmpty && !hasPassport;

    const finAndIdSerialReadOnly = hasPassport;

    const passportRequired = finEmpty && idSerialEmpty;

    const validateField = (field: string, value: string | boolean) => {
        if (field === "passportId" && passportRequired) {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                return "Pasport nömrəsi doldurulmalıdır.";
            }
        }
        if (
            ["firstName", "lastName", "email", "phoneCode", "phoneNumber"].includes(field) &&
            typeof value === "string" &&
            value.trim() === ""
        ) {
            return `${field} boş ola bilməz.`;
        }
        return "";
    };

    const validateAll = () => {
        const errors: { [key: string]: string } = {};
        for (const [key, val] of Object.entries(formData)) {
            const err = validateField(key, val);
            if (err) errors[key] = err;
        }
        return errors;
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errorMessages[field]) {
            setErrorMessages((prev) => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSuccessMessage(null);
        setErrorMessages({});
        const errors = validateAll();
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        if (!user?.id) {
            setErrorMessages({ general: "İstifadəçi ID-si tapılmadı. Yenidən daxil olun." });
            return;
        }

        try {
            setLoading(true);
            const fd = new FormData();

            Object.entries(formData).forEach(([key, val]) => {
                if (val !== null && val !== undefined && val !== "") {
                    if (typeof val === "boolean") {
                        fd.append(key, val ? "true" : "false");
                    } else {
                        fd.append(key, val.toString());
                    }
                }
            });

            await apiClient.updateUser(user.id.toString(), fd);
            setSuccessMessage("Məlumatlar uğurla yeniləndi.");
        } catch (error) {
            setErrorMessages({ general: "Xəta baş verdi. Yenidən cəhd edin." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto p-8 space-y-12 bg-white rounded-xl shadow-lg">
            <Card className="shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-4xl font-extrabold text-indigo-800 mb-6">İstifadəçi Məlumatları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="fin" className="font-semibold mb-1 block text-gray-700">
                                FİN kodu
                            </Label>
                            <Input
                                id="fin"
                                value={user.fin || ""}
                                readOnly
                                disabled
                                className="bg-gray-100 cursor-not-allowed border-gray-300"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <Label htmlFor="idSerial" className="font-semibold mb-1 block text-gray-700">
                                Şəxsiyyət vəsiqəsinin seriya nömrəsi
                            </Label>
                            <Input
                                id="idSerial"
                                value={formData.idSerial}
                                onChange={(e) => !finAndIdSerialReadOnly && handleChange("idSerial", e.target.value)}
                                placeholder="Nümunə: AA1234567"
                                maxLength={9}
                                readOnly={finAndIdSerialReadOnly}
                                disabled={finAndIdSerialReadOnly}
                                className={`rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 ${finAndIdSerialReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                                    }`}
                            />
                            {errorMessages.idSerial && <p className="text-red-600 text-sm mt-1">{errorMessages.idSerial}</p>}
                        </div>

                        {(hasPassport || showForeignCitizenSelect) && (
                            <div>
                                <Label htmlFor="passportId" className="font-semibold mb-1 block text-gray-700">
                                    Pasport nömrəsi
                                </Label>
                                <Input
                                    id="passportId"
                                    value={formData.passportId}
                                    onChange={(e) => handleChange("passportId", e.target.value)}
                                    placeholder="Nümunə: AZ1234567"
                                    maxLength={20}
                                    required={passportRequired}
                                    className={`rounded-md shadow-sm border-gray-300 focus:ring-indigo-500 ${errorMessages.passportId ? "border-red-600 focus:ring-red-600" : ""
                                        }`}
                                />
                                {errorMessages.passportId && <p className="text-red-600 text-sm mt-1">{errorMessages.passportId}</p>}
                            </div>
                        )}

                        {showForeignCitizenSelect && (
                            <div className="flex items-center space-x-2 mt-4 md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="isForeignCitizen"
                                    checked={formData.isForeignCitizen}
                                    onChange={(e) => handleChange("isForeignCitizen", e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="isForeignCitizen" className="cursor-pointer">
                                    Xarici vətəndaşam
                                </Label>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="firstName" className="font-semibold mb-1 block text-gray-700">
                                Ad
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                placeholder="Nümunə: Ayxan"
                                maxLength={30}
                                className={`rounded-md shadow-sm ${errorMessages.firstName ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-indigo-500"}`}
                            />
                            {errorMessages.firstName && <p className="text-red-600 text-sm mt-1">{errorMessages.firstName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="lastName" className="font-semibold mb-1 block text-gray-700">
                                Soyad
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                placeholder="Nümunə: Məmmədov"
                                maxLength={30}
                                className={`rounded-md shadow-sm ${errorMessages.lastName ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-indigo-500"}`}
                            />
                            {errorMessages.lastName && <p className="text-red-600 text-sm mt-1">{errorMessages.lastName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="fatherName" className="font-semibold mb-1 block text-gray-700">
                                Ata adı
                            </Label>
                            <Input
                                id="fatherName"
                                value={formData.fatherName}
                                onChange={(e) => handleChange("fatherName", e.target.value)}
                                placeholder="Nümunə: Hüseyn"
                                maxLength={30}
                                className={`rounded-md shadow-sm ${errorMessages.fatherName ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-indigo-500"}`}
                            />
                            {errorMessages.fatherName && <p className="text-red-600 text-sm mt-1">{errorMessages.fatherName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="font-semibold mb-1 block text-gray-700">
                                E-poçt
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="Nümunə: example@email.com"
                                className={`rounded-md shadow-sm ${errorMessages.email ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-indigo-500"}`}
                            />
                            {errorMessages.email && <p className="text-red-600 text-sm mt-1">{errorMessages.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="font-semibold block text-gray-700">Mobil nömrə</Label>
                            <div className="flex gap-2">
                                <CountrySelect value={formData.phoneCode} onChange={(val) => handleChange("phoneCode", val)} />
                                <Input
                                    id="phoneNumber"
                                    placeholder="Nümunə: 501234567"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                    maxLength={15}
                                    className={`flex-grow rounded-md shadow-sm ${errorMessages.phoneNumber ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-indigo-500"}`}
                                />
                            </div>
                            {(errorMessages.phoneCode || errorMessages.phoneNumber) && (
                                <p className="text-red-600 text-sm mt-1">{errorMessages.phoneCode || errorMessages.phoneNumber}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="organization" className="font-semibold mb-1 block text-gray-700">
                                Təşkilat
                            </Label>
                            <Input
                                id="organization"
                                value={formData.organization || ""}
                                onChange={(e) => handleChange("organization", e.target.value)}
                                placeholder="Nümunə: Bakı Dövlət Universiteti"
                                className="rounded-md shadow-sm border-gray-300 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="position" className="font-semibold mb-1 block text-gray-700">
                                Vəzifə
                            </Label>
                            <Input
                                id="position"
                                value={formData.position || ""}
                                onChange={(e) => handleChange("position", e.target.value)}
                                placeholder="Nümunə: Tədqiqatçı"
                                className="rounded-md shadow-sm border-gray-300 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="address" className="font-semibold mb-1 block text-gray-700">
                                Ünvan
                            </Label>
                            <Input
                                id="address"
                                value={formData.address || ""}
                                onChange={(e) => handleChange("address", e.target.value)}
                                placeholder="Nümunə: Bakı, Nəsimi rayonu"
                                className="rounded-md shadow-sm border-gray-300 focus:ring-indigo-500"
                            />
                        </div>

                        {errorMessages.general && (
                            <p className="text-red-600 text-center mt-6 col-span-2">{errorMessages.general}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-8 w-full md:w-48 mx-auto block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition col-span-2"
                        >
                            {loading ? "Yüklənir..." : "Məlumatları Yenilə"}
                        </Button>

                        {successMessage && (
                            <p className="text-green-600 mt-6 text-center font-semibold col-span-2">{successMessage}</p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
