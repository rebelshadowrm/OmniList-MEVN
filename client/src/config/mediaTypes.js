const ANILIST_SORT_OPTIONS = [
  { name: 'Trending', value: 'TRENDING_DESC' },
  { name: 'Rating', value: 'SCORE_DESC' },
  { name: 'Popularity', value: 'POPULARITY_DESC' },
  { name: 'Best Match', value: 'SEARCH_MATCH' }
]

const TMDB_MOVIE_SORT_OPTIONS = [
  { name: 'Popularity', value: 'popularity.desc' },
  { name: 'Rating', value: 'vote_average.desc' },
  { name: 'Release Date', value: 'primary_release_date.desc' },
  { name: 'Best Match', value: 'search_match' }
]

const TMDB_TV_SORT_OPTIONS = [
  { name: 'Popularity', value: 'popularity.desc' },
  { name: 'Rating', value: 'vote_average.desc' },
  { name: 'First Air Date', value: 'first_air_date.desc' },
  { name: 'Best Match', value: 'search_match' }
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
  'Supernatural', 'Thriller'
]

export const MEDIA_TYPES = {
  ANIME: {
    type: 'ANIME',
    source: 'ANILIST',
    path: 'anime',
    label: 'Anime',
    noun: 'anime',
    browseRoute: 'AnimeBrowse',
    detailRoute: 'Anime',
    progressLabel: 'Episodes',
    progressUnit: 'episodes',
    totalField: 'episodes',
    activeStatus: 'watching',
    activeStatusLabel: 'Watching',
    defaultSort: 'TRENDING_DESC',
    sortOptions: ANILIST_SORT_OPTIONS,
    genreOptions: ANILIST_GENRES,
  },
  MANGA: {
    type: 'MANGA',
    source: 'ANILIST',
    path: 'manga',
    label: 'Manga',
    noun: 'manga',
    browseRoute: 'MangaBrowse',
    detailRoute: 'Manga',
    progressLabel: 'Chapters',
    progressUnit: 'chapters',
    totalField: 'chapters',
    activeStatus: 'reading',
    activeStatusLabel: 'Reading',
    defaultSort: 'TRENDING_DESC',
    sortOptions: ANILIST_SORT_OPTIONS,
    genreOptions: ANILIST_GENRES,
  },
  MOVIE: {
    type: 'MOVIE',
    source: 'TMDB',
    path: 'movies',
    label: 'Movies',
    noun: 'movie',
    browseRoute: 'MovieBrowse',
    detailRoute: 'Movie',
    progressLabel: 'Released',
    progressUnit: 'movie',
    totalField: 'progressTotal',
    activeStatus: 'watching',
    activeStatusLabel: 'Watching',
    yearFilterLabel: 'Release Year',
    defaultSort: 'popularity.desc',
    sortOptions: TMDB_MOVIE_SORT_OPTIONS,
    genreOptions: [],
  },
  TV: {
    type: 'TV',
    source: 'TMDB',
    path: 'tv',
    label: 'TV',
    noun: 'TV show',
    browseRoute: 'TvBrowse',
    detailRoute: 'Tv',
    progressLabel: 'Episodes',
    progressUnit: 'episodes',
    totalField: 'progressTotal',
    activeStatus: 'watching',
    activeStatusLabel: 'Watching',
    yearFilterLabel: 'First Air Year',
    defaultSort: 'popularity.desc',
    sortOptions: TMDB_TV_SORT_OPTIONS,
    genreOptions: [],
  },
}

export const ANILIST_MEDIA_TYPES = MEDIA_TYPES
export const defaultMediaType = 'ANIME'

export function normalizeMediaType(mediaType) {
  const type = `${mediaType ?? defaultMediaType}`.toUpperCase()

  return MEDIA_TYPES[type] ? type : defaultMediaType
}

export function mediaConfig(mediaType) {
  return MEDIA_TYPES[normalizeMediaType(mediaType)]
}

export function mediaTypes() {
  return Object.values(MEDIA_TYPES)
}
