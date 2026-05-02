import type { CatalogDomain } from '~/types/api'

const ANILIST_SORT_OPTIONS = [
  { name: 'Trending', value: 'TRENDING_DESC' },
  { name: 'Rating', value: 'SCORE_DESC' },
  { name: 'Popularity', value: 'POPULARITY_DESC' },
  { name: 'Best Match', value: 'SEARCH_MATCH' },
]

const TMDB_MOVIE_SORT_OPTIONS = [
  { name: 'Popularity', value: 'popularity.desc' },
  { name: 'Rating', value: 'vote_average.desc' },
  { name: 'Release Date', value: 'primary_release_date.desc' },
  { name: 'Best Match', value: 'search_match' },
]

const TMDB_TV_SORT_OPTIONS = [
  { name: 'Popularity', value: 'popularity.desc' },
  { name: 'Rating', value: 'vote_average.desc' },
  { name: 'First Air Date', value: 'first_air_date.desc' },
  { name: 'Best Match', value: 'search_match' },
]

const ANILIST_GENRES = [
  'Action', 'Adventure',
  'Comedy', 'Drama',
  'Ecchi', 'Fantasy',
  'Horror', 'Mahou Shoujo',
  'Mecha', 'Music',
  'Mystery', 'Psychological',
  'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports',
  'Supernatural', 'Thriller',
]

export interface CatalogDomainConfig {
  domain: CatalogDomain
  label: string
  noun: string
  route: string
  apiPath: string
  source: string
  defaultSort: string
  progressLabel: string
  progressUnit: string
  totalField: string
  sortOptions: Array<{ name: string, value: string }>
  genreOptions: string[]
  yearFilterLabel?: string
}

export const catalogDomains: CatalogDomainConfig[] = [
  {
    domain: 'ANIME',
    label: 'Anime',
    noun: 'anime',
    route: '/anime',
    apiPath: 'anime',
    source: 'ANILIST',
    defaultSort: 'TRENDING_DESC',
    progressLabel: 'Episodes',
    progressUnit: 'episodes',
    totalField: 'episodes',
    sortOptions: ANILIST_SORT_OPTIONS,
    genreOptions: ANILIST_GENRES,
  },
  {
    domain: 'MANGA',
    label: 'Manga',
    noun: 'manga',
    route: '/manga',
    apiPath: 'manga',
    source: 'ANILIST',
    defaultSort: 'TRENDING_DESC',
    progressLabel: 'Chapters',
    progressUnit: 'chapters',
    totalField: 'chapters',
    sortOptions: ANILIST_SORT_OPTIONS,
    genreOptions: ANILIST_GENRES,
  },
  {
    domain: 'MOVIE',
    label: 'Movies',
    noun: 'movie',
    route: '/movies',
    apiPath: 'movies',
    source: 'TMDB',
    defaultSort: 'popularity.desc',
    progressLabel: 'Released',
    progressUnit: 'movie',
    totalField: 'progressTotal',
    sortOptions: TMDB_MOVIE_SORT_OPTIONS,
    genreOptions: [],
    yearFilterLabel: 'Release Year',
  },
  {
    domain: 'BOOK',
    label: 'Books',
    noun: 'book',
    route: '/books',
    apiPath: 'books',
    source: 'OPENLIBRARY',
    defaultSort: 'relevance',
    progressLabel: 'Progress',
    progressUnit: 'books',
    totalField: 'progressTotal',
    sortOptions: [
      { name: 'Relevance', value: 'relevance' },
    ],
    genreOptions: [],
  },
  {
    domain: 'TV',
    label: 'TV',
    noun: 'TV show',
    route: '/tv',
    apiPath: 'tv',
    source: 'TMDB',
    defaultSort: 'popularity.desc',
    progressLabel: 'Episodes',
    progressUnit: 'episodes',
    totalField: 'progressTotal',
    sortOptions: TMDB_TV_SORT_OPTIONS,
    genreOptions: [],
    yearFilterLabel: 'First Air Year',
  },
]

export function catalogConfig(domain: CatalogDomain): CatalogDomainConfig {
  return catalogDomains.find((item) => item.domain === domain) || catalogDomains[0]!
}

export function catalogApiPath(domain: CatalogDomain): string {
  return catalogConfig(domain).apiPath
}
