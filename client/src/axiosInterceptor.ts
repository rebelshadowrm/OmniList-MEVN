import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import TokenService from './services/TokenService'

type SubscriberCallback = (accessToken: string) => void
type RefreshResponse = {
  accessToken?: string | null
}
type AuthAxiosRequestConfig = AxiosRequestConfig & {
  skipAuth?: boolean
  skipAuthRefresh?: boolean
}

export const axiosAuth: AxiosInstance = axios.create()
axiosAuth.defaults.withCredentials = true

axiosAuth.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const authConfig = config as AuthAxiosRequestConfig
    const token = TokenService.getAccessToken()
    const headers = (config.headers ?? {}) as Record<string, string>

    if (!authConfig.skipAuth && token) {
      headers.Authorization = `Bearer ${token}`
    }

    headers['Content-Type'] = 'application/json'
    config.headers = headers
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosAuth.interceptors.response.use(
  async (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const authConfig = error?.config as AuthAxiosRequestConfig | undefined
    if (authConfig?.skipAuthRefresh) {
      return Promise.reject(error)
    }

    if (error.response?.status === 403) {
      const retry = await resetTokenAndReattemptRequest(error)
      return retry
    }

    return Promise.reject(error)
  }
)

let isAlreadyFetchingAccessToken = false
let subscribers: SubscriberCallback[] = []

async function resetTokenAndReattemptRequest(error: AxiosError): Promise<AxiosResponse> {
  try {
    const originalConfig = error.config
    if (!originalConfig) {
      return Promise.reject(error)
    }

    const retryOriginalRequest = new Promise<AxiosResponse>((resolve, reject) => {
      addSubscriber((accessToken: string) => {
        const headers = (originalConfig.headers ?? {}) as Record<string, string>
        headers.Authorization = `Bearer ${accessToken}`
        originalConfig.headers = headers
        axios(originalConfig as AxiosRequestConfig)
          .then(resolve)
          .catch(reject)
      })
    })

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true

      const response = await axios.post<RefreshResponse>(
        '/api/refresh',
        undefined,
        { withCredentials: true }
      )

      const newToken = response.data?.accessToken ?? null
      if (!newToken) {
        TokenService.clearTokens()
        isAlreadyFetchingAccessToken = false
        subscribers = []
        return Promise.reject(error)
      }

      TokenService.setAccessToken(newToken)
      isAlreadyFetchingAccessToken = false
      onAccessTokenFetched(newToken)
    }

    return retryOriginalRequest
  } catch (err) {
    TokenService.clearTokens()
    isAlreadyFetchingAccessToken = false
    subscribers = []
    return Promise.reject(err)
  }
}

function onAccessTokenFetched(accessToken: string): void {
  subscribers.forEach((callback) => callback(accessToken))
  subscribers = []
}

function addSubscriber(callback: SubscriberCallback): void {
  subscribers.push(callback)
}
