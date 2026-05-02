import { computed, type ComputedRef } from 'vue'
import TokenService from '../services/TokenService'
import UserService from '../services/UserService'
import bootstrapSession from '../services/sessionBootstrap'
import useTheme from './theme'
import { pinia } from '../stores/pinia'
import { useSessionStore } from '../stores/sessionStore'
import type {
  AppUser,
  DecodedAccessToken,
  SessionUserState,
  ThemeColors,
} from '../types/contracts'

let initializeUserPromise: Promise<AppUser | null> | null = null

function decodeTokenPayload(token: string | null): DecodedAccessToken | null {
  try {
    const payload = token?.split('.')[1]
    if (!payload) return null

    let decoded: DecodedAccessToken | null = null
    if (typeof atob === 'function') {
      decoded = JSON.parse(atob(payload)) as DecodedAccessToken
    } else if (typeof Buffer !== 'undefined') {
      decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as DecodedAccessToken
    }

    if (!decoded) return null
    if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

function setupUserTheme(user: AppUser | null): void {
  const { setTheme, applyTheme } = useTheme()
  const colors = (user?.userPreferences?.themes?.profileTheme ?? null) as ThemeColors | null
  setTheme(colors)
  applyTheme(colors)
}

function setupLocalTheme(): void {
  const { getLocalColors, setTheme, applyTheme } = useTheme()
  const colors = getLocalColors()
  if (!colors) return

  setTheme(colors)
  applyTheme(colors)
}

export interface UseUserApi {
  state: ReturnType<typeof useSessionStore>
  getIsLoggedIn: () => ComputedRef<boolean>
  getIsInitialized: () => ComputedRef<boolean>
  getLoading: () => ComputedRef<boolean>
  getError: () => ComputedRef<string>
  getUser: () => ComputedRef<SessionUserState>
  setUser: (user: AppUser | null) => void
  setIsLoggedIn: (loggedIn: boolean) => void
  setIsInitialized: (initialized: boolean) => void
  setLoading: (loadingStatus: boolean) => void
  setError: (error: string) => void
  decodeJWT: (token: string | null) => DecodedAccessToken | null
  initializeUser: () => Promise<AppUser | null>
  setupUserTheme: (user: AppUser | null) => void
  setupLocalTheme: () => void
}

export default function useUser(): UseUserApi {
  const store = useSessionStore(pinia)

  const setUser = (user: AppUser | null): void => {
    store.setUser(user)
  }

  const setIsLoggedIn = (loggedIn: boolean): void => {
    if (loggedIn) {
      store.isLoggedIn = true
      return
    }

    store.clearUser()
    TokenService.clearTokens()
  }

  const setIsInitialized = (initialized: boolean): void => {
    store.setInitialized(initialized)
  }

  const setLoading = (loadingStatus: boolean): void => {
    store.setLoading(loadingStatus)
  }

  const setError = (error: string): void => {
    store.setError(error)
  }

  const initializeUser = async (): Promise<AppUser | null> => {
    const token = TokenService.getAccessToken()
    if (store.isInitialized && (store.userData.user || !token)) return store.userData.user
    if (initializeUserPromise) return initializeUserPromise

    initializeUserPromise = (async () => {
      store.setLoading(true)
      try {
        return await bootstrapSession({
          getSession: () => UserService.getSession(),
          getUserById: (_id: string) => UserService.getUser(_id),
          decodeTokenPayload,
          getAccessToken: () => TokenService.getAccessToken(),
          setAccessToken: (nextToken: string | null) => TokenService.setAccessToken(nextToken),
          setUser,
          setLoggedOut: () => setIsLoggedIn(false),
          setupUserTheme,
          setupLocalTheme,
        })
      } finally {
        store.setLoading(false)
        store.setInitialized(true)
        initializeUserPromise = null
      }
    })()

    return initializeUserPromise
  }

  return {
    state: store,
    getIsLoggedIn: () => computed(() => store.isLoggedIn),
    getIsInitialized: () => computed(() => store.isInitialized),
    getLoading: () => computed(() => store.loading),
    getError: () => computed(() => store.error),
    getUser: () => computed(() => store.userData),
    setUser,
    setIsLoggedIn,
    setIsInitialized,
    setLoading,
    setError,
    decodeJWT: decodeTokenPayload,
    initializeUser,
    setupUserTheme,
    setupLocalTheme,
  }
}
