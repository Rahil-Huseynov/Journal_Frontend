"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useTranslations } from "next-intl"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  usertype: string
  organization?: string
  position?: string
  createdAt: string
  isActive: boolean
  fatherName?: string
  address?: string
  citizenship?: string
  phoneCode?: string
  idSerial?: string
  fin?: string
  passportId?: string
  phoneNumber?: string
  isForeignCitizen?: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const t = useTranslations("Admin_Users")

  useEffect(() => {
    loadUsers(currentPage)
  }, [currentPage])

  const loadUsers = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await apiClient.getUsers(page, pageSize)
      setUsers(response.users || [])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("Title")}</h1>
          <p className="text-gray-600">{t("Subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("CardTitle")}</CardTitle>
          <CardDescription>{t("CardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("SearchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("Table.NameSurname")}</TableHead>
                    <TableHead className="text-center">{t("Table.Email")}</TableHead>
                    <TableHead className="text-center">{t("Table.Citizenship")}</TableHead>
                    <TableHead className="text-center">{t("Table.Organization")}</TableHead>
                    <TableHead className="text-center">{t("Table.RegisterDate")}</TableHead>
                    <TableHead className="text-center">{t("Table.Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">{user.firstName} {user.lastName}</TableCell>
                      <TableCell className="text-center">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge>{user.citizenship}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{user.organization}</TableCell>
                      <TableCell className="text-center">
                        {new Date(user.createdAt).toLocaleString("az-Latn-AZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Baku",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <span className="sr-only">{t("Actions.OpenMenu")}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openUserDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("Actions.View")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t("Pagination.Previous")}
                </Button>
                <div className="text-sm text-gray-600 mt-2">
                  {t("Pagination.Page")} {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("Pagination.Next")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.firstName} {selectedUser.lastName}</DialogTitle>
              <DialogDescription>{t("Modal.Description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-1 text-sm">
              <p><strong>{t("Modal.Email")}:</strong> {selectedUser.email}</p>
              <p><strong>{t("Modal.Role")}:</strong> {selectedUser.usertype}</p>
              <p><strong>{t("Modal.Organization")}:</strong> {selectedUser.organization || t("Modal.None")}</p>
              <p><strong>{t("Modal.Position")}:</strong> {selectedUser.position || t("Modal.None")}</p>
              <p><strong>{t("Modal.FIN")}:</strong> {selectedUser.fin || t("Modal.None")}</p>
              <p><strong>{t("Modal.Serial")}:</strong> {selectedUser.idSerial || t("Modal.None")}</p>
              <p><strong>{t("Modal.Phone")}:</strong> {selectedUser.phoneCode || ""} {selectedUser.phoneNumber || t("Modal.None")}</p>
              <p><strong>{t("Modal.Address")}:</strong> {selectedUser.address || t("Modal.None")}</p>
              <p>
                <strong>{t("Modal.Register")}:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleString("az-Latn-AZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Baku",
                })}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
