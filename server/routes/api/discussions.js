const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
const DiscussionModel = require('../../models/discussion')
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


// Get Discussions
router.get('/', authenticateToken, async (req, res) => {
    res.send(await DiscussionModel.find()
        .populate('user')
        .populate('comments.comment.user'))
})

// Legacy anime route; prefer /media/:mediaType/:id.
router.get('/anime/:id', async (req, res) => {
    res.send(await DiscussionModel
        .find(mediaThreadQuery('ANIME', req?.params?.id))
        .populate('user')
        .populate('comments.comment.user'))
})

// Get discussion by media type
router.get('/media/:mediaType/:id', async (req, res) => {
    res.send(await DiscussionModel
        .find(mediaThreadQuery(req?.params?.mediaType, req?.params?.id))
        .populate('user')
        .populate('comments.comment.user'))
})

// Get discussion by user
router.get('/user/:id', authenticateToken, async (req, res) => {
    res.send(await DiscussionModel
        .where('user')
        .equals(req?.params?.id)
        .populate('user')
        .populate('comments.comment.user'))
})

router.get('/:id', async (req, res) => {
    res.send(await DiscussionModel.findById(req.params.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Add Discussion
router.post('/', authenticateToken, async (req, res) => {
    const entityRef = entityRefFromPayload(req.body, {
        source: req.body.source ?? req.body.entityRef?.provider ?? defaultSourceForMediaType(req.body.mediaType),
        mediaType: req.body.mediaType ?? req.body.entityRef?.domain,
        externalId: req.body.subjectId ?? req.body.sourceId,
    })
    const mediaType = normalizeMediaType(req.body.mediaType ?? entityRef?.domain)
    const source = normalizeSource(req.body.source ?? entityRef?.provider ?? defaultSourceForMediaType(mediaType))
    const subjectId = Number(req.body.subjectId ?? entityRef?.externalId)
    let discussion = await DiscussionModel.create({
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
    if(discussion) {
        discussion = await discussion.populate('user')
        discussion = await discussion.populate('comments.comment.user')
        res.status(201).send(discussion)
    } else {
        res.sendStatus(400)
    }
})

// Update Discussion
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const discussion = await DiscussionModel.findOne({_id: req.params.id})
        discussion.title = req?.body?.title ?? discussion.title
        discussion.body = req?.body?.body ?? discussion.body
        discussion.flagged = req?.body?.flagged ?? discussion.flagged
        discussion.suspended = req?.body?.suspended ?? discussion.suspended

        const result = await discussion.save()
        if(result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Delete Discussion
router.delete('/:id', authenticateToken, async (req, res) => {
    if(await DiscussionModel.deleteOne({ _id: req.params.id })) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

// Delete Comment
router.delete('/comment/delete', authenticateToken, async (req, res) => {
    try {
        const discussion = await DiscussionModel.findOne({_id: req.body.discussionId})
        let comments = discussion.comments
        comments = comments.filter( ({_id}) => _id != req.body.commentId )
        discussion.comments = comments
        const result = await discussion.save()
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
        let discussion = await DiscussionModel.findOne({_id: req.body.discussionId})
        const comments = discussion.comments
        const comment = {
            comment: {
                user: new mongodb.ObjectId(req.body.userId),
                comment: req.body.comment
            }
        }
        comments.push(comment)
        const result = await discussion.save()
        if(result) {
            discussion = await discussion.populate('user')
            discussion = await discussion.populate('comments.comment.user')
            res.status(201).send(discussion)
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
        const discussion = await DiscussionModel.findOne({_id: req.body.discussionId})
        const comments = discussion.comments
        const comment = comments.find( ({_id}) => _id == req.body.commentId )
        comment.comment.comment = req?.body?.comment ?? comment.comment.comment
        comment.comment.suspended = req?.body?.suspended ?? comment.comment.suspended
        comment.comment.flagged = req?.body?.flagged ?? comment.comment.flagged
        discussion.comments = comments
        const result = await discussion.save()
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
