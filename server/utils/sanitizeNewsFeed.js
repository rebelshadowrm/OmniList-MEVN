const HTML_ENTITIES = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
}

function decodeHtmlEntities(value) {
    return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, body) => {
        if (body[0] === '#') {
            const isHex = body[1]?.toLowerCase() === 'x'
            const codePoint = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10)

            try {
                return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity
            } catch {
                return entity
            }
        }

        return HTML_ENTITIES[body.toLowerCase()] ?? entity
    })
}

function stripHtmlTags(value) {
    return value
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<\/?[a-z][\w:-]*(?:\s+[^<>]*)?\/?>/gi, ' ')
}

function sanitizeText(value) {
    if (typeof value !== 'string') {
        return value
    }

    let sanitized = value

    for (let i = 0; i < 3; i += 1) {
        const next = stripHtmlTags(decodeHtmlEntities(sanitized))

        if (next === sanitized) {
            break
        }

        sanitized = next
    }

    return sanitized.replace(/\s+/g, ' ').trim()
}

function sanitizeTextValue(value) {
    if (Array.isArray(value)) {
        return value.map(sanitizeTextValue)
    }

    if (value && typeof value === 'object') {
        const sanitized = {...value}

        if (Object.prototype.hasOwnProperty.call(sanitized, '_')) {
            sanitized._ = sanitizeText(sanitized._)
        }

        return sanitized
    }

    return sanitizeText(value)
}

function sanitizeCategories(categories) {
    if (!Array.isArray(categories)) {
        return categories
    }

    return categories.map(category => {
        if (!category || typeof category !== 'object') {
            return sanitizeText(category)
        }

        const sanitized = {...category}

        if (sanitized.$ && typeof sanitized.$ === 'object') {
            sanitized.$ = {
                ...sanitized.$,
                label: sanitizeText(sanitized.$.label),
                term: sanitizeText(sanitized.$.term),
            }
        }

        return sanitized
    })
}

function sanitizeEntry(entry) {
    if (!entry || typeof entry !== 'object') {
        return entry
    }

    return {
        ...entry,
        category: sanitizeCategories(entry.category),
        content: sanitizeTextValue(entry.content),
        summary: sanitizeTextValue(entry.summary),
        title: sanitizeTextValue(entry.title),
    }
}

function sanitizeNewsFeed(feed) {
    if (!feed || typeof feed !== 'object') {
        return feed
    }

    return {
        ...feed,
        entry: Array.isArray(feed.entry) ? feed.entry.map(sanitizeEntry) : feed.entry,
    }
}

module.exports = {
    sanitizeNewsFeed,
    sanitizeText,
}
