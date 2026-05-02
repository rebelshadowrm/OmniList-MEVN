const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
const ReviewModel = require('../../models/review')
const authenticateToken = require("../../security/authenticateToken");
const {entityRefFromPayload, normalizeDomain, normalizeExternalId, normalizeProvider} = require('../../utils/entityRef')
const {defaultSourceForMediaType} = require('../../utils/catalogEntities')
const router = express.Router()

function normalizeMediaType(mediaType) {
    return normalizeDomain(mediaType ?? 'ANIME')
}

function normalizeSource(source) {
    return normalizeProvider(source ?? 'ANILIST')
}

function mediaThreadQuery(mediaType, subjectId) {
    const normalizedType = normalizeMediaType(mediaType)
    const normalizedExternalId = normalizeExternalId(subjectId)
    const numericSubjectId = Number(subjectId)
    const entityRef = entityRefFromPayload({
        mediaType: normalizedType,
        source: defaultSourceForMediaType(normalizedType),
        externalId: normalizedExternalId,
    })
    const legacyConditions = Number.isFinite(numericSubjectId)
        ? [
            {
                subjectId: numericSubjectId,
                mediaType: normalizedType,
            },
            ...(normalizedType === 'ANIME'
                ? [{
                    subjectId: numericSubjectId,
                    mediaType: {$exists: false},
                }]
                : []),
        ]
        : []

    if (entityRef?.key) {
        return {
            $or: [
                {'entityRef.key': entityRef.key},
                {
                    sourceId: entityRef.externalId,
                    mediaType: entityRef.domain,
                    source: entityRef.provider,
                },
                ...legacyConditions,
            ],
        }
    }

    if (normalizedType === 'ANIME') {
        return {
            subjectId: numericSubjectId,
            $or: [
                {mediaType: normalizedType},
                {mediaType: {$exists: false}},
            ],
        }
    }

    return {
        subjectId: numericSubjectId,
        mediaType: normalizedType,
    }
}


// Get Reviews
router.get('/', authenticateToken, async (req, res) => {
    res.send(await ReviewModel.find()
        .populate('user')
        .populate('comments.comment.user'))
})

// Legacy anime route; prefer /media/:mediaType/:id.
router.get('/anime/:id', async (req, res) => {
    res.send(await ReviewModel
        .find(mediaThreadQuery('ANIME', req?.params?.id))
        .populate('user')
        .populate('comments.comment.user'))
})

// Get reviews by media type
router.get('/media/:mediaType/:id', async (req, res) => {
    res.send(await ReviewModel
        .find(mediaThreadQuery(req?.params?.mediaType, req?.params?.id))
        .populate('user')
        .populate('comments.comment.user'))
})

// Get reviews by user
router.get('/user/:id', authenticateToken, async (req, res) => {
    res.send(await ReviewModel
        .where('user')
        .equals(req?.params?.id)
        .populate('user')
        .populate('comments.comment.user'))
})

router.get('/:id', async (req, res) => {
    res.send(await ReviewModel.findById(req.params.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Add review
router.post('/', authenticateToken, async (req, res) => {
    const entityRef = entityRefFromPayload(req.body, {
        source: req.body.source ?? req.body.entityRef?.provider ?? defaultSourceForMediaType(req.body.mediaType),
        mediaType: req.body.mediaType ?? req.body.entityRef?.domain,
        externalId: req.body.subjectId ?? req.body.sourceId,
    })
    const mediaType = normalizeMediaType(req.body.mediaType ?? entityRef?.domain)
    const source = normalizeSource(req.body.source ?? entityRef?.provider ?? defaultSourceForMediaType(mediaType))
    const subjectId = Number(req.body.subjectId ?? entityRef?.externalId)
    let review = await ReviewModel.create({
        user: req.body.user,
        title: req.body.title,
        subject: req.body.subject,
        subjectId: Number.isFinite(subjectId) ? subjectId : undefined,
        mediaType,
        source,
        sourceId: req.body.sourceId ?? entityRef?.externalId ?? `${req.body.subjectId ?? ''}`,
        entityRef,
        body: req.body.body,
        comments: req.body.comments
    })
    if(review) {
        review = await review.populate('user')
        review = await review.populate('comments.comment.user')
        res.status(201).send(review)
    } else {
        res.sendStatus(400)
    }
})

// Update Review
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.params.id})
        review.title = req?.body?.title ?? review.title
        review.body = req?.body?.body ?? review.body
        review.flagged = req?.body?.flagged ?? review.flagged
        review.suspended = req?.body?.suspended ?? review.suspended
        const result = await review.save()
        if(result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Delete Review
router.delete('/:id', authenticateToken, async (req, res) => {
    if(await ReviewModel.deleteOne({ _id: req.params.id })) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

// Delete Comment
router.delete('/comment/delete', authenticateToken, async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.body.reviewId})
        let comments = review.comments
        comments = comments.filter( ({_id}) => _id != req.body.commentId )
        review.comments = comments
        const result = await review.save()
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Add Comment
router.post('/comment/add', authenticateToken, async (req, res) => {
    try {
        let review = await ReviewModel.findOne({_id: req.body.reviewId})
        const comments = review.comments
        const comment = {
            comment: {
                user: new mongodb.ObjectId(req.body.userId),
                comment: req.body.comment
            }
        }
        comments.push(comment)
        const result = await review.save()
        if(result) {
            review = await review.populate('user')
            review = await review.populate('comments.comment.user')
            res.status(201).send(review)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Update Comment
router.put('/comment/update', authenticateToken, async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.body.reviewId})
        const comments = review.comments
        const comment = comments.find( ({_id}) => _id == req.body.commentId )
        comment.comment.comment = req.body.comment ?? comment.comment.comment
        comment.comment.suspended = req?.body?.suspended ?? comment.comment.suspended
        comment.comment.flagged = req?.body?.flagged ?? comment.comment.flagged
        review.comments = comments
        const result = await review.save()
        if(result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

module.exports = router
