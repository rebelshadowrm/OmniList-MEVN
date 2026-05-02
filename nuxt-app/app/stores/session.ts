import { defineStore } from 'pinia'
import type { AppUser, SessionResponse } from '~/types/api'

type SessionStatus = 'idle' | 'loading' | 'ready' | 'error'

let pendingSession: Promise<AppUser | null> | null = null

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as AppUser | null,
    accessToken: null as string | null,
    status: 'idle' as SessionStatus,
    error: '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async initialize(force = false): Promise<AppUser | null> {
      if (this.status === 'ready' && !force) {
        return this.user
      }

      if (pendingSession && !force) {
        return pendingSession
      }

      this.status = 'loading'
      this.error = ''

      pendingSession = (async () => {
        try {
          const requestFetch = import.meta.server ? useRequestFetch() : $fetch
          const session = await requestFetch<SessionResponse>('/api/auth/session', {
            credentials: 'include',
          })

          this.user = session?.user ?? null
          this.accessToken = session?.accessToken ?? null
          this.status = 'ready'
          return this.user
        } catch (error) {
          this.user = null
          this.accessToken = null
          this.status = 'error'
          this.error = error instanceof Error ? error.message : 'Session bootstrap failed.'
          return null
        } finally {
          pendingSession = null
        }
      })()

      return pendingSession
    },
    async login(payload: { email: string; password: string }): Promise<{ ok: boolean; message: string }> {
      this.status = 'loading'
      this.error = ''

      try {
        await $fetch('/api/login', {
          method: 'POST',
          body: payload,
          credentials: 'include',
        })

        await this.initialize(true)
        return { ok: true, message: '' }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed.'
        this.status = 'error'
        this.error = message
        return { ok: false, message }
      }
    },
    async logout(): Promise<void> {
      try {
        await $fetch('/api/auth/session', {
          method: 'DELETE',
          credentials: 'include',
        })
      } finally {
        this.user = null
        this.accessToken = null
        this.status = 'ready'
        this.error = ''
      }
    },
  },
})
