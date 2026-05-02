class TokenService {
  static accessToken: string | null = null
  static refreshToken: string | null = null

  static canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  static getAccessToken(): string | null {
    if (this.accessToken) {
      return this.accessToken
    }

    if (!this.canUseStorage()) {
      return null
    }

    this.accessToken = localStorage.getItem('access_token')
    return this.accessToken
  }

  static setAccessToken(accessToken: string | null): void {
    this.accessToken = accessToken ?? null
    if (this.canUseStorage()) {
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      } else {
        localStorage.removeItem('access_token')
      }
    }
  }

  static setRefreshToken(refreshToken: string | null): void {
    this.refreshToken = refreshToken ?? null
    if (this.canUseStorage()) {
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      } else {
        localStorage.removeItem('refresh_token')
      }
    }
  }

  static getRefreshToken(): string | null {
    if (this.refreshToken) {
      return this.refreshToken
    }

    if (!this.canUseStorage()) {
      return null
    }

    this.refreshToken = localStorage.getItem('refresh_token')
    return this.refreshToken
  }

  static clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    if (this.canUseStorage()) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }
}

export default TokenService
