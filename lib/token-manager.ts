interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

class TokenManager {
  private readonly ACCESS_TOKEN_KEY = "access_token"
  private readonly REFRESH_TOKEN_KEY = "refresh_token"
  private readonly EXPIRES_AT_KEY = "expires_at"

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return

    const payload = this.decodeJWT(accessToken)
    const expiresAt = payload.exp * 1000

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString())
  }

  setAccessToken(accessToken: string) {
    if (typeof window === "undefined") return

    const payload = this.decodeJWT(accessToken)
    const expiresAt = payload.exp * 1000

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString())
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  clearTokens() {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJWT(token)
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  getTokenExpirationTime(): number | null {
    if (typeof window === "undefined") return null

    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    return expiresAt ? Number.parseInt(expiresAt) : null
  }

  isTokenExpiringSoon(minutesThreshold = 5): boolean {
    const expiresAt = this.getTokenExpirationTime()
    if (!expiresAt) return true

    const currentTime = Date.now()
    const thresholdTime = minutesThreshold * 60 * 1000

    return expiresAt - currentTime < thresholdTime
  }

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error("Invalid token format")
    }
  }
}

export const tokenManager = new TokenManager()