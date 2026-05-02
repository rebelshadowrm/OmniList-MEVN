export interface AppUser {
  _id?: string
  userName?: string
  email?: string
  status?: string
  role?: string
  img?: string
}

export interface SessionResponse {
  user: AppUser | null
  accessToken: string | null
}

export interface MediaTitle {
  english?: string | null
  romaji?: string | null
  native?: string | null
  userPreferred?: string | null
}

export interface MediaImage {
  large?: string | null
}

export interface NextAiringEpisode {
  episode?: number | null
  airingAt?: number | null
}

export interface CatalogSummary {
  id: string
  mediaType?: string
  title?: MediaTitle
  description?: string | null
  coverImage?: MediaImage
  bannerImage?: string | null
  averageScore?: number | null
  progressDisplay?: string | null
  genres?: string[]
  nextAiringEpisode?: NextAiringEpisode | null
}

export type CatalogDomain = 'ANIME' | 'MANGA' | 'MOVIE' | 'TV' | 'BOOK'
