const https = require('https')
const {canonicalEntityRef, normalizeDomain} = require('./entityRef')

const ANILIST_URL = 'https://graphql.anilist.co'

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

function anilistRequest({query, variables = {}}) {
    return new Promise((resolve, reject) => {
        const req = https.request(ANILIST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }, (response) => {
            let body = ''

            response.on('data', chunk => {
                body += chunk
            })

            response.on('end', () => {
                try {
                    const json = body ? JSON.parse(body) : {}

                    if (response.statusCode < 200 || response.statusCode >= 300 || json.errors?.length) {
                        reject(new Error(json.errors?.map(error => error.message).join(', ') ?? response.statusMessage))
                        return
                    }

                    resolve(json.data)
                } catch (err) {
                    reject(err)
                }
            })
        })

        req.on('error', reject)
        req.write(JSON.stringify({query, variables}))
        req.end()
    })
}

function formatDateParts(date) {
    if (!date?.year) {
        return {year: null, month: null, day: null}
    }

    return {
        year: date.year ?? null,
        month: date.month ?? null,
        day: date.day ?? null,
    }
}

function normalizeSummary(media, mediaType) {
    const externalId = `${media.id}`
    const nextAiringEpisode = media?.nextAiringEpisode ?? null
    const animeProgressDisplay = mediaType === 'ANIME' && nextAiringEpisode?.episode
        ? (() => {
            const episode = nextAiringEpisode.episode
            const total = media?.episodes && media.episodes >= episode ? `/${media.episodes}` : ''
            const airDate = nextAiringEpisode?.airingAt
                ? new Date(nextAiringEpisode.airingAt * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
                : null
            const airDateLabel = airDate ? ` airing ${airDate}` : ''

            return `${episode}${total}${airDateLabel}`
        })()
        : null

    return {
        id: externalId,
        mediaType,
        source: 'ANILIST',
        entityRef: canonicalEntityRef({
            provider: 'ANILIST',
            domain: mediaType,
            externalId,
        }),
        title: {
            english: media?.title?.english,
            romaji: media?.title?.romaji,
            native: media?.title?.native,
            userPreferred: media?.title?.english ?? media?.title?.romaji ?? media?.title?.native,
        },
        coverImage: {
            large: media?.coverImage?.large ?? '',
        },
        bannerImage: media?.bannerImage ?? '',
        description: media?.description ?? '',
        genres: media?.genres ?? [],
        averageScore: media?.averageScore ?? null,
        popularity: media?.popularity ?? null,
        progressTotal: mediaType === 'MANGA' ? (media?.chapters ?? media?.volumes ?? 0) : (media?.episodes ?? 0),
        progressDisplay: mediaType === 'MANGA'
            ? `${media?.chapters ?? media?.volumes ?? '---'}`
            : animeProgressDisplay ?? `${media?.episodes ?? '---'}`,
        format: media?.format ?? mediaType,
        nextAiringEpisode,
    }
}

function normalizeDetail(media, mediaType) {
    const summary = normalizeSummary(media, mediaType)

    return {
        ...summary,
        startDate: formatDateParts(media?.startDate),
        endDate: formatDateParts(media?.endDate),
        status: media?.status ?? null,
        season: media?.season ?? null,
        favourites: media?.favourites ?? null,
        meanScore: media?.meanScore ?? null,
        sourceMaterial: media?.source ?? null,
        countryOfOrigin: media?.countryOfOrigin ?? null,
        hashtag: media?.hashtag ?? null,
        duration: media?.duration ?? null,
        nextAiringEpisode: media?.nextAiringEpisode ?? null,
        synonyms: media?.synonyms ?? [],
        tags: media?.tags ?? [],
        externalLinks: media?.externalLinks ?? [],
        studios: media?.studios ?? {edges: []},
        characters: media?.characters ?? {edges: []},
        staff: media?.staff ?? {edges: []},
    }
}

async function searchAniListMedia(mediaType, {search, genres, excludedGenres, sort, page = 1, perPage = 20} = {}) {
    const query = `
        query ($type: MediaType, $search: String, $page: Int, $perPage: Int, $genre: [String], $genreNot: [String], $sort: [MediaSort]) {
          Page(page: $page, perPage: $perPage) {
            media(type: $type, search: $search, genre_in: $genre, genre_not_in: $genreNot, sort: $sort) {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                large
              }
              bannerImage
              description
              genres
              episodes
              chapters
              volumes
              nextAiringEpisode {
                episode
                airingAt
              }
              status
              format
              averageScore
              popularity
            }
          }
        }
    `

    const data = await anilistRequest({
        query,
        variables: {
            type: normalizeDomain(mediaType),
            search: search ?? null,
            page,
            perPage,
            genre: genres?.length ? genres : null,
            genreNot: excludedGenres?.length ? excludedGenres : null,
            sort: [sort ?? 'TRENDING_DESC'],
        },
    })

    return (data?.Page?.media ?? []).map(media => normalizeSummary(media, normalizeDomain(mediaType)))
}

async function aniListDetail(mediaType, id) {
    const query = `
        query ($id: Int, $type: MediaType) {
          Media(type: $type, id: $id) {
            characters {
              edges {
                role
                node {
                  id
                  name {
                    userPreferred
                  }
                  image {
                    medium
                  }
                }
              }
            }
            staff {
              edges {
                role
                node {
                  id
                  name {
                    userPreferred
                  }
                  image {
                    medium
                  }
                }
              }
            }
            studios {
              edges {
                isMain
                node {
                  id
                  name
                }
              }
            }
            title {
              english
              romaji
              native
            }
            description
            bannerImage
            coverImage {
              large
            }
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            id
            genres
            episodes
            chapters
            volumes
            status
            season
            format
            favourites
            popularity
            averageScore
            meanScore
            source
            countryOfOrigin
            hashtag
            duration
            nextAiringEpisode {
              episode
              airingAt
            }
            synonyms
            tags {
              name
              rank
              isMediaSpoiler
            }
            externalLinks {
              site
              url
            }
          }
        }
    `

    const data = await anilistRequest({
        query,
        variables: {
            id: Number(id),
            type: normalizeDomain(mediaType),
        },
    })

    return normalizeDetail(data?.Media, normalizeDomain(mediaType))
}

function aniListGenres() {
    return [...ANILIST_GENRES]
}

module.exports = {
    aniListDetail,
    aniListGenres,
    searchAniListMedia,
}
