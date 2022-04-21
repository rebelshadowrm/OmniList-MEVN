const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const DiscussionModel = require('../../models/discussion')

const router = express.Router()


// Get Discussions
router.get('/', async (req, res) => {
    res.send(await DiscussionModel.find()
        .populate('user')
        .populate('comments.comment.user'))
})

router.get('/:id', async (req, res) => {
    res.send(await DiscussionModel.findById(req.params.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Add Discussion
router.post('/', async (req, res) => {
    let discussion = await DiscussionModel.create({
        user: req.body.user,
        title: req.body.title,
        subject: req.body.subject,
        subjectId: req.body.subjectId,
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
router.put('/:id', async (req, res) => {
    try {
        const discussion = await DiscussionModel.findOne({_id: req.params.id})
        discussion.title = req?.body?.title ?? discussion.title
        discussion.body = req?.body?.body ?? discussion.body
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
router.delete('/:id', async (req, res) => {
    if(await DiscussionModel.deleteOne({ _id: req.params.id })) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

// Delete Comment
router.delete('/comment/delete', async (req, res) => {
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
router.post('/comment/add', async (req, res) => {
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
router.put('/comment/update', async (req, res) => {
    try {
        const discussion = await DiscussionModel.findOne({_id: req.body.discussionId})
        const comments = discussion.comments
        const comment = comments.find( ({_id}) => _id == req.body.commentId )
        comment.comment.comment = req.body.comment
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
