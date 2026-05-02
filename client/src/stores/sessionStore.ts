import { defineStore } from 'pinia'
import type { AppUser, SessionUserState } from '../types/contracts'

interface SessionState {
  userData: SessionUserState
  isLoggedIn: boolean
  isInitialized: boolean
  loading: boolean
  error: string
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    userData: {
      user: null,
    },
    isLoggedIn: false,
    isInitialized: false,
    loading: false,
    error: '',
  }),
  actions: {
    setUser(user: AppUser | null) {
      this.userData.user = user
      this.isLoggedIn = !!user
      this.isInitialized = true
      if (!user) {
        this.error = ''
      }
    },
    clearUser() {
      this.userData.user = null
      this.isLoggedIn = false
      this.isInitialized = true
    },
    setLoading(value: boolean) {
      this.loading = value
    },
    setInitialized(value: boolean) {
      this.isInitialized = value
    },
    setError(value: string) {
      this.error = value ?? ''
    },
  },
})
