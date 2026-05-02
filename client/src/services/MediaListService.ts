import type { AxiosResponse } from 'axios'
import { axiosAuth as axios } from '../axiosInterceptor'
import { mediaConfig } from '../config/mediaTypes'
import type { LibraryEntry, TimestampedRecord } from '../types/contracts'

const url = '/api/media-list/'

type LibraryEntryRecord = LibraryEntry & TimestampedRecord

function normalizeEntryDates<T extends TimestampedRecord>(record: T): T {
  return {
    ...record,
    createdAt: record?.createdAt ? new Date(record.createdAt) : record?.createdAt,
    updatedAt: record?.updatedAt ? new Date(record.updatedAt) : record?.updatedAt,
  }
}

class MediaListService {
  static async getUserMediaList(id: string, mediaType: string | null = 'ANIME'): Promise<LibraryEntryRecord[]> {
    const options = mediaType
      ? {
          params: {
            mediaType: mediaConfig(mediaType).type,
            source: mediaConfig(mediaType).source,
          },
        }
      : {}
    const res = await axios.get<LibraryEntryRecord[]>(`${url}${id}`, options)
    const data = res.data ?? []

    return data.map((mediaList) => normalizeEntryDates(mediaList))
  }

  static async getUserMediaListItem(
    userId: string,
    mediaType: string,
    mediaId: string
  ): Promise<LibraryEntryRecord | null> {
    const config = mediaConfig(mediaType)
    const res = await axios.get<LibraryEntryRecord>(`${url}${userId}/${config.type}/${mediaId}`, {
      params: {
        source: config.source,
      },
    })

    return res.data ? normalizeEntryDates(res.data) : null
  }

  static async createMediaListItem(
    data: Record<string, unknown>
  ): Promise<AxiosResponse<LibraryEntryRecord> | null> {
    try {
      return await axios.post<LibraryEntryRecord>(`${url}`, JSON.stringify(data))
    } catch (err: unknown) {
      return (err as { response?: AxiosResponse<LibraryEntryRecord> }).response ?? null
    }
  }

  static async updateMediaListItem(
    userId: string,
    mediaType: string,
    mediaId: string,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<unknown> | null> {
    try {
      const config = mediaConfig(mediaType)

      return await axios.put(`${url}${userId}/${config.type}/${mediaId}`, JSON.stringify(data), {
        params: {
          source: config.source,
        },
      })
    } catch (err: unknown) {
      return (err as { response?: AxiosResponse<unknown> }).response ?? null
    }
  }

  static async deleteMediaListItem(id: string): Promise<AxiosResponse<unknown> | null> {
    try {
      return await axios.delete(`${url}${id}`)
    } catch (err: unknown) {
      return (err as { response?: AxiosResponse<unknown> }).response ?? null
    }
  }
}

export default MediaListService
