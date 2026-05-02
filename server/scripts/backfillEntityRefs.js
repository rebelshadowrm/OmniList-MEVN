const database = require('../database')
const MediaListItemModel = require('../models/mediaListItem')
const ReviewModel = require('../models/review')
const DiscussionModel = require('../models/discussion')
const UserModel = require('../models/user/user')
const {
    canonicalMediaEntityRef,
    defaultSourceForMediaType,
    favoriteMediaKey,
    mergeFavoriteMediaCollections,
    normalizeFavoriteMedia,
} = require('../utils/catalogEntities')
const {normalizeDomain, normalizeExternalId, normalizeProvider} = require('../utils/entityRef')

const APPLY = process.argv.includes('--apply')

function valuesEqual(left, right) {
    return JSON.stringify(left) === JSON.stringify(right)
}

function comparableFavoriteEntry(entry = {}, field) {
    const media = entry?.[field] ?? {}
    const normalized = normalizeFavoriteMedia(media)

    return {
        key: favoriteMediaKey(normalized),
        source: normalized?.source ?? null,
        provider: normalized?.entityRef?.provider ?? null,
        domain: normalized?.entityRef?.domain ?? normalized?.mediaType ?? null,
        externalId: normalized?.entityRef?.externalId ?? normalized?.sourceId ?? normalized?.id ?? null,
    }
}

function favoriteCollectionsEqual(current = [], next = [], field) {
    return valuesEqual(
        current.map((entry) => comparableFavoriteEntry(entry, field)),
        next.map((entry) => comparableFavoriteEntry(entry, field))
    )
}

function backfillListItem(item) {
    const mediaType = normalizeDomain(item?.mediaType ?? 'ANIME')
    const source = normalizeProvider(item?.source ?? defaultSourceForMediaType(mediaType))
    const entityRef = canonicalMediaEntityRef(item, {
        mediaType,
        source,
    })
    const patch = {}

    if (item.mediaType !== mediaType) patch.mediaType = mediaType
    if (item.source !== source) patch.source = source
    if ((item.externalId ?? null) !== (entityRef?.externalId ?? null)) patch.externalId = entityRef?.externalId
    if ((item.sourceId ?? null) !== (item.sourceId ?? entityRef?.externalId ?? null)) {
        patch.sourceId = item.sourceId ?? entityRef?.externalId
    }
    if (!valuesEqual(item.entityRef ?? null, entityRef ?? null)) patch.entityRef = entityRef

    return patch
}

function backfillThread(thread) {
    const mediaType = normalizeDomain(thread?.mediaType ?? 'ANIME')
    const source = normalizeProvider(thread?.source ?? defaultSourceForMediaType(mediaType))
    const entityRef = canonicalMediaEntityRef(thread, {
        mediaType,
        source,
    })
    const subjectId = Number(thread?.subjectId ?? entityRef?.externalId)
    const patch = {}

    if (thread.mediaType !== mediaType) patch.mediaType = mediaType
    if (thread.source !== source) patch.source = source
    if ((thread.sourceId ?? null) !== (thread.sourceId ?? entityRef?.externalId ?? null)) {
        patch.sourceId = thread.sourceId ?? entityRef?.externalId
    }
    if (!valuesEqual(thread.entityRef ?? null, entityRef ?? null)) patch.entityRef = entityRef
    if (Number.isFinite(subjectId) && thread.subjectId !== subjectId) patch.subjectId = subjectId

    return patch
}

function backfillFavorites(user) {
    const favorites = user?.userProfile?.favorites ?? {}
    const mediaFavorites = favorites?.mediaFavorites?.map(({media}) => media).filter(Boolean) ?? []
    const animeFavorites = favorites?.animeFavorites?.map(({anime}) => anime).filter(Boolean) ?? []
    const mergedFavorites = mergeFavoriteMediaCollections(mediaFavorites, animeFavorites)
    const normalizedAnimeFavorites = animeFavorites.map((anime) => normalizeFavoriteMedia({
        ...anime,
        mediaType: anime?.mediaType ?? 'ANIME',
        source: anime?.source ?? 'ANILIST',
    }))

    return {
        mediaFavorites: mergedFavorites.map((media) => ({media})),
        animeFavorites: normalizedAnimeFavorites.map((anime) => ({anime})),
    }
}

async function applyModelBackfill(model, label, backfill) {
    const documents = await model.find()
    let changed = 0

    for (const document of documents) {
        const patch = backfill(document)

        if (!Object.keys(patch).length) {
            continue
        }

        changed += 1

        if (APPLY) {
            Object.entries(patch).forEach(([key, value]) => {
                document.set(key, value)
            })
            await document.save()
        }
    }

    console.log(`${label}: ${changed} document(s) ${APPLY ? 'updated' : 'would update'}`)
}

async function applyFavoritesBackfill() {
    const users = await UserModel.find()
    let changed = 0

    for (const user of users) {
        const nextFavorites = backfillFavorites(user)
        const currentFavorites = user?.userProfile?.favorites ?? {}

        if (favoriteCollectionsEqual(currentFavorites.mediaFavorites ?? [], nextFavorites.mediaFavorites, 'media')
            && favoriteCollectionsEqual(currentFavorites.animeFavorites ?? [], nextFavorites.animeFavorites, 'anime')) {
            continue
        }

        changed += 1

        if (APPLY) {
            user.set('userProfile.favorites.mediaFavorites', nextFavorites.mediaFavorites)
            user.set('userProfile.favorites.animeFavorites', nextFavorites.animeFavorites)
            user.markModified('userProfile')
            await user.save()
        }
    }

    console.log(`favorites: ${changed} user(s) ${APPLY ? 'updated' : 'would update'}`)
}

async function main() {
    await database.connect()

    try {
        await applyModelBackfill(MediaListItemModel, 'media-list', backfillListItem)
        await applyModelBackfill(ReviewModel, 'reviews', backfillThread)
        await applyModelBackfill(DiscussionModel, 'discussions', backfillThread)
        await applyFavoritesBackfill()
    } finally {
        await database.disconnect()
    }
}

main().catch((err) => {
    console.error('EntityRef backfill failed:', err.message)
    process.exitCode = 1
})
