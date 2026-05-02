const test = require('node:test')
const assert = require('node:assert/strict')

const {
    canonicalMediaEntityRef,
    favoriteMediaKey,
    mergeFavoriteMediaCollections,
    normalizeFavoriteMedia,
} = require('../utils/catalogEntities')

test('canonicalMediaEntityRef derives provider/domain/id for books', () => {
    const entityRef = canonicalMediaEntityRef({
        mediaType: 'book',
        id: 'OL15626917W',
    })

    assert.deepEqual(entityRef, {
        provider: 'OPENLIBRARY',
        domain: 'BOOK',
        externalId: 'OL15626917W',
        key: 'OPENLIBRARY:BOOK:OL15626917W',
    })
})

test('normalizeFavoriteMedia adds canonical entityRef to legacy anime favorite', () => {
    const favorite = normalizeFavoriteMedia({
        id: 123,
        mediaType: 'ANIME',
        title: {
            english: 'Example',
        },
    })

    assert.equal(favorite.source, 'ANILIST')
    assert.equal(favorite.sourceId, '123')
    assert.equal(favorite.entityRef.key, 'ANILIST:ANIME:123')
})

test('normalizeFavoriteMedia ignores AniList source-material values when deriving provider', () => {
    const favorite = normalizeFavoriteMedia({
        id: 16498,
        mediaType: 'ANIME',
        source: 'MANGA',
        title: {
            english: 'Attack on Titan',
        },
    })

    assert.equal(favorite.source, 'ANILIST')
    assert.equal(favorite.entityRef.key, 'ANILIST:ANIME:16498')
})

test('mergeFavoriteMediaCollections de-duplicates legacy and canonical favorites', () => {
    const merged = mergeFavoriteMediaCollections(
        [{
            id: 123,
            mediaType: 'ANIME',
        }],
        [{
            id: 123,
            mediaType: 'ANIME',
            source: 'ANILIST',
            entityRef: {
                provider: 'ANILIST',
                domain: 'ANIME',
                externalId: '123',
                key: 'ANILIST:ANIME:123',
            },
        }]
    )

    assert.equal(merged.length, 1)
    assert.equal(favoriteMediaKey(merged[0]), 'ANILIST:ANIME:123')
})
