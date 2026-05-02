import type { AxiosResponse } from 'axios'
import { axiosAuth as axios } from '../axiosInterceptor'
import type { ThreadRecord, TimestampedRecord } from '../types/contracts'

const url = '/api/'

type ThreadCollectionType = 'discussions' | 'reviews'
type ThreadDetailType = 'discussion' | 'review'
type ThreadMutationResponse = AxiosResponse<ThreadRecord | string | Record<string, unknown>>
type GenericResponse = AxiosResponse<unknown>

function normalizeThreadDates<T extends TimestampedRecord>(record: T): T {
  return {
    ...record,
    createdAt: record?.createdAt ? new Date(record.createdAt) : record?.createdAt,
    updatedAt: record?.updatedAt ? new Date(record.updatedAt) : record?.updatedAt,
  }
}

function collectionTypeFor(type: ThreadCollectionType | ThreadDetailType): ThreadCollectionType {
  return type === 'discussion' ? 'discussions' : type === 'review' ? 'reviews' : type
}

class ThreadService {
  static async getDiscussions(): Promise<ThreadRecord[]> {
    return this.getThread('discussions')
  }

  static async getReviews(): Promise<ThreadRecord[]> {
    return this.getThread('reviews')
  }

  static async getThread(type: ThreadCollectionType): Promise<ThreadRecord[]> {
    const res = await axios.get<ThreadRecord[]>(`${url}${type}`)
    const data = res.data ?? []

    return data.map((thread) => normalizeThreadDates(thread))
  }

  static async getDiscussionsById(id: string | number): Promise<ThreadRecord | null> {
    return this.getThreadById('discussions', id)
  }

  static async getReviewsById(id: string | number): Promise<ThreadRecord | null> {
    return this.getThreadById('reviews', id)
  }

  static async getThreadById(
    type: ThreadCollectionType,
    id: string | number
  ): Promise<ThreadRecord | null> {
    const res = await axios.get<ThreadRecord>(`${url}${type}/${id}`)
    const data = res.data

    return data ? normalizeThreadDates(data) : null
  }

  static async getDiscussionsByMedia(mediaType: string, id: string | number): Promise<ThreadRecord[]> {
    return this.getThreadByMedia('discussions', mediaType, id)
  }

  static async getReviewsByMedia(mediaType: string, id: string | number): Promise<ThreadRecord[]> {
    return this.getThreadByMedia('reviews', mediaType, id)
  }

  static async getThreadByMedia(
    type: ThreadCollectionType,
    mediaType: string,
    id: string | number
  ): Promise<ThreadRecord[]> {
    const res = await axios.get<ThreadRecord[]>(`${url}${type}/media/${mediaType}/${id}`)
    const data = res.data ?? []

    return data.map((thread) => normalizeThreadDates(thread))
  }

  static async getDiscussionsByUser(id: string): Promise<ThreadRecord[]> {
    return this.getThreadByUser('discussions', id)
  }

  static async getReviewsByUser(id: string): Promise<ThreadRecord[]> {
    return this.getThreadByUser('reviews', id)
  }

  static async getThreadByUser(type: ThreadCollectionType, id: string): Promise<ThreadRecord[]> {
    const res = await axios.get<ThreadRecord[]>(`${url}${type}/user/${id}`)
    const data = res.data ?? []

    return data.map((thread) => normalizeThreadDates(thread))
  }

  static async createDiscussion(data: Record<string, unknown>): Promise<ThreadMutationResponse | null> {
    try {
      return await axios.post<ThreadRecord | string | Record<string, unknown>>(`${url}discussions`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: ThreadMutationResponse }).response ?? null
    }
  }

  static async createReview(data: Record<string, unknown>): Promise<ThreadMutationResponse | null> {
    try {
      return await axios.post<ThreadRecord | string | Record<string, unknown>>(`${url}reviews`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: ThreadMutationResponse }).response ?? null
    }
  }

  static async updateDiscussion(
    id: string | number,
    data: Record<string, unknown>
  ): Promise<GenericResponse | null> {
    try {
      return await axios.put(`${url}discussions/${id}`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async updateReview(
    id: string | number,
    data: Record<string, unknown>
  ): Promise<GenericResponse | null> {
    try {
      return await axios.put(`${url}reviews/${id}`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async deleteDiscussionById(id: string | number): Promise<GenericResponse | null> {
    try {
      return await axios.delete(`${url}discussions/${id}`)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async deleteReviewById(id: string | number): Promise<GenericResponse | null> {
    try {
      return await axios.delete(`${url}reviews/${id}`)
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async createDiscussionComment(data: Record<string, unknown>): Promise<ThreadMutationResponse | null> {
    try {
      return await axios.post<ThreadRecord | string | Record<string, unknown>>(
        `${url}discussions/comment/add`,
        JSON.stringify(data)
      )
    } catch (err: unknown) {
      return (err as { response?: ThreadMutationResponse }).response ?? null
    }
  }

  static async createReviewComment(data: Record<string, unknown>): Promise<ThreadMutationResponse | null> {
    try {
      return await axios.post<ThreadRecord | string | Record<string, unknown>>(
        `${url}reviews/comment/add`,
        JSON.stringify(data)
      )
    } catch (err: unknown) {
      return (err as { response?: ThreadMutationResponse }).response ?? null
    }
  }

  static async updateDiscussionComment(data: Record<string, unknown>): Promise<GenericResponse | null> {
    try {
      return await axios.put(`${url}discussions/comment/update`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async updateReviewComment(data: Record<string, unknown>): Promise<GenericResponse | null> {
    try {
      return await axios.put(`${url}reviews/comment/update`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async deleteDiscussionComment(data: Record<string, unknown>): Promise<GenericResponse | null> {
    try {
      return await axios.delete(`${url}discussions/comment/delete`, {
        data: JSON.stringify(data),
      })
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }

  static async deleteReviewComment(data: Record<string, unknown>): Promise<GenericResponse | null> {
    try {
      return await axios.delete(`${url}reviews/comment/delete`, {
        data: JSON.stringify(data),
      })
    } catch (err: unknown) {
      return (err as { response?: GenericResponse }).response ?? null
    }
  }
}

export { collectionTypeFor }
export default ThreadService
