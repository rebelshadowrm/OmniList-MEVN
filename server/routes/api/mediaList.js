const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const MediaListItemModel = require('../../models/mediaListItem')
const authenticateToken = require("../../security/authenticateToken");

const router = express.Router()

const defaultMediaType = 'ANIME'
const defaultSource = 'ANILIST'

function normalizeMediaType(mediaType) {
    return `${mediaType ?? defaultMediaType}`.toUpperCase()
}

function normalizeSource(source) {
    return `${source ?? defaultSource}`.toUpperCase()
}

function mediaIdFromBody(body) {
    return body?.mediaId ?? body?.animeId
}

function progressTotalFromBody(body) {
    return body?.progressTotal ?? body?.totalEpisodes
}

function mediaFindQuery({user, mediaId, mediaType, source}) {
    const normalizedType = normalizeMediaType(mediaType)
    const normalizedSource = normalizeSource(source)
    const numericMediaId = Number(mediaId)

    if (normalizedType === defaultMediaType && normalizedSource === defaultSource) {
        return {
            user,
            $or: [
                {mediaId: numericMediaId, mediaType: normalizedType, source: normalizedSource},
                {animeId: numericMediaId, mediaType: {$exists: false}},
                {animeId: numericMediaId, mediaType: normalizedType},
            ]
        }
    }

    return {
        user,
        mediaId: numericMediaId,
        mediaType: normalizedType,
        source: normalizedSource,
    }
}


// Get media list items by user id.
router.get('/:id', authenticateToken, async (req, res) => {
    if(req?.params?.id == 'undefined') res.sendStatus(400)
    const mediaType = req?.query?.mediaType
    const source = req?.query?.source
    if (!mediaType && !source) {
        res.send(await MediaListItemModel
            .where('user')
            .equals(req?.params?.id)
            .populate('user'))
        return
    }

    const query = {
        user: req?.params?.id,
        mediaType: normalizeMediaType(mediaType),
        source: normalizeSource(source),
    }

    if (query.mediaType === defaultMediaType && query.source === defaultSource) {
        res.send(await MediaListItemModel
            .find({
                user: req?.params?.id,
                $or: [
                    {mediaType: query.mediaType, source: query.source},
                    {mediaType: {$exists: false}},
                ]
            })
            .populate('user'))
    } else {
        res.send(await MediaListItemModel
            .find(query)
            .populate('user'))
    }
})

// Get media list item by user id, media type, and media id.
router.get('/:userId/:mediaType/:mediaId/', authenticateToken, async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        res.send(await MediaListItemModel
            .findOne(mediaFindQuery({
                user: req?.params?.userId,
                mediaId: req?.params?.mediaId,
                mediaType: req?.params?.mediaType,
                source: req?.query?.source,
            })))
    }
})

router.get('/:userId/:animeId/', authenticateToken, async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        res.send(await MediaListItemModel
            .findOne(mediaFindQuery({
                user: req?.params?.userId,
                mediaId: req?.params?.animeId,
                mediaType: defaultMediaType,
                source: defaultSource,
            })))
    }
})

// Add media list item.
router.post('/', authenticateToken, async (req, res) => {
    if(req?.body?.user == 'undefined') {
        res.sendStatus(400)
    } else {
        const mediaId = mediaIdFromBody(req?.body)
        const mediaType = normalizeMediaType(req?.body?.mediaType)
        const source = normalizeSource(req?.body?.source)
        if (mediaId == null) {
            return res.sendStatus(400)
        }
        const listItemExists = await MediaListItemModel
            .find(mediaFindQuery({
                user: req?.body?.user,
                mediaId,
                mediaType,
                source,
            }))
        if(listItemExists?.length < 1) {
            const mediaListItem = await MediaListItemModel.create({
                user: req?.body?.user,
                mediaId,
                mediaType,
                source,
                sourceId: req?.body?.sourceId ?? `${mediaId}`,
                animeId: req?.body?.animeId ?? (mediaType === defaultMediaType ? mediaId : undefined),
                title: req?.body?.title,
                progress: req?.body?.progress,
                progressTotal: progressTotalFromBody(req?.body),
                progressUnit: req?.body?.progressUnit,
                totalEpisodes: req?.body?.totalEpisodes ?? progressTotalFromBody(req?.body),
                rating: req?.body?.rating,
                image: req?.body?.image,
                format: req?.body?.format,
                genres: req?.body?.genres
            })
            if(mediaListItem) {
                res.status(201).send(await mediaListItem.populate('user'))
            } else {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(400)
        }
    }
})

// Update media list item.
router.put('/:userId/:mediaType/:mediaId', authenticateToken, async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        try {
            const mediaItem = await MediaListItemModel
                .findOne(mediaFindQuery({
                    user: req?.params?.userId,
                    mediaId: req?.params?.mediaId,
                    mediaType: req?.params?.mediaType,
                    source: req?.query?.source,
                }))

            if (!mediaItem) {
                return res.sendStatus(404)
            }

            //optional updates
            mediaItem.progress = req?.body?.progress ?? mediaItem.progress
            mediaItem.rating = req?.body?.rating ?? mediaItem.rating
            mediaItem.status = req?.body?.status ?? mediaItem.status

            //Very niche updates
            mediaItem.image = req?.body?.image ?? mediaItem.image
            mediaItem.totalEpisodes = req?.body?.totalEpisodes ?? mediaItem.totalEpisodes
            mediaItem.progressTotal = req?.body?.progressTotal ?? mediaItem.progressTotal
            mediaItem.progressUnit = req?.body?.progressUnit ?? mediaItem.progressUnit
            mediaItem.format = req?.body?.format ?? mediaItem.format
            mediaItem.genres = req?.body?.genres ?? mediaItem.genres

            const result = await mediaItem.save()
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

router.put('/:userId/:animeId', authenticateToken, async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        try {
            const mediaItem = await MediaListItemModel
                .findOne(mediaFindQuery({
                    user: req?.params?.userId,
                    mediaId: req?.params?.animeId,
                    mediaType: defaultMediaType,
                    source: defaultSource,
                }))

            if (!mediaItem) {
                return res.sendStatus(404)
            }

            mediaItem.progress = req?.body?.progress ?? mediaItem.progress
            mediaItem.rating = req?.body?.rating ?? mediaItem.rating
            mediaItem.status = req?.body?.status ?? mediaItem.status
            mediaItem.image = req?.body?.image ?? mediaItem.image
            mediaItem.totalEpisodes = req?.body?.totalEpisodes ?? mediaItem.totalEpisodes
            mediaItem.progressTotal = req?.body?.progressTotal ?? mediaItem.progressTotal
            mediaItem.progressUnit = req?.body?.progressUnit ?? mediaItem.progressUnit
            mediaItem.format = req?.body?.format ?? mediaItem.format
            mediaItem.genres = req?.body?.genres ?? mediaItem.genres

            const result = await mediaItem.save()
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

// Delete media list item.
router.delete('/:id', authenticateToken, async (req, res) => {
    if(req?.params?.userId == 'undefined') {
        res.sendStatus(400)
    } else {
        if(await MediaListItemModel.deleteOne({ _id: req.params.id })) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
})



module.exports = router
