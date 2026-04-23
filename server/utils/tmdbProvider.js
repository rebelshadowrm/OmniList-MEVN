const https = require('https')

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const POSTER_FALLBACK = ''
const PROFILE_FALLBACK = ''
const TV_SUMMARY_DETAIL_CACHE_TTL_MS = 1000 * 60 * 60

let movieGenreCache = null
let tvGenreCache = null
let tvSummaryDetailCache = new Map()

const TMDB_MEDIA_CONFIG = {
    MOVIE: {
        type: 'MOVIE',
        listPath: '/movie/popular',
        discoverPath: '/discover/movie',
        searchPath: '/search/movie',
        detailPath: id => `/movie/${id}`,
        genrePath: '/genre/movie/list',
        yearParam: 'primary_release_year',
        searchYearParam: 'primary_release_year',
        progressUnit: 'movie',
        progressTotal: () => 1,
        title: item => item.title,
        originalTitle: item => item.original_title,
        releaseDate: item => item.release_date,
        format: () => 'MOVIE',
    },
    TV: {
        type: 'TV',
        listPath: '/tv/popular',
        discoverPath: '/discover/tv',
        searchPath: '/search/tv',
        detailPath: id => `/tv/${id}`,
        genrePath: '/genre/tv/list',
        yearParam: 'first_air_date_year',
        searchYearParam: 'first_air_date_year',
        progressUnit: 'episodes',
        progressTotal: item => item.number_of_episodes,
        title: item => item.name,
        originalTitle: item => item.original_name,
        releaseDate: item => item.first_air_date,
        format: () => 'TV',
    },
}

const ANIMATION_GENRE_ID = 16
const ANIMATION_GENRE_NAME = 'Animation'
const JAPAN_COUNTRY_CODE = 'JP'
const JAPANESE_LANGUAGE_CODE = 'ja'

function authToken() {
    return process.env.TMDB_BEARER_TOKEN ?? process.env.TMDB_ACCESS_TOKEN
}

function apiKey() {
    return process.env.TMDB_API_KEY
}

function imageUrl(path, size = 'w500', fallback = POSTER_FALLBACK) {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : fallback
}

function dateParts(date) {
    if (!date) return {}
    const [year, month, day] = date.split('-').map(Number)

    return {year, month, day}
}

function formatDate(date) {
    if (!date) {
        return null
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function formatCurrency(value) {
    if (!Number.isFinite(value) || value <= 0) {
        return null
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value)
}

function listValue(values) {
    const cleanValues = (values ?? []).filter(Boolean)

    return cleanValues.length ? cleanValues.join(', ') : null
}

function fact(title, value) {
    if (value === undefined || value === null || value === '') {
        return null
    }

    return {title, value}
}

function tmdbRequest(path, params = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${TMDB_BASE_URL}${path}`)

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.set(key, value)
            }
        })

        const token = authToken()
        const key = apiKey()

        if (!token && key) {
            url.searchParams.set('api_key', key)
        }

        if (!token && !key) {
            reject(new Error('TMDB is not configured. Set TMDB_BEARER_TOKEN or TMDB_API_KEY.'))
            return
        }

        const options = token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            }
            : {
                headers: {
                    Accept: 'application/json',
                }
            }

        https.get(url, options, (response) => {
            let body = ''

            response.on('data', chunk => {
                body += chunk
            })

            response.on('end', () => {
                try {
                    const json = body ? JSON.parse(body) : {}

                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        reject(new Error(json.status_message ?? response.statusMessage))
                        return
                    }

                    resolve(json)
                } catch (err) {
                    reject(err)
                }
            })
        }).on('error', reject)
    })
}

async function genreMap(mediaType) {
    const config = TMDB_MEDIA_CONFIG[mediaType]

    if (!config) {
        throw new Error(`Unsupported TMDB media type: ${mediaType}`)
    }

    if (mediaType === 'MOVIE' && movieGenreCache) {
        return movieGenreCache
    }

    if (mediaType === 'TV' && tvGenreCache) {
        return tvGenreCache
    }

    const data = await tmdbRequest(config.genrePath)
    const genres = new Map((data.genres ?? []).map(genre => [genre.id, genre.name]))

    if (mediaType === 'MOVIE') {
        movieGenreCache = genres
    } else {
        tvGenreCache = genres
    }

    return genres
}

function isAnimeLikeTv(item, genres = []) {
    const isAnimation = item.genre_ids
        ? item.genre_ids.includes(ANIMATION_GENRE_ID)
        : genres.includes(ANIMATION_GENRE_NAME)
    const isJapaneseOrigin = item.original_language === JAPANESE_LANGUAGE_CODE
        || item.origin_country?.includes(JAPAN_COUNTRY_CODE)
        || item.production_countries?.some(country => country.iso_3166_1 === JAPAN_COUNTRY_CODE)

    return isAnimation && isJapaneseOrigin
}

function classificationFor(item, mediaType, genres = []) {
    const animeLike = mediaType === 'TV' && isAnimeLikeTv(item, genres)

    return {
        animeLike,
        excludedFromTvBrowse: animeLike,
        reason: animeLike ? 'Japanese animation is handled through the anime catalog.' : null,
    }
}

async function cachedTvSummaryDetail(id) {
    const cached = tvSummaryDetailCache.get(id)

    if (cached && cached.expiresAt > Date.now()) {
        return cached.data
    }

    const data = await tmdbRequest(`/tv/${id}`)
    tvSummaryDetailCache.set(id, {
        data,
        expiresAt: Date.now() + TV_SUMMARY_DETAIL_CACHE_TTL_MS,
    })

    return data
}

async function enrichTvSummary(item) {
    try {
        const detail = await cachedTvSummaryDetail(item.id)

        return {
            ...detail,
            ...item,
            genre_ids: item.genre_ids,
        }
    } catch (err) {
        return item
    }
}

function numericValue(value) {
    return Number.isFinite(value) && value > 0 ? value : null
}

function arrayValue(value) {
    if (Array.isArray(value)) {
        return value
    }

    if (value === undefined || value === null || value === '') {
        return []
    }

    return `${value}`.split(',')
}

function normalizedNames(value) {
    return arrayValue(value)
        .map(item => `${item}`.trim())
        .filter(Boolean)
}

function genreIdsForNames(genres, names) {
    if (!names.length) {
        return []
    }

    const selected = new Set(names.map(name => name.toLowerCase()))

    return [...genres.entries()]
        .filter(([, name]) => selected.has(name.toLowerCase()))
        .map(([id]) => id)
}

function releaseYear(item, mediaType) {
    const date = item.releaseDate ?? TMDB_MEDIA_CONFIG[mediaType].releaseDate(item)

    return date ? Number(date.slice(0, 4)) : null
}

function sortTmdbResults(results, mediaType, sort) {
    if (!sort || sort === 'search_match') {
        return results
    }

    const sorted = [...results]
    const direction = sort.endsWith('.asc') ? 1 : -1

    if (sort.startsWith('vote_average')) {
        return sorted.sort((a, b) => direction * ((a.averageScore ?? 0) - (b.averageScore ?? 0)))
    }

    if (sort.startsWith('popularity')) {
        return sorted.sort((a, b) => direction * ((a.popularity ?? 0) - (b.popularity ?? 0)))
    }

    if (sort.startsWith('primary_release_date') || sort.startsWith('first_air_date')) {
        return sorted.sort((a, b) => direction * ((releaseYear(a, mediaType) ?? 0) - (releaseYear(b, mediaType) ?? 0)))
    }

    return results
}

function standardSeasons(item) {
    return (item.seasons ?? [])
        .filter(season => season.season_number > 0)
        .sort((a, b) => a.season_number - b.season_number)
}

function absoluteEpisodeNumber(item, episode) {
    if (!episode) {
        return null
    }

    const priorEpisodes = standardSeasons(item)
        .filter(season => season.season_number < episode.season_number)
        .reduce((total, season) => total + (season.episode_count ?? 0), 0)

    if (priorEpisodes > 0 || episode.season_number === 1) {
        return priorEpisodes + episode.episode_number
    }

    return episode.episode_number
}

function airingScheduleFor(item, mediaType) {
    if (mediaType !== 'TV') {
        return null
    }

    const totalEpisodes = numericValue(item.number_of_episodes)
    const lastEpisode = item.last_episode_to_air ?? null
    const nextEpisode = item.next_episode_to_air ?? null
    const lastEpisodeAbsolute = absoluteEpisodeNumber(item, lastEpisode)
    const nextEpisodeAbsolute = absoluteEpisodeNumber(item, nextEpisode)
    const isCompleted = !nextEpisode && item.status === 'Ended'
    const airedEpisodes = isCompleted
        ? totalEpisodes
        : lastEpisodeAbsolute ?? numericValue(lastEpisode?.episode_number)

    return {
        status: isCompleted ? 'completed' : nextEpisode ? 'airing' : 'unknown',
        airedEpisodes,
        totalEpisodes,
        lastEpisode: lastEpisode
            ? {
                seasonNumber: lastEpisode.season_number,
                episodeNumber: lastEpisode.episode_number,
                absoluteEpisodeNumber: lastEpisodeAbsolute,
                airDate: lastEpisode.air_date,
            }
            : null,
        nextEpisode: nextEpisode
            ? {
                seasonNumber: nextEpisode.season_number,
                episodeNumber: nextEpisode.episode_number,
                absoluteEpisodeNumber: nextEpisodeAbsolute,
                airDate: nextEpisode.air_date,
            }
            : null,
    }
}

function progressDisplayFor(item, mediaType) {
    if (mediaType === 'MOVIE') {
        return formatDate(TMDB_MEDIA_CONFIG.MOVIE.releaseDate(item))
    }

    const schedule = airingScheduleFor(item, mediaType)

    if (!schedule) {
        return null
    }

    if (schedule.nextEpisode) {
        const episodeNumber = schedule.nextEpisode.absoluteEpisodeNumber ?? schedule.nextEpisode.episodeNumber
        const total = schedule.totalEpisodes && schedule.totalEpisodes >= episodeNumber
            ? `/${schedule.totalEpisodes}`
            : ''
        const airDate = formatDate(schedule.nextEpisode.airDate)
        const airDateLabel = airDate ? ` airing ${airDate}` : ''

        return `${episodeNumber}${total}${airDateLabel}`
    }

    if (schedule.status === 'completed' && schedule.totalEpisodes) {
        return `Completed ${schedule.totalEpisodes}/${schedule.totalEpisodes}`
    }

    if (schedule.airedEpisodes && schedule.totalEpisodes) {
        return `Aired ${schedule.airedEpisodes}/${schedule.totalEpisodes}`
    }

    if (schedule.totalEpisodes) {
        return `${schedule.totalEpisodes} total`
    }

    return null
}

function normalizeTmdbSummary(item, mediaType, genres = new Map()) {
    const config = TMDB_MEDIA_CONFIG[mediaType]
    const itemGenres = (item.genre_ids ?? []).map(id => genres.get(id)).filter(Boolean)

    return {
        id: item.id,
        mediaType,
        source: 'TMDB',
        title: {
            english: config.title(item),
            romaji: config.originalTitle(item),
            native: config.originalTitle(item),
            userPreferred: config.title(item),
        },
        coverImage: {
            large: imageUrl(item.poster_path),
        },
        bannerImage: imageUrl(item.backdrop_path, 'w1280', ''),
        description: item.overview,
        genres: itemGenres,
        averageScore: Number.isFinite(item.vote_average) ? Math.round(item.vote_average * 10) : null,
        popularity: item.popularity,
        progressTotal: config.progressTotal(item),
        progressDisplay: progressDisplayFor(item, mediaType),
        airingSchedule: airingScheduleFor(item, mediaType),
        releaseDate: config.releaseDate(item),
        classification: classificationFor(item, mediaType, itemGenres),
    }
}

function normalizePerson(person, role) {
    return {
        role,
        node: {
            id: person.id,
            name: {
                userPreferred: person.name,
            },
            image: {
                medium: imageUrl(person.profile_path, 'w185', PROFILE_FALLBACK),
            },
        },
    }
}

function normalizeTmdbDetail(item, mediaType) {
    const config = TMDB_MEDIA_CONFIG[mediaType]
    const credits = item.credits ?? {}
    const crewRoles = new Set(['Director', 'Screenplay', 'Writer', 'Producer', 'Executive Producer'])
    const itemGenres = (item.genres ?? []).map(genre => genre.name)
    const studios = [
        ...(item.production_companies ?? []),
        ...(item.networks ?? []),
    ]
    const spokenLanguages = listValue((item.spoken_languages ?? []).map(language => language.english_name))
    const productionCountries = listValue((item.production_countries ?? []).map(country => country.name))
    const createdBy = listValue((item.created_by ?? []).map(person => person.name))
    const networks = listValue((item.networks ?? []).map(network => network.name))
    const movieFacts = mediaType === 'MOVIE'
        ? [
            fact('tagline', item.tagline),
            fact('budget', formatCurrency(item.budget)),
            fact('revenue', formatCurrency(item.revenue)),
            fact('original language', item.original_language?.toUpperCase()),
            fact('spoken languages', spokenLanguages),
            fact('production countries', productionCountries),
            fact('IMDB', item.imdb_id),
            fact('homepage', item.homepage),
        ]
        : []
    const tvFacts = mediaType === 'TV'
        ? [
            fact('type', item.type),
            fact('created by', createdBy),
            fact('episode runtime', item.episode_run_time?.length ? `${item.episode_run_time.join(', ')}m` : null),
            fact('original language', item.original_language?.toUpperCase()),
            fact('origin country', listValue(item.origin_country)),
            fact('in production', typeof item.in_production === 'boolean' ? item.in_production ? 'Yes' : 'No' : null),
            fact('last episode', item.last_episode_to_air?.name),
            fact('next episode', item.next_episode_to_air?.name),
            fact('homepage', item.homepage),
        ]
        : []

    return {
        id: item.id,
        mediaType,
        source: 'TMDB',
        title: {
            english: config.title(item),
            romaji: config.originalTitle(item),
            native: config.originalTitle(item),
            userPreferred: config.title(item),
        },
        description: item.overview,
        bannerImage: imageUrl(item.backdrop_path, 'w1280', ''),
        coverImage: {
            large: imageUrl(item.poster_path),
        },
        startDate: dateParts(config.releaseDate(item)),
        endDate: dateParts(item.last_air_date),
        genres: itemGenres,
        status: item.status,
        season: null,
        format: config.format(item),
        favourites: item.vote_count,
        popularity: item.popularity,
        averageScore: Number.isFinite(item.vote_average) ? Math.round(item.vote_average * 10) : null,
        meanScore: Number.isFinite(item.vote_average) ? Math.round(item.vote_average * 10) : null,
        hashtag: null,
        duration: item.runtime ?? item.episode_run_time?.[0],
        runtime: item.runtime ?? item.episode_run_time?.[0],
        releaseDate: config.releaseDate(item),
        progressTotal: config.progressTotal(item),
        progressUnit: config.progressUnit,
        progressDisplay: progressDisplayFor(item, mediaType),
        airingSchedule: airingScheduleFor(item, mediaType),
        synonyms: [
            ...(item.alternative_titles?.titles?.map(title => title.title) ?? []),
            ...(item.alternative_titles?.results?.map(title => title.title) ?? []),
        ],
        seasons: item.seasons,
        numberOfSeasons: item.number_of_seasons,
        numberOfEpisodes: item.number_of_episodes,
        classification: classificationFor(item, mediaType, itemGenres),
        mediaFacts: [
            ...movieFacts,
            ...tvFacts,
        ].filter(Boolean),
        studios: {
            edges: studios.map(company => ({
                isMain: false,
                node: {
                    id: company.id,
                    name: company.name,
                },
            })),
        },
        characters: {
            edges: (credits.cast ?? []).slice(0, 30).map(person => normalizePerson(person, person.character)),
        },
        staff: {
            edges: (credits.crew ?? [])
                .filter(person => crewRoles.has(person.job))
                .slice(0, 30)
                .map(person => normalizePerson(person, person.job)),
        },
    }
}

async function tmdbGenreList(mediaType) {
    const config = TMDB_MEDIA_CONFIG[mediaType]

    if (!config) {
        throw new Error(`Unsupported TMDB media type: ${mediaType}`)
    }

    const genres = await genreMap(mediaType)

    return [...genres.entries()]
        .map(([id, name]) => ({id, name}))
        .sort((a, b) => a.name.localeCompare(b.name))
}

async function searchTmdbMedia(
    mediaType,
    {
        search,
        page = 1,
        includeAnime = false,
        genres: genreNames = [],
        excludedGenres: excludedGenreNames = [],
        sort,
        year,
    } = {}
) {
    const config = TMDB_MEDIA_CONFIG[mediaType]

    if (!config) {
        throw new Error(`Unsupported TMDB media type: ${mediaType}`)
    }

    const genres = await genreMap(mediaType)
    const selectedGenreNames = normalizedNames(genreNames)
    const selectedExcludedGenreNames = normalizedNames(excludedGenreNames)
    const selectedGenreIds = genreIdsForNames(genres, selectedGenreNames)
    const selectedExcludedGenreIds = genreIdsForNames(genres, selectedExcludedGenreNames)
    const cleanYear = Number.isInteger(Number(year)) ? Number(year) : undefined
    const cleanSort = sort && sort !== 'search_match' ? sort : undefined
    const params = {
        page,
    }

    if (cleanYear) {
        params[search ? config.searchYearParam : config.yearParam] = cleanYear
    }

    if (search) {
        params.query = search
    } else {
        if (cleanSort) {
            params.sort_by = cleanSort
        }

        if (selectedGenreIds.length) {
            params.with_genres = selectedGenreIds.join(',')
        }

        if (selectedExcludedGenreIds.length) {
            params.without_genres = selectedExcludedGenreIds.join(',')
        }
    }

    const data = await tmdbRequest(search ? config.searchPath : config.discoverPath, params)

    const results = mediaType === 'TV'
        ? await Promise.all((data.results ?? []).map(enrichTvSummary))
        : data.results ?? []

    const normalizedResults = results
        .map(item => normalizeTmdbSummary(item, mediaType, genres))
        .filter(item => {
            if (selectedGenreNames.length && !selectedGenreNames.every(genre => item.genres?.includes(genre))) {
                return false
            }

            if (selectedExcludedGenreNames.some(genre => item.genres?.includes(genre))) {
                return false
            }

            return true
        })
        .filter(item => includeAnime || !item.classification?.excludedFromTvBrowse)

    return sortTmdbResults(normalizedResults, mediaType, sort)
}

async function tmdbDetail(mediaType, id) {
    const config = TMDB_MEDIA_CONFIG[mediaType]

    if (!config) {
        throw new Error(`Unsupported TMDB media type: ${mediaType}`)
    }

    const data = await tmdbRequest(config.detailPath(id), {
        append_to_response: 'credits,alternative_titles',
    })

    return normalizeTmdbDetail(data, mediaType)
}

async function searchMovies(options) {
    return searchTmdbMedia('MOVIE', options)
}

async function movieGenres() {
    return tmdbGenreList('MOVIE')
}

async function movieDetail(id) {
    return tmdbDetail('MOVIE', id)
}

async function searchTv(options) {
    return searchTmdbMedia('TV', options)
}

async function tvGenres() {
    return tmdbGenreList('TV')
}

async function tvDetail(id) {
    return tmdbDetail('TV', id)
}

module.exports = {
    searchMovies,
    movieGenres,
    movieDetail,
    searchTv,
    tvGenres,
    tvDetail,
}
