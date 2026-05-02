export type CatalogDomain =
  | 'ANIME'
  | 'MANGA'
  | 'MOVIE'
  | 'TV'
  | 'BOOK'
  | 'GAME'
  | 'VN'
  | 'AVN'

export type ProviderId =
  | 'ANILIST'
  | 'TMDB'
  | 'OPENLIBRARY'
  | 'IGDB'
  | 'VNDB'
  | 'F95'
  | 'CURATED'

export interface EntityRef {
  provider: ProviderId | string
  domain: CatalogDomain | string
  externalId: string
  key: string
}

export interface ThemeColors {
  mode?: string
  paletteMode?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  [key: string]: unknown
}

export interface HomePreferences {
  style?: string
  interests?: Record<string, string>
  updatedAt?: string
  [key: string]: unknown
}

export interface MediaTitle {
  english?: string | null
  romaji?: string | null
  native?: string | null
  userPreferred?: string | null
}

export interface MediaImageSet {
  large?: string
  medium?: string
}

export interface NextAiringEpisode {
  episode?: number | null
  airingAt?: number | null
}

export interface CatalogRating {
  average: number | null
  count: number
  scale: 5 | 10 | 100
  source: 'OMNILIST' | 'OPENLIBRARY' | 'ANILIST' | 'TMDB' | 'NONE' | string
}

export interface CatalogSummary {
  id: string
  mediaType?: CatalogDomain | string
  source?: ProviderId | string
  entityRef?: EntityRef | null
  title?: MediaTitle
  coverImage?: MediaImageSet
  bannerImage?: string
  description?: string
  genres?: string[]
  averageScore?: number | null
  rating?: CatalogRating
  providerRating?: CatalogRating
  communityRating?: CatalogRating
  popularity?: number | null
  progressTotal?: number | null
  progressDisplay?: string | null
  nextAiringEpisode?: NextAiringEpisode | null
  format?: string | null
  [key: string]: unknown
}

export interface CatalogDetail extends CatalogSummary {
  startDate?: Record<string, unknown> | null
  endDate?: Record<string, unknown> | null
  status?: string | null
  season?: string | null
  favourites?: number | null
  meanScore?: number | null
  sourceMaterial?: string | null
  countryOfOrigin?: string | null
  hashtag?: string | null
  duration?: number | null
  synonyms?: string[]
  tags?: Array<Record<string, unknown>>
  externalLinks?: Array<Record<string, unknown>>
  studios?: Record<string, unknown>
  characters?: Record<string, unknown>
  staff?: Record<string, unknown>
  mediaFacts?: Array<Record<string, unknown>>
}

export interface LibraryEntry {
  _id?: string
  mediaId?: number | string
  animeId?: number | string
  mediaType?: CatalogDomain | string
  source?: ProviderId | string
  sourceId?: string
  externalId?: string
  entityRef?: EntityRef | null
  title?: string
  status?: string
  progress?: number
  progressTotal?: number
  totalEpisodes?: number
  progressUnit?: string
  rating?: number
  image?: string
  format?: string
  genres?: string[]
  [key: string]: unknown
}

export interface ThreadSubjectRef {
  subject?: string
  subjectId?: number | string | null
  mediaType?: CatalogDomain | string
  source?: ProviderId | string
  sourceId?: string | null
  entityRef?: EntityRef | null
}

export interface ThreadComment {
  comment?: {
    user?: AppUser | null
    comment?: string
    flagged?: boolean
    suspended?: boolean
    createdAt?: string | Date
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface ThreadRecord extends ThreadSubjectRef {
  _id?: string
  id?: string
  title?: string
  body?: string
  user?: AppUser | null
  comments?: ThreadComment[]
  flagged?: boolean
  suspended?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
  [key: string]: unknown
}

export interface UserFavoriteCollections {
  mediaFavorites?: Array<{ media: CatalogDetail | CatalogSummary | Record<string, unknown> }>
  animeFavorites?: Array<{ anime: CatalogDetail | CatalogSummary | Record<string, unknown> }>
  characterFavorites?: Array<{ character: Record<string, unknown> }>
  staffFavorites?: Array<{ staff: Record<string, unknown> }>
}

export interface UserPreferences {
  themes?: {
    profileTheme?: ThemeColors | null
    [key: string]: unknown
  }
  dashboardLayout?: {
    home?: HomePreferences | null
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface UserProfile {
  favorites?: UserFavoriteCollections
  bio?: string
  friends?: Array<Record<string, unknown>>
  socials?: Array<Record<string, unknown>>
  [key: string]: unknown
}

export interface AppUser {
  _id?: string
  userName?: string
  email?: string
  status?: string
  role?: string
  img?: string
  imgAlt?: string
  bgImg?: string
  firstName?: string
  lastName?: string
  userPreferences?: UserPreferences
  userProfile?: UserProfile
  [key: string]: unknown
}

export interface SessionUserState {
  user: AppUser | null
}

export interface SessionResponse {
  user: AppUser | null
  accessToken: string | null
}

export interface TimestampedRecord {
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface HttpResponse<T> {
  status: number
  data: T
}

export interface DecodedAccessToken {
  exp?: number
  user?: {
    _id?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface BootstrapSessionDependencies {
  getSession: () => Promise<HttpResponse<SessionResponse> | null | undefined>
  getUserById: (id: string) => Promise<HttpResponse<AppUser> | null | undefined>
  decodeTokenPayload: (token: string | null) => DecodedAccessToken | null
  getAccessToken: () => string | null
  setAccessToken: (token: string | null) => void
  setUser: (user: AppUser | null) => void
  setLoggedOut: () => void
  setupUserTheme: (user: AppUser | null) => void
  setupLocalTheme: () => void
}

export interface CatalogSearchParams {
  search?: string | null
  genre?: string[] | string | null
  exclude?: string[] | string | null
  sort?: string | null
  year?: number | string | null
  limit?: number | string | null
  page?: number | string | null
  [key: string]: unknown
}

export interface CatalogGenre {
  id?: number | string
  name: string
}

export type UpdateStatus = 'up_to_date' | 'update_available' | 'source_unavailable' | string

export interface AuthCredentials {
  email?: string
  password?: string
  [key: string]: unknown
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetSubmission {
  token: string
  password: string
}
