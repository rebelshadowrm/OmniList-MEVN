const {canonicalEntityRef, normalizeDomain, normalizeExternalId, normalizeProvider} = require('./entityRef')

const KNOWN_PROVIDERS = new Set([
    'ANILIST',
    'TMDB',
    'OPENLIBRARY',
    'IGDB',
    'VNDB',
    'F95',
    'CURATED',
])

function defaultSourceForMediaType(mediaType = 'ANIME') {
    const normalizedType = normalizeDomain(mediaType)

    if (normalizedType === 'MOVIE' || normalizedType === 'TV') return 'TMDB'
    if (normalizedType === 'BOOK') return 'OPENLIBRARY'
    if (normalizedType === 'VN') return 'VNDB'
    if (normalizedType === 'GAME') return 'IGDB'
    return 'ANILIST'
}

function catalogProvider(value, fallback) {
    const normalized = value ? normalizeProvider(value) : null

    if (normalized && KNOWN_PROVIDERS.has(normalized)) {
        return normalized
    }

    return fallback
}

function canonicalMediaEntityRef(payload = {}, fallback = {}) {
    const mediaType = normalizeDomain(
        payload?.mediaType
        ?? payload?.domain
        ?? payload?.entityRef?.domain
        ?? fallback?.mediaType
        ?? fallback?.domain
        ?? 'ANIME'
    )
    const fallbackSource = normalizeProvider(
        fallback?.source
        ?? fallback?.provider
        ?? defaultSourceForMediaType(mediaType)
    )
    const source = catalogProvider(
        payload?.provider
        ?? payload?.entityRef?.provider
        ?? fallback?.provider
        ?? fallback?.entityRef?.provider
        ?? payload?.source
        ?? fallback?.source,
        fallbackSource
    )
    const externalId = normalizeExternalId(
        payload?.externalId
        ?? payload?.sourceId
        ?? payload?.mediaId
        ?? payload?.animeId
        ?? payload?.subjectId
        ?? payload?.id
        ?? payload?.entityRef?.externalId
        ?? fallback?.externalId
        ?? fallback?.sourceId
        ?? fallback?.id
    )

    return canonicalEntityRef({
        provider: source,
        domain: mediaType,
        externalId,
    })
}

function normalizeFavoriteMedia(media = {}) {
    const mediaType = normalizeDomain(media?.mediaType ?? media?.entityRef?.domain ?? 'ANIME')
    const source = catalogProvider(
        media?.provider
        ?? media?.entityRef?.provider
        ?? media?.source,
        defaultSourceForMediaType(mediaType)
    )
    const entityRef = canonicalMediaEntityRef(media, {
        mediaType,
        source,
        externalId: media?.id,
    })

    return {
        ...media,
        mediaType,
        source,
        sourceId: media?.sourceId ?? entityRef?.externalId ?? normalizeExternalId(media?.id) ?? undefined,
        entityRef: entityRef ?? media?.entityRef,
    }
}

function favoriteMediaKey(media = {}) {
    const normalized = normalizeFavoriteMedia(media)

    return normalized?.entityRef?.key
        ?? [
            normalized?.source ?? defaultSourceForMediaType(normalized?.mediaType),
            normalized?.mediaType ?? 'ANIME',
            normalizeExternalId(normalized?.id ?? normalized?.sourceId),
        ].filter(Boolean).join(':')
}

function sameFavoriteMedia(left = {}, right = {}) {
    const leftKey = favoriteMediaKey(left)
    const rightKey = favoriteMediaKey(right)

    if (leftKey && rightKey) {
        return leftKey === rightKey
    }

    return `${left?.mediaType ?? 'ANIME'}` === `${right?.mediaType ?? 'ANIME'}`
        && `${left?.id ?? left?.sourceId ?? ''}` === `${right?.id ?? right?.sourceId ?? ''}`
}

function mergeFavoriteMediaCollections(...collections) {
    const merged = []

    collections
        .flat()
        .filter(Boolean)
        .forEach((media) => {
            const normalized = normalizeFavoriteMedia(media)

            if (!merged.some((existing) => sameFavoriteMedia(existing, normalized))) {
                merged.push(normalized)
            }
        })

    return merged
}

module.exports = {
    canonicalMediaEntityRef,
    defaultSourceForMediaType,
    favoriteMediaKey,
    mergeFavoriteMediaCollections,
    normalizeFavoriteMedia,
    sameFavoriteMedia,
}
