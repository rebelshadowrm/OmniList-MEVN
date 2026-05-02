const test = require('node:test')
const assert = require('node:assert/strict')
const {
    bookSearchPath,
    normalizeBookSummary,
    normalizeOpenLibrarySort,
    selectedRating,
} = require('../utils/openLibraryProvider')

test('Open Library provider rating becomes normalized averageScore', () => {
    const book = normalizeBookSummary({
        key: '/works/OL1W',
        title: 'Rated Book',
        ratings_average: 4.5,
        ratings_count: 12,
    })

    assert.equal(book.averageScore, 90)
    assert.equal(book.rating.source, 'OPENLIBRARY')
    assert.equal(book.providerRating.average, 4.5)
    assert.equal(book.providerRating.count, 12)
})

test('missing provider and community rating returns no score', () => {
    const book = normalizeBookSummary({
        key: '/works/OL2W',
        title: 'Unrated Book',
    })

    assert.equal(book.averageScore, null)
    assert.equal(book.rating.source, 'NONE')
})

test('community rating overrides provider rating', () => {
    const book = normalizeBookSummary({
        key: '/works/OL3W',
        title: 'Community Rated Book',
        ratings_average: 4.8,
        ratings_count: 25,
    }, {
        average: 8.2,
        count: 3,
        scale: 10,
        source: 'OMNILIST',
    })

    assert.equal(book.averageScore, 82)
    assert.equal(book.rating.source, 'OMNILIST')
    assert.equal(book.communityRating.count, 3)
})

test('selectedRating falls back to Open Library when no community rating exists', () => {
    const rating = selectedRating({
        communityRating: {average: null, count: 0, scale: 10, source: 'OMNILIST'},
        providerRating: {average: 4.1, count: 9, scale: 5, source: 'OPENLIBRARY'},
    })

    assert.equal(rating.source, 'OPENLIBRARY')
})

test('book sort normalization maps default and invalid sorts to trending', () => {
    assert.equal(normalizeOpenLibrarySort(undefined), 'trending')
    assert.equal(normalizeOpenLibrarySort('not-real'), 'trending')
})

test('relevance omits Open Library sort parameter', () => {
    const path = bookSearchPath({search: 'dune', sort: 'relevance'})
    const url = new URL(`https://openlibrary.org${path}`)

    assert.equal(url.searchParams.get('sort'), null)
})

test('rating passes rating sort to Open Library', () => {
    const path = bookSearchPath({sort: 'rating'})
    const url = new URL(`https://openlibrary.org${path}`)

    assert.equal(url.searchParams.get('sort'), 'rating')
})

test('search with relevance keeps relevance behavior', () => {
    const path = bookSearchPath({search: 'left hand of darkness', sort: 'relevance'})
    const url = new URL(`https://openlibrary.org${path}`)

    assert.equal(url.searchParams.get('q'), 'left hand of darkness')
    assert.equal(url.searchParams.get('sort'), null)
})
