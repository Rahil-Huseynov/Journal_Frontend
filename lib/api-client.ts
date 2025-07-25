import { id } from "date-fns/locale";
import { tokenManager } from "./token-manager"

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL as string;
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

  async getlogs(page: number, limit: number) {
    return this.request(`/logs?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async addjournalforUser(formData: FormData, lang: string) {
    const response = await this.request("/journals/add", {
      method: "POST",
      body: formData,
      headers: {
        'Accept-Language': lang,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error');
    }

    return response.json();
  }

  async updateJournalStatus(id: number, status: string, reason?: string) {
    return this.request(`/journals/update-status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
  }

  async updateUser(userId: string, formData: FormData) {
    return this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  }

  async addcategory(formData: FormData) {
    return this.request("/categories/add", {
      method: "POST",
      body: formData,
      headers: {}
    })

  }
  async addAuthor(data: any) {
    return this.request('/author', {
      method: 'POST',
      body: data,
    });
  }

  async getCategoryById(id: number) {
    return this.request(`/categories/${id}`, {
      method: 'GET',
    })
  }

  async getNews() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`);
    if (!res.ok) throw new Error("Xəbərləri yükləmək mümkün olmadı");
    return res.json();
  }

  async getNewsById(id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`);
    if (!res.ok) throw new Error("Xəbər tapılmadı");
    return res.json();
  }



  async getAuthor() {
    return this.request('/author', {
      method: 'GET',
    });
  }


  async deletecategory(id: number) {
    return this.request(`/categories/${id}`, {
      method: "delete",
    })

  }


  async deleteAuthor(id: number) {
    return this.request(`/author/${id}`, {
      method: "delete",
    })
  }

  async updateAuthor(id: number, formData: FormData) {
    return this.request(`/author/${id}`, {
      method: 'PUT',
      body: formData
    });
  }

  async getAdmins(currentPage: number, searchTerm: string) {
    const query = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
      search: searchTerm.trim(),
    });

    return this.request(`/auth/admins?${query.toString()}`, {
      method: "GET",
    });
  }



  async deleteAdmin(userId: string) {
    return this.request(`/auth/admin/${userId}`, {
      method: "delete",
    })

  }

  async addAdmin(formData: FormData) {
    return this.request(`/auth/admin/signup`, {
      method: "POST",
      body: formData,

    })

  }

  async updateAdmin(editAdmin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password?: string;
  }) {
    const { id, ...data } = editAdmin;

    if (!data.password) {
      delete data.password;
    }

    return this.request(`/auth/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async updatecategory(formData: FormData, id: number) {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: formData,
    })

  }

  async getCategories() {
    return this.request("/categories", {
      method: "GET",
    })
  }

  async getSubCategories() {
    return this.request("/subcategories", {
      method: "GET",
    })
  }

  async addSubCategories(formData: FormData) {
    return this.request(`/subcategories/add`, {
      method: "POST",
      body: formData,
    })

  }

  async deleteSubCategory(id: number) {
    return this.request(`/subcategories/${id}`, {
      method: "DELETE",
    })

  }

  async updateGlobalCategory(id: number, formData: FormData) {
    return this.request(`/globalsubcategory/${id}`, {
      method: "PUT",
      body: formData,
    });
  }


  async deleteGlobalCategory(id: number) {
    return this.request(`/globalsubcategory/${id}`, {
      method: "DELETE",
    });
  }

  async updateSubCategories(formData: FormData, id: number) {
    return this.request(`/subcategories/update/${id}`, {
      method: "PUT",
      body: formData,
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }


  async createMessage(data: { problems: string; userJournalId: number }) {
    return this.request("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  async getUserFilterJournals(filter: { status?: string; subCategoryId?: number }) {
    const queryParams = new URLSearchParams();

    if (filter.status) queryParams.append("status", filter.status);
    if (filter.subCategoryId !== undefined) queryParams.append("subCategoryId", String(filter.subCategoryId));

    return this.request(`/journals/filter?${queryParams.toString()}`, {
      method: "GET",
    });
  }

  async updateJournalOrder(id: number, order: number) {
    return this.request(`/journals/${id}/order`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async getUsers(page = 1, limit = 10) {
    return this.request(`/auth/users?page=${page}&limit=${limit}`)
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


  async createGlobalCategory(formData: FormData) {
    return this.request("/globalsubcategory", {
      method: "POST",
      body: formData,
    })
  }

  async getGlobalSubCategories() {
    return this.request("/globalsubcategory", { method: "GET" });
  }

  async getGlobalSubCategoriesfilter(id: number) {
    return this.request(`/globalsubcategory/${id}`, { method: "GET" });
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
    return this.request("/auth/admin/statistics", {
      method: "GET",
    })
  }

  async addnews(data: any) {
    return this.request("/news", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }


  async addnewsImage(formData: FormData) {
    return this.request("/news-images", {
      method: 'POST',
      body: formData,
    })
  }

  async deletenews(id: number) {
    return this.request(`/news/${id}`, {
      method: "DELETE",
    })
  }

  async deletenewsImage(id: number) {
    return this.request(`/news-images/${id}`, {
      method: "DELETE",
    })
  }


  async updatenewsImage(id: number, formData: FormData) {
    return this.request(`/news-images/${id}`, {
      method: "PUT",
      body: formData
    })
  }
  async updatenews(id: number, formData: FormData) {
    return this.request(`/news/${id}`, {
      method: "PUT",
      body: formData,
    });
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

  async updateUserJournal(id: number, formData: FormData) {
    return this.request(`/journals/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  }

  async updateUserJournalDemo(id: number, formData: FormData) {
    return this.request(`/journals/approve/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
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
