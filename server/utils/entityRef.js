const DOMAIN_ALIASES = {
    ANIME: 'ANIME',
    MANGA: 'MANGA',
    MOVIE: 'MOVIE',
    MOVIES: 'MOVIE',
    TV: 'TV',
    BOOK: 'BOOK',
    BOOKS: 'BOOK',
    GAME: 'GAME',
    GAMES: 'GAME',
    VN: 'VN',
    AVN: 'AVN',
}

function normalizeProvider(provider = 'ANILIST') {
    return `${provider ?? 'ANILIST'}`.trim().toUpperCase()
}

function normalizeDomain(domain = 'ANIME') {
    const normalized = `${domain ?? 'ANIME'}`.trim().toUpperCase()

    return DOMAIN_ALIASES[normalized] ?? normalized
}

function normalizeExternalId(externalId) {
    if (externalId === undefined || externalId === null || externalId === '') {
        return null
    }

    return `${externalId}`.trim()
}

function entityRefKey({provider, domain, externalId}) {
    const normalizedExternalId = normalizeExternalId(externalId)

    if (!normalizedExternalId) {
        return null
    }

    return `${normalizeProvider(provider)}:${normalizeDomain(domain)}:${normalizedExternalId}`
}

function canonicalEntityRef({provider, domain, externalId}) {
    const normalizedExternalId = normalizeExternalId(externalId)

    if (!normalizedExternalId) {
        return null
    }

    const normalizedProvider = normalizeProvider(provider)
    const normalizedDomain = normalizeDomain(domain)

    return {
        provider: normalizedProvider,
        domain: normalizedDomain,
        externalId: normalizedExternalId,
        key: `${normalizedProvider}:${normalizedDomain}:${normalizedExternalId}`,
    }
}

function entityRefFromPayload(payload = {}, fallback = {}) {
    if (payload?.entityRef?.key && payload?.entityRef?.externalId) {
        return canonicalEntityRef(payload.entityRef)
    }

    const provider = payload?.provider
        ?? payload?.source
        ?? fallback?.provider
        ?? fallback?.source
        ?? 'ANILIST'
    const domain = payload?.domain
        ?? payload?.mediaType
        ?? fallback?.domain
        ?? fallback?.mediaType
        ?? 'ANIME'
    const externalId = payload?.externalId
        ?? payload?.sourceId
        ?? payload?.mediaId
        ?? payload?.animeId
        ?? payload?.subjectId
        ?? fallback?.externalId
        ?? fallback?.sourceId
        ?? fallback?.mediaId
        ?? fallback?.subjectId

    return canonicalEntityRef({
        provider,
        domain,
        externalId,
    })
}

function entityRefQuery(entityRef) {
    if (!entityRef?.key) {
        return null
    }

    return {'entityRef.key': entityRef.key}
}

module.exports = {
    canonicalEntityRef,
    entityRefFromPayload,
    entityRefKey,
    entityRefQuery,
    normalizeDomain,
    normalizeExternalId,
    normalizeProvider,
}
