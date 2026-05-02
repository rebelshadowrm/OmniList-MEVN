const express = require('express')
const {searchMovies, movieDetail, movieGenres, searchTv, tvDetail, tvGenres} = require('../../utils/tmdbProvider')
const {aniListDetail, aniListGenres, searchAniListMedia} = require('../../utils/anilistProvider')
const {bookDetail, bookGenres, searchBooks} = require('../../utils/openLibraryProvider')
const {normalizeDomain} = require('../../utils/entityRef')

const router = express.Router()

function domainFromRoute(value) {
    return normalizeDomain(value)
}

router.get('/:domain/search', async (req, res) => {
    try {
        const domain = domainFromRoute(req.params.domain)

        if (domain === 'ANIME' || domain === 'MANGA') {
            const data = await searchAniListMedia(domain, {
                search: req.query.search,
                genres: `${req.query.genre ?? ''}`.split(',').filter(Boolean),
                excludedGenres: `${req.query.exclude ?? ''}`.split(',').filter(Boolean),
                sort: req.query.sort,
                page: Number(req.query.page) || 1,
                perPage: Number(req.query.limit) || 20,
            })
            return res.send(data)
        }

        if (domain === 'MOVIE') {
            return res.send(await searchMovies({
                search: req.query.search,
                page: req.query.page,
                genres: req.query.genre,
                excludedGenres: req.query.exclude,
                sort: req.query.sort,
                year: req.query.year,
            }))
        }

        if (domain === 'TV') {
            return res.send(await searchTv({
                search: req.query.search,
                page: req.query.page,
                genres: req.query.genre,
                excludedGenres: req.query.exclude,
                sort: req.query.sort,
                year: req.query.year,
                includeAnime: req.query.includeAnime === 'true',
            }))
        }

        if (domain === 'BOOK') {
            return res.send(await searchBooks({
                search: req.query.search,
                genres: `${req.query.genre ?? ''}`.split(',').filter(Boolean),
                excludedGenres: `${req.query.exclude ?? ''}`.split(',').filter(Boolean),
                sort: req.query.sort,
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,
            }))
        }

        return res.status(400).send({message: `Unsupported catalog domain: ${domain}`})
    } catch (err) {
        return res.status(502).send({message: err.message})
    }
})

router.get('/:domain/genres', async (req, res) => {
    try {
        const domain = domainFromRoute(req.params.domain)

        if (domain === 'ANIME' || domain === 'MANGA') {
            return res.send(aniListGenres().map(name => ({name})))
        }

        if (domain === 'MOVIE') {
            return res.send(await movieGenres())
        }

        if (domain === 'TV') {
            return res.send(await tvGenres())
        }

        if (domain === 'BOOK') {
            return res.send(bookGenres().map(name => ({name})))
        }

        return res.send([])
    } catch (err) {
        return res.status(502).send({message: err.message})
    }
})

router.get('/:domain/:externalId/updates', async (req, res) => {
    try {
        const domain = domainFromRoute(req.params.domain)

        res.send({
            domain,
            externalId: `${req.params.externalId}`,
            status: 'source_unavailable',
            latestVersion: null,
            installedVersion: req.query.installedVersion ?? null,
        })
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/:domain/:externalId', async (req, res) => {
    try {
        const domain = domainFromRoute(req.params.domain)
        const externalId = `${req.params.externalId}`

        if (domain === 'ANIME' || domain === 'MANGA') {
            return res.send(await aniListDetail(domain, externalId))
        }

        if (domain === 'MOVIE') {
            return res.send(await movieDetail(externalId))
        }

        if (domain === 'TV') {
            return res.send(await tvDetail(externalId))
        }

        if (domain === 'BOOK') {
            return res.send(await bookDetail(externalId))
        }

        return res.status(400).send({message: `Unsupported catalog domain: ${domain}`})
    } catch (err) {
        return res.status(502).send({message: err.message})
    }
})

module.exports = router
