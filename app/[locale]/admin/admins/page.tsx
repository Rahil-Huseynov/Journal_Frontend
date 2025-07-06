"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
}

export default function AdminsPage() {
  const [users, setUsers] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEditSubmit, setLoadingEditSubmit] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, currentPage]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const { users, totalPages } = await apiClient.getAdmins(currentPage, searchTerm);
      setUsers(users);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Bu admini silmək istədiyinizə əminsiniz?")) {
      try {
        await apiClient.deleteAdmin(userId)
        await loadUsers();
      } catch (error) {
        console.error("Failed to delete admin:", error);
      }
    }
  };


  const openEditModal = (admin: Admin) => {
    setEditAdmin(admin);
    setIsEditModalOpen(true);
    setMessage(null);
  };

  const handleNewAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editAdmin) {
      setEditAdmin({ ...editAdmin, [name]: value });
    }
  };

  const handleSubmitNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.entries(newAdmin).forEach(([key, value]) =>
        formData.append(key, value)
      );

      await apiClient.addAdmin(formData)

      setMessage("✅ Admin uğurla əlavə olundu!");
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "", role: "admin" });
      setIsModalOpen(false);
      loadUsers();
    } catch (error: any) {
      setMessage("❌ Xəta baş verdi: " + (error.message || error.toString()));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmitEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;
    setLoadingEditSubmit(true);
    setMessage(null);

    try {
      await apiClient.updateAdmin(editAdmin);

      setMessage("✅ Admin uğurla redaktə olundu!");
      setIsEditModalOpen(false);
      setEditAdmin(null);
      loadUsers();
    } catch (error: any) {
      setMessage("❌ Xəta baş verdi: " + error.message);
    } finally {
      setLoadingEditSubmit(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage(null);
    setLoadingSubmit(false);
    setNewAdmin({ firstName: "", lastName: "", email: "", password: "", role: "admin" });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adminlər</h1>
          <p className="text-gray-600">Sistem adminlərini idarə edin</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Yeni admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Siyahısı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İstifadəçi axtarın..."
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Ad Soyad</TableHead>
                  <TableHead className="text-center">E-poçt</TableHead>
                  <TableHead className="text-center">Rol</TableHead>
                  <TableHead className="text-center">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="text-center">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell className="text-center">{admin.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getRoleBadgeColor(admin.role)}>
                        {getRoleText(admin.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditModal(admin)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Redaktə et
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(admin.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Əvvəlki
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Sonrakı
          </Button>
        </div>
      )}

      {isModalOpen && (
        <AdminModal
          admin={newAdmin}
          onChange={handleNewAdminChange}
          onClose={closeModal}
          onSubmit={handleSubmitNewAdmin}
          loading={loadingSubmit}
          title="Yeni Admin Əlavə Et"
          message={message}
        />
      )}

      {isEditModalOpen && editAdmin && (
        <AdminModal
          admin={editAdmin}
          onChange={handleEditAdminChange}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditAdmin(null);
            setMessage(null);
          }}
          onSubmit={handleSubmitEditAdmin}
          loading={loadingEditSubmit}
          title="Admin Redaktə Et"
          message={message}
        />
      )}
    </div>
  );
}

function AdminModal({
  admin,
  onChange,
  onClose,
  onSubmit,
  loading,
  title,
  message,
}: {
  admin: any;
  onChange: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  title: string;
  message: string | null;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block mb-1 font-medium" htmlFor="firstName">
              Ad
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={admin.firstName}
              onChange={onChange}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="lastName">
              Soyad
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={admin.lastName}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">
              E-poçt
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={admin.email}
              onChange={onChange}
              required
            />
          </div>
          {"password" in admin && (
            <div>
              <label className="block mb-1 font-medium" htmlFor="password">
                Şifrə {admin.id ? "(istəyə bağlı)" : ""}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={admin.password || ""}
                onChange={onChange}
                minLength={6}
                {...(admin.id ? {} : { required: true })}
                placeholder={admin.id ? "Şifrəni dəyişmək üçün daxil edin" : ""}
              />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={admin.role}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md h-10 px-2"
              required
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          {message && (
            <p
              className={`text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Ləğv et
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Göndərilir..." : "Təsdiq et"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
