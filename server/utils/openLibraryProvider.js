const https = require('https')
const {canonicalEntityRef} = require('./entityRef')
const {communityRatingsForEntityRefs, emptyCommunityRating} = require('./communityRatings')

const OPEN_LIBRARY_URL = 'https://openlibrary.org'
const OPEN_LIBRARY_COVER_URL = 'https://covers.openlibrary.org/b'
const BOOK_SUBJECTS = [
    'Fantasy', 'Science Fiction',
    'Romance', 'Mystery',
    'Thriller', 'Horror',
    'Historical Fiction', 'Classics',
    'Biography', 'Memoir',
    'Young Adult', 'Children',
    'Comics', 'Graphic Novels',
    'Poetry', 'Drama',
    'Adventure', 'Philosophy',
    'Psychology', 'History',
    'Science', 'Technology',
    'Business', 'Self Help',
    'Religion', 'Travel',
    'Cooking', 'Art',
    'Music', 'Sports',
]
const OPEN_LIBRARY_SORTS = new Set(['trending', 'rating', 'want_to_read', 'editions', 'new', 'old', 'random'])
const DEFAULT_BOOK_SORT = 'trending'

function openLibraryRequest(path) {
    return new Promise((resolve, reject) => {
        https.get(`${OPEN_LIBRARY_URL}${path}`, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'OmniList/1.0 (development@omnilist.local)',
            },
        }, (response) => {
            let body = ''

            response.on('data', chunk => {
                body += chunk
            })

            response.on('end', () => {
                try {
                    const json = body ? JSON.parse(body) : {}

                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        reject(new Error(json?.message ?? response.statusMessage))
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

function coverUrl(coverId, size = 'L') {
    return coverId ? `${OPEN_LIBRARY_COVER_URL}/id/${coverId}-${size}.jpg` : ''
}

function workIdFromKey(key = '') {
    const parts = `${key}`.split('/')
    return parts[parts.length - 1] || null
}

function parseDateParts(value) {
    if (!value) {
        return {year: null, month: null, day: null}
    }

    const clean = `${value}`.trim()
    const yearMatch = clean.match(/(\d{4})/)
    const monthMatch = clean.match(/-(\d{2})-/)
    const dayMatch = clean.match(/-(\d{2})$/)

    return {
        year: yearMatch ? Number(yearMatch[1]) : null,
        month: monthMatch ? Number(monthMatch[1]) : null,
        day: dayMatch ? Number(dayMatch[1]) : null,
    }
}

function finiteNumber(value) {
    const number = Number(value)

    return Number.isFinite(number) ? number : null
}

function providerRatingFromDoc(doc = {}) {
    return {
        average: finiteNumber(doc.ratings_average),
        count: finiteNumber(doc.ratings_count) ?? 0,
        scale: 5,
        source: 'OPENLIBRARY',
    }
}

function noneRating() {
    return {
        average: null,
        count: 0,
        scale: 100,
        source: 'NONE',
    }
}

function selectedRating({communityRating, providerRating}) {
    if (communityRating?.count > 0) {
        return communityRating
    }

    if (providerRating?.average !== null && providerRating?.count > 0) {
        return providerRating
    }

    return noneRating()
}

function averageScoreFromRating(rating) {
    if (!rating || rating.average === null) {
        return null
    }

    if (rating.scale === 10) {
        return Math.round(rating.average * 10)
    }

    if (rating.scale === 5) {
        return Math.round(rating.average * 20)
    }

    return Math.round(rating.average)
}

function normalizeOpenLibrarySort(sort) {
    if (sort === 'relevance') {
        return null
    }

    if (sort === 'omni_discovery') {
        return DEFAULT_BOOK_SORT
    }

    return OPEN_LIBRARY_SORTS.has(sort) ? sort : DEFAULT_BOOK_SORT
}

function normalizeBookSummary(doc = {}, communityRating = emptyCommunityRating()) {
    const externalId = workIdFromKey(doc.key)
    const title = doc.title ?? 'Untitled'
    const authorNames = doc.author_name ?? []
    const providerRating = providerRatingFromDoc(doc)
    const rating = selectedRating({communityRating, providerRating})

    return {
        id: externalId,
        mediaType: 'BOOK',
        source: 'OPENLIBRARY',
        entityRef: canonicalEntityRef({
            provider: 'OPENLIBRARY',
            domain: 'BOOK',
            externalId,
        }),
        title: {
            english: title,
            romaji: title,
            native: title,
            userPreferred: title,
        },
        coverImage: {
            large: coverUrl(doc.cover_i),
        },
        bannerImage: coverUrl(doc.cover_i),
        description: authorNames.length ? `By ${authorNames.slice(0, 3).join(', ')}` : '',
        genres: doc.subject?.slice(0, 8) ?? [],
        averageScore: averageScoreFromRating(rating),
        rating,
        providerRating,
        communityRating,
        popularity: doc.readinglog_count ?? doc.want_to_read_count ?? doc.ratings_count ?? null,
        progressTotal: doc.number_of_pages_median ?? 0,
        progressDisplay: doc.first_publish_year ? `${doc.first_publish_year}` : null,
        format: 'BOOK',
        authors: authorNames,
        editionCount: doc.edition_count ?? null,
        readingLogCount: doc.readinglog_count ?? null,
        wantToReadCount: doc.want_to_read_count ?? null,
    }
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value
    }

    return `${value ?? ''}`.split(',').map(item => item.trim()).filter(Boolean)
}

function subjectQuery(genre) {
    return `subject:"${genre}"`
}

function matchesSubjects(doc, genres = []) {
    if (!genres.length) {
        return true
    }

    const subjects = (doc?.subject ?? []).map(subject => `${subject}`.toLowerCase())

    return genres.every(genre => {
        const normalizedGenre = `${genre}`.toLowerCase()

        return subjects.some(subject => subject.includes(normalizedGenre) || normalizedGenre.includes(subject))
    })
}

function excludesSubjects(doc, excludedGenres = []) {
    if (!excludedGenres.length) {
        return false
    }

    const subjects = (doc?.subject ?? []).map(subject => `${subject}`.toLowerCase())

    return excludedGenres.some(genre => {
        const normalizedGenre = `${genre}`.toLowerCase()

        return subjects.some(subject => subject.includes(normalizedGenre) || normalizedGenre.includes(subject))
    })
}

function normalizedMetric(value, max) {
    const number = finiteNumber(value) ?? 0

    return max > 0 ? number / max : 0
}

function recencyBoost(firstPublishYear) {
    const year = finiteNumber(firstPublishYear)
    if (!year) {
        return 0
    }

    const currentYear = new Date().getFullYear()
    const age = Math.max(currentYear - year, 0)

    return Math.max(0, 1 - (age / 50))
}

function omniDiscoveryScore(doc, maximums = {}) {
    const rating = ((finiteNumber(doc.ratings_average) ?? 0) / 5)
    const ratingConfidence = Math.min((finiteNumber(doc.ratings_count) ?? 0) / 50, 1)
    const weightedRating = rating * ratingConfidence

    return (weightedRating * 0.45)
        + (normalizedMetric(doc.readinglog_count, maximums.readinglog_count) * 0.30)
        + (normalizedMetric(doc.want_to_read_count, maximums.want_to_read_count) * 0.15)
        + (recencyBoost(doc.first_publish_year) * 0.10)
}

function sortByOmniDiscovery(docs = []) {
    const maximums = docs.reduce((max, doc) => ({
        readinglog_count: Math.max(max.readinglog_count, finiteNumber(doc.readinglog_count) ?? 0),
        want_to_read_count: Math.max(max.want_to_read_count, finiteNumber(doc.want_to_read_count) ?? 0),
    }), {
        readinglog_count: 0,
        want_to_read_count: 0,
    })

    return [...docs].sort((a, b) => omniDiscoveryScore(b, maximums) - omniDiscoveryScore(a, maximums))
}

function bookSearchPath({search, genres = [], sort, page = 1, limit = 20} = {}) {
    const params = new URLSearchParams()
    const includedGenres = normalizeList(genres)
    const queryParts = []

    params.set('page', `${page}`)
    params.set('limit', `${limit}`)
    params.set('mode', 'everything')
    params.set('fields', [
        'key',
        'title',
        'author_name',
        'cover_i',
        'subject',
        'ratings_average',
        'ratings_count',
        'want_to_read_count',
        'currently_reading_count',
        'already_read_count',
        'readinglog_count',
        'edition_count',
        'number_of_pages_median',
        'first_publish_year',
    ].join(','))

    if (search?.trim()) {
        queryParts.push(search.trim())
    } else {
        queryParts.push('fiction')
    }

    includedGenres.forEach(genre => {
        queryParts.push(subjectQuery(genre))
    })

    params.set('q', queryParts.join(' '))

    const normalizedSort = normalizeOpenLibrarySort(sort)
    if (normalizedSort) {
        params.set('sort', normalizedSort)
    }

    return `/search.json?${params.toString()}`
}

async function searchBooks({search, genres = [], excludedGenres = [], sort, page = 1, limit = 20} = {}) {
    const includedGenres = normalizeList(genres)
    const excluded = normalizeList(excludedGenres)
    const data = await openLibraryRequest(bookSearchPath({search, genres: includedGenres, sort, page, limit}))

    const docs = (data?.docs ?? [])
        .filter(doc => `${doc.key ?? ''}`.startsWith('/works/'))
        .filter(doc => matchesSubjects(doc, includedGenres))
        .filter(doc => !excludesSubjects(doc, excluded))
    const sortedDocs = sort === 'omni_discovery' ? sortByOmniDiscovery(docs) : docs
    const entityRefs = sortedDocs.map(doc => canonicalEntityRef({
        provider: 'OPENLIBRARY',
        domain: 'BOOK',
        externalId: workIdFromKey(doc.key),
    })).filter(Boolean)
    const communityRatings = await communityRatingsForEntityRefs(entityRefs)

    return sortedDocs.map(doc => {
        const entityRef = canonicalEntityRef({
            provider: 'OPENLIBRARY',
            domain: 'BOOK',
            externalId: workIdFromKey(doc.key),
        })

        return normalizeBookSummary(doc, communityRatings.get(entityRef?.key) ?? emptyCommunityRating())
    })
}

function bookGenres() {
    return BOOK_SUBJECTS
}

async function fetchAuthorName(authorKey) {
    if (!authorKey) {
        return null
    }

    try {
        const data = await openLibraryRequest(`${authorKey}.json`)
        return data?.name ?? null
    } catch (err) {
        return null
    }
}

async function bookDetail(workId) {
    const data = await openLibraryRequest(`/works/${workId}.json`)
    const authorKeys = (data?.authors ?? []).map(author => author?.author?.key).filter(Boolean).slice(0, 5)
    const authorNames = (await Promise.all(authorKeys.map(fetchAuthorName))).filter(Boolean)
    const description = typeof data?.description === 'string'
        ? data.description
        : data?.description?.value ?? ''
    const coverId = data?.covers?.[0]
    const title = data?.title ?? 'Untitled'

    return {
        id: workId,
        mediaType: 'BOOK',
        source: 'OPENLIBRARY',
        entityRef: canonicalEntityRef({
            provider: 'OPENLIBRARY',
            domain: 'BOOK',
            externalId: workId,
        }),
        title: {
            english: title,
            romaji: title,
            native: title,
            userPreferred: title,
        },
        description,
        bannerImage: coverUrl(coverId),
        coverImage: {
            large: coverUrl(coverId),
        },
        startDate: parseDateParts(data?.created?.value ?? data?.first_publish_date),
        endDate: {year: null, month: null, day: null},
        genres: data?.subjects?.slice(0, 12) ?? [],
        status: null,
        season: null,
        format: 'BOOK',
        favourites: data?.revision ?? null,
        popularity: data?.latest_revision ?? null,
        averageScore: null,
        meanScore: null,
        duration: null,
        runtime: null,
        releaseDate: data?.first_publish_date ?? null,
        progressTotal: 0,
        progressUnit: 'books',
        progressDisplay: data?.first_publish_date ?? null,
        synonyms: data?.subject_places ?? [],
        numberOfSeasons: null,
        numberOfEpisodes: null,
        mediaFacts: [
            {title: 'authors', value: authorNames.join(', ') || null},
            {title: 'first publish date', value: data?.first_publish_date ?? null},
            {title: 'subjects', value: (data?.subjects ?? []).slice(0, 8).join(', ') || null},
        ].filter(fact => fact.value),
        studios: {edges: []},
        characters: {edges: []},
        staff: {
            edges: authorNames.map((name, index) => ({
                role: 'Author',
                node: {
                    id: `author-${index}`,
                    name: {
                        userPreferred: name,
                    },
                    image: {
                        medium: '',
                    },
                },
            })),
        },
    }
}

module.exports = {
    averageScoreFromRating,
    bookDetail,
    bookGenres,
    bookSearchPath,
    normalizeBookSummary,
    normalizeOpenLibrarySort,
    omniDiscoveryScore,
    providerRatingFromDoc,
    searchBooks,
    selectedRating,
}
