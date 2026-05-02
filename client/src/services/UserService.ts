import type { AxiosResponse } from 'axios'
import { axiosAuth as axios } from '../axiosInterceptor'
import type {
  AppUser,
  AuthCredentials,
  HttpResponse,
  PasswordResetRequest,
  PasswordResetSubmission,
  SessionResponse,
  TimestampedRecord,
} from '../types/contracts'

const url = '/api/'

type TimestampedUser = AppUser & TimestampedRecord
type UserResponse = AxiosResponse<AppUser>
type SessionHttpResponse = HttpResponse<SessionResponse>
type GenericResponse = AxiosResponse<Record<string, unknown> | string>

function normalizeUserDates(record: AppUser & TimestampedRecord): TimestampedUser {
  return {
    ...record,
    createdAt: record?.createdAt ? new Date(record.createdAt) : record?.createdAt,
    updatedAt: record?.updatedAt ? new Date(record.updatedAt) : record?.updatedAt,
  }
}

class UserService {
  static async getUsers(): Promise<TimestampedUser[]> {
    const res = await axios.get<AppUser[]>(`${url}user`)
    const data = res.data ?? []

    return data.map((user) => normalizeUserDates(user))
  }

  static async getUser(id: string): Promise<UserResponse | null> {
    try {
      return await axios.get<AppUser>(`${url}user/${id}`)
    } catch (err: unknown) {
      return (err as { response?: UserResponse }).response ?? null
    }
  }

  static async getUserByUsername(username: string): Promise<UserResponse | null> {
    try {
      return await axios.get<AppUser>(`${url}user/username/${username}`)
    } catch (err: unknown) {
      return (err as { response?: UserResponse }).response ?? null
    }
  }

  static async registerUser(data: AuthCredentials): Promise<GenericResponse | null> {
    try {
      return await axios.post<Record<string, unknown> | string>(`${url}register`, data)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async loginUser(data: AuthCredentials): Promise<GenericResponse | null> {
    try {
      return await axios.post<Record<string, unknown> | string>(`${url}login`, data)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async getSession(): Promise<SessionHttpResponse | null> {
    try {
      const response = await axios.get<SessionResponse>(`${url}auth/session`, {
        skipAuth: true,
        skipAuthRefresh: true,
      } as any)

      return {
        status: response.status,
        data: response.data as SessionResponse,
      }
    } catch (err: unknown) {
      const response = (err as { response?: AxiosResponse<SessionResponse> }).response
      return response
        ? {
            status: response.status,
            data: response.data,
          }
        : null
    }
  }

  static async forgotPassword(data: PasswordResetRequest): Promise<GenericResponse | null> {
    try {
      return await axios.post<Record<string, unknown> | string>(`${url}auth/forgot-password`, data)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async resetPassword(data: PasswordResetSubmission): Promise<GenericResponse | null> {
    try {
      return await axios.post<Record<string, unknown> | string>(`${url}auth/reset-password`, data)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async logoutUser(data: Record<string, unknown> = {}): Promise<AxiosResponse<unknown> | null> {
    try {
      return await axios.delete(`${url}auth/session`, { data })
    } catch (err: unknown) {
      return (err as { response?: AxiosResponse<unknown> }).response ?? null
    }
  }

  static async updateUser(
    id: string,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<AppUser | string | Record<string, unknown>> | null> {
    try {
      return await axios.put<AppUser | string | Record<string, unknown>>(`${url}user/${id}`, data)
    } catch (err: unknown) {
      return (err as { response?: AxiosResponse<AppUser | string | Record<string, unknown>> }).response ?? null
    }
  }
}

export default UserService
