const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const AnimeListItemModel = require('../../models/animeListItem')

const router = express.Router()


// Get Anime List Items by UserId
router.get('/:id', async (req, res) => {
    if(req?.params?.userId == 'undefined') res.sendStatus(400)
    res.send(await AnimeListItemModel
        .where('user')
        .equals(req?.params?.id)
        .populate('user'))
})

// Get Anime List Item by UserId then AnimeId
router.get('/:userId/:animeId/', async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        res.send(await AnimeListItemModel
            .findOne()
            .where('user')
            .equals(req?.params?.userId)
            .where('animeId')
            .equals(req?.params?.animeId))
    }
})

// Add Anime List Item
router.post('/', async (req, res) => {
    if(req?.body?.user == 'undefined') {
        res.sendStatus(400)
    } else {
        const listAnimeExist = await AnimeListItemModel
            .find({user: req?.body?.user, animeId: req?.body?.animeId})
        if(listAnimeExist?.length < 1) {
            const animeListItem = await AnimeListItemModel.create({
                user: req?.body?.user,
                animeId: req?.body?.animeId,
                title: req?.body?.title,
                progress: req?.body?.progress,
                totalEpisodes: req?.body?.totalEpisodes,
                rating: req?.body?.rating,
                image: req?.body?.image,
                format: req?.body?.format,
                genres: req?.body?.genres
            })
            if(animeListItem) {
                res.status(201).send(await animeListItem.populate('user'))
            } else {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(400)
        }
    }
})

// Update Anime List Item
router.put('/:userId/:animeId', async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        try {
            const anime = await AnimeListItemModel
                .findOne()
                .where('user')
                .equals(req?.params?.userId)
                .where('animeId')
                .equals(req?.params?.animeId)

            //optional updates
            anime.progress = req?.body?.progress ?? anime.progress
            anime.rating = req?.body?.rating ?? anime.rating
            anime.status = req?.body?.status ?? anime.status

            //Very niche updates
            anime.image = req?.body?.image ?? anime.image
            anime.totalEpisodes = req?.body?.totalEpisodes ?? anime.totalEpisodes
            anime.format = req?.body?.format ?? anime.format
            anime.genres = req?.body?.genres ?? anime.genres

            const result = await anime.save()
            if(result) {
                res.sendStatus(200)
            } else {
                res.sendStatus(400)
            }
        } catch(err) {
            console.log(err.message)
        }
    }

})

// Delete Anime List Item
router.delete('/:id', async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        if(await AnimeListItemModel.deleteOne({ _id: req.params.id })) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
})



module.exports = router
