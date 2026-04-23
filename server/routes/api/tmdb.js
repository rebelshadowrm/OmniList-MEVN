const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const {
    searchMovies,
    movieGenres,
    movieDetail,
    searchTv,
    tvGenres,
    tvDetail,
} = require('../../utils/tmdbProvider')

const router = express.Router()

router.get('/movies/search', async (req, res) => {
    try {
        res.send(await searchMovies({
            search: req.query.search,
            page: req.query.page,
            genres: req.query.genre,
            excludedGenres: req.query.exclude,
            sort: req.query.sort,
            year: req.query.year,
        }))
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/movies/genres', async (req, res) => {
    try {
        res.send(await movieGenres())
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/movies/:id', async (req, res) => {
    try {
        res.send(await movieDetail(req.params.id))
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/tv/search', async (req, res) => {
    try {
        res.send(await searchTv({
            search: req.query.search,
            page: req.query.page,
            genres: req.query.genre,
            excludedGenres: req.query.exclude,
            sort: req.query.sort,
            year: req.query.year,
            includeAnime: req.query.includeAnime === 'true',
        }))
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/tv/genres', async (req, res) => {
    try {
        res.send(await tvGenres())
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

router.get('/tv/:id', async (req, res) => {
    try {
        res.send(await tvDetail(req.params.id))
    } catch (err) {
        res.status(502).send({message: err.message})
    }
})

module.exports = router
