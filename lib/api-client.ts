import { tokenManager } from "./token-manager"

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "")
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const isFormData = options.body instanceof FormData

    const config: RequestInit = {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    }

    const token = tokenManager.getAccessToken()
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      let response = await fetch(url, config)

      if (response.status === 401 && token) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          const newToken = tokenManager.getAccessToken()
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          }
          response = await fetch(url, config)
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (!refreshToken) return false

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        tokenManager.setAccessToken(data.accessToken)
        return true
      }

      return false
    } catch (error) {
      return false
    }
  }

  async login(email: string, password: string) {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    return this.request("/auth/login", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }

  async register(formData: FormData) {
    return this.request("/auth/user/signup", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }

  async addjournalforUser(formData: FormData) {
    return this.request("/journals/add", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }
  async updateUser(userId: string, formData: FormData) {
    return this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  }

  async getCategories() {
    return this.request("/categories", {
      method: "GET",
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async getUsers(page = 1, limit = 10) {
    return this.request(`/users?page=${page}&limit=${limit}`)
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`)
  }



  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  async getArticles(page = 1, limit = 10) {
    return this.request(`/articles?page=${page}&limit=${limit}`)
  }

  async getArticleById(id: string) {
    return this.request(`/articles/${id}`)
  }

  async createArticle(articleData: any) {
    return this.request("/articles", {
      method: "POST",
      body: JSON.stringify(articleData),
    })
  }

  async updateArticle(id: string, articleData: any) {
    return this.request(`/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(articleData),
    })
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: "DELETE",
    })
  }

  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async checkTokenForgotPassword(token: string) {
    return this.request(`/auth/check-token?token=${token}`, {
      method: "GET",
    });
  }

  deleteUserJournal(id: number) {
    return this.request(`/journals/delete/${id}`, {
      method: "DELETE",
    });
  }

  async updatePassword(formData: FormData) {
    return this.request(`/auth/users/password`, {
      method: "PATCH",
      body: formData,
      headers: {},
    });
  }
  async resetPassword(token: string, newPassword: string) {
    const response = await this.request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return response;
  }


}

export const apiClient = new ApiClient()
