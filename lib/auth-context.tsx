"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "./api-client"
import { tokenManager } from "./token-manager"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "client" | "admin" | "superadmin"
  organization?: string
  position?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    const token = tokenManager.getAccessToken()
    if (token && !tokenManager.isTokenExpired(token)) {
      try {
        const userData = await apiClient.getCurrentUser()
        setUser(userData)
      } catch (error) {
        tokenManager.clearTokens()
      }
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)

      if (response.accessToken && response.refreshToken) {
        tokenManager.setTokens(response.accessToken, response.refreshToken)
        setUser(response.user)
        return { success: true, user: response.user }
      }

      return { success: false, error: "Giriş məlumatları yanlışdır" }
    } catch (error: any) {
      return { success: false, error: error.message || "Giriş xətası" }
    }
  }

  const register = async (userData: any) => {
    try {
      await apiClient.register(userData)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Qeydiyyat xətası" }
    }
  }

  const logout = () => {
    tokenManager.clearTokens()
    setUser(null)
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (!refreshToken) return false

      const response = await apiClient.refreshToken(refreshToken)
      if (response.accessToken) {
        tokenManager.setAccessToken(response.accessToken)
        return true
      }
      return false
    } catch (error) {
      tokenManager.clearTokens()
      setUser(null)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
